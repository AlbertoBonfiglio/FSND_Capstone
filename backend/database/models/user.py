''' User Model Module '''
from typing import List
from sqlalchemy import String, text, event
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from api.enums import Status
from database.connection import db
import re


class User(db.Model):  # type: ignore
    ''' User Class '''
    __tablename__ = 'users'
    
    id: Mapped[UUID] = mapped_column(
        UUID, primary_key=True, server_default=text("gen_random_uuid()"))
    auth_id: Mapped[str] = mapped_column(
        String(36), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(36), nullable=False)
    email: Mapped[str] = mapped_column(String(48), nullable=False, unique=True)
    api_key: Mapped[str] = mapped_column(String(36), nullable=False, unique= True, index=True)
    preferences: Mapped[JSON] = mapped_column(JSON, nullable=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False, index=True, 
                                        default=Status.active.value)
    
    # nav links
    robots: Mapped[List['Robot']] = relationship( # type: ignore
        back_populates="user", cascade="all, delete-orphan")

    def __init__(self, auth_id, name, email, api_key, status=Status.active, preferences={}):
        self.auth_id = auth_id
        self.name = name
        self.email= email
        self.api_key = api_key,
        self.status = status.value,
        self.preferences = preferences
        

    def insert(self):
        ''' insert '''
        db.session.add(self)
        db.session.commit()

    def update(self):
        ''' update '''
        db.session.commit()

    def delete(self):
        ''' delete '''
        db.session.delete(self)
        db.session.commit()

    def format(self):
        ''' format '''
        return {
            'id': self.id,
            'auth_id': self.auth_id,
            'name': self.name,
            'email' : self.email,
            'api_key': self.api_key,
            'status': self.status,
            'preferences': self.preferences,
            'robots': len(self.robots)
        }

    def format_long(self):
        ''' format '''
        formattedRobots = [datum.format() for datum in self.robots]
        return {
            'id': self.id,
            'auth_id': self.auth_id,
            'name': self.name,
            'email': self.email,
            'api_key': self.api_key,
            'status': self.status,
            'preferences': self.preferences,
            'robots': formattedRobots
        }

''' 
    Listens to before set events to validate record content
    Used in lieu of writing database constraints to make the backend 
    more portable to other engines if needed
'''
@event.listens_for(User.auth_id, "set")
def before_set_auth_id(target, value, oldvalue, initiator):
    if (value.strip() == None or value.strip() == ""):  # todo add check for "auth0|xxx"
        raise ValueError('Invalid auth Id')


@event.listens_for(User.email, "set")
def before_set_email(target, value, oldvalue, initiator):
    ''' Uses a simple regex to validate the email. It is intentionally vague to allow strange emails '''
    regex = r'[^@]+@[^@]+\.[^@]+'
    print(re.fullmatch(regex, value))
    if (re.fullmatch(regex, value) == None):
        raise ValueError('Invalid email address')
