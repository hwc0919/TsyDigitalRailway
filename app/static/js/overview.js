jQuery(document).ready(function () {
  // 加载图片
  jQuery(".slider-content").each(function () {
    var curItem = jQuery(this);
    var imgName = curItem.attr("data-image-name");
    var url = "/static/images/风采展示/" + imgName + ".jpg";
    curItem.children("img").attr("src", url);
  });
  jQuery(".slider-dot[data-content-id='1']").addClass("dot-active");
  // 幻灯片切换控制
  jQuery(".slider-left-arrow").click(function () {
    slideLeft();
  });
  jQuery(".slider-right-arrow").click(function () {
    slideRight();
  });
  jQuery(".slider-dot").click(function () {
    that = this;
    slideJump(that);
  });
  // 自动播放
  var slideId = setInterval("slideRight()", 5000);
  // 悬浮暂停自动切换
  jQuery(".slider").mouseenter(function () {
    clearInterval(slideId);
  });
  jQuery(".slider").mouseleave(function () {
    slideId = setInterval("slideRight()", 5000);
  })
});
// 左箭头切换
function slideLeft() {
  var sliderTotal = jQuery(".slider-content").length;
  var maxLeft = (1 - sliderTotal) * 100 + "%";
  var contentId = jQuery(".dot-active").removeClass("dot-active").attr("data-content-id");
  if (contentId == 1) {
    var selector = ".slider-dot[data-content-id='" + sliderTotal + "']"
    jQuery(selector).addClass("dot-active");
    jQuery(".slider-container").animate({ left: maxLeft }, "slow")
  } else {
    var selector = ".slider-dot[data-content-id='" + (contentId - 1) + "']"
    jQuery(selector).addClass("dot-active");
    jQuery(".slider-container").animate({ left: "+=100%" }, "slow");
  }
}
// 右箭头切换
function slideRight() {
  var sliderTotal = jQuery(".slider-content").length;
  var maxLeft = (1 - sliderTotal) * 100 + "%";
  var contentId = jQuery(".dot-active").removeClass("dot-active").attr("data-content-id");
  if (contentId == sliderTotal) {
    jQuery(".slider-dot[data-content-id='1']").addClass("dot-active");
    jQuery(".slider-container").animate({ left: '0' }, "slow")
  } else {
    var selector = ".slider-dot[data-content-id='" + (Number(contentId) + 1) + "']"
    jQuery(selector).addClass("dot-active");
    jQuery(".slider-container").animate({ left: "-=100%" }, "slow");
  }
}
// 小圆点切换
function slideJump(that) {
  if (!jQuery(that).hasClass("dot-active")) {
    jQuery(".slider-dot").removeClass("dot-active");
    var contentId = jQuery(that).addClass("dot-active").attr("data-content-id");
    var left = (1 - contentId) * 100 + "%";
    jQuery(".slider-container").animate({ left: left });
  }
}