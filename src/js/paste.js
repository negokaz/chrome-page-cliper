{
  function replaceToBase64(img) {
      var canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      $.ajax({ url: img.src, type: "HEAD"})
        .done(function(data, textStatus, jqXHR) {
          var mimeType = jqXHR.getResponseHeader('Content-Type');
          var context = canvas.getContext('2d');
          context.drawImage(img, 0, 0);
          var base64 = canvas.toDataURL(mimeType);
          img.src = base64;
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          console.error(errorThrown);
        });
  }

  function replaceToRelativeLink(baseAbsolutePath, aTag) {
    $(aTag).attr('href', $(aTag).attr('href').replace(baseAbsolutePath, ''));
  }

  chrome.runtime.sendMessage({ event: "opened" }, function(response) {
    document.title = "Clipping: " + response.title;
    var titleForm = $("#title_form");
    titleForm.val(response.title);

    document.querySelector("#content").innerHTML = response.body;
    $("img").each(function() {
      $(this).on('load', function() {
        replaceToBase64(this);
        $(this).off("load");
      });
    });
    $('a').each(function () {
      replaceToRelativeLink(response.url, this);
    });
    $("#download_html").on("click", function() {
      var html = document.querySelector("#content").innerHTML;
    	var blob = new Blob([html], { type: "text/html" });
    	this.href = window.URL.createObjectURL(blob);
      this.download = titleForm.val() + ".html";
    });
  });
}
