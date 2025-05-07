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
    # In config.py
    MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models/course_recommender_model.pkl')
