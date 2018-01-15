// var Words = "";
// function OutWord() {
//     var NewWords;
//     NewWords = unescape(Words);
//     document.write(NewWords);
// }
// OutWord();

var httpModule = {
    loadMoreScoreList: function () {
        var data = {
            "account_id": userData.accountId,
            "page": appData.page,
            "dealer_num": globalData.dealerNum,
            "game_type": appData.selectedGame.type,
        };

        Vue.http.post(globalData.baseUrl + 'game.php/gscore/getRoomList', data).then(function(response) {
            var bodyData = response.body;

            appData.isHttpRequest = false;

            if (bodyData.result == 0) {
                appData.page = bodyData.page;
                appData.sumPage = bodyData.sum_page;
				
                for (var i = 0; i < bodyData.data.length;i++) {
                    var item = bodyData.data[i];
                    appData.gameScoreList.push({"number":item.room_number,"time":item.create_time,"status":item.status});
                }
				
            } else {
                console.log(bodyData.result_message);
            }

			appData.canLoadMore = true;
			if (appData.page < appData.sumPage) {
				$('#moretext').text('点击加载更多');
				$('#moretext').show();
			} else {
                appData.canLoadMore = false;
				$('#moretext').text('没有更多内容');
				$('#moretext').hide();
			}

        }, function(response) {
            appData.canLoadMore = true;
            appData.isHttpRequest = false;
        });
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
        if (!globalData.isShop) {
            return;
        }
        
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
        window.location.href = globalData.baseUrl + "activity/myRedPackage?dealer_num=" + globalData.dealerNum;
    },
    clickSendRedPackage: function () {
        window.location.href = globalData.baseUrl + "activity/redpackage?dealer_num=" + globalData.dealerNum;
    },
    changeStartDate : function () {
        logMessage('start date：' + appData.startDate);
        var date = new Date(appData.startDate);
        var timestamp = convertTimestamp(date);
        
        //alert(timestamp);
        logMessage(timestamp);
        logMessage(dtEndTimestamp);
        if (timestamp > dtEndTimestamp) {
            appData.startDate = dtStartDate;
            //alert('开始时间不能大于结束时间');
            return;
        } else {
            dtStartDate = appData.startDate;
            dtStartTimestamp = timestamp;

            httpModule.getGameScore();
        }
    },
    changeEndDate : function () {
        logMessage('end date：' + appData.endDate);
        var date = new Date(appData.endDate);
        var timestamp = convertTimestamp(date);
        timestamp = timestamp + 86399;

        //alert(timestamp);

        if (timestamp > todayTimestamp) {
            appData.endDate = dtEndDate;
            //alert('结束时间不能大于今天');
            return;
        } else {
            dtEndDate = appData.endDate;
            dtEndTimestamp = timestamp;
            httpModule.getGameScore();
        }
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
		top: width * 0.25 + viewOffset * 1 + groupOffset + 44 / 320 * width * 1 + 'px',
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
        width: width,
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
    'isShowGroupMenu':globalData.isShowGroupMenu,
    'gameScoreList':[],
    bScroll:null,
    page:1,
    sumPage:1,
    canLoadMore:true,
    selectedGame:null,
    isHttpRequest:false,
    cardText:globalData.cardText,
};

function loadMoreScoreList() {
	if (appData.page < appData.sumPage) {
		appData.page = appData.page + 1;
        //httpModule.searchClientMember();
        console.log(appData.page);
        httpModule.loadMoreScoreList();
		$('#moretext').show();
		$('#moretext').text('加载中...');
	} else {
		$('#moretext').hide();
		$('#moretext').text('上拉加载更多');
	}
};

function refreshBScroll() {
	Vue.nextTick(function () {
		if (!appData.bScroll) {
			appData.bScroll = new BScroll(document.getElementById('memberDiv'), {
				startX: 0,
				startY: 0,
				scrollY: false,
				scrollX: true,
				click: true,
				bounceTime: 500,
			});
		} else {
			appData.bScroll.refresh();
		}
	});
};

refreshBScroll();

globalData.gameList=eval('(' + globalData.gameList + ')');
for (var i = 0; i < globalData.gameList.length; i++) {
    var type = globalData.gameList[i];
    var isChecked = 0;
    appData.gameItems.push({"avatar":gameIcons[type], "name":gameNames[type],"isChecked":isChecked,"type":type});
}

if (userData.phone != undefined && userData.phone.length >= 1) {
    logMessage(userData.phone);
    appData.isPhone = true;
    appData.phone = userData.phone;
    appData.phoneText = '修改手机号';
}

if (appData.isAuthPhone == 1) {
    appData.isShowBindPhone = true;
}

function refreshView() {
    if (appData.isShowGroupMenu) {
        if(appData.isPhone) {
            var topOffset = (0.25 + 0.1375 * 2) * width + viewOffset * 2 + groupOffset;
            topOffset = 0.02 * width;
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
            var topOffset = (0.25 + 0.1375 * 1) * width + viewOffset + 20;
            topOffset = 0.02 * width;
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
            var topOffset = (0.25 + 0.1375 * 2) * width + viewOffset * 2 + groupOffset;
            topOffset = 0.02 * width;
            if (userData.groupOpen == 1) {
                viewStyle.groupMenu.top = topOffset + groupOffset;
                viewStyle.datepicker.top = topOffset + groupOffset;
                appData.itemY = viewStyle.datepicker.top + 0.125 * width + itemOffset;
            } else {
                viewStyle.datepicker.top = topOffset + groupOffset;
                appData.itemY = viewStyle.datepicker.top + 0.125 * width + itemOffset;
            }
            
        } else {
            var topOffset = (0.25 + 0.1375 * 1) * width + viewOffset + 20;
            topOffset = 0.02 * width;
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

Date.prototype.format = function(fmt) { 
 var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
         fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
     }
 }
 return fmt; 
};

convertTimestamp = function (date) {
    var timestamp = Date.parse(date);
    timestamp = timestamp / 1000;
    return timestamp;
}

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
    clickPhone:function () {
        appData.phoneText = '绑定手机';
        appData.phoneType = 1;
        appData.authcodeTime = 0;
        appData.authcodeText = '发送验证码';
        appData.authcodeType = 1;
        appData.isShowBindPhone = true;
    },
    hideBindPhone: function () {
        if (appData.phoneType == 1) {
            return;
        }
        
        appData.isShowBindPhone = false;
    },
    clickEditPhone:function () {
        appData.phoneText = '修改手机号';
        appData.phoneType = 2;
        appData.authcodeTime = 0;
        appData.authcodeText = '发送验证码';
        appData.authcodeType = 1;
        appData.isShowBindPhone = true;
    },
    bindPhone:function () {
        var validPhone = checkPhone(appData.sPhone);
		var validAuthcode = checkAuthcode(appData.sAuthcode);

		if (validPhone == false) {
            viewMethods.clickShowAlert(7,'手机号码有误，请重填'); 
			return;
		} 

		if (validAuthcode == false) {
            viewMethods.clickShowAlert(7,'验证码有误，请重填');
			return;
		} 
        
        httpModule.bindPhone(appData.sPhone,appData.sAuthcode);
    },
    getAuthcode:function () {
        if (appData.authcodeType != 1) {
			return;
		}

		var color = $('#authcode').css('background-color');
        if (color != 'rgb(64, 112, 251)') {
            return;
        }

        var validPhone = checkPhone(appData.sPhone);

		if (validPhone == false) {
            viewMethods.clickShowAlert(7,'手机号码有误，请重填'); 
			return;
		} 
        
        httpModule.getAuthcode(appData.sPhone);
    },
	phoneChangeValue:function () {
		var result = checkPhone(appData.sPhone);
        if (result) {
            $('#authcode').css('background-color','rgb(64,112,251)');
        } else {
            $('#authcode').css('background-color','lightgray');
        }
    },
    finishBindPhone:function () {
        window.location.href=window.location.href+"&id="+10000*Math.random();
    },
    showUserList:function () {
        window.location.href = globalData.baseUrl + "activity/pUserList?dealer_num=" + globalData.dealerNum;
    },
    openGroup:function () {
        if (appData.user.groupOpen == 1) {
            viewMethods.clickShowAlert(25,'关闭后再次开启群主功能需要消耗'+ userData.groupOpenCard + '张房卡，是否确定关闭？');
            //appData.user.groupOpen = 0;
        } else {
            //appData.user.groupOpen = 1;
            viewMethods.clickShowAlert(24,'是否消耗' + userData.groupOpenCard + '张房卡开启群主功能？');
        }
        //refreshView();
    },
    confirmOpenGroup:function () {
        if (appData.isHttpRequest) {
            return;
        }

        //appData.user.groupOpen = 1;
        //refreshView();
        viewMethods.clickCloseAlert();
        httpModule.openGroup(1);
        appData.isHttpRequest = true;
        setTimeout(function() {
            appData.isHttpRequest = false;
        }, 5);
    },
    confirmCloseGroup:function () {
        if (appData.isHttpRequest) {
            return;
        }

        //appData.user.groupOpen = 0;
        //refreshView();
        viewMethods.clickCloseAlert();
        httpModule.openGroup(2);
        appData.isHttpRequest = true;
        setTimeout(function() {
            appData.isHttpRequest = false;
        }, 5);
    },
    clickMore:function () {
        if (appData.canLoadMore) {
            $('#moretext').text('加载中...');
            $('#moretext').show();
            appData.canLoadMore = false;
            setTimeout(function() {
                appData.canLoadMore = true;
                $('#moretext').text('点击加载更多');
            }, 5000);

            loadMoreScoreList();
        }
    },
    clickGame:function (item) {
        try {
            if (appData.selectedGame) {
                if (appData.selectedGame.type == item.type) {
                    return;
                }
            } 

            if (appData.isHttpRequest) {
                return;
            }

            for (var i = 0; i < globalData.gameList.length; i++) {
                var type = globalData.gameList[i];
                type = 'game' + type;
                var obj = $('#' + type);
                $('#' + type).css("opacity", "0.3");
            }

            var selectGame = 'game' + item.type;
            $('#' + selectGame).css("opacity", "1");
            appData.selectedGame = item;
            appData.gameScoreList = [];
            appData.page = 1;
            appData.sumPage = 1;
            httpModule.loadMoreScoreList();

            appData.isHttpRequest = true;

            setTimeout(function() {
                appData.isHttpRequest = false;
            }, 5000);
        } catch (error) {
            console.log(error);
        }
    },
    clickScoreItem: function (item) {
        if (!appData.selectedGame) {
            return;
        }
        
        var url = globalData.baseUrl + "game.php/Myhome/gameScoreDetail?dealer_num=" + globalData.dealerNum + '&game_type=' + appData.selectedGame.type + '&room_number='+item.number;
        window.location.href = url;
    },
    clickInvite: function () {
        window.location.href = userData.inviteUrl;
    },
    clickGMember: function () {
        window.location.href = globalData.baseUrl + "game.php/gscore/groupMember?dealer_num=" + globalData.dealerNum;
    },
    clickRoomSearch: function () {

    },
};

//Vue生命周期
var vueLife = {
	vmCreated: function () {
		logMessage('vmCreated')
        $("#loading").hide();
		$(".main").show();
	},
	vmUpdated: function () {
		logMessage('vmUpdated');
	},
	vmMounted: function () {
        logMessage('vmMounted');
        if (appData.gameItems.length >= 1) {
            if (globalData.gameType.length >= 1) {
                for (var i = 0; i < appData.gameItems.length;i++) {
                    var item = appData.gameItems[i];
                    if (item.type == globalData.gameType) {
                        methods.clickGame(item);
                        
                        break;
                    }
                }
            } else {
                methods.clickGame(appData.gameItems[0]);
            }
        }
	},
	vmDestroyed: function () {
		logMessage('vmDestroyed');
	}
};

//手机绑定******
function checkPhone(phone) {
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
        return false;
    } else {
        return true;
    }
}

function checkAuthcode(code) {
	if (code == '' || code == undefined) {
		return false;
	}
	
    var reg = new RegExp("^[0-9]*$");
    if (!reg.test(code)) {
        return false;
    } else {
        return true;
    }
}

var authcodeTimer = function authcodeTimer() {
    if (appData.authcodeTime <= 0) {
        appData.authcodeText = '发送验证码';
        appData.authcodeTime = 60;
        appData.authcodeType = 1;
        return;
    }

    appData.authcodeTime = appData.authcodeTime - 1;
    appData.authcodeText = appData.authcodeTime + 's';

    setTimeout(function () {
        authcodeTimer();
    }, 1000);
};
//******手机绑定

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
