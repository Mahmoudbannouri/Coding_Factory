import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '3306')
    DB_NAME = os.getenv('DB_NAME', 'pi_work')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    
    # Recommendation settings
    MIN_RECOMMENDATIONS_PER_CATEGORY = 4  # Increased from 2
    MAX_RECOMMENDATIONS = 10
    CLUSTERS = 5
    MIN_SIMILARITY = 0.1  # Lower threshold for small datasets
    DIVERSITY_FACTOR = 0.3  # More weight to similarity
    MIN_SIMILARITY = 0.05  # Very low threshold for testing
    MIN_RECOMMENDATIONS_PER_CATEGORY = 2
    MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models/recommender_model.joblib')