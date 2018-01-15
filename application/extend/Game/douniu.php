<?php

/**
 * Created by PhpStorm.
 * User: 10510
 * Date: 2017/6/26
 * Time: 21:17
 * 定义游戏规则配置数据格式如下
 * 底分：score【1,3,5,10,20】
 * 规则、牌型倍数：rule【1,2】，types【1,2,3】
 * 房卡游戏局数：gamenum【10:1,20:2】
 * 固定上庄：openroom【0,100,300,500】
 */
class douniu {

    /**
     * @var array|初始化纸牌数据
     */
    private $cards = array();

    /**
     * douniu constructor.
     * 构造函数
     * @param $cards  初始化纸牌数据
     */
    public function __construct($cards = array()) {
        if (empty($cards)) {
            //产生一个长度为52的自然数组，代表52张牌
            $this->cards = range(1, 52);
            //将52张牌的顺序打乱，相当于洗牌
            shuffle($this->cards);
        } else {
            $this->cards = $cards;
        }
    }

    /**
     * 发牌 你你你
     */
    public function create($member) {
        $pai = "A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11,A12,A13,B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11,C12,C13,D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12,D13";
        $array = explode(",", $pai);
        shuffle($array); 
        $allCount = $member * 5;
        $paiInfo = array();
        for ($i = 0; $i < $allCount; $i++) {
            $paiInfo[floor($i / 5)][] = $array[$i];
        }
        return $paiInfo;
    }

    /**
     * 传入纸牌编号返回当前纸牌的点数
     * @param $i 纸牌序号
     * @return float|int
     */
    public function getscore($i) {
        $i = substr($i, 1);
        return $i < 10 ? $i : 10;
    }

    /**
     * 传入纸牌编号返回当前纸牌的点数
     * @param $i 纸牌序号
     * @return float|int
     */
    public function getscoreorigin($i) {
        return substr($i, 1);
    }

    /**
     * 传入纸牌编号，返回当前纸牌的名称
     * @param $i 纸牌序号
     * @return string
     */
    public function getcardname($i) {
        $name = array('方块 <span style="color:#f00;">♦</span> ', '草花 ♣ ', '红桃 <span style="color:#f00;">♥</span> ', '黑桃 ♠ ');
        $num = array('A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K');
        $namekey = ($i % 4) > 0 ? ($i % 4 - 1) : 3;
        $numkey = ceil($i / 4) - 1;
        return $name[$namekey] . $num[$numkey];
    }

    /**
     * 从传入数组中任意取出三个元素进行组合，返回所有可能
     * @param $a 原数组
     * @param $m 取出组合个数
     * @return array 返回数组
     */
    public function combination($a, $m) {
        $r = array();
        $n = count($a);
        if ($m <= 0 || $m > $n) {
            return $r;
        }
        for ($i = 0; $i < $n; $i++) {
            $t = array($a[$i]);
            if ($m == 1) {
                $r[] = $t;
            } else {
                $b = array_slice($a, $i + 1);
                $c = $this->combination($b, $m - 1);
                foreach ($c as $v) {
                    $r[] = array_merge($t, $v);
                }
            }
        }
        return $r;
    }

    /**
     * 计算牛的组合 aakel
     * @param array $cards
     * @return array
     */
    public function niucount($cards = array()) {
        $count = array();
        $arr = $this->combination($cards, 3);
        foreach ($arr as $k => $v) {
            $sum = $this->getscore($v[0]) + $this->getscore($v[1]) + $this->getscore($v[2]);
            if ($sum % 10 == 0) {
                $count[] = $v;
            }
        }
        return $count;
    }

    public function getniuname($cards = array()) {
        $ret = $this->getniu($cards);
        if ($ret['niu'] === 0) {
            $result['cards'] = $ret['cards'];
            $result['niu'] = 10;
            return $result;
        }
        if ($ret['niu'] > 0) {
            $result['cards'] = $ret['cards'];
            $result['niu'] = $ret['niu'];
            return $result;
        }
        if ($ret['niu'] === false) {
            $result['cards'] = $ret['cards'];
            $result['niu'] = 0;
            return $result;
        }
    }

    public function getmax($cards) {
        $ret = array();
        foreach ($cards as $k => $v) {
            $namescore = (($v % 4) > 0 ? ($v % 4 - 1) : 3) + 1;
            $keyscore = $this->getscoreorigin($v);
            $ret[] = $namescore + $keyscore * $keyscore;
        }
        return max($ret);
    }

    public function ret($cards) {
        $type = $this->getniuname($cards);
        if ($type['niu'] !== false) {
            $type['niu'] += 13;
            $type['niu'] = $type['niu'] * $type['niu'] * $type['niu'] * $type['niu'];
        }
        $ret = $type['niu'] + $this->getmax($cards);

        return $ret;
    }
    public function getniu($cards) {

        $ismin = true;
        $ismax = true;
        $isbomb = false;
        $isbombcount = array();
        $totalscore = 0;
        foreach ($cards as $k => $v) {
            if ($this->getscore($v) > 5) {
                $ismin = false;
            }
            if ($this->getscoreorigin($v) <= 10) {
                $ismax = false;
            }
            $totalscore += $this->getscore($v);
            $paiValue = (int) $this->getscoreorigin($v);
            $isbombcount[] = $paiValue;
            $cardsInfo[$paiValue][] = $v;
        }

        $isbombarr = array_count_values($isbombcount);
        if (max($isbombarr) >= 4) {
            $isbomb = true;
        }
        if ($ismin && $totalscore < 10) {
            $result['niu'] = 13;
            $result['cards'] = $cards;
            return $result;
        }
        if ($isbomb) {
            $result['niu'] = 12;
            $result['cards'] = array_values($cardsInfo);
            return $result;
        }
        if ($ismax) {
            $result['niu'] = 11;
            $result['cards'] = $cards;
            return $result;
        }

        $return = array();
        $count = $this->niucount($cards);
        foreach ($count as $k => $v) {
            $ret = array_diff($cards, $v);
            $socre = 0;
            foreach ($ret as $val) {
                $socre += $this->getscore($val);
            }
            $return[$k] = $socre % 10;
        }
        if (count($return) > 0) {
            $result['niu'] = max($return);
            $paiKeys = array_keys($return, max($return));
            $arrayDiff = array_diff($cards, $count[$paiKeys[0]]);
            $result['cards'][0] = $count[$paiKeys[0]];
            $result['cards'][1] = array_values($arrayDiff);
            $result['niu'] = max($return);
            return $result;
        }
        $result['cards'] = $cards;
        $result['niu'] = false;
        return $result;
    }

}
