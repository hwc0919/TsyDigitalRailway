jQuery(document).ready(function () {
  jQuery("#reg-select-company").change(function () {
    var selection = jQuery(this).val();
    if (selection == "") {
      jQuery("#reg-company-group").addClass("d-none");
      jQuery("#reg-input-company").val("");
      jQuery("#reg-department-group").addClass("d-none");
      jQuery("#reg-input-department").val("");
    } else if (selection == "铁四院") {
      jQuery("#reg-company-group").addClass("d-none");
      jQuery("#reg-input-company").val("铁四院");
      jQuery("#reg-department-group").removeClass("d-none");
      jQuery("#reg-input-department").val("线站处");
    } else if (selection == "其他") {
      jQuery("#reg-company-group").removeClass("d-none").css("margin-top", "-10px");
      jQuery("#reg-input-company").val("");
      jQuery("#reg-department-group").removeClass("d-none");
      jQuery("#reg-input-department").val("");
    }
  });
  jQuery("#register-form input").change(function () {
    jQuery(this).next(".reg-feedback").text("").removeClass("d-flex");
  })
});

function register() {
  jQuery(".reg-feedback").text("").removeClass("d-flex");
  var passFlag = true;
  // notNull检查
  jQuery(".input-required").each(function () {
    if (jQuery(this).val().trim() == '') {
      passFlag = false;
      jQuery(this).siblings("p").text("此字段为必填项!").addClass("d-flex");
    }
  })
  if (!passFlag) return false;
  // 用户名格式检查
  var username = jQuery("#reg-input-username").val();
  if (username[0] == " " || username[username.length - 1] == " ") {
    passFlag = false;
    jQuery("#username_field").text("首尾不能为空格").addClass("d-flex");
  } else if (username.length < 3 || username.length > 20) {
    passFlag = false;
    jQuery("#username_field").text("用户名长度不合要求").addClass("d-flex");
  }
  // 邮箱格式检查
  var email = jQuery("#reg-input-email").val();
  var apos = email.indexOf("@")
  var dotpos = email.lastIndexOf(".")
  if (apos < 1 || dotpos - apos < 2) {
    passFlag = false;
    jQuery("#email_field").text("邮箱格式错误").addClass("d-flex");
  }
  // 姓名格式检查
  var name = jQuery("#reg-input-realname").val();
  if (name[0] == " " || name[name.length - 1] == " ") {
    passFlag = false;
    jQuery("#realname_field").text("首尾不能为空格").addClass("d-flex");
  } else if (username.length < 2) {
    passFlag = false;
    jQuery("#realname_field").text("姓名长度至少为2").addClass("d-flex");
  }
  // 密码长度检查
  var password = jQuery("#reg-input-password").val();
  if (password.length < 6 || password.length > 20) {
    passFlag = false;
    jQuery("#password_field").text("密码长度不合要求").addClass("d-flex");
  }
  // 密码一致检查
  if (password != jQuery("#reg-input-verify-password").val()) {
    passFlag = false;
    jQuery("#verify_password_field").text("密码不一致").addClass("d-flex");
  }
  // 电话格式检查
  var phone = jQuery("#reg-input-phone").val();
  if (phone) {
    if (phone.indexOf(" ") > -1) {
      passFlag = false;
      jQuery("#phone_field").text("号码不能含有空格").addClass("d-flex");
    } else if (phone.length != 11) {
      passFlag = false;
      jQuery("#phone_field").text("号码必须为11位").addClass("d-flex");
    } else if (!/^[0-9]+$/.test(phone)) {
      passFlag = false;
      jQuery("#phone_field").text("号码必须全为数字").addClass("d-flex");
    }
  }

  if (!passFlag) {
    return false;
  } else {
    jQuery.ajax({
      type: "POST",
      dataType: "json",
      url: "/auth/register",
      data: jQuery("#register-form").serialize(),
      success: function (json) {
        if (json.status == false) {
          var field_name = "#" + json.error_field;
          jQuery(field_name).text(json.message).addClass("d-flex");
          return false;
        } else if (json.status == true) {
          jQuery("input").val("");
          setTimeout(function () { alert("注册成功!"); }, 1);
          window.open(json.url, "_self");
        } else {
          jQuery("#overall_field").text("注册失败, 未知错误.").addClass("d-flex");
          return false;
        }
      },
      error: function () {
        jQuery("#login-feedback").text("网络错误, 无法注册.").addClass("d-flex");
      }
    })
  }
}