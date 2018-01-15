// var Words = "";
// function OutWord() {
//     var NewWords;
//     NewWords = unescape(Words);
//     //document.write(NewWords);
// }
// OutWord();
function cardText(value) {
    value = value.toString();
    var num, num1, numText;
    num = parseInt(value.substr(1, 2));
    num1 = parseInt(value.substr(0, 1));
    numText = "";
    if (value == 29900 || value == 30000) {
        numText = "二八杠";
    }
    else if (num1 > 2) {
        numText = "对子";
    }
    else if (num == 0) {
        numText = "零点";
    }
    else if (num == 5) {
        numText = "半点";
    }
    else if (num == 10) {
        numText = "一点";
    }
    else if (num == 15) {
        numText = "一点半";
    }
    else if (num == 20) {
        numText = "两点";
    }
    else if (num == 25) {
        numText = "两点半";
    }
    else if (num == 30) {
        numText = "三点";
    }
    else if (num == 35) {
        numText = "三点半";
    }
    else if (num == 40) {
        numText = "四点";
    }
    else if (num == 45) {
        numText = "四点半";
    }
    else if (num == 50) {
        numText = "五点";
    }
    else if (num == 55) {
        numText = "五点半";
    }
    else if (num == 60) {
        numText = "六点";
    }
    else if (num == 65) {
        numText = "六点半";
    }
    else if (num == 70) {
        numText = "七点";
    }
    else if (num == 75) {
        numText = "七点半";
    }
    else if (num == 80) {
        numText = "八点";
    }
    else if (num == 85) {
        numText = "八点半";
    }
    else if (num == 90) {
        numText = "九点";
    }
    else if (num == 95) {
        numText = "九点半";
    }
    return numText;
} 

var httpModule = {
    getScoreDetail: function () {
        
        if (globalData.scoreInfo) {
            appData.ruleStartTime = globalData.scoreInfo.start_time;
            appData.ruleEndTime = globalData.scoreInfo.end_time;
            appData.ruleText = globalData.scoreInfo.rule_text;

            for (var i = 0; i < globalData.scoreInfo.balance_board.length;i++) {
                var item = globalData.scoreInfo.balance_board[i];
                var name = Base64.decode(item.nickname);
                var score = item.score;
                if (score > 0) {
                    score = '+' + score;
                }
                appData.gameScoreList.push({"name":name,"avatar":item.headimgurl,"score":score,"code":item.account_code});
            }
            
            if (globalData.gameType == 11) {
                appData.player_array = globalData.scoreInfo.player_array;
                for (var i = 0; i < appData.player_array.length; i++) {
                    appData.player_array[i].player = [];

                    for (var j = 0; j < appData.player_array[i].cardinfo.length; j++) {
                        appData.player_array[i].cardinfo[j].cardType = cardText(appData.player_array[i].cardinfo[j].cv);
                    }

                    for (p in appData.player_array[i].player_detail) {

                        appData.player_array[i].player_detail[p].n = Base64.decode(appData.player_array[i].player_detail[p].n);

                        appData.player_array[i].player.push(
                            appData.player_array[i].player_detail[p]
                        )

                        appData.player_array[i].player[appData.player_array[i].player.length - 1].coin = [];

                        for (var k = 0; k < 4; k++) {
                            if (typeof (appData.player_array[i].player_detail[p][k]) != 'undefined') {
                                appData.player_array[i].player[appData.player_array[i].player.length - 1].coin.push(
                                    appData.player_array[i].player_detail[p][k]
                                )
                            } else {
                                appData.player_array[i].player[appData.player_array[i].player.length - 1].coin.push({
                                    mb: '',
                                    s: ''
                                })
                            }
                        }

                    }
                }
            } else {
                appData.gameDetailList = new Array();

                for (var i = 0; i < globalData.scoreInfo.player_array.length; i++) {
                    var item = globalData.scoreInfo.player_array[i];
                    var detailArray = new Array();
                    var players = item.player_cards;

                    for (var j = 0; j < item.player_cards.length; j++) {
                        var value = item.player_cards[j];
                        var name = Base64.decode(value.name);
                        var score = value.score;
                        var cards = value.player_cards.concat();
                        if (score > 0) {
                            score = '+' + score;
                        }
                        detailArray.push({ "name": name, "card_type": value.card_type_str, "chip": value.chip, "is_banker": value.is_banker, "is_join": value.is_join, "score": score, "cards": cards });
                    }

                    appData.gameDetailList.push({ "gnum": item.game_num, "tnum": item.total_num, "detail": detailArray, "dheight": (players.length + 2) * (0.15 * width + 2) });
                }
            }

        }
    },
};

