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
        onbeforerequest: function(context) {
            // 列表请求数据
            context.tableParams = {};
        },
        onbeforerender: function(context) {
            // 面包屑导航
            ecui.esr.setData('globleCrumbs', [{
                content: '订单'
            }]);
            // 图片尺寸
            context.pixelLists = context.pixelLists || [];
            // 输入校验规则
            context.inputRules = {
                message: '年龄不能为空',
                reg: '^[a-fA-F0-9]{6,6}$'
            };
        },
        onafterrender: function(context) {},
        onleave: function(context) {
            yiche.util.removeDialog();
        }
    });
}());