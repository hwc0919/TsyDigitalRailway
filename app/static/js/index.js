jQuery(document).ready(function () {
  // 加载首页
  jQuery(".content-panel[data-panel-name='overview-panel']").load('overview', function (response, status, xhr) {
    if (status == "error") {
      jQuery(this).html('<h1 class="placeholder">内容加载失败</h1>');
    }
  });
  // 左侧菜单效果, 加载标签页
  jQuery(".left-menu-item").click(function () {
    if (!jQuery(this).hasClass("menu-active")) {
      jQuery(".menu-active").removeClass("menu-active");
      jQuery(this).addClass("menu-active");
      var targetPanel = jQuery(this).attr("data-target-panel");
      if (targetPanel == "video-panel") {
        folderName = jQuery(this).attr("data-folder-name");
        var url = 'video/' + folderName;
        jQuery(".content-panel[data-panel-name='video-panel']").load(url, function (response, status, xhr) {
          if (status == "error") {
            jQuery(this).html('<h1 class="placeholder">内容加载失败</h1>');
          }
        });
      }
      jQuery(".content-panel").removeClass("d-block");
      jQuery(".content-panel[data-panel-name=" + targetPanel + "]").addClass("d-block");
    }
  });
})