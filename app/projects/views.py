from collections import defaultdict
import datetime
import os
from urllib.parse import quote

from flask import render_template, request, session, jsonify

from .. import BASE_DIR, FLY_DIR, login_required
from ..models import Project, Role, User, db
from . import projects
from .sidebar_menu import ITEMS


@projects.route('/')
@login_required
def project_index():
    cur_user = User.query.filter_by(id=session['user']['id']).first()
    all_projects = Project.query.all()
    project_list = defaultdict(list)
    for pj in all_projects:
        if cur_user.check_permission(pj.group):
            project_dir = os.path.join(FLY_DIR, pj.folder, pj.name)
            lines = []
            if os.path.exists(project_dir):
                for line_dir in os.listdir(project_dir):
                    if os.path.exists(os.path.join(project_dir, line_dir, 'statistics.html')):
                        lines.append((line_dir, '/static/fly_projects/' + pj.folder +
                                      '/' + pj.name + '/' + line_dir + '/' + 'statistics.html'))
            project_list[pj.folder].append(
                (pj.id, pj.name, pj.description, lines))
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
