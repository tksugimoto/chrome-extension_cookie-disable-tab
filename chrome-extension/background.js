
// インストール時に開いているすべてのタブにアイコン表示
chrome.tabs.query({}, function (tabs) {
	tabs.forEach(function (tab) {
		chrome.pageAction.show(tab.id);
	});
});

// タブが開いた/移動した時
chrome.tabs.onUpdated.addListener(function (tabId) {
	chrome.pageAction.show(tabId);
	changePageActionInfo(tabId);
});

var isDisable = {};
// 閉じた時
chrome.tabs.onRemoved.addListener(function (tabId) {
	delete isDisable[tabId];
});

chrome.pageAction.onClicked.addListener(function (tab) {
	var tabId = tab.id;
	isDisable[tabId] = !isDisable[tabId];
	changePageActionInfo(tabId);
});

function changePageActionInfo(tabId) {
	chrome.pageAction.setIcon({
		tabId: tabId,
		path: "icon/icon_cookie_" + (isDisable[tabId] ? "disable" : "enable") + ".png"
	});
	chrome.pageAction.setTitle({
		tabId: tabId,
		title: "Cookie無効化: " + (isDisable[tabId] ? "ON" : "OFF")
	});
}

setDisableCookieEvent({
	urls: [
		"*://*/*"
	]
}, function (tabId) {
	return isDisable[tabId];
});
