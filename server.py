import os

from app import create_app, db, IP, PORT
from app.models import User, Role, Log, add_role_data, add_testing_user_data


app = create_app(os.getenv('FLASK_CONFIG') or 'default')


@app.shell_context_processor
def make_shell_context():
    db.create_all()
    add_role_data(db, Role, User)
    add_testing_user_data(db, Role, User)
    return dict(db=db, User=User, Role=Role, Log=Log)


if __name__ == '__main__':
    app.run(host=IP, port=PORT, debug=True)
