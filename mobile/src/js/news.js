var $ = require('./zepto.js');
var lotterys = require('./lottery-data.js');
var Vue = require('./vue.js')

function initLtype() {
    var arr = []
    lotterys.forEach(function(item) {
        arr.push({
            code: `l${item.code}`,
            list: [],
            page: 1,
            pagecount: 1
        })
    })
    return arr;
}

function getData(params, callback) {
    $.ajax({
        url: '/infomation/infomationlist.jsp',
        data: {
            informationtype: params.informationtype,
            ltype: params.ltype,
            page: params.page,
            pagesize: 20
        },
        method: "POST",
        dataType: 'json',
        success: function(data) {
            // var data = { "pagecount": "1", "informationtlist": [{ "id": "1", "informationtitile": "\u4FE1\u606F1\u6807\u9898", "informationtime": "20151201" }, { "id": "2", "informationtitile": "\u4FE1\u606F2", "informationtime": "20151201" }], "statusmsg": "\u00E6\u0088\u0090\u00E5\u008A\u009F", "statuscode": "1" };
            callback(data)
        }
    })
}

;
(function(mui) {
    var vm = new Vue({
        el: '#app',
        data: {
            lotterys: lotterys,
            informationtype: 2,
            informationtypename: 'fenxi',
            dataset: {
                'fenxi': {
                    informationtype: 2,
                    curLtype: '0001',
                    curLindex: 0,
                    ltype: initLtype()
                },
                'jiqiao': {
                    informationtype: 3,
                    curLtype: '0001',
                    curLindex: 0,
                    ltype: initLtype()
                },
                'xinwen': {
                    informationtype: 4,
                    pagecount: 1,
                    page: 1,
                    list: []
                }
            }
        },
        methods: {
            changeLtype: function(event) {
                var dataset = event.target.dataset;
                var id = $(event.target).closest('.mui-control-content').attr('id')
                this.dataset[id].curLtype = event.target.dataset.code;
                mui(`#${id} .mui-slider`).slider().gotoItem(event.target.dataset.index)
            },
            changeTab: function(event) {
                this.informationtypename = event.target.dataset.type;
                this.informationtype = event.target.dataset.id;
                // console.log(this.dataset[this.informationtypename])
                getData({
                    informationtype: this.informationtype,
                    ltype: this.dataset[this.informationtypename].curLtype,
                    page: 1,
                    pagesize: 20
                }, function(data) {
                    var curLData = this.dataset[this.informationtypename];
                    var pullRefreshEl;

                    if (this.informationtypename == "xinwen") {
                        pullRefreshEl = $(`#${this.informationtypename} .mui-scroll-wrapper`)[0];
                        curLData.list = data.informationtlist;
                        mui(pullRefreshEl).pullRefresh().endPulldownToRefresh(); //refresh completed
                        if (data.pagecount <= curLData.pagecount) {
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                        }
                    } else {
                        pullRefreshEl = $(`#${this.informationtypename} .mui-scroll-wrapper`).eq(this.dataset[this.informationtypename].curLindex)[0];
                        curLData.ltype[curLData.curLindex].list = data.informationtlist;
                        mui(pullRefreshEl).pullRefresh().endPulldownToRefresh(); //refresh completed
                        if (data.pagecount <= curLData.ltype[curLData.curLindex].pagecount) {
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                        }
                    }

                    // curLData.ltype[curLData.curLindex].list = data.informationtlist;
                    // if (data.pagecount <= curLData.ltype[curLData.curLindex].pagecount) {
                    //     mui(mui('#fenxi .mui-scroll-wrapper')[0]).pullRefresh().endPullupToRefresh(true)
                    // }
                }.bind(this))
            }
        },
        beforeCreate: function() {
            getData({
                informationtype: this.informationtype,
                ltype: this.curLtype,
                page: 1,
                pagesize: 20
            }, function(data) {
                var curLData = this.dataset[this.informationtypename];
                curLData.ltype[curLData.curLindex].list = data.informationtlist;
                if (data.pagecount <= curLData.ltype[curLData.curLindex].pagecount) {
                    mui(mui('#fenxi .mui-scroll-wrapper')[0]).pullRefresh().endPullupToRefresh(true)
                }
            }.bind(this))
        },
        created: function() {
            // console.log(this.dataset.fenxi.ltype)
        }
    })
    mui.ready(function() {
        mui('.lottery-classify').scroll({
            scrollY: false, //是否竖向滚动
            scrollX: true
        });
        $('#jiqiao').removeClass('mui-active') //处理slider插件bug，如果开始未显示，则切换有问题

        mui.each(document.querySelectorAll('.mui-slider'), function(index, dom) {
            var curId = $(dom).closest('.mui-control-content').attr('id');
            dom.addEventListener('slide', function(event) {
                vm.dataset[curId].curLtype = lotterys[event.detail.slideNumber].code;
                var curLData = vm.dataset[vm.informationtypename];
                var pullRefreshEl;

                getData({
                    informationtype: curLData.informationtype,
                    ltype: curLData.curLtype,
                    page: curLData.ltype[curLData.curLindex].page
                }, function(data) {
                    if (vm.informationtypename == "xinwen") {
                        pullRefreshEl = $(`#${vm.informationtypename} .mui-scroll-wrapper`)[0];
                        curLData.list = data.informationtlist;
                        mui(pullRefreshEl).pullRefresh().endPulldownToRefresh(); //refresh completed
                        if (data.pagecount <= curLData.page) {
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                        }
                    } else {
                        pullRefreshEl = $(`#${vm.informationtypename} .mui-scroll-wrapper`).eq(vm.dataset[vm.informationtypename].curLindex)[0];
                        curLData.ltype[curLData.curLindex].list = data.informationtlist;
                        mui(pullRefreshEl).pullRefresh().endPulldownToRefresh(); //refresh completed
                        if (data.pagecount <= curLData.ltype[curLData.curLindex].page) {
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                        }
                    }
                })
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
                    contentnomore: '没有更多数据了',
                    callback: pullupRefresh
                }
            });

            /**
             * 下拉刷新具体业务实现
             */
            function pulldownRefresh() {
                var curLData = vm.dataset[vm.informationtypename];
                // console.log(curLData)
                getData({
                    informationtype: curLData.informationtype,
                    ltype: curLData.curLtype,
                    page: 1 //curLData.ltype[curLData.curLindex].page
                }, function(data) {
                    if (vm.informationtypename == "xinwen") {
                        curLData.list = data.informationtlist;
                        mui(pullRefreshEl).pullRefresh().endPulldownToRefresh(); //refresh completed
                        if (data.pagecount <= curLData.page) {
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                        }
                    } else {
                        curLData.ltype[curLData.curLindex].list = data.informationtlist;
                        mui(pullRefreshEl).pullRefresh().endPulldownToRefresh(); //refresh completed
                        if (data.pagecount <= curLData.ltype[curLData.curLindex].page) {
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                        }
                    }
                })
            }
            /**
             * 上拉加载具体业务实现
             */
            function pullupRefresh() {
                var curLData = vm.dataset[vm.informationtypename];
                curLData.ltype[curLData.curLindex].page++;
                // console.log(curLData)
                getData({
                    informationtype: curLData.informationtype,
                    ltype: curLData.curLtype,
                    page: curLData.ltype[curLData.curLindex].page
                }, function(data) {
                    if (vm.informationtypename == "xinwen") {
                        curLData.list = data.informationtlist;
                        mui(pullRefreshEl).pullRefresh().endPulldownToRefresh(); //refresh completed
                        if (data.pagecount <= curLData.page) {
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                        }
                    } else {
                        curLData.ltype[curLData.curLindex].list = data.informationtlist;
                        mui(pullRefreshEl).pullRefresh().endPulldownToRefresh(); //refresh completed
                        if (data.pagecount <= curLData.ltype[curLData.curLindex].page) {
                            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(true);
                        }
                    }
                })
            }
        });

    });
})(require('./mui/mui'))