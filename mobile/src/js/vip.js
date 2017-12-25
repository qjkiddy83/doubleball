// /subscribe/subscribeprice.jsp
var $ = require('./zepto.js');
var Vue = require('./vue.js')
var tools = require('./tools');
var lotterys = require('./lottery-data.js');
var cookie = require('js-cookie');

var vm = new Vue({
    el: '#app',
    data: {
        lotterys: lotterys,
        subscribetype: '02',
        userid: cookie.get('uid'),
        month: [],
        week: [],
        cur: 'month'
    },
    methods: {

    },
    created: function() {
        var _this = this;
        tools.fetch({
            url: '/subscribe/subscribeprice.jsp',
            data: {
                subscribetype: this.subscribetype,
                userid: cookie.get('uid')
            },
            method: "POST",
            dataType: 'json',
            success(data) {
                if (data.statuscode !== "1") {
                    mui.alert(`${data.statusmsg}`, '提示');
                } else {
                    data.subscribepricelist.map(item => {
                        var _item = lotterys.filter(lottery => {
                            return (lottery.code == item.lotterytype)
                        });
                        item.lotteryname = _item.length ? _item[0].name : "全彩种"
                    })
                    _this.month = data.subscribepricelist
                }
            }
        })
    }
})

;
(function(mui) {
    mui.ready(function() {
        mui('.mui-scroll-wrapper-segmented').scroll({
            scrollY: true, //是否竖向滚动
            scrollX: false
        });
        document.querySelector('#slider1').addEventListener('slide', function(event) {
            vm.cur = event.detail.slideNumber == 0?"month":'week';
            vm.subscribetype = event.detail.slideNumber == 0?"02":'01';
            var _this = vm;
            Vue.nextTick(function(){
		        tools.fetch({
		            url: '/subscribe/subscribeprice.jsp',
		            data: {
		                subscribetype: vm.subscribetype,
		                userid: cookie.get('uid')
		            },
		            method: "POST",
		            dataType: 'json',
		            success(data) {
		                if (data.statuscode !== "1") {
		                    mui.alert(`${data.statusmsg}`, '提示');
		                } else {
		                    data.subscribepricelist.map(item => {
		                        var _item = lotterys.filter(lottery => {
		                            return (lottery.code == item.lotterytype)
		                        });
		                        item.lotteryname = _item.length ? _item[0].name : "通用"
		                    })
		                    _this[vm.cur] = data.subscribepricelist
		                }
		            }
		        })
	        })
        });
    });
})(require('./mui/mui'))