if (typeof browser !== 'undefined') {
    browser.runtime.onMessage.addListener(
        function (request, sender) {
            browser.tabs.onUpdated.addListener(() => {
                setTimeout(() => {
                    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
                    gettingActiveTab.then((tabs) => {
                        if (tabs.length == 0) return;
                        browser.tabs.sendMessage(tabs[0].id, {});
                    });
                }, 1000);
            });
            var filter = {
                url:
                [
                    { hostContains: "vk.com" }
                ]
            };
            browser.webNavigation.onCompleted.addListener(() => {
                setTimeout(() => {
                    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
                    gettingActiveTab.then((tabs) => {
                        if (tabs.length == 0) return;
                        browser.tabs.sendMessage(tabs[0].id, {});
                    });
                }, 1000);
            }, filter);
        }
    );
} else if (typeof chrome !== 'undefined') {
    chrome.extension.onMessage.addListener(
        function (request, sender) {
            chrome.tabs.onUpdated.addListener(() => {
                var gettingActiveTab = chrome.tabs.query({active: true, currentWindow: true},
                    (tabs) => {
                        if (tabs.length == 0) return;
                        chrome.tabs.sendMessage(tabs[0].id, {});
                    }
                );
            });
            var filter = {
                url:
                [
                    { hostContains: "vk.com" }
                ]
            };
            chrome.webNavigation.onCompleted.addListener(() => {
                var gettingActiveTab = chrome.tabs.query({active: true, currentWindow: true},
                    (tabs) => {
                        if (tabs.length == 0) return;
                        chrome.tabs.sendMessage(tabs[0].id, {});
                    }
                );
            }, filter);
        }
    );
}