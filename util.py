import string
from copy import copy
from inspect import signature
from random import choice
from typing import Any, Dict


class Value:
    def __repr__(self):
        params = signature(self.__init__).parameters
        l = ['%s=%r' % (key, value) for key, value in self.__dict__.items()
             if key in params and value != params.get(key).default]
        return '%s(%s)' % (self.__class__.__name__, ', '.join(l))

    def __hash__(self):
        return hash(repr(self))

    def __eq__(self, other):
        return repr(self) == repr(other)

    def __ne__(self, other):
        return repr(self) != repr(other)

    def copy(self, **kwargs):
        value = copy(self)

        for k, v in kwargs.items():
            setattr(value, k, v)

        return value


def model_to_dict(model) -> Dict[str, Any]:
    model_dict = model.__dict__.copy()
    model_dict.pop('_sa_instance_state')
    return model_dict


def alphanumeric(length: int):
    return ''.join(choice(string.ascii_lowercase + string.digits) for _ in range(length))

