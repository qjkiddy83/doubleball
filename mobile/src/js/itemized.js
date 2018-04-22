// /subscribe/subscribeprice.jsp
var $ = require('./zepto.js');
var Vue = require('./vue.js')
var tools = require('./tools');
var mui = require('./mui/mui');
var cookie = require('js-cookie');

function iconType(id){
    return ({
        "0001": "微信充值",
        "0002": "支付宝充值",
        "0008": "签到",
        "0009": "不中退款",
        "0006": "微信冲返",
        "0007": "支付宝冲返"
    })[id]
}

var vm = new Vue({
    el: '#app',
    data: {
        buy: {
            page: 1,
            pagecount: 1,
            list: []
        },
        gift: {
            page: 1,
            pagecount: 1,
            list: []
        },
        cur: 'buy',
        iconType:iconType,
        userbalance:'0.00'
    },
    methods: {
        changeTab:function(e){
            mui(`.mui-slider`).slider().gotoItem(e.target.dataset.index);
        }
    },
    mounted: function() {
        getData({
            page:1,
            pagesize:20,
            give : 0
        },function(data){
            if (data.statuscode !== "1") {
                mui.alert(`${data.statusmsg}`, '提示');
            } else {
                vm.buy.list = data.loglist;
            }
        })
    }
})

function getData(params,callback){
    tools.fetch({
        url: '/money/balancelist.jsp',
        data: params,
        method: "POST",
        dataType: 'json',
        success(data) {
            vm.userbalance = data.userbalance
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
        vm.cur = event.detail.slideNumber == 0 ? "buy" : 'gift';
        var _this = vm;
        Vue.nextTick(function() {
            if(vm.cur == "buy"){
                getData({
                    page:1,
                    pagesize:20,
                    give:0
                },function(data){
                    if (data.statuscode !== "1") {
                        mui.alert(`${data.statusmsg}`, '提示');
                    } else {
                        vm.buy.list = data.loglist;
                    }
                })
            }else{
                getData({
                    page:1,
                    pagesize:20,
                    give:1
                },function(data){
                    if (data.statuscode !== "1") {
                        mui.alert(`${data.statusmsg}`, '提示');
                    } else {
                         vm.gift.list = data.loglist;
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
            if(vm.cur == "buy"){
                getData({
                    page: 1,
                    pagesize: 20,
                    give : 0
                }, function(data) {
                    if (data.statuscode !== "1") {
                        mui.alert(`${data.statusmsg}`, '提示');
                    } else {
                        vm.buy.list = data.loglist;
                        mui(pullRefreshEl).pullRefresh().endPulldownToRefresh();
                    }
                })
            }else{
                getData({
                    page: 1,
                    pagesize: 20,
                    give:1
                }, function(data) {
                    if (data.statuscode !== "1") {
                        mui.alert(`${data.statusmsg}`, '提示');
                    } else {
                        vm.gift.list = data.loglist;
                        mui(pullRefreshEl).pullRefresh().endPulldownToRefresh();
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
                if(vm.cur == "buy"){
                    getData({
                        page: vm[vm.cur].page,
                        pagesize: 20,
                        give:0
                    }, function(data) {
                        var nomore = false;
                        if (data.statuscode !== "1") {
                            // mui.alert(`${data.statusmsg}`, '提示');
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                            vm[vm.cur].page--
                        } else {
                            vm.lottery.list = data.loglist;
                            if (vm.buy.page >= data.pagecount) {
                                nomore = true;
                            }
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(nomore);
                        }
                        
                    })
                }else{
                   getData({
                        page: vm.gift.page,
                        pagesize: 20,
                        give:1
                    }, function(data) {
                        var nomore = false;
                        if (data.statuscode !== "1") {
                            // mui.alert(`${data.statusmsg}`, '提示');
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                            vm[vm.cur].page--
                        } else {
                            vm.gift.list = vm.gift.list.concat(data.returnlist);
                            if (vm.gift.page >= data.pagecount) {
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