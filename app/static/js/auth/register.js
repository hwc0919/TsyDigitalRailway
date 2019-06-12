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
  if (!passFlag) {
    return false;
  } else {
    jQuery.ajax({
      type: "POST",
      dataType: "json",
      url: "/auth/register?type=register",
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