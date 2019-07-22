import os
import socket
from datetime import timedelta
from functools import wraps
from flask import Flask, render_template, session, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy

from config import config


# 路径常量
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
VIDEO_DIR = os.path.join(BASE_DIR, 'static/video')
OVERVIEW_DIR = "\\\\192.10.15.200\\FLYProject\\其他资源\\风采展示"
FLY_DIR = "\\\\192.10.15.200\\FLYProject"

# 初始化数据库ORM
db = SQLAlchemy()


# 初始化服务器变量app
def create_app(config_name):
    app = Flask(__name__)
    # 载入配置
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    # db关联app
    db.init_app(app)

    # 注册蓝本
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from .projects import projects as projects_blueprint
    app.register_blueprint(projects_blueprint, url_prefix='/projects')

    from .admin import admin as admin_blueprint
    app.register_blueprint(admin_blueprint, url_prefix='/admin')

    return app


# 登录限定装饰器
def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if session.get('login_status', False):
            return func(*args, **kwargs)
        else:
            return redirect(url_for('auth.login'))
    return wrapper

# 管理员限定装饰器
def admin_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if session.get('user', {}).get('is_admin', False):
            return func(*args, **kwargs)
        else:
            return render_template('error/404.html', title='401 Not Authorized', error_message='没有权限')
    return wrapper
