import json
import os
import re
import time

from flask import abort, redirect, render_template, request, session, url_for

from .. import BASE_DIR, OVERVIEW_DIR, VIDEO_DIR, db
from ..models import Role, User
from . import main


@main.route('/')
def _index():
    return redirect(url_for('.index'))


@main.route('/index/')
def index():
    all_dirs = os.listdir(VIDEO_DIR)
    video_folders = [folder for folder in all_dirs if os.path.isdir(
        os.path.join(VIDEO_DIR, folder))]
    show_login = request.args.get('show_login', False)
    return render_template('index.html', video_folders=video_folders, show_login=show_login)


@main.route('/ajax_load/overview/')
def ajax_load_overview():
    overview_files = os.listdir(OVERVIEW_DIR)
    overview_images = [file for file in overview_files
                       if file[-4:] == '.jpg' or file[-4:] == '.png']
    return render_template('overview.html', images=overview_images)


@main.route('/ajax_load/video/<folder>/')
def ajax_load_folder(folder):
    folder_dir = os.path.join(VIDEO_DIR, folder)
    if not os.path.isdir(folder_dir):
        return '<h1 class="placeholder">资源已被移除,请刷新页面...</h1>'
    files = os.listdir(folder_dir)
    if not files:
        return '<h1 class="placeholder">该文件夹没有视频...</h1>'
    video_list = [(folder, file[:-4]) for file in files if file[-4:] == '.mp4']
    return render_template('video.html', video_list=video_list)


# @main.route('/search')
# def search():
#     result = session.get('search_result')
#     if result is not None:
#         return render_template('search.html')
#     keywords = request.args.get('video_name')
#     if keywords is None:
#         return redirect(url_for('.index'))
#     keywords = keywords.replace('+', ' ').strip()
#     keywords = re.split(r'\s+', keywords)
#     video_folders = session.get('video_folders')
#     if not video_folders:
#         all_dirs = os.listdir(VIDEO_DIR)
#         video_folders = [folder for folder in all_dirs if os.path.isdir(
#             os.path.join(VIDEO_DIR, folder))]
#     session['search_result'] = match(video_folders, keywords)
#     return json.dumps({'status': True, 'message': '搜索成功', 'url': '/search'})

@main.route('/search', methods=['GET', 'POST'])
def search():
    keywords = request.form.get('keywords').strip().replace('+', ' ').lower()
    keywords = re.split(r'\s+', keywords)
    video_folders = [folder for folder in os.listdir(VIDEO_DIR)
                     if os.path.isdir(os.path.join(VIDEO_DIR, folder))]
    video_list = match(video_folders, keywords)
    session['search_result'] = video_list
    return render_template('search.html')


def match(folders, keywords, basedir=VIDEO_DIR, file_type='.mp4'):
    result = []
    postfix_len = len(file_type)
    for folder in folders:
        files = os.listdir(os.path.join(basedir, folder))
        right_types = [filename[:-postfix_len]
                       for filename in files if filename[-postfix_len:] == file_type]
        for filename in right_types:
            for word in keywords:
                if word not in filename.lower():
                    break
            else:
                result.append((folder, filename))
    return result


@main.route('/ajax_load/search_result')
def ajax_load_search_result():
    video_list = session.get('search_result')
    session['search_result'] = None
    if not video_list:
        return '<h1 class="placeholder">没有找到相关视频...</h1>'
    return render_template('video.html', video_list=video_list)
