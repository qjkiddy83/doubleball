import '../css/mui.css';
import '../css/base.css';
import mui from '../js/mui/mui.js';
var $ = require('../js/zepto.js');
require('../js/vue.js')
mui.init();
mui("body").on('tap', 'a', function() {
    var href = this.getAttribute('href');
    if (href)
        location.href = href
})

$('.mui-bar-nav .mui-icon-left-nav').on('tap',function(){
	history.go(-1);
})