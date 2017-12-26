var lotterys = require('./lottery-data.js');
var $ = require('./zepto.js');
var Vue = require('./vue');
var mui = require('./mui/mui');
var tools = require('./tools');

lotterys.map(function(item) { //初始化数据结构
    $.extend(item, {
        list: [],
        page: 1,
        pagecount: 1
    })
})

document.querySelector('#slider1').addEventListener('slide', function(event) {
    sliderIndex = event.detail.slideNumber;
    var curLottery = sliderIndex,
        curforecast = 0;
    this.curLottery = curLottery;
    mui(`.mui-slider`).slider().gotoItem(sliderIndex);
});

mui.ready(function() {
    mui('.lottery-classify').scroll({
        scrollY: false, //是否竖向滚动
        scrollX: true
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
            vm.page = 1;
            getData({
                codetype: codetype,
                lotterytype: vm.lotterys[vm.curLottery].code,
                page: 1,
                pagesize: 20
            }, function(data) {
                vm.lotterys[vm.curLottery].list = data[`list${codetype}`];
                mui(pullRefreshEl).pullRefresh().endPulldownToRefresh();
            })
        }
        /**
         * 上拉加载具体业务实现
         */
        function pullupRefresh() {
            vm.lotterys[vm.curLottery].page++;
            Vue.nextTick(() => {
                getData({
                    codetype: codetype,
                    lotterytype: vm.lotterys[vm.curLottery].code,
                    page: vm.lotterys[vm.curLottery].page,
                    pagesize: 20
                }, function(data) {
                    var nomore = false;
                    vm.lotterys[vm.curLottery].list = vm.lotterys[vm.curLottery].list.concat(data[`list${codetype}`]);
                    if (vm.lotterys[vm.curLottery].page >= data.pagecount) {
                        nomore = true;
                    }
                    mui(pullRefreshEl).pullRefresh().endPullupToRefresh(nomore);
                })
            })
        }
    });
})

function getData(params, callback) {
    tools.fetch({
        url: '/infomation/decodelist.jsp',
        data: params,
        method: 'POST',
        dataType: 'json',
        success: function(d) {
            callback(d);
        }
    })
}

var codetype = (location.search.match(/[?&]codetype=(.*?)(?:&|$)/) || [])[1];

var vm = new Vue({
    el: '#app',
    data: {
        lotterys: lotterys,
        curLottery: 0,
        page: 1
    },
    methods: {
        changeLtype: function(event) {
            var dataset = event.target.dataset;
            var curLottery = dataset.index,
                curforecast = 0;
            this.curLottery = curLottery;
            this.lotterys[curLottery].product[curforecast].page = 1;
            mui(`.mui-slider`).slider().gotoItem(dataset.index);
            Vue.nextTick(() => {
                getData({
                    codetype: codetype,
                    lotterytype: this.lotterys[this.curLottery].code,
                    page: this.page,
                    pagesize: 20
                }, function(data) {
                    this.lotterys[this.curLottery].list = data[`list${codetype}`];
                }.bind(this))
            })
        }
    },
    created: function() {
        getData({
            codetype: codetype,
            lotterytype: this.lotterys[this.curLottery].code,
            page: this.page,
            pagesize: 20
        }, function(data) {
            this.lotterys[this.curLottery].list = data[`list${codetype}`];
        }.bind(this))
    }
})