from werkzeug.security import generate_password_hash, check_password_hash

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
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(64), nullable=False, unique=True, index=True)
    realname = db.Column(db.String(20), nullable=False,
                         unique=True, index=True)
    company = db.Column(db.String(64))
    department = db.Column(db.String(64))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    password_hash = db.Column(db.String(128),
                              default=generate_password_hash('123456'))

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
