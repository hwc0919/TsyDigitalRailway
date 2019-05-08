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
    username = db.Column(db.String(64), unique=True, index=True)
    phone = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(64), nullable=False, unique=True, index=True)
    realname = db.Column(db.String(20), nullable=False, index=True)
    company = db.Column(db.String(64))
    department = db.Column(db.String(64))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    password_hash = db.Column(db.String(128),
                              default=generate_password_hash('user1418'))
    gender = db.Column(db.Enum('M', 'F', name='gender_enum'))
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
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.DateTime, default=datetime.datetime.now())
    log_type = db.Column(db.String(20))
    content = db.Column(db.Text)

    def __repr__(self):
        return '<Log, time: {}, log_type: {}, content: {}...>'.format(self.time, self.log_type, self.content[:10])


def add_role_data(db, Role, User):
    admin_role = Role(
        name='Admin', description='Administration authority, have access to all.')
    mod_role = Role(
        name='Moderator', description='Moderate authority, have rights to alter data.')
    user_role = Role(
        name='User', description='User authority, have read-only access to data.')
    guest_role = Role(
        name='Guest', description='Guest authority, only have access to videos.')
    guest_user = User(username='guest', password='guest', realname='guest',
                      email='guest', phone='00000000', role=guest_role)
    db.session.add_all(
        [admin_role, mod_role, user_role, guest_role, guest_user])
    db.session.commit()


def add_testing_user_data(db, Role, User):
    admin_role = Role.query.filter_by(name='Admin').first()
    mod_role = Role.query.filter_by(name='Moderator').first()
    user_role = Role.query.filter_by(name='User').first()
    admin = User(username='admin', password='admin', realname='admin',
                 email='admin', phone='00000001', role=admin_role)
    mod = User(username='mod', password='mod',
               realname='mod', email='mod', phone='00000002', role=mod_role)
    user = User(username='user', password='user', realname='user',
                email='user', phone='00000003', role=user_role)
    hwc = User(username='hwc0919', password='123456', realname='何莞晨',
               email='hwc14@qq.com', phone='17888830919', role=admin_role)
    db.session.add_all([admin, mod, user, hwc])
    db.session.commit()
