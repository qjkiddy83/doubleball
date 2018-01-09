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
        $.ajax(Object.assign({
            headers: {
                "channel": "",
                "platform": 'iOS',
                "type": 'demo',
                "userid": cookie.get('uid') || '',
                "t": t,
                "version": '1.0.0',
                "package": '',
                "sign": sign(args.data, t)
            }
        }, args));
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
    }
}