import random
import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score


request_types = [
    "Purchase",
    "Travel",
    "Leave",
    "Reimbursement",
    "Software Access",
    "Content Approval"
]

priorities = ["Low", "Medium", "High"]

departments = [
    "IT",
    "HR",
    "Finance",
    "Marketing",
    "Operations",
    "Sales"
]


def assign_status(amount, priority, request_type, department):

    # Leave requests are usually approved
    if request_type == "Leave":
        if priority == "High":
            return "Pending"
        return "Approved"

    # Software access requests
    if request_type == "Software Access":
        if amount <= 20000:
            return "Approved"
        return "Pending"

    # Travel requests
    if request_type == "Travel":
        if amount <= 50000:
            return "Approved"
        if priority == "High":
            return "Pending"
        return "Rejected"

    # Purchase requests
    if request_type == "Purchase":
        if amount <= 10000:
            return "Approved"
        if amount <= 100000:
            if priority == "High":
                return "Pending"
            return "Approved"
        return "Rejected"

    # Reimbursements
    if request_type == "Reimbursement":
        if amount <= 30000:
            return "Approved"
        return "Pending"

    # Content approvals
    if request_type == "Content Approval":
        if department == "Marketing":
            return "Approved"
        return "Pending"

    return "Pending"


records = []

for i in range(3000):
    request_type = random.choice(request_types)
    priority = random.choice(priorities)
    department = random.choice(departments)

    if request_type == "Leave":
        amount = random.randint(0, 5000)
    elif request_type == "Software Access":
        amount = random.randint(1000, 30000)
    elif request_type == "Travel":
        amount = random.randint(5000, 120000)
    else:
        amount = random.randint(1000, 200000)

    status = assign_status(amount, priority, request_type,department)
    # Add small real-world variation so model accuracy is realistic
    if random.random() < 0.08:
        status = random.choice(["Approved", "Pending", "Rejected"])

    records.append({
        "request_type": request_type,
        "priority": priority,
        "department": department,
        "amount": amount,
        "status": status
    })


df = pd.DataFrame(records)

type_encoder = LabelEncoder()
priority_encoder = LabelEncoder()
department_encoder = LabelEncoder()
status_encoder = LabelEncoder()

df["request_type"] = type_encoder.fit_transform(df["request_type"])
df["priority"] = priority_encoder.fit_transform(df["priority"])
df["department"] = department_encoder.fit_transform(df["department"])
df["status"] = status_encoder.fit_transform(df["status"])

X = df[["request_type", "priority", "department", "amount"]]
y = df["status"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)

feature_importance = pd.DataFrame({
    "feature": X.columns,
    "importance": model.feature_importances_
})

joblib.dump(model, "approval_model.pkl")
joblib.dump(type_encoder, "type_encoder.pkl")
joblib.dump(priority_encoder, "priority_encoder.pkl")
joblib.dump(department_encoder, "department_encoder.pkl")
joblib.dump(status_encoder, "status_encoder.pkl")
joblib.dump(accuracy, "model_accuracy.pkl")
joblib.dump(feature_importance, "feature_importance.pkl")

df.to_csv("approval_dataset.csv", index=False)

print("Dataset generated successfully")
print("Total records:", len(df))
print("Model trained successfully")
print("Accuracy:", round(accuracy, 2))
print("\nFeature Importance:")
print(feature_importance)