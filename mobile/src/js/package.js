// /subscribe/subscribeprice.jsp
var $ = require('./zepto.js');
var Vue = require('./vue.js')
var tools = require('./tools');
var lotterys = require('./lottery-data.js');
var mui = require('./mui/mui');
var cookie = require('js-cookie');

function lotteryFormat(str) {
    var ret = [];
    str.split('|').forEach(function(item, i) {
        ret[i] = item.split(',');
    })
    return ret;
}

var vm = new Vue({
    el: '#app',
    data: {
        lottery: {
            page: 1,
            pagecount: 1,
            list: []
        },
        expert: {
            page: 1,
            pagecount: 1,
            list: []
        },
        cur: 'lottery'
    },
    methods: {

    },
    mounted: function() {
        getLotteryData({
            page:1,
            pagesize:20
        },function(data){
            if (data.statuscode !== "1") {
                mui.alert(`${data.statusmsg}`, '提示');
            } else {
                data.subscribeloglist.map(item => {
                    var _item = lotterys.filter(lottery => {
                        return (lottery.code == item.lotterytype)
                    });
                    item.lotteryname = _item.length ? _item[0].name : "全彩种"
                })
                vm.lottery.list = data.subscribeloglist;
            }
        })
    }
})

function getLotteryData(params,callback){
    tools.fetch({
        url: '/subscribe/subscribelist.jsp',
        data: params,
        method: "POST",
        dataType: 'json',
        success(data) {
            callback(data)
        }
    })
}
function getExpertData(params,callback){
    tools.fetch({
        url: '/subscribe/expertsubscribelist.jsp',
        data: params,
        method: "POST",
        dataType: 'json',
        success(data) {
            callback(data)
        }
    })
}

mui.ready(function() {
    mui('.mui-scroll-wrapper-segmented').scroll({
        scrollY: true, //是否竖向滚动
        scrollX: false
    });
    document.querySelector('#slider1').addEventListener('slide', function(event) {
        vm.cur = event.detail.slideNumber == 0 ? "lottery" : 'expert';
        var _this = vm;
        Vue.nextTick(function() {
            if(vm.cur == "expert"){
                getExpertData({
                    page:1,
                    pagesize:20
                },function(data){
                    if (data.statuscode !== "1") {
                        mui.alert(`${data.statusmsg}`, '提示');
                    } else {
                        vm.expert.list = data.subscribeloglist;
                    }
                })
            }else{
                getLotteryData({
                    page:1,
                    pagesize:20
                },function(data){
                    if (data.statuscode !== "1") {
                        mui.alert(`${data.statusmsg}`, '提示');
                    } else {
                        data.subscribeloglist.map(item => {
                            var _item = lotterys.filter(lottery => {
                                return (lottery.code == item.lotterytype)
                            });
                            item.lotteryname = _item.length ? _item[0].name : "全彩种"
                        })
                        vm.lottery.list = data.subscribeloglist;
                    }
                })
            }
        })
    });
    mui.each(document.querySelectorAll('.mui-scroll-wrapper-segmented'), function(index, pullRefreshEl) {
        mui(pullRefreshEl).pullRefresh({
            down: {
                callback: pulldownRefresh
            },
            up: {
                contentrefresh: '正在加载...',
                callback: pullupRefresh
            }
        });

        /**
         * 下拉刷新具体业务实现
         */
        function pulldownRefresh() {
            vm[vm.cur].page = 1;
            if(vm.cur == "lottery"){
                getLotteryData({
                    page: 1,
                    pagesize: 20
                }, function(data) {
                    if (data.statuscode !== "1") {
                        mui.alert(`${data.statusmsg}`, '提示');
                    } else {
                        data.subscribeloglist.map(item => {
                            var _item = lotterys.filter(lottery => {
                                return (lottery.code == item.lotterytype)
                            });
                            item.lotteryname = _item.length ? _item[0].name : "全彩种"
                        })
                        vm.lottery.list = data.subscribeloglist;
                        mui(pullRefreshEl).pullRefresh().endPulldownToRefresh();
                        if (vm[vm.cur].page >= data.pagecount) {
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                        }
                        
                    }
                })
            }else{
                getExpertData({
                    page: 1,
                    pagesize: 20
                }, function(data) {
                    if (data.statuscode !== "1") {
                        mui.alert(`${data.statusmsg}`, '提示');
                    } else {
                        vm.expert.list = data.subscribeloglist;
                        mui(pullRefreshEl).pullRefresh().endPulldownToRefresh();
                        if (vm[vm.cur].page >= data.pagecount) {
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                        }
                        
                    }
                })
            }
        }
        /**
         * 上拉加载具体业务实现
         */
        function pullupRefresh() {
            vm[vm.cur].page++;
            Vue.nextTick(() => {
                if(vm.cur == "lottery"){
                    getLotteryData({
                        page: vm[vm.cur].page,
                        pagesize: 20
                    }, function(data) {
                        var nomore = false;
                        if (data.statuscode !== "1") {
                            // mui.alert(`${data.statusmsg}`, '提示');
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                            vm[vm.cur].page--
                        } else {
                            data.subscribeloglist.map(item => {
                                var _item = lotterys.filter(lottery => {
                                    return (lottery.code == item.lotterytype)
                                });
                                item.lotteryname = _item.length ? _item[0].name : "全彩种"
                            })
                            vm.lottery.list = data.subscribeloglist;
                            if (vm[vm.cur].page >= data.pagecount) {
                                nomore = true;
                            }
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(nomore);
                        }
                        
                    })
                }else{
                   getExpertData({
                        page: vm[vm.cur].page,
                        pagesize: 20
                    }, function(data) {
                        var nomore = false;
                        if (data.statuscode !== "1") {
                            // mui.alert(`${data.statusmsg}`, '提示');
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                            vm[vm.cur].page--
                        } else {
                            vm.expert.list = vm.expert.list.concat(data.returnlist);
                            if (vm[vm.cur].page >= data.pagecount) {
                                nomore = true;
                            }
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(nomore);
                        }
                        
                    }) 
                }
            })
        }
    });
});