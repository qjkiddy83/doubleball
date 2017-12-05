document.querySelector('#slider1').addEventListener('slide', function(event) {
    $('.lottery-classify li').eq(event.detail.slideNumber).addClass('active').siblings().removeClass('active')
});
;(function($) {
    require('./mui/mui.pullToRefresh')($, window, document);
    require('./mui/mui.pullToRefresh.material')($);
    var deceleration = $.os.ios ? 0.003 : 0.0009;
    $('.mui-scroll-wrapper').scroll({
        bounce: false,
        indicators: true, //是否显示滚动条
        deceleration: deceleration
    });
    $.ready(function() {
        //循环初始化所有下拉刷新，上拉加载。
        $.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
            $(pullRefreshEl).pullToRefresh({
                down: {
                    callback: function() {
                        var self = this;
                        setTimeout(function() {
                            var ul = self.element.querySelector('.mui-table-view');
                            ul.insertBefore(createFragment(ul, index, 10, true), ul.firstChild);
                            self.endPullDownToRefresh();
                        }, 1000);
                    }
                },
                up: {
                    callback: function() {
                        var self = this;
                        setTimeout(function() {
                            var ul = self.element.querySelector('.mui-table-view');
                            ul.appendChild(createFragment(ul, index, 5));
                            self.endPullUpToRefresh();
                        }, 1000);
                    }
                }
            });
        });
        var createFragment = function(ul, index, count, reverse) {
            var length = ul.querySelectorAll('li').length;
            var fragment = document.createDocumentFragment();
            var li;
            for (var i = 0; i < count; i++) {
                li = document.createElement('li');
                li.className = 'mui-table-view-cell';
                li.innerHTML = `<a class="">
                                    <img class="mui-media-object mui-pull-left" src="../images/cbd.jpg">
                                    <div class="mui-media-body">
                                        <h3>第一天堂</h3>
                                        <div class="balls">精选9+3 <p class="mui-inline mui-col-xs-8 mui-col-ms-9"><span class="ball">01</span><span class="ball">01</span><span class="ball">01</span><span class="ball">01</span><span class="ball">01</span><span class="ball">01</span><span class="ball">01</span><span class="ball">01</span><span class="ball">01</span><span class="ball">01</span><span class="ball">01</span><span class="ball blue">01</span><span class="ball blue">01</span><span class="ball blue">01</span></p></div>
                                        <p class='mui-ellipsis'>烤炉模式的城，到黄昏，如同打翻的调色盘一般.</p>
                                    </div>
                                    <em>中奖</em>
                                </a>`;
                fragment.appendChild(li);
            }
            return fragment;
        };
    });
})(require('./mui/mui'))

var $ = require('./zepto.js');
function combine(list,_this){
	list.each(function(i){
		if(i>6 && !$(this).attr('node-act')){
			$(this).hide();
			_this.html(`<span>更多 <i class="mui-icon mui-icon-arrowdown"></i></span>`).data('combined',1)
		}
	})
	_this.closest('.mui-slider-group').find('.li-praised').addClass('combine')
}
function expand(list,_this){
	list.show();
	_this.html(`<span>收起 <i class="mui-icon mui-icon-arrowup"></i></span>`).data('combined',0)
	_this.closest('.mui-slider-group').find('.li-praised').removeClass('combine')
}
$(document).on('tap','[node-act="combine"]',function(){
	var _this = $(this);
	if(_this.data('combined')){
		expand($(this).parent().find('li'),_this)
	}else{
		combine($(this).parent().find('li'),_this)
	}
})