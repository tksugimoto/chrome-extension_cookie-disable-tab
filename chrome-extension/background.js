
// インストール時に開いているすべてのタブにアイコン表示
chrome.tabs.query({}, tabs => {
	tabs.forEach(tab => {
		chrome.pageAction.show(tab.id);
	});
});

// タブが開いた/移動した時
chrome.tabs.onUpdated.addListener(tabId => {
	chrome.pageAction.show(tabId);
	changePageActionInfo(tabId);
});

const isDisable = {};
// 閉じた時
chrome.tabs.onRemoved.addListener(tabId => {
	delete isDisable[tabId];
});

chrome.pageAction.onClicked.addListener(tab => {
	const tabId = tab.id;
	isDisable[tabId] = !isDisable[tabId];
	changePageActionInfo(tabId);
});

const changePageActionInfo = tabId => {
	chrome.pageAction.setIcon({
		tabId: tabId,
		path: "icon/icon_cookie_" + (isDisable[tabId] ? "disable" : "enable") + ".png"
	});
	chrome.pageAction.setTitle({
		tabId: tabId,
		title: "Cookie無効化: " + (isDisable[tabId] ? "ON" : "OFF")
	});
};

setDisableCookieEvent({
	urls: [
		"*://*/*"
	]
}, tabId => {
	return isDisable[tabId];
});
