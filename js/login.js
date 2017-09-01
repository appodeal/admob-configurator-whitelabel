chromeStorageGet(function (result) {
    if ( result.ad_mediator_url ){
        var user = $('.welcome a, .user span');
        if (result.ad_mediator_url.includes(window.location.href)){
            if (result.appodeal_email || user.length){
                var appodeal_email = user.text();
                if (appodeal_email != result.appodeal_email) {
                    chrome.storage.local.remove(['appodeal_email', 'appodeal_api_key', 'appodeal_user_id'], function (items) {
                        data = {'appodeal_email': appodeal_email};
                        chrome.storage.local.set(data);
                        console.log("You have successfully logged in (Appodeal Chrome Extension).")
                    })
                }
            }else {
                chrome.storage.local.remove(['appodeal_email', 'appodeal_api_key', 'appodeal_user_id'])
            }
        }
    }
});