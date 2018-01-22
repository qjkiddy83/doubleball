var mui = require('./mui/mui');
var lotterys = require('./lottery-data.js');
var Vue = require('./vue.js')
var tools = require('./tools');
var cookie = require('js-cookie');

var $ = require('./zepto.js');

function lotteryFormat(str) {
    var ret = [];
    str.split(/\|+/).forEach(function(item, i) {
        ret[i] = item.split(',');
    })
    return ret;
}

function getAchievement(callback) {
    tools.fetch({
        url: '/exper/experthistory.jsp',
        data: {
            expertid: (location.search.match(/[?&]expertid=(.*?)(?:&|$)/) || [])[1],
            lotterytype: vm.achievement.lotterys[vm.achievement.curLottery].code
        },
        method: 'POST',
        dataType: 'json',
        success: function(d) {
            d.periodinfos.map(function(item) {
                item.lotterywinFormat = lotteryFormat(item.lotterywin)
                item.list.map(function(balls) {
                    balls.periodsconFormat = lotteryFormat(balls.periodscon)
                })
            })
            vm.achievement.periodinfos = d.periodinfos;
            mui('#pullrefresh1').pullRefresh().scrollTo(0, 0);
        }
    })
}

window.paysuccess = function(){
    $('#paying').hide()
    vm.showResult()
}

var vm = new Vue({
    el: '#app',
    data: {
        expense: "",
        expertdesc: "",
        expertsid: "",
        expertsname: "",
        expertspic: "",
        follow: "",
        likedtime: "",
        lotterylist: [],
        originalmonth: "",
        originalweek: "",
        pagecount: "",
        page: 1,
        praise: "",
        purchasetime: "",
        rank: "",
        statuscode: "",
        statusmsg: "",
        subscribe: "",
        subscribemonth: "",
        subscribeweek: "",
        buyed: [],
        buyedname: '',
        achievement: {
            lotterys: lotterys,
            curLottery: 0,
            periodinfos: []
        },
        sliderIndex: 0
    },
    methods: {
        buy:function(event){
            let that = this;
            tools.pay(event.target.dataset.expense,function(rechargetype){
                tools.fetch({
                    url: '/money/recharge.jsp',
                    data: {
                        rechargeamount: event.target.dataset.expense,
                        rechargetype: rechargetype,
                        forecastid:event.target.dataset.id
                    },
                    method: "POST",
                    dataType: 'json',
                    success(data) {
                        that.buyed = lotteryFormat(that.lotterylist[event.target.dataset.index].periodscon);
                        that.buyedname = that.lotterylist[event.target.dataset.index].forecasttypename;
                        if(data.statuscode == 1){
                            $('#paying').show().find('iframe').attr('src',data.rechargeorder.jumpurl);
                        }else if(data.statuscode == "-10801"){
                            mui.alert(`${data.statusmsg}`, '提示',function(){
                                that.showResult()
                            });
                        }
                    }
                })
            })
        },
        showResult: function() {
            this.$nextTick(function() {
                var tpl = $('#rets').html();
                mui.alert(`${tpl}`, '提示', function() {

                });
            })
        },
        changeTab: function(event) {
            var dataset = event.target.dataset;
            this.sliderIndex = dataset.index;
            mui(`.mui-slider`).slider().gotoItem(dataset.index);
            // getAchievement();
        },
        changeLottery: function(event) {
            var dataset = event.currentTarget.dataset;
            this.achievement.curLottery = dataset.index;
            this.$nextTick(function() {
                getAchievement();
            })
        },
        followUser() {
            var _this = this;
            tools.fetch({
                url: _this.follow == "0" ? '/exper/follow.jsp' : '/exper/disfollow.jsp',
                data: {
                    expertid: (location.search.match(/[?&]expertid=(.*?)(?:&|$)/) || [])[1]
                },
                method: 'POST',
                dataType: 'json',
                success: function(d) {
                    if (d.statuscode !== "1") {
                        mui.alert(`${d.statusmsg}`, '提示');
                    } else {
                        _this.follow = _this.follow == "1" ? "0" : "1";
                    }
                }
            })
        },
        praiseUser() {
            var _this = this;
            tools.fetch({
                url: '/exper/praise.jsp',
                data: {
                    expertid: (location.search.match(/[?&]expertid=(.*?)(?:&|$)/) || [])[1]
                },
                method: 'POST',
                dataType: 'json',
                success: function(d) {
                    if (d.statuscode !== "1") {
                        mui.alert(`${d.statusmsg}`, '提示');
                    } else {
                        _this.likedtime = d.praise
                    }
                }
            })
        },
        closePaylayer:function(){
            $('#paying').hide().find('iframe').attr('src','');
        }
    },
    created: function() {
        var _this = this;
        tools.fetch({
            url: '/exper/forecastexperbyexper.jsp',
            data: {
                expertid: (location.search.match(/[?&]expertid=(.*?)(?:&|$)/) || [])[1]
            },
            method: 'POST',
            dataType: 'json',
            success: function(d) {
                $.extend(_this, d);
                if (d.pagecount <= _this.page) {
                    mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                }
            }
        })
    }
})


document.querySelector('#slider1').addEventListener('slide', function(event) {
    vm.sliderIndex = event.detail.slideNumber;
    if (event.detail.slideNumber) {
        getAchievement()
    }
});

mui('#pullrefresh').pullRefresh({
    down: {
        callback: pulldownRefresh
    },
    up: {
        contentrefresh: '正在加载...',
        callback: pullupRefresh
    }
});
var pullrefresh1 = mui('#pullrefresh1').pullRefresh({
    down: {
        callback: function() {
            mui('#pullrefresh1').pullRefresh().endPulldownToRefresh();
        }
    },
    up: {
        contentrefresh: '正在加载...',
        callback: function() {
            mui('#pullrefresh1').pullRefresh().endPullupToRefresh(true);
        }
    }
});
mui('#pullrefresh1').pullRefresh().endPullupToRefresh(true);

function pulldownRefresh() {
    vm.page = 1;
    tools.fetch({
        url: '/exper/forecastexperbyexper.jsp',
        data: {
            expertid: (location.search.match(/[?&]expertid=(.*?)(?:&|$)/) || [])[1],
            page: 1
        },
        method: 'POST',
        dataType: 'json',
        success: function(d) {
            vm.pagecount = d.pagecount;
            vm.lotterylist = d.lotterylist;
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
            if (d.pagecount <= vm.page) {
                mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
            }
        }
    })
}

function pullupRefresh() {
    if (d.pagecount <= _this.page) {
        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
        return;
    }

    vm.page++;
    tools.fetch({
        url: '/exper/forecastexperbyexper.jsp',
        data: {
            expertid: (location.search.match(/[?&]expertid=(.*?)(?:&|$)/) || [])[1],
            page: vm.page
        },
        method: 'POST',
        dataType: 'json',
        success: function(d) {
            vm.pagecount = d.pagecount;
            vm.lotterylist = vm.lotterylist.concat(d.lotterylist);
            if (d.pagecount <= vm.page) {
                mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
            }
        }
    })
}