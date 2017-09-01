var AdmobAccountController, modal;

AdmobAccountController = (function () {
    var initOtherLibrary, latestCriticalReportingApi, wl_projectName, modal_header, admob_account_id, message;
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
    latestCriticalReportingApi = function () {
        modal.show(modal_header, "Checking Admob account.");
        setTimeout(function () {
            try {
                console.log('Get admob account id.');
                admob_account_id = /pub-\d+/.exec(document.documentElement.innerHTML);
                if (admob_account_id) {
                    chrome.storage.local.set({
                        'current_account_id': admob_account_id[0]
                    });
                    console.log('Done! redirecting back.');
                    setTimeout(function () {
                        document.location.href = GOOGLE_CLOUD_CONSOLE_CREDENTIAL;
                    }, 2000);
                } else {
                    sendOut(0, "Can't proceed to enabling AdSense Reporting API (not logged in?)");
                    message = "Can't proceed to enabling AdSense Reporting API. If you are not logged in, please authorize and try again.";
                    modal.show(modal_header, message);
                    chrome.storage.local.remove('reporting_tab_id');
                    throw new Error(message);
                }
            } catch (err) {
                airbrake.error.notify(err);
            }
        }, 5000);
    };
    return {
        init: function () {
            initOtherLibrary('Start configure admob reporting api', function () {
                airbrake.error.call(latestCriticalReportingApi);
            });
        }
    };
})();

$(document).ready(function () {
    AdmobAccountController.init();
});