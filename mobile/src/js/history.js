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
        vm.page = 1;
        Vue.nextTick(function(){
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
                vm.list = vm.list = d.lotterylist
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh(nomore);
            });
        })
    }
    /**
     * 上拉加载具体业务实现
     */
    function pullupRefresh() {
        vm.page++;
        Vue.nextTick(function(){
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
        })
    }
})(require('./mui/mui'))