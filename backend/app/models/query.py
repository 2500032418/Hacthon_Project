from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from ..database.connection import Base


class Query(Base):
    __tablename__ = "queries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    question = Column(Text, nullable=False)
    answer = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {"id": self.id, "user_id": self.user_id, "question": self.question, "answer": self.answer, "created_at": str(self.created_at)}
