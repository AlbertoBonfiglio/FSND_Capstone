from sqlalchemy import Column, String, Integer, text
from sqlalchemy.dialects.postgresql import UUID
from backend.database.connection import db

class User(db.Model):  # type: ignore
    __tablename__ = 'questions'

    id = Column(UUID, primary_key=True, server_default = text("gen_random_uuid()"))
    authId = Column(String, unique=True, nullable=False)
    name = Column(String)
  
    def __init__(self, authId, name):
        self.authId = authId
        self.name = name
        
        
    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'authId': self.authId,
            'name': self.name,
        }
