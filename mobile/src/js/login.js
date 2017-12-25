var md5 = require('blueimp-md5');
var $ = require('./zepto.js');
var Vue = require('./vue.js');
var tools = require('./tools');
var mui = require('./mui/mui.js')
var cookie = require('js-cookie');

var vm = new Vue({
    el: '#app',
    data: {
        account: '',
        pass: ''
    },
    methods: {
        submit(e) {
            if (!tools.validator.mobile.rules.test(this.account)) {
                mui.alert(`${tools.validator.mobile.error}`, '提示');
                return false;
            }
            if (!tools.validator.password.rules.test(this.pass)) {
                mui.alert(`请输入正确的密码`, '提示');
                return false;
            }
            tools.fetch({
                url: '/user/login.jsp',
                data: {
                    account: this.account,
                    pass: md5(`pass=${this.pass}|${tools.key}`)
                },
                method: "POST",
                dataType: 'json',
                success(data) {
                    if (data.statuscode !== "1") {
                        mui.alert(`${data.statusmsg}`, '提示');
                        return;
                    } else {
                        localStorage["__user__"] = JSON.stringify(data.user);
                        cookie.set('uid', data.user.userid, 7);
                        location.href = 'my.html'
                    }
                }
            })
        }
    }
})