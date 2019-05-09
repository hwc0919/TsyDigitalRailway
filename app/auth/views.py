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
        log = Log(username=username, log_type='login', content='user login')
        try:
            db.session.add(log)
            db.session.commit()
        except Exception as err:
            db.session.rollback()
            with open('log/error.txt', 'a', encoding='utf-8') as f:
                f.write(datetime.datetime())
                f.write(', ' + err + '\n')
        return json.dumps({'status': True, 'message': '登陆成功', 'url': '/video'})


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
        username = form.get('username')
        if User.query.filter_by(username=username).first() != None:
            return json.dumps({'status': False, 'error_field': 'username_field', 'message': '用户名已存在'})
        if User.query.filter_by(realname=form.get('realname')).first() != None:
            return json.dumps({'status': False, 'error_field': 'realname_field', 'message': '真实姓名重复'})
        if User.query.filter_by(email=form.get('email')).first() != None:
            return json.dumps({'status': False, 'error_field': 'email_field', 'message': '该邮箱已被注册'})
        information = {
            'username': username,
            'email': form.get('email'),
            'realname': form.get('realname'),
            'phone': form.get('phone'),
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
            log = Log(username=username,
                      log_type='register', content=message)
            db.session.add(log)
            db.session.commit()
            session['username'] = username
            session['login_status'] = True
            session['role'] = 'Guest'
            return json.dumps({'status': True, 'message': '注册成功', 'url': '/video'})
        except Exception as err:
            db.session.rollback()
            message = 'register failure, data: ' + \
                str(information) + ', ' + 'reason: ' + str(err)
            log = Log(username=username,
                      log_type='register', content=message)
            try:
                db.session.add(log)
                db.session.commit()
            except Exception as err2:
                db.session.rollback()
                with open('log/error.txt', 'a') as f:
                    f.write(datetime.datetime())
                    f.write(', ' + err + ', ' + err2 + '\n')
            return json.dumps({'status': False, 'error_field': 'overall_field', 'message': '服务器错误, 注册失败'})
