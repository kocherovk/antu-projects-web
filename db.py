import os
from contextlib import contextmanager
from functools import lru_cache
from typing import Dict
from urllib.parse import urlencode

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.engine import Engine, create_engine
from sqlalchemy.orm import Session

from util import Value

database = SQLAlchemy()


class DatabaseConfig(Value):
    def __init__(self, driver: str = None, host: str = None, port: int = None, user: str = None,
                 password: str = None, name: str = None, args: Dict[str, str] = None):
        self.driver = driver
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.name = name
        self.args = args or {}

    def connection_string(self):
        return f'{self.driver}://{self.user}:{self.password}@{self.host}:{self.port}/{self.name}?{urlencode(self.args)}'


@lru_cache(maxsize=None)
def engine_for(conf: DatabaseConfig) -> Engine:
    return create_engine(conf.connection_string(), connect_args=conf.args)


@contextmanager
def session(db: DatabaseConfig) -> Session:
    sess = Session(bind=engine_for(db), expire_on_commit=False)
    try:
        yield sess
        sess.commit()
    except:
        sess.rollback()
        raise
    finally:
        sess.expunge_all()
        sess.close()


if os.getenv('DATABASE_CONNECTION_URL') is not None:
    db_connection_string = os.getenv('DATABASE_CONNECTION_URL')
else:
    raise Exception('DATABASE_CONNECTION_URL is None')
