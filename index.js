(function() {
    var core = ecui,
        dom = core.dom,
        ui = core.ui,
        util = core.util,
        clearHintTimer = util.blank;
    window.yiche = {
        info: {
            iosVersion: /(iPhone|iPad).*?OS (\d+(_\d+)?)/i.test(navigator.userAgent) ? +(RegExp.$2.replace('_', '.')) : undefined,
            ieVersion: /(msie (\d+\.\d)|IEMobile\/(\d+\.\d))/i.test(navigator.userAgent) ? document.documentMode || +(RegExp.$2 || RegExp.$3) : undefined,
            chromeVersion: /Chrome\/(\d+\.\d)/i.test(navigator.userAgent) ? +RegExp.$1 : undefined,
            firefoxVersion: /firefox\/(\d+\.\d)/i.test(navigator.userAgent) ? +RegExp.$1 : undefined,
            safariVersion: !/(chrome|crios|ucbrowser)/i.test(navigator.userAgent) && /(\d+\.\d)(\.\d)?\s+.*safari/i.test(navigator.userAgent) ? +RegExp.$1 : undefined,
            now: util.formatDate(new Date(), 'yyyy-MM-dd')
        },
        ui: {},
        util: {
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
            }
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
        }
    };

    /* 阻止 ie 按删除键会回退页面 - begin */
    function onkeydown(event) {
        var tags = ['INPUT', 'TEXTAREA', 'BUTTON', 'SUBMIT'];
        var target = event.target || event.srcElement;
        if (event.keyCode === 8 && tags.indexOf(target.tagName) < 0) {
            event.keyCode = 0;
            event.returnValue = false;
            return false;
        }
    }
    if (yiche.info.ieVersion < 9) {
        document.attachEvent('onkeydown', onkeydown);
    } else {
        window.addEventListener('keydown', onkeydown);
    }
    /* 阻止 ie 按删除键会回退页面 - end */


    window.requestCount = 0;
    /**
     * request请求前处理函数。
     * @public
     *
     */
    ecui.esr.onbeforerequest = function() {
        window.requestCount++;
        ecui.dom.addClass(document.body, 'ui-loading');
    };

    /**
     * request请求后处理函数。
     * @public
     *
     */
    ecui.esr.onafterrequest = function() {
        window.requestCount = Math.max(0, --window.requestCount);
        if (window.requestCount <= 0) {
            ecui.dom.removeClass(document.body, 'ui-loading');
        }
    };

    /**
     * esr执行异常处理函数。
     * @public
     *
     * @param {object} e 异常对象
     *
     */
    ecui.esr.onexception = function(e) {
        console.warn(e);
    };

    /**
     * request请求结果统一处理函数
     * @public
     *
     * @param {string} url 请求地址
     * @param {object} data 请求参数
     *
     * @return {Object|numer} data.code为0时，返回 data.data ，否则返回 data.code
     */
    var noTipCodes = [300000, 500016];
    ecui.esr.onparsedata = function(url, data) {
        var code = data.code;
        if (0 === code) {
            return data.data;
        }
        if (code === 10302) {
            // 延迟 10ms 执行重定向，防止业务中有跳转登录页逻辑，导致页面跳转不正确
            util.timer(function () {
                location.href = data.data;
            }, 10);
            return;
        } else if (code === 12011) {
            ecui.esr.headers['x-access-token'] = '';
            window.location = './login.html';
        } else if (code === 12012) {
            ecui.tip('error', data.msg);
            if (ecui.esr.DEFAULT_PAGE) {
                ecui.esr.redirect(ecui.esr.DEFAULT_PAGE);
            } else {
                window.location = './login.html';
            }
        } else {
            if (noTipCodes.indexOf(code) < 0) {
                ecui.tip('error', data.msg);
            }
        }
        return data.code;
    };

    /**
     * esr加载完毕后执行函数
     * @public
     *
     */
    ecui.esr.onready = function() {
        ecui.esr.headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'customReferer': window.location.href
        };
        // 配合后端重定向，地址栏地址改变时，将 location.href 更新到请求头的 customReferer 字段
        ecui.dom.addEventListener(window, 'hashchange', function() {
            ecui.esr.headers.customReferer = window.location.href;
        });
        ecui.util.extend = Object.assign;
        // 设置 默认路由
        ecui.esr.DEFAULT_PAGE = '';
        // 设置 选项控件的文本在 options 中的名称
        ecui.ui.$AbstractSelect.prototype.TEXTNAME = 'code';
        // text输入框 禁用输入历史记录
        var textReady = ecui.ui.Text.prototype.$ready;
        ecui.ui.Text.prototype.$ready = function(event) {
            this.getInput().setAttribute('autocomplete', 'off');
            textReady.call(this, event);
        };
        // combox输入框 禁用输入历史记录
        var comboxReady = ecui.ui.Combox.prototype.$ready;
        ecui.ui.Combox.prototype.$ready = function(event) {
            this.getInput().setAttribute('autocomplete', 'off');
            this._eTextInput.setAttribute('autocomplete', 'off');
            comboxReady.call(this, event);
            ecui.util.timer(function() {
                ecui.setFocused();
                ecui.dispatchEvent(this, 'blur');
            }.bind(this), 100);
        };

        return {
            model: [
            ],
            main: 'main',
            view: 'content',
            onbeforerender: function(context) {
               
                yiche.info.staffs = context.staffs;
                yiche.info.baseInfo = context.baseInfo;
                yiche.info.permissionList = context.permissionList;
                yiche.info.baseInfoMap = {};

                // 封装所有的部门 递归获取
                yiche.info.allDepartments = [];
                if (context.allDepartments) {
                    var rootDepartment = context.allDepartments[0];
                    reachAlldepartments(rootDepartment);
                }
                for (var key in context.baseInfo) {
                    yiche.info.baseInfoMap[key] = {};
                    for (var i = 0, item; item = context.baseInfo[key][i++];) {
                        yiche.info.baseInfoMap[key][item.code] = item.value;
                    }
                }
                if (context.permissionList instanceof Array) {
                    var permission = [];
                    /**
                     * 权限统一处理 ext扩展控件
                     * @public
                     *
                     */
                    ecui.ext.permission = {
                        /**
                         * 构造函数
                         * @public
                         *
                         * @param {string} value 权限名称字符串
                         */
                        constructor: function(value) {
                            this.permission = context.permissionList.indexOf(value) >= 0;
                            if (!this.permission) {
                                this.hide();
                            }
                            permission.push(value);
                        },
                        Events: {

                        }
                    };
                }
            },
            onafterrender: function() {
                var loc = ecui.esr.getLocation().split('~')[0],
                    setPage = false;
                // 第一次进入页面、刷新页面时，设置导航栏默认选中状态
                ecui.query(function(item) { return item instanceof yiche.ui.ModuleLinkItem; }).forEach(function(item) {
                    var loc1 = ecui.dom.last(item.getMain()).getAttribute('href').slice(1).split('~')[0];
                    if (!setPage && item.permission) {
                        setPage = true;
                        ecui.esr.DEFAULT_PAGE = loc1;
                    }
                    if (loc === loc1 || loc.split('.')[0] === loc1.split('.')[0]) {
                        item.onclick();
                        item.getParent().$nodeclick();
                    }
                });
                if (!ecui.esr.DEFAULT_PAGE) {

                }
            }
        };
    };
    ecui.esr.addRoute('index', { main: 'container' });
    document.write('<script type="text/javascript" src="_include/filter.js"></script>');
    document.write('<script type="text/javascript" src="_include/index.controls.js"></script>');
}());