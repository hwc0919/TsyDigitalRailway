/* eslint-disable */

var LibPath = "\\\\192.10.15.200\\FLYProject";
var mLinePos = null;
var CircularRouteType = {
    CRT_STOP_AT_THE_END: 0,
    CRT_MOVE_TO_START: 1,
    CRT_JUMP_TO_START: 2
};
var DynamicMotionStyle = {
    MOTION_GROUND_VEHICLE: 0,
    MOTION_AIRPLANE: 1,
    MOTION_HELICOPTER: 2,
    MOTION_HOVER: 3,
    MOTION_MANUAL: 4
};
var AltitudeTypeCode = {
    ATC_TERRAIN_RELATIVE: 0,
    ATC_PIVOT_RELATIVE: 1,
    ATC_ON_TERRAIN: 2,
    ATC_TERRAIN_ABSOLUTE: 3,
    ATC_DEFAULT: 999
};
var DynamicObjectType = {
    DYNAMIC_3D_MODEL: 0,
    DYNAMIC_TEXT_LABEL: 1,
    DYNAMIC_IMAGE_LABEL: 2,
    DYNAMIC_VIRTUAL: 3
};
//= "模拟列车"= @"D:\铁路数据中心\Model\rail.dae"
function AttachDynamicObject(lineID, sname, objfile, sc, altitude) {
    var altitude = arguments[4] ? arguments[4] : 0;
    if (sc === void 0) { sc = 1.0; }
    try {
        var sNode = skTools.FindAndCreateGroup("", "展示批注");
        var waypoints = dmx.GetWaypoints(altitude);
        var gPolyObj = SGWorld.Creator.CreateDynamicObject(waypoints, DynamicMotionStyle.MOTION_MANUAL, DynamicObjectType.DYNAMIC_3D_MODEL, objfile, sc, AltitudeTypeCode.ATC_TERRAIN_ABSOLUTE, sNode, sname);
        gPolyObj.ShowTrack = false;
        gPolyObj.CircularRoute = CircularRouteType.CRT_JUMP_TO_START;
        gPolyObj.SaveInFlyFile = true;
        return gPolyObj;
    }
    catch (ex) {
        alert(ex.Message + ex.StackTrace);
        return null;
    }
}

function simRun() {
    if (mCurCaseID == "") {
        showPrompt("没有选择可用线路");
        return;
    }
    var routetype = SGWorld.ProjectTree.GetClientData(mCurCaseID, "RouteType");
    var str = "_" + SGWorld.ProjectTree.GetItemName(mCurCaseID) + "_" + Date.now().toString();

    var radNext = function (max) { return Math.round(Math.random() * 100) % max; };
    var c = 0;
    var carnum = 15;
    var LineID = skTools.FindFirstObjectID("基线", mCurCaseID);
    if (LineID == "")
        return;
    switch (routetype) {
        case "单线铁路":
        case "单线地铁":
        case "双线铁路":
        case "双线地铁":
            AttachDynamicObject(LineID, "列车漫游" + str, LibPath + "\\Common\\rail.xpl2");
            break;
        case "河道":
            AttachDynamicObject(LineID, "游船" + str, LibPath + "\\Common\\boat.xpl2");
            break;
        case "单向两车道":
        case "单向三车道":
            c = radNext(carnum);
            AttachDynamicObject(LineID, "机动" + str, LibPath + "\\Common\\car" + String(c) + ".xpl2");
            break;
        case "单向三车道":
        case "双向八车道":
        case "双向六车道":
        case "双向四车道":
            showPrompt("No Demo");
            break;
        case "云轨":
            AttachDynamicObject(LineID, "云轨机车" + str, LibPath + "\\Common\\BYDRail.xpl2");
            break;
    }
}


function simFly() {
    if (mCurCaseID == "") {
        showPrompt("没有选择可用线路");
        return;
    }
    var LineID = skTools.FindFirstObjectID("基线", mCurCaseID);
    var str = "_" + SGWorld.ProjectTree.GetItemName(mCurCaseID) + "_" + Date.now().toString();
    var mplane = AttachDynamicObject(LineID, "飞机巡航" + str, LibPath + "\\Common\\Boeing787.xpl2", 5.0, 1000);
    var sNode = skTools.FindAndCreateGroup("", "展示批注");
    var mV = SGWorld.Creator.CreateVideoOnTerrain(LibPath + "\\Common\\video\\LiDARScan.wmv", SGWorld.Creator.CreatePosition(0, 0, 500), sNode, "扫描区域" + str);
    mV.ShowProjectionLines = true;
    mV.VideoOpacity = 0.5;
    mV.UseTelemetry = false;
    mV.Position.Pitch = -90;
    mV.Attachment.AttachTo(mplane.ID, 0, 0, 0, 0, 0, 0);
    mV.PlayVideo();
}
