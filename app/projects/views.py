import datetime
import os

from flask import render_template, request, session, jsonify

from .. import BASE_DIR, FLY_DIR, login_required
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
@login_required
def project_explore():
    pid = request.args['pid']
    cur_user = User.query.filter_by(id=session['user']['id']).first()
    project = Project.query.filter_by(id=pid).first()
    if not cur_user.check_permission(project.group):
        return render_template('error/404.html', title='401 Unauthorized', error_message='没有权限查看此项目'), 401
    project_url = project.url
    return render_template("projects/project_explore.html", sidebar_menu=ITEMS, project_url=project_url)


@projects.route('/ajax_upload', methods=['GET', 'POST'])
def project_ajax_upload():
    filename = session['user']['username'] + '_' + request.form['filename']
    abs_path = os.path.join(BASE_DIR, 'static/upload', filename)
    with open(abs_path, 'w', encoding='utf-8') as f:
        f.write(request.form['data'])
    url = '/static/upload/' + filename
    return jsonify({'status': True, 'message': 'success', 'url': url})