var viewMethods = {
	clickShowAlert: function (type, text) {
		appData.alertType = type;
        appData.alertText = text;
        appData.isShowAlert = true;
        setTimeout(function() {
            var alertHeight = $(".alertText").height();
			var textHeight = alertHeight;
            if (alertHeight < height * 0.15) {
				alertHeight = height * 0.15;
			}

			if (alertHeight > height * 0.8) {
				alertHeight = height * 0.8;
			}

			var mainHeight = alertHeight + height * (0.022 + 0.034) * 2 + height * 0.022 + height * 0.056;
			if (type == 8) {
				mainHeight = mainHeight - height * 0.022 - height * 0.056
			}

            var blackHeight = alertHeight + height * 0.034 * 2;
            var alertTop = height * 0.022 + (blackHeight - textHeight) / 2;

			$(".alert .mainPart").css('height', mainHeight + 'px');
			$(".alert .mainPart").css('margin-top', '-' + mainHeight / 2 + 'px');
			$(".alert .mainPart .backImg .blackImg").css('height', blackHeight + 'px');
            $(".alert .mainPart .alertText").css('top', alertTop + 'px');
        }, 0);
	},
	clickCloseAlert: function () {
		appData.isShowAlert = false;
        if (appData.alertType == 1) {
            viewMethods.clickShowShop();
            if (!appData.is_connect) {
                reconnectSocket();
                appData.is_connect = true;
            }
        }
	},
	clickShowShop: function () {
		appData.select = 1;
        appData.ticket_count = 20;
        $(".shop .shopBody").animate({
            height:appData.width * 1.541 + "px"
        });
        appData.isShowShop = true;
	},
	clickHideShop: function () {
		$(".shop .shopBody").animate({
            height:0
        }, function() {
            appData.isShowShop = false;
        });
	},
    selectCard: function (num, count) {
        appData.select = num;
        appData.ticket_count = count;
    },
	clickGetCards: function () {
		httpModule.getCards();
	},
	showMessage: function () {
		$(".message .textPart").animate({
            height:"400px"
        });
        appData.isShowMessage = true;
	},
	hideMessage: function () {
		$(".message .textPart").animate({
            height:0
        }, function() {
            appData.isShowMessage = false;
        });
	},
	shopBuy: function () {
		if (appData.select > 0) {
			appData.isShowShopLoading = true;
            var goods_id = appData.select;
            httpModule.buyCard(goods_id);
		}
	},
    clickRedpackageRecord: function () {
        
    },
    clickSendRedPackage: function () {
        
    },
};

var width = window.innerWidth;
var height = window.innerHeight;
var isTimeLimitShow = false;
var viewOffset = 4;
var itemOffset = 4;
var itemHeight = 66 / 320 * width;
var leftOffset = 8 / 320 * width;
var userViewHeight = 0.25 * width;
var avatarWidth = 0.21875 * width;
var avatarY = (userViewHeight - avatarWidth) / 2;
var itemY = (80 + 44 * 2 + 40) / 320 * width + viewOffset * 3 + itemOffset;
var dtStartDate = '';
var dtEndDate = '';
var dtStartTimestamp = '0';
var dtEndTimestamp = '0';
var todayTimestamp = '0';
var groupOffset = 20;

var viewStyle = {
    sendRedpackage: {
        top: width * 0.25 + groupOffset + 'px',
    },
	redpackage: {
		top: width * 0.25 + viewOffset + groupOffset + 44 / 320 * width + 'px',
    },
    userList: {
		top: width * 0.25 + viewOffset * 2 + groupOffset + 44 / 320 * width * 2 + 'px',
    },
    groupMenu: {
        top:'0px',
    },
    groupMenuDetail: {
        top:'0px',
    },
	datepicker: {
		top: (80 + 44 * 2) / 320 * width + viewOffset * 3 * 4,
    },
    gameMenu: {
        top: (80 + 44 * 2) / 320 * width + viewOffset * 3 * 4,
    },
    gameScoreTitle: {
        top:0,
    },
};

var appData = {
	'viewStyle': viewStyle,
	'width': window.innerWidth,
	'height': window.innerHeight,
	'roomCard': Math.ceil(globalData.card),
	'user': userData,
	'activity': [],
	'isShowInvite': false,
	'isShowAlert': false,
	'isShowShop': false,
	'isShowMessage': false,
	'alertType': 0,
	'alertText': '',
	'roomCardInfo': [],
    'select': 1,
    'ticket_count': 0,
    'isDealing': false,
    isShowShopLoading: false,
    'gameItems':[],
    itemY:itemY,
    itemHeight: 66 / 320 * width,
    itemOffset: itemOffset,
    startDate: '',
    endDate: '',
    isPhone:false,
    isShowBindPhone:false,
    'isAuthPhone':userData.isAuthPhone,
	'authCardCount':userData.authCardCount,
	'phone':userData.phone,
	'sPhone':'',
	'sAuthcode':'',
	'authcodeType':1,
	'authcodeText':'发送验证码',
	'authcodeTime':60,
	'phoneType':1,
    'phoneText':'绑定手机',
    'isShowGroupMenu':false,
    'gameScoreList':[],
    'gameDetailList':[],
    bScroll:null,
    page:1,
    sumPage:1,
    canLoadMore:true,
    selectedGame:null,
    isHttpRequest:false,
    ruleText:'',
    ruleStartTime:'',
    ruleEndTime:'',
    gameType:globalData.gameType,
    'player_array':[],
};


function refreshView() {
    if (appData.isShowGroupMenu) {
        if(appData.isPhone) {
            var topOffset = (0.25 + 0.1375 * 3) * width + viewOffset * 2 + groupOffset;
            if (userData.groupOpen == 1) {
                viewStyle.groupMenu.top = topOffset + groupOffset;
                viewStyle.groupMenuDetail.top = viewStyle.groupMenu.top + viewOffset + 0.1375 * width;
                viewStyle.datepicker.top = viewStyle.groupMenuDetail.top + 0.275 * width + groupOffset;
                appData.itemY = viewStyle.datepicker.top + 0.125 * width + itemOffset;
            } else {
                viewStyle.groupMenu.top = topOffset + groupOffset;
                viewStyle.datepicker.top = viewStyle.groupMenu.top + 0.1375 * width + groupOffset;
                appData.itemY = viewStyle.datepicker.top + 0.125 * width + itemOffset;
            }
            
        } else {
            var topOffset = (0.25 + 0.1375 * 2) * width + viewOffset + 20;
            if (userData.groupOpen == 1) {
                viewStyle.groupMenu.top = topOffset + groupOffset;
                viewStyle.groupMenuDetail.top = viewStyle.groupMenu.top + viewOffset + 0.1375 * width;
                viewStyle.datepicker.top = viewStyle.groupMenuDetail.top + 0.275 * width + groupOffset;
                appData.itemY = viewStyle.datepicker.top + 0.125 * width + itemOffset;
            } else {
                viewStyle.groupMenu.top = topOffset + groupOffset;
                viewStyle.datepicker.top = viewStyle.groupMenu.top + 0.1375 * width + groupOffset;
                appData.itemY = viewStyle.datepicker.top + 0.125 * width + itemOffset;
            }
        }

        viewStyle.gameMenu.top = viewStyle.datepicker.top;
        viewStyle.gameScoreTitle.top = viewStyle.gameMenu.top + 0.25 * width + itemOffset;
        appData.itemY = viewStyle.gameScoreTitle.top + 0.13 * width + itemOffset;
    } else {
        if(appData.isPhone) {
            var topOffset = (0.25 + 0.1375 * 3) * width + viewOffset * 2 + groupOffset;
            if (userData.groupOpen == 1) {
                viewStyle.groupMenu.top = topOffset + groupOffset;
                viewStyle.datepicker.top = topOffset + groupOffset;
                appData.itemY = viewStyle.datepicker.top + 0.125 * width + itemOffset;
            } else {
                viewStyle.datepicker.top = topOffset + groupOffset;
                appData.itemY = viewStyle.datepicker.top + 0.125 * width + itemOffset;
            }
            
        } else {
            var topOffset = (0.25 + 0.1375 * 2) * width + viewOffset + 20;
            if (userData.groupOpen == 1) {
                viewStyle.datepicker.top = topOffset + groupOffset;
                appData.itemY = viewStyle.datepicker.top + 0.125 * width + itemOffset;
            } else {
                viewStyle.datepicker.top = topOffset + groupOffset;
                appData.itemY = viewStyle.datepicker.top + 0.125 * width + itemOffset;
            }
        }

        viewStyle.gameMenu.top = viewStyle.datepicker.top;
        viewStyle.gameScoreTitle.top = viewStyle.gameMenu.top + 0.25 * width + itemOffset;
        appData.itemY = viewStyle.gameScoreTitle.top + 0.13 * width + itemOffset;
    }
};

