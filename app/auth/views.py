import datetime
import json

from flask import redirect, render_template, request, session, url_for, flash

from ..models import db, Role, User, Log
from .. import HOST, login_required
from . import auth


@auth.route('/login_required/')
def login():
    return render_template('index.html', base_tag=HOST, show_login=True)

# 响应登录ajax请求
@auth.route('/auth/login', methods=['POST'])
def login_handler():
    username = request.form['username']
    password = request.form['password']
    user = User.query.filter_by(username=username, delete=False).first()
    # 检测登录信息是否合法
    if not user:
        return json.dumps({'status': False, 'message': '用户不存在', 'url': None})
    elif not user.verify_password(password):
        return json.dumps({'status': False, 'message': '用户名或密码错误', 'url': None})
    # 记录登录成功日志到数据库
    else:
        log = Log(username=username, log_type='login', content='user login')
        db.session.add(log)
        db.session.commit()
        session['user'] = {'login_status': True,
                           'id': user.id,
                           'username': username,
                           'role_name': user.role.name,
                           'is_admin': user.is_admin()}
        return json.dumps({'status': True, 'message': '登陆成功, 即将自动跳转', 'url': '/video'})


# 响应注销ajax请求
@auth.route('/auth/logout/')
def logout():
    login_status = session.get("user", {}).get('login_status', False)
    session['user'] = {}
    if not login_status:
        return json.dumps({'status': False, 'message': '尚未登录!', 'url': None})
    return json.dumps({'status': True, 'message': '退出成功', 'url': '/video'})


# 响应权限检查ajax请求
@auth.route('/auth/check_auth', methods=['GET', 'POST'])
def check_auth():
    role_name = session.get('user', {}).get('role_name', 'Guest')
    message = role_name + '权限'
    status = Role.query.filter_by(name=role_name).first().is_admin()
    return json.dumps({'status': status, 'message': message, 'url': '/projects'})


# 返回注册页面, 响应注册ajax请求
@auth.route('/auth/register', methods=['GET', 'POST'])
def register():
    # GET 请求返回注册页面
    if request.method == 'GET':
        return render_template('auth/register.html')
    # POST 请求验证注册信息
    else:
        form = request.form
        username = form.get('username')
        # 检测用户名、邮箱是否重复
        if User.query.filter_by(username=username, delete=False).first() is not None:
            return json.dumps({'status': False, 'error_field': 'username_field', 'message': '用户名已存在'})
        if User.query.filter_by(email=form.get('email'), delete=False).first() is not None:
            return json.dumps({'status': False, 'error_field': 'email_field', 'message': '该邮箱已被注册'})
        information = {
            'username': form.get('username'),
            'email': form.get('email'),
            'realname': form.get('realname'),
            'phone': form.get('phone'),
            'company': form.get('company'),
            'department': form.get('department'),
        }
        # 添加新用户到数据库, 添加注册日志到数据库
        new_user = User(**information,
                        password=request.form.get('password'))
        db.session.add(new_user)
        db.session.commit()
        message = 'register success, data: ' + str(information)
        log = Log(username=username,
                  log_type='register', content=message)
        db.session.add(log)
        db.session.commit()
        session['user'] = {'login_status': True,
                           'id': new_user.id,
                           'username': username,
                           'role_name': new_user.role.name,
                           'is_admin': new_user.is_admin()}
        return json.dumps({'status': True,
                           'message': '注册成功',
                           'url': '/video'})


# 返回用户个人中心
@auth.route('/account/<username>')
def account(username):
    user = User.query.filter_by(username=username, delete=False).first()
    if not user:
        return render_template('error/404.html'), 404
    editable = user.id == session.get('user', {}).get('id') or \
        session.get('user', {}).get('is_admin', False)
    return render_template('auth/account.html', user=user, editable=editable)


# 修改用户信息
@auth.route('/account/edit_profile/<user_id>', methods=['GET', 'POST'])
def edit_profile(user_id):
    if not (user_id == session.get('user', {}).get('id') or
            session.get('user', {}).get('is_admin', False)):
        return json.dumps({'status': False, 'message': 'Not authorized'})
    user = User.query.filter_by(id=user_id).first()
    form = request.form
    user.realname = form.get("realname")
    user.company = form.get("company")
    user.department = form.get("department")
    user.position = form.get("position")
    user.gender = int(form.get("gender"))
    user.description = form.get("description")
    if form.get('birthday') != '':
        birthday = datetime.datetime.strptime(
            form.get('birthday'), '%Y-%m-%d').date()
        user.birthday = birthday
    else:
        user.birthday = None
    db.session.add(user)
    db.session.commit()
    return json.dumps({'status': True, 'message': '修改成功', 'url': '/account/' + user.username})
