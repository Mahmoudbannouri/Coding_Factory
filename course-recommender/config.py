import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database configuration
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '3306')
    DB_NAME = os.getenv('DB_NAME', 'pi_work')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    
    # Model configuration
    MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models/course_recommender_model.pkl')
    MAX_RECOMMENDATIONS = 5
    MIN_SIMILARITY = 0.02  # Reduced from 0.18  
    CLUSTERS = 18  # Add this line to define the number of clusters
