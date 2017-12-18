;
(function(mui) {
    var $ = require('./zepto.js');
    var Vue = require('./vue.js');
    var lotterytype = (location.search.match(/[?&]code=(.*?)(?:&|$)/) || [])[1];
    var lotteryname = (location.search.match(/[?&]name=(.*?)(?:&|$)/) || [])[1];

    function lotteryFormat(str) {
        var ret = [];
        str.split('|').forEach(function(item, i) {
            ret[i] = item.split(',');
        })
        return ret;
    }

    function getData(params, callback) {
        $.ajax({
            url: '/lottery/lotterywinning.jsp',
            data: params,
            method: 'POST',
            dataType: 'json',
            success: function(d) {
                callback(d);

            }
        })
    }

    var vm = new Vue({
        el: '#app',
        data: {
            pagecount: 1,
            page: 1,
            lotteryname: decodeURIComponent(lotteryname),
            list: []
        },
        beforeCreate: function() {
            var _this = this;
            getData({
                lotterytype: lotterytype,
                drawstat: 1,
                page: 1,
                pagesize: 20
            }, function(d) {
                d.lotterylist.map(function(item) {
                    item.lotteryFormat = lotteryFormat(item.lottery)
                })
                _this.list = d.lotterylist;
                _this.pagecount = d.pagecount;
            })

        }
    })
    mui.init({
        pullRefresh: {
            container: '#pullrefresh',
            down: {
                callback: pulldownRefresh
            },
            up: {
                contentrefresh: '正在加载...',
                callback: pullupRefresh
            }
        }
    });
    /**
     * 下拉刷新具体业务实现
     */
    function pulldownRefresh() {
        setTimeout(function() {
            var table = document.body.querySelector('.mui-table-view');
            var tpl = '';
            for (var i = 0, len = 5; i < len; i++) {
                tpl += `<li class="mui-table-view-cell">
                    <div class="mui-table">
                        <div class="mui-table-cell mui-col-xs-9">
                            <p class="mui-ellipsis">第20170312期</p>
                            <p class="balls"><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span></p>
                        </div>
                        <div class="mui-table-cell mui-col-xs-3 mui-text-right">
                            <span class="mui-h5">2017-12-05</span>
                        </div>
                    </div>
                </li>`
            }
            table.innerHTML = tpl;
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
        }, 1500);
    }
    var count = 0;
    /**
     * 上拉加载具体业务实现
     */
    function pullupRefresh() {
        vm.page++;
        getData({
            lotterytype: lotterytype,
            drawstat: 1,
            page: vm.page,
            pagesize: 20
        },function(d){
            var nomore = false;
            if(d.pagecount <= vm.page){
                nomore = true;
            }
            d.lotterylist.map(function(item) {
                item.lotteryFormat = lotteryFormat(item.lottery)
            })
            vm.list = vm.list.concat(d.lotterylist)
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(nomore);
        });
    }
})(require('./mui/mui'))