import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)

def preprocess_input(input_data: dict, feature_names: list) -> pd.DataFrame:
    try:
        # Initialize a DataFrame with zeros for the features
        processed_data = pd.DataFrame(np.zeros((1, len(feature_names))), columns=feature_names)

        # List of numerical features
        numerical_features = ['G1', 'G2', 'age', 'Medu', 'Fedu', 'traveltime',
                              'studytime', 'failures', 'famrel', 'freetime',
                              'goout', 'Dalc', 'Walc', 'health', 'absences']

        # Populate numerical features with values from input_data (or default to 0 if missing)
        for feature in numerical_features:
            processed_data[feature] = float(input_data.get(feature, 0.0))

        # Categorical mappings for certain features
        categorical_mappings = {
            'school': {'GP': 0, 'MS': 1},
            'sex': {'F': 0, 'M': 1},
            'address': {'U': 0, 'R': 1},
            'famsize': {'LE3': 0, 'GT3': 1},
            'Pstatus': {'T': 0, 'A': 1},
            'Mjob': {'teacher': 0, 'health': 1, 'services': 2, 'at_home': 3, 'other': 4},
            'Fjob': {'teacher': 0, 'health': 1, 'services': 2, 'at_home': 3, 'other': 4},
            'reason': {'home': 0, 'reputation': 1, 'course': 2, 'other': 3},
            'guardian': {'mother': 0, 'father': 1, 'other': 2},
            'schoolsup': {'yes': 1, 'no': 0},
            'famsup': {'yes': 1, 'no': 0},
            'paid': {'yes': 1, 'no': 0},
            'activities': {'yes': 1, 'no': 0},
            'nursery': {'yes': 1, 'no': 0},
            'higher': {'yes': 1, 'no': 0},
            'internet': {'yes': 1, 'no': 0},
            'romantic': {'yes': 1, 'no': 0}
        }

        # Populate categorical features based on mappings
        for feature, mapping in categorical_mappings.items():
            value = str(input_data.get(feature, '')).strip()
            processed_data[feature] = mapping.get(value, 0)
            if value not in mapping:
                logger.warning(f"Unknown value '{value}' for {feature}, using default 0")

        # Return processed data with the correct feature names
        processed_data = processed_data[feature_names]

        # Log the processed data for debugging
        logger.debug("Processed data sample: %s", processed_data.iloc[0].to_dict())
        return processed_data

    except Exception as e:
        logger.error("Preprocessing failed", exc_info=True)
        raise ValueError(f"Input preprocessing failed: {str(e)}")
