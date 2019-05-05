import os
import socket

from app import create_app, db
from app.models import User, Role
from app.main.views import IP, PORT

app = create_app(os.getenv('FLASK_CONFIG') or 'default')


@app.shell_context_processor
def make_shell_context():
    return dict(db=db, User=User, Role=Role)


if __name__ == '__main__':
    app.run(host=IP, port=PORT, debug=True)
