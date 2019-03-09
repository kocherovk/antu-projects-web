import sys
from datetime import datetime
from functools import wraps, update_wrapper, reduce
from logging import getLogger
from typing import Any
import projects

from flask import Flask, redirect, render_template, current_app, session
from flask import send_from_directory, request, make_response, Response, json
from flask_login import login_required, current_user
from flask_security import Security, SQLAlchemyUserDatastore, logout_user
from flask_session import Session
from sqlalchemy import func

import db
# import menu_items
import util
from models import User, Role, Project, ProjectStage, ProjectStatus, ProjectType, ProjectToBeDone

logger = getLogger()

flask_server = Flask('server')

flask_server.config.from_mapping({
    'SQLALCHEMY_DATABASE_URI': db.db_connection_string,
    'SECURITY_PASSWORD_SALT': '8312hjf123',
    'SECRET_KEY': util.alphanumeric(32),
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    'SESSION_TYPE': 'filesystem'
})

db.database.init_app(flask_server)
security_storage = SQLAlchemyUserDatastore(db.database, User, Role)
flask_server.security = Security(flask_server, security_storage)
Session(flask_server)


def json_response(result: Any) -> Response:
    response = make_response(json.dumps(result))
    response.headers['Content-Type'] = 'application/json'
    return response


def json_error(message: str):
    response = make_response(json.dumps({'error': message}), 400)
    response.headers['Content-Type'] = 'application/json'
    return response


def nocache(view):
    @wraps(view)
    def no_cache(*args, **kwargs):
        response = make_response(view(*args, **kwargs))
        response.headers['Last-Modified'] = datetime.now()
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '-1'
        return response

    return update_wrapper(no_cache, view)


@flask_server.route('/<path:path>', methods=['GET'])
def send_file_get(path):
    file = send_from_directory('dist', path)
    return file


@flask_server.route('/', methods=['GET'])
@login_required
@nocache
def index():
    file = send_from_directory('dist', 'index.html')
    return file


@flask_server.route("/log-out")
def logout():
    session.clear()
    return redirect('/')


@flask_server.route('/api/current-user', methods=['GET'])
@login_required
def get_current_user():
    return json_response(current_user.to_dict())


@flask_server.route('/api/projects', methods=['GET'])
@login_required
def get_projects():
    query = Project.query

    try:
        stage_id = int(request.args.get('stage_id')) if request.args.get('stage_id') else None
        status_id = int(request.args.get('status_id')) if request.args.get('status_id') else None
        type_id = int(request.args.get('type_id')) if request.args.get('type_id') else None
        tobedone_id = int(request.args.get('tobedone_id')) if request.args.get('tobedone_id') else None
        client_id = int(request.args.get('client_id')) if request.args.get('client_id') else None
        engineer_id = int(request.args.get('engineer_id')) if request.args.get('engineer_id') else None
        owner_id = int(request.args.get('owner_id')) if request.args.get('owner_id') else None
    except ValueError as e:
        return json_error(str(e))

    if stage_id is not None:
        query = query.filter(Project.stage_id == stage_id)

    if status_id is not None:
        query = query.filter(Project.status_id == status_id)

    if type_id is not None:
        query = query.filter(Project.type_id == type_id)

    if tobedone_id is not None:
        query = query.filter(Project.tobedone_id == tobedone_id)

    if client_id is not None:
        query = query.filter(Project.client_id == client_id)

    if engineer_id is not None:
        query = query.filter(Project.engineer_id == engineer_id)

    if owner_id is not None:
        query = query.filter(Project.owner_id == owner_id)

    if current_user.has_role('client'):
        query = query.filter(Project.client_id == current_user.id)

    return json_response([item.to_dict() for item in query.all()])


@flask_server.route('/api/project', methods=['POST'])
@login_required
def create_project():
    project = Project(**request.json)
    return json_response(projects.create(project).to_dict())


@flask_server.route('/api/project/<project_id>', methods=['PATCH'])
@login_required
def update_project(project_id: str):

    attrs = request.json
    return json_response(projects.edit(int(project_id), attrs).to_dict())


@flask_server.route('/api/project/<project_id>', methods=['DELETE'])
@login_required
def delete_project(project_id: str):
    try:
        project_id = int(project_id)
    except TypeError as e:
        return json_error(str(e))

    return json_response(projects.delete(project_id))


@flask_server.route('/api/project-fields', methods=['GET'])
@login_required
def get_order_filters():
    stages = [stage.to_dict() for stage in ProjectStage.query.all()]
    statuses = [status.to_dict() for status in ProjectStatus.query.all()]
    types = [type.to_dict() for type in ProjectType.query.all()]
    tobedones = [tbd.to_dict() for tbd in ProjectToBeDone.query.all()]
    users = User.query.all()

    clients = [user.to_dict() for user in users if user.has_role('client')]
    engineers = [user.to_dict() for user in users if user.has_role('staff')]

    return json_response({
        'statuses': statuses,
        'types': types,
        'stages': stages,
        'tobedones': tobedones,
        'users': {
            'clients': clients,
            'engineers': engineers
        }
    })

#
# @flask_server.route('/api/menu-items-filters', methods=['GET'])
# @login_required
# def get_menu_items_filters():
#     with current_user.restaurant_db_session() as session:
#         type_options = next(zip(*session.query(MenuItem.type_food)
#                                 .filter(MenuItem.type_food != '')
#                                 .filter(MenuItem.type_food != 'deleted')
#                                 .order_by(MenuItem.type_food)
#                                 .distinct()
#                                 .all()))
#
#         return json_response({
#             'type_options': type_options
#         })


def serve(host='0.0.0.0', port=8080):
    flask_server.run(host=host, port=port, threaded=True)
