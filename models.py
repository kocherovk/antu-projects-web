from functools import reduce

from flask_login import UserMixin
from flask_security import RoleMixin
from sqlalchemy import Column, String, DateTime, Integer, Table, Boolean, ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy.dialects.mysql import TIMESTAMP

from db import database
from util import model_to_dict

database.Model.to_dict = model_to_dict


class ProjectStage(database.Model):
    __tablename__ = 'project_stages'

    id = Column(Integer(), primary_key=True)
    order = Column(Integer(), nullable=True)
    name = Column(String(255), nullable=True)


class ProjectStatus(database.Model):
    __tablename__ = 'project_statuses'

    id = Column(Integer(), primary_key=True)
    name = Column(String(255), nullable=True)


class ProjectToBeDone(database.Model):
    __tablename__ = 'project_tobedone'

    id = Column(Integer(), primary_key=True)
    name = Column(String(255), nullable=True)


class ProjectType(database.Model):
    __tablename__ = 'project_types'

    id = Column(Integer(), primary_key=True)
    name = Column(String(255), nullable=True)


class Project(database.Model):
    __tablename__ = 'projects'

    id = Column(Integer(), primary_key=True)
    stage_id = Column(Integer(), nullable=True)
    status_id = Column(Integer(), nullable=True)
    type_id = Column(Integer(), nullable=True)
    tobedone_id = Column(Integer(), nullable=True)
    client_id = Column(Integer(), nullable=True)
    engineer_id = Column(Integer(), nullable=True)
    owner_id = Column(Integer(), nullable=True)
    priority = Column(Integer(), nullable=True)
    quantity = Column(Integer(), nullable=True)
    serials = Column(String(255), nullable=True)
    order_number = Column(String(255), nullable=True)
    invoice_number = Column(String(255), nullable=True)
    invoice_sent = Column(Integer(), nullable=True)
    invoice_paid = Column(Integer(), nullable=True)
    number = Column(String(255), nullable=True)
    name = Column(String(255), nullable=True)
    version = Column(String(255), nullable=True)
    description = Column(String(1024), nullable=False)
    link = Column(String(255), nullable=True)
    link2 = Column(String(255), nullable=True)


user_roles = Table(
    'user_roles', database.metadata,
    Column('user_id', Integer(), ForeignKey('users.id')),
    Column('role_id', Integer(), ForeignKey('roles.id'))
)


class Role(database.Model, RoleMixin):
    __tablename__ = 'roles'
    id = Column(Integer(), primary_key=True)
    name = Column(String(80), unique=True)

    def __init__(self, name):
        self.name = name

    def get_rights(self):
        if self.name == 'accountant':
            return {
                'project_fields': [
                    'number', 'name', 'client_id', 'order_number',
                    'invoice_number', 'invoice_sent', 'invoice_paid'
                ],
                'can_edit': False,
                'can_create': False,
                'can_delete': False,
            }

        if self.name == 'admin':
            return {
                'project_fields': [
                    'stage_id', 'status_id', 'type_id', 'tobedone_id', 'client_id',
                    'engineer_id', 'owner_id', 'priority', 'quantity',
                    'serials', 'order_number', 'invoice_number',
                    'invoice_sent', 'invoice_paid', 'number', 'name',
                    'version', 'description', 'link', 'link2',
                ],
                'can_edit': True,
                'can_create': True,
                'can_delete': True,
            }

        if self.name == 'staff':
            return {
                'project_fields': [
                    'stage_id', 'status_id', 'type_id', 'tobedone_id', 'client_id',
                    'engineer_id', 'owner_id', 'priority', 'quantity',
                    'serials', 'order_number', 'number', 'name',
                    'version', 'description', 'link', 'link2',
                ],
                'can_edit': True,
                'can_create': False,
                'can_delete': False,
            }

        if self.name == 'client':
            return {
                'project_fields': [
                    'stage_id', 'status_id', 'client_id',
                    'engineer_id', 'owner_id', 'priority', 'quantity',
                    'serials', 'order_number', 'number', 'name',
                    'version', 'link', 'link2',
                ],
                'can_edit': False,
                'can_create': False,
                'can_delete': False,
            }

        raise Exception('no such role' + self.name)


class User(database.Model, UserMixin):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True)
    email = Column(String(255), unique=True)
    password = Column(String(255))
    active = Column(Boolean())
    roles = relationship('Role', secondary=user_roles, backref=backref('users', lazy='dynamic'))

    def __init__(self, email, password, active, roles):
        self.email = email
        self.password = password
        self.active = active
        self.roles = roles

    def has_role(self, role_name: str) -> bool:
        return reduce(lambda carry, r: carry or r.name == role_name, self.roles, False)

    def get_rights(self):
        return self.roles[0].get_rights()

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'rights': self.get_rights()
        }
