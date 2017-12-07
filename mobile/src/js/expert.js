;(function(mui) {
    var $ = require('./zepto.js');
    var sliderIndex = 0;
    document.querySelector('#slider1').addEventListener('slide', function(event) {
        sliderIndex = event.detail.slideNumber;
        $('.tabs li').eq(sliderIndex).addClass('active').siblings().removeClass('active')
    });

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
                $(pullRefreshEl).find('ul').prepend(createFragment(5))
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

    function createFragment() {
        var tpl = '';
        for (var i = 0, len = 5; i < len; i++) {
            tpl += `<li class="mui-table-view-cell">
                        <div class="mui-table">
                            <div class="mui-table-cell">
                                <p class="mui-ellipsis">双色球兰球定五<span class="mui-h5">2017-12-05</span></p>
                                <button type="button" class="mui-btn mui-btn-danger">查看该预测号码</button>
                            </div>
                        </div>
                    </li>`
        }
        return tpl;
    }

})(require('./mui/mui'))