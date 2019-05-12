jQuery(document).ready(function () {
  // 加载缩略图
  jQuery(".video-list-item").each(function () {
    var curItem = jQuery(this);
    curItem.find("img").attr("src", curItem.attr("data-url") + ".jpg")
  });
  // 激活列表第一项
  var firstItem = jQuery(".video-list-item").first();
  firstItem.addClass("list-item-active");
  textURL = firstItem.attr("data-url") + ".txt"
  jQuery(".video-description-body").load(textURL);
  var videoURL = firstItem.attr("data-url") + ".mp4";
  var html = '<video width=100% height=480px controls><source src="'
    + videoURL
    + '" type = "video/mp4">您的浏览器不支持video视频标签。</video>'
  jQuery(".video-player-body").html(html);
  // 切换视频
  jQuery(".video-list-item").click(function () {
    var curItem = jQuery(this);
    if (!curItem.hasClass("list-item-active")) {
      jQuery(".list-item-active").removeClass("list-item-active");
      curItem.addClass("list-item-active");
      jQuery(".video-description-head").text(curItem.find("h4").text());
      var textURL = curItem.attr("data-url") + ".txt"
      jQuery(".video-description-body").load(textURL, function (responseTxt, statusTxt, xhr) {
        if (statusTxt == "error") {
          jQuery(".video-description-body").text("暂无视频信息");
        }
      });
      var videoURL = curItem.attr("data-url") + ".mp4";
      var html = '<video width=100% height=480px controls><source src="'
        + videoURL
        + '" type = "video/mp4">您的浏览器不支持video视频标签。</video>'
      jQuery(".video-player-body").html(html);
    }
  });
});