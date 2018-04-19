// /subscribe/subscribeprice.jsp
var $ = require('./zepto.js');
var Vue = require('./vue.js')
var tools = require('./tools');
var lotterys = require('./lottery-data.js');
var mui = require('./mui/mui');
var cookie = require('js-cookie');

window.paysuccess = function(){
    mui.alert(`购买成功！`, '提示',function(){
        location.reload();
    });
}

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
        pay:function(event){
            var that = this;
            tools.pay(event.target.dataset.price,function(rechargetype){
                tools.fetch({
                    url: '/money/subscribe.jsp',
                    data: {
                        rechargetype: rechargetype,
                        rechargeamount:event.target.dataset.price,
                        subscribeid:event.target.dataset.subscribeid
                    },
                    method: "POST",
                    dataType: 'json',
                    success(data) {
                        let index = event.target.dataset.index;
                        let li = that[that.cur][index];
                        if(rechargetype == tools.payType.COIN){
                            if(data.statuscode == 1){
                                mui.alert(`购买成功！`, '提示');
                                li.usersubscribe = "1";
                            }else{
                                mui.alert(`${data.statusmsg}`, '提示');
                            }
                        }else{
                            if(data.statuscode == 1){
                                $('#paying').show().find('iframe').attr('src',data.rechargeorder.jumpurl);
                            }else if(data.statuscode == "-10801"){
                                mui.alert(`${data.statusmsg}`, '提示');
                                li.usersubscribe = "1";
                            }
                        }
                        
                    }
                })
            });
        },
        closePaylayer:function(){
            $('#paying').hide().find('iframe').attr('src','');
        }
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

mui.ready(function() {
    mui('.mui-scroll-wrapper-segmented').scroll({
        scrollY: true, //是否竖向滚动
        scrollX: false
    });
    document.querySelector('#slider1').addEventListener('slide', function(event) {
        vm.cur = event.detail.slideNumber == 0 ? "month" : 'week';
        vm.subscribetype = event.detail.slideNumber == 0 ? "02" : '01';
        var _this = vm;
        Vue.nextTick(function() {
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