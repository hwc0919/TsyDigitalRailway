import datetime
import json

from flask import redirect, render_template, request, session, url_for, flash

from .. import login_required
from ..models import db, Role, User
from . import projects


@projects.route('/')
def projects_index():
    # is_admin = session.get('user', {}).get('is_admin', False)
    # if not is_admin == True:
    #     return '<h1>权限不足!</h1>'
    # else:
    return render_template("projects/project_index.html")
