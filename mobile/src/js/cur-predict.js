var $ = require('./zepto.js');
var sliderIndex = 0;
document.querySelector('#slider1').addEventListener('slide', function(event) {
    sliderIndex = event.detail.slideNumber;
    $('.lottery-classify li').eq(sliderIndex).addClass('active').siblings().removeClass('active')
    setScontainerH();
});

function setScontainerH() {
    $('.mui-slider-group .scroll-container').eq(sliderIndex).height($(window).height() - $('.mini-classify').height() - 166)

}

setScontainerH();

;(function(mui) {
    mui.ready(function() {
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
        var createFragment = function(count) {
            var fragment = document.createDocumentFragment();
            var li;
            for (var i = 0; i < count; i++) {
                li = document.createElement('li');
                li.className = 'mui-table-view-cell';
                li.innerHTML = `<a href="/expert.html">
                                        <img class="mui-media-object mui-pull-left" src="../images/cbd.jpg">
                                        <div class="mui-media-body">
                                            <h3><span>第一天堂</span><small>专家</small><small>测7期中7期</small></h3>
                                            <p class='mui-ellipsis mui-col-xs-10'>蓝球定五：<span class="color-link">想中大奖，必看该专家的预测号码</span></p>
                                            <p class='mui-ellipsis'>烤炉模式的城，到黄昏，如同打翻的调色盘一般.</p>
                                        </div>
                                        <em class="iconfont icon-ioseye"></em>
                                    </a>`;
                fragment.appendChild(li);
            }
            return fragment;
        };
    });
})(require('./mui/mui'))

function combine(list, _this) {
    list.each(function(i) {
        if (i > 6 && !$(this).attr('node-act')) {
            $(this).hide();
            _this.html(`<span>更多 <i class="mui-icon mui-icon-arrowdown"></i></span>`).data('combined', 1)
        }
    })
    _this.closest('.mui-slider-group').find('.li-praised').addClass('combine')
}

function expand(list, _this) {
    list.show();
    _this.html(`<span>收起 <i class="mui-icon mui-icon-arrowup"></i></span>`).data('combined', 0)
    _this.closest('.mui-slider-group').find('.li-praised').removeClass('combine')
}
$(document).on('tap', '[node-act="combine"]', function() {
    var _this = $(this);
    if (_this.data('combined')) {
        expand($(this).parent().find('li'), _this)
    } else {
        combine($(this).parent().find('li'), _this)
    }
    setScontainerH();
})