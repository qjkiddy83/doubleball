var $ = require('./zepto.js');
var sliderIndex = 0;
document.querySelector('#slider1').addEventListener('slide', function(event) {
    sliderIndex = event.detail.slideNumber;
    $('.lottery-classify li').eq(sliderIndex).addClass('active').siblings().removeClass('active')
});