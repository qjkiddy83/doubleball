var $ = require('./zepto.js');
var sliderIndex = 0;
document.querySelector('#slider1').addEventListener('slide', function(event) {
    sliderIndex = event.detail.slideNumber;
    $('.lottery-classify li').eq(sliderIndex).addClass('active').siblings().removeClass('active')
});

;(function(mui) {
	require('./mui/mui.pullToRefresh.js')(mui,window,document)
	require('./mui/mui.pullToRefresh.material.js')(mui)
    mui.ready(function() {
        mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
			mui(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var self = this;
						setTimeout(function() {
							var ul = self.element.querySelector('.mui-table-view');
							// ul.insertBefore(createFragment(ul, index, 10, true), ul.firstChild);
							self.endPullDownToRefresh();
						}, 1000);
					}
				},
				up: {
					callback: function() {
						var self = this;
						setTimeout(function() {
							var ul = self.element.querySelector('.mui-table-view');
							// ul.appendChild(createFragment(ul, index, 5));
							self.endPullUpToRefresh();
						}, 1000);
					}
				}
			});
		});
    });
})(require('./mui/mui'))