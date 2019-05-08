import datetime
import json

from flask import redirect, render_template, request, session, url_for

from ..models import db, Role, User, Log
from . import auth


@auth.route('/auth/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    user = User.query.filter_by(username=username).first()
    if not user:
        return json.dumps({'status': False, 'message': '用户不存在', 'url': None})
    elif not user.verify_password(password):
        return json.dumps({'status': False, 'message': '用户名或密码错误', 'url': None})
    else:
        role = user.role.name
        session['username'] = username
        session['login_status'] = True
        session['role'] = role
        return json.dumps({'status': True, 'message': '登陆成功, 即将自动跳转...', 'url': '/video'})


@auth.route('/auth/logout')
def logout():
    login_status = session.get('login_status', False)
    if not login_status:
        return json.dumps({'status': False, 'message': '尚未登录!', 'url': None})
    session['login_status'] = False
    session['username'] = None
    session['role'] = None
    return json.dumps({'status': True, 'message': '退出成功', 'url': '/video'})


@auth.route('/auth/check_auth', methods=['GET', 'POST'])
def check_auth():
    role = session.get('role', 'Guest')
    status = False
    message = role + '权限'
    if role == 'Admin':
        status = True
    return json.dumps({'status': status, 'message': message, 'url': '/projects'})


@auth.route('/auth/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('auth/register.html')
    else:
        form = request.form
        if User.query.filter_by(username=form.get('username')).first() != None:
            return json.dumps({'status': False, 'error_field': 'username_field', 'message': '用户名已存在', 'url': None})
        if User.query.filter_by(realname=form.get('realname')).first() != None:
            return json.dumps({'status': False, 'error_field': 'realname_field', 'message': '真实姓名重复', 'url': None})
        if User.query.filter_by(email=form.get('email')).first() != None:
            return json.dumps({'status': False, 'error_field': 'email_field', 'message': '该邮箱已被注册', 'url': None})
        information = {
            'username': form.get('username'),
            'phone': form.get('phone'),
            'email': form.get('email'),
            'realname': form.get('realname'),
            'company': form.get('company'),
            'department': form.get('department'),
            'role': Role.query.filter_by(name='Guest').first()
        }
        try:
            new_user = User(**information,
                            password=request.form.get('password'))
            db.session.add(new_user)
            db.session.commit()
            message = 'register success, data: ' + str(information)
            return json.dumps({'status': True, 'message': '注册成功', 'url': '/video'})
        except Exception as err:
            message = 'register failure, data: ' + \
                str(information) + ', ' + 'reason: ' + str(err)
            db.session.rollback()
            return json.dumps({'status': False, 'error_field': 'overall_field', 'message': '注册失败'})
        finally:
            log = Log(log_type='register', content=message)
            db.session.add(log)
            db.session.commit()
