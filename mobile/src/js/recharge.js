var $ = require('./zepto.js');
var Vue = require('./vue.js');
var tools = require('./tools');
var mui = require('./mui/mui.js')

var vm = new Vue({
    el: '#app',
    data: {
        rechargetype:'0066',
        rechargeamount:100
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
                    console.log(data)
                }
            })
        }
    }
})