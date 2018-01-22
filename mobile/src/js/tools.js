var cookie = require('js-cookie');
var md5 = require('blueimp-md5');
let $ = require('./zepto.js');
var signkey = '392lkfdsa9dakdjfasd';

function sign(args, t) {
    var keys = Object.keys(args).sort(),
        arr = [];
    keys.forEach(function(key) {
        arr.push(key + '=' + args[key])
    })
    arr.push(t + signkey)
    return md5(arr.join('|'))
}

module.exports = {
    fetch(args) {
        let t = Math.floor(Date.now() / 1000);
        args.type = args.type || "post";
        // args.url = 'http://115.28.145.132'+args.url;
        $.ajax(Object.assign({}, args, {
            headers: {
                "channel": "",
                "platform": 'iOS',
                "type": 'demo',
                "userid": cookie.get('uid') || '',
                "t": t,
                "version": '1.0.0',
                "package": '',
                "sign": sign(args.data, t)
            },
            success(data) {
                if (data.statuscode == '-1003') {
                    location.href = 'login.html';
                    return;
                }
                args.success(data);
            }
        }));
    },
    key: signkey,
    validator: {
        'password': {
            'rules': /^[0-9a-zA-Z]{6,16}$/,
            'error': "您的密码必须为6-16位数字/字母或组合"
        },
        'mobile': {
            'rules': /^[1-9]\d{10}$/,
            'error': '对不起，您填写的手机号码不正确！'
        },
        'empty': {
            'rules': /^\s*$/
        }
    },
    pay:function(price,callback){
        this.fetch({
            url: '/user/getinfo.jsp',
            data: {
                userid: cookie.get('uid')
            },
            method: "POST",
            dataType: 'json',
            success(data) {
                if (data.statuscode !== "1") {
                    mui.alert(`${data.statusmsg}`, '提示');
                } else {
                    $('body').append(`<div class="paylayer">
                        <header class="mui-bar mui-bar-nav"><a href="javascript:;" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
                            <h1 class="mui-title">支付</h1>
                        </header>
                        <div class="mui-content">
                            <p class="mui-table-view-cell" >支付金额：￥${price}</p>
                            <dl>
                                <dt>请选择支付方式</dt>
                                <dd>
                                    <div class="mui-input-row mui-radio mui-left">
                                        <label><i class="iconfont icon-zhifubaozhifu"></i><span>支付宝</span></label>
                                        <input name="rechargetype" value="0066" type="radio" checked="">
                                    </div>
                                </dd>
                                <dd>
                                    <div class="mui-input-row mui-radio mui-left">
                                        <label><i class="iconfont icon-jinbi"></i><span>金币（余额：${data.user.balance}元）</span></label>
                                        <input name="rechargetype" value="0004" type="radio">
                                    </div>
                                </dd>
                            </dl>
                            <div class="mui-btn-cont">
                                <a href="javascript:;" id="next" class="mui-btn mui-btn-block mui-btn-danger" >下一步</a>
                            </div>
                        </div>
                    </div>`)
                    $('.paylayer').on('click','#next',function(){
                        callback($('.paylayer [name="rechargetype"]:checked').val());
                        $('.paylayer').remove();
                    }).on('tap','.mui-icon-left-nav',function(){
                        $('.paylayer').remove();
                    })
                }
            },
            error(xhr){
                console.log(xhr.responseText)
            }
        })
        
    }
}