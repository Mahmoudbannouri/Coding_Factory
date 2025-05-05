import joblib
import pandas as pd
import numpy as np
from collections import defaultdict
import logging
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
from config import Config
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CourseRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=5000,
            ngram_range=(1, 2)
        )
        self.kmeans = None
        self.courses_df = None
        self.course_vectors = None
        self.is_trained = False

    def train(self, courses_df):
        """Train the recommender system"""
        try:
            self.courses_df = courses_df.copy()

            if 'skills' not in self.courses_df.columns:
                self.courses_df['skills'] = self.courses_df['category_course']

            self.courses_df['text'] = (
                self.courses_df['title'].str.lower() + " " +
                self.courses_df['category_course'].str.lower() + " " +
                self.courses_df['description'].fillna('').str.lower() + " " +
                self.courses_df['skills'].fillna('').str.lower()
            )

            self.course_vectors = self.vectorizer.fit_transform(self.courses_df['text'])

            n_clusters = min(
                Config.CLUSTERS,
                max(len(self.courses_df['category_course'].unique()), len(self.courses_df) // 2)
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
        """Build a mapping from category to cluster"""
        self.category_to_cluster_map = defaultdict(list)
        for category in self.courses_df['category_course'].unique():
            category_courses = self.courses_df[self.courses_df['category_course'] == category]
            if len(category_courses) > 0:
                cluster_counts = category_courses['cluster'].value_counts()
                self.category_to_cluster_map[category] = cluster_counts.index.tolist()[:3]

    def _save_model(self):
        """Save the trained model components to disk"""
        model_data = {
            'vectorizer': self.vectorizer,
            'kmeans': self.kmeans,
            'courses_df': self.courses_df,  # Add this line
            'course_vectors': self.course_vectors,  # Add this line
            'category_to_cluster_map': dict(self.category_to_cluster_map),
            'config': {
                'n_clusters': self.kmeans.n_clusters,
                'features': 'title+description+category_course'
            }
        }
        os.makedirs(os.path.dirname(Config.MODEL_PATH), exist_ok=True)
        joblib.dump(model_data, Config.MODEL_PATH)
        logger.info(f"Model saved to {Config.MODEL_PATH}")

    @classmethod
    def load(cls):
        """Load a trained model from disk"""
        if os.path.exists(Config.MODEL_PATH):
            try:
                model_data = joblib.load(Config.MODEL_PATH)
                recommender = cls()
                recommender.vectorizer = model_data['vectorizer']
                recommender.kmeans = model_data['kmeans']
                recommender.courses_df = model_data['courses_df']  # Add this line
                recommender.course_vectors = model_data['course_vectors']  # Add this line
                recommender.category_to_cluster_map = model_data['category_to_cluster_map']
                recommender.is_trained = True
                logger.info("Model loaded successfully")
                return recommender
            except Exception as e:
                logger.error(f"Failed to load model: {str(e)}")
        return cls()

    def recommend(self, enrolled_courses, n_recommendations=Config.MAX_RECOMMENDATIONS, min_similarity=Config.MIN_SIMILARITY):
        """Generate course recommendations"""
        if not self.is_trained:
            raise ValueError("Model not trained")
    
        if enrolled_courses.empty:
            logger.warning("No enrolled courses provided for recommendation")
            return pd.DataFrame()

        # Prepare enrolled courses text
        enrolled_text = (
            enrolled_courses['title'].str.lower() + " " +
            enrolled_courses['description'].fillna('').str.lower() + " " +
            enrolled_courses['category_course'].fillna('').str.lower()
        )

        logger.info(f"Enrolled courses text: {enrolled_text.tolist()}")

        # Vectorize enrolled courses
        enrolled_vectors = self.vectorizer.transform(enrolled_text)
        logger.info(f"Enrolled vectors shape: {enrolled_vectors.shape}")

        # Calculate similarity scores
        similarity_scores = cosine_similarity(self.course_vectors, enrolled_vectors)
        mean_similarity = similarity_scores.mean(axis=1)

        # Create recommendations dataframe
        recommendations = self.courses_df.copy()
        recommendations['similarity'] = mean_similarity

        # Filter out enrolled courses and below threshold
        recommendations = recommendations[
            ~recommendations['title'].str.lower().isin(enrolled_courses['title'].str.lower())
        ]
        
        # Log similarity distribution before filtering
        logger.info(f"Similarity scores before filtering: Min={recommendations['similarity'].min():.2f}, "
                    f"Max={recommendations['similarity'].max():.2f}, "
                    f"Mean={recommendations['similarity'].mean():.2f}")

        # Apply min_similarity threshold
        recommendations = recommendations[recommendations['similarity'] >= min_similarity]
        
        if recommendations.empty:
            logger.warning(f"No recommendations found with similarity >= {min_similarity}")
            return pd.DataFrame()

        # Log the top candidates with their similarity scores
        top_candidates = recommendations.nlargest(20, 'similarity')
        logger.info("Top candidate courses and their similarity scores:")
        for idx, row in top_candidates.iterrows():
            logger.info(f"{row['title']}: {row['similarity']:.3f}")

        # Select final recommendations - simple top N by similarity
        final_recs = recommendations.nlargest(n_recommendations, 'similarity')

        # Alternative approach if you want to ensure diversity:
        # final_recs = pd.DataFrame()
        # clusters_used = set()
        # 
        # # First pass: get top course from each relevant cluster
        # for cluster_id in recommendations['cluster'].unique():
        #     cluster_recs = recommendations[recommendations['cluster'] == cluster_id]
        #     top_rec = cluster_recs.nlargest(1, 'similarity')
        #     final_recs = pd.concat([final_recs, top_rec])
        #     clusters_used.add(cluster_id)
        # 
        # # Second pass: fill remaining slots with highest similarity
        # if len(final_recs) < n_recommendations:
        #     remaining = n_recommendations - len(final_recs)
        #     extra_recs = recommendations[~recommendations['cluster'].isin(clusters_used)]
        #     final_recs = pd.concat([final_recs, extra_recs.nlargest(remaining, 'similarity')])

        return final_recs.head(n_recommendations)
