import pandas as pd
from sqlalchemy import create_engine, text
from config import Config
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Database:
    def __init__(self):
        try:
            self.engine = create_engine(
                f"mysql+pymysql://{Config.DB_USER}:{Config.DB_PASSWORD}@{Config.DB_HOST}:{Config.DB_PORT}/{Config.DB_NAME}",
                pool_pre_ping=True,
                pool_recycle=3600,
                connect_args={"connect_timeout": 5}
            )
            logger.info("Database connection established")
        except Exception as e:
            logger.error(f"Database connection failed: {str(e)}")
            raise

    def get_courses(self):
        """Get all courses with properly formatted category_course"""
        try:
            query = text("""
            SELECT
                id,
                title,
                level,
                rate as rating,
                description,
                category_course,
                image
            FROM courses
            """)
            df = pd.read_sql(query, self.engine)

            if df.empty:
                logger.warning("No courses found in database")

            # Ensure consistent formatting with Java enum
            df['category_course'] = df['category_course'].str.upper().str.replace(' ', '_')
            logger.info(f"Loaded {len(df)} courses from database")
            return df
        except Exception as e:
            logger.error(f"Failed to get courses: {str(e)}")
            raise

    def get_student_enrollments(self, student_id):
        """Get enrolled courses with properly formatted category_course"""
        try:
            query = text("""
            SELECT
                c.id,
                c.title,
                c.level,
                c.rate as rating,
                c.description,
                c.category_course,
                c.image
            FROM courses c
            WHERE c.id IN (
                SELECT course_id FROM course_students WHERE student_id = :student_id
            )
            """)
            df = pd.read_sql(query, self.engine, params={'student_id': student_id})

            if df.empty:
                logger.warning(f"No enrollments found for student {student_id}")

            # Ensure consistent formatting
            df['category_course'] = df['category_course'].str.upper().str.replace(' ', '_')
            return df
        except Exception as e:
            logger.error(f"Failed to get enrollments: {str(e)}")
            raise
