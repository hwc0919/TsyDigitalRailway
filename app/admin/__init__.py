# 不能更改代码顺序!!!请勿使用IDE的代码格式化功能!!!

from flask import Blueprint          # 第一行

admin = Blueprint('admin', __name__)   # 第二行

from . import views                  # 第三行
