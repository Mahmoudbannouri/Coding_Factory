from flask import Flask, jsonify, render_template
from models.database import Database
from models.recommender import CourseRecommender
from config import Config
import logging
from flask_cors import CORS
import threading
import time
from plots import generate_clustering_plots

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize components
db = Database()
recommender = CourseRecommender.load()

def periodic_retraining(interval=10):
    while True:
        try:
            courses_df = db.get_courses()
            recommender.train(courses_df)
            logger.info("Model retrained in background.")
        except Exception as e:
            logger.error(f"Background training error: {e}")
        time.sleep(interval)  # Wait before next retraining
# Always retrain to reflect new courses


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

@app.route('/train_model')
def train_model():
    recommender = CourseRecommender()
    df = db.get_courses()
    recommender.train(df)

    plot_data = generate_clustering_plots(recommender.course_vectors, max_clusters=10)

    return render_template('train_results.html', plot_data=plot_data)

if __name__ == '__main__':
    threading.Thread(target=periodic_retraining, daemon=True).start()
    app.run(host='0.0.0.0', port=5000)