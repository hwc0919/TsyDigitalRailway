import datetime
import json
import os

from flask import render_template, request, session

from .. import FLY_DIR, login_required
from ..models import Project, Role, User, db
from . import projects
from .sidebar_menu import ITEMS


@projects.route('/')
@login_required
def project_index():
    if 'project_list' in session:
        project_list = session['project_list']
    else:
        cur_user = User.query.filter_by(id=session['user']['id']).first()
        all_projects = Project.query.all()
        project_list = [(pj.id, pj.name, pj.description) for pj in all_projects
                        if cur_user.check_permission(pj.group)]

        session['project_list'] = project_list
    return render_template("projects/project_index.html", project_list=project_list)


@projects.route('/explore')
def project_explore():
    pid = request.args['pid']
    project_url = Project.query.filter_by(id=pid).first().url
    return render_template("projects/project_explore.html", sidebar_menu=ITEMS, project_url=project_url)
