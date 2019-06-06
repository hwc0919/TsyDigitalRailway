/* eslint-disable */
class HDMCrossBox {
  mSGWorld;
  isStart;
  prelc;
  constructor(sgworld) {
    this.mSGWorld = sgworld
    this.isStart = false
    this.prelc = -1
  }

  Start() {
    if (!mileageReady) {
      alert('! mileageReady');
      return;
    }
    alert('ready');
    this.mSGWorld.AttachEvent('OnLButtonDown', this.MSGWorld_OnLButtonDown)
  }

  //  ITerrain3DRectBase70 mBox = null;
  // ShowHDMCross(X, Y) {
  //   alert('1');
  //   console.log('showHDMCross');
  //   let offset = 10.0;
  //   let pt = dmx.GetBLPointByWxy(X, Y);
  //   if (Math.abs(pt[1] - this.prelc) < 0.5) return;
  //   this.prelc = pt[1];
  //   offset = 80;

  //   let lc = pt[1];
  //   let mst = dmx.Get3DPointArray([lc, lc, lc - 100.0, lc - 100.0], [offset, -offset, -offset, offset]);
  //   for (var k = 0; k < 4; k++) mst[3 * k + 2] = pt[0].Altitude - 100;
  //   for (var k = 0; k < 4; k++) {
  //     mst.push(mst[3 * k]);
  //     mst.push(mst[3 * k + 1]);
  //     mst.push(pt[0].Altitude + 100);
  //   }
  //   //mst.push(new Point3DF(mst[k].XB, mst[k].YL, pt.ZH + 100));

  //   let geometry = this.mSGWorld.Creator.GeometryCreator.CreateLineStringGeometry(mst);
  //   this.mSGWorld.Analysis.ShowCrossSectionBox(geometry, false, "#FFFF00FF");
  // }

  MSGWorld_OnLButtonDown(Flags, X, Y) {
    if (!this.isStart) {
      console.log(X, Y);
      ShowHDMCross(X, Y);
      console.log('HDM success')
      this.mSGWorld.AttachEvent('OnFrame', this.MSGWorld_OnFrame)
      this.isStart = true;
    } else {
      alert('isstart');
      this.mSGWorld.DetachEvent('OnFrame', this.MSGWorld_OnFrame)
      this.mSGWorld.DetachEvent('OnLButtonDown', this.MSGWorld_OnLButtonDown)
      this.isStart = false;
      if (confirm("保留提取断面吗？")) {
        this.mSGWorld.Analysis.HideCrossSectionBox();
        // if (mBox != null) this.mSGWorld.ProjectTree.DeleteItem(mBox.ID);
      }
    }
    return true;
  }

  MSGWorld_OnFrame() {
    let pos = this.mSGWorld.Window.GetMouseInfo();
    ShowHDMCross(pos.X, pos.Y);
  }
}


