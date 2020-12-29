
(function() {
    Object.assign(
        NS.data, {}
    );

    Object.assign(
        NS.ui, {

        }
    );

    ecui.esr.addRoute('index', {
        model: [
//         'pixelLists@POST /console/report/filter/pixel',
        ],
        main: 'container', // 挂载容器
        view: 'docTarget', // 渲染模板
        children: ['docTable'],
        onbeforerequest: function(context) {
            // 列表请求数据
            context.tableParams = {
            };
        },
        onbeforerender: function(context) {
            // 面包屑导航
            ecui.esr.setData('globleCrumbs', [{
                content: '订单'
            }]);
            // 图片尺寸
            context.pixelLists = context.pixelLists || [];
        },
        onafterrender: function(context) {},
        onleave: function(context) {
            yiche.util.removeDialog();
        }
    });

    ecui.esr.addRoute(
        'docTable', 
        {
            // model: ['docTable@JSON /console/report/creatives?${tableParams}'],
            main: 'table_view',
            view: 'docTableTarget',
            searchParm: {
                pageNo: 1,
                pageSize: 20
            },
            onbeforerequest: function(context) {
                let tmp = {};
                ecui.esr.parseObject(document.forms.docForm, tmp);

                // 记录当前页信息
                context.pageNo = context.pageNum = context.pageNo || +this.searchParm.pageNo;
                context.pageSize = this.searchParm.pageSize = +context.pageSize || +this.searchParm.pageSize;
                // 回填 pageNum 和 pageSize
                context.tableParams = Object.assign(context.tableParams, tmp, {
                    pageNum: context.pageNo,
                    pageSize: context.pageSize,
                });
            },
            onbeforerender: function(context) {
               
            },
            onafterrender: function(context) {}
        }
    )
}());

