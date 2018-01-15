{
  document.execCommand('copy');
	var textarea = document.createElement("textarea");
  var title = document.title;
  textarea.addEventListener("paste", (event) => {
    var html = event.clipboardData.getData("text/html");
    chrome.runtime.sendMessage({ method: "copy", body: html, title: title });
    event.preventDefault();
  });
	document.body.appendChild(textarea);
  textarea.select();
  // workaround to prevent clipboardData.getData returns blank.
  setTimeout(() => {
    document.execCommand("paste");
    document.body.removeChild(textarea);
  }, 0);
}
