from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
import joblib
import pandas as pd
import os
from config import Config
from collections import defaultdict
import numpy as np
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CourseRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=5000,
            ngram_range=(1, 3)
        )
        self.kmeans = None
        self.courses_df = None
        self.is_trained = False
        self.category_to_cluster_map = defaultdict(list)

    def train(self, courses_df):
        """Train the recommender system"""
        try:
            self.courses_df = courses_df.copy()
            self.courses_df['text'] = (
                self.courses_df['title'].str.lower() + " " +
                self.courses_df['category_course'].str.lower() + " " +
                self.courses_df['description'].fillna('').str.lower()
            )
            
            self.course_vectors = self.vectorizer.fit_transform(self.courses_df['text'])
            
            n_clusters = min(
                Config.CLUSTERS,
                max(len(self.courses_df['category_course'].unique()), 
                    len(self.courses_df) // 2)
            )
            
            self.kmeans = KMeans(
                n_clusters=n_clusters,
                random_state=42,
                n_init='auto'
            )
            self.courses_df['cluster'] = self.kmeans.fit_predict(self.course_vectors)
            self._build_category_cluster_mapping()
            self.is_trained = True
            self._save_model()
            logger.info("Training completed successfully")
        except Exception as e:
            logger.error(f"Training failed: {str(e)}")
            raise

    def _build_category_cluster_mapping(self):
        """Build mapping between categories and clusters"""
        self.category_to_cluster_map = defaultdict(list)
        for category in self.courses_df['category_course'].unique():
            category_courses = self.courses_df[self.courses_df['category_course'] == category]
            if len(category_courses) > 0:
                cluster_counts = category_courses['cluster'].value_counts()
                self.category_to_cluster_map[category] = cluster_counts.index.tolist()[:3]
        logger.debug(f"Cluster mapping: {dict(self.category_to_cluster_map)}")

    def _save_model(self):
        """Save the trained model"""
        try:
            model_data = {
                'vectorizer': self.vectorizer,
                'kmeans': self.kmeans,
                'courses_df': self.courses_df,
                'category_to_cluster_map': dict(self.category_to_cluster_map),
            }
            os.makedirs(os.path.dirname(Config.MODEL_PATH), exist_ok=True)
            joblib.dump(model_data, Config.MODEL_PATH)
            logger.info(f"Model saved to {Config.MODEL_PATH}")
        except Exception as e:
            logger.error(f"Failed to save model: {str(e)}")
            raise

    @classmethod
    def load(cls):
        """Load a trained model"""
        if os.path.exists(Config.MODEL_PATH):
            try:
                model_data = joblib.load(Config.MODEL_PATH)
                recommender = cls()
                recommender.vectorizer = model_data['vectorizer']
                recommender.kmeans = model_data['kmeans']
                recommender.courses_df = model_data['courses_df']
                recommender.category_to_cluster_map = defaultdict(
                    list, 
                    model_data['category_to_cluster_map']
                )
                recommender.is_trained = True
                logger.info("Model loaded successfully")
                return recommender
            except Exception as e:
                logger.error(f"Failed to load model: {str(e)}")
                return cls()
        return cls()

    def recommend_for_student(self, student_enrollments):
        """Generate recommendations for a student"""
        if not self.is_trained:
            raise ValueError("Recommender not trained")

        enrolled_categories = student_enrollments['category_course'].unique()
        enrolled_ids = student_enrollments['id'].tolist()
        recommendations = []

        for category in enrolled_categories:
            candidates = self.courses_df[
                (self.courses_df['category_course'] == category) &
                (~self.courses_df['id'].isin(enrolled_ids))
            ]
            
            if len(candidates) == 0:
                continue
                
            enrolled_text = student_enrollments[
                student_enrollments['category_course'] == category
            ].apply(lambda x: f"{x['title']} {x['description'] or ''}", axis=1)
            
            candidate_text = candidates.apply(
                lambda x: f"{x['title']} {x['description'] or ''}", axis=1)
            
            similarity = cosine_similarity(
                self.vectorizer.transform(candidate_text),
                self.vectorizer.transform(enrolled_text)
            ).mean(axis=1)
            
            candidates = candidates.copy()
            candidates['similarity'] = similarity
            
            # Get recommendations from different clusters
            target_clusters = self.category_to_cluster_map.get(category, [])
            for cluster_id in target_clusters:
                cluster_courses = candidates[candidates['cluster'] == cluster_id]
                if len(cluster_courses) > 0:
                    top_courses = cluster_courses.nlargest(2, 'similarity')
                    recommendations.extend(top_courses.to_dict('records'))
            
            # Add diverse recommendations
            remaining = candidates[
                ~candidates.index.isin([r['id'] for r in recommendations if 'id' in r])
            ]
            if len(remaining) > 0:
                diverse_recs = remaining.sample(min(3, len(remaining)))
                recommendations.extend(diverse_recs.to_dict('records'))

        if recommendations:
            recs_df = pd.DataFrame(recommendations).drop_duplicates('id')
            return recs_df.sort_values(
                by=['similarity', 'rating'], 
                ascending=[False, False]
            ).head(Config.MAX_RECOMMENDATIONS)
        
        # Fallback to highest rated courses
        return self.courses_df[
            (~self.courses_df['id'].isin(enrolled_ids))
        ].nlargest(Config.MAX_RECOMMENDATIONS, 'rating')