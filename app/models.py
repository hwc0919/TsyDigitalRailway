from werkzeug.security import generate_password_hash, check_password_hash
import datetime

from . import db


class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)
    description = db.Column(db.String(128))
    users = db.relationship('User', backref='role', lazy='dynamic')

    def __repr__(self):
        return '<Role, name: {}, id: {}>'.format(self.name, self.id)


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, index=True)
    email = db.Column(db.String(64), nullable=False, index=True)
    realname = db.Column(db.String(20), default='访客')
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False,
                              default=generate_password_hash('watermelon2019'))
    phone = db.Column(db.String(20))
    company = db.Column(db.String(64))
    department = db.Column(db.String(64))
    gender = db.Column(db.Boolean)
    birthday = db.Column(db.Date)
    register_time = db.Column(db.DateTime, default=datetime.datetime.now())
    delete = db.Column(db.Boolean, default=False)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User, username: {}, role_id: {}>'.format(self.username, self.role_id)


class Log(db.Model):
    __tablename__ = 'logs'
    id = db.Column(db.BigInteger, primary_key=True)
    time = db.Column(db.DateTime, default=datetime.datetime.now())
    username = db.Column(db.String(64), index=True, default='system')
    log_type = db.Column(db.String(20), default='system')
    content = db.Column(db.Text, default='default system error')

    def __repr__(self):
        return '<Log, time: {}, username: {}, log_type: {}, content: {}...>'.format(self.time, self.username, self.log_type, self.content[:10])


def add_role_data(db, Role, User):
    admin_role = Role(
        name='Admin', description='Administration authority, have access to all.')
    mod_role = Role(
        name='Moderator', description='Moderate authority, have rights to alter data.')
    user_role = Role(
        name='User', description='User authority, have read-only access to data.')
    guest_role = Role(
        name='Guest', description='Guest authority, only have access to videos.')
    system_user = User(username='system', password='system', realname='system',
                       email='system', role=admin_role)
    server_user = User(username='server', password='server', realname='server',
                       email='server', role=admin_role)
    guest_user = User(username='guest', password='guest', realname='guest',
                      email='guest', role=guest_role)
    db.session.add_all(
        [admin_role, mod_role, user_role, guest_role, system_user, server_user, guest_user])
    db.session.commit()


def add_testing_user_data(db, Role, User):
    admin_role = Role.query.filter_by(name='Admin').first()
    mod_role = Role.query.filter_by(name='Moderator').first()
    user_role = Role.query.filter_by(name='User').first()
    admin = User(username='admin', password='admin', realname='admin',
                 email='admin', role=admin_role)
    mod = User(username='mod', password='mod',
               realname='mod', email='mod', role=mod_role)
    user = User(username='user', realname='user',
                email='user', role=user_role)
    hwc = User(username='hwc0919', password='123456', realname='何莞晨',
               email='hwc14@qq.com', phone='17888830919', role=admin_role)
    db.session.add_all([admin, mod, user, hwc])
    db.session.commit()
