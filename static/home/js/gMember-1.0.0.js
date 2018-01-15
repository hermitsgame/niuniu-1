// var Words = "";
// function OutWord() {
//     var NewWords;
//     NewWords = unescape(Words);
//     document.write(NewWords);
// }
// OutWord();

var httpModule = {
    loadMoreMemberList: function () {
        var data = {
            "account_id": userData.accountId,
            "page": appData.page,
            "dealer_num": globalData.dealerNum,
        };

        Vue.http.post(globalData.baseUrl + 'game.php/gscore/getGroupMemberList', data).then(function(response) {
            var bodyData = response.body;

            appData.isHttpRequest = false;

            if (bodyData.result == 0) {
                appData.page = bodyData.page;
                appData.sumPage = bodyData.sum_page;
				
                for (var i = 0; i < bodyData.data.length;i++) {
                    var item = bodyData.data[i];
                    var status = item.status;
                    if (item.account_code == userData.uid) {
                        status = -1;
                    }

                    //status = 2;
                    var name = item.nickname;
                    name = Base64.decode(name);

                    appData.gameScoreList.push({"name":name,"code":item.account_code,"status":status,"avatar":item.headimgurl});
                }
				
            } else {
                debugger;
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
    dealApply: function (type,code) {
        var data = {
            "account_id": userData.accountId,
            "apply_code": code,
            "dealer_num": globalData.dealerNum,
            "type": type,
        };

        console.log(data);

        Vue.http.post(globalData.baseUrl + 'game.php/gscore/dealMemberApply', data).then(function(response) {
            var bodyData = response.body;
            
            var tempArr = [];

            if (bodyData.result == 0) {
                if (type == 1) {
                    appData.selectedItem.status = 2;
                } else if (type == 2) {
                    for (var i = 0;i < appData.gameScoreList.length;i++) {
                        var temp = appData.gameScoreList[i];
                        if (appData.selectedItem.code != temp.code) {
                            tempArr.push(temp);
                        }
                    }

                    appData.gameScoreList = tempArr;
                }  else if (type == 3) {
                    for (var i = 0;i < appData.gameScoreList.length;i++) {
                        var temp = appData.gameScoreList[i];
                        if (appData.selectedItem.code != temp.code) {
                            tempArr.push(temp);
                        }
                    }

                    appData.gameScoreList = tempArr;
                }

                console.log(tempArr);

                
                viewMethods.clickCloseAlert();
                //viewMethods.clickShowAlert(7,bodyData.result_message);
				
            } else {
                viewMethods.clickShowAlert(7,bodyData.result_message);
            }

        }, function(response) {
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
    bScroll:null,
    page:1,
    sumPage:1,
    canLoadMore:true,
    selectedGame:null,
    isHttpRequest:false,
    gameScoreList:[],
    selectedItem:null,
};

function loadMoreMemberList() {
	if (appData.page < appData.sumPage) {
		appData.page = appData.page + 1;
        console.log(appData.page);
        httpModule.loadMoreMemberList();
		$('#moretext').show();
		$('#moretext').text('加载中...');
	} else {
		$('#moretext').hide();
		$('#moretext').text('上拉加载更多');
	}
};


//Vue方法
var methods = {
	showAlert: viewMethods.clickShowAlert,
	closeInvite: viewMethods.clickCloseInvite,
	closeAlert: viewMethods.clickCloseAlert,
    finishBindPhone:function () {
        window.location.href=window.location.href+"&id="+10000*Math.random();
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

            loadMoreMemberList();
        }
    },
    clickAgree: function (item) {
        appData.selectedItem = item;
        viewMethods.clickShowAlert(41,"是否同意【" + item.name + '】入群？');
    },
    clickDisagree: function (item) {
        appData.selectedItem = item;
        viewMethods.clickShowAlert(42,"是否拒绝【" + item.name + '】入群？');
    },
    clickRemove: function (item) {
        appData.selectedItem = item;
        viewMethods.clickShowAlert(43,"是否踢【" + item.name + '】出群？');
    },
    confirmAgree: function () {
        httpModule.dealApply(1,appData.selectedItem .code);
    },
    confirmDisagree: function () {
        httpModule.dealApply(2,appData.selectedItem .code);
    },
    confirmRemove: function () {
        httpModule.dealApply(3,appData.selectedItem .code);
    },
};

//Vue生命周期
var vueLife = {
	vmCreated: function () {
		logMessage('vmCreated')
        $("#loading").hide();
        $(".main").show();
        httpModule.loadMoreMemberList();
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
