import os
import re
from flask import render_template, redirect, url_for, session, request

from . import main
from .. import db, HOST, BASE_DIR, VIDEO_DIR, OVERVIEW_DIR
from ..models import User


search_result_dict = dict()


@main.route('/')
def _index():
    return redirect(url_for('.index'))


@main.route('/video/')
def index():
    all_dirs = os.listdir(VIDEO_DIR)
    video_folders = [folder for folder in all_dirs if os.path.isdir(
        os.path.join(VIDEO_DIR, folder))]
    session['video_folders'] = video_folders
    return render_template('index.html', base_tag=HOST,
                           video_folders=video_folders,
                           login_status=session.get('login_status', False),
                           username=session.get('username', '访客')
                           )


@main.route('/overview/')
def overview():
    return render_template('overview.html')


@main.route('/video/<folder>/')
def explore_folder(folder):
    files = os.listdir(os.path.join(VIDEO_DIR, folder))
    if not files:
        return '<h1 style="font-weight:normal;margin-left:50px">该文件夹没有视频...</h1>'
    videos = [(folder, file[:-4]) for file in files if file[-4:] == '.mp4']
    return render_template('video.html', video_list=videos)


@main.route('/search')
def search():
    result = search_result_dict.get('search_result')
    if result is not None:
        return render_template('search.html')
    keywords = request.args.get('video_name')
    if keywords is None:
        return redirect(url_for('.index'))
    keywords = keywords.replace('+', ' ').strip()
    keywords = re.split(r'\s+', keywords)
    video_folders = session.get('video_folders')
    if not video_folders:
        all_dirs = os.listdir(VIDEO_DIR)
        video_folders = [folder for folder in all_dirs if os.path.isdir(
            os.path.join(VIDEO_DIR, folder))]
    search_result_dict['search_result'] = match(video_folders, keywords)
    return redirect(url_for('.search'))


def match(folders, keywords, basedir=VIDEO_DIR, file_type='.mp4'):
    result = []
    postfix_len = len(file_type)
    for folder in folders:
        files = os.listdir(os.path.join(basedir, folder))
        right_types = [filename[:-postfix_len]
                       for filename in files if filename[-postfix_len:] == file_type]
        for filename in right_types:
            for word in keywords:
                if word not in filename:
                    break
            else:
                result.append((folder, filename))
    return result


@main.route('/result/')
def search_result():
    result = search_result_dict.get('search_result')
    search_result_dict['search_result'] = None
    if not result:
        return '<h1 style="margin-left:50px">没有找到相关视频...</h1>'
    return render_template('video.html', video_list=result)


@main.route('/projects')
def projects():
    if session.get('role') != 'Admin':
        return '<h1>权限不足!</h1>'
    else:
        return redirect("http://192.10.15.156:8080/webrim/#/home")
