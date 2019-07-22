import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from . import db

# 用户组别表
class Role(db.Model):
    # 表名
    __tablename__ = 'roles'
    # id 主键
    id = db.Column(db.Integer, primary_key=True)
    # 名称
    name = db.Column(db.String(64), unique=True)
    # 权限, 以小数点分隔的数字(例如 1 或 1.2.3)
    permission = db.Column(db.Text)
    # 以文本形式储存的权限转换码
    permission_integration = db.Column(db.Text)
    # 文字介绍
    description = db.Column(db.String(128))
    # 关联用户表中的用户
    users = db.relationship('User', backref='role', lazy='dynamic')
    # 是否为默认用户组(只有user_role是默认组)
    default = db.Column(db.Boolean, default=False)

    # 初始化, 默认权限为1
    def __init__(self, **kwargs):
        super(Role, self).__init__(**kwargs)
        if self.permission is None or self.permission == '':
            self.permission = '1'
        self.set_permission()

    # 检查是否为管理员
    def is_admin(self):
        return self.name == 'Admin'

    # 将权限转换为2为底的幂之和, 管理员权限为-1 (-1和任意正整数按位与结果均为正)
    def set_permission(self):
        pjgroup = self.permission.split('.')
        if '-1' in pjgroup:
            permission_integration = '-1'
        else:
            permission_integration = sum((2**int(i) for i in pjgroup))
        self.permission_integration = str(permission_integration)

    # 检查是否拥有分组为pjgroup的项目的访问权限
    def check_permission(self, pjgroup):
        return int(self.permission_integration) & (2 ** pjgroup) != 0

    def __repr__(self):
        return '<Role, name: {}, id: {}>'.format(self.name, self.id)

    # 测试数据(也是生产环境初始数据)
    @staticmethod
    def add_test_data():
        admin_role = Role(
            name='Admin', description='Administration authority, have access to all.', permission='-1')
        user_role = Role(
            name='User', description='User authority, have read-only access to data.', default=True)
        system_user = User(username='system',
                           password='tsy1418system', role=admin_role)
        server_user = User(username='server',
                           password='tsy1418server', role=admin_role)
        admin = User(username='admin', password='admin', role=admin_role)
        guest_user = User(username='guest', password='guest', role=user_role)
        db.session.add_all(
            [admin_role, user_role, system_user, server_user, admin, guest_user])
        db.session.commit()


# 用户表
class User(db.Model):
    # 表名
    __tablename__ = 'users'
    # id 主键
    id = db.Column(db.Integer, primary_key=True)
    # 用户名
    username = db.Column(db.String(20), nullable=False, index=True)
    # email
    email = db.Column(db.String(64), index=True)
    # 姓名
    realname = db.Column(db.String(20))
    # 用户组表外键, 用户组id
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    # 密码散列值
    password_hash = db.Column(db.String(128), nullable=False)
    # 电话
    phone = db.Column(db.String(20))
    # 单位
    company = db.Column(db.String(64))
    # 部门
    department = db.Column(db.String(64))
    # 性别
    gender = db.Column(db.SmallInteger, default=0)    # 0: 保密 1: 男 2: 女
    # 年龄
    age = db.Column(db.SmallInteger)
    # 职位
    position = db.Column(db.String(64))
    # 个人简介
    description = db.Column(db.Text)
    # 注册时间
    register_time = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    # 是否激活(预留)
    active = db.Column(db.Boolean, default=False)
    # 是否销户(预留)
    delete = db.Column(db.Boolean, default=False)
    # 权限, 同Role表
    permission = db.Column(db.Text)
    # 权限转换码, 同Role表
    permission_integration = db.Column(db.Text)

    # 初始化, 默认密码为 username1418, 默认权限为1
    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        if self.role is None:
            self.role = Role.query.filter_by(default=True).first()
        if self.password_hash is None:
            self.password = self.username + '1418'
        if self.permission is None or self.permission == '':
            self.permission = '1'
        self.set_permission()

    # 密码不可读
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    # 密码以散列值储存
    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    # 核对密码散列值
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    # 判断是否管理员
    def is_admin(self):
        return self.role.is_admin()

    # 设置权限, 同Role表
    def set_permission(self):
        pjgroup = self.permission.split('.')
        if '-1' in pjgroup:
            permission_integration = '-1'
        else:
            permission_integration = sum((2**int(i) for i in pjgroup))
        self.permission_integration = permission_integration

    # 检查权限, 包含用户权限和用户组权限, 两者满足其一就拥有pjgroup的访问权限
    def check_permission(self, pjgroup):
        return int(self.permission_integration) & (2 ** pjgroup) != 0 or\
            self.role.check_permission(pjgroup)

    def __repr__(self):
        return '<User, username: {}, role_id: {}>'.format(self.username, self.role_id)

    # 测试数据(生产环境不使用)
    @staticmethod
    def add_test_data():
        admin_role = Role.query.filter_by(name='Admin').first()
        user_role = Role.query.filter_by(name='User').first()
        user = User(username='user', password='user', role=user_role)
        hwc = User(username='hwc0919', password='123456', realname='何莞晨',
                   email='hwc14@qq.com', phone='17888830919', role=admin_role)
        db.session.add_all([user, hwc])
        db.session.commit()


# 日志表, 记录用户注册、登录信息
class Log(db.Model):
    # 表名
    __tablename__ = 'logs'
    # id 主键
    id = db.Column(db.BigInteger, primary_key=True)
    # 事件发生时间
    time = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    # 事件关联用户名
    username = db.Column(db.String(64), index=True, default='system')
    # 事件类型
    log_type = db.Column(db.String(20), default='system')
    # 事件内容
    content = db.Column(db.Text, default='default system error')

    def __repr__(self):
        return '<Log, time: {}, username: {}, log_type: {}, content: {}...>'.format(self.time, self.username, self.log_type, self.content[:10])


# 项目表
class Project(db.Model):
    # 表名
    __tablename__ = 'projects'
    # id 主键
    id = db.Column(db.Integer, primary_key=True)
    # 项目名称
    name = db.Column(db.String(64), nullable=False)
    # 项目所属文件夹
    folder = db.Column(db.String(20), nullable=False)
    # 项目描述
    description = db.Column(db.Text)
    # 项目url
    url = db.Column(db.String(128))
    # 项目分组, 用于检测用户权限
    group = db.Column(db.Integer, default=100)

    # def __init__(self, **kwargs):
    #     super(Project, self).__init__(**kwargs)

    def __repr__(self):
        return '<Project, group: {}, name: {}>'.format(self.id, self.name)
