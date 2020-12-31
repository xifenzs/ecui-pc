(function() {
    var core = ecui,
        dom = core.dom,
        ui = core.ui,
        util = core.util,
        ieVersion = /(msie (\d+\.\d)|IEMobile\/(\d+\.\d))/i.test(navigator.userAgent) ? document.documentMode || +(RegExp.$2 || RegExp.$3) : undefined,
        firefoxVersion = /firefox\/(\d+\.\d)/i.test(navigator.userAgent) ? +RegExp.$1 : undefined,
        ext = core.ext;

    yiche.ui = {
        // 导航菜单
        CustomNavs: ecui.inherits(
            ecui.ui.Control,
            function(el, options) {
                ecui.ui.Control.call(this, el, options);
            }, {
                CustomNavsParent: ecui.inherits(ecui.ui.Control,
                    function(el, options) {
                        ecui.ui.Control.call(this, el, options);
                        this._navData = options.navItem;
                    }, {
                        onclick: function() {
                            let hasChildNav = this._navData.children;
                            // 如果没有子菜单 就直接添加样式
                            if (hasChildNav && hasChildNav.length === 0) {
                                this.removeParentControlSelected();
                                this.alterStatus('+selected');
                            }
                        },
                        removeParentControlSelected: function() {
                            let parent = this.getParent(),
                                navParentControl = yiche.util.findChildrenControl(parent.getMain(), parent.CustomNavsParent);
                            navParentControl && navParentControl.forEach(item => {
                                item.alterStatus('-selected');
                            });
                        },
                        CustomNavsChild: ecui.inherits(ecui.ui.Control,
                            function(el, options) {
                                ecui.ui.Control.call(this, el, options);
                                this._navData = options.navItem;
                            }, {
                                onclick: function(e) {
                                    this.getParent().removeParentControlSelected();
                                    e.stopPropagation();
                                    this.removechildControlSelected();
                                    this.alterStatus('+selected');
                                    this.getParent().alterStatus('+selected');
                                },
                                removechildControlSelected: function() {
                                    let parent = this.getParent(),
                                        childControl = yiche.util.findChildrenControl(parent.getMain(), parent.CustomNavsChild);
                                    childControl && childControl.forEach(item => {
                                        item.alterStatus('-selected');
                                    });
                                }
                            })
                    }
                ),
                refreshNavStatus: function() {
                    const loc = ecui.esr.getLocation().split('~')[0],
                        parent = this,
                        navParentControl = yiche.util.findChildrenControl(parent.getMain(), parent.CustomNavsParent);
                    navParentControl && navParentControl.forEach(item => {
                        let child = yiche.util.findChildrenControl(item.getMain(), item.CustomNavsChild);
                        if (child && child.length > 0) { // 二级导航
                            child.forEach(cItem => {
                                if (cItem._navData.route === loc) {
                                    ecui.dispatchEvent(cItem, 'click');
                                }
                            })
                        } else { // 一级导航
                            if (item._navData.route === loc) {
                                ecui.dispatchEvent(item, 'click');
                            }
                        }
                    });
                },
                $ready: function() {
                    this.refreshNavStatus();
                }
            }
        ),
        // 退出登录
        CustomLogout: ecui.inherits(
            ecui.ui.Control,
            function(el, options) {
                ecui.ui.Control.call(this, el, options);
            }, {
                onclick: function() {
                    // ecui.esr.request(
                    //     'data@POST /api-v2/user/logout',
                    //     function() {
                    //         sessionStorage.clear();
                    //         window.location.href = 'login.html';
                    //     },
                    //     function() {
                    //         /* 任一请求失败处理逻辑 */
                    //     }
                    // );
                }
            }
        ),
        // 普通搜索
        CustomTexts: ecui.inherits(
            ecui.ui.Text,
            'custom-search-text',
            function(el, options) {
                ecui.ui.Text.call(this, el, options);
                var clearEl = ecui.dom.create('SPAN', {
                    className: 'clear-icon'
                });
                el.appendChild(clearEl);
                this._uClear = ecui.$fastCreate(this.ClearValue, clearEl, this, {});
                var searchEl = ecui.dom.create('SPAN', {
                    className: 'search-icon'
                });
                el.appendChild(searchEl);
                this._uSearch = ecui.$fastCreate(this.SearchText, searchEl, this, {});
                this._bCheckRule = options.checkRule;
            }, {
                $input: function(event) {
                    ecui.ui.Text.prototype.$input.call(this, event);
                    let value = this.getValue();
                    if (this._bCheckRule) {
                        let regexp = new RegExp(this._bCheckRule);
                        if (value.match(regexp)) {
                            this._sLastValue = value;
                            return;
                        } else {
                            if (value === '') {
                                this._sLastValue = '';
                            }
                        }
                    } else {
                        this._sLastValue = value;
                    }
                    this.setValue(this._sLastValue || '');
                },
                SearchText: ecui.inherits(ecui.ui.Control, {
                    onclick: function() {
                        this.getParent().refresh();
                    }
                }),
                ClearValue: ecui.inherits(ecui.ui.Control, {
                    onclick: function() {
                        this.getParent().setValue('');
                    }
                }),
                onkeydown: function(event) {
                    if (event.which === 13) {
                        this.refresh();
                    }
                },
                refresh: function() {
                    yiche.util.findchildrenRouteAndCall(this);
                }
            }
        ),
        // id 搜索
        CustomNumberTexts: ecui.inherits(
            ecui.ui.Number,
            'custom-search-text',
            function(el, options) {
                ecui.ui.Number.call(this, el, options);
                var clearEl = ecui.dom.create('SPAN', {
                    className: 'clear-icon'
                });
                el.appendChild(clearEl);
                this._uClear = ecui.$fastCreate(this.ClearValue, clearEl, this, {});
                var searchEl = ecui.dom.create('SPAN', {
                    className: 'search-icon'
                });
                el.appendChild(searchEl);
                this._uSearch = ecui.$fastCreate(this.SearchText, searchEl, this, {});
            }, {
                SearchText: ecui.inherits(ecui.ui.Control, {
                    onclick: function() {
                        this.getParent().refresh();
                    }
                }),
                ClearValue: ecui.inherits(ecui.ui.Control, {
                    onclick: function() {
                        this.getParent().setValue('');
                    }
                }),
                onkeydown: function(event) {
                    if (event.which === 13) {
                        this.refresh();
                    }
                },
                refresh: function() {
                    yiche.util.findchildrenRouteAndCall(this);
                }
            }
        ),
        // 图片预览
        PreviewHide: ecui.inherits(ecui.ui.Control, {
            onclick: function() {
                let elPreview = ecui.$('preview_session_handle');
                ecui.dom.addClass(elPreview, 'ui-hide');
                elPreview.querySelector('.swiper').innerHTML = '';
            }
        }),
        // 点击展开显示子元素
        CustomToggle: ecui.inherits(
            ecui.ui.Control,
            function(el, options) {
                ecui.ui.Control.call(this, el, options);
                this._oRowData = options.data;
                this._bVisible = false;
            }, {
                onclick: function() {
                    this.asyncLoadChild();
                    this.handleToggle();
                },
                // 展开 收起
                handleToggle: function() {
                    let parentEl = ecui.dom.parent(this.getMain());
                    if (!ecui.dom.hasClass(parentEl, 'ec-custom-toggle-wrap')) {
                        return;
                    }
                    if (this._bVisible) {
                        ecui.dom.removeClass(parentEl, 'ec-custom-toggle-wrap-show');
                    } else {
                        ecui.dom.addClass(parentEl, 'ec-custom-toggle-wrap-show');
                    }
                    this._bVisible = !this._bVisible;
                },
                // 子元素相关操作
                asyncLoadChild: function() {

                }
            }
        ),
        // 下拉
        CustomSelect: ecui.inherits(
            ecui.ui.Select,
            function(el, options) {
                ecui.ui.Select.call(this, el, options)
            }, {
                onchange: function(evt) {
                    if (!this.getValue()) {
                        return;
                    }
                    yiche.util.findchildrenRouteAndCall(this);
                }
            }
        ),
        // 下拉搜索
        CustomCombox: ecui.inherits(ecui.ui.Combox, {
            onchange: function() {
                if (!this.getValue()) {
                    return;
                }
                yiche.util.findchildrenRouteAndCall(this);
            }
        }),

        // 日期范围筛选
        CustomTimers: ecui.inherits(frd.RangeSelectDate, {
            onchange: function() {
                this.setValue(this._uRangeCalendar.getSelectDates());
                this._uRangeCalendar.hide();
                yiche.util.findchildrenRouteAndCall(this);
            }
        }),

        // 编辑输入
        CustomInputTexts: ecui.inherits(
            ecui.ui.Text,
            'custom-text',
            function(el, options) {
                ecui.ui.Text.call(this, el, options);
                this.oRules = options.rules;
                var clearEl = ecui.dom.create('SPAN', {
                    className: 'clear-icon'
                });
                el.appendChild(clearEl);
                this._uClear = ecui.$fastCreate(this.ClearValue, clearEl, this, {});
                this._cParentEl = ecui.dom.parent(el);
            }, {
                ClearValue: ecui.inherits(ecui.ui.Control, {
                    onclick: function() {
                        this.getParent().setValue('');
                    }
                }),
                handleCheck: function() {
                    if (!this.oRules) {
                        return;
                    }
                    const { message, reg } = this.oRules;
                    let regexp = new RegExp(reg);
                    let value = this.getValue();
                    if (!value.match(regexp)) {
                        let errorInfoEl = this._cParentEl.querySelector('.error-info');
                        if (errorInfoEl) {
                            errorInfoEl.innerHTML = message;
                        }
                        ecui.dispatchEvent(this, 'error');
                        return;
                    }
                    if (value && this._cParentEl) {
                        ecui.dom.removeClass(this._cParentEl, 'item-error');
                    }
                },
                onblur: function() {
                    this.handleCheck();
                },
                onerror: function() {
                    if (!this._cParentEl) {
                        return;
                    }
                    ecui.dom.addClass(this._cParentEl, 'item-error');
                }
            }
        ),
    };
}());