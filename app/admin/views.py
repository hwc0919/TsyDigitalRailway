from flask import request, session, render_template, jsonify

from . import admin
from ..models import db, Role, User, Project


@admin.route('/')
def admin_index():
    return render_template('admin/admin_index.html')


@admin.route('/ajax_load/project_manage')
def ajax_load_project_manage():
    return render_template('admin/project_manage.html')


@admin.route('/ajax_load/user_manage')
def ajax_load_user_manage():
    user_list = User.query.order_by(User.id).all()
    return render_template('admin/user_manage.html', user_list=user_list)


@admin.route('/ajax_load/role_manage')
def ajax_load_role_manage():
    role_list = Role.query.order_by(Role.id).all()
    return render_template('admin/role_manage.html', role_list=role_list)


@admin.route('/ajax_load/permission_manage')
def ajax_load_permission_manage():
    user_list = User.query.order_by(User.id).all()
    role_list = Role.query.order_by(Role.id).all()
    return render_template('admin/permission_manage.html', user_list=user_list, role_list=role_list)


@admin.route('/ajax_load/video_manage')
def ajax_load_video_manage():
    return render_template('admin/video_manage.html')


@admin.route('/ajax_edit/<edit_type>', methods=['POST'])
def ajax_edit_user_role(edit_type):
    data = request.form
    changes = []

    if edit_type == 'user-role':
        roles = {role.name: role for role in Role.query.all()}
        for key, value in data.items():
            user = User.query.filter_by(id=key).first()
            user.role = roles[value]
            changes.append(user)

    elif edit_type == 'user-permission':
        for key, value in data.items():
            user = User.query.filter_by(id=key).first()
            user.permission = value
            changes.append(user)

    elif edit_type == 'role-permission':
        for key, value in data.items():
            role = Role.query.filter_by(id=key).first()
            role.permission = value
            changes.append(role)

    elif edit_type == 'append-role':
        rid, name, description, permission = data.values()
        role = Role(id=rid, name=name, description=description,
                    permission=permission)
        changes.append(role)

    elif edit_type == 'delete-role':
        role = Role.query.filter_by(id=data['rid']).first()
        if role.default == True or role.name == 'Admin':
            return jsonify({'status': False, 'message': '默认角色或管理员不可删除'})
        try:
            db.session.delete(role)
            db.session.commit()
            return jsonify({'status': True, 'message': '删除成功'})
        except Exception as err:
            return jsonify({'status': False, 'message': str(err)})

    else:
        return jsonify({'status': False, 'message': 'unrecognized type'})

    try:
        db.session.add_all(changes)
        db.session.commit()
        return jsonify({'status': True, 'message': '修改成功'})
    except Exception as err:
        db.session.rollback()
        return jsonify({'status': False, 'message': str(err)})
