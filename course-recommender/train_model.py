from models.database import Database
from models.recommender import CourseRecommender
from config import Config
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def train_and_save_model():
    try:
        db = Database()
        recommender = CourseRecommender()
        
        courses_df = db.get_courses()
        if courses_df.empty:
            raise ValueError("No courses found in database")
        
        recommender.train(courses_df)
        logger.info("Model trained and saved successfully")
        return True
    except Exception as e:
        logger.error(f"Training failed: {str(e)}")
        return False

if __name__ == "__main__":
    if train_and_save_model():
        print("✅ Model training completed successfully!")
    else:
        print("❌ Model training failed. Check logs for details.")