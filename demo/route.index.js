
(function () {
    var core = ecui,
        util = core.util,
        ui = core.ui,
        esr = core.esr,
        dom = core.dom;

    Object.assign(
        NS.data,
        {
        }
    );
    Object.assign(
        NS.ui,
        {
        }
    );
    esr.addRoute('index', {
        main: 'container',
        model: [''],
        onbeforerequest: function (context) {
        },
        onbeforerender: function (context) {
        },
        onafterrender: function (context) {
        },
        onleave: function () {
            yiche.util.removeDialog();
        }
    });
}());

