from flask import Flask, jsonify
from models.database import Database
from models.recommender import CourseRecommender
from config import Config
import logging
from flask_cors import CORS
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize components
db = Database()
recommender = CourseRecommender()

# Load model if exists, otherwise needs training
if os.path.exists(Config.MODEL_PATH):
    recommender = CourseRecommender.load()
else:
    logger.warning("No trained model found. Please train the model first.")

@app.route('/recommend/<int:student_id>', methods=['GET'])
def recommend(student_id):
    try:
        # Get student enrollments
        enrollments = db.get_student_enrollments(student_id)
        if enrollments is None or enrollments.empty:
            return jsonify({"message": "No enrolled courses found", "recommendations": []})

        # Get recommendations
        recommendations = recommender.recommend(enrollments)

        if recommendations is None or recommendations.empty:
            return jsonify({
                "message": "No recommendations found",
                "suggestion": "Try lowering the similarity threshold"
            })

        return jsonify({
    "recommendations": recommendations[[
        'id', 'title', 'level', 'rating',
        'description', 'category_course', 'image'
    ]].to_dict('records')
})
    except Exception as e:
        logger.error(f"Recommendation error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
