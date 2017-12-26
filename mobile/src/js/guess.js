var lotterys = require('./lottery-data.js');
var $ = require('./zepto.js');
var mui = require('./mui/mui');
var Vue = require('./vue');
var tools = require('./tools');

lotterys.map(function(item) { //初始化数据结构
    $.extend(item, {
        list0001: [],
        list0002: [],
        list0003: []
    })
})

mui.ready(function() {
    mui('.lottery-classify').scroll({
        scrollY: false, //是否竖向滚动
        scrollX: true
    });
    mui('.mui-scroll-wrapper-segmented').scroll({
        scrollY: true, //是否竖向滚动
        scrollX: false
    });
    document.querySelector('#slider1').addEventListener('slide', function(event) {
        vm.curLottery = event.detail.slideNumber;
        Vue.nextTick(() => {
            getData({
                lotterytype: vm.lotterys[vm.curLottery].code,
                page: vm.page,
                pagesize: 20
            }, function(data) {
                setData(data)
            })
        })
    });
});

function setData(data) {
    vm.lotterys[vm.curLottery].list0001 = data.list.filter(item =>{
        return item.codetype == '0001'
    }) || [];
    vm.lotterys[vm.curLottery].list0002 = data.list.filter(item =>{
        return item.codetype == '0002'
    }) || [];
    vm.lotterys[vm.curLottery].list0003 = data.list.filter(item =>{
        return item.codetype == '0003'
    }) || [];
}

function getData(params, callback) {
    tools.fetch({
        url: '/infomation/decodelist.jsp',
        data: params,
        method: 'POST',
        dataType: 'json',
        success: function(d) {
            // d = {"list0003":[{"id":"2","time":"2017-09-25","conent":"\u8BF7\u8F93\u5165\u5185\u5BB9adfa","expername":"adfasd","titile":"ddddddddd","codetype":"0003"}],"list0002":[],"list0001":[{"id":"1","time":"2017-09-19","conent":"\u8BF7\u8F93\u5165\u5185\u5BB92222ff","expername":"4444","titile":"titlr","codetype":"0001"}],"statusmsg":"\u6210\u529F","statuscode":"1"} ;
            callback(d);
        }
    })
}

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
        }
    },
    created: function() {
        getData({
            lotterytype: this.lotterys[this.curLottery].code,
            page: this.page,
            pagesize: 20
        }, function(data) {
            setData(data)
        }.bind(this))
    }
})