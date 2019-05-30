import os
from app import create_app, db
from app.models import User, Role, Log


app = create_app(os.getenv('FLASK_CONFIG') or 'default')


@app.shell_context_processor
def make_shell_context():
    return dict(db=db, User=User, Role=Role, Log=Log)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8010, debug=1)
