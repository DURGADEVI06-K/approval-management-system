from pydantic import BaseModel


class RequestCreate(BaseModel):
    employee_name: str
    department: str
    request_type: str
    priority: str
    amount: float

class StatusUpdate(BaseModel):
    status: str
    comment: str = ""