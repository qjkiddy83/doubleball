var lotterys = require('./lottery-data.js');
var $ = require('./zepto.js');

var sliderIndex = 0;
document.querySelector('#slider1').addEventListener('slide', function(event) {
    sliderIndex = event.detail.slideNumber;
    $('.lottery-classify li').eq(sliderIndex).addClass('active').siblings().removeClass('active')
    // setScontainerH();
});

function setScontainerH() {
    $('.mui-slider-group .scroll-container').eq(sliderIndex).height($(window).height() - $('.mini-classify').eq(sliderIndex).height() - 235)
}


;
(function(mui) {
    mui.ready(function() {
        //循环初始化所有下拉刷新，上拉加载。
        mui.each(document.querySelectorAll('.mui-scroll-wrapper'), function(index, pullRefreshEl) {
            var aa = mui(pullRefreshEl).pullRefresh({
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
                                        <h3>第一天堂</h3>
                                        <div class="balls">精选9+3 <p class="mui-inline mui-col-xs-8 mui-col-ms-9"><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span><span class="ball blue">01</span><span class="ball blue">01</span><span class="ball blue">01</span></p></div>
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
    // setScontainerH();
})

var curLottery = lotterys[sliderIndex],
    page = 0;
var vm = new Vue({
    el: '#app',
    data: {
        lotterys: lotterys,
        curLottery: curLottery,
        forecasttype: curLottery.product[0].code,
        forecasttypename: curLottery.product[0].name,
        lottery: "-,-,-,-,-,-|-",
        lotterytime: "0000-00-00",
        lotterytype: curLottery.code,
        lotterytypename: curLottery.name,
        pagecount: "1",
        periods: "0000000",
        returnlist: []
    }
})

function getData() {
    $.ajax({
        url: '/forecast/forecastprivlist.jsp',
        data: {
            forecasttype: curLottery.product[0].code,
            lotterytype: curLottery.code,
            page: page,
            pagesize: 20
        },
        dataType: 'json',
        success: function(d) {
            vm.periods = d.periods;
        }
    })
}
getData();
// setScontainerH();
