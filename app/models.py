import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from . import db


class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    permission = db.Column(db.BigInteger, default=0)
    description = db.Column(db.String(128))
    users = db.relationship('User', backref='role', lazy='dynamic')
    default = db.Column(db.Boolean, default=False)

    def is_admin(self):
        return self.name == 'Admin'

    def __repr__(self):
        return '<Role, name: {}, id: {}>'.format(self.name, self.id)

    @staticmethod
    def add_test_data():
        admin_role = Role(
            name='Admin', description='Administration authority, have access to all.')
        mod_role = Role(
            name='Moderator', description='Moderate authority, have rights to alter data.')
        user_role = Role(
            name='User', description='User authority, have read-only access to data.')
        guest_role = Role(name='Guest', default=True,
                          description='Guest authority, only have access to videos.')
        system_user = User(username='system',
                           password='system', role=admin_role)
        server_user = User(username='server',
                           password='server', role=admin_role)
        guest_user = User(username='guest', password='guest', role=guest_role)
        db.session.add_all(
            [admin_role, mod_role, user_role, guest_role, system_user, server_user, guest_user])
        db.session.commit()


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, index=True)
    email = db.Column(db.String(64), index=True)
    realname = db.Column(db.String(20))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    password_hash = db.Column(db.String(128), nullable=False,
                              default=generate_password_hash('watermelon2019'))
    phone = db.Column(db.String(20))
    company = db.Column(db.String(64))
    department = db.Column(db.String(64))
    gender = db.Column(db.SmallInteger, default=0)    # 0: 保密 1: 男 2: 女
    birthday = db.Column(db.Date)
    position = db.Column(db.String(64))
    description = db.Column(db.Text)
    register_time = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    active = db.Column(db.Boolean, default=False)
    delete = db.Column(db.Boolean, default=False)

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        if self.role is None:
            self.role = Role.query.filter_by(default=True).first()

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_admin(self):
        return self.role.is_admin()

    def __repr__(self):
        return '<User, username: {}, role_id: {}>'.format(self.username, self.role_id)

    @staticmethod
    def add_test_data():
        admin_role = Role.query.filter_by(name='Admin').first()
        mod_role = Role.query.filter_by(name='Moderator').first()
        user_role = Role.query.filter_by(name='User').first()
        admin = User(username='admin', password='admin', role=admin_role)
        mod = User(username='mod', password='mod', role=mod_role)
        user = User(username='user', password='user', role=user_role)
        hwc = User(username='hwc0919', password='123456', realname='何莞晨',
                   email='hwc14@qq.com', phone='17888830919', role=admin_role)
        db.session.add_all([admin, mod, user, hwc])
        db.session.commit()


class Log(db.Model):
    __tablename__ = 'logs'
    id = db.Column(db.BigInteger, primary_key=True)
    time = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    username = db.Column(db.String(64), index=True, default='system')
    log_type = db.Column(db.String(20), default='system')
    content = db.Column(db.Text, default='default system error')

    def __repr__(self):
        return '<Log, time: {}, username: {}, log_type: {}, content: {}...>'.format(self.time, self.username, self.log_type, self.content[:10])
