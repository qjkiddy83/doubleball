let $ = require('./zepto.js');
module.exports = {
    fetch(args) {
        $.ajax(Object.assign({
            headers: {

            }
        }, args));
    },
    key: 'dflksdf0980bald294mda',
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