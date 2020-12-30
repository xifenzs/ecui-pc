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
        },
        refreshMuneSelectedStatus: function(navId) {
            const nav = ecui.get(navId);
            nav && nav.refreshNavStatus();
        },
        getToThousands: function(value) {
            if (value) {
                if (value.indexOf('.') == -1) {
                    return value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                }
                var intSum = value
                    .substring(0, value.indexOf('.'))
                    .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                var dot = value.substring(value.length, value.indexOf('.'));
                if (dot.length > 3) {
                    dot = dot.substring(dot.indexOf('.'), 3);
                }
                var ret = intSum + dot;
                return ret;
            }
            return '';
        },
        findchildrenRouteAndCall: function(control) {
            const currentRoute = ecui.esr.findRoute(control);
            const children = currentRoute.children;
            if (!children) {
                console.warn('该控件只适用在列表筛选数据的地方');
                return;
            }
            if (children.__proto__ === Array.prototype && children.length > 0) {
                children.forEach(item => {
                    ecui.esr.callRoute(item + '~pageNum=1~pageNo=1', true);
                });
            } else if (typeof(children) == 'string' && children.length > 0) {
                ecui.esr.callRoute(children + '~pageNum=1~pageNo=1', true);
            } else {

            }
        },
        getCustomTime: function(diffNum) {
            let value = new Date(new Date().getTime() - diffNum * 24 * 60 * 60 * 1000);
            return value.getFullYear() +
                '-' +
                ('0' + (value.getMonth() + 1)).slice(-2) +
                '-' +
                ('0' + value.getDate()).slice(-2);
        },
        setSessionStorage: function(key, value) {
            const varHeader = yiche.info.STORAGE_HEADER + key;
            window.sessionStorage.setItem(varHeader, JSON.stringify(value));
        },
        getSessionStorage: function(key) {
            const varHeader = yiche.info.STORAGE_HEADER + key;
            return JSON.parse(window.sessionStorage.getItem(varHeader)) || {};
        },
        removeSessionStorage: function(key) {
            const varHeader = yiche.info.STORAGE_HEADER + key;
            window.sessionStorage.removeItem(varHeader);
        },
        clearSessionStorage: function() {
            window.sessionStorage.clear();
        }
    };

    Date.prototype.pattern = function(fmt) {
        var o = {
            'M+': this.getMonth() + 1, //月份
            'd+': this.getDate(), //日
            'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
            'H+': this.getHours(), //小时
            'm+': this.getMinutes(), //分
            's+': this.getSeconds(), //秒
            'q+': Math.floor((this.getMonth() + 3) / 3), //季度
            'S': this.getMilliseconds() //毫秒
        };
        var week = ['日', '一', '二', '三', '四', '五', '六'];
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[this.getDay()]);
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return fmt;
    };
}());