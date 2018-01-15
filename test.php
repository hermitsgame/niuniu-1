<?php

$data = '{"operation":"PrepareJoinRoom","account_id":"138291","session":"ZWE0NWM3MTQwMjM5NjBlY2JhMmJkMzIyZjZmZmI4Y2M=","data":{"room_number":"1453075"}}';
//$return = https_post($data, "http://www.zjgzhonglianzhiye.cn/game.php/douniuplaywjy/PrepareJoinRoom");
//var_dump($return);
// 建立socket连接到内部推送端口
$client = stream_socket_client('wss://127.0.0.1:36666', $errno, $errmsg, 1);
// 推送的数据，包含uid字段，表示是给这个uid推送

// 发送数据，注意5678端口是Text协议的端口，Text协议需要在数据末尾加上换行符
fwrite($client, $data."\n");
// 读取推送结果
echo fread($client, 8192);

function https_post($data, $url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20); // 设置超时限制防止死循环
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json; charset=utf-8')
    );
    ob_start();
    curl_exec($ch);
    if (curl_errno($ch)) {
        //异常处理
        return curl_error($ch); //捕抓异常
    }
    $return_content = ob_get_contents();
    ob_end_clean();
    curl_close($ch);
    return $return_content;
}
