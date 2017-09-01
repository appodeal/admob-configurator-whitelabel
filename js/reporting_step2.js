var ReportingStepTwoController;

ReportingStepTwoController = (function() {
    var wait_for_adsence_btn, projectToLocation, initOtherLibrary, wl_projectName, modal_header, modal, adsence_enabling_interval;
    wait_for_adsence_btn = function() {
        var enableApiBtn, disableBtnCode, disableApiBtn, enableApiBtnOld, disableBtnCodeOld, disableApiBtnOld, code;
        try {
            enableApiBtn = $("pan-action-bar-button[icon='start'][action='apiCtrl.toggleApi()']:not(.ng-hide) button");
            disableBtnCode = "pan-action-bar-button[icon='stop'][action='apiCtrl.toggleApi()']:not(.ng-hide) button";
            disableApiBtn = $(disableBtnCode);

            enableApiBtnOld = $("[ng-if='!apiCtrl.isServiceEnabled()']");
            disableBtnCodeOld = "[ng-if='apiCtrl.isServiceEnabled()']";
            disableApiBtnOld = $(disableBtnCodeOld);
            if ((enableApiBtn.length || enableApiBtnOld.length)) {
                clearInterval(adsence_enabling_interval);
                if (enableApiBtn.length) {
                    enableApiBtn.click();
                } else {
                    code = "angular.element(jQuery(\"[ng-if='!apiCtrl.isServiceEnabled()']\")).controller().toggleApi();";
                    run_script(code);
                }
                waitForElement(disableBtnCode + ", " + disableBtnCodeOld, null, function (element) {
                    airbrake.error.call(projectToLocation)
                })
            } else if ((disableApiBtn.length || disableApiBtnOld.length)) {
                airbrake.error.call(projectToLocation)
            }
        } catch (err) {
            airbrake.error.notify(err);
        }
    };
    projectToLocation = function () {
        document.location.href = projectConsentUrl(locationProjectName());
    };
    initOtherLibrary = function (message) {
        sendOut(0, message);
        appendJQuery(function() {
            modal = new Modal();
            modal.show(modal_header, message);
        });
    };
    initOtherLibrary = function (message, callback) {
        sendOut(0, message);
        chromeStorageGet(function (data) {
            wl_projectName = data.wl_projectName;
            modal_header = wl_projectName + ' Chrome Extension';
            appendJQuery(function () {
                modal = new Modal();
                modal.show(modal_header, message);
                callback();
            });
        });
    };
    return {
        init: function() {
            initOtherLibrary('Enabling the AdSense Management API', function () {
                adsence_enabling_interval = setInterval(wait_for_adsence_btn, 2000);
            });
        }
    };
})();

$(document).ready(function() {
    ReportingStepTwoController.init();
});