import argparse

from gevent import monkey

from server import app


monkey.patch_all()
parser = argparse.ArgumentParser()
parser.add_argument(
    '-p', '--port', help='Choose a port to run your server.', type=int, default=8001)


if __name__ == '__main__':
    from gevent import pywsgi
    args = parser.parse_args()
    server = pywsgi.WSGIServer(('127.0.0.1', args.port), app)
    server.serve_forever()
