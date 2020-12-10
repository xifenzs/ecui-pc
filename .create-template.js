/***route.js-begin***/
(function() {
    Object.assign(
        NS.data, {}
    );
    Object.assign(
        NS.ui, {}
    );
    ecui.esr.addRoute('{route}', {
        model: [''],
        main: 'container', // 挂载容器
        view: '{route}Target', // 渲染模板
        onbeforerequest: function(context) {},
        onbeforerender: function(context) {},
        onafterrender: function(context) {},
        onleave: function(context) {
            yiche.util.removeDialog();
        }
    });
}());
/***route.js-end***/

/***route.html-begin***/
<!-- target:{route}Target -->
<div class="page-container">
    <div class="page-title"></div>  
</div>
/***route.html-end***/

/***route.css-begin***/
/***route.css-end***/