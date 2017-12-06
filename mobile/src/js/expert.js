;(function(mui) {
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
            var table = document.body.querySelector('#pullrefresh .mui-table-view');
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
            table.innerHTML = tpl;
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
        }, 1500);
    }
    var count = 0;
    /**
     * 上拉加载具体业务实现
     */
    function pullupRefresh() {
        setTimeout(function() {
            mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 2)); 
            var table = document.body.querySelector('#pullrefresh .mui-table-view');
            for (var i = 0, len = 5; i < len; i++) {
                var li = document.createElement('li');
                li.className = 'mui-table-view-cell';
                li.innerHTML = `<div class="mui-table">
                            <div class="mui-table-cell">
                                <p class="mui-ellipsis">双色球兰球定五<span class="mui-h5">2017-12-05</span></p>
                                <button type="button" class="mui-btn mui-btn-danger">查看该预测号码</button>
                            </div>
                        </div>`;
                table.appendChild(li);
            }
        }, 1500);
    }
})(require('./mui/mui'))