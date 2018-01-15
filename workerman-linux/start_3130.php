<?php

use Workerman\Worker;
use Workerman\Lib\Timer;

include __DIR__ . '/vendor/autoload.php';

global $tp_config;
// 获取 配置文件内容
$tp_config = @include __DIR__ . '/../application/config.php';

//创建一个变量存放所有房间
$connection_all = [];
$timer_all = [];
//创建一个Worker监听127.0.0.1:8000, 使用websocket协议通讯  
$ws_worker = new Worker("websocket://0.0.0.0:{$tp_config['socket1']}"); // 16667
//启动4个进程对外提供服务  
$ws_worker->count = 1;
$ws_worker->onConnect = function($connection) use($ws_worker, &$connection_all) {
    echo "\n" . $connection->getRemoteIp() . "连接服务器!\n";
};
//当接收到客户端发来的数据后显示数据并回发到客户端  
$ws_worker->onMessage = function($connection, $data) use ($ws_worker, &$connection_all, &$timer_all) {

    global $tp_config;
    $baseUrl = $tp_config['site_url'].'/';

    $ip = $connection->getRemoteIp();
    if ($ip == '127.0.0.1') {
        $data = str_replace('\\"', '"', str_replace('\r\n', '', $data));
        $data = ltrim($data, '"');
        $data = rtrim($data, '"');
    }
    echo "\n收到{$ip}发来消息\n";
    //显示数据  
    echo "you just received:           $data\n";
    //判断数据是不是@
    if ($data == '@') {
        $connection->send('@');
    }
    //解析数据
    $dataInfo = json_decode($data, true);
    if (isset($dataInfo['account_id']))
        $connection_all[$dataInfo['account_id']] = $connection->id; //保存连接    
//数据分发
    if ($dataInfo && isset($dataInfo['operation'])) {
        switch ($dataInfo['operation']) {
            case "CreateRoom"://创建房间
                $url = $baseUrl . "game.php/Game9/CreateRoom";
                echo "account_id：{$dataInfo['account_id']}创建房间中……";
                $httpData = https_post($data, $url);
                //给客户端推创建房间成功消息
                $connection->send($httpData);
                break;
            case "PrepareJoinRoom"://准备进入房间
                //请求控制器
                $url = $baseUrl . "game.php/Game9/PrepareJoinRoom";
                $returnData = https_post($data, $url);
                //向客户端推送数据  
                $connection->send($returnData);
                break;
            case "JoinRoom"://新人加入房间
                //请求控制器
                if (!isset($dataInfo['account_id']) || empty($dataInfo['account_id']))
                    break;
                $url = $baseUrl . "game.php/Game9/JoinRoom";
                $returnData = https_post($data, $url); //把玩家数据更新到数据库并且取得新的房间数据
                $room_id = json_decode($returnData, true);
                //向客户端推送数据  
                $connection->send($returnData);
                //找到自己所在房间的所有玩家数据
                $url = $baseUrl . 'game.php/Game9/AllGamerInfo';
                $allgamerinfo = https_post($data, $url);
                $games = json_decode($allgamerinfo, true);
                $games = array_column($games['data'], 'account_id');
                //取自己加入游戏的信息
                $url = $baseUrl . "game.php/Game9/UpdateGamerInfo";
                $returnData = https_post($data, $url); //把玩家数据更新到数据库并且取得新的房间数据
                echo "\nJoinRoom推送AllGamerInfo消息开始\n";
                var_dump(['connection_all' => $connection_all, 'games' => $games]);
                foreach ($games as $k => $v) {//给这个房间所有人发消息
                    //给除了自己以外的玩家推自己的游戏信息
                    if (isset($connection_all[$v]) && $v != $dataInfo['account_id']) {
                        //if(isset($connection_all[$v])){
                        if ($ws_worker->connections[$connection_all[$v]])
                            $ws_worker->connections[$connection_all[$v]]->send($returnData);
                    }
                }
                echo "\n准备给玩家: {$v} 推消息, 找到的连接是: {$connection_all[$v]}\n";
                if (isset($connection_all[$dataInfo['account_id']])) {
                    if ($ws_worker->connections[$connection_all[$dataInfo['account_id']]])
                        $ws_worker->connections[$connection_all[$dataInfo['account_id']]]->send($allgamerinfo);
                }
                echo "\nJoinRoom推送AllGamerInfo消息结束\n";
                break;
            case 'PullRoomInfo':
                $url = $baseUrl . 'game.php/Game9/AllGamerInfo';
                $allgamerinfo = https_post($data, $url);
                $gamers = json_encode($allgamerinfo, true);
                if (is_array($gamers)) {
                    $gamers = array_column($gamers, 'account_id');
                    if (is_array($gamers)) {
                        foreach ($games as $k => $v) {//给这个房间所有人发消息
                            if (isset($connection_all[$v])) {
                                if ($ws_worker->connections[$connection_all[$v]])
                                    $ws_worker->connections[$connection_all[$v]]->send($allgamerinfo);
                            }
                        }
                    }
                }
                $allgamerinfo = '';
                $gamers = '';
                unset($allgamerinfo, $gamers);
                break;
            case "ReadyStart"://游戏开始
                //请求控制器
                $url = $baseUrl . "game.php/Game9/ReadyStart";
                $returnData = https_post($data, $url);
				var_dump($returnData);
                $resultData = json_decode($returnData, true);
                if (is_array($resultData)) {
                    foreach ($resultData as $k => $v) {
                        foreach ($v['to'] as $key => $value) {
                            if (isset($ws_worker->connections[$connection_all[$value]]))
                                $ws_worker->connections[$connection_all[$value]]->send(json_encode($v['data']));
                        }
                        if (isset($dataInfo['data']['room_id']) && isset($v['data']['operation']) && $v['data']['operation'] == 'StartLimitTime') {
                            $room_id = $dataInfo['data']['room_id'];
//                            if (!isset($timer_all[1][$dataInfo['data']['room_id']])) {
                            if (isset($timer_all[1][$room_id])) {
                                Timer::del($timer_all[1][$room_id]);
                            }
                            if (isset($timer_all[2][$room_id])) {
                                Timer::del($timer_all[2][$room_id]);
                            }
                            if (isset($timer_all[3][$room_id])) {
                                Timer::del($timer_all[3][$room_id]);
                            }
                            if (isset($timer_all[4][$room_id])) {
                                Timer::del($timer_all[4][$room_id]);
                            }
                            //开局倒计时
                            $timer_all[1][$dataInfo['data']['room_id']] = Timer::add($v['data']['data']['limit_time'], 'GameAutoStart', [$dataInfo['data']['room_id'], $timer_all], false);
                            //抢庄定时器
                            $timer_all[2][$dataInfo['data']['room_id']] = Timer::add($v['data']['data']['limit_time'] + 10, 'GameStartTime', [$dataInfo['data']['room_id'], $timer_all], false);
                            //下注定时器
                            $timer_all[3][$dataInfo['data']['room_id']] = Timer::add($v['data']['data']['limit_time'] + 20, 'AutoStartMultiples', [$dataInfo['data']['room_id'], $timer_all], false);
                            //摊牌定时器
                            $timer_all[4][$dataInfo['data']['room_id']] = Timer::add($v['data']['data']['limit_time'] + 35, 'AutoStartShow', [$dataInfo['data']['room_id'], $timer_all], false);
//                            }
                        }
                        if (isset($dataInfo['data']['room_id']) && isset($v['data']['operation']) && $v['data']['operation'] == 'GameStart') {
                            $room_id = $dataInfo['data']['room_id'];
                            //收到开局数据，删除原有定时器，从新生成新的定时器
                            if (isset($timer_all[1][$room_id])) {
                                Timer::del($timer_all[1][$room_id]);
                            }
                            if (isset($timer_all[2][$room_id])) {
                                Timer::del($timer_all[2][$room_id]);
                            }
                            if (isset($timer_all[3][$room_id])) {
                                Timer::del($timer_all[3][$room_id]);
                            }
                            if (isset($timer_all[4][$room_id])) {
                                Timer::del($timer_all[4][$room_id]);
                            }
                            //生成新的定时器
                            //抢庄定时器
                            $timer_all[2][$dataInfo['data']['room_id']] = Timer::add(10, 'GameStartTime', [$room_id, $timer_all], false);
                            //下注定时器
                            $timer_all[3][$dataInfo['data']['room_id']] = Timer::add(20, 'AutoStartMultiples', [$room_id, $timer_all], false);
                            //摊牌定时器
                            $timer_all[4][$dataInfo['data']['room_id']] = Timer::add(35, 'AutoStartShow', [$room_id, $timer_all], false);
                        }
                    }
                }
                $returnData = '';
                unset($returnData);
                break;
            case "GrabBanker"://抢庄
                //请求控制器
                $url = $baseUrl . "game.php/Game9/GrabBanker";
                $returnData = https_post($data, $url);
                //向客户端推送数据
                $resultData = json_decode($returnData, true);
                if (is_array($resultData)) {
                    foreach ($resultData as $k => $v) {
                        foreach ($v['to'] as $key => $value) {
                            if (isset($ws_worker->connections[$connection_all[$value]]))
                                $ws_worker->connections[$connection_all[$value]]->send(json_encode($v['data']));
                        }
                        //判断游戏状态如果有人没有抢庄，产生一个确定庄家的http请求，并把结果推送到房间所有玩家
                        if (isset($v['data']['operation']) && $v['data']['operation'] == 'StartBet') {
                            //收到下注数据，删除原有定时器，从新生成新的定时器
                            $room_id = $dataInfo['data']['room_id'];
                            Timer::del($timer_all[2][$room_id]);
                            Timer::del($timer_all[3][$room_id]);
                            Timer::del($timer_all[4][$room_id]);
                            //生成新的定时器
                            //下注定时器
                            $timer_all[3][$dataInfo['data']['room_id']] = Timer::add(10, 'AutoStartMultiples', [$room_id, $timer_all], false);
                            //摊牌定时器
                            $timer_all[4][$dataInfo['data']['room_id']] = Timer::add(25, 'AutoStartShow', [$room_id, $timer_all], false);
                        }
                    }
                }
                $returnData = '';
                unset($returnData);
                break;
            case 'PlayerMultiples'://手动下注
                $url = $baseUrl.'game.php/Game9/PlayerMultiples';
                $result = https_post($data, $url);
                $resultArr = json_decode($result, true);
                if (is_array($resultArr)) {
                    foreach ($resultArr as $k => $v) {
                        foreach ($v['to'] as $key => $val) {
                            if (isset($ws_worker->connections[$connection_all[$val]]))
                                $ws_worker->connections[$connection_all[$val]]->send(json_encode($v['data']));
                        }
                        //判断游戏状态如果有人没有抢庄，产生一个确定庄家的http请求，并把结果推送到房间所有玩家
                        if (isset($v['data']['operation']) && $v['data']['operation'] == 'StartShow') {
                            //收到下注数据，删除原有定时器，从新生成新的定时器
                            $room_id = $dataInfo['data']['room_id'];
                            Timer::del($timer_all[3][$room_id]);
                            Timer::del($timer_all[4][$room_id]);
                            //生成新的定时器
                            //摊牌定时器
                            $timer_all[4][$dataInfo['data']['room_id']] = Timer::add(15, 'AutoStartShow', [$room_id, $timer_all], false);
                        }
                    }
                }
                $result = '';
                $resultArr = '';
                unset($result, $resultArr);
                break;
            case "ShowCard"://玩家手动摊牌
                isset($dataInfo['data']['room_id']) ? $room_id = $dataInfo['data']['room_id'] : $room_id = 0;
//请求控制器
                $url = $baseUrl . "game.php/Game9/PlayerShowCard";
                $returnData = https_post($data, $url);
				var_dump(['PlayerShowCard_request' => $returnData]);
//向客户端推送数据 
                $returnArr = json_decode($returnData, true);
                if (is_array($returnArr)) {
                    foreach ($returnArr as $key => $val) {
                        foreach ($val['to'] as $k => $v) {
                            if (isset($connection_all[$v]) && isset($ws_worker->connections[$connection_all[$v]])) {
                                if (isset($ws_worker->connections[$connection_all[$v]]))
                                    $ws_worker->connections[$connection_all[$v]]->send(json_encode($val['data']));
                            }
                        }
                        if (isset($val['data']['operation']) && $val['data']['operation'] == 'Win') {
                            Timer::del($timer_all[4][$room_id]);
                            unset($timer_all[1][$room_id]);
                            unset($timer_all[2][$room_id]);
                            unset($timer_all[3][$room_id]);
                            unset($timer_all[4][$room_id]);
                        }
                    }
                }
                $result = '';
                $resultArr = '';
                unset($result, $resultArr);
                break;
            case "Controller"://控制器发送
//向客户端推送数据  
                if (isset($dataInfo['to'])) {
                    foreach ($dataInfo['to'] as $key => $value) {
                        if (isset($connection_all[$value])) {
                            if (isset($ws_worker->connections[$connection_all[$value]]))
                                $ws_worker->connections[$connection_all[$value]]->send(json_encode($dataInfo['data']));
                        }
                    }
                }
                break;
            case 'BroadcastVoice':
                BroadcastVoice($data);
                break;
            default:
                break;
//$returnData = json_encode($dataInfo);
        }
    }
};

$ws_worker->onClose = function($connection) use($ws_worker, &$connection_all, &$timer_all) {

    global $tp_config;
    $baseUrl = $tp_config['site_url'].'/';

    $conn_key = array_search($connection->id, $connection_all);
    $onlineUrl = $baseUrl."game.php/Game9/onlineStatus";
    $returnData = https_post(json_encode(['account_id' => $conn_key, 'online' => 0]), $onlineUrl); //把玩家数据更新到数据库并且取得新的房间数据
    $resultData = json_decode($returnData, true);
    if (isset($resultData['to'])) {
        foreach ($resultData['to'] as $key => $value) {
            if (isset($ws_worker->connections[$connection_all[$value]]))
                $ws_worker->connections[$connection_all[$value]]->send(json_encode($resultData['data']));
        }
    }
    if ($conn_key) {
        $connection_all[$conn_key] = '';
        unset($connection_all[$conn_key]);
        $key = null;
        unset($conn_key);
    }
    echo "\nonClose触发操作结束：\n";
};

//运行worker  
$ws_worker->runAll();

function BroadcastVoice($data) {
    global $tp_config;
    $baseUrl = $tp_config['site_url'].'/';

    $url = $baseUrl.'game.php/Game9/BroadcastVoice';
    $result = https_post($data, $url);
    var_dump(['BroadcastVoice_http_result' => $result]);
    $result = json_decode($result, true);
    if (is_array($result) && isset($result['to'])) {//如果能解析成功，即转发消息
        send2room($result['to'], json_encode($result['data']));
    }
}

function GameResult($room_id) {//发送房间的游戏结果
    global $tp_config;
    $baseUrl = $tp_config['site_url'].'/';

    //请求本局结果推送
    $url = $baseUrl.'game.php/Game9/GameResult';
    $result = https_post(json_encode(['room_id' => $room_id]), $url);
    $data = https_post(json_encode(['room_id' => $room_id]), $url);
    if (is_array($data)) {//如果能解析成功，即转发消息
        send2room($data['to'], json_encode($data['data']));
    }
    if (isset($timer_all[$room_id]))
        Timer::del($timer_all[$room_id]); //删除原来的定时器
    $result = '';
    $data = '';
    unset($result, $data);
}

function AutoStartShow($room_id) {//自动摊牌回调函数
    global $tp_config;
    $baseUrl = $tp_config['site_url'].'/';

    $url = $baseUrl.'game.php/Game9/AutoStartShow';
    $result = https_post(json_encode(['room_id' => $room_id]), $url);
    var_dump(['AutoStartShow_result' => $result]);
    $data = json_decode($result, true);
    if (is_array($data)) {//如果能解析成功，即转发消息
        foreach ($data as $k => $v) {
            if (isset($v['to']))
                send2room($v['to'], json_encode($v['data']));
        }
    }
    $result = '';
    $data = '';
    unset($result, $data);
}

