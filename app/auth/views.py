import datetime
import json

from flask import redirect, render_template, request, session, url_for, flash

from ..models import db, Role, User, Log
from . import auth


# 响应登录ajax请求
@auth.route('/auth/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    user = User.query.filter_by(username=username, delete=False).first()
    # 检测登录信息是否合法
    if not user:
        return json.dumps({'status': False, 'message': '用户不存在', 'url': None})
    elif not user.verify_password(password):
        return json.dumps({'status': False, 'message': '用户名或密码错误', 'url': None})
    else:
        # 记录登录成功日志到数据库
        try:
            log = Log(username=username, log_type='login',
                      content='user login')
            db.session.add(log)
            db.session.commit()
        # 重定向到文件 log/error.txt
        except Exception as err:
            db.session.rollback()
            with open('log/error.txt', 'a', encoding='utf-8') as f:
                f.write(str(datetime.datetime.now()))
                f.write('\n' + str(err) + '\n' + '-'*20 + '\n')
        # 返回登录成功信息至前端
        finally:
            session['username'] = username
            session['login_status'] = True
            session['role'] = user.role.name
            return json.dumps({'status': True, 'message': '登陆成功', 'url': '/video'})


# 响应注销ajax请求
@auth.route('/auth/logout/')
def logout():
    login_status = session.get('login_status', False)
    if not login_status:
        return json.dumps({'status': False, 'message': '尚未登录!', 'url': None})
    session['login_status'] = False
    session['username'] = None
    session['role'] = None
    return json.dumps({'status': True, 'message': '退出成功', 'url': '/video'})


# 响应权限检查ajax请求
@auth.route('/auth/check_auth', methods=['GET', 'POST'])
def check_auth():
    role = session.get('role', 'Guest')
    status = False
    message = role + '权限'
    status = (role == 'Admin')
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
            'username': username,
            'email': form.get('email'),
            'realname': form.get('realname'),
            'phone': form.get('phone'),
            'company': form.get('company'),
            'department': form.get('department'),
            'role': Role.query.filter_by(name='Guest').first()
        }
        # 添加新用户到数据库, 添加注册日志到数据库
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
            return json.dumps({'status': True,
                               'message': '注册成功',
                               'url': '/video'})
        # 记录错误日志到数据库
        except Exception as err:
            db.session.rollback()
            message = 'register failure, data: ' + \
                str(information) + ', ' + 'reason: ' + str(err)
            try:
                log = Log(username=username,
                          log_type='register', content=message)
                db.session.add(log)
                db.session.commit()
            # 记录日志出错, 则重定向到文件 'log/error.txt'
            except Exception as err2:
                db.session.rollback()
                with open('log/error.txt', 'a', encoding='utf-8') as f:
                    f.write(str(datetime.datetime.now()) + '\n')
                    f.write(message + '\n' + str(err) + '\n' +
                            str(err2) + '\n' + '-'*20 + '\n')
            # 返回注册失败信息至前端
            finally:
                return json.dumps({'status': False,
                                   'error_field': 'overall_field',
                                   'message': '服务器错误, 注册失败'})


# 返回用户个人中心
@auth.route('/account/')
def account():
    if not session.get('login_status'):
        flash("尚未登录")
        return redirect("/video")
    userinfo = {}
    user = User.query.filter_by(username=session.get('username')).first()
    return render_template('auth/account.html', user=user)
