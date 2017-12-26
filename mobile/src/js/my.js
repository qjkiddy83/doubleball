var md5 = require('blueimp-md5');
var $ = require('./zepto.js');
var Vue = require('./vue.js');
var tools = require('./tools');
var mui = require('./mui/mui.js')
var cookie = require('js-cookie');

function userinfo(_this) {
    if (_this.userid)
        tools.fetch({
            url: '/user/getinfo.jsp',
            data: {
                userid: _this.userid
            },
            method: "POST",
            dataType: 'json',
            success(data) {
                if (data.statuscode !== "1") {
                    mui.alert(`${data.statusmsg}`, '提示');
                } else {
                    $.extend(_this, data.user)
                    localStorage["__user__"] = JSON.stringify(data.user);
                }
            }
        })
}

var vm = new Vue({
    el: '#app',
    data: {
        userid: cookie.get('uid'),
        userpic: '',
        nickname: '',
        balance: ''
    },
    methods: {
        logout() {
            cookie.remove('uid');
            localStorage.removeItem('__user__');
            location.href = './'
        },
        checkin() {
            var _this = this;
            if (!this.userid) {
                location.href = "login.html";
                return;
            }
            tools.fetch({
                url: '/user/sign.jsp',
                data: {
                    userid: _this.userid
                },
                method: "POST",
                dataType: 'json',
                success(data) {
                    if (data.statuscode !== "1") {
                        mui.alert(`${data.statusmsg}`, '提示');
                    } else {
                        userinfo(_this)
                    }
                }
            })
        }
    },
    created() {
        userinfo(this)
    }
})