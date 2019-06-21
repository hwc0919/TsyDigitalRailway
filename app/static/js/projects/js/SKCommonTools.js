var ItemCode = {
    SELECTED: 10,
    CHILD: 11,
    FIRSTVISIBLE: 12,
    NEXT: 13,
    NEXTVISIBLE: 14,
    PARENT: 15,
    PREVIOUS: 16,
    PREVIOUSVISIBLE: 17,
    ROOT: 18
};
var AccuracyLevel = {
    ACCURACY_NORMAL: 0,
    ACCURACY_BEST_FROM_MEMORY: 1,
    ACCURACY_BEST_FROM_MPT: 2,
    ACCURACY_FORCE_BEST_RENDERED: undefined
};
var SKCommonTools = /** @class */ (function () {
    function SKCommonTools(SGWorld) {
        this.SGWorld = SGWorld;
    }
    SKCommonTools.prototype.GetFlyPath = function () {
        var str = this.SGWorld.Project.Name;
        alert(str);
        return str;
    };
    //给定节点向上追索到其项目节点
    SKCommonTools.prototype.JudgeProjectNode = function (id) {
        do {
            try {
                var s = this.SGWorld.ProjectTree.GetClientData(id, "节点类型");
                if (s == "项目节点")
                    return id;
            }
            catch (err) {
                console.log(err);
            }
            id = this.SGWorld.ProjectTree.GetNextItem(id, ItemCode.PARENT);
            var sn = this.SGWorld.ProjectTree.GetItemName(id);
            // alert(sn);
            if (id == this.SGWorld.ProjectTree.RootID)
                return "";
            if (id == "")
                return "";
        } while (true);
    };
    //获取每个点的地形高程
    SKCommonTools.prototype.GetElev = function (xb, yl) {
        return this.SGWorld.Terrain.GetGroundHeightInfo(yl, xb, AccuracyLevel.ACCURACY_FORCE_BEST_RENDERED, false).Position.Altitude;
    };
    SKCommonTools.prototype.CreateColor = function (r, g, b, a) {
        if (a === void 0) { a = 255; }
        return this.SGWorld.Creator.CreateColor(r, g, b, a);
    };
    // 用于自动找到文档打开时第一个方案ID,此方案ID应该赋给mCurCaseID作为全局变量存在
    SKCommonTools.prototype.FindFirstCaseID = function () {
        var mRes = this.GetGroupFeaturesID('');
        var mark = '';
        for (var _i = 0, mRes_1 = mRes; _i < mRes_1.length; _i++) {
            var sid = mRes_1[_i];
            try {
                mark = this.SGWorld.ProjectTree.GetClientData(sid, "节点类型");
            }
            catch (error) {
                console.log(error);
            }
            if (mark === "项目节点") {
                return sid;
            }
        }
        return "";
    };
    // <summary>
    // 递归遍历查找ParentID节点下所有的节点名称为objName的所有ID
    // </summary>
    // <param name="objName"></param>
    // <param name="ParentID"></param>
    // <returns></returns>
    SKCommonTools.prototype.FindObjectID = function (objName, ParentID) {
        var mIDs = [];
        try {
            var ChildID = this.SGWorld.ProjectTree.GetNextItem(ParentID, ItemCode.CHILD);
            while (true) {
                if (!ChildID || ChildID.trim() == "")
                    break;
                if (this.SGWorld.ProjectTree.GetItemName(ChildID) == objName) {
                    mIDs.push(ChildID);
                }
                if (this.SGWorld.ProjectTree.IsGroup(ChildID)) {
                    var mSubIDs = this.FindObjectID(objName, ChildID);
                    if (mSubIDs.length > 0)
                        mIDs.push.apply(mIDs, mSubIDs);
                }
                ChildID = this.SGWorld.ProjectTree.GetNextItem(ChildID, ItemCode.NEXT);
            }
        }
        catch (e) {
            // return mIDs;
            // Nonthing
        }
        return mIDs;
    };
    //返回其中第一个
    SKCommonTools.prototype.FindFirstObjectID = function (objName, ParentID) {
        var s = this.FindObjectID(objName, ParentID);
        if (s.length > 0)
            return s[0];
        return "";
    };
    //递归遍历查找ParentID节点下所有的节点名称含有objName的所有ID
    SKCommonTools.prototype.FindObjectIDByLikeName = function (objName, ParentID) {
        var mIDs = [];
        var ChildID = this.SGWorld.ProjectTree.GetNextItem(ParentID, ItemCode.CHILD);
        while (true) {
            if (!ChildID || ChildID.trim() == "")
                break;
            if (this.SGWorld.ProjectTree.GetItemName(ChildID).Contains(objName)) {
                mIDs.push(ChildID);
            }
            ChildID = this.SGWorld.ProjectTree.GetNextItem(ChildID, ItemCode.NEXT);
        }
        return mIDs;
    };
    // 在ParentGroupId节点下查找GroupName目录，如果没有找到则创建该目录。
    SKCommonTools.prototype.FindAndCreateGroup = function (ParentGroupId, GroupName, isLook) {
        if (isLook === void 0) { isLook = false; }
        var ChildID = this.SGWorld.ProjectTree.GetNextItem(ParentGroupId, ItemCode.CHILD);
        if (!ChildID || ChildID.trim() == "") {
            return isLook ? this.SGWorld.ProjectTree.CreateLockedGroup(GroupName, ParentGroupId) : this.SGWorld.ProjectTree.CreateGroup(GroupName, ParentGroupId);
        }
        if (this.SGWorld.ProjectTree.GetItemName(ChildID) == GroupName) {
            return ChildID;
        }
        while (true) {
            ChildID = this.SGWorld.ProjectTree.GetNextItem(ChildID, ItemCode.NEXT);
            if (!ChildID || ChildID.trim() == "") { // 如果没找到节点则返回string.Empty；
                return isLook ? this.SGWorld.ProjectTree.CreateLockedGroup(GroupName, ParentGroupId) : this.SGWorld.ProjectTree.CreateGroup(GroupName, ParentGroupId);
            }
            if (this.SGWorld.ProjectTree.GetItemName(ChildID) == GroupName) {
                return ChildID;
            }
        }
    };
    // 获取某个目录下的所有节点ID
    SKCommonTools.prototype.GetGroupFeaturesID = function (ParentGroupId) {
        var mRes = [];
        var ChildID = this.SGWorld.ProjectTree.GetNextItem(ParentGroupId, ItemCode.CHILD);
        if (!ChildID || ChildID.trim() == "")
            return mRes;
        mRes.push(ChildID);
        while (true) {
            ChildID = this.SGWorld.ProjectTree.GetNextItem(ChildID, ItemCode.NEXT);
            if (!ChildID || ChildID.trim() == "")
                return mRes;
            mRes.push(ChildID);
        }
    };
    // <summary>
    // 清空Group，但不删除该Group
    // </summary>
    // <param name="GroupId"></param>
    SKCommonTools.prototype.ClearGroup = function (GroupId) {
        var _this = this;
        var ChildID = this.SGWorld.ProjectTree.GetNextItem(GroupId, ItemCode.CHILD);
        if (!ChildID || ChildID.trim())
            return;
        var deleteIDs = [];
        deleteIDs.push(ChildID);
        while (true) {
            ChildID = this.SGWorld.ProjectTree.GetNextItem(ChildID, ItemCode.NEXT);
            if (!ChildID || ChildID.trim())
                break;
            deleteIDs.push(ChildID);
        }
        var i = 0;
        deleteIDs.forEach(function (id) {
            i++;
            _this.SGWorld.ProjectTree.DeleteItem(id);
        });
        //platform.@case.WinCoreMgr.WinCoreMgr.pInfo.AddMsg(i.ToString());
    };
    // 得到当前选择节点的节点名称
    SKCommonTools.prototype.GetSelFeatureName = function () {
        var id = this.SGWorld.ProjectTree.GetNextItem("", ItemCode.SELECTED);
        if (!id || id == "")
            return "";
        return this.SGWorld.ProjectTree.GetItemName(id);
    };
    // 得到当前选择节点的节点对象
    SKCommonTools.prototype.GetSelFeature = function () {
        var id = this.SGWorld.ProjectTree.GetNextItem(this.SGWorld.ProjectTree.RootID, ItemCode.SELECTED);
        if (!id || id == "")
            return null;
        return this.SGWorld.ProjectTree.GetObject(id);
    };
    SKCommonTools.prototype.GetSelFeatureID = function () {
        var id = this.SGWorld.ProjectTree.GetNextItem(this.SGWorld.ProjectTree.RootID, ItemCode.SELECTED);
        return id;
    };
    return SKCommonTools;
}());
