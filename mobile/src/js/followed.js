var $ = require('./zepto.js');
var Vue = require('./vue');
var mui = require('./mui/mui');
var tools = require('./tools');

mui.ready(function() {
    mui('.mui-scroll-wrapper-segmented').pullRefresh({
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
        vm.page = 1;
        getData({
            page: 1,
            pagesize: 20
        }, function(data) {
            vm.list = data.followlist;
            mui('.mui-scroll-wrapper-segmented').pullRefresh().endPulldownToRefresh();
        })
    }
    /**
     * 上拉加载具体业务实现
     */
    function pullupRefresh() {
        vm.page++;
        Vue.nextTick(() => {
            getData({
                page: vm.page,
                pagesize: 20
            }, function(data) {
                var nomore = false;
                vm.list = vm.list.concat(data.followlist);
                if (vm.page >= data.pagecount) {
                    nomore = true;
                }
                mui('.mui-scroll-wrapper-segmented').pullRefresh().endPullupToRefresh(nomore);
            })
        })
    }
})

function getData(params, callback) {
    tools.fetch({
        url: '/exper/followlist.jsp',
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
        list:[],
        page: 1
    },
    created: function() {
        getData({
            page: this.page,
            pagesize: 20
        }, function(data) {
            this.list = data.followlist
        }.bind(this))
    }
})