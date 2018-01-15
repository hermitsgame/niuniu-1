<?php

namespace app\admin\controller;

use think\Db;
use think\Controller;

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/7/20
 * Time: 11:32
 */
class Notice extends Common {

    public function notice($return = false) {
        $notice = Db::query("select * from t_notice");
        if (isset($notice[0])) {
            $noticeInfo = $notice[0];
        } else {
            $noticeInfo = false;
        }
        $this->assign('noticeInfo', $noticeInfo);
        return $this->fetch();
    }

    public function insertNotice() {
        $content = input('content');
        $time = input('time');
        $status = input('status');
        $notice = Db::query("select * from t_notice");
        if (isset($notice[0])) {
            $sql = "update t_notice set content='" . $content . "', showtime=" . $time . ", status=" . $status . "   where id =" . $notice[0]['id'];
        } else {
            $sql = "INSERT INTO t_notice (content,showtime,status) VALUES ('" . $content . "'," . $time . "," . $status . ")";
        }
        Db::query($sql);

        $this->success('更新成功', url('notice'));

    }

}
