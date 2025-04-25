from flask import Flask, jsonify
from models.database import Database
from models.recommender import CourseRecommender
from config import Config
import threading
import logging
from flask_cors import CORS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
db = Database()
recommender = CourseRecommender.load()
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})  # Adjust for production
CORS(app, resources={r"/*": {"origins": "*"}})  # For development only
CORS(app)  # This will enable CORS for all routes

# In app.py
def initialize():
    try:
        if not recommender.is_trained:
            logger.info("Training recommender...")
            courses_df = db.get_courses()
            if len(courses_df) == 0:
                logger.error("No courses found in database")
                return
            recommender.train(courses_df)
            logger.info("Recommender training completed")
        else:
            logger.info("Recommender already trained")
    except Exception as e:
        logger.error(f"Initialization failed: {e}")

# Initialize the recommender
recommender = CourseRecommender()
initialize()

# Initialize in background thread
threading.Thread(target=initialize, daemon=True).start()
@app.route('/test/student/<int:student_id>')
def test_student(student_id):
    enrollments = db.get_student_enrollments(student_id)
    return jsonify(enrollments.to_dict('records'))

@app.route('/test/courses')
def test_courses():
    courses = db.get_courses()
    return jsonify(courses.to_dict('records'))

# Add these new endpoints to your Flask app.py

@app.route('/popular')
def get_popular_courses():
    try:
        courses = db.get_courses()
        if courses.empty:
            return jsonify({"message": "No courses available", "recommendations": []})
        
        # Ensure we only include columns that exist
        available_columns = [col for col in ['id', 'title', 'category_course', 'description', 'rating', 'image'] 
                           if col in courses.columns]
        
        popular = courses.nlargest(5, 'rating')
        return jsonify({
            "recommendations": popular[available_columns].to_dict('records')
        })
    except Exception as e:
        logger.error(f"Error getting popular courses: {str(e)}")
        return jsonify({"error": str(e)}), 500
@app.route('/similar/<int:course_id>')
def get_similar_courses(course_id):
    try:
        courses = db.get_courses()
        if courses.empty:
            return jsonify({"message": "No courses available", "recommendations": []})
            
        course = courses[courses['id'] == course_id].iloc[0]
        course_text = f"{course['title']} {course['description'] or ''}"
        
        # Vectorize the course
        course_vec = recommender.vectorizer.transform([course_text])
        
        # Calculate similarity with all courses
        similarities = cosine_similarity(
            course_vec,
            recommender.course_vectors
        ).flatten()
        
        courses['similarity'] = similarities
        
        # Exclude the course itself and get top 5 similar
        similar = courses[courses['id'] != course_id].nlargest(5, 'similarity')
        
        return jsonify({
            "recommendations": similar[['id', 'title', 'category_course', 'description', 'rating', 'image']].to_dict('records')
        })
    except Exception as e:
        logger.error(f"Error getting similar courses: {str(e)}")
        return jsonify({"error": str(e)}), 500
@app.route('/recommend/<int:student_id>')
def recommend(student_id):
    try:
        logger.info(f"Generating recommendations for student {student_id}")
        
        enrollments = db.get_student_enrollments(student_id)
        if enrollments.empty:
            logger.warning(f"No enrollments found for student {student_id}")
            return jsonify({"message": "No enrollments found", "recommendations": []})
        
        recs = recommender.recommend_for_student(enrollments)
        
        if recs.empty:
            logger.warning(f"No recommendations generated for student {student_id}")
            return jsonify({"message": "No recommendations available", "recommendations": []})
        
        # Map the columns to match your Angular frontend expectations
        response_data = []
        for _, row in recs.iterrows():
            course = {
                "id": row['id'],
                "title": row['title'],
                "categoryCourse": row['category_course'],  # Match Angular property name
                "description": row.get('description', ''),
                "rate": row.get('rating', 0),  # Match Angular property name
                "image": row.get('image', '')  # Handle missing image
            }
            response_data.append(course)
            
        return jsonify({"recommendations": response_data})
    except Exception as e:
        logger.error(f"Error generating recommendations: {str(e)}")
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)