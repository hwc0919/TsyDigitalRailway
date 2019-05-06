import os
import socket
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

from config import config


IP = socket.gethostbyname(socket.gethostname())
PORT = os.environ.get('FLASK_PORT') or 80
HOST = 'http://' + IP + ':' + str(PORT)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
VIDEO_DIR = os.path.join(BASE_DIR, 'static/video')
OVERVIEW_DIR = os.path.join(BASE_DIR, 'static/images/风采展示')

db = SQLAlchemy()


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    db.init_app(app)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    return app
