var originUrl = window.location.origin;
var _HTML_POPUP_FLAGS = {
  HTML_POPUP_NONE: 0,
  HTML_POPUP_ANCHOR_3D_WINDOW: 1,
  HTML_POPUP_ALLOW_DRAG: 2,
  HTML_POPUP_NO_CAPTION: 4,
  HTML_POPUP_USE_DEFAULT_POS: 8,
  HTML_POPUP_USE_LAST_SIZE: 16,
  HTML_POPUP_ALLOW_RESIZE: 32,
  HTML_POPUP_ADD_SHADOW: 64,
  HTML_POPUP_NO_BORDER: 128,
  HTML_POPUP_SET_FOCUS_TO_RENDER: 256,
  HTML_POPUP_NOT_USE_POINTER: 512,
  HTML_POPUP_ALWAYS_VISIBLE: 1024,
  HTML_POPUP_USE_LAST_POS: 2048,
  HTML_POPUP_USE_TEXT_AS_INNER_HTML: 4096
};

// #################### 方案管理 ####################
// 保存项目
function saveProject() {
  if (SGWorld) {
    showPrompt("项目保存中, 请稍后...");
    setTimeout(function () {
      var vid = skTools.FindFirstObjectID("视野", "");
      if (vid != "") {
        SGWorld.ProjectTree.DeleteItem(vid);
      }
      SGWorld.Creator.CreateLocationHere(SGWorld.ProjectTree.RootID, "视野");
      SGWorld.Project.Save();
      showPrompt("保存成功");
    }, 100);
  } else {
    showPrompt("没有可保存的项目");
  }
}
// 查看纵断面
function viewVerticalSection() {
  if (!SGWorld) {
    return;
  }
  var itemName = skTools.GetSelFeatureName();
  var url = "";
  var mCurID = skTools.GetSelFeatureID();
  var flags = _HTML_POPUP_FLAGS.HTML_POPUP_ALLOW_DRAG | _HTML_POPUP_FLAGS.HTML_POPUP_ALLOW_RESIZE;
  if (itemName.indexOf("基线") > -1) {
    var mCurCaseID = skTools.JudgeProjectNode(mCurID);
    // 待修改
    url = originUrl + "/static/plugins/ZDMDesigner/ZDMChart.html?ObjID=" + mCurID + "&CaseID=" + mCurCaseID + "&Step=50&Caption=纵断面";
  }
  else if (itemName.indexOf("桥") > -1) {
    url = originUrl + "/static/plugins/ZDMDesigner/BridgeChart.html?ObjID=" + mCurID + "&Step=25&Caption=纵断面";
  }
  else if (itemName.indexOf('隧道') > -1) {
    url = originUrl + "/static/plugins/ZDMDesigner/TunnelChart.html?ObjID=" + mCurID + '&Step=25&Caption=纵断面';
  }
  else {
    showPrompt("没有选择可用对象");
    return;
  }
  if (url !== "") {
    var msg = SGWorld.Creator.CreatePopupMessage("纵断面", url, 1, SGWorld.Window.Rect.Height * 2 / 3, SGWorld.Window.Rect.Width - 2, SGWorld.Window.Rect.Height / 3, -1);
    msg.Flags = flags;
    SGWorld.Window.showPopup(msg);
  }
}


// 提取横断面
function extractCrossSection() {
  if (!SGWorld) {
    showPrompt("没有可用项目");
    return;
  }
  if (mCurCaseID != "") {
    showPrompt("数据计算中, 请稍后...");
    var sn = SGWorld.ProjectTree.GetItemName(mCurCaseID);
    var slc, elc, step, range, sampe;
    slc = parseFloat(SGWorld.ProjectTree.GetClientData(mCurCaseID, "StartLC"));
    var t = prompt("请输入起始里程：", slc.toFixed(2));
    if (t == null || t == "") {
      return false;
    }
    slc = parseFloat(t);
    elc = parseFloat(SGWorld.ProjectTree.GetClientData(mCurCaseID, "EndLC"));
    var t = prompt("请输入终止里程：", elc.toFixed(2));
    if (t == null || t == "") {
      return false;
    }
    elc = parseFloat(t);
    var t = prompt("请输入断面间距：", "25");
    if (t == null || t == "") {
      return false;
    }
    step = parseFloat(t);
    var t = prompt("请输入断面左右边幅：", "50");
    if (t == null || t == "") {
      return false;
    }
    range = parseFloat(t);
    var t = prompt("请输入断面采点间距：", "5");
    if (t == null || t == "") {
      return false;
    }
    sampe = parseFloat(t);
    var hdmgrid = dmx.GetHDMArray(slc, elc, step, range, sampe);
    export_array_to_csv(hdmgrid, sn + '横断面.csv');
  }
  else {
    //对当前选择的线要素提取地面线
    showPrompt("没有选择可用对象");
    return
  }
}

// 提取地面线
function extractVerticalSection() {
  if (!SGWorld) {
    showPrompt("没有可用项目");
    return;
  }
  if (mCurCaseID != "") {
    var sn = SGWorld.ProjectTree.GetItemName(mCurCaseID);
    export_array_to_csv(dmx.gGridArray[0], sn + '地面线.csv');
  }
  else {
    showPrompt("没有选择可用对象");
  }
}

function export_array_to_csv(data, filename) {
  var csvData = "";
  for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
    var itm = data_1[_i];
    var line = "";
    for (var _a = 0, itm_1 = itm; _a < itm_1.length; _a++) {
      var val = itm_1[_a];
      line += val + ",";
    }
    csvData += line.replace(/,$/, '\n');
  }
  jQuery.ajax({
    url: "/projects/ajax_upload",
    type: "POST",
    data: { filename: filename, data: csvData },
    dataType: "json",
    success: function (resp) {
      if (window.confirm('获取' + filename + '?')) {
        var url = originUrl + resp.url;
        window.open(url, "_blank");
      }
    },
    error: function () {
      alert('网络错误');
    }
  })
}

// 查看工程数量
function checkProjectNumber() {
  if (SGWorld) {
    showPrompt("未启用");
  }
}

// 生成行政区划表
function genAdministrativeDivisions() {
  if (SGWorld) {
    showPrompt("未启用");
  }
}

// #################### 数据源 ####################
// 加载网络地图
function loadIMap() {
  if (SGWorld) {
    var url = "\\\\192.10.15.200\\FLYProject\\实景中国\\全国基础地理信息数据\\地理环境.fly";
    SGWorld.ProjectTree.LoadFlyLayer(url);
  }
}


// 加载KML/FLY文件
function loadKmlFly() {
  if (true) {
    setTimeout(function () {
      jQuery("<iframe class='iframe-placeholder' style='display: block'></iframe>").insertBefore(".jconfirm-box");
    }, 300);
    jQuery.confirm({
      title: "请选择加载文件",
      content: "<input type='file' style='width:400px;'><p style='margin: 10px 0;'>请将完整路径复制到下方,或直接输入完整路径</p><input type='text' id='loadKmlFlyFile' style='width:400px;' required>",
      type: 'blue',
      buttons: {
        ok: {
          text: "ok",
          btnClass: 'btn-primary',
          keys: ['enter'],
          action: function () {
            var filename = document.querySelector('#loadKmlFlyFile').value;
            if (filename != null && filename != "") {
              SGWorld.Creator.CreateKMLLayer(filename);
              SGWorld.ProjectTree.LoadFlyLayer(filename, "");
            } else {
              return false;
            }
          }
        },
        cancel: function () {
        }
      }
    });
  }
}

// 从服务器加载
function loadFromServer() {
  if (SGWorld) {
    // SGWorld.Command.Execute(1143, 0);
    var url = "http://lidar/SG/admin/telayers.aspx";
    var msg = SGWorld.Creator.CreatePopupMessage("从服务器加载", url, 1, SGWorld.Window.Rect.Height * 1 / 4, SGWorld.Window.Rect.Width - 2, SGWorld.Window.Rect.Height * 3 / 4, -1);
    SGWorld.Window.showPopup(msg);
  }
}

// 导出KML
function exportAs(filetype) {
  if (SGWorld) {
    var mCurID = skTools.GetSelFeatureID();
    if (!SGWorld.ProjectTree.IsGroup(mCurID)) {
      mCurID = SGWorld.ProjectTree.GetNextItem(mCurID, 15);
    }
    if (mCurID) {
      var sn = SGWorld.ProjectTree.GetItemName(mCurID);
      if (filetype == 'kml') {
        var path = SGWorld.ProjectTree.SaveAsKml(sn, mCurID);
      } else if (filetype == 'fly') {
        var path = SGWorld.ProjectTree.SaveAsFly(sn, mCurID);
      }
      alert('已导出到文件: ' + path);
    } else {
      alert('未选择目标');
    }
  }
}


// #################### 动态模拟 ####################
// 横剖面图
function analogCrossSectionMap() {
  if (SGWorld) {
    HDM_Start()
  }
}

// 交通模拟
function analogTraffic() {
  if (SGWorld) {
    simRun();
  }
}

// 飞行鸟瞰
function analogflight() {
  if (SGWorld) {
    simFly();
  }
}
