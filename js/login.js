var LoginController;

LoginController = (function () {
    var initOtherLibrary, findEmailAndApiKey;
    initOtherLibrary = function () {
    };
    findEmailAndApiKey = function () {
        var user, appodeal_email;
        chromeStorageGet(function (result) {
            if (result.ad_mediator_url) {
                user = $('.welcome a, .user span');
                if (window.location.href.includes(result.ad_mediator_url)) {
                    if (result.appodeal_email || user.length) {
                        appodeal_email = user.text();
                        if (appodeal_email !== result.appodeal_email) {
                            chrome.storage.local.remove(['appodeal_email', 'appodeal_api_key', 'appodeal_user_id'], function (items) {
                                data = {'appodeal_email': appodeal_email};
                                chrome.storage.local.set(data);
                                console.log("You have successfully logged")
                            })
                        }
                    } else {
                        chrome.storage.local.remove(['appodeal_email', 'appodeal_api_key', 'appodeal_user_id'])
                    }
                }
            }
        });
    };
    return {
        init: function () {
            initOtherLibrary();
            findEmailAndApiKey();
        }
    };
})();
$(document).ready(function () {
    LoginController.init();
});
