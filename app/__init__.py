import os
import socket
from datetime import timedelta
from functools import wraps
from flask import Flask, render_template, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

from config import config


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
VIDEO_DIR = os.path.join(BASE_DIR, 'static/video')
OVERVIEW_DIR = os.path.join(BASE_DIR, 'static/images/风采展示')
FLY_DIR = os.path.join(BASE_DIR, 'static/fly_projects')

db = SQLAlchemy()


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=1)

    db.init_app(app)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from .projects import projects as projects_blueprint
    app.register_blueprint(projects_blueprint, url_prefix='/projects')

    from .admin import admin as admin_blueprint
    app.register_blueprint(admin_blueprint, url_prefix='/admin')

    return app


# 登录限制装饰器
def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if session.get('user', {}).get('login_status', False):
            return func(*args, **kwargs)
        else:
            return redirect(url_for('auth.login'))
    return wrapper


def admin_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if session.get('user', {}).get('is_admin', False):
            return func(*args, **kwargs)
        else:
            return False
    return wrapper
