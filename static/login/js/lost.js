$(function(){
	
	//获取验证码
	var flag=true;
	var err=$('#errMsg');
	$('.resCode').on('click',function(){
		var reg1=/^1\d{10}$/;
		var tel=$('#phone').val();
		if(!$('#phone').val()){
			err.text('手机号不能为空');
		}else if(!reg1.test(tel)){
			err.text('请输入正确的手机号');
		}else if(flag){
			flag=false;
			
			$.ajax({
                type: 'GET',
                url: 'http://api.qianxiaoer88.com/app/Captcha/web?phone='+tel+"&type=1",
                dataType: 'json',
                success: function(data){ 
	                if(data.statusMsg=='手机号已被注册'){
	                	err.text(data.statusMsg);
	                	flag=true;
	                	return;
	                }                  
					err.text(data.statusMsg);
					counter();
                },
                error: function(xhr, type){
                   err.text('发送验证码失败');
                }
            });
		}

	})
	function counter(){
		// $('.resCode').addClass('getCode');
		var t=60;
		var timer=setInterval(function(){
			t--;
			if(t<0){
					$('.resCode').html('获取验证码');
					clearInterval(timer);
					flag=true;
				}else{
					$('.resCode').html(t+'s重新发送');
				}
		}, 1000);
	}


	
	//点击完成
	$('#lostSub').on('click',function(){
		var reg_phone=/^1\d{10}$/;
		var reg_code=/^\d{4}$/;
		var tel=$('#phone').val();
		var code=$('#code').val();
		var psw=$('#psw').val();
		

		//输入正则
		if(!tel){
			err.text('手机号码不能为空');
			return;
		}else if(!reg_phone.test(tel)){
			err.text('请输入正确的手机号');
			return;
		}
		if(!code){
			err.text('验证码不能为空');
			return;
		}else if(!reg_code.test(code)){
			err.text('请输入正确的验证码');
			return;
		}
		if(!psw){
			err.text('密码不能为空');
			return;
		}else if(psw.length<6){
			err.text('密码少于6位');
			return;
		}else if(psw.length>16){
			err.text('密码大于16位');
			return;
		}

		//验证通过提交数据
		jaxSubmit();
	});
	function jaxSubmit(){
		var tel=$('#phone').val();
		var psw=$('#psw').val();
		var msgcode=$('#code').val();
		$.ajax({
			type: 'POST',
			data: {
	                msgcode:msgcode,
	                phone:tel,
	                password:psw
		            },
			url: '{$Think.config.site_url}/app/wechatzhh/do_forget_pass',//忘记密码提交地址
			dataType: 'json',
			success: function (data) {
				err.text('修改成功!');	
			},
			error: function (xhr, type) {
				err.text('修改失败!');
				return false;
			}
		});
	}
})


