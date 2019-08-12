// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Update the declarative rules on install or upgrade.
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        // When a page contains a <video> tag...
        new chrome.declarativeContent.PageStateMatcher({
          css: ["body"]
        })
      ],
      // ... show the page action.
      actions: [new chrome.declarativeContent.ShowPageAction() ]
    }]);
  });
});

chrome.runtime.onConnectExternal.addListener(port => {
  const api = {
    async captureTab() {
      return new Promise((resolve, reject) => {
        chrome.tabs.captureVisibleTab(null, {format: 'png', quality: 100}, resolve);
      });
    }
  };

  wrapPortClient(port, api);
});

function wrapPortClient(port, api) {
  port.onMessage.addListener(async msg => {
    switch (msg.type) {
      case 'establish':
        port.postMessage({
          type: 'apiDefinition',
          methodNames: Object.keys(api)
        });
        break;
      case 'apiCall':
        const value = await api[msg.methodName](...msg.arguments);

        port.postMessage({
          type: 'apiReturn',
          callId: msg.callId,
          value
        });
        break;
    }
  });
}
