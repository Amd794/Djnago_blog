
#### 在服务器上的准备工作..
1. 安装好项目用到的`Python`。
    * sudo apt install python
    * sudo apt install python-pip
    * pip install --upgrade pip
2. 安装`virtualenv`以及`virutalenvwrapper`。并创建虚拟环境。
    * pip install virtualenv
    * pip install virtualenvwrapper
    * sudo apt install vim
    * vim ~/.bashrc 进入文件中，填入以下两行代码：
        ```python
        export WORKON_HOME=$HOME/.virtualenvs
        source /usr/local/bin/virtualenvwrapper.sh
        ```
    * source ~/.bashrc
3. 安装`git`：
    ```shell
    sudo apt install git
    ```
4. 为了方便XShell或者CRT连接服务器，建议安装`OpenSSH`：
    ```shell
    sudo apt install openssh-server openssh-client
    service ssh restart
    ```
5. 安装`MySQL`服务器和客户端 , 并安装memcached：
    ```shell
    sudo apt install mysql-server mysql-client
    sudo apt-get install libmysqld-dev
    sudo apt-get install memcached
    ```
6. 进入虚拟环境中，然后进入到项目所在目录，执行命令：`pip install -r requirements.txt`，安装好相应的包。
7. 在`mysql`数据库中，创建相应的数据库。
8. 执行`python manage.py migrate`命令，将迁移文件，映射到数据库中，创建相应的表。
9. 执行`python manage.py runserver 0.0.0.0:8000`，然后在你自己电脑上，在浏览器中输入`http://你的服务器的ip地址:8000/`，访问下网站所有页 面，确保所有页面都没有错误。
10. 设置`ALLOW_HOST`为你的域名，以及ip地址。
11. 设置`DEBUG=False`，避免如果你的网站产生错误，而将错误信息暴漏给用户。
12. 收集静态文件：`python manage.py collectstatic`。

### 针对本项目的初始化操作
1. `python manage.py makemigrations `  创建数据库映射   
2. `python manage.py migrate`    映射表到数据库


### 安装uwsgi
1. uwsgi是一个应用服务器，非静态文件的网络请求就必须通过他完成，他也可以充当静态文件服务器，但不是他的强项。uwsgi是使用python编写的，因此通过`pip install uwsgi`就可以了。(uwsgi必须安装在系统级别的Python环境中，不要安装到虚拟环境中)。
2. 使用命令`uwsgi --http :8000 --module django_blog.wsgi --vritualenv=/root/.virtualenvs/django1`。用`uwsgi`启动项目，如果能够在浏览器中访问到这个页面，说明`uwsgi`可以加载项目了。

### 编写uwsgi配置文件：
在项目的路径下面，创建一个文件叫做`django_blog_demo_uwsgi.ini`的文件
然后使用命令`uwsgi --ini django_blog_demo.ini`，看下是否还能启动这个项目。


### 安装nginx：
1. nginx是一个web服务器。用来加载静态文件和接收http请求的。通过命令`sudo apt install nginx`即可安装。
2. `nginx`常用命令：
    * 启动nginx：service nginx start
    * 关闭nginx：service nginx stop
    * 重启nginx：service nginx restart

### 收集静态文件：
静态文件应该让nginx来服务，而不是让django来做。首先确保你的`settings.py`文件中有一个`STATIC_ROOT`配置，这个配置应该指定你的静态文件要放在哪个目录下。那么我们可以执行以下命令：`python manage.py collectstatic`来收集所有静态文件，将这些静态文件放在指定的目录下。

### 编写nginx配置文件：
在`/etc/nginx/conf.d`目录下，新建一个文件，叫做`django_blog_demo.conf`，

```
写完配置文件后，为了测试配置文件是否设置成功，运行命令：`service nginx configtest`，如果不报错，说明成功。
每次修改完了配置文件，都要记得运行`service nginx restart`。

### 使用supervisor配置：
让supervisor管理uwsgi，可以在uwsgi发生意外的情况下，会自动的重启。
1. `supervisor`的安装：在系统级别的python环境下`pip install supervisor`。
2. 在项目的根目录下创建一个文件叫做`zlkt_supervisor.conf`。
    ```
然后使用命令`supervisord -c django_blog_supervisor.conf`运行就可以了。
以后如果想要启动`uwsgi`，就可以通过命令`supervisorctl -c django_blog_supervisor.conf`进入到管理控制台，然后可以执行相关的命令进行管理：
    * status                # 查看状态
    * start program_name    # 启动程序
    * restart program_name  # 重新启动程序
    * stop program_name     # 关闭程序
    * reload                # 重新加载配置文件
    * quit                  # 退出控制台



