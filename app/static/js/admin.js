jQuery(document).ready(function () {
  jQuery(".manage-panel").each(function () {
    jQuery(this).load(jQuery(this).attr("data-target-url"), function (responseTxt, statusTxt, xhr) {
      if (statusTxt == "error") {
        jQuery(this).html('<h1 class="placeholder">加载失败</h1>');
      }
    });
  });

  // 更新按钮
  jQuery(".content-panel").on("click", ".update-btn", function () {
    var targetPanel = jQuery(this).parents(".content-panel");
    targetPanel.load(targetPanel.attr("data-target-url"));
  });

  // Role增加按钮
  var appendHTML = "<tr><td><input></td>" + "<td><input></td>" +
    "<td><input></td>" + "<td><input></td>" + "<td></td>" + "<td></td>" +
    "<td><button class='btn btn-primary confirm-append'>提交</button></td></tr>";

  jQuery(".content-panel").on("click", ".append-btn", function () {
    var appendTarget = jQuery(this).siblings("table").find("tbody");
    appendTarget.append(appendHTML);
  })

  // Role提交增加
  jQuery(".content-panel").on("click", ".confirm-append", function () {
    var inputs = jQuery(this).parents("tr").find("input");
    var data = {
      rid: inputs[0].value,
      name: inputs[1].value,
      description: inputs[2].value,
      permission: inputs[3].value
    };
    console.log(data);
    confirmAndUpdate(this, "append-role", data);
  })

  // Role删除按钮
  jQuery(".content-panel").on("click", ".delete-btn", function () {
    var rid = jQuery(this).parents("tr").attr("data-role-id");
    var data = { rid: rid };
    confirmAndUpdate(this, "delete-role", data);
  })

  // 修改, 确认, 取消按钮
  jQuery(".content-panel").on("click", ".editor-btn", function () {
    jQuery(this).hide().siblings(".hidden-btn").show();
    var targetEditor = jQuery(this).attr("data-target-editor");
    var selector = ".editor-input[data-editor-name='" + targetEditor + "']";
    jQuery(selector).css("visibility", "visible");
  })

  jQuery(".content-panel").on("click", ".cancel-btn", function () {
    var targetEditor = jQuery(this).parent(".hidden-btn").hide()
      .prev().show().attr("data-target-editor");
    var selector = ".editor-input[data-editor-name='" + targetEditor + "']";
    var editors = jQuery(selector);
    for (let i = 0; i < editors.length; i++) {
      editors[i].value = jQuery(editors[i]).parent().prev().text();
    }
    jQuery(selector).css("visibility", "hidden");
  })

  jQuery(".content-panel").on("click", ".confirm-btn", function () {
    var targetEditor = jQuery(this).parent(".hidden-btn")
      .prev().attr("data-target-editor");
    var selector = ".editor-input[data-editor-name='" + targetEditor + "']";
    var editors = jQuery(selector);
    var data = {};
    for (let i = 0; i < editors.length; i++) {
      if (editors[i].value != jQuery(editors[i]).parent().prev().text()) {
        var name = editors[i].name;
        data[name] = editors[i].value;
      }
    }
    if (!Object.keys(data).length) {
      alert('没有改动');
      return false
    } else {
      confirmAndUpdate(this, targetEditor, data);
    }
  })
});

function confirmAndUpdate(that, targetEditor, data) {
  jQuery.ajax({
    url: "/admin/ajax_edit/" + targetEditor,
    method: "POST",
    data: data,
    dataType: "json",
    async: false,
    success: function (resp) {
      if (resp.status == true) {
        alert(resp.message);
      } else {
        alert(resp.message);
        return false;
      }
    },
    error: function () {
      alert('网络错误,修改失败');
      return false;
    }
  })
  var targetPanel = jQuery(that).parents(".content-panel");
  targetPanel.load(targetPanel.attr("data-target-url"));
}