refreshView();


function funDate(aa){
    var date1 = new Date(),
    time1 = date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();
    var date2 = new Date(date1);
    date2.setDate(date1.getDate()+aa);

    var year = date2.getFullYear();
    var month = date2.getMonth() + 1;
    var day = date2.getDate();
    var time2 = year + '-';

    var monthS = month + '-';
    
    if (monthS.length < 3) {
        time2 = time2 + '0' + month + '-';
    } else {
        time2 = time2 + month + '-';
    }
    
    var dayS = day + '-';
    if (dayS.length < 3) {
        time2 = time2 + '0' + day;
    } else {
        time2 = time2 + day;
    }

    return time2;
}

//Vue方法
var methods = {
	showShop: viewMethods.clickShowShop,
	hideShop: viewMethods.clickHideShop,
	shopBuy: viewMethods.shopBuy,
	showInvite: viewMethods.clickShowInvite,
	showAlert: viewMethods.clickShowAlert,
	showMessage: viewMethods.showMessage,
	closeInvite: viewMethods.clickCloseInvite,
	closeAlert: viewMethods.clickCloseAlert,
	getCards: viewMethods.clickGetCards,
	hideMessage: viewMethods.hideMessage,
	selectCard: viewMethods.selectCard,
    showRedpackageRecord:viewMethods.clickRedpackageRecord,
    showSendRedpackage:viewMethods.clickSendRedPackage,
    startDateChange: viewMethods.changeStartDate,
    endDateChange: viewMethods.changeEndDate,
    finishBindPhone:function () {
        //window.location.href=window.location.href+"&id="+10000*Math.random();
    },
    showUserList:function () {
        //window.location.href = globalData.baseUrl + "activity/pUserList?dealer_num=" + globalData.dealerNum;
    },
};

//Vue生命周期
var vueLife = {
	vmCreated: function () {
		logMessage('vmCreated')
        $("#loading").hide();
        $(".main").show();
        httpModule.getScoreDetail();
	},
	vmUpdated: function () {
		logMessage('vmUpdated');
	},
	vmMounted: function () {
        logMessage('vmMounted');
	},
	vmDestroyed: function () {
		logMessage('vmDestroyed');
	}
};


//Vue实例
var vm = new Vue({
    el: '#app-main',
    data: appData,
    methods: methods,
    created: vueLife.vmCreated,
    updated: vueLife.vmUpdated,
    mounted: vueLife.vmMounted,
    destroyed: vueLife.vmDestroyed,
});

//微信配置
wx.config({
	debug:false,
	appId:configData.appId,
	timestamp:configData.timestamp,
	nonceStr:configData.nonceStr,
	signature:configData.signature,
	jsApiList:[ "onMenuShareTimeline", "onMenuShareAppMessage", "hideMenuItems" ]
});
wx.ready(function() {
    wx.hideOptionMenu();
});
wx.error(function(a) {});

function logMessage(message) {	
	console.log(message);
};

