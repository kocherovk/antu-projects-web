from typing import Dict, Any

from flask_login import current_user
import db

from models import Project


def create(project: Project) -> Project:
    db.database.session.add(project)
    db.database.session.commit()
    db.database.session.refresh(project)
    return project


def delete(project_id: int):
    project = Project.query.filter(Project.id == project_id).one()
    db.database.session.delete(project)
    db.database.session.commit()


def edit(project_id: int, attrs: Dict[str, Any]) -> Project:
    old_project = Project.query.filter(Project.id == project_id).one()

    for key, value in attrs.items():
        setattr(old_project, key, value)

    db.database.session.commit()

    return old_project
