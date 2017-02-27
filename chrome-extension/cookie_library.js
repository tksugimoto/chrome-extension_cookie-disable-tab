
function setDisableCookieEvent(filter, isTarget) {
	/*
		filter: {
			urls: [
				// URL pattern
				"http://example.com/*"
			]
		},
		isTarget: function (tabId) {
			return true;	// or false
		}
	*/
	var callback_request = function (details) {
		var requestHeaders = details.requestHeaders;
		if (isTarget(details.tabId)) {
			for (var i = 0; i < requestHeaders.length; ++i) {
				if (requestHeaders[i].name === "Cookie") {
					requestHeaders.splice(i, 1);
					break;
				}
			}
		}
		return {
			requestHeaders: requestHeaders
		};
	};
	var opt_extraInfoSpec_request = [
		"requestHeaders",
		"blocking"
	];
	chrome.webRequest.onBeforeSendHeaders.addListener(callback_request, filter, opt_extraInfoSpec_request);
	
	var callback_response = function (details) {
		var responseHeaders = details.responseHeaders;
		if (isTarget(details.tabId)) {
			var i = responseHeaders.length;
			while (i > 0) {
				i--;
				if (responseHeaders[i].name === "Set-Cookie") {
					// Set-Cookieヘッダは1つとは限らない
					responseHeaders.splice(i, 1);
				}
			}
		}
		return {
			responseHeaders: responseHeaders
		};
	};
	var opt_extraInfoSpec_response = [
		"responseHeaders",
		"blocking"
	];
	chrome.webRequest.onHeadersReceived.addListener(callback_response, filter, opt_extraInfoSpec_response);
}