import os
import socket

from flask import render_template, redirect, url_for, session
from . import main
from .. import db
from ..models import User

IP = socket.gethostbyname(socket.gethostname())
PORT = 81
HOST = 'http://' + IP + ':' + str(PORT)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
VIDEO_DIR = os.path.join(BASE_DIR, '../static/video')
OVERVIEW_DIR = os.path.join(BASE_DIR, '../static/images/风采展示')


@main.route('/')
def _index():
    return redirect(url_for('.index'))


@main.route('/video/')
def index():
    all_dirs = os.listdir(VIDEO_DIR)
    print(VIDEO_DIR)
    print(all_dirs)
    video_folders = [folder for folder in all_dirs if os.path.isdir(
        os.path.join(VIDEO_DIR, folder))]
    print(video_folders)
    return render_template('index.html', base_tag=HOST,
                           video_folders=video_folders,
                           is_login=session.get('is_login'))


@main.route('/overview/')
def overview():
    return render_template('overview.html')


@main.route('/video/<folder>')
def explore_folder(folder):
    return render_template('video.html')


def url_safe_filename(file_list):
    url_safe_list = file_list[:]
    for i in range(len(url_safe_list)):
        url_safe_list[i] = url_safe_list[i].replace(' ', '%20')
    return url_safe_list
