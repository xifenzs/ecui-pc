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
                    let check = this.isEditControl();
                    if (!this.oRules || !check) {
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
                    let check = this.isEditControl();
                    if (!check) {
                        return;
                    }
                    ecui.dom.addClass(this._cParentEl, 'item-error');
                },
                isEditControl: function() {
                    let res = false;
                    if (this._cParentEl) {
                        res = ecui.dom.hasClass(this._cParentEl, 'edit-form-item');
                    }
                    return res;
                }
            }
        ),

        // 编辑下拉
        CustomEditSelect: ecui.inherits(
            ecui.ui.Select,
            function(el, options) {
                ecui.ui.Select.call(this, el, options);
                this._cParentEl = ecui.dom.parent(el);
            }, {
                onchange: function() {
                    let value = this.getValue(),
                        check = this.isEditControl();
                    if (value && check) {
                        ecui.dom.removeClass(this._cParentEl, 'item-error');
                    }
                },
                onerror: function() {
                    let check = this.isEditControl();
                    if (!check) {
                        return;
                    }
                    ecui.dom.addClass(this._cParentEl, 'item-error');
                },
                isEditControl: function() {
                    let res = false;
                    if (this._cParentEl) {
                        res = ecui.dom.hasClass(this._cParentEl, 'edit-form-item');
                    }
                    return res;
                }
            }
        ),

        // 图表
        Echarts: ecui.inherits(
            ecui.ui.Control,
            'echarts',
            function(el, options) {
                ecui.ui.Control.call(this, el, options);
                this.reqDataName = options.reqDataName;
                this.echartInfo = options.echartInfo;
                this.contentEl = ecui.dom.create('div', { className: 'chart-content' });
                this.emptyMaskEl = ecui.dom.create('div', { className: 'empty-echarts ui-hide', innerHTML: '' });
                el.appendChild(this.contentEl);
                el.appendChild(this.emptyMaskEl);
                this.content = ecui.$fastCreate(ecui.ui.Control, this.contentEl, this);
                this.emptyMask = ecui.$fastCreate(ecui.ui.Control, this.emptyMaskEl, this);

            }, {
                onready: function() {
                    this.getMain().style.width = this.getWidth() + 'px';
                    this.chart = echarts.init(this.content.getMain());
                    if (this.echartInfo && this.echartInfo.immediate) {
                        let echartInfo = this.echartInfo;
                        this.render(echartInfo);
                    }
                    this.chart.on('legendselectchanged', function(param) {
                        var selected = [];
                        for (var key in param.selected) {
                            if (param.selected[key]) {
                                selected.push(key);
                            }
                        }
                        if (selected.length < 1) {
                            this.chart.dispatchAction({
                                type: 'legendSelect',
                                name: param.name
                            });
                        }
                    }.bind(this));
                },
                isEmpty: function() {
                    return this.emptyMask.isShow();
                },
                reqSuccess: function(data) {
                    const that = this;
                    that.chart.hideLoading();
                    if (!that.content.isShow()) {
                        that.emptyMask.hide();
                        that.content.show();
                    }
                    try {
                        const option = that.transfromEchartOptions(data);
                        that.chart.setOption(option, true);
                    } catch (error) {
                        that.emptyMask.show();
                        that.content.hide();
                    }
                },
                // 处理 图表相关数据
                transfromEchartOptions: function(data) {
                    let option = {};
                    return option;
                },
                reqFail: function(xhr) {
                    var err = JSON.parse(xhr.response);
                    ecui.globalTips(
                        err.description,
                        'error'
                    );
                    this.chart.hideLoading();
                    if (!this.emptyMask.isShow()) {
                        this.emptyMask.show();
                        this.content.hide();
                        ecui.dispatchEvent(this, 'emptyevent');
                    }
                    return;
                },
                render: function(echartInfo) {
                    if (!this.chart) {
                        return;
                    }
                    const { url, method, params, defaultOption } = echartInfo;
                    if (echartInfo.defaultOption && JSON.stringify({}) !== JSON.stringify(echartInfo.defaultOption)) {
                        if (!this.content.isShow()) {
                            this.emptyMask.hide();
                            this.content.show();
                        }
                        this.chart.setOption(defaultOption, true);
                        return;
                    }
                    if (url && method && params) {
                        this.chart.showLoading('default', {
                            text: '',
                            color: '#4466FF'
                        });
                        if (method === 'post') {
                            yiche.util.post(url, params, this.reqSuccess.bind(this), this.reqFail.bind(this));
                        } else {
                            yiche.util.get(url, this.reqSuccess.bind(this), this.reqFail.bind(this));
                        }
                    }

                },
                $dispose: function() {
                    ecui.ui.Control.prototype.$dispose.call(this);
                    this.chart && this.chart.dispose();
                }
            }
        ),

        // 分页
        Pagination: ecui.inherits(frd.Pagination,
            function(el, options) {
                this._nPageSizeOption = options.pageSizeOptions || [20, 50, 100];
                frd.Pagination.call(this, el, options);
            }, {
                hascreatePageSize: function() {
                    if (this._nPageSizeOption) {
                        let sizeHtml = '';
                        this._nPageSizeOption.forEach(item => {
                            sizeHtml += `<div ui="value:${item}">${item}条/页</div>`;
                        });
                        this._ePageSize = ecui.dom.create('DIV', {
                            className: 'page-size',
                            innerHTML: sizeHtml
                        });
                    }
                    return true;
                },
                Pages: ecui.inherits(
                    frd.Pagination.prototype.Pages, {
                        setPageInfoContent: function(pageNo, size, count, total, totalPage) {
                            this.getParent()._uPageInfo.setContent(
                                '共 ' + total + ' 页'
                            );
                        }
                    }
                )
            }
        ),

    };
}());