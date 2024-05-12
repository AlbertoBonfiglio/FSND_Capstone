''' Robot Model Module '''
import re
from typing import List
from sqlalchemy import ForeignKey, String, text, event
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.api.enums import Status
from backend.database.connection import db


class Robot(db.Model):  # type: ignore
    ''' Robot Class '''
    __tablename__ = 'robots'

    id: Mapped[UUID] = mapped_column(
        UUID, primary_key=True, server_default=text("gen_random_uuid()"))
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), index=True)
    name: Mapped[str] =  mapped_column(String(36), nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True, default="")
    mac: Mapped[str] = mapped_column(String(36), unique=True, nullable=False)
    preferences: Mapped[JSON] = mapped_column(JSON, nullable=False, default={})
    status: Mapped[str] = mapped_column(
        String(16), nullable=False, index=True, 
        default=Status.active.value)
    
    # nav links
    user: Mapped['User'] = relationship(back_populates="robots")  # type: ignore
    readings: Mapped[List["Reading"]] = relationship( # type: ignore
        back_populates="robot", cascade="all, delete-orphan")

    def __init__(self, user_id, name, mac, description="", status=Status.active, preferences={}):
        self.user_id = user_id
        self.name = name
        self.mac = mac
        self.description = description
        self.status = status.value,
        self.preferences = preferences

    def insert(self):
        ''' insert '''
        db.session.add(self)
        db.session.commit()

    def update(self):
        ''' Update '''
        db.session.commit()

    def delete(self):
        ''' delete robot '''
        db.session.delete(self)
        db.session.commit()

    def format(self):
        ''' format to json'''
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'mac': self.mac,
            'description': self.description,
            'status': self.status,
            'preferences': self.preferences,
            'readings': len(self.readings)
        }


''' 
    Listens to before set events to validate record content
    Used in lieu of writing database constraints to make the backend 
    more portable to other engines if needed
'''
@event.listens_for(Robot.mac, "set")
def before_set_mac(target, value, oldvalue, initiator):
    ''' Uses a simple regex to validate the email. It is intentionally vague to allow strange emails '''
    regex = r'(([0-9A-Fa-f]{2}[-:]){5}[0-9A-Fa-f]{2})|(([0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4})'
    print(re.fullmatch(regex, value))
    if (re.fullmatch(regex, value) == None):
        raise ValueError('Invalid MAC address')
