var LoadController, length_email;

length_email = 25;

LoadController = (function () {
    var clearAndShowAdMediation = function () {
        clearStorageAndCookies();
        ShowAdMediatorUrl();
    };
    var getStatus = function (complete) {
        console.log('getStatus');
        chromeStorageGet(function (updates) {
            if (updates.ad_mediator_url && updates.appodeal_email) {
                $.ajax
                ({
                    type: "GET",
                    url: updates.ad_mediator_url + '/api/v2/get_api_key',
                    contentType: "application/json; charset=UTF-8",
                    dataType: "json",
                    async: false,
                    complete: function (response) {
                        if (response.readyState == 4 && response.status === 200) {
                            complete(JSON.parse(response.responseText));
                        }else{
                            clearAndShowAdMediation();
                        }
                    }
                });
            } else {
                clearAndShowAdMediation();
            }
        });
    };
    var clearStorageAndCookies = function () {
        chromeStorageGet(function (updates) {
            chrome.storage.local.clear();
            chrome.cookies.remove({
                'url': updates.ad_mediator_url,
                'name': '_android_ad_network_session'
            });
            chrome.cookies.remove({
                'url': updates.ad_mediator_url,
                'name': 'remember_token'
            });
            chrome.cookies.remove({
                'url': updates.ad_mediator_url,
                'name': 'user_id'
            });

            chrome.tabs.update({
                url: updates.ad_mediator_url
            });
        });
    };
    var ShowAdMediatorUrl = function (item) {
        $('.ad_mediator_url').show();
        $('#reset').click(function () {
            $('input').val('');
        });
        $('#save').click(function () {
            chrome.storage.local.set({"ad_mediator_url": $('#ad_mediator_url').val()});
            login_link();
        });
    };
    var ShowDisplayDataAndUpdateStyle = function (item, callback) {
        if (item.whitelabel && item.whitelabel_text){
            if(item.whitelabel && item.whitelabel.styles){
                var wl_styles = item.whitelabel.styles;
                var adm_header = wl_styles.adm_header;
                var adm_body = wl_styles.adm_body;
                var adm_icon = wl_styles.adm_icon;
                var adm_icon_hover = wl_styles.adm_icon_hover;
                var adm_text = wl_styles.adm_text;
                var adm_text_hover = wl_styles.adm_text_hover;
                var adm_step_hover = wl_styles.adm_step_hover;
                var adm_step_text_not_active = wl_styles.adm_step_text_not_active;
                var adm_header_width = wl_styles.adm_header_width;
                var adm_header_padding = wl_styles.adm_header_padding;
            }
            if(item.whitelabel_text){
                var wl_label = item.whitelabel_text;
                var return_text = wl_label.return_text;
                var faq = wl_label.faq;
                var header_text = wl_label.header_text;
                var step_one = wl_label.step_one;
                var step_two = wl_label.step_two;
                var step_tree = wl_label.step_tree;

                $('#return_link').text(return_text);
                $('.display_data #faq_link').text(faq);
                $('.caption h5').text(header_text);
                $('#login_link').text(step_one);
                $('#reporting_link').text(step_two);
                $('#admob_link').text(step_tree);
            }
            if (item.whitelabel.logo){
                var wl_logo = 'data:image/png;base64,' + item.whitelabel.logo;
                $('a.brand img').attr("src", wl_logo);
            }
            set_less({
                '@adm_header': adm_header,
                '@adm_body': adm_body,
                '@icon': adm_icon,
                '@icon_hover': adm_icon_hover,
                '@adm_text': adm_text,
                '@adm_text_hover': adm_text_hover,
                '@adm_step_hover': adm_step_hover,
                '@adm_step_text_not_active': adm_step_text_not_active,
                '@size_brand': adm_header_width

            });
        }
        $('.display_data').show();
        //Add style load hover
        load_hover(adm_step_hover);
        // Add events from plugin
        setEventListen();
        //END
        callback();
    };
    var login_link = function () {
        console.log('login_link');
        chromeStorageGet(function (updates) {
            chrome.tabs.update({
                url: updates.ad_mediator_url + "/signin"
            });
            window.close();
        });
    };
    var logout_link = function (event) {
        console.log('logout_link');
        clearStorageAndCookies();
        window.close();
    };
    var faq_link = function (event) {
        console.log('faq_link');
        chrome.tabs.update({
            url: FAQ_LINK
        });
        window.close();
    };
    var setEventListen = function (items) {
        $('#login_link').click(login_link);
        $('#logout_link').click(logout_link);

        $('#return_link').click(login_link);
        $('.ad_mediator_url #faq_link').click(faq_link);
        $('.display_data #faq_link').click(faq_link);
    };
    var updateCredentials = function (result, callback) {
        var localCredentials = {};
        if (result['user_id']) {
            localCredentials['appodeal_user_id'] = result['user_id'];
        } else {
            chrome.storage.local.remove('appodeal_user_id');
        }
        if (result['api_key']) {
            localCredentials['appodeal_api_key'] = result['api_key'];
        } else {
            chrome.storage.local.remove('appodeal_api_key');
        }
        if (result['plugin_status']['account']) {
            localCredentials['appodeal_admob_account_id'] = result['plugin_status']['account'];
        } else {
            chrome.storage.local.remove('appodeal_admob_account_id');
        }
        if (result['plugin_status']['publisher_id']) {
            localCredentials['appodeal_admob_account_publisher_id'] = result['plugin_status']['publisher_id'];
        } else {
            chrome.storage.local.remove('appodeal_admob_account_publisher_id');
        }
        if (result['plugin_status']['email']) {
            localCredentials['appodeal_admob_account_email'] = result['plugin_status']['email'];
        } else {
            chrome.storage.local.remove('appodeal_admob_account_email');
        }
        if (result['plugin_status']['adunits']) {
            localCredentials['adunitsVersion'] = result['plugin_status']['adunits'];
        } else {
            chrome.storage.local.remove('adunitsVersion');
        }
        if (result['plugin_status']['reporting']) {
            localCredentials['reportingVersion'] = result['plugin_status']['reporting'];
        } else {
            chrome.storage.local.remove('reportingVersion');
        }
        if (result['plugin_status']['interstitialBids']) {
            localCredentials['interstitialBids'] = result['plugin_status']['interstitialBids'];
        } else {
            chrome.storage.local.remove('interstitialBids');
        }
        if (result['plugin_status']['bannerBids']) {
            localCredentials['bannerBids'] = result['plugin_status']['bannerBids'];
        } else {
            chrome.storage.local.remove('bannerBids');
        }
        if (result['plugin_status']['mrecBids']) {
            localCredentials['mrecBids'] = result['plugin_status']['mrecBids'];
        } else {
            chrome.storage.local.remove('mrecBids');
        }
        if (result['plugin_status']['rewarded_videoBids']) {
            localCredentials['rewarded_videoBids'] = result['plugin_status']['rewarded_videoBids'];
        } else {
            chrome.storage.local.remove('rewarded_videoBids');
        }
        if(result['plugin_status_ids']){
            if (result['plugin_status_ids']['accounts']) {
                localCredentials['accounts'] = result['plugin_status_ids']['accounts'];
            } else {
                chrome.storage.local.remove('accounts');
            }
        }
        if(result['whitelabel'] && result['whitelabel_text']){
            if(result['whitelabel']['styles']){
                chrome.storage.local.set({"wl_styles": result['whitelabel']['styles']});
            }
            if(result['whitelabel']['logo']){
                chrome.storage.local.set({"wl_logo": result['whitelabel']['logo']});
            }
            if(result['whitelabel']['host']){
                var wl_host = result['whitelabel']['host'];
                chrome.storage.local.set({"wl_host": wl_host});
            }
            if(result['whitelabel']['projectName']){
                var wl_projectName = result['whitelabel']['projectName'];
                chrome.storage.local.set({"wl_projectName": wl_projectName});
            }
            if(result['whitelabel_text']){
                chrome.storage.local.set({"wl_text": result['whitelabel_text']});
            }
        }

        chrome.storage.local.set(localCredentials, function () {
            callback();
        });
    };
    var updateLoginLink = function (item) {
        var login = $('.point_login');
        if(item.user_id && item.user_email){
            var email = cut(item['user_email'], 24);
            $('#login div.svgStep').removeClass('stepOne');
            $('#login div.svgStep').addClass('userActive');
            login.html('<a class="not_point" id="login_link">'+email+'</a><a class="button_logout right" id="logout_link">Logout</a>');
            $('#logout_link').click(function () {
                logout_link();
            })
        }else{
            login.html('<a class="point" id="login_link">Login to AdMediator</a>');
        }
    };
    var reporting_link = function () {
        chrome.tabs.update({url: GOOGLE_CLOUD_CONSOLE}, function (tab) {
            chrome.storage.local.set({"reporting_tab_id": tab.id});
            window.close();
        });
    };
    var admob_link = function (event) {
        chrome.tabs.update({url: ADMOB_LOGOUT}, function (tab) {
            chrome.storage.local.set({"admob_processing": true}, function () {
                window.close();
            });
        });
    };
    var addCountApps = function (leftNum) {
        var message;
        var admob = $('.point_admob');
        if (leftNum === 1) {
            message = leftNum + ' app left';
        }
        if (leftNum >= 2) {
            message = leftNum + ' apps left';
        }
        admob.html('<a class="point" id="admob_link">'+message+'</a>');
        $('#admob_link').click(function () {
            admob_link();
        });
    };
    var updateReportLink = function (item) {
        var data, leftNum, acc_name = '';
        var report = $('.point_reporting');
        var report_svg = $('#reporting div.svgStep');
        data = item['plugin_status'];
        data['many_user_admob_accounts'] = item['plugin_status_ids'];
        console.log(data);
        leftNum = data['total'] - data['synced'];
        if (data['account']) {
            if(data['many_user_admob_accounts'] && data['many_user_admob_accounts']['accounts']){
                $.each( data['many_user_admob_accounts']['accounts'], function( key, value ) {
                    if(value != undefined){
                        var label = cut('Synced '+ (value['synced'] >= 2 ? 'apps' : 'app') + ': ' + value['synced'] + ' ' + value['email'], 30);
                        acc_name = acc_name + '<span class="account">' + label + '</span>';
                    }
                });
                report_svg.removeClass('stepTwo');
                report_svg.addClass('stepDone');
                report.html('<a class="point" id="reporting_link">'+acc_name+'</a>');
                $('#reporting_link').click(function () {
                    reporting_link();
                });
            }
        } else {
            var link = $('#reporting #reporting_link');
            link.removeClass('gray');
            link.click(reporting_link);
        }
        var admob = $('.point_admob');
        var admob_svg = $('#admob div.svgStep');
        if (leftNum) {
            addCountApps(leftNum);
        } else if (data['total']) {
            admob_svg.removeClass('stepThree');
            admob_svg.addClass('stepDone');
            admob.html('<a id="admob_link" class="point">Synced Admob ad units</a>');
            admob.click(admob_link);
        } else {
            admob.html('<a id="admob_link" class="point">No apps</a>');
        }
    };
    var load_hover = function (adm_step_hover) {
        if(!adm_step_hover){
            adm_step_hover = '#EC3F21'
        }
        console.log('load_hover');
        $('.container-fluid .row_s').hover((function () {
            if ($(this).find('.gray').length > 0) {
                $(this).css('background', '#FACFC8');
                $(this).find('a.point').addClass('linkWhite');
            } else if (!$(this).find('.userActive.svgStep').length > 0) {
                $(this).css('background', adm_step_hover);
                $(this).find('.backgroundRadius').css('background', adm_step_hover);
                $(this).find('.svgStep').addClass('active');
                $(this).find('a.point').addClass('linkWhite');
            }
        }), function () {
            $(this).css('background', '');
            $(this).find('.backgroundRadius').css('background', '');
            $(this).find('.svgStep').removeClass('active');
            $(this).find('a.point').removeClass('linkWhite');
        });
    };

    return {
        init: function () {
            getStatus(function (item) {
                updateCredentials(item, function () {
                    if (item.whitelabel){
                        ShowDisplayDataAndUpdateStyle(item, function () {
                            updateLoginLink(item);
                            updateReportLink(item);
                        });
                    }
                });
            });
        }
    };
})();

$(document).ready(function () {
    LoadController.init();
});