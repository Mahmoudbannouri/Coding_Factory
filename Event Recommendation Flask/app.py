from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)  # Allow requests from Angular and Spring Boot

# Load model and MultiLabelBinarizer
try:
    model = joblib.load('best_multi_label_model_no_research_seminar.pkl')
    mlb = joblib.load('mlb_no_research_seminar.pkl')
except FileNotFoundError as e:
    print(f"Error: {e}. Ensure .pkl files are in the same directory as app.py")
    exit(1)

# Define feature columns (same as your original)
features = [
    '5. Are you associated with any developer Community?',
    '7. Participating in Hackathons and other competitions?',
    '1. How many programming languages do you know? ',
    '9. Involved in additional volunteer groups?(NCC,NSS, Social Welfare Groups  or any other)',
    '6. Active in developer Communities',
    'achievement_count',
    '10. Have you ever pitched any idea?',
    '8. Have you made any Software based projects?',
    '4. Exposure to GitHub ?',
    '2.  Actively involved in Specific technology?',
    'total_projects',
    'tech_involvement',
    'community_hackathon'
]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.form
        input_features = {}
        for feature in features:
            value = data.get(feature, '').strip()
            if value == '' and feature != '2.  Actively involved in Specific technology?':
                return jsonify({"error": f"Missing input for: {feature}"}), 400
            if feature == '2.  Actively involved in Specific technology?' and value == '':
                value = 'None'
            input_features[feature] = value

        # Create DataFrame
        input_df = pd.DataFrame([input_features], columns=features)

        # Ensure numeric columns are numbers
        for col in ['achievement_count', 'total_projects', 'tech_involvement', 'community_hackathon']:
            input_df[col] = pd.to_numeric(input_df[col], errors='coerce')
            if input_df[col].isna().any():
                return jsonify({"error": f"Invalid numeric value for {col}"}), 400

        # Make prediction
        y_pred = model.predict(input_df)
        predicted_events = mlb.inverse_transform(y_pred)[0]
        predicted_event = predicted_events[0] if predicted_events else "No events predicted"

        return jsonify({"predicted_event": predicted_event})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)