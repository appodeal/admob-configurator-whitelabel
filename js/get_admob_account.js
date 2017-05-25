var admob_account_id, message;
sendOut(0, "Start configure admob reporting api");
criticalUpdates(function(updates) {
  setTimeout(function() {
    appendJQuery(function() {
      modal = new Modal();
      modal.show("Appodeal Chrome Extension", "Checking Admob account.");
        console.log('Get admob account id.');
        admob_account_id = /pub-\d+/.exec(document.documentElement.innerHTML);
        if (admob_account_id) {
            chrome.storage.local.set({"current_account_id": admob_account_id[0]});
            console.log('Done! redirecting back.');
            setTimeout(function() {
                document.location.href = GOOGLE_CLOUD_CONSOLE_CREDENTIAL;
            }, 2000);
        } else {
            sendOut(0, "Can't proceed to enabling AdSense Reporting API (not logged in?)");
            message = "Can't proceed to enabling AdSense Reporting API. If you are not logged in, please authorize and try again.";
            modal.show("Appodeal Chrome Extension", message);
            chrome.storage.local.remove("reporting_tab_id");
        }
    })
  }, 1000);
});