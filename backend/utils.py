import joblib
import pandas as pd

model = joblib.load("approval_model.pkl")
type_encoder = joblib.load("type_encoder.pkl")
priority_encoder = joblib.load("priority_encoder.pkl")
department_encoder = joblib.load("department_encoder.pkl")
status_encoder = joblib.load("status_encoder.pkl")


def predict_approval(amount, priority, request_type, department):
    try:
        encoded_type = type_encoder.transform([request_type])[0]
    except ValueError:
        encoded_type = 0

    try:
        encoded_priority = priority_encoder.transform([priority])[0]
    except ValueError:
        encoded_priority = 0

    try:
        encoded_department = department_encoder.transform([department])[0]
    except ValueError:
        encoded_department = 0

    input_data = pd.DataFrame([{
        "request_type": encoded_type,
        "priority": encoded_priority,
        "department": encoded_department,
        "amount": amount
    }])

    prediction = model.predict(input_data)[0]
    predicted_status = status_encoder.inverse_transform([prediction])[0]

    if amount <= 10000:
        delay = 1
    elif amount <= 50000:
        delay = 2
    elif amount <= 100000:
        delay = 3
    else:
        delay = 5

    reason = "Prediction based on request type, priority, department and amount using Random Forest model."

    return predicted_status, delay, reason


def assign_approver(amount, department):
    department_managers = {
        "IT": "IT Manager",
        "HR": "HR Manager",
        "Finance": "Finance Manager",
        "Marketing": "Marketing Manager",
        "Operations": "Operations Manager",
        "Sales": "Sales Manager"
    }

    if amount <= 50000:
        return department_managers.get(department, "Department Manager"), "Level 1"

    elif amount <= 100000:
        return "Finance Manager", "Level 2"

    else:
        return "Director", "Level 3"


def generate_notification(prediction, delay, approver):
    if prediction == "Rejected":
        return f"High-risk request. Review required by {approver}."

    if delay >= 3:
        return f"Possible delay expected. Follow up with {approver}."

    return f"Request routed to {approver} successfully."