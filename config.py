import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'user1418'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PERMANENT_SESSION_LIFETIME = timedelta(days=2)
    SEND_FILE_MAX_AGE_DEFAULT = timedelta(seconds=1)

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or \
        'postgresql://postgres:user1418@localhost:5432/tsy_dev'


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or \
        'postgresql://postgres:user1418@localhost:5432/testdb'


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('PRODUCTION_DATABASE_URL') or \
        'postgresql://postgres:user1418@localhost:5432/tsy'


class HomeConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('HOME_DATABASE_URL') or \
        'postgresql://postgres:0392@localhost:5432/testdb'


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'home': HomeConfig,
    'default': DevelopmentConfig
}
