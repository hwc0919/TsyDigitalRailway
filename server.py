import argparse
import logging
import logging.handlers
import os
import sys

from app import create_app, db
from app.models import Log, Role, User

f = open('logs/stdout.txt', 'a', encoding='utf-8')
sys.stdout = f

app = create_app(os.getenv('FLASK_CONFIG') or 'default')

logging.basicConfig(level=logging.DEBUG)
filehandler = logging.handlers.TimedRotatingFileHandler(
    "logs/flask.log", "M", 1, 0, encoding='utf-8')
logging.getLogger().addHandler(filehandler)


@app.shell_context_processor
def make_shell_context():
    return dict(db=db, User=User, Role=Role, Log=Log)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--host', help='Set IP which your server will be listening.', type=str, default='127.0.0.1')
    parser.add_argument(
        '-p', '--port', help='Choose a port to run your server.', type=int, default=80)
    parser.add_argument(
        '-d', '--debug', help='Debug mode.', type=int, default=0)
    args = parser.parse_args()
    app.run(host=args.host, port=args.port, debug=args.debug)
