测试地址
http://niunew.bubod.com


域名
http://niunew.bubod.com

游戏大厅
http://域名/game.php/index/index.html


个人中心
http://域名/game.php/myhome/index.html


制作红包
http://域名/game.php/redbag/index.html


作弊后台
http://域名/admin.php 


其他
6人牛游戏
http://域名/game.php/index/index0.html
9人牛游戏
http://域名/game.php/index/index9.html

邀请加入房间
http://域名/game.php/douniuplaywjy/comein/room_id/房间id.html

直接打开房间 也有加入房间的功能
http://域名/game.php/douniuplay/index/room_id/164.html


使用phpsocket_io框架起的 socket服务，提供最基本收发功能：
2120端口需要对外开放

socket监听16668， 并使用2121端口发送消息   

win系统需要运行
\workerman\start_for_win.bat  这个WIN系统的不能关闭

linux系统需要运行
php /workerman/start.php start


将sq_douniu3.sql 导入到mysql

安装redis服务并使用端口6379


如果需要接入微信登录功能，则需要有已认证的微信公众号
并在 vendor/hooklife/thinkphp5-wechat/config.php 配置key、secret等信息
授权成功回调登录地址是：
http://域名/game.phplogin/weixinloginback/

php需要安装 php-beast扩展，
$ unzip php-beast-master.zip
$ cd php-beast-master
$ phpize
$ ./configure --with-php-config=/php/bin/php-config 
$ sudo make && make install

编译好之后修改php.ini配置文件, 加入配置项: extension=beast.so, 重启php-fpm


~~~
douniu-h5  目录（或者子目录）
├─application           应用目录
│  ├─common/            公共模块目录（可以更改）
│  │   ├─model/         数据库model类
│  │   └─ ...           更多类库目录
│  │
│  ├─game/              游戏项目    访问格式为 http://域名/game.php/控制器类名/类方法名/
│  │   ├─controller/    控制器      对应控制器类  对应方法
│  │   └─view/          模板页面    存放控制器页面， /控制器类名/类方法名.html
│  │
│  ├─admin/             后台
│  │   ├─controller/    控制器
│  │   └─view/          模板页面
│  │
│  ├─member/            
│  │   ├─controller/    控制器
│  │   └─view/          模板页面
│  │
│  ├─index/             默认模块
│  │   ├─controller/    控制器
│  │   └─view/          模板页面
│  │    
│  ├─command.php        命令行工具配置文件
│  ├─common.php         公共函数文件
│  ├─config.php         公共配置文件
│  ├─route.php          路由配置文件
│  ├─tags.php           应用行为扩展定义文件
│  └─database.php       数据库配置文件
│
├─workerman-linux/      socket服务目录
│  ├─start_id.php       启动文件
│
├─thinkphp/             框架系统目录(不需要修改)
│
├─static/               静态资源目录（存放各个html页面的css/images/js）
│  ├─images/               
│  ├─css/                
│  ├─js/           
│  ├─game/ 
│  └─index/
│
├─extend/               扩展类库目录
├─runtime/              应用的运行时目录（可写，可定制）
├─vendor/               第三方类库目录（Composer依赖库，不需要修改）
├─composer.json         composer 定义文件
├─LICENSE.txt           授权说明文件
├─README.md             README 文件
├─index.php             默认入口文件
├─admin.php             后台入口文件
├─game.php              游戏入口文件

~~~


路由规则：
    http://域名/game.php/index/index.html

    对应的php文件是 
        /application/game/controller/Index.php function index(){}
    
    对应的模板文件是 
        /application/game/view/index/index.html(默认，可使用return $this->fetch('index69');方法另指定)


nginx配置
    server {
        listen   88;
        server_name  域名.com;
        root   /web_game/douniu-h5/;

        #access_log  /home/deploy/log/nginx/access.log";
        error_log /tmp/error.log;

        error_page  404 /404.html;

        location /{
                index  index.html index.htm index.php;
                #root    $root;

                if ( -f $request_filename) {
                        break;
                }
                if ( !-e $request_filename) {
                        rewrite ^/admin/(.*)$ /admin.php/$1 last;
                        rewrite ^/game/(.*)$ /game.php/$1 last;
                        rewrite ^(.*)$ /index.php/$1 last;

                        break;
                }
        }

        location ~* ^.+.(jpg|jpeg|gif|css|png|js|ico|xml)$ {
                    access_log        off;
                    expires           30d;
        }

        location ~ .+\.php($|/) {
                #try_files $uri =404;
                #fastcgi_pass unix:/tmp/php7-fpm.sock;
                #fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
                #fastcgi_index index.php;
                #include /usr/local/etc/nginx/fastcgi_params;

                fastcgi_split_path_info ^((?U).+.php)(/?.+)$;
                fastcgi_param PATH_INFO $fastcgi_path_info;

                fastcgi_pass   127.0.0.1:9000;
                fastcgi_index  index.php;
                fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
                include        fastcgi_params;

        }
    }

如想使用极速稳定版本：
  请联系QQ群：485841275
  或者请加QQ：1037012585


下载基于workermen 的phpsocket_io
http://www.workerman.net/phpsocket_io

webhooks
http://gitlab.liukelin.top/webhooks/?sign=gztuandai2017&d=eyJzaGVsbCI6ImNkIC92YXIvd3d3L2h0bWwvd2ViX2dhbWUvZG91bml1LWg1ICYmIC91c3IvYmluL2V4cGVjdCAgL3Zhci9zaGVsbF9maWxlL2dpdF9zaGVsbC5leHAifQ==

{"shell":"cd /var/www/html/web_game/douniu-h5 && /usr/bin/expect  /var/shell_file/git_shell.exp"}













