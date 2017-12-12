var $ = require('./zepto.js');


;(function(mui) {
    mui.ready(function() {
    	mui.each(document.querySelectorAll('.mui-slider'),function(index,dom){
			var sliderIndex = 0;
			dom.addEventListener('slide', function(event) {
			    sliderIndex = event.detail.slideNumber;
			    $(dom).prev('.lottery-classify').find('li').eq(sliderIndex).addClass('active').siblings().removeClass('active')
			});
		})

        //循环初始化所有下拉刷新，上拉加载。
        mui.each(document.querySelectorAll('.mui-scroll-wrapper'), function(index, pullRefreshEl) {
            mui(pullRefreshEl).pullRefresh({
                down: {
                    callback: pulldownRefresh
                },
                up: {
                    contentrefresh: '正在加载...',
                    callback: pullupRefresh
                }
            });

            /**
             * 下拉刷新具体业务实现
             */
            function pulldownRefresh() {
                setTimeout(function() {
                    $(pullRefreshEl).find('ul').html(createFragment(5))
                    mui(pullRefreshEl).pullRefresh().endPulldownToRefresh(); //refresh completed
                }, 1500);
            }
            var count = 0;
            /**
             * 上拉加载具体业务实现
             */
            function pullupRefresh() {
                setTimeout(function() {
                    mui(pullRefreshEl).pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。
                    $(pullRefreshEl).find('ul').append(createFragment(5))
                }, 1500);
            }
        });
        var createFragment = function(count) {
            var fragment = document.createDocumentFragment();
            var li;
            for (var i = 0; i < count; i++) {
                li = document.createElement('li');
                li.className = 'mui-table-view-cell';
                li.innerHTML = `双色球第17144期专家推荐号码全汇总
                                    <span>2017-12-02</span>`;
                fragment.appendChild(li);
            }
            return fragment;
        };
    });
})(require('./mui/mui'))