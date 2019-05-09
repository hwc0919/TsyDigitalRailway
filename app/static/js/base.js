jQuery(document).ready(function () {
  // 动态设置viewport
  var scale = document.documentElement.clientWidth / window.innerWidth;
  if (scale < 1) {
    var content = "width=device-width, initial-scale=" + scale;
  } else {
    var content = "width=device-width, initial-scale=1.0, user-scalable=no";
  }
  jQuery("#viewport").attr("content", content);
  // 显示用户面板
  jQuery(".show-userinfo-menu").click(function () {
    jQuery("#userinfo-menu").fadeToggle("fast");
  });
  // 关闭用户面板
  jQuery("#userinfo-menu").mouseleave(function () {
    jQuery("#userinfo-menu").fadeOut("fast");
  });
  // (折叠状态时)显示导航栏菜单
  jQuery(".navbar-toggle-btn").click(function () {
    jQuery(".navbar-toggle-wrapper").toggleClass("d-flex");
  });
  // 折叠导航栏菜单
  jQuery(".navbar-toggle-wrapper").mouseleave(function () {
    jQuery(this).toggleClass("d-flex");
  })
  // 显示登录窗口
  jQuery(".show-login-window").click(function () {
    jQuery(".login-window-wrapper").toggleClass("d-flex", true);
  })
  // 关闭登录窗口
  jQuery("#close-window-btn").click(function () {
    jQuery("#login-feedback").text("").removeClass("d-flex");
    jQuery("#input-username").val("");
    jQuery("#input-password").val("");
    jQuery(".login-window-wrapper").toggleClass("d-flex", false);
  })
})

// 搜索表单notNull检查
function inputNotNull() {
  if (jQuery("input#search-form-input").val().trim() == '') {
    alert("请输入搜索内容");
    return false;
  }
  return true;
}
//查看项目
function redirectToProjects() {
  jQuery.ajax({
    type: "GET",
    dataType: "json",
    url: "/auth/check_auth",
    success: function (json) {
      if (!json.status) {
        alert(json.message + '. 权限不足, 无法查看项目.');
        return false;
      } else {
        window.open(json.url, "_blank");
      }
    },
    error: function () {
      alert("网络错误, 项目不可访问.");
    }
  })
}
// 登录输入检查
function login() {
  jQuery("#login-feedback").text("").removeClass("d-flex");
  if (jQuery("#input-username").val().trim() == ''
    || jQuery("#input-password").val().trim() == '') {
    jQuery("#login-feedback").text("用户名或密码不能为空!").addClass("d-flex");
    return false;
  } else {
    jQuery.ajax({
      type: "POST",
      dataType: "json",
      url: "/auth/login",
      data: jQuery("#login-form").serialize(),
      success: function (json) {
        if (json.status == false) {
          jQuery("#login-feedback").text(json.message).addClass("d-flex");
          return false;
        } else if (json.status == true) {
          jQuery("#login-success-feedback").text(json.message).addClass("d-flex");
          setTimeout(function () { window.open(json.url, "_self"); }, 1000);

        } else {
          jQuery("#login-feedback").text("登录失败, 未知错误.").addClass("d-flex");
        }
      },
      error: function () {
        jQuery("#login-feedback").text("网络错误, 无法登陆.").addClass("d-flex");
      }
    })
  }
}
// 注销
function logout() {
  var flag = confirm("确认退出登录?");
  if (flag) {
    jQuery.ajax({
      type: "GET",
      dataType: "json",
      url: "/auth/logout",
      success: function (json) {
        if (!json.status) {
          alert(json.message);
        } else {
          window.open(json.url, "_self");
        }
      },
      error: function () {
        alert("网络错误.");
      }
    });
  }
}