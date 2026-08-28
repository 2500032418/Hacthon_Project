from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from ..database.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255))
    hashed_password = Column(String(512), nullable=False)
    role = Column(String(20), default="user")
    industry = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {"id": self.id, "email": self.email, "name": self.name, "role": self.role, "industry": self.industry}
