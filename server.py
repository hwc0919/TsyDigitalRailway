import os

from app import create_app, db, IP, PORT
from app.models import User, Role


app = create_app(os.getenv('FLASK_CONFIG') or 'default')


@app.shell_context_processor
def make_shell_context():
    return dict(db=db, User=User, Role=Role)


if __name__ == '__main__':
    app.run(host=IP, port=PORT, debug=True)
