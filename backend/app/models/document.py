from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from ..database.connection import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(500), nullable=False)
    source_type = Column(String(50), default="upload")
    num_chunks = Column(Integer, default=0)
    status = Column(String(20), default="indexed")
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "source_type": self.source_type,
            "num_chunks": self.num_chunks,
            "status": self.status,
            "uploaded_at": str(self.uploaded_at),
        }
