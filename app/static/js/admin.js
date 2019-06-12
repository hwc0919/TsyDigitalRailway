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
    update(this);
  });

  // Role增加按钮
  var appendHTML = "<tr><td><input placeholder='rid'></td>" + "<td><input placeholder='名称'></td>" +
    "<td><input placeholder='描述'></td>" + "<td><input placeholder='权限'></td>" + "<td></td>" + "<td></td>" +
    "<td><button class='btn btn-primary role-confirm-append'>提交</button></td></tr>";

  jQuery(".content-panel").on("click", ".role-append-btn", function () {
    var appendTarget = jQuery(this).siblings("table").find("tbody");
    appendTarget.append(appendHTML);
  })

  // Role提交增加
  jQuery(".content-panel").on("click", ".role-confirm-append", function () {
    var inputs = jQuery(this).parents("tr").find("input");
    var data = {
      rid: inputs[0].value,
      name: inputs[1].value,
      description: inputs[2].value,
      permission: inputs[3].value
    };
    confirmAndUpdate(this, "append-role", data);
  })

  // Role删除按钮
  jQuery(".content-panel").on("click", ".role-delete-btn", function () {
    var rid = jQuery(this).parents("tr").attr("data-role-id");
    var data = { rid: rid };
    confirmAndUpdate(this, "delete-role", data);
  })

  // Project 检查改动 按钮
  jQuery(".content-panel").on("click", ".check-file-btn", function () {
    jQuery.ajax({
      url: "/admin/ajax_update/projects",
      type: "GET",
      dataType: "json",
      success: function (resp) {
        alert(resp.message);
        if (resp.status == true) {
          update(this);
        }
      },
      error: function (resp) {
        alert('网络错误, 操作失败');
      }
    })
  })

  // Project 更新描述 按钮
  jQuery(".content-panel").on("click", ".update-description-btn", function () {
    jQuery.ajax({
      url: "/admin/ajax_update/project_description",
      type: "GET",
      dataType: "json",
      success: function (resp) {
        alert(resp.message);
        if (resp.status == true) {
          update(this);
        }
      },
      error: function (resp) {
        alert('网络错误, 操作失败');
      }
    })
  })

  // Project 删除 按钮
  jQuery(".content-panel").on("click", ".project-delete-btn", function () {
    if (confirm('确认删除?')) {
      var pid = jQuery(this).parents("tr").attr("data-project-id");
      var data = { pid: pid };
      confirmAndUpdate(this, "delete-project", data);
    }
  })

  // Permission 修改, 确认, 取消按钮
  jQuery(".content-panel").on("click", ".editor-btn", function () {
    jQuery(this).hide().siblings(".hidden-btn").show();
    var targetEditor = jQuery(this).attr("data-target-editor");
    var selector = ".editor-input[data-editor-name='" + targetEditor + "']";
    jQuery(selector).css("visibility", "visible");
    jQuery(this).parents("table").find(".delete-btn").hide();
  })

  // 取消 按钮
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

  // 确认 按钮
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

// 确认改动并刷新页面
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
  update(that);
}

// 更新 按钮
function update(that) {
  var targetPanel = jQuery(that).parents(".content-panel");
  targetPanel.load(targetPanel.attr("data-target-url"));
}