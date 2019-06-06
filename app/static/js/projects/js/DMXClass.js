// 地面线类，地面线最终得到  gGridArray[0]  轨面线，轨面线最终得到  gGridArray[1]
var DMXClass = /** @class */ (function () {
    function DMXClass(sgworld) {
        this.SGWorld = sgworld;
        this.gMinAltitude = 0; // 确定Y轴原坐标
        // this.mSKTools = new SKCommonTools(sgworld)
        this.gPositionsArray = []; // 地面线上点的位置
        this.gStep = 50; // 取点间距
        // 每条线上点的网格值(lc,h)
        // gGridArray[0]存放的就是地面线点[lc,eh]，
        // gGridArray[1]存放的轨面线点，
        // gGridArray[2]存放是坡度线点，全是（里程，高程）点对元素,因此要输出地面线，只需要将gGridArray[0]输出成cvs格式即可。
        this.gGridArray = [];
        this.firstlc = null;
        this.endlc = null;
        this.isFollow = false;
        // this.vuecmp = vuecmp
    }
    // 通过基线对象所关联的每个顶点的里程属性来初始化gGridArray[0],好处是每个顶点的里程与工程上的里程一致。
    DMXClass.prototype.DMX_DrawBySetLC = function (obj) {
        var lastCoord;
        var currCoord;
        var SegmentLength;
        var tmpstep;
        var lc0, lc1, lcstep;
        var polylineGeometry = obj.Geometry;
        this.gPositionsArray = [];
        this.gGridArray[0] = []; //gGridArray[0][1][0],gGridArray[0][1][1]
        this.gGridArray[1] = [];
        this.gMinAltitude = 999999999;
        lc0 = parseFloat(obj.ClientData('LC0'));
        lastCoord = this.SGWorld.Creator.CreatePosition(polylineGeometry.Points.Item(0).X, polylineGeometry.Points.Item(0).Y, 0, 3);
        this.AddDMXPoint(lastCoord, lc0, polylineGeometry.Points.Item(0).Z);
        for (var i = 1; i < polylineGeometry.Points.count; i++) {
            currCoord = this.SGWorld.Creator.CreatePosition(polylineGeometry.Points.Item(i).X, polylineGeometry.Points.Item(i).Y, 0, 3);
            lc1 = parseFloat(obj.ClientData('LC' + i)); // 获取每个顶点的里程值
            lastCoord.yaw = lastCoord.AimTo(currCoord).yaw;
            SegmentLength = lastCoord.DistanceTo(currCoord);
            var count = Math.ceil(SegmentLength / this.gStep);
            tmpstep = SegmentLength / count;
            lcstep = (lc1 - lc0) / count;
            for (var k = 1; k < count; k++) {
                lc0 += lcstep;
                lastCoord = lastCoord.MoveToward(currCoord, tmpstep);
                this.AddDMXPoint(lastCoord, lc0, -1);
            }
            this.AddDMXPoint(currCoord, lc1, polylineGeometry.Points.Item(i).Z);
            lastCoord = currCoord.copy();
            lc0 = lc1;
        }
        this.endlc = lc1;
        return true;
    };
    // 通过基线对象顶点距离自动计算里程来初始化this.gGridArray[0],好处对所有线都适用。
    DMXClass.prototype.DMX_DrawByDist = function (polylineGeometry) {
        var lastCoord;
        var currCoord;
        var SegmentLength;
        var lc0, lc1, lcstep;
        this.gPositionsArray = [];
        this.gGridArray[0] = [];
        this.gGridArray[1] = [];
        this.gMinAltitude = 999999999;
        lastCoord = this.SGWorld.Creator.CreatePosition(polylineGeometry.Points.Item(0).X, polylineGeometry.Points.Item(0).Y, 0, 3);
        lc0 = this.firstlc;
        this.AddDMXPoint(lastCoord, lc0, polylineGeometry.Points.Item(0).Z);
        for (var i = 1; i < polylineGeometry.Points.count; i++) {
            currCoord = this.SGWorld.Creator.CreatePosition(polylineGeometry.Points.Item(i).X, polylineGeometry.Points.Item(i).Y, 0, 3);
            lastCoord.yaw = lastCoord.AimTo(currCoord).yaw;
            SegmentLength = lastCoord.DistanceTo(currCoord); // may calc with Z value
            lc1 = lc0 + SegmentLength;
            var count = Math.ceil(SegmentLength / this.gStep);
            lcstep = (lc1 - lc0) / count;
            for (var k = 1; k < count; k++) {
                lc0 += lcstep;
                lastCoord = lastCoord.MoveToward(currCoord, lcstep);
                this.AddDMXPoint(lastCoord, lc0, -1);
            }
            this.AddDMXPoint(currCoord, lc1, polylineGeometry.Points.Item(i).Z);
            lastCoord = currCoord.copy();
            lc0 = lc1;
        }
        return true;
    };
    // -------------
    // AddDMXPoint  0
    DMXClass.prototype.AddDMXPoint = function (pos, lc, th) {
        var position1 = pos.ToAbsolute(0);
        var Altitude = this.SGWorld.Terrain.GetGroundHeightInfo(position1.X, position1.Y, 2, true).Position.Altitude;
        position1.Altitude = Altitude;
        if (Altitude < this.gMinAltitude)
            this.gMinAltitude = Altitude;
        this.gPositionsArray.push(position1);
        this.gGridArray[0].push([lc, Altitude]);
        if (th > 0)
            this.gGridArray[1].push([lc, th]);
    };
    DMXClass.prototype.DMX_GetGeolayer = function () {
        var len = this.gGridArray[0].length;
        var th, lc;
        this.gGridArray[3] = [];
        for (var i = 0; i < len; i++) {
            lc = this.gGridArray[0][i][0];
            th = this.gGridArray[0][i][1] - 10 - 3 * Math.random();
            this.gGridArray[3][i] = [lc, th];
        }
        this.gGridArray[4] = [];
        for (var i = 0; i < len; i++) {
            lc = this.gGridArray[0][i][0];
            th = this.gGridArray[3][i][1] - 20 - 5 * Math.random();
            this.gGridArray[4][i] = [lc, th];
        }
        this.gGridArray[5] = [];
        for (var i = 0; i < len; i++) {
            lc = this.gGridArray[0][i][0];
            th = this.gGridArray[4][i][1] - 40 - 8 * Math.random();
            this.gGridArray[5][i] = [lc, th];
        }
        this.gGridArray[6] = [];
        for (var i = 0; i < len; i++) {
            lc = this.gGridArray[0][i][0];
            th = this.gGridArray[5][i][1] - 80 - 15 * Math.random();
            this.gGridArray[6][i] = [lc, th];
        }
    };
    // 获取任何里程的地面高程
    DMXClass.prototype.DMX_getlcElev = function (lc) {
        var len = this.gGridArray[0].length;
        for (var i = 1; i < len; i++) {
            if (lc >= this.gGridArray[0][i - 1][0] && lc <= this.gGridArray[0][i][0]) {
                return this.gGridArray[0][i - 1][1] + (this.gGridArray[0][i][1] - this.gGridArray[0][i - 1][1]) * (lc - this.gGridArray[0][i - 1][0]) / (this.gGridArray[0][i][0] - this.gGridArray[0][i - 1][0]);
            }
        }
    };
    // 获取任何里程的轨面高程
    DMXClass.prototype.DMX_getTrackH = function (lc) {
        var len = this.gGridArray[1].length;
        for (var i = 1; i < len; i++) {
            if (lc >= this.gGridArray[1][i - 1][0] && lc <= this.gGridArray[1][i][0]) {
                return this.gGridArray[1][i - 1][1] + (this.gGridArray[1][i][1] - this.gGridArray[1][i - 1][1]) * (lc - this.gGridArray[1][i - 1][0]) / (this.gGridArray[1][i][0] - this.gGridArray[1][i - 1][0]);
            }
        }
    };
    // 跳转到任意里程
    DMXClass.prototype.DMX_JumpToLC = function (lc) {
        // alert(lc)
        if (!this.isFollow)
            return;
        if (lc < this.firstlc)
            return;
        if (lc > this.endlc)
            return;
        var len = this.gGridArray[0].length;
        var x, y, h;
        var pos;
        for (var i = 1; i <= len; i++) {
            if (lc >= this.gGridArray[0][i - 1][0] && lc <= this.gGridArray[0][i][0]) {
                h = this.gGridArray[0][i - 1][1] + (this.gGridArray[0][i][1] - this.gGridArray[0][i - 1][1]) * (lc - this.gGridArray[0][i - 1][0]) / (this.gGridArray[0][i][0] - this.gGridArray[0][i - 1][0]);
                x = this.gPositionsArray[i - 1].X + (this.gPositionsArray[i].X - this.gPositionsArray[i - 1].X) * (lc - this.gGridArray[0][i - 1][0]) / (this.gGridArray[0][i][0] - this.gGridArray[0][i - 1][0]);
                y = this.gPositionsArray[i - 1].Y + (this.gPositionsArray[i].Y - this.gPositionsArray[i - 1].Y) * (lc - this.gGridArray[0][i - 1][0]) / (this.gGridArray[0][i][0] - this.gGridArray[0][i - 1][0]);
                pos = this.SGWorld.Creator.CreatePosition(x, y, h + 100, 3);
                pos.pitch = -90;
                this.SGWorld.Navigate.JumpTo(pos);
                return;
            }
        }
    };
    // 获取任单里程的坐标
    DMXClass.prototype.GetPosByLc = function (lc) {
        if (lc < this.firstlc)
            return null;
        if (lc > this.endlc)
            return null;
        var len = this.gGridArray[0].length;
        var x, y, h;
        var pos;
        for (var i = 1; i <= len; i++) {
            if (lc >= this.gGridArray[0][i - 1][0] && lc <= this.gGridArray[0][i][0]) {
                h = this.gGridArray[0][i - 1][1] + (this.gGridArray[0][i][1] - this.gGridArray[0][i - 1][1]) * (lc - this.gGridArray[0][i - 1][0]) / (this.gGridArray[0][i][0] - this.gGridArray[0][i - 1][0]);
                x = this.gPositionsArray[i - 1].X + (this.gPositionsArray[i].X - this.gPositionsArray[i - 1].X) * (lc - this.gGridArray[0][i - 1][0]) / (this.gGridArray[0][i][0] - this.gGridArray[0][i - 1][0]);
                y = this.gPositionsArray[i - 1].Y + (this.gPositionsArray[i].Y - this.gPositionsArray[i - 1].Y) * (lc - this.gGridArray[0][i - 1][0]) / (this.gGridArray[0][i][0] - this.gGridArray[0][i - 1][0]);
                pos = this.SGWorld.Creator.CreatePosition(x, y, h, 3);
                return pos;
            }
        }
        return null;
    };
    // -------------
    // 跳转至任意给定地面线点索引的点位置
    DMXClass.prototype.DMX_JumpToPoint = function (Point) {
        var nextPoint;
        var nextSign;
        if (Point >= this.gPositionsArray.length) {
            nextPoint = this.gPositionsArray[Point - 1].Copy();
            nextSign = 1;
        }
        else {
            nextPoint = this.gPositionsArray[Point + 1].Copy();
            nextSign = -1;
        }
        var jumpPos = this.gPositionsArray[Point].Copy();
        var tmpPos = this.gPositionsArray[Point].Copy();
        jumpPos.Distance = 250;
        jumpPos.Pitch = -60;
        jumpPos.Yaw = tmpPos.AimTo(nextPoint).Yaw + 90 * nextSign;
        this.SGWorld.Navigate.JumpTo(jumpPos);
    };
    // 里程系与坐标系正反算两个核心的函数实现
    // 根据线路里程计算返回坐标点与轨面高,有方位角
    DMXClass.prototype.GetBLPoint = function (lc) {
        if (lc < this.firstlc)
            return null;
        if (lc > this.endlc)
            return null;
        var len = this.gGridArray[0].length;
        var x, y, h;
        var pos;
        for (var i = 1; i <= len; i++) {
            if (lc >= this.gGridArray[0][i - 1][0] && lc <= this.gGridArray[0][i][0]) {
                h = this.gGridArray[1][i - 1][1] + (this.gGridArray[1][i][1] - this.gGridArray[1][i - 1][1]) * (lc - this.gGridArray[1][i - 1][0]) / (this.gGridArray[1][i][0] - this.gGridArray[1][i - 1][0]);
                x = this.gPositionsArray[i - 1].X + (this.gPositionsArray[i].X - this.gPositionsArray[i - 1].X) * (lc - this.gGridArray[0][i - 1][0]) / (this.gGridArray[0][i][0] - this.gGridArray[0][i - 1][0]);
                y = this.gPositionsArray[i - 1].Y + (this.gPositionsArray[i].Y - this.gPositionsArray[i - 1].Y) * (lc - this.gGridArray[0][i - 1][0]) / (this.gGridArray[0][i][0] - this.gGridArray[0][i - 1][0]);
                pos = this.SGWorld.Creator.CreatePosition(x, y, h, 3);
                pos.yaw = this.gPositionsArray[i - 1].AimTo(this.gPositionsArray[i]).yaw;
                return pos;
            }
        }
        return null;
    };
    // 将一个点投影到线位上返回里程【里程，左右距】
    DMXClass.prototype.projectonline = function (pos) {
        var len = this.gPositionsArray.length;
        var dis;
        var markdis = 9e10;
        var markk = 0;
        for (var i = 1; i < len; i++) {
            dis = this.gPositionsArray[i].DistanceTo(pos);
            if (dis < markdis) {
                markdis = dis;
                markk = i;
            } // else break // 大半径线路适用
        }
        var pos1, pos2; // 找出两最临近点
        if (this.gPositionsArray[markk - 1].DistanceTo(pos) < this.gPositionsArray[markk + 1].DistanceTo(pos)) {
            pos1 = this.gPositionsArray[markk - 1];
            pos2 = this.gPositionsArray[markk];
            markk = markk - 1;
        }
        else {
            pos1 = this.gPositionsArray[markk];
            pos2 = this.gPositionsArray[markk + 1];
        }
        pos1.yaw = pos1.AimTo(pos2).yaw;
        pos.yaw = pos1.AimTo(pos).yaw;
        var angle = pos1.yaw - pos.yaw;
        angle = angle * Math.PI / 180.0;
        dis = pos1.DistanceTo(pos);
        // 返回  [里程，左右距]
        return [this.gGridArray[0][markk][0] + dis * Math.cos(angle), dis * Math.sin(angle)];
    };
    // 下面是拓展函数
    //提取横断面
    DMXClass.prototype.GetHDMArray = function (fromlc, elc, step, range, sample) {
        var hdmgrid = [];
        var off = -range;
        //标题行
        var hdm = [];
        hdm.push("里程\左右距");
        while (off < range) {
            hdm.push(off.toFixed(1));
            off += sample;
        }
        hdmgrid.push(hdm);
        var lc = fromlc;
        var pos;
        var eh;
        while (lc < elc) {
            off = -range;
            hdm = [];
            hdm.push(lc.toFixed(2));
            while (off < range) {
                pos = this.GetBLPointByLc(lc, off);
                eh = this.SGWorld.Terrain.GetGroundHeightInfo(pos.X, pos.Y, 2, true).Position.Altitude;
                hdm.push(eh.toFixed(2));
                off += sample;
            }
            hdmgrid.push(hdm);
            lc += step;
        }
        return hdmgrid;
    };
    //Get3DPointArray()
    DMXClass.prototype.Get3DPointArray = function (lc, offset) {
        if (lc.length != offset.length)
            return null;
        var point3dflist = [];
        for (var i = 0; i < lc.length; i++) {
            var pos = this.GetBLPointByLc(lc[i], offset[i]);
            point3dflist.push(pos.x);
            point3dflist.push(pos.y);
            point3dflist.push(pos.Altitude);
        }
        return point3dflist;
    };
    // 根据线路里程、左右距计算返回坐标点与轨面高
    DMXClass.prototype.GetBLPointByLc = function (lc, offset) {
        if (offset === void 0) { offset = 0; }
        var pos = this.GetBLPoint(lc);
        if (pos == null)
            return null;
        pos.yaw = +90; // 旋转90度
        return pos.move(offset, 0, 0); // 要测试，如果左右侧反了，则pos.move(-offset,0,0)
    };
    // wx,wy为屏幕窗口坐标
    DMXClass.prototype.GetBLPointByWxy = function (wx, wy) {
        // IWorldPointInfo70 mloc = StaticCommon.mSGWorld.Window.PixelToWorld(wx, wy, WorldPointType.WPT_TERRAIN)
        var mloc = this.SGWorld.Window.PixelToWorld(wx, wy, 0);
        var lcoff = this.projectonline(mloc.Position);
        return [this.GetBLPoint(lcoff[0]), lcoff[0], lcoff[1]];
    };
    return DMXClass;
}());
