var $ = require('./zepto.js');
var Vue = require('./vue.js');
var tools = require('./tools');
var cookie = require('js-cookie');
var mui = require('./mui/mui.js')

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
            tools.fetch({
                url: '/money/balance.jsp',
                data: {
                    rechargeamount: this.rechargeamount,
                    rechargetype: this.rechargetype
                },
                method: "POST",
                dataType: 'json',
                success(data) {
                    let tpl = '',
                    jumpurl = data.rechargeorder.jumpurl.split('?');
                    jumpurl[1].split('&').forEach(item=>{
                        let kv = item.split('=');
                        tpl += `<input name="${kv[0]}" type="hidden" value="${kv[1]}"/>`;
                    })
                    $(`<form action="${jumpurl[0]}" target="_blank">${tpl}</form>`).appendTo($('body')).submit(); 
                }
            })
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