// init SGWorld
function SGWorldInit() {
  // 创建SGWorld
  try {
    TerraExplorerInformationWindowEx.AttachTo3dWindow(TerraExplorer3DWindowEx);
    SGWorld = TerraExplorer3DWindowEx.CreateInstance("TerraExplorerX.SGWorld701");
    SGWorld.AttachEvent("OnLoadFinished", OnLoadFinished);
  }
  catch (err) {
    alert('您的浏览器不支持ActiveX控件, 请使用IE浏览器重新打开页面.');
    return false;
  }
  // 加载项目
  try {
    var project_url = jQuery("#TerraExplorer3DWindowEx").attr("data-project-url");
    SGWorld.Project.open(project_url);
  }
  catch (err) {
    alert('项目加载失败, 请检查资源是否存在.')
  }
}
// OnLoadFinished
function OnLoadFinished() {
  try {
    dmx = new DMXClass(SGWorld);
    skTools = new SKCommonTools(SGWorld);
    mCurCaseID = skTools.FindFirstCaseID();
    baselineID = skTools.FindFirstObjectID('基线', mCurCaseID);
  }
  catch (err) {
    alert('caseID查询失败');
  }
  try {
    baselineObj = SGWorld.ProjectTree.GetObject(baselineID);
  } catch (err) {
    alert('baselineObj 加载失败');
  }
  if (baselineObj) {
    try {
      dmx.DMX_DrawBySetLC(baselineObj);
      mileageReady = true;
      // setMileageReady(true)  ???
    }
    catch (err) {
      alert("dmx drawbysetlc 加载失败");
    }
  } else {
    mileageReady = false;
    // this.setMileageReady(false) ???
  }
  //定位到默认位置
  let vid = skTools.FindFirstObjectID('视野', "");
  if (vid != "") {
    SGWorld.Navigate.FlyTo(vid, 0);
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
  }
}