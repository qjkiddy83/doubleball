var md5 = require('blueimp-md5');
var $ = require('./zepto.js');
var Vue = require('./vue.js');
var tools = require('./tools');
var mui = require('./mui/mui.js')

var vm = new Vue({
    el: '#app',
    data: {
        account: '',
        nickname: '',
        userpic: '',
        pass: '',
        repass: '',
        autcode: '',
        t_account: '',
        t_userpass: '',
        frm: '',
        agree: false,
        autcoded:0,
        xieyishow:false
    },
    methods: {
        xieyi(){
            this.xieyishow = true;
        },
        xieyihide(){
            this.xieyishow = false;
        },
        getAutCode() {
            if(this.autcoded){
                return false;
            }
            if (!tools.validator.mobile.rules.test(this.account)) {
                mui.alert(`${tools.validator.mobile.error}`, '提示');
                return false;
            }
            this.autcoded = 30;
            let interval = setInterval(() =>{
                this.autcoded --;
                if(this.autcoded == 0){
                    clearInterval(interval);
                }
            },1000)
            tools.fetch({
                url: '/system/sendauthsms.jsp',
                data: {
                    account: this.account,
                    m: 'reguser'
                },
                method: "POST",
                dataType: 'json',
                success(data) {
                    if (data.statuscode !== "1") {
                        mui.alert(`${data.statusmsg}`, '提示');
                    }
                }
            })
        },
        submit(e) {
            if (!tools.validator.mobile.rules.test(this.account)) {
                mui.alert(`${tools.validator.mobile.error}`, '提示');
                return false;
            }
            if (tools.validator.empty.rules.test(this.nickname)) {
                mui.alert(`昵称不能为空`, '提示');
                return false;
            }
            if (!tools.validator.password.rules.test(this.pass)) {
                mui.alert(`${tools.validator.password.error}`, '提示');
                return false;
            }
            if (this.pass !== this.repass) {
                mui.alert(`密码不一致，请重新确认您的密码`, '提示');
                return false;
            }
            if (tools.validator.empty.rules.test(this.autcode)) {
                mui.alert(`请输入正确的验证码`, '提示');
                return false;
            }
            if (!this.agree) {
                mui.alert(`请同意用户服务协议`, '提示');
                return false;
            }
            tools.fetch({
                url: '/user/reguser.jsp',
                data: {
                    account: this.account,
                    nickname: this.nickname,
                    pass: md5(`pass=${this.pass}|${tools.key}`),
                    autcode: this.autcode
                },
                method: "POST",
                dataType: 'json',
                success(data) {
                    if (data.statuscode !== "1") {
                        mui.alert(`${data.statusmsg}`, '提示');
                        return;
                    } else {
                        location.href = 'login.html'
                    }
                }
            })
        }
    }
})