// Update the declarative rules on install or upgrade.
browser.runtime.onInstalled.addListener(() => {
  browser.declarativeContent.onPageChanged.removeRules(undefined, () => {
    browser.declarativeContent.onPageChanged.addRules([{
      conditions: [
        // When a page contains a <video> tag...
        new browser.declarativeContent.PageStateMatcher({
          css: [".ractive-player"]
        })
      ],
      // ... show the page action.
      actions: [new browser.declarativeContent.ShowPageAction() ]
    }]);
  });
});

browser.runtime.onConnectExternal.addListener(port => {
  const api = {
    async captureTab() {
      return browser.tabs.captureVisibleTab(null, {format: "png", quality: 100});
    }
  };

  wrapPortClient(port, api);
});

function wrapPortClient(port, api) {
  port.onMessage.addListener(async msg => {
    switch (msg.type) {
      case "establish":
        port.postMessage({
          type: "apiDefinition",
          methodNames: Object.keys(api)
        });
        break;
      case "apiCall":
        const value = await api[msg.methodName](...msg.arguments);

        port.postMessage({
          type: "apiReturn",
          callId: msg.callId,
          value
        });
        break;
    }
  });
}
