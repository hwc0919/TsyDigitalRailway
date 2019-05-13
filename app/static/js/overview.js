jQuery(document).ready(function () {
  // 加载图片
  jQuery(".slider-content").each(function () {
    var curItem = jQuery(this);
    curItem.children("img").attr("src", curItem.attr("data-image-url"));
  });
  jQuery(".slider-dot[data-content-id='1']").addClass("dot-active");
  // 幻灯片切换控制
  var sliderTotal = jQuery(".slider-content").length;
  jQuery(".slider-left-arrow").click(function () {
    slideLeft(sliderTotal);
  });
  jQuery(".slider-right-arrow").click(function () {
    slideRight(sliderTotal);
  });
  jQuery(".slider-dot").click(function () {
    that = this;
    slideJump(that);
  });
  // 自动播放
  var slideId = setInterval(function () { slideRight(sliderTotal); }, 5000);
  // 悬浮暂停自动切换
  jQuery(".slider").mouseenter(function () {
    clearInterval(slideId);
  });
  jQuery(".slider").mouseleave(function () {
    slideId = setInterval(function () { slideRight(sliderTotal); }, 5000);
  })
});
// 左箭头切换
function slideLeft(sliderTotal) {
  var contentId = jQuery(".dot-active").removeClass("dot-active").attr("data-content-id");
  if (contentId == 1) {
    var selector = ".slider-dot[data-content-id='" + sliderTotal + "']"
    jQuery(selector).addClass("dot-active");
    jQuery(".slider-container").animate({ left: (1 - sliderTotal) * 100 + "%" }, "slow")
  } else {
    var selector = ".slider-dot[data-content-id='" + (contentId - 1) + "']"
    jQuery(selector).addClass("dot-active");
    jQuery(".slider-container").animate({ left: "+=100%" }, "slow");
  }
}
// 右箭头切换
function slideRight(sliderTotal) {
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