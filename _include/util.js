(function() {
    var core = ecui,
        dom = core.dom,
        ui = core.ui,
        util = core.util,
        ieVersion = /(msie (\d+\.\d)|IEMobile\/(\d+\.\d))/i.test(navigator.userAgent) ? document.documentMode || +(RegExp.$2 || RegExp.$3) : undefined,
        firefoxVersion = /firefox\/(\d+\.\d)/i.test(navigator.userAgent) ? +RegExp.$1 : undefined,
        ext = core.ext;

    yiche.util = {
        /**
         * 获取当前 dom/control 所属路由。
         * @public
         *
         * @param {Element | Control} el 当前元素
         */
        getRoute: function(el) {
            var route,
                parent = ecui.dom.parent(el instanceof ecui.ui.Control ? el.getMain() : el);
            for (; parent; parent = ecui.dom.parent(parent)) {
                if (parent === document.body) {
                    break;
                }
                if (parent.route !== undefined) {
                    route = parent.route;
                    break;
                }
            }
            return route;
        },
        /**
         * 将带 <br/> 的字符串 通过<br/> 分割成数组。
         * @public
         *
         * @param {String} value 带 <br/> 的字符串
         */
        parseBR: function(value) {
            return value.split('<br/>');
        },
        /**
         * 获取 input file 上传的文件的名字
         * @public
         *
         * @param {DOM} input  
         */
        getFileName: function(input) {
            var str = /macintosh|mac os x/i.test(navigator.userAgent) ? '/' : '\\';
            var name = '';
            if (input.files && input.files[0]) {
                name = input.files[0].name;
            } else {
                name = (input.lastValue || input.value).split(str).pop();
            }
            return name;
        },
        /**
         * 移除并释放已打开的dialog控件，用于离开路由时调用
         * @public
         *
         */
        removeDialog: function() {
            var dialogContainer = ecui.$('dialogContainer'),
                dialogContainer_1 = ecui.$('dialogContainer_1'),
                dialogContainer_2 = ecui.$('dialogContainer_2');
            if (dialogContainer) {
                ecui.dispose(dialogContainer);
                dialogContainer.innerHTML = '';
            }
            if (dialogContainer_1) {
                ecui.dispose(dialogContainer_1);
                dialogContainer_1.innerHTML = '';
            }
            if (dialogContainer_2) {
                ecui.dispose(dialogContainer_2);
                dialogContainer_2.innerHTML = '';
            }
        },

        /**
         * 设置页面title标题
         * @public
         *
         * @param {Array} arr title数组
         */
        setLocationPage: function(data) {
            var str = '';
            for (var i = 0, item; item = data[i++];) {
                if (item.href) {
                    str += util.stringFormat('<a href="{2}">{0}</a>{1}', item.text, i < data.length ? '<span> / </span>' : '', item.href);
                } else {
                    str += util.stringFormat('<span>{0}</span>{1}', item.text, i < data.length ? '<span> / </span>' : '');
                }
            }
            ecui.$('location_page').innerHTML = str;
        },
        /**
         * 初始化dialog控件。
         * @public
         *
         * @param {string|Element} container dialog控件容器
         * @param {string} targetName 模板名称
         * @param {object} options 成功回调函数
         *
         * @return {Control} dialog 控件
         */
        initDialog: function(container, targetName, options) {
            if (typeof container === 'string') {
                container = ecui.$(container);
            }
            ecui.dispose(container);
            container.innerHTML = ecui.esr.getEngine().render(targetName, options);
            ecui.init(container);
            return container.children[0].getControl();
        },
        findChildrenControl: function(el, UIClass) {
            if (!el || !UIClass) {
                return [];
            }
            var res = [];
            var queue = [el];
            var item;
            var children;
            while (queue.length !== 0) {
                item = queue.shift();
                if (item.getControl && item.getControl() instanceof UIClass) {
                    res.push(item.getControl());
                    continue;
                }
                children = ecui.dom.toArray(ecui.dom.children(item));
                if (children.length > 0) {
                    queue.push.apply(queue, children);
                }
            }
            return res;
        },
        findControl: function(el, UIClass) {
            for (; el; el = ecui.dom.parent(el)) {
                if (el.getControl && el.getControl() instanceof UIClass) {
                    return el.getControl();
                }
            }
            return null;
        }
    };
}());