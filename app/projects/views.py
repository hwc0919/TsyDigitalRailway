import datetime
import json
import os

from flask import redirect, render_template, request, session, url_for

from .. import FLY_DIR, login_required
from ..models import Project, Role, User, db
from . import projects
from .sidebar_menu import ITEMS


@projects.route('/')
# @login_required
def project_index():
    # if 'user' not in session:
    #     return '<h1 class="placeholder">请先登录再查看项目</h1>'
    # if 'project_list' in session:
    #     project_list = session['project_list']
    # else:
    #     cur_username = session['user']['username']
    #     cur_user = User.query.filter_by(username=cur_username,
    #                                     delete=False).first()
    #     all_projects = Project.query.all()
    #     project_list = [pj for pj in all_projects
    #                     if cur_user.check_permission(pj.id)]
    #     session['project_list'] = project_list
    all_folders = os.listdir(FLY_DIR)
    project_list = []
    for folder in all_folders:
        project_url = os.path.join('static/fly_projects', folder, 'main.fly')
        project_list.append((folder, project_url))
    return render_template("projects/project_index.html", fly_list=project_list)


@projects.route('/explore/<path:project_url>/')
def project_explore(project_url):
    return render_template("projects/project_explore.html", sidebar_menu=ITEMS, project_url=project_url)
