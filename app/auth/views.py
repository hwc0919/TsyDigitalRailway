import datetime
import re

from flask import redirect, render_template, request, session, url_for, flash, jsonify

from ..models import db, Role, User, Log
from .. import login_required
from . import auth


@auth.route('/login_required/')
def login():
    return redirect(url_for('main.index', show_login=True))

# 响应登录ajax请求
@auth.route('/auth/login', methods=['POST'])
def login_handler():
    username = request.form['username']
    password = request.form['password']
    user = User.query.filter_by(username=username, delete=False).first()
    # 检测登录信息是否合法
    if not user:
        return jsonify({'status': False, 'message': '用户不存在', 'url': None})
    elif not user.verify_password(password):
        return jsonify({'status': False, 'message': '用户名或密码错误', 'url': None})
    # 记录登录成功日志到数据库
    else:
        log = Log(username=username, log_type='login', content='user login')
        db.session.add(log)
        db.session.commit()
        session['login_status'] = True
        session['user'] = {'id': user.id,
                           'username': username,
                           'role_name': user.role.name,
                           'is_admin': user.is_admin()}
        session.permanent = True
        return jsonify({'status': True, 'message': '登陆成功, 即将自动跳转', 'url': '/'})


# 响应注销ajax请求
@auth.route('/auth/logout/')
def logout():
    login_status = session.get('login_status', False)
    session.clear()
    if not login_status:
        return jsonify({'status': False, 'message': '尚未登录!'})
    return jsonify({'status': True, 'message': '退出成功', 'url': '/'})


# 响应权限检查ajax请求
@auth.route('/auth/check_auth', methods=['GET', 'POST'])
def check_auth():
    role_name = session.get('user', {}).get('role_name', 'Guest')
    message = role_name + '权限'
    status = Role.query.filter_by(name=role_name).first().is_admin()
    return jsonify({'status': status, 'message': message, 'url': '/projects'})


# 返回注册页面, 响应注册ajax请求
@auth.route('/auth/register', methods=['GET', 'POST'])
def register():
    # GET 请求返回注册页面
    if request.method == 'GET':
        return render_template('auth/register.html')
    # POST 请求验证注册信息
    form = request.form

    email = form.get('email')
    at_pos = email.find('@')
    dot_pos = len(email) - 1 - email[::-1].find('.')
    if at_pos < 1 or dot_pos == len(email) or dot_pos - at_pos < 2:
        return jsonify({'status': False, 'error_field': 'email_field', 'message': '邮箱格式错误'})

    realname = form.get('realname')
    if realname[0] == ' ' or realname[-1] == ' ':
        return jsonify({'status': False, 'error_field': 'realname_field', 'message': '首尾不能为空'})
    elif len(realname) < 2:
        return jsonify({'status': False, 'error_field': 'realname_field', 'message': '姓名长度至少为2'})

    phone = form.get('phone')
    if not (phone == '' or re.match(r'^1[0-9]{10}$', phone)):
        return jsonify({'status': False, 'error_field': 'phone_field', 'message': '号码格式错误'})

    if request.args['type'] == 'register':
        username = form.get('username')
        if username[0] == ' ' or username[-1] == ' ':
            return jsonify({'status': False, 'error_field': 'username_field', 'message': '首尾不能为空'})
        elif not 3 <= len(username) <= 20:
            return jsonify({'status': False, 'error_field': 'username_field', 'message': '长度不合要求'})

        password = form.get('password')
        if not 6 <= len(password) <= 20:
            return jsonify({'status': False, 'error_field': 'password_field', 'message': '密码长度不和要求'})

        verify_password = form.get('verify-password')
        if not password == verify_password:
            return jsonify({'status': False, 'error_field': 'verify_password_field', 'message': '密码不一致'})

        # 检测用户名、邮箱是否重复
        if User.query.filter_by(username=username, delete=False).first() is not None:
            return jsonify({'status': False, 'error_field': 'username_field', 'message': '用户名已存在'})
        if User.query.filter_by(email=email, delete=False).first() is not None:
            return jsonify({'status': False, 'error_field': 'email_field', 'message': '该邮箱已被注册'})
        # 添加新用户到数据库, 添加注册日志到数据库
        new_user = User(
            username=username,
            email=email,
            realname=realname,
            phone=phone,
            company=form.get('company'),
            department=form.get('department'),
            password=password)
        db.session.add(new_user)
        db.session.commit()
        message = 'register success, id: {}, username: {}'.format(
            new_user.id, username)
        log = Log(username=username,
                  log_type='register', content=message)
        db.session.add(log)
        db.session.commit()
        session['login_status'] = True
        session['user'] = {'id': new_user.id,
                           'username': username,
                           'role_name': new_user.role.name,
                           'is_admin': new_user.is_admin()}
        return jsonify({'status': True,
                        'message': '注册成功',
                        'url': '/'})
    elif request.args['type'] == 'edit':
        user_id = request.args['id']
        if not (user_id == session.get('user', {}).get('id') or
                session.get('user', {}).get('is_admin', False)):
            return jsonify({'status': False, 'error_field': 'overall_field', 'message': 'Not authorized'})

        user = User.query.filter_by(id=user_id).first()
        user.realname = realname
        user.phone = phone
        user.email = email
        user.company = form.get("company")
        user.department = form.get("department")
        user.position = form.get("position")
        gender = form.get('gender')
        if not gender in ['0', '1', '2']:
            return ({'status': False, 'error_field': 'gender_field', 'message': '输入有误'})
        user.gender = int(gender)
        age = form.get('age')
        try:
            age = int(age)
        except ValueError:
            return jsonify({'status': False, 'error_field': 'age_field', 'message': '输入有误'})
        user.age = age
        user.description = form.get("description")
        db.session.add(user)
        db.session.commit()
        return jsonify({'status': True, 'message': '修改成功', 'url': '/account/' + user.username})


# 用户个人中心
@auth.route('/account/<username>')
def account(username):
    user = User.query.filter_by(username=username, delete=False).first()
    if not user:
        return render_template('error/404.html'), 404
    editable = user.id == session.get('user', {}).get('id') or \
        session.get('user', {}).get('is_admin', False)
    return render_template('auth/account.html', user=user, editable=editable)

# 通过id访问个人中心
@auth.route('/account/<int:uid>')
def account_by_id(uid):
    user = User.query.filter_by(id=uid).first()
    if not user:
        return render_template('error/404.html', error_message='该用户不存在'), 404
    editable = user.id == session.get('user', {}).get('id') or \
        session.get('user', {}).get('is_admin', False)
    return render_template('auth/account.html', user=user, editable=editable)

# 修改密码
@auth.route('/auth/change_password/<int:user_id>', methods=['GET', 'POST'])
def change_password(user_id):
    if not (user_id == session.get('user', {}).get('id') or
            session.get('user', {}).get('is_admin', False)):
        return jsonify({'status': False, 'message': 'Not authorized'})
    user = User.query.filter_by(id=user_id).first()
    form = request.form
    old_password = form.get("old-password")
    password = form.get("password")
    confirm_password = form.get("confirm-password")
    if not 6 <= len(password) <= 20:
        return jsonify({'status': False, 'error_field': 'password_field', 'message': '密码长度不合要求'})
    if not password == confirm_password:
        return jsonify({'status': False, 'error_field': 'confirm_password_field', 'message': '密码不一致'})
    if not user.verify_password(old_password):
        return jsonify({'status': False, 'error_field': 'old_password_field', 'message': '密码错误!'})

    db.session.add(user)
    db.session.commit()
    return jsonify({'status': True, 'message': '修改成功', 'url': '/account/' + user.username})
