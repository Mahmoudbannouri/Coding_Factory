from flask import Flask, request, jsonify, render_template
from sklearn.preprocessing import StandardScaler
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

# Charger les modèles de classification et de popularité
model = joblib.load('svm_udemy_model.pkl')
label_encoder = joblib.load('label_encoder.pkl')
tfidf = joblib.load('tfidf.pkl')
svd = joblib.load('svd.pkl')

popularity_model = joblib.load('popularite_model.pkl')
popularity_scaler = joblib.load('popularite_scaler.pkl')

app = Flask(__name__)

CORS(app) 


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        title = data.get('title', '').strip()
        description = data.get('description', '').strip()

        if not title or not description:
            return jsonify({'error': 'Le titre et la description sont obligatoires.'}), 400

        try:
            rating = float(data.get('rating', 0))
            reviewcount = float(data.get('reviewcount', 0))
            duration = float(data.get('duration', 0))
            lectures = int(data.get('lectures', 0))
        except ValueError as e:
            return jsonify({'error': f'Valeur numérique invalide: {str(e)}'}), 400

        # Prédiction du niveau (code existant)
        combined_text = f"{title} {description}"
        tfidf_matrix = tfidf.transform([combined_text])
        tfidf_svd = svd.transform(tfidf_matrix)

        numeric_features = pd.DataFrame([{
            'rating': rating,
            'reviewcount': reviewcount,
            'duration': duration,
            'lectures': lectures,
            'rating_to_reviews': rating / (reviewcount + 1),
            'duration_per_lecture': duration / (lectures + 1)
        }])

        X = pd.concat([
            numeric_features,
            pd.DataFrame(tfidf_svd, columns=[f'tfidf_svd_{i}' for i in range(tfidf_svd.shape[1])])
        ], axis=1)

        if X.isnull().values.any() or np.isinf(X.values).any():
            X = X.replace([np.inf, -np.inf], np.nan).fillna(0)

        prediction = model.predict(X)[0]
        level = label_encoder.inverse_transform([prediction])[0]

        # Nouveau: Prédiction de la popularité
        popularity_features = pd.DataFrame([{
            'rating': rating,
            'reviewcount': reviewcount,
            'duration': duration,
            'lectures': lectures,
            'rating_to_reviews': rating / (reviewcount + 1),
            'duration_per_lecture': duration / (lectures + 1)
        }])
        
        popularity_features_scaled = popularity_scaler.transform(popularity_features)
        is_popular = popularity_model.predict(popularity_features_scaled)[0]
        popularity_prob = popularity_model.predict_proba(popularity_features_scaled)[0][1]
        
        # Génération des explications
        explanation = generate_explanation(rating, reviewcount, duration, lectures, combined_text)
        popularity_explanation = generate_popularity_explanation(is_popular, popularity_prob, reviewcount, rating)

        return jsonify({
            'predicted_level': level,
            'explanation': explanation,
            'is_popular': bool(is_popular),
            'popularity_probability': float(popularity_prob),
            'popularity_explanation': popularity_explanation,
            'analysis': {
                'rating': rating,
                'reviewcount': reviewcount,
                'duration': duration,
                'lectures': lectures
            }
        })

    except Exception as e:
        app.logger.error(f"Erreur lors de la prédiction: {str(e)}")
        return jsonify({'error': 'Une erreur est survenue lors de la prédiction.'}), 500
    
def generate_explanation(rating, reviewcount, duration, lectures, combined_text):
    explanation = []

    if rating >= 4.5:
        explanation.append("le cours a une excellente note")
    elif rating >= 3.5:
        explanation.append("le cours a une note correcte")
    else:
        explanation.append("le cours a une note relativement basse")

    if reviewcount > 1000:
        explanation.append("et un grand nombre d'avis")
    elif reviewcount > 100:
        explanation.append("et un nombre modéré d'avis")
    else:
        explanation.append("mais peu d'avis")

    if duration >= 20:
        explanation.append("avec une longue durée")
    elif duration >= 5:
        explanation.append("avec une durée moyenne")
    else:
        explanation.append("avec une durée courte")

    if lectures >= 100:
        explanation.append("et beaucoup de leçons")
    elif lectures >= 30:
        explanation.append("et un nombre raisonnable de leçons")
    else:
        explanation.append("et peu de leçons")

    if len(combined_text.split()) < 50:
        explanation.append(". La description est assez succincte.")
    else:
        explanation.append(". La description est plutôt détaillée.")

    return "Ce cours semble destiné à ce niveau car " + ", ".join(explanation)
    
def generate_popularity_explanation(is_popular, probability, reviewcount, rating):
    if is_popular:
        base = f"Ce cours est populaire (probabilité: {probability:.0%}). "
        if reviewcount > 1000 and rating >= 4.5:
            return base + "Il a un grand nombre d'avis et une excellente note."
        elif reviewcount > 500:
            return base + "Il a attiré beaucoup d'étudiants."
        else:
            return base + "Sa note exceptionnelle compense son nombre d'avis plus modeste."
    else:
        base = f"Ce cours n'est pas encore populaire (probabilité: {probability:.0%}). "
        if reviewcount < 100:
            return base + "Il a peu d'avis pour le moment."
        elif rating < 3.5:
            return base + "Sa note relativement basse limite sa popularité."
        else:
            return base + "Il pourrait gagner en popularité avec plus de visibilité."

if __name__ == "__main__":
    app.run(debug=True)