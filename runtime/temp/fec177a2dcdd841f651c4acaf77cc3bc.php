<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:83:"/Library/WebServer/nginx_www/douniu-h5-new/application/game/view/index/index69.html";i:1511010441;}*/ ?>
<html ng-app="app" class="ng-scope">
<head>
    <style type="text/css">@charset "UTF-8";[ng\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\:form{display:block;}.ng-animate-shim{visibility:hidden;}.ng-anchor{position:absolute;}</style>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="format-detection" content="telephone=no">
<meta name="msapplication-tap-highlight" content="no">
<title> 马克牛牛-个人休闲</title>
<link rel="stylesheet" href="/static/home/css/loading.css">
<link rel="stylesheet" href="/static/home/css/homepage11-1.0.0.css">
<script src="https://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
 <script type="text/javascript" src="/static/js/fastclick.js"></script>

<script type="text/javascript">

	var socketData = {
        "bull9": "ws://<?php echo \think\Config::get('site_url_socket'); ?>:<?php echo \think\Config::get('socket1'); ?>", // 16667
        "bullfight": "",    
        "landlord": "",
        "bull": "ws://<?php echo \think\Config::get('site_url_socket'); ?>:<?php echo \think\Config::get('socket2'); ?>", // 16668
        "majiang": "", 
        "flower": "",
        "sangong":"",
	};
	  var configData = {
                "appId": "<?php echo $wxconfig['appId']; ?>",
                "timestamp": "<?php echo $wxconfig['timestamp']; ?>",
                "nonceStr": "<?php echo $wxconfig['nonceStr']; ?>",
                "signature": "<?php echo $wxconfig['signature']; ?>",
            };
        
	var per = window.innerWidth / 530;
	var newNum = "";
	var userData = {
		"accountId":"<?php echo $memberinfo['id']; ?>",
		"authCardCount":"10",
		"phone":"",	
		"isAuthPhone":"0",	
		"nickname":"<?php echo $memberinfo['nickname']; ?>",
		"avatar":"<?php echo $memberinfo['photo']; ?>",
	};
	window.addEventListener('load', function() {
		FastClick.attach(document.body);
	}, false);
	var globalData = {
		"card":"<?php echo $memberinfo['cards']; ?>",
		"isNotyMsg":'0',
		"notyMsg":'',
		"notyTime":'0',
		"notySpeed":4000,		
		"isAlertMsg":'0',
		"alertMsg":'',
		"fileUrl": "<?php echo \think\Config::get('site_url'); ?>/",
		"imageUrl": "<?php echo \think\Config::get('site_url'); ?>/",
		"session":'ZWE0NWM3MTQwMjM5NjBlY2JhMmJkMzIyZjZmZmI4Y2M=',
		"baseUrl":"<?php echo \think\Config::get('site_url'); ?>/",
		"openId":"",
		"dealerNum": "13",
		"sangongAlert":false,
		"sangongAlertText":"游戏部署中，敬请期待",
	};	
</script>

</head>

<body ng-controller="myCtrl" style="background: #000;" class="ng-scope">
<script>
	function errorAPI(part,receive){
		$.post("../error/onError",{
			"level":2,
			"part":part,
			"time":"",
			"err_message":"接收数据："+receive,
		},function(result){	      

		})
	}
</script>
<script src="/static/home/js/homepage13-1.0.4.min.js" type="text/javascript"></script>


</body>
<!-- 
<iframe id="ping_iframe" src=" weixinping://iframe " style="display: none;"></iframe>
<iframe id="__WeixinJSBridgeIframe_SetResult" src="weixin://private/setresult/SCENE_FETCHQUEUE&amp;eyJfX2pzb25fbWVzc2FnZSI6WyJ7XCJmdW5jXCI6XCJsb2dcIixcInBhcmFtc1wiOntcIm1zZ1wiOlwiX3J1bk9uM3JkQXBpTGlzdCA6IG9uVm9pY2VSZWNvcmRFbmQsb25Wb2ljZVBsYXlCZWdpbixvblZvaWNlUGxheUVuZCxvbkxvY2FsSW1hZ2VVcGxvYWRQcm9ncmVzcyxvbkltYWdlRG93bmxvYWRQcm9ncmVzcyxvblZvaWNlVXBsb2FkUHJvZ3Jlc3Msb25Wb2ljZURvd25sb2FkUHJvZ3Jlc3Msb25WaWRlb1VwbG9hZFByb2dyZXNzLG9uTWVkaWFGaWxlVXBsb2FkUHJvZ3Jlc3MsbWVudTpzZXRmb250LG1lbnU6c2hhcmU6d2VpYm8sbWVudTpzaGFyZTplbWFpbCx3eGRvd25sb2FkOnN0YXRlX2NoYW5nZSx3eGRvd25sb2FkOnByb2dyZXNzX2NoYW5nZSxoZE9uRGV2aWNlU3RhdGVDaGFuZ2VkLGFjdGl2aXR5OnN0YXRlX2NoYW5nZSxvbldYRGV2aWNlQmx1ZXRvb3RoU3RhdGVDaGFuZ2Usb25XWERldmljZUxhblN0YXRlQ2hhbmdlLG9uV1hEZXZpY2VCaW5kU3RhdGVDaGFuZ2Usb25SZWNlaXZlRGF0YUZyb21XWERldmljZSxvblNjYW5XWERldmljZVJlc3VsdCxvbldYRGV2aWNlU3RhdGVDaGFuZ2Usb25OZmNUb3VjaCxvbkJlYWNvbk1vbml0b3Jpbmcsb25CZWFjb25zSW5SYW5nZSxtZW51OmN1c3RvbSxvblNlYXJjaERhdGFSZWFkeSxvblNlYXJjaEltYWdlTGlzdFJlYWR5LG9uVGVhY2hTZWFyY2hEYXRhUmVhZHksb25TZWFyY2hJbnB1dENoYW5nZSxvblNlYXJjaElucHV0Q29uZmlybSxvblNlYXJjaFN1Z2dlc3Rpb25EYXRhUmVhZHksb25NdXNpY1N0YXR1c0NoYW5nZWQsc3dpdGNoVG9UYWJTZWFyY2gsb25QdWxsRG93blJlZnJlc2gsb25QYWdlU3RhdGVDaGFuZ2Usb25HZXRLZXlib2FyZEhlaWdodCxvbkdldFNtaWxleSxvbkFkZFNob3J0Y3V0U3RhdHVzLG9uR2V0QThLZXlVcmwsZGVsZXRlQWNjb3VudFN1Y2Nlc3Msb25HZXRNc2dQcm9vZkl0ZW1zLFdOSlNIYW5kbGVySW5zZXJ0LFdOSlNIYW5kbGVyTXVsdGlJbnNlcnQsV05KU0hhbmRsZXJFeHBvcnREYXRhLFdOSlNIYW5kbGVySGVhZGVyQW5kRm9vdGVyQ2hhbmdlLFdOSlNIYW5kbGVyRWRpdGFibGVDaGFuZ2UsV05KU0hhbmRsZXJFZGl0aW5nQ2hhbmdlLFdOSlNIYW5kbGVyU2F2ZVNlbGVjdGlvblJhbmdlLFdOSlNIYW5kbGVyTG9hZFNlbGVjdGlvblJhbmdlLHNob3dMb2FkaW5nLGdldFNlYXJjaEVtb3Rpb25EYXRhQ2FsbEJhY2ssb25OYXZpZ2F0aW9uQmFyUmlnaHRCdXR0b25DbGljayxvbkJhY2tncm91bmRBdWRpb1N0YXRlQ2hhbmdlXCJ9LFwiX19tc2dfdHlwZVwiOlwiY2FsbFwiLFwiX19jYWxsYmFja19pZFwiOlwiMTAwMFwifSIsIntcImZ1bmNcIjpcImxvZ1wiLFwicGFyYW1zXCI6e1wibXNnXCI6XCJzZXQgZm9udCBzaXplIHdpdGggd2Via2l0VGV4dFNpemVBZGp1c3Q6IDJcIn0sXCJfX21zZ190eXBlXCI6XCJjYWxsXCIsXCJfX2NhbGxiYWNrX2lkXCI6XCIxMDAxXCJ9Iiwie1wiZnVuY1wiOlwic2V0Rm9udFNpemVDYWxsYmFja1wiLFwicGFyYW1zXCI6e1wiZm9udFNpemVcIjpcIjJcIn0sXCJfX21zZ190eXBlXCI6XCJjYWxsXCIsXCJfX2NhbGxiYWNrX2lkXCI6XCIxMDAyXCJ9Il0sIl9fc2hhX2tleSI6ImFhNjIxMWFjNzg1ODU1MGYyM2EwZDMxMGFmMGUyN2ZjYjQ0YTBmOTgifQ==" style="display: none;"></iframe>
<iframe id="__WeixinJSBridgeIframe" src="weixin://dispatch_message/" style="display: none;"></iframe>
 -->
</html>