// /subscribe/subscribeprice.jsp
var $ = require('./zepto.js');
var Vue = require('./vue.js')
var tools = require('./tools');
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
        expert: {
            page: 1,
            pagecount: 1,
            list: []
        },
        guess: {
            page: 1,
            pagecount: 1,
            list: []
        },
        cur: 'expert'
    },
    methods: {

    },
    mounted: function() {
        getExpertData({
            page:1,
            pagesize:20
        },function(data){
            if (data.statuscode !== "1") {
                mui.alert(`${data.statusmsg}`, '提示');
            } else {
                data.returnlist.map(function(item) {
                    item.lotteryFormat = lotteryFormat(item.forecastcontent)
                })
                vm.expert.list = data.returnlist;
                vm.expert.pagecount = data.pagecount;
            }
        })
    }
})

function getExpertData(params,callback){
    tools.fetch({
        url: '/money/purchaselist.jsp',
        data: params,
        method: "POST",
        dataType: 'json',
        success(data) {
            callback(data)
        }
    })
}
function getGuessData(params,callback){
    tools.fetch({
        url: '/infomation/userdecodelist.jsp',
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
        vm.cur = event.detail.slideNumber == 0 ? "expert" : 'guess';
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
                        data.returnlist.map(function(item) {
                            item.lotteryFormat = lotteryFormat(item.forecastcontent)
                        })
                        vm.expert.list = data.returnlist;
                        vm.expert.pagecount = data.pagecount;
                    }
                })
            }else{
                getGuessData({
                    page:1,
                    pagesize:20
                },function(data){
                    if (data.statuscode !== "1") {
                        mui.alert(`${data.statusmsg}`, '提示');
                    } else {
                        vm.guess.list = data.list;
                        vm.guess.pagecount = data.pagecount;
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
            if(vm.cur == "expert"){
                getExpertData({
                    page: 1,
                    pagesize: 20
                }, function(data) {
                    if (data.statuscode !== "1") {
                        mui.alert(`${data.statusmsg}`, '提示');
                    } else {
                        data.returnlist.map(function(item) {
                            item.lotteryFormat = lotteryFormat(item.forecastcontent)
                        })
                        vm.expert.list = data.returnlist;
                        mui(pullRefreshEl).pullRefresh().endPulldownToRefresh();
                    }
                })
            }else{
                getGuessData({
                    page:1,
                    pagesize:20
                },function(data){
                    if (data.statuscode !== "1") {
                        mui.alert(`${data.statusmsg}`, '提示');
                    } else {
                        vm.guess.list = data.list;
                        vm.guess.pagecount = data.pagecount;
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
                if(vm.cur == "expert"){
                    getExpertData({
                        page: vm.expert.page,
                        pagesize: 20
                    }, function(data) {
                        var nomore = false;
                        if (data.statuscode !== "1") {
                            // mui.alert(`${data.statusmsg}`, '提示');
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                            vm[vm.cur].page--
                        } else {
                            data.returnlist.map(function(item) {
                                item.lotteryFormat = lotteryFormat(item.forecastcontent)
                            })
                            vm.expert.list = vm.expert.list.concat(data.returnlist);
                            if (vm[vm.cur].page >= data.pagecount) {
                                nomore = true;
                            }
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(nomore);
                        }
                        
                    })
                }else{
                    getGuessData({
                        page: vm.guess.page,
                        pagesize: 20
                    }, function(data) {
                        var nomore = false;
                        if (data.statuscode !== "1") {
                            // mui.alert(`${data.statusmsg}`, '提示');
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                            vm[vm.cur].page--
                        } else {
                            vm.guess.list = vm.guess.list.concat(data.list);
                            if (vm.guess.page >= data.pagecount) {
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