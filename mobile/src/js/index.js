var lotterys = require('./lottery-data.js');
var $ = require('./zepto.js');
var Vue = require('./vue.js');
var mui = require('./mui/mui');
var tools = require('./tools');

lotterys.map(function(item) { //初始化数据结构
    $.extend(item, {
        lotteryFormat: [
            [],
            []
        ],
        periods: '',
        curforecast: 0
    })
    item.product.map(function(_item) {
        _item.pagecount = 1;
        _item.page = 1;
    })
})

var pullRefreshArr = []
mui.ready(function() {
    mui('.lottery-classify').scroll({
        scrollY: false, //是否竖向滚动
        scrollX: true
    });
    //循环初始化所有下拉刷新，上拉加载。
    mui.each(document.querySelectorAll('.mui-scroll-wrapper-segmented'), function(index, pullRefreshEl) {
        var oPullRefresh = mui(pullRefreshEl).pullRefresh({
            down: {
                callback: pulldownRefresh
            },
            up: {
                contentrefresh: '正在加载...',
                callback: pullupRefresh
            }
        });
        pullRefreshArr.push(oPullRefresh)

        /**
         * 下拉刷新具体业务实现
         */
        function pulldownRefresh() {
            var curLottery = vm.curLottery;
            var curforecast = vm.lotterys[vm.curLottery].curforecast;
            var nomore = false;
            vm.lotterys[vm.curLottery].product[curforecast].page = 1;
            getData({
                forecasttype: vm.lotterys[vm.curLottery].product[curforecast].code,
                lotterytype: vm.lotterys[vm.curLottery].code,
                page: vm.lotterys[vm.curLottery].product[curforecast].page,
                pagesize: 20
            }, function(d) {
                callbackTpl(vm.lotterys, curLottery, curforecast, 0, d);
                if (vm.lotterys[curLottery].product[curforecast].page >= d.pagecount) {
                    nomore = true;
                }
                mui(pullRefreshEl).pullRefresh().endPulldownToRefresh(nomore);
            });
        }
        var count = 0;
        /**
         * 上拉加载具体业务实现
         */
        function pullupRefresh() {
            var curLottery = vm.curLottery;
            var curforecast = vm.lotterys[vm.curLottery].curforecast;
            var nomore = false;
            if (vm.lotterys[vm.curLottery].product[curforecast].page >= vm.lotterys[vm.curLottery].product[curforecast].pagecount) {
                nomore = true;
                mui(pullRefreshEl).pullRefresh().endPullupToRefresh(nomore);
                return;
            }
            vm.lotterys[vm.curLottery].product[curforecast].page++;
            getData({
                forecasttype: vm.lotterys[vm.curLottery].product[curforecast].code,
                lotterytype: vm.lotterys[vm.curLottery].code,
                page: vm.lotterys[vm.curLottery].product[curforecast].page,
                pagesize: 20
            }, function(d) {
                callbackTpl(vm.lotterys, curLottery, curforecast, 1, d);
                if (vm.lotterys[curLottery].product[curforecast].page >= d.pagecount) {
                    nomore = true;
                }
                mui(pullRefreshEl).pullRefresh().endPullupToRefresh(nomore);
            });
        }
    });
    document.querySelector('#slider1').addEventListener('slide', function(event) {
        var curLottery = event.detail.slideNumber,
            curforecast = 0;
        vm.curLottery = event.detail.slideNumber;
        vm.lotterys[curLottery].product[curforecast].page = 1;
        getData({
            forecasttype: vm.lotterys[curLottery].product[curforecast].code,
            lotterytype: vm.lotterys[curLottery].code,
            page: 1,
            pagesize: 20
        }, function(d) {
            callbackTpl(vm.lotterys, curLottery, curforecast, 0, d)
        })
    });
});

function combine(list, _this) {
    list.each(function(i) {
        if (i > 6 && !$(this).attr('node-act')) {
            $(this).hide();
            _this.html(`<span>更多 <i class="mui-icon mui-icon-arrowdown"></i></span>`).data('combined', 1)
        }
    })
    _this.closest('.mui-slider-group').find('.li-praised').addClass('combine')
}

function expand(list, _this) {
    list.show();
    _this.html(`<span>收起 <i class="mui-icon mui-icon-arrowup"></i></span>`).data('combined', 0)
    _this.closest('.mui-slider-group').find('.li-praised').removeClass('combine')
}
$(document).on('tap', '[node-act="combine"]', function() {
    var _this = $(this);
    if (_this.data('combined')) {
        expand($(this).parent().find('li'), _this)
    } else {
        combine($(this).parent().find('li'), _this)
    }
})

var vm = new Vue({
    el: '#app',
    data: {
        lotterys: lotterys,
        curLottery: 0
    },
    methods: {
        changeForecast: function(event) {
            var curforecast = event.currentTarget.dataset.index;
            var curLottery = this.curLottery;
            this.lotterys[this.curLottery].curforecast = curforecast;
            getData({
                forecasttype: this.lotterys[this.curLottery].product[curforecast].code,
                lotterytype: this.lotterys[this.curLottery].code,
                page: 1,
                pagesize: 20
            }, function(d) {
                callbackTpl(this.lotterys, curLottery, curforecast, 0, d)
                pullRefreshArr[curLottery].refresh(true)
                pullRefreshArr[curLottery].scrollTo(0, 0)
            }.bind(this));
        },
        changeLtype: function(event) {
            var dataset = event.target.dataset;
            var curLottery = dataset.index,
                curforecast = 0;
            this.curLottery = curLottery;
            this.lotterys[curLottery].product[curforecast].page = 1;
            mui(`.mui-slider`).slider().gotoItem(dataset.index);
            // getData({
            //     forecasttype: this.lotterys[curLottery].product[curforecast].code,
            //     lotterytype: this.lotterys[curLottery].code,
            //     page: 1,
            //     pagesize: 20
            // }, function(d) {
            //     callbackTpl(this.lotterys, curLottery, curforecast, 0, d)
            // }.bind(this))
        }
    },
    created: function() {
        var curLottery = 0,
            curforecast = 0;
        getData({
            forecasttype: this.lotterys[curLottery].product[curforecast].code,
            lotterytype: this.lotterys[curLottery].code,
            page: 1,
            pagesize: 20
        }, function(d) {
            callbackTpl(this.lotterys, curLottery, curforecast, 0, d)
        }.bind(this))

        // tools.fetch({
        //     url: '/system/bannerlist.jsp',
        //     type : 'get',
        //     data:{},
        //     dataType: 'json',
        //     success: function(d) {
        //         console.log(d)
        //     }
        // })
        // var btnArray = ['是', '否'];
        // mui.confirm('是否已经支付成功？', '微信支付', btnArray, function(e) {
        //     if (e.index == 0) {
        //         paysuccess();
        //     } else {
        //         location.href = data.rechargeorder.jumpurl
        //     }
        // })
    }
})

function callbackTpl(lotterys, curLottery, curforecast, load, d) {
    if (d.statuscode != '1') {
        return;
    }
    lotterys[curLottery].periods = d.periods;
    lotterys[curLottery].lotteryFormat = lotteryFormat(d.lottery);
    d.returnlist.map(function(item) {
        item.lotteryFormat = lotteryFormat(item.periodscon)
    })
    lotterys[curLottery].product[curforecast].pagecount = d.pagecount;
    lotterys[curLottery].product[curforecast].list = load && lotterys[curLottery].product[curforecast].list ? lotterys[curLottery].product[curforecast].list.concat(d.returnlist) : d.returnlist;
}

function lotteryFormat(str) {
    var ret = [];
    str.split('|').forEach(function(item, i) {
        ret[i] = item.split(',');
    })
    return ret;
}

function getData(params, callback) {
    tools.fetch({
        url: '/forecast/forecastprivlist.jsp',
        type : 'post',
        data: params,
        dataType: 'json',
        success: function(d) {
            callback(d)
        }
    })
}
// getData();