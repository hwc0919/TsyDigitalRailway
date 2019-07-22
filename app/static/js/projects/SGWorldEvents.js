// init SGWorld
function SGWorldInit() {
  if (!window.ActiveXObject && !("ActiveXObject" in window)) {
    alert("请使用IE浏览器");
    return false;
  }
  // 创建SGWorld
  try {
    TerraExplorerInformationWindowEx.AttachTo3dWindow(TerraExplorer3DWindowEx);
    SGWorld = TerraExplorer3DWindowEx.CreateInstance("TerraExplorerX.SGWorld701");
    SGWorld.AttachEvent("OnLoadFinished", OnLoadFinished);
  }
  catch (err) {
    alert('您的计算机尚未安装TerraExplore,请前往首页根据提示安装。');
    return false;
  }

  // 激活权限
  var alert_bak = window.alert;
  window.alert = function () {
    return false;
  }
  try {
    var mCmd = new ActiveXObject("AxRGUDun.WebLogin");
    mCmd.ConnectToRIMServer();
  } catch (err) {
    showPrompt("局域网权限控件未安装或工作异常");
  } finally {
    window.alert = alert_bak;
  }
  // 加载项目
  try {
    var project_url = jQuery("#TerraExplorer3DWindowEx").attr("data-project-url");
    // alert(project_url);
    SGWorld.Project.open(project_url);
  }
  catch (err) {
    alert("项目资源不存在或未安装局域网权限控件, 无法正常打开项目。")
    return false;
  }
}
// OnLoadFinished
function OnLoadFinished() {
  dmx = new DMXClass(SGWorld);
  skTools = new SKCommonTools(SGWorld);
  mCurCaseID = "";
  baselineID = "";
  try {
    mCurCaseID = skTools.FindFirstCaseID();
    baselineID = skTools.FindFirstObjectID("基线", mCurCaseID);
  }
  catch (err) {
    showPrompt("caseID查询失败");
  }
  try {
    baselineObj = SGWorld.ProjectTree.GetObject(baselineID);
  } catch (err) {
    showPrompt("此项目不含线路");
    baselineObj = null;
  }
  if (baselineObj) {
    try {
      dmx.DMX_DrawBySetLC(baselineObj);
      mileageReady = true;
    }
    catch (err) {
      showPrompt("此项目不含线路, 无地面线");
      mileageReady = false;
    }
  } else {
    mileageReady = false;
  }
  //定位到默认位置
  let vid = skTools.FindFirstObjectID('视野', "");
  if (vid != "") {
    SGWorld.Navigate.FlyTo(vid, 0);
  }
  if (!mileageReady) {
    jQuery("li[data-active='mileage']").addClass("li-disable");
  } else {
    jQuery("li[data-active='mileage']").removeClass("li-disable");
  }
  SGWorld.AttachEvent('OnLButtonClicked', onLButtonClicked);
  SGWorld.AttachEvent('OnProjectTreeAction', onProjectTreeAction);
}


function onLButtonClicked(Flags, X, Y) {
  if (Flags != 4) {
    return false;
  }
  let mpos = SGWorld.Window.GetMouseInfo();
  let wp = SGWorld.Window.PixelToWorld(mpos.X, mpos.Y).Position.ToAbsolute();
  let sResult = "地理坐标: " + wp.X.toFixed(6) + "," +
    wp.Y.toFixed(6) + "," + wp.Altitude.toFixed(2);
  if (!mileageReady) {
    SGWorld.Window.ShowMessageBarText(sResult, 1, 20000);
    return false;
  }

  if (mCurCaseID === "") {
    sResult += "[无线位方案关联]请在结构树上选择节点关联线位查看里程";
    SGWorld.Window.ShowMessageBarText(sResult, 1, 20000);
    return false;
  }

  let sn = SGWorld.ProjectTree.GetItemName(mCurCaseID);
  let len = dmx.endlc - dmx.firstlc;
  sResult += "  当前方案：[" + sn + "]   线路长度：" + len.toFixed(2);
  let _blpoint = dmx.GetBLPointByWxy(mpos.X, mpos.Y);
  let pos = _blpoint[0];
  let lc = _blpoint[1];
  let offset = _blpoint[2];
  let th = dmx.DMX_getTrackH(lc);
  if (!th) {
    SGWorld.Window.ShowMessageBarText(sResult, 1, 5000);
    return false;
  }
  if (offset >= 0) {
    sResult += "位置：" + lc.toFixed(2) + "; 轨面高：" + th.toFixed(2) +
      "; 净高：" + (th - wp.Altitude).toFixed(2) + "; 偏离距离:(左)" + offset.toFixed(2);
  } else {
    offset = Math.abs(offset);
    sResult += "位置：" + lc.toFixed(2) + "; 轨面高：" + th.toFixed(2) +
      "; 净高：" + (th - wp.Altitude).toFixed(2) + "; 偏离距离:(右)" + offset.toFixed(2);
  }
  SGWorld.Window.ShowMessageBarText(sResult, 1, 5000);
  return false;
}

function onProjectTreeAction(id, action) {
  if (action.Code === 21) {
    let mcid = skTools.JudgeProjectNode(id);
    if (mCurCaseID == mcid) {
      return;
    }
    mCurCaseID = mcid;
    if (mCurCaseID == "") {
      //选择方案无效，应禁用部分菜单
      mileageReady = false;
      jQuery("li[data-active='mileage']").addClass("li-disable");
      baselineID = skTools.FindFirstObjectID("基线", mCurCaseID);
      return;
    }

    //有效方案
    baselineID = skTools.FindFirstObjectID("基线", mCurCaseID);

    let baselineobj = SGWorld.ProjectTree.GetObject(baselineID);

    if (baselineobj) {
      dmx.DMX_DrawBySetLC(baselineobj); //建立里程系
      mileageReady = true;
    }

    if (!mileageReady) {
      jQuery("li[data-active='mileage']").addClass("li-disable");
    } else {
      jQuery("li[data-active='mileage']").removeClass("li-disable");
    }
    showPrompt("切换完成!")
  }
}