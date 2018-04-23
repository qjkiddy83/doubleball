var $ = require('./zepto.js');
var Vue = require('./vue.js');
var tools = require('./tools');
var cookie = require('js-cookie');
var mui = require('./mui/mui.js')

window.paysuccess = function(){
    location.replace('my.html');
}

var vm = new Vue({
    el: '#app',
    data: {
        rechargetype:'0066',
        rechargeamount:100,
        userid: cookie.get('uid'),
        balance:0
    },
    methods: {
        changeAmount(e){
            this.rechargeamount = e.target.dataset.amount;
        },
        submit(e) {
            let that = this;
            localStorage.buytype = "B";
            tools.pay(that.rechargeamount,function(rechargetype){
                tools.fetch({
                    url: '/money/balance.jsp',
                    data: {
                        rechargeamount: that.rechargeamount,
                        rechargetype: rechargetype
                    },
                    method: "POST",
                    dataType: 'json',
                    success(data) {
                        if(rechargetype == tools.payType.WECHAT){
                            if(data.rechargeorder.jumpurl){
                                location.href = data.rechargeorder.jumpurl;
                                mui.confirm('是否已经支付成功？', '微信支付', ['支付成功', '重新支付'], function(e) {
                                    if (e.index == 0) {
                                        paysuccess();
                                    } else {
                                        location.href = data.rechargeorder.jumpurl
                                        return false;
                                    }
                                })
                            }else if(data.statuscode == "-10801"){
                                mui.alert(`${data.statusmsg}`, '提示');
                            }
                        }else{
                            if(data.statuscode == 1){
                                $('#paying').show().find('iframe').attr('src',data.rechargeorder.jumpurl);
                            }else if(data.statuscode == "-10801"){
                                mui.alert(`${data.statusmsg}`, '提示');
                            }
                        }
                    }
                })
            },1)
        },
        closePaylayer:function(){
            $('#paying').hide().find('iframe').attr('src','');
        }
    },
    created:function(){
        let _this = this;
        tools.fetch({
            url: '/user/getinfo.jsp',
            data: {
                userid: _this.userid
            },
            method: "POST",
            dataType: 'json',
            success(data) {
                _this.balance = data.user.balance;
            }
        })
    }
})