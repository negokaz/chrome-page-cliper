
function createContextMenu() {

  var onClickContextMenu = (info, tab) => {

		chrome.tabs.executeScript({
			frameId: info.frameId,
			file: "js/copy.js"
		});
  };

  chrome.contextMenus.create({
    "id": "clip-page",
    "title": "Clip as single HTML file",
    "type": "normal",
    "contexts": ["selection"],
    "onclick": onClickContextMenu
  });
}

chrome.runtime.onInstalled.addListener(createContextMenu);
chrome.runtime.onStartup.addListener(createContextMenu);

chrome.runtime.onMessage.addListener(({method, body, title, url}, sender) => {
	if (method !== "copy") {
		return;
  }
  chrome.tabs.create({
    "url": chrome.extension.getURL("view/preview.html")
  }, (tab) => {
    chrome.runtime.onMessage.addListener(({event}, sender, sendResponse) => {
      if (sender.tab.id !== tab.id || event !== "opened") {
        return;
      }
      sendResponse({ body: body, title: title, url: url });
    });
  });
});
