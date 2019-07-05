import argparse
import datetime
import os
import time
from threading import Thread

base_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(base_dir)


class Demon:
    def __init__(self, port):
        self.port = port
        self.on = True

    def demon(self):
        print(f'\n数字铁路服务器守护进程运行中... {datetime.datetime.now()}')
        print(f'服务器将在{self.port}端口保持监听, 每隔30秒检测一次服务器状态\n')
        while True:
            result = os.popen(f'netstat -ano | findstr {self.port}')
            if not result.read():
                if not self.on:
                    print('Demon: 守护模式已关闭, 服务器不会重启')
                    time.sleep(60)
                    continue
                os.system(f"pythonw server.py --host 0.0.0.0 -p {self.port}")
                print(
                    f'\nDemon: 服务器重启 {datetime.datetime.now()}\n')
                with open('logs/demon.log', 'a') as f:
                    f.write(f'restart server at {datetime.datetime.now()}\n')
            time.sleep(30)

    def search(self):
        find = False
        f = os.popen(f'netstat -ano | findstr {self.port}')
        while True:
            line = f.readline()
            if not line:
                break
            pid = line.split()[-1]
            if pid != '0':
                find = True
                print(f'找到进程: {line}')
        if not find:
            print(f'没有找到监听 {self.port} 端口的进程')

    def kill(self, pid):
        os.system(f'taskkill /pid {pid} /F /t')

    def start(self):
        self.on = True
        print('启动守护模式')

    def stop(self):
        self.on = False
        print('停止守护模式')

    def print_help(self):
        print(f'\n输入 "search" 查询{self.port}端口已启动的服务器进程')
        print('输入 "kill <进程号>" 终止已启动的服务器进程')
        print('输入 "start" 启动守护模式(默认为启动状态)')
        print('输入 "stop" 终止守护模式(配合kill使用可不再重启服务器)\n')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('port', nargs='?',
                        help='port which the server will listen on')
    args = parser.parse_args()
    if not args.port:
        port = input("请输入服务器启动端口号(1024-65535, 默认为8000):")
    else:
        port = args.port
    try:
        port = int(port)
    except ValueError:
        port = 8000
    demon = Demon(port)
    t = Thread(target=demon.demon)
    t.start()
    demon.print_help()
    while True:
        op = input('\n请输入操作(输入help获取帮助):').strip()
        if op == 'help':
            demon.print_help()
        elif op == 'search':
            demon.search()
        elif op.startswith('kill'):
            pid = op.split()[-1]
            demon.kill(pid)
        elif op == 'start':
            demon.start()
        elif op == 'stop':
            demon.stop()
        else:
            print('输入错误, 请重试')


if __name__ == '__main__':
    main()