function AutoStartMultiples($room_id) {//自动下注回调函数
    global $tp_config;
    $baseUrl = $tp_config['site_url'].'/';

    echo "\n执行了AutoStartMultiples函数,接收到的参数值：{$room_id}  " . time() . "\n";
    $url = $baseUrl.'game.php/Game9/AutoStartMultiples';
    $result = https_post(json_encode(['room_id' => $room_id]), $url);
    var_dump(['AutoStartMultiples_result' => $result]);
    $data = json_decode($result, true);

    if (is_array($data)) {
        foreach ($data as $k => $v) {//如果能解析成功，即转发消息
            send2room($v['to'], json_encode($v['data']));
        }
    }
    $result = '';
    $data = '';
    unset($result, $data);
}

//发起一个抢庄请求，带薪上room_id
function GameStartTime($room_id) {
    global $tp_config;
    $baseUrl = $tp_config['site_url'].'/';

    echo "\n执行了GameStartTime函数,接收到的参数值：{$room_id}  " . time() . "\n";
    $url = $baseUrl.'game.php/Game9/GameStartTime';
    $result = https_post(json_encode(['room_id' => $room_id]), $url);
    var_dump(['GameStartTime_result' => $result]);
    $data = json_decode($result, true);
    if (is_array($data)) {//如果能解析成功，即转发消息
        foreach ($data as $k => $v) {
            send2room($v['to'], json_encode($v['data']));
        }
    }
    $result = '';
    $data = '';
    unset($result, $data);
}

//游戏自动开始回调函数
function GameAutoStart($room_id) {
    global $tp_config;
    $baseUrl = $tp_config['site_url'].'/';

    echo "\n执行了GameAutoStart函数,接收到的参数值：{$room_id}  " . time() . "\n";
    $url = $baseUrl.'game.php/Game9/GameAutoStart';
    $result = https_post(json_encode(['room_id' => $room_id]), $url);
    var_dump(['GameAutoStart_result' => $result]);
    $data = json_decode($result, true);
    if (is_array($data)) {//如果能解析成功，即转发消息
        foreach ($data as $k => $v) {
            send2room($v['to'], json_encode($v['data']));
        }
    }
    $result = '';
    $data = '';
    unset($result, $data);
}

function send2room(array $to, $msg) {//向$to的成员发送同一条消息
    global $ws_worker, $connection_all, $timer_all;
    foreach ($to as $k => $v) {
        if (isset($connection_all[$v]) && isset($ws_worker->connections[$connection_all[$v]])) {
            echo "\n当前发送给{$v} 的消息-{$msg}\n";
            $ws_worker->connections[$connection_all[$v]]->send($msg);
        }
    }
}

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
        return curl_error($ch); //捕抓异常
    }
    $return_content = ob_get_contents();
    ob_end_clean();
    curl_close($ch);
    return $return_content;
}
