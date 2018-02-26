var $ = require('./zepto.js');
var lotterys = require('./lottery-data.js');
var Vue = require('./vue');
var tools = require('./tools');
var mui = require('./mui/mui');


function getData(params, callback) {
    tools.fetch({
        url: '/infomation/decodedetails.jsp',
        data: params,
        method: 'POST',
        dataType: 'json',
        success: function(d) {
            callback(d);
        }
    })
}

var vm = new Vue({
    el: '#app',
    data: {
        id: '',
        decodecontent: '',
        content: '',
        time: '',
        price: '',
        title: '',
        codetype: '',
        codetypename: '',
        lotteryname: '',
        pic: '',
        expername: '',
        decoded: false
    },
    methods: {
        decode:function() {
            tools.pay(this.price,function(rechargetype){
                tools.fetch({
                    url: '/money/infomationdecode.jsp',
                    data: {
                        rechargetype: rechargetype,
                        decodeid:this.id
                    },
                    method: "POST",
                    dataType: 'json',
                    success(data) {
                        if(rechargetype == tools.payType.COIN){
                            if(data.statuscode == 1){
                                mui.alert(`${data.statusmsg}`, '提示',function(){
                                    location.replace(location.href);
                                });
                            }
                        }else if(rechargetype == tools.payType.ALIPAY){
                            if(data.statuscode == 1){
                                $('#paying').show().find('iframe').attr('src',data.rechargeorder.jumpurl);
                            }else if(data.statuscode == "-10801"){
                                mui.alert(`${data.statusmsg}`, '提示',function(){
                                    location.replace(location.href);
                                });
                            }
                        }
                    }
                })
            }.bind(this))
        }
    },
    created: function() {
        getData({
            id: (location.search.match(/[?&]id=(.*?)(?:&|$)/) || [])[1]
        }, function(data) {
            $.extend(this, data.info);
            this.lotteryname = lotterys.filter((item) => {
                return item.code == data.info.codetype
            })[0].name
        }.bind(this))
    }
})