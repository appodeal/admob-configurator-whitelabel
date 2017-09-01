var AdUnitController;

AdUnitController = (function () {
    var initOtherLibrary, startInventorySync, wl_projectName, modal_header, modal;

    startInventorySync = function () {
        var admob, message;
        // get api key and user id from storage and sync inventory
        chrome.storage.local.get({
            'appodeal_api_key': null,
            'appodeal_user_id': null,
            'appodeal_admob_account_publisher_id': null,
            'appodeal_admob_account_email': null,
            'accounts': null,
            'interstitialBids': null,
            'bannerBids': null,
            'mrecBids': null,
            'rewarded_videoBids': null
        }, function (items) {
            try {
                if (items['appodeal_api_key'] && items['appodeal_user_id'] && items['appodeal_admob_account_publisher_id']) {
                    if (window.location.href.match(/apps\.admob\.com\/v2/)) {
                        //New version Admob from 18.05.2017
                        admob = new AdmobV2(
                            items['appodeal_user_id'],
                            items['appodeal_api_key'],
                            items['appodeal_admob_account_publisher_id'],
                            items['appodeal_admob_account_email'],
                            items['accounts'],
                            items['interstitialBids'],
                            items['bannerBids'],
                            items['mrecBids'],
                            items['rewarded_videoBids']
                        );
                    } else {
                        //Old version Admob
                        admob = new Admob(
                            items['appodeal_user_id'],
                            items['appodeal_api_key'],
                            items['appodeal_admob_account_publisher_id'],
                            items['appodeal_admob_account_email'],
                            items['accounts'],
                            items['interstitialBids'],
                            items['bannerBids'],
                            items['mrecBids'],
                            items['rewarded_videoBids']
                        );
                    }
                    admob.syncInventory(function () {
                        message = "Apps and adunits have been synced successfully.";
                        console.log(message);
                    });
                } else {
                    message = "Something went wrong. Please contact " + wl_projectName + " support.";
                    modal.show(modal_header, message);
                    sendOut(0, message);
                    throw new Error(message);
                }
            } catch (err) {
                airbrake.error.notify(err)
            }
        })
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
        init: function () {
            chrome.storage.local.get("admob_processing", function (result) {
                //result['admob_processing'] === true or false
                if (result['admob_processing']) {
                    initOtherLibrary('Start sync inventory', function () {
                        setTimeout(function () {
                            startInventorySync();
                        }, 4000);
                    });
                }
            });
        }
    };
})();

$(document).ready(function () {
    AdUnitController.init();
});