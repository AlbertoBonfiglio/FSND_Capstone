''' Readings Model Module '''
import datetime as dt
from sqlalchemy import ForeignKey, Index, func, text, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database.connection import db


class Reading(db.Model):  # type: ignore
    ''' Reading Class '''
    __tablename__ = 'readings'

    id: Mapped[UUID] = mapped_column(
        UUID, primary_key=True, server_default=text("gen_random_uuid()"))
    robot_id: Mapped[UUID] = mapped_column(ForeignKey("robots.id"), index=True)
    data: Mapped[JSON] = mapped_column(JSON, nullable=False, default={})
    date: Mapped[dt.datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now(), nullable=False, index=True)
    
    robot: Mapped["Robot"] = relationship(  # type: ignore
        back_populates="readings") 

    def __init__(self, robot_id, date=None, data={}):
        self.robot_id = robot_id
        self.data = data,
        self.date = date
        

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
            'robot_id': self.robot_id,
            'data': self.data,
            'date': self.date
        }
        
    def format_short(self):
        ''' format to json'''
        return {
            'readings': self.data,
            'date': self.date
        }


#readings_fk_index = Index('ix_robots_id_fkey', Reading.robot_id)
