(function() {
    var core = ecui,
        dom = core.dom,
        ui = core.ui,
        util = core.util,
        ieVersion = /(msie (\d+\.\d)|IEMobile\/(\d+\.\d))/i.test(navigator.userAgent) ? document.documentMode || +(RegExp.$2 || RegExp.$3) : undefined,
        firefoxVersion = /firefox\/(\d+\.\d)/i.test(navigator.userAgent) ? +RegExp.$1 : undefined,
        ext = core.ext;

    yiche.ui = {
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
                            this.removeParentControlSelected();
                            // 如果没有子菜单 就直接添加样式
                            let hasChildNav = this._navData.children;
                            hasChildNav && hasChildNav.length === 0 && this.alterStatus('+selected');
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
        )
    };
}());