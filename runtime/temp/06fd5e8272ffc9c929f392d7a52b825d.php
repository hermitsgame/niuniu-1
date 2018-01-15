<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:86:"/Library/WebServer/nginx_www/douniu-h5-new/application/game/view/douniuplay/index.html";i:1510825935;}*/ ?>
<html>
    <head> 
        <meta charset="utf-8" /> 
        <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" /> 
        <meta name="format-detection" content="telephone=no" /> 
        <meta name="msapplication-tap-highlight" content="no" /> 
        <title><?php echo $room['room_number']; ?>号九人房间
        </title> 
        <link rel="stylesheet" type="text/css" href="/static/game9/css/bull_vue-2.0.3.css" /> 
        <link rel="stylesheet" type="text/css" href="/static/game9/css/alert-1.1.css" /> 
        <link rel="stylesheet" type="text/css" href="/static/game9/css/bullshop-1.0.css" /> 
        <script type="text/javascript" src="/static/game9/js/fastclick.js"></script> 
        <script type="text/javascript">

            window.addEventListener('load', function () {
                FastClick.attach(document.body);
            }, false);

            var newNum = "";
            var per = window.innerWidth / 530;
            var globalData = {
                "card": "<?php echo $menberInfo['cards']; ?>",
                "roomNumber": "<?php echo $room['room_number']; ?>",
                "baseUrl": "<?php echo \think\Config::get('site_url'); ?>/",
                "openId": "",
                "socket": "ws://<?php echo \think\Config::get('site_url_socket'); ?>:16667",
                "roomUrl": "<?php echo \think\Config::get('site_url'); ?><?php echo url('index', array('room_id' => input('room_id'))); ?>",
                "dealerNum": "18",
                "fileUrl": "<?php echo \think\Config::get('site_url'); ?>/",
                "imageUrl": "<?php echo \think\Config::get('site_url'); ?>/",
                "roomStatus": '<?php echo $room['roomStatus']; ?>',
                "scoreboard": '<?php echo $room['scoreboard']; ?>',
                "session": 'ZWE0NWM3MTQwMjM5NjBlY2JhMmJkMzIyZjZmZmI4Y2M=',
                "isAlertMsg": '0',
                "alertMsg": '',
                "isNotyMsg": "<?php echo $noticeInfo['status']; ?>",
                "notyMsg": "<?php echo $noticeInfo['content']; ?>",
                "notyTime": "<?php echo $noticeInfo['showtime']; ?>",
                "notySpeed": 10000,
                "hpUrl": "<?php echo \think\Config::get('site_url'); ?>/game.php/Myhome/homepage.html",
                "mhUrl": "<?php echo \think\Config::get('site_url'); ?>/game.php/index/index69.html",
                "dealerName": "大番薯",
            };
            var userData = {
                "id": "<?php echo $menberInfo['id']; ?>",
                "accountId": "<?php echo $menberInfo['id']; ?>",
                "nickname": "<?php echo $menberInfo['nickname']; ?>",
                "avatar": "<?php echo $menberInfo['photo']; ?>",
                "isAuthPhone": "0",
                "authCardCount": "10",
                "phone": "",
            };
            var configData = {
                "appId": "<?php echo $wxconfig['appId']; ?>",
                "timestamp": "<?php echo $wxconfig['timestamp']; ?>",
                "nonceStr": "<?php echo $wxconfig['nonceStr']; ?>",
                "signature": "<?php echo $wxconfig['signature']; ?>",
            };
            var historyInfo = {
                is_show: "<?php echo $historyInfo['is_show']; ?>",
                total_count: "<?php echo $historyInfo['total_count']; ?>",
                score: "<?php echo $historyInfo['score']; ?>",
                time: "<?php echo $historyInfo['time']; ?>",
            };
            var coinList = [1, 2, 4, 5];
        </script> 
    </head> 
    <body> 
        <div style="position: fixed; width: 100%; height: 100%; top: 0px; left: 0px; background: rgb(0, 0, 0); z-index: 115; display: none;" id="loading"> 
            <div class="load4"> 
                <div class="loader">
                    Loading...
                </div> 
            </div> 
        </div> 
        <script type="text/javascript" src="/static/game9/js/canvas.js"></script> 
        <script type="text/javascript" src="/static/game9/js/bull930-1.0.2.min.js"></script>

        <iframe id="ping_iframe" src=" weixinping://iframe " style="display: none;"></iframe>
        <iframe id="__WeixinJSBridgeIframe_SetResult" src="weixin://private/setresult/SCENE_HANDLEMSGFROMWX&amp;ZHVtbXk=" style="display: none;"></iframe>
        <iframe id="__WeixinJSBridgeIframe" src="weixin://dispatch_message/" style="display: none;"></iframe>
    </body>
</html>