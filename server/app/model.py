import joblib
import pandas as pd

email_model_path = "./models/email_model.pkl"
url_model_path = "./models/url_model.pkl"

email_model = joblib.load(email_model_path)
url_model = joblib.load(url_model_path)


def predict_email(data: dict):
    input_text = data["email_text"]

    vectorized_input = email_model.named_steps['tfidf'].transform([input_text])
    
    prediction = email_model.named_steps['classifier'].predict(vectorized_input)
    predicted_label = prediction[0]
    probab = email_model.named_steps['classifier'].predict_proba(vectorized_input)[0]

    class_labels = email_model.named_steps['classifier'].classes_

    label_index = list(class_labels).index(predicted_label)

    return {
        "Prediction": predicted_label,
        "Confidence": probab[label_index] * 100,
    }


def predict_url(data: dict):
    input = pd.DataFrame([data])

    prediction = url_model.predict(input)
    probab = url_model.predict_proba(input)[0]

    return {
        "Prediction": int(prediction[0]),
        "Confidence": probab[prediction[0]] * 100,
    }
