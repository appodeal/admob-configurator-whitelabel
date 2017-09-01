var ReportingStepThreeController;

ReportingStepThreeController = (function () {
    var initOtherLibrary, wait_for_consents, setEmailCredential, getEmail, wl_projectName, modal_header,
        modal, consents_interval, email_credentials;
    wait_for_consents = function () {
        var save_button, script, console_log_code, select_save_code, name_code, set_val_code, code;
        try {
            save_button = jQuery("jfk-button[jfk-on-action='ctrl.submit()']");
            if (save_button.length) {
                clearInterval(consents_interval);
                appendJQuery(function () {
                    script = document.createElement('script');
                    console_log_code = "console.log('Set project name and save'); ";
                    select_save_code = "jQuery(\"jfk-button[jfk-on-action='ctrl.submit()']\")";
                    name_code = "jQuery(\"[ng-model='ctrl.data.displayName']\")";
                    set_val_code = name_code + ".val('" + wl_projectName + " Revenue');" + "angular.element(" + name_code + ").triggerHandler('input');";
                    code = console_log_code + set_val_code + "setTimeout(function() {angular.element(" + select_save_code + ").controller().submit();}, 1000);";
                    script.appendChild(document.createTextNode(code));
                    document.getElementsByTagName('head')[0].appendChild(script);
                    console.log("Save button clicked");
                    getEmail();
                    setEmailCredential(locationProjectName());
                });
            }
        } catch (err) {
            airbrake.error.notify(err);
        }
    };
    setEmailCredential = function (project_name) {
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.type === "to_console") {
                try {
                    email_credentials = request.data.pantheon_account_chooser_data[1][4];
                } catch (err) {
                    email_credentials = null;
                    airbrake.error.notify(err);
                }
                chrome.storage.local.set({
                    "email_credentials": email_credentials
                });
                window.setInterval(function () {
                    if (project_name.length) {
                        console.log("Find name", project_name);
                        document.location.href = credentialPageUrl(project_name);
                    }
                }, 5000);
            }
        });
    };
    getEmail = function () {
        Utils.injectScript('\
        chrome.runtime.sendMessage("' + chrome.runtime.id + '", {type: "console_email_notification", pantheon_account_chooser_data: pantheon_account_chooser_data })');
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
            initOtherLibrary('Saving the consent screen.', function () {
                consents_interval = setInterval(wait_for_consents, 5000);
            });
        }
    };
})();

$(document).ready(function () {
    ReportingStepThreeController.init();
});
