(function () {
    var core = ecui,
        dom = core.dom,
        ui = core.ui,
        util = core.util,
        ieVersion = /(msie (\d+\.\d)|IEMobile\/(\d+\.\d))/i.test(navigator.userAgent) ? document.documentMode || +(RegExp.$2 || RegExp.$3) : undefined,
        firefoxVersion = /firefox\/(\d+\.\d)/i.test(navigator.userAgent) ? +RegExp.$1 : undefined,
        ext = core.ext;

    yiche.ui = {
        /**
         * control
         * 资产列表操作按钮
         * 待报废、报废  - 按钮 - 资产列表页面。
         */
        TableCheckbox: ecui.inherits(
            ui.Checkbox, 
            {
                setChecked: function (checked) {
                    ui.Checkbox.prototype.setChecked.call(this, checked);
                    var tr = this.getParent().getParent();
                    tr.alterStatus(this.isChecked() ? '+selected' : '-selected');
                }
            }
        ),
        /**
         * control
         * 选择项目
         *
         */
        Combox: ecui.inherits(
            ui.Combox,
            function (el, options) {
                ui.Combox.call(this, el, options);
                this._sUrl = options.url;
                this._sText = options.text || '';
            }, 
            {
                clearTimer: util.blank,
                oninput: function () {
                    this.clearTimer();

                    this.clearTimer = util.timer(function () {
                        this.changeItems();
                    }.bind(this), 300);
                },
                changeItems: function () {
                    if (!this._sUrl) {
                        return;
                    }
                    ecui.esr.request(
                        'datas@JSON ' + this._sUrl + (this._sUrl.indexOf('?') > 0 ? '&' : '?') + 'searchContent=' + this.getText() + '&pageSize=100&pageNo=1',
                        function () {
                            var data = ecui.esr.getData('datas');
                            if (data instanceof Object) {
                                if (data.record && data.record instanceof Array) {
                                    data = data.record;
                                }
                                this.removeAll(true);
                                this.add(data.map(function (item) {
                                    return { value: item.id, code: item.name };
                                }));
                                if (this.initValue) {
                                    this.setValue(this.initValue);
                                    delete this.initValue;
                                }
                            }
                        }.bind(this),
                        function () {

                        }
                    );
                },
                onready: function () {
                    this.initValue = this.getValue();
                    this.setText(this._sText);
                    this.changeItems();
                }
            }
        ),
        /*
         * control
         * 导航栏控件
         */
        ModuleLink: ecui.inherits(
            ui.TreeView, 
            {
                /*
                * @override
                *
                * 重写isCollapsed，强行将树节点，点击时判断是否收缩的返回值写死为true，让它点击时永远展开
                */
                isCollapsed: function () {
                    return true;
                }
            }
        ),
        /*
         * control
         * 导航栏菜单控件
         */
        ModuleLinkItem: ecui.inherits(
            ui.Control,
            'ui-module-link', 
            {
                onclick: function () {
                    ecui.query(function (item) {
                        return item instanceof yiche.ui.ModuleLinkItem;
                    }).forEach(function (item) {
                        item.alterStatus('-active');
                    });
                    util.timer(function () {
                        this.alterStatus('+active');
                    }.bind(this), 0);
                }
            }
        ),
        /*
         * control
         * 防止重复提交基础控件
         */
        Submit: ecui.inherits(
            ui.Button, {
            _bSend: false,
            request: function (url, onsuccess, onerror) {
                if (this._bSend) {
                    return;
                }
                this._bSend = true;
                ecui.esr.request(url, function () {
                    this._bSend = false;
                    onsuccess.call(this);
                }.bind(this), function () {
                    this._bSend = false;
                    if (onerror) {
                        onerror.call(this);
                    } else {
                        onsuccess.call(this);
                    }
                }.bind(this));
            }
        }
        ),
        /**
         * control
         * 编辑 新增行 - 按钮。
         */
        AddItem: ecui.inherits(
            ui.Button,
            'ui-add-item',
            function (el, options) {
                ui.Button.call(this, el, options);
                this._sTarget = options.target;
                this._sContainer = options.container;
                this._sPosition = options.position;
                this._oItem = options.item;
            },
            {
                onclick: function () {
                    var el = dom.create({ innerHTML: ecui.esr.getEngine().render(this._sTarget, { NS: ecui.esr.getData('NS'), timestamp: Date.now(), item: this._oItem }) });
                    if (this._sContainer) {
                        var container = ecui.$(this._sContainer);
                        if (container) {
                            el = dom.first(el);
                            switch (this._sPosition) {
                                case 'beforeBegin':
                                    dom.insertBefore(el, container);
                                    ecui.init(el);
                                    break;
                                case 'afterBegin':
                                    if (dom.first(container)) {
                                        dom.insertBefore(el, dom.first(container));
                                        ecui.init(el);
                                    }
                                    break;
                                case 'beforeEnd':
                                    if (dom.last(container)) {
                                        dom.insertAfter(el, dom.last(container));
                                        ecui.init(el);
                                    }
                                    break;
                                case 'afterEnd':
                                    dom.insertAfter(el, container);
                                    ecui.init(el);
                                    break;
                                default:
                                    break;
                            }
                        }
                    } else {
                        var parent = dom.parent(this.getMain());
                        el = dom.insertAfter(dom.first(el), parent);
                        ecui.init(el);
                    }
                }
            }
        ),
        /**
         * control
         * 编辑 删除行 - 按钮。
         */
        DeleteItem: ecui.inherits(
            ui.Button,
            {
                onclick: function () {
                    var parent = this.getParent(),
                        children = dom.children(parent.getParent().getMain());
                    if (children.length <= 1) {
                        ecui.tip('warn', '至少保留一项');
                        return;
                    }
                    parent = parent.getMain();
                    if (yiche.info.firefoxVersion) {
                        // 延时执行dom 的 remove ；解决firefox下面删除后会有选中效果的问题
                        ecui.util.timer(function () {
                            ecui.dispose(parent);
                            dom.remove(parent);
                        }, 0);
                    } else {
                        ecui.dispose(parent);
                        dom.remove(parent);
                    }
                }
            }
        )
    };
}());
