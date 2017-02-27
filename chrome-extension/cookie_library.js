
const setDisableCookieEvent = (filter, isTarget) => {
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
	const callback_request = details => {
		const requestHeaders = details.requestHeaders;
		if (isTarget(details.tabId)) {
			for (let i = 0; i < requestHeaders.length; ++i) {
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
	const opt_extraInfoSpec_request = [
		"requestHeaders",
		"blocking"
	];
	chrome.webRequest.onBeforeSendHeaders.addListener(callback_request, filter, opt_extraInfoSpec_request);
	
	const callback_response = details => {
		const responseHeaders = details.responseHeaders;
		if (isTarget(details.tabId)) {
			let i = responseHeaders.length;
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
	const opt_extraInfoSpec_response = [
		"responseHeaders",
		"blocking"
	];
	chrome.webRequest.onHeadersReceived.addListener(callback_response, filter, opt_extraInfoSpec_response);
};
