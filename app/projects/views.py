import datetime
import json

from flask import redirect, render_template, request, session, url_for

from .. import login_required
from ..models import Role, User, db
from . import projects
from .sidebar_menu import ITEMS


@projects.route('/')
def project_index():
    # is_admin = session.get('user', {}).get('is_admin', False)
    # if not is_admin == True:
    #     return render_template('error/404.html', title='401 Unauthorized', error_message='权限不足, 禁止访问')， 401
    # else:
    return render_template("projects/project_index.html")


@projects.route('/explore/<project_name>')
def project_explore(project_name):
    return render_template("projects/project_explore.html", sidebar_menu=ITEMS)
