from sqlalchemy import Column, Integer, String, Float
from database import Base


class Request(Base):
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    request_type = Column(String(100), nullable=False)
    priority = Column(String(50), nullable=False)
    amount = Column(Float, nullable=False)

    assigned_approver = Column(String(100), default="Team Manager")
    approval_level = Column(String(50), default="Level 1")

    status = Column(String(50), default="Pending")
    predicted_result = Column(String(50), default="Pending")
    predicted_delay = Column(Float, default=0.0)
    notification = Column(String(255), default="")
    comment = Column(String(500), default="")