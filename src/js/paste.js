{
  function replaceToBase64(img) {
      var canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      $.ajax({ url: img.src, type: "HEAD"}).done(function(data, textStatus, jqXHR) {
        var mimeType = jqXHR.getResponseHeader('Content-Type');
        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        var base64 = canvas.toDataURL(mimeType);
        img.src = base64;
      });
  }

  chrome.runtime.onMessage.addListener(function(data) {
    if (data.method !== "paste") {
      return;
    }

    document.title = "Clipping: " + data.title;
    var titleForm = $("#title_form");
    titleForm.val(data.title);

    document.querySelector("#content").innerHTML = data.value;
    $("img").each(function() {
      $(this).on('load', function() {
        replaceToBase64(this);
        $(this).off("load");
      });
    });
    var html = document.querySelector("#content").innerHTML;
    $("#download_html").on("click", function() {
    	var blob = new Blob([html], { type: "text/html" });
    	this.href = window.URL.createObjectURL(blob);
      this.download = titleForm.val() + ".html";
    });
  });
}
