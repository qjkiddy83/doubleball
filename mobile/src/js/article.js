var $ = require('./zepto.js');
var Vue = require('./vue.js');
var tools = require('./tools');

var vm = new Vue({
    el: '#app',
    data: {
        information: {}
    },
    methods: {

    },
    beforeCreate: function() {
        var that = this;
        var id = (location.search.match(/[?&]id=(.*?)(?:&|$)/) || [])[1];
        tools.fetch({
            url: '/infomation/infomationdetails.jsp',
            data: {
                id: id
            },
            method: "POST",
            dataType: 'json',
            success: function(data) {
                that.information = data.information;
            }
        })
    }
})