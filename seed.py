from flask_security.utils import hash_password

from server import flask_server

data_store = flask_server.security.datastore

with flask_server.app_context():
    data_store.create_role(name='admin')
    data_store.create_role(name='staff')
    data_store.create_role(name='accountant')
    data_store.create_role(name='client')
    data_store.commit()

    users = [
        'admin', 'staff', 'accountant', 'client'
    ]

    for user in users:
        user_password = hash_password(user)

        data_store.create_user(
            email=user, password=user_password, active=True, roles=[user]
        )

    data_store.commit()
