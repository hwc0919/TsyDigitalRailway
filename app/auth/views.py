from flask import render_template, redirect, url_for

from . import auth


@auth.route('/login/')
def _login():
    return redirect(url_for('.login'))


@auth.route('/video/login/')
def login():
    return render_template('auth/login.html')
