jQuery(document).ready(function () {
  // 加载缩略图
  jQuery(".video-list-item").each(function () {
    var curItem = jQuery(this);
    var folderName = curItem.attr("data-folder-name")
    var videoName = curItem.attr("data-video-name");
    var url = "/static/video/" + folderName + "/" + videoName;
    var imgURL = url + ".jpg";
    curItem.attr("data-url", url).children(".video-list-img").attr("src", imgURL);
  });
  // 激活列表第一项
  var firstItem = jQuery(".video-list-item").first();
  firstItem.addClass("list-item-active");
  textURL = firstItem.attr("data-url") + ".txt"
  jQuery(".video-description-body").load(textURL);
  var videoURL = firstItem.attr("data-url") + ".mp4";
  var html = '<video width=100% height=480px controls><source src="'
    + videoURL
    + '" type = "video/mp4"></video>'
  jQuery(".video-player-body").html(html);
  // 视频列表效果
  jQuery(".video-list-item").hover(function () {
    jQuery(this).children("i.play-hint").stop(false, true).fadeToggle("fast");
  });
  // 切换视频
  jQuery(".video-list-item").click(function () {
    var curItem = jQuery(this);
    if (!curItem.hasClass("list-item-active")) {
      jQuery(".list-item-active").removeClass("list-item-active");
      curItem.addClass("list-item-active");
      jQuery(".video-description-head").text(curItem.find("h4").text());
      var textURL = curItem.attr("data-url") + ".txt"
      jQuery(".video-description-body").load(textURL);
      var videoURL = curItem.attr("data-url") + ".mp4";
      var html = '<video width=100% height=480px controls><source src="'
        + videoURL
        + '" type = "video/mp4"></video>'
      jQuery(".video-player-body").html(html);
    }
  });
});