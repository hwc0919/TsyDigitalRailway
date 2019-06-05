var gBPDIDs = [];
var bpdGroupID = "";
var CaseID = "";  //控制参数尽量统一放在CaseID层面
var curBPDindex = -1;
var indragmode = false;


function OnFollowCheck() {
    if (this.checked == true) { isFollow = true; alert('True'); } else { isFollow = false; alert('false'); }
}

//------------
// StartQuery
function StartQuery() {
    try {


        objectID = GetParamValue("ObjID", "0");
        gStep = 50;
        bpdGroupID = GetParamValue("BPDGroupID", "0");
        CaseID = GetParamValue("CaseID", "0");

        var obj = SGWorld.ProjectTree.GetObject(objectID);



        firstlc = parseFloat(SGWorld.ProjectTree.GetClientData(CaseID, "StartLC"));
        endlc = parseFloat(SGWorld.ProjectTree.GetClientData(CaseID, "EndLC"));

        SGWorld.Window.SetInputMode(1, abspath() + "/hourglass.cur", true);
        DMX_DrawBySetLC(obj);
        DrawPDX();
        DrawGraph();
        SGWorld.ProjectTree.SetClientData(CaseID, "BPDChanged", "FALSE")
        SGWorld.ProjectTree.SetClientData(CaseID, "TrackLineChangedForWeb", "FALSE")

        $("#waitDiv").hide();
        $("#mainTbl").css('display', 'inline');
        SGWorld.Window.SetInputMode(0);

        setTimeout("SelfRefresh();", 500);
    }
    catch (e) { alert(e); }
}

function SelfRefresh() {
    var flag = false;
    if (SGWorld.ProjectTree.GetClientData(CaseID, "BPDChanged") == "TRUE") {
        DrawPDX();
        flag = true;
        SGWorld.ProjectTree.SetClientData(CaseID, "BPDChanged", "FALSE")
    }
    if (SGWorld.ProjectTree.GetClientData(CaseID, "TrackLineChangedForWeb") == "TRUE") {
        var obj = SGWorld.ProjectTree.GetObject(objectID);
        var geometry = obj.Geometry;
        DMX_DrawBySetLC(geometry, obj);
        flag = true;
        SGWorld.ProjectTree.SetClientData(CaseID, "TrackLineChangedForWeb", "FALSE")
    }
    if (flag) ReDrawGraph();
    setTimeout("SelfRefresh();", 500);
}

function ReDrawGraph(ispan) {
    var data = [];
    data.push({ data: gGridArray[0], label: "地面线", lines: { show: true, fill: true, width: 1, fillColor: { colors: [{ opacity: 0.7 }, { opacity: 0.1 }] } }, color: '#00ff00', threshold: { below: gMinAltitude + 50, color: "rgb(200, 20, 30)" } });
    data.push({ data: gGridArray[1], label: "轨面线", lines: { show: true, fill: false }, points: { show: false }, color: '#ff0000' });
    data.push({ data: gGridArray[2], label: "坡度线", lines: { show: true, fill: false }, points: { symbol: "triangle", fillColor: "#0062FF", show: true }, color: '#0000ff', highlightColor: '#ff0000' });

    if (gPlot != null) {
        gPlot.setData(data);
        //gPlot.getOptions()['pan']['interactive'] = ispan;
        gPlot.draw();
    }
}

//------------
//  DrawGraph
function DrawGraph() {


    var data = [];
    data.push({ data: gGridArray[0], label: "地面线", lines: { show: true, fill: true, width: 1, fillColor: { colors: [{ opacity: 0.7 }, { opacity: 0.1 }] } }, color: '#00ff00', threshold: { below: gMinAltitude + 50, color: "rgb(200, 20, 30)" } });
    data.push({ data: gGridArray[1], label: "轨面线", lines: { show: true, fill: false }, points: { show: false }, color: '#ff0000' });
    data.push({ data: gGridArray[2], label: "坡度线", lines: { show: true, fill: false }, points: { symbol: "triangle", fillColor: "#0062FF", show: true }, color: '#0000ff', highlightColor: '#ff0000' });

    gPlot = $.plot("#chartdiv", data,
        {
            xaxis: { zoomRange: [0.1,], panRange: [-100,], min: firstlc },
            yaxis: { zoomRange: [0.1,], min: gMinAltitude - 10 },
            grid: {
                hoverable: true,
                clickable: true,
                autoHighlight: false
            },
            zoom: {
                interactive: true
            },
            pan: {
                interactive: true
            }
        });

    $("<div id='tooltip'></div>").css({
        position: "absolute",
        display: "none",
        border: "1px solid #fdd",
        padding: "2px",
        "background-color": "#fee",
        opacity: 0.80,
        fontSize: "12px"
    }).appendTo("body");

    // Tooltip
    $("#chartdiv").bind("plothover", ToolTip);


    // Click the graph
    $("#chartdiv").bind("plotclick", function (event, pos, item) {

        if (!pos) return;


        if (item && item.seriesIndex == 2) {

            if (indragmode) {
                indragmode = false;
                gPlot.pan({ interactive: true });
                return;
            } else {
                curBPDindex = item.dataIndex;
                SGWorld.Navigate.JumpTo(gBPDIDs[curBPDindex]);
                SGWorld.ProjectTree.SelectItem(gBPDIDs[curBPDindex]);
                gPlot.unhighlight();
                gPlot.highlight(2, curBPDindex);
                indragmode = true;
                gPlot.pan({ interactive: false });
            }
        } else {
            if (addBPDFlager) {
                AddToBPD(pos);
                addBPDFlager = false;
                return;
            }
            gPlot.unhighlight();
            curBPDindex = -1;

            DMX_JumpToLC(pos.x);

            var sel = FindBPD(pos);
            if (sel > -1) {
                curBPDindex = sel;
                SGWorld.Navigate.JumpTo(gBPDIDs[curBPDindex]);
                SGWorld.ProjectTree.SelectItem(gBPDIDs[curBPDindex]);
                gPlot.unhighlight();
                gPlot.highlight(2, curBPDindex);
                indragmode = true;
                gPlot.pan({ interactive: false });
            }
        }
    });
}

//-------------
// Tool tip
function ToolTip(event, pos, item) {
    if (!pos) return;

    if (indragmode && curBPDindex > -1) {
        //  alert(curBPDindex);
        var lc = Math.round(pos.x / 50) * 50; // need 50 times

        if (curBPDindex == 0 || curBPDindex == gGridArray[2].length - 1) {
            lc = gGridArray[2][curBPDindex][0];
        }

        gGridArray[2][curBPDindex][0] = lc;
        gGridArray[2][curBPDindex][1] = pos.y;
        gPlot.unhighlight();
        ReDrawGraph();


        var obj = SGWorld.ProjectTree.GetObject(gBPDIDs[curBPDindex]);
        obj.TreeItem.Name = "变坡点_" + ToMarkString(lc);
        obj.Position = GetPosByLc(lc);
        SGWorld.ProjectTree.SetClientData(gBPDIDs[curBPDindex], "LC", lc);
        SGWorld.ProjectTree.SetClientData(gBPDIDs[curBPDindex], "H", pos.y);


        gPlot.highlight(2, curBPDindex);
        SGWorld.ProjectTree.SetClientData(CaseID, "CaseChanged", "TRUE");
        // return;
    }



    if (item && item.seriesIndex == 2) {
        var Line = item.seriesIndex;
        var Point = item.dataIndex;
        var htmlStr = "";
        var mTop, mLeft = 0;

        mTop = item.pageY + 5;
        mLeft = item.pageX + 5;
        htmlStr = "里程：" + gGridArray[Line][Point][0].toFixed(2) + "<br/>高程: " + gGridArray[Line][Point][1].toFixed(2);

        if (Point > 1) {
            var sp = (gGridArray[Line][Point][1] - gGridArray[Line][Point - 1][1]) * 1000 / (gGridArray[Line][Point][0] - gGridArray[Line][Point - 1][0]);
            htmlStr = htmlStr + "<br/>前坡度:" + sp.toFixed(2) + "‰";
        }
        if (Point < gGridArray[Line].length) {
            var sp = (gGridArray[Line][Point + 1][1] - gGridArray[Line][Point][1]) * 1000 / (gGridArray[Line][Point + 1][0] - gGridArray[Line][Point][0]);
            htmlStr = htmlStr + "<br/>后坡度:" + sp.toFixed(2) + "‰";
        }

        $("#tooltip").html(htmlStr)
            .css({ top: mTop, left: mLeft })
            .fadeIn(200);

    } else {
        CommonToolTip(pos);
    }


}



//-----------

function DeleteBPD() {

    var len = gGridArray[2].length - 1;
    if (curBPDindex == 0 || curBPDindex == len) {
        alert("不能删除起终点的变坡点。");
        return;
    }

    if (curBPDindex > -1) {
        gPlot.unhighlight();
        gGridArray[2].splice(curBPDindex, 1);
        var curid = gBPDIDs[curBPDindex];
        SGWorld.ProjectTree.SetClientData(curid, "ComeFromWeb", "TRUE");
        SGWorld.ProjectTree.DeleteItem(curid);
        gBPDIDs.splice(curBPDindex, 1);
        ReDrawGraph(true);
        SGWorld.ProjectTree.SetClientData(CaseID, "CaseChanged", "TRUE");
        curBPDindex = -1;
    };
}



var addBPDFlager = false;
function AddBPD() {
    addBPDFlager = true;
}

function PrefixInteger(num) {
    return ("000" + num).substr(-3);
}

function ToMarkString(num) {
    var k = Math.floor(num / 1000);
    var r = num - k * 1000;

    return PrefixInteger(k) + "+" + PrefixInteger(r);

}

function AddToBPD(pos) {
    pos.x = Math.round(pos.x / 50) * 50; // need 50 times

    for (var k = 1; k < gGridArray[2].length; k++) {
        if ((pos.x > gGridArray[2][k - 1][0]) && (pos.x < gGridArray[2][k][0])) {
            var labelStyle = SGWorld.Creator.CreateLabelStyle();
            labelStyle.Bold = true;
            labelStyle.LineToGround = true;
            labelStyle.TextColor = SGWorld.Creator.CreateColor(255, 0, 0);
            var tx = "变坡点_" + ToMarkString(pos.x);

            var posdd = GetPosByLc(pos.x);
            posdd.Altitude = pos.y;
            var newobj = SGWorld.Creator.CreateTextLabel(posdd, tx, labelStyle, bpdGroupID, tx);
            SGWorld.ProjectTree.SetClientData(newobj.ID, "LC", pos.x.toString());
            SGWorld.ProjectTree.SetClientData(newobj.ID, "H", pos.y.toString());
            SGWorld.ProjectTree.SetClientData(newobj.ID, "R", "10000");
            SGWorld.ProjectTree.SetClientData(newobj.ID, "ComeFromWeb", "TRUE");
            gBPDIDs.splice(k, 0, newobj.ID);
            gGridArray[2].splice(k, 0, [pos.x, pos.y]);
            gPlot.unhighlight();
            ReDrawGraph(true);
            gPlot.highlight(2, k);
            curBPDindex = k;
            SGWorld.ProjectTree.SetClientData(CaseID, "CaseChanged", "TRUE");
            return;
        }
    }
}

function FindBPD(pos) {
    //pos.x=Math.round(pos.x/50)*50; // need 50 times

    for (var k = 1; k <= gGridArray[2].length; k++) {
        var dis = (pos.x - gGridArray[2][k - 1][0]) * (pos.x - gGridArray[2][k - 1][0]) + (pos.y - gGridArray[2][k - 1][1]) * (pos.y - gGridArray[2][k - 1][1]);

        if (dis < 100) return k - 1;
    }

    return -1;


}


function DrawPDX() {
    gGridArray[2] = [];
    gBPDIDs = [];

    var curbpdid = SGWorld.ProjectTree.GetNextItem(bpdGroupID, 11);
    if (curbpdid == "") return;
    gBPDIDs.push(curbpdid);
    var obj = SGWorld.ProjectTree.GetObject(curbpdid);
    var lc, h;
    lc = parseFloat(obj.ClientData("LC"));
    h = parseFloat(obj.ClientData("H"));

    gGridArray[2].push([lc, h]);

    curbpdid = SGWorld.ProjectTree.GetNextItem(curbpdid, 13);
    while (curbpdid != "") {
        obj = SGWorld.ProjectTree.GetObject(curbpdid);
        lc = parseFloat(obj.ClientData("LC"));
        h = parseFloat(obj.ClientData("H"));
        gBPDIDs.push(curbpdid);
        gGridArray[2].push([lc, h]);

        curbpdid = SGWorld.ProjectTree.GetNextItem(curbpdid, 13);
    }

}

