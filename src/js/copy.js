{
  document.execCommand('copy');
	var textarea = document.createElement("textarea");
  var title = document.title;
  textarea.addEventListener("paste", (event) => {
    event.preventDefault();
    var html = event.clipboardData.getData("text/html");
    chrome.runtime.sendMessage({ method: "copy", body: html, title: title });
  });
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand("paste");
	document.body.removeChild(textarea);
}
