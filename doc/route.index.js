(function() {
    Object.assign(
        NS.data, {}
    );

    Object.assign(
        NS.ui, {
            setBarEcharts: ecui.inherits(
                yiche.ui.Echarts,
                function(el, options) {
                    yiche.ui.Echarts.call(this, el, options);
                }, {
                    transfromEchartOptions: function(data) {
                        return {
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [{
                                data: [820, 932, 901, 934, 1290, 1330, 1320],
                                type: 'line',
                                areaStyle: {}
                            }]
                        }
                    }
                }
            )
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
                message: '颜色不能为空',
                reg: '^[a-fA-F0-9]{6,6}$'
            };
            // 非空输入校验
            context.noNullRules = {
                message: '内容不能为空',
                reg: '.+'
            };
            // 图表
            // echart 请求参数
            context.echartReqParams = {};
            context.echartReqInfo = {
                url: yiche.info.API_BASE + 'filter/cmd', // 接口地址
                method: 'post', // 接口类型
                params: context.echartReqParams, // 请求参数数据源,
                immediate: true, // 立即渲染
                defaultOption: {
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                        areaStyle: {}
                    }]
                }, // echart的默认配置
            };
        },
        onafterrender: function(context) {},
        onleave: function(context) {
            yiche.util.removeDialog();
        }
    });
}());