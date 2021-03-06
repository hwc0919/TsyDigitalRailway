import os
from flask import request, session, render_template, jsonify

from . import admin
from ..models import db, Role, User, Project
from .. import FLY_DIR, admin_required


# 管理员主页
@admin.route('/')
@admin_required
def admin_index():
    db.create_all()
    return render_template('admin/admin_index.html')


# ajax加载项目管理页面
@admin.route('/ajax_load/project_manage')
@admin_required
def ajax_load_project_manage():
    project_list = Project.query.order_by(Project.group, Project.id).all()
    return render_template('admin/project_manage.html', project_list=project_list)


# ajax加载用户管理页面
@admin.route('/ajax_load/user_manage')
@admin_required
def ajax_load_user_manage():
    user_list = User.query.order_by(User.id).all()
    return render_template('admin/user_manage.html', user_list=user_list)


# ajax加载角色管理页面
@admin.route('/ajax_load/role_manage')
@admin_required
def ajax_load_role_manage():
    role_list = Role.query.order_by(Role.id).all()
    return render_template('admin/role_manage.html', role_list=role_list)


# ajax加载权限管理页面
@admin.route('/ajax_load/permission_manage')
@admin_required
def ajax_load_permission_manage():
    user_list = User.query.order_by(User.id).all()
    role_list = Role.query.order_by(Role.id).all()
    return render_template('admin/permission_manage.html', user_list=user_list, role_list=role_list)


# 加载视频管理页面
@admin.route('/ajax_load/video_manage')
@admin_required
def ajax_load_video_manage():
    return render_template('admin/video_manage.html')


# 修改管理员表格
@admin.route('/ajax_edit/<edit_type>', methods=['POST'])
@admin_required
def ajax_edit_user_role(edit_type):
    data = request.form
    changes = []

    # 更改用户角色
    if edit_type == 'user-role':
        roles = {role.name: role for role in Role.query.all()}
        for key, value in data.items():
            user = User.query.filter_by(id=key).first()
            user.role = roles[value]
            changes.append(user)

    # 更改用户权限
    elif edit_type == 'user-permission':
        for key, value in data.items():
            user = User.query.filter_by(id=key).first()
            user.permission = value
            user.set_permission()
            changes.append(user)

    # 更改角色权限
    elif edit_type == 'role-permission':
        for key, value in data.items():
            role = Role.query.filter_by(id=key).first()
            role.permission = value
            role.set_permission()
            changes.append(role)

    # 增加角色
    elif edit_type == 'append-role':
        rid, name, description, permission = data.values()
        role = Role(id=rid, name=name, description=description,
                    permission=permission)
        changes.append(role)

    # 删除角色
    elif edit_type == 'delete-role':
        role = Role.query.filter_by(id=data['rid']).first()
        if role.default == True:
            return jsonify({'status': False, 'message': '默认角色不可删除'})
        elif role.name == 'Admin':
            return jsonify({'status': False, 'message': '管理员角色不可删除'})
        try:
            db.session.delete(role)
            db.session.commit()
            return jsonify({'status': True, 'message': '删除成功'})
        except Exception as err:
            return jsonify({'status': False, 'message': '操作失败, 原因: ' + str(err)})

    # 更改项目分组
    elif edit_type == 'project-group':
        for key, value in data.items():
            pj = Project.query.filter_by(id=key).first()
            pj.group = value
            changes.append(pj)

    elif edit_type == 'delete-project':
        pj = Project.query.filter_by(id=data['pid']).first()
        try:
            db.session.delete(pj)
            db.session.commit()
            return jsonify({'status': True, 'message': '删除成功'})
        except Exception as err:
            return jsonify({'status': False, 'message': '操作失败, 原因: ' + str(err)})

    # 未知指令
    else:
        return jsonify({'status': False, 'message': '操作失败, 未知命令'})

    # 更新数据库
    try:
        db.session.add_all(changes)
        db.session.commit()
        return jsonify({'status': True, 'message': '修改成功'})
    except Exception as err:
        db.session.rollback()
        return jsonify({'status': False, 'message': '操作失败, 原因: ' + str(err)})


# 查询新增项目, 更新到数据库
@admin.route('/ajax_update/projects')
@admin_required
def ajax_update_projects():
    all_folders = os.listdir(FLY_DIR)
    project_list = []
    for folder in all_folders:
        folder_path = os.path.join(FLY_DIR, folder)
        if not os.path.isdir(folder_path):
            continue
        pj_names = os.listdir(folder_path)
        for pj_name in pj_names:
            project_url = os.path.join(folder_path, pj_name, 'main.fly')
            if os.path.isfile(project_url):
                project_list.append(
                    (folder, pj_name, project_url.replace(" ", "%20")))
    all_projects_names = db.session.query(Project.name).all()
    changes = []
    for folder, pj_name, project_url in project_list:
        if (pj_name,) not in all_projects_names:
            des_path = os.path.join(FLY_DIR, folder, pj_name, 'note.txt')
            if os.path.isfile(des_path):
                try:
                    with open(des_path, 'r', encoding='utf-8') as f:
                        description = f.read()
                except UnicodeDecodeError:
                    description = "(请使用utf-8编码)"
            else:
                description = ""
            new_pj = Project(name=pj_name, folder=folder, url=project_url,
                             description=description)
            changes.append(new_pj)
    if not changes:
        return jsonify({'status': False, 'message': '没有改动'})
    try:
        db.session.add_all(changes)
        db.session.commit()
        return jsonify({'status': True, 'message': '扫描完成,新增{}个项目'.format(len(changes))})
    except Exception as err:
        db.rollback()
        return jsonify({'status': False, 'message': '操作失败, 原因: ' + str(err)})


# 更新项目描述
@admin.route('/ajax_update/project_description')
@admin_required
def ajax_update_project_description():
    changes = []
    all_projects = Project.query.all()
    for project in all_projects:
        des_path = os.path.join(FLY_DIR, project.folder,
                                project.name, 'note.txt')
        if os.path.isfile(des_path):
            try:
                with open(des_path, 'r', encoding='utf-8') as f:
                    description = f.read()
            except UnicodeDecodeError:
                description = '(请使用utf-8编码)'
        else:
            description = '(暂无描述)'
        if description != project.description:
            changes.append(project)
    try:
        db.session.add_all(changes)
        db.session.commit()
        return jsonify({'status': True, 'message': '扫描完成, 更新{}个描述'.format(len(changes))})
    except Exception as err:
        db.rollback()
        return jsonify({'status': False, 'message': '操作失败, 原因: ' + str(err)})
