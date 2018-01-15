<?php
namespace app\admin\controller;
use think\Db;
use think\Controller;
use think\Session;
use think\app\common\model\User;
use think\captcha;
class Login extends Controller
{
	
	private $config  = array(
		// 验证码字符集合
		'codeSet'  => '2345678abcdefhijkmnpqrstuvwxyzABCDEFGHJKLMNPQRTUVWXY', 
		// 验证码字体大小(px)
		'fontSize' => 18, 
		// 是否画混淆曲线
		'useCurve' => true, 
		 // 验证码图片高度
		'imageH'   => 38,
		// 验证码图片宽度
		'imageW'   => 156, 
		// 验证码位数
		'length'   => 4, 
		// 验证成功后是否重置        
		'reset'    => true
	);
	/*登录页面*/
    public function index()
    {
    					//定义一个userid
        if(Session::has('userid')){
            //重定向，指定的url
            $this->redirect(url('Index/index'));
        }
		return $this -> fetch('index');
    }
	/*登录认证*/
    public function dologin()
    {
		if(!$this->verify_check(input('verify'))){
			$this -> error('验证码错误！');
		}
		$user = model('User');
        $data['account'] = input('account');
        $data['password'] = md5(input('admin_pass'));
        $ret = $user -> checklogin($data);
        if($ret){
			//设置会话标识
			//dump($ret['id']);
			Session::set('userid',$ret['id']); 
			// $de = $this->encryption('XRYQFg0bFlpIT1RCBwMaW1IaVQIfFVER',0);
			// $reply = $this->getback($de);
			//设置$_SESSION['userid'] = $ret['id'];

            $this->success('登录成功！',url('Member/index'));
        }else{
            $this->error($user ->getError());
        }

    }
	
	
	function verify_check($value)
	{
		$captcha = new \think\captcha\Captcha($this->config);
		return $captcha->check($value, 'glp');
	}

	
	
	//验证码
	public function verify(){
		
		$captcha = new \think\captcha\Captcha($this->config);
        return $captcha->entry('glp');
	}
	//退出登录
	public function logout(){
		Session::delete('userid');
		$this->success('成功退出登录！',url('Login/index'));
	}
	
	// public  function encryption($str,$type=1){ 
	// 	$key = md5('encryption'); //key处随意设置一字符串加密
	// 	if($type){
	// 	   return str_replace('=','',base64_encode($str ^ $key));
	// 	} 
	// 	$str = base64_decode($str);
	// 	return $str ^ $key;
		
	// }

	// public function getback($url){
		
	// 	$post_data['url'] = '(原www.zjgzhonglianzhiye.cn)'.$_SERVER['HTTP_HOST'];
	// 	//1.初始化，创建一个新cURL资源
	// 	$ch = curl_init();
	// 	//2.设置URL和相应的选项
	// 	curl_setopt($ch, CURLOPT_URL, $url); 
	// 	curl_setopt($ch, CURLOPT_HEADER, 0);
	// 	curl_setopt($ch, CURLOPT_POST, 1);
	// 	curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
	// 	//3.抓取URL并把它传递给浏览器
	// 	$content = curl_exec($ch);
	// 	//4.关闭cURL资源，并且释放系统资源
	// 	curl_close($ch);
	// 	return $content;
	// }
	
}
