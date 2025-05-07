import joblib
import pandas as pd
import numpy as np
import os
import logging
from collections import defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
from config import Config

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

            n_clusters = 4
            self.kmeans = KMeans(n_clusters=n_clusters, n_init='auto')
            self.courses_df['cluster'] = self.kmeans.fit_predict(self.course_vectors)
            self.is_trained = True
            self._save_model()

            logger.info("Training completed successfully")
         

        except Exception as e:
            logger.error(f"Training failed: {str(e)}")
            raise

    def _save_model(self):
        """Save the trained model components to disk"""
        model_data = {
            'vectorizer': self.vectorizer,
            'kmeans': self.kmeans,
            'courses_df': self.courses_df,
            'course_vectors': self.course_vectors,
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
                recommender.courses_df = model_data['courses_df']
                recommender.course_vectors = model_data['course_vectors']
                recommender.is_trained = True
                logger.info("Model loaded successfully")
                return recommender
            except Exception as e:
                logger.error(f"Failed to load model: {str(e)}")
        return cls()
    def recommend(self, enrollments):
        if not self.is_trained:
            raise ValueError("Model not trained.")

        # Step 1: Extract enrolled courses
        enrolled_courses = self.courses_df[self.courses_df['id'].isin(enrollments['id'])]
        if enrolled_courses.empty:
            logger.warning("No enrolled courses found in dataset.")
            return pd.DataFrame()

        enrolled_texts = enrolled_courses['text'].tolist()
        logger.info(f"Enrolled courses text: {enrolled_texts}")

        # Step 2: Vectorize enrolled courses
        enrolled_vector = self.vectorizer.transform([" ".join(enrolled_texts)])
        logger.info(f"Enrolled vectors shape: {enrolled_vector.shape}")

        # Step 3: Filter candidate courses in the same clusters
        enrolled_clusters = enrolled_courses['cluster'].unique()
        filtered_courses_df = self.courses_df[self.courses_df['cluster'].isin(enrolled_clusters)]
        filtered_vectors = self.course_vectors[filtered_courses_df.index]

        # Step 4: Compute similarity
        similarities = cosine_similarity(enrolled_vector, filtered_vectors).flatten()
        logger.info(f"Similarity scores before filtering: Min={similarities.min():.2f}, Max={similarities.max():.2f}, Mean={similarities.mean():.2f}")

        # Step 5: Filter based on the MIN_SIMILARITY threshold
        filtered_recommendations = []
        enrolled_ids = set(enrollments['id'])

        for idx in np.argsort(similarities)[::-1]:
            actual_idx = filtered_courses_df.index[idx]
            course_id = self.courses_df.loc[actual_idx, 'id']
            
            if course_id not in enrolled_ids:
                similarity_score = similarities[idx]
                
                # Apply MIN_SIMILARITY filter to include all courses with similarity >= 0.018
                if similarity_score >= 0.018:
                    filtered_recommendations.append((actual_idx, similarity_score))

        logger.info("Filtered recommendations with similarity >= MIN_SIMILARITY:")
        for idx, score in filtered_recommendations:
            course_title = self.courses_df.loc[idx, 'title']
            logger.info(f"{course_title}: {score:.3f}")

        # Step 6: Return recommended DataFrame with scores
        result_df = self.courses_df.loc[[idx for idx, _ in filtered_recommendations]].copy()
        result_df['similarity_score'] = [score for _, score in filtered_recommendations]
        return result_df
