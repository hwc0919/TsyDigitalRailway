var HDM_isStart = false;
var HDM_prelc = -1;
function HDM_Start() {
    if (!mileageReady)
        return;
    SGWorld.AttachEvent('OnLButtonDown', MSGWorld_OnLButtonDown);
}
//  ITerrain3DRectBase70 mBox = null;
function ShowHDMCross(X, Y) {
    var offset = 10.0;
    var pt = dmx.GetBLPointByWxy(X, Y);
    if (Math.abs(pt[1] - HDM_prelc) < 0.5)
        return;
    HDM_prelc = pt[1];
    offset = 80;
    var lc = pt[1];
    var mst = dmx.Get3DPointArray([lc, lc, lc - 100.0, lc - 100.0], [offset, -offset, -offset, offset]);
    for (var k = 0; k < 4; k++)
        mst[3 * k + 2] = pt[0].Altitude - 100;
    for (var k = 0; k < 4; k++) {
        mst.push(mst[3 * k]);
        mst.push(mst[3 * k + 1]);
        mst.push(pt[0].Altitude + 100);
    }
    //mst.push(new Point3DF(mst[k].XB, mst[k].YL, pt.ZH + 100));
    var geometry = SGWorld.Creator.GeometryCreator.CreateLineStringGeometry(mst);
    SGWorld.Analysis.ShowCrossSectionBox(geometry, false, "#FFFF00FF");
}
function MSGWorld_OnLButtonDown(Flags, X, Y) {
    if (!HDM_isStart) {
        ShowHDMCross(X, Y);
        SGWorld.AttachEvent('OnFrame', MSGWorld_OnFrame);
        HDM_isStart = true;
    }
    else {
        SGWorld.DetachEvent('OnFrame', MSGWorld_OnFrame);
        SGWorld.DetachEvent('OnLButtonDown', MSGWorld_OnLButtonDown);
        HDM_isStart = false;
        if (confirm("保留提取断面吗？")) {
            SGWorld.Analysis.HideCrossSectionBox();
            // if (mBox != null) SGWorld.ProjectTree.DeleteItem(mBox.ID);
        }
    }
    return true;
}
function MSGWorld_OnFrame() {
    var pos = SGWorld.Window.GetMouseInfo();
    ShowHDMCross(pos.X, pos.Y);
}
