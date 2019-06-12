jQuery("document").ready(function () {
  jQuery("#edit-profile-btn").click(function () {
    jQuery(".content-panel").removeClass("d-block");
    jQuery(".content-panel[data-panel-name='edit-profile-panel']").addClass("d-block");
  });
  jQuery('.home-page-btn').click(function () {
    window.open("/", "_self");
  });
  jQuery("#change-passwd-btn").click(function () {
    jQuery(".content-panel").removeClass("d-block");
    jQuery(".content-panel[data-panel-name='change-password-panel']").addClass("d-block");
  });
  jQuery("#register-form input").change(function () {
    jQuery(this).next(".reg-feedback").text("").removeClass("d-flex");
  })
});
function commitEdit(base_url, form_id) {
  jQuery(".reg-feedback").text("").removeClass("d-flex");
  var passFlag = true;
  jQuery(form_id + " .input-required").each(function () {
    if (jQuery(this).val().trim() == '') {
      passFlag = false;
      jQuery(this).siblings("p").text("此字段为必填项!").addClass("d-flex");
    }
  })
  var url = "/auth/" + base_url + "{{ user.id }}";
  if (!passFlag) {
    return false;
  } else {
    jQuery.ajax({
      type: "POST",
      dataType: "json",
      url: url,
      data: jQuery(form_id).serialize(),
      success: function (json) {
        if (json.status == true) {
          alert(json.message);
          window.open(json.url, "_self");
        }
        else {
          var field_name = "#" + json.error_field;
          jQuery(field_name).text(json.message).addClass("d-flex");
          return false;
        }
      },
      error: function () {
        alert('网络错误, 修改失败');
      }
    });
  }
}