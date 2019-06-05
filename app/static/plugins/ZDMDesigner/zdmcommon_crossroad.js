var curBPDindex = -1;
var curPier = -1;
var indragmode = false;
var gPlot;
var objectID;

//地面线类，地面线最终得到  gGridArray[0]  轨面线，轨面线最终得到  gGridArray[1]
var gMinAltitude = 0; //确定Y轴原坐标
var gGridArray = [];   //每条线上点的网格值(lc,h)
var firstlc, endlc;


//------------
// StartQuery
function StartQuery() {

	try {


		objectID = GetParamValue("ObjID", "0");
		var objectName = SGWorld.ProjectTree.GetItemName(objectID);

		$("#FlagerID").html(objectName + "  纵断面设计");
		var sEarthHstr = SGWorld.ProjectTree.GetClientData(objectID, "EarthH");


		firstlc = 2.5;
		var strs = new Array(); //定义一数组 
		strs = sEarthHstr.split(","); //字符分割 
		gGridArray[0] = [];

		var eh = 0;
		for (var i = 0; i < strs.length; i++) {
			if (strs[i] == "") continue;
			eh = parseFloat(strs[i]);
			endlc = 2.5 + 5 * i;
			gGridArray[0].push([endlc, eh]);
		}

		gGridArray[1] = [];
		sEarthHstr = SGWorld.ProjectTree.GetClientData(objectID, "HList");
		strs = new Array(); //定义一数组 
		strs = sEarthHstr.split(" "); //字符分割 

		var st = new Array();
		var lc, zh;
		for (var i = 0; i < strs.length; i++) {
			if (strs[i] == "") continue;
			st = strs[i].split(",");
			lc = parseFloat(st[0]);
			zh = parseFloat(st[1]);
			endlc = lc;
			gGridArray[1].push([lc, zh]);
		}
		GetPierList();

		SGWorld.Window.SetInputMode(1, abspath() + "/hourglass.cur", true);
		DrawGraph();

		$("#waitDiv").hide();
		$("#mainTbl").css('display', 'inline');
		SGWorld.Window.SetInputMode(0);

	}
	catch (e) { alert(e); }
}

function DMX_getTrackH(lc) {
	var len = gGridArray[1].length;

	for (var i = 1; i < len; i++) {
		if (lc >= gGridArray[1][i - 1][0] && lc <= gGridArray[1][i][0]) {
			return gGridArray[1][i - 1][1] + (gGridArray[1][i][1] - gGridArray[1][i - 1][1]) * (lc - gGridArray[1][i - 1][0]) / (gGridArray[1][i][0] - gGridArray[1][i - 1][0]);
		}
	}
}

function DMX_getElev(lc) {
	var len = gGridArray[0].length;

	for (var i = 1; i < len; i++) {
		if (lc >= gGridArray[0][i - 1][0] && lc <= gGridArray[0][i][0]) {
			return gGridArray[0][i - 1][1] + (gGridArray[0][i][1] - gGridArray[0][i - 1][1]) * (lc - gGridArray[0][i - 1][0]) / (gGridArray[0][i][0] - gGridArray[0][i - 1][0]);
		}
	}
}

function GetPierList() {
	var PierConfigString = SGWorld.ProjectTree.GetClientData(objectID, "PierList");
	var strs = PierConfigString.split(",");
	var c = strs.length;
	var lc, h;
	gGridArray[2] = [];

	for (var i = 0; i < c; i++) {
		lc = parseFloat(strs[i]);
		h = DMX_getTrackH(lc);
		gGridArray[2][i] = [lc, h];
	}

}

function CommitBPD() {
	var str = "";
	for (var k = 0; k < gGridArray[1].length; k++) {
		str += " " + gGridArray[1][k][0].toFixed(2) + "," + gGridArray[1][k][1].toFixed(2);
	}
	SGWorld.ProjectTree.SetClientData(objectID, "HList", str);

	if (gGridArray[2].length > 0) str = gGridArray[2][0][0].toFixed(2);
	else str = "";

	for (var k = 1; k < gGridArray[2].length; k++) {
		str += "," + gGridArray[2][k][0].toFixed(2);
	}

	SGWorld.ProjectTree.SetClientData(objectID, "PierList", str);
	SGWorld.ProjectTree.SetClientData(objectID, "ZDMChartChanged", "true");
	alert("设计坡度已经提交，请刷新模型进行效果调整！");
}

function ReDrawGraph(ispan) {
	for (var k = 0; k < gGridArray[2].length; k++) {
		gGridArray[2][k][1] = DMX_getTrackH(gGridArray[2][k][0]);
	}

	var data = [];
	data.push({ data: gGridArray[0], label: "地面线", lines: { show: true, fill: true, width: 1, fillColor: { colors: [{ opacity: 0.7 }, { opacity: 0.1 }] } }, color: '#00ff00', threshold: { below: gMinAltitude + 50, color: "rgb(200, 20, 30)" } });
	//data.push({ data: gGridArray[1], label: "坡度线", lines: { show: true, fill: false }, points: { show: false },color: '#ff0000'});
	data.push({ data: gGridArray[1], label: "坡度线", lines: { show: true, fill: false }, points: { symbol: "triangle", fillColor: "#0062FF", show: true }, color: '#0000ff', highlightColor: '#ff0000' });
	data.push({ data: gGridArray[2], label: "墩台", bars: { show: true, barWidth: 5, align: 'center', horizontal: false, zero: true }, points: { show: false }, color: '#ff00ff', highlightColor: '#ff0000' });
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
	//data.push({ data: gGridArray[1], label: "轨面线", lines: { show: true, fill: false }, points: { show: false },color: '#ff0000'});
	data.push({ data: gGridArray[1], label: "坡度线", lines: { show: true, fill: false }, points: { symbol: "triangle", fillColor: "#0062FF", show: true }, color: '#0000ff', highlightColor: '#ff0000' });
	data.push({ data: gGridArray[2], label: "墩台", bars: { show: true, barWidth: 5, align: 'center', horizontal: false, zero: true }, points: { show: false }, color: '#ff00ff', highlightColor: '#ff0000' });

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


		if (item && item.seriesIndex == 1) {

			if (indragmode) {
				indragmode = false;
				gPlot.pan({ interactive: true });
				return;
			} else {
				curBPDindex = item.dataIndex;
				curPier = -1;
				gPlot.unhighlight();
				gPlot.highlight(1, curBPDindex);
				indragmode = true;
				gPlot.pan({ interactive: false });
			}
		} else if (item && item.seriesIndex == 2) {

			if (curPier > 0) {
				curPier = -1;
				curBPDindex = -1;
				gPlot.unhighlight();
			} else {
				curPier = item.dataIndex;
				curBPDindex = -1;
				gPlot.unhighlight();
				gPlot.highlight(2, curPier);
			}

			//    indragmode=true;	        
		} else {
			if (addBPDFlager) {
				AddToBPD(pos);
				addBPDFlager = false;
				return;
			}

			if (addPierflag) {
				AddToPierList(pos);
				addPierflag = false;
				return;
			}

			gPlot.unhighlight();
			curBPDindex = -1;
			curPier = -1;
		}
	});
}

//-------------
// Tool tip
function ToolTip(event, pos, item) {
	if (!pos) return;

	if (indragmode && curBPDindex > -1) {
		//  alert(curBPDindex);
		var lc = Math.round(pos.x / 10) * 10; // need 50 times

		if (curBPDindex == 0 || curBPDindex == gGridArray[1].length - 1) {
			lc = gGridArray[1][curBPDindex][0];
		}

		gGridArray[1][curBPDindex][0] = lc;
		gGridArray[1][curBPDindex][1] = pos.y;
		gPlot.unhighlight();
		ReDrawGraph();
		gPlot.highlight(1, curBPDindex);
	}


	if (curPier > -1) {
		gGridArray[2][curPier][0] = pos.x;
		gGridArray[2][curPier][1] = DMX_getTrackH(pos.x);
		var eh = DMX_getElev(pos.x);

		if (eh > gGridArray[2][curPier][1] - 3) {
			gPlot.unhighlight();
			gGridArray[2].splice(curPier, 1);
			//   alert(gGridArray[2].length);
			ReDrawGraph(true);
			curPier = -1;

		} else {
			gPlot.unhighlight();
			ReDrawGraph();
			gPlot.highlight(2, curPier);
		}
	}


	if (item && item.seriesIndex == 1) {
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
		//	CommonToolTip(pos);
	}


}



//-----------

function DeleteBPD() {

	var len = gGridArray[1].length - 1;
	if (curBPDindex == 0 || curBPDindex == len) {
		alert("不能删除起终点的变坡点。");
		return;
	}

	if (curBPDindex > -1) {
		gPlot.unhighlight();
		gGridArray[1].splice(curBPDindex, 1);
		ReDrawGraph(true);
		curBPDindex = -1;
	};
}

var addPierflag = false;
function AddPier() {
	addPierflag = true;
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

function AddToPierList(pos) {
	//pos.x=Math.round(pos.x/10)*10; // need 50 times
	//alert(gGridArray[2].length);
	if (gGridArray[2].length < 1) {
		gGridArray[2].push([pos.x, pos.y]);
		gPlot.highlight(2, 0);
		ReDrawGraph(true);
		return;
	};

	if (pos.x < gGridArray[2][0][0]) {
		gGridArray[2].splice(0, 0, [pos.x, pos.y]);
		gPlot.unhighlight();
		ReDrawGraph(true);
		gPlot.highlight(2, 0);
		curPier = 0;
		return;
	}

	for (var k = 1; k < gGridArray[2].length; k++) {
		if ((pos.x > gGridArray[2][k - 1][0]) && (pos.x < gGridArray[2][k][0])) {
			gGridArray[2].splice(k, 0, [pos.x, pos.y]);
			gPlot.unhighlight();
			ReDrawGraph(true);
			gPlot.highlight(2, k);
			curPier = k;
			return;
		}
	}
	var m = gGridArray[2].length - 1;
	if (pos.x > gGridArray[2][m][0]) {
		gGridArray[2].push([pos.x, pos.y]);
		gPlot.unhighlight();
		ReDrawGraph(true);
		gPlot.highlight(2, m + 1);
		curPier = m + 1;
		return;
	}
}

function AddToBPD(pos) {
	pos.x = Math.round(pos.x / 10) * 10; // need 50 times

	for (var k = 1; k < gGridArray[1].length; k++) {
		if ((pos.x > gGridArray[1][k - 1][0]) && (pos.x < gGridArray[1][k][0])) {
			gGridArray[1].splice(k, 0, [pos.x, pos.y]);
			gPlot.unhighlight();
			ReDrawGraph(true);
			gPlot.highlight(1, k);
			curBPDindex = k;
			//  SGWorld.ProjectTree.SetClientData(CaseID,"CaseChanged","TRUE");     	   
			return;
		}
	}
}

function FindBPD(pos) {
	//pos.x=Math.round(pos.x/50)*50; // need 50 times

	for (var k = 1; k <= gGridArray[1].length; k++) {
		var dis = (pos.x - gGridArray[1][k - 1][0]) * (pos.x - gGridArray[1][k - 1][0]) + (pos.y - gGridArray[1][k - 1][1]) * (pos.y - gGridArray[1][k - 1][1]);

		if (dis < 100) return k - 1;
	}

	return -1;


}
