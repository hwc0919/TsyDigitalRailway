jQuery(document).ready(function () {
  // 加载首页
  jQuery(".content-panel[data-panel-name='overview-panel']").load('/ajax_load/overview', function (response, status, xhr) {
    if (status == "error") {
      jQuery(this).html('<h1 class="placeholder">内容加载失败</h1><link rel="stylesheet" href="/static/css/content_base.css">');
    }
  });

  jQuery(".left-menu-list .left-menu-item:first-child").addClass("menu-active");
  jQuery(".content-panel:first-child").addClass("d-block");

  // 左侧菜单效果, 加载标签页
  jQuery(".left-menu-item").click(function () {
    jQuery(".menu-active").removeClass("menu-active");
    jQuery(this).addClass("menu-active");
    var targetPanel = jQuery(this).attr("data-target-panel");
    if (targetPanel == "video-panel") {
      folderName = jQuery(this).attr("data-folder-name");
      var url = '/ajax_load/video/' + folderName;
      jQuery(".content-panel[data-panel-name='video-panel']").load(url, function (response, status, xhr) {
        if (status == "error") {
          jQuery(this).html('<h1 class="placeholder">内容加载失败</h1>');
        }
      });
    } else {
      jQuery(".content-panel[data-panel-name='video-panel']").html("");
    }
    jQuery(".content-panel").removeClass("d-block");
    setTimeout(function () { jQuery(".content-panel[data-panel-name=" + targetPanel + "]").addClass("d-block"); }, 60);
  });
})