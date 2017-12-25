var $ = require('./zepto.js');
var lotterys = require('./lottery-data.js');
var Vue = require('./vue');
var tools = require('./tools');


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
        decode() {
            this.decoded = true;
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