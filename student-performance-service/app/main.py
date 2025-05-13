from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import sys
import json
import logging
from app.utils import preprocess_input

# =============================================
# 1. APPLICATION INITIALIZATION
# =============================================

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# =============================================
# 2. MODEL LOADING WITHOUT SCALER
# =============================================

try:
    logger.info("Loading model...")
    model = joblib.load('app/model/student_performance_model.joblib')  # No scaler

    try:
        feature_names = model.feature_names_in_.tolist()
    except AttributeError:
        with open('app/model/feature_names.json', 'r') as f:
            feature_names = json.load(f)

    logger.info(f"Model loaded. Model expects {len(feature_names)} features.")

except Exception as e:
    logger.critical(f"CRITICAL STARTUP ERROR: {str(e)}")
    sys.exit(1)

# =============================================
# 3. ENDPOINTS
# =============================================

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'UP',
        'model_ready': True,
        'service': 'student-performance-service'
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400

        input_data = request.json

        required_fields = ['G1', 'G2', 'studytime']
        for field in required_fields:
            if field not in input_data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Process the input data
        processed_data = preprocess_input(input_data, feature_names)

        # Check if the data passed is correct and has the expected number of features
        if processed_data.shape[1] != len(feature_names):
            return jsonify({'error': 'Incorrect number of features'}), 400

        # Make predictions
        prediction = model.predict(processed_data)
        probabilities = model.predict_proba(processed_data)

        # Check the prediction
        categories = ['Failed', 'Passable', 'Good', 'Very Good', 'Excellent']
        predicted_label = categories[int(prediction[0])]

        # Build the response
        response = {
            'prediction': predicted_label,
            'confidence': float(np.max(probabilities)),
            'probabilities': {
                category: float(probabilities[0][i])
                for i, category in enumerate(categories)
            },
            'model_info': {
                'type': 'DecisionTreeClassifier',
                'version': '1.0'
            }
        }

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e),
            'expected_format': {
                'required_fields': ['G1', 'G2', 'studytime'],
                'optional_fields': [
                    'age', 'Medu', 'Fedu', 'traveltime', 'failures',
                    'famrel', 'freetime', 'goout', 'Dalc', 'Walc',
                    'health', 'absences', 'school', 'sex', 'address',
                    'famsize', 'Pstatus', 'Mjob', 'Fjob', 'reason',
                    'guardian', 'schoolsup', 'famsup', 'paid',
                    'activities', 'nursery', 'higher', 'internet',
                    'romantic']
            }
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
