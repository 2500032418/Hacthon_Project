from sqlalchemy import Column, Integer, String, Text
from ..database.connection import Base


class Standard(Base):
    __tablename__ = "standards"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(500), nullable=False)
    category = Column(String(100))
    year = Column(String(10))
    description = Column(Text)

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "title": self.title,
            "category": self.category,
            "year": self.year,
            "description": self.description,
        }
