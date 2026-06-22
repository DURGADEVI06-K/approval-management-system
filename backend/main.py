from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
import joblib
import models
from utils import predict_approval, assign_approver, generate_notification

model_accuracy = joblib.load("model_accuracy.pkl")
feature_importance = joblib.load("feature_importance.pkl")

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Allow frontend to connect later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Approval Management System API is running"
    }

from fastapi import Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import RequestCreate, StatusUpdate
from models import Request


@app.post("/submit-request")
def submit_request(req: RequestCreate, db: Session = Depends(get_db)):
    prediction, delay, reason = predict_approval(
        req.amount, 
        req.priority, 
        req.request_type,
        req.department
    )
    approver, level = assign_approver(
        req.amount, 
        req.department
    )    
    notification = generate_notification(
        prediction, 
        delay, 
        approver
    )

    new_request = Request(
        employee_name=req.employee_name,
        department=req.department,
        request_type=req.request_type,
        priority=req.priority,
        amount=req.amount,
        assigned_approver=approver,
        approval_level=level,
        status="Pending",
        predicted_result=prediction,
        predicted_delay=delay,
        notification=notification
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return {
    "message": "Request submitted successfully",
    "request_id": new_request.id,
    "status": new_request.status,
    "assigned_approver": new_request.assigned_approver,
    "approval_level": new_request.approval_level,
    "predicted_result": new_request.predicted_result,
    "predicted_delay": new_request.predicted_delay,
    "reason": reason,
    "notification": new_request.notification
}

@app.get("/requests")
def get_requests(db: Session = Depends(get_db)):
    requests = db.query(Request).all()

    return requests

@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    requests = db.query(Request).all()

    total = len(requests)
    approved_predictions = len([r for r in requests if r.predicted_result == "Approved"])
    rejected_predictions = len([r for r in requests if r.predicted_result == "Rejected"])
    pending_predictions = len([r for r in requests if r.predicted_result == "Pending"])

    avg_delay = 0
    if total > 0:
        avg_delay = sum(r.predicted_delay for r in requests) / total
    department_delays = {}

    for r in requests:
        if r.department not in department_delays:
            department_delays[r.department] = []
        department_delays[r.department].append(r.predicted_delay)

    bottleneck_department = "None"
    bottleneck_delay = 0

    if department_delays:
        averages = {
            dept: sum(delays) / len(delays)
            for dept, delays in department_delays.items()
        }

        bottleneck_department = max(averages, key=averages.get)
        bottleneck_delay = round(averages[bottleneck_department], 2)
    manager_count = len(
    [r for r in requests if r.assigned_approver == "Team Manager"]
    )

    head_count = len(
    [r for r in requests if r.assigned_approver == "Department Head"]
    )

    director_count = len(
    [r for r in requests if r.assigned_approver == "Director"]
)
    return {
    "total_requests": total,
    "approved_predictions": approved_predictions,
    "rejected_predictions": rejected_predictions,
    "pending_predictions": pending_predictions,
    "average_predicted_delay": round(avg_delay, 2),
    "bottleneck_department": bottleneck_department,
    "bottleneck_delay": bottleneck_delay,

    "workload_distribution": {
        "team_manager": manager_count,
        "department_head": head_count,
        "director": director_count
    }
}

@app.put("/requests/{request_id}/status")
def update_status(
    request_id: int,
    status_update: StatusUpdate,
    db: Session = Depends(get_db)
):
    request = db.query(Request).filter(Request.id == request_id).first()

    if not request:
        return {"message": "Request not found"}

    request.comment = status_update.comment

    if status_update.status == "Rejected":
        request.status = "Rejected"
        request.notification = f"Request rejected by {request.assigned_approver}."

    elif status_update.status == "Approved":
        if request.approval_level == "Level 1":
            request.status = "Pending"
            request.assigned_approver = "Department Head"
            request.approval_level = "Level 2"
            request.notification = "Request approved by Team Manager and forwarded to Department Head."

        elif request.approval_level == "Level 2":
            request.status = "Pending"
            request.assigned_approver = "Director"
            request.approval_level = "Level 3"
            request.notification = "Request approved by Department Head and forwarded to Director."

        elif request.approval_level == "Level 3":
            request.status = "Approved"
            request.notification = "Request approved successfully by Director."

    db.commit()
    db.refresh(request)

    return {
        "message": "Status updated successfully",
        "request_id": request.id,
        "new_status": request.status,
        "assigned_approver": request.assigned_approver,
        "approval_level": request.approval_level,
        "comment": request.comment,
        "notification": request.notification
    }

@app.get("/model-insights")
def model_insights():
    return {
        "model_name": "Random Forest Classifier",
        "dataset_size": 3000,
        "accuracy": round(float(model_accuracy), 2),
        "features": feature_importance.to_dict(orient="records")
    }