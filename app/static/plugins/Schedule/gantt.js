

function Init()
{
	curdate = new DayPilot.Date();
	
    dp = new DayPilot.Scheduler("dp");
    dp.viewType = "Gantt";
    dp.cellWidth = 20;
    dp.durationBarMode = "PercentComplete";
    dp.crosshairType = "Full";

    dp.rowHeaderColumns = [
        {name: "��������"},
        {name: "���̳���"}      
    ];
    
    dp.onBeforeEventRender = function(args) {    	
    	var dur =new DayPilot.Duration(args.e.start,args.e.end);   
        args.e.html = args.e.text+":" +args.e.complete.toFixed(2)+ "%,�ƻ����ڣ�"+dur.days()+"��";
    };
    
   // dp.dynamicEventRenderingCacheSweeping = true;
    //dp.eventHoverHandling = "Bubble";
    
    dp.eventMovingStartEndEnabled = true;
    dp.eventResizingStartEndEnabled = true;
    dp.timeRangeSelectingStartEndEnabled = true;
    
 //   dp.onTaskClick = function(args) {
       // alert("Double-clicked: " + args.task.id());
      //  window.console && console.log(args);
  //  };
  
  //  dp.onRowMoving = function(args) {
  //      args.position = "forbidden";
  //  };
    
    // event resizing
  //  dp.onEventResized = function (args) {
  //      dp.message("Resized: " + args.e.text());
  //  };

    
    dp.onEventClicked = function(args) {
       // alert("clicked: " + args.e.id());
      // $("#Setdate").val()
    //  var dur =new DayPilot.Duration(args.e.start,args.e.end);  
       dp.message(args.e.text()+" :     ���������ڡ�" + args.e.start().toString("yyyy-MM-dd")+"  -->  " +"���������ڡ�" + args.e.end().toString("yyyy-MM-dd")+"   ���̽���:" + args.e.complete.toFixed(2) +"%");
       if(!isFollow) return;
       SGWorld.Navigate.FlyTo(args.e.id(),0);

    };
        
    dp.onTimeRangeSelecting = function(args) {
      //  if (args.duration.totalDays() > 3) 
        {
            args.allowed = false;
            args.left.enabled = false;
            args.right.enabled = true;
            args.right.html =args.duration.totalDays()+ "��";
        }
    };
    
    gid = GetParamValue("ObjectID", "0"); 
    
    $("#flagid").val(SGWorld.ProjectTree.GetItemName(gid)+"����ʵʩ����ͼ");
    
    var caseid =SGWorld.ProjectTree.GetNextItem(gid,15);
    
    var startd = SGWorld.ProjectTree.GetClientData(caseid,"StartBuildingDate");
    var endd = SGWorld.ProjectTree.GetClientData(caseid,"EndBuildingDate");  
     
    var ss= new DayPilot.Date(startd);
    var ee= new DayPilot.Date(endd);  
    var dur =new DayPilot.Duration(ss,ee);
    
    $("#startdate").val(startd);
    $("#enddate").val(endd);
    $("#lastdays").val(dur.days());
    $("#Setdate").val(curdate.toString("yyyy-MM-dd"));
  
  //alert();  
    dp.startDate = startd;
    dp.days = dur.days();
    dp.scale = "Day";
    dp.timeHeaders = [
        { groupBy: "Month", format: "MMM yyyy" },
        { groupBy: "Cell", format: "d" }
    ];    
    
   //  dp.onTaskClicked = function(args) {
   //     alert("Clicked: " + args.e.id());
   // };
    
    RefreshBar();
    
    dp.scrollTo(curdate);
    dp.init();
}

function SetDuration()
{
	
	
    var caseid =SGWorld.ProjectTree.GetNextItem(gid,15);    
  
    var ss= new DayPilot.Date($("#startdate").val());
    var ee= new DayPilot.Date($("#enddate").val());  
    var dur =new DayPilot.Duration(ss,ee);
    $("#lastdays").val(dur.days());
    curdate = new DayPilot.Date($("#Setdate").val());  
    
    var evts=dp.events.all();    
    for(var k=evts.length-1;k>=0;k--)
           dp.events.remove(evts[k]);
      
    RefreshBar();
    SGWorld.ProjectTree.SetClientData(caseid,"StartBuildingDate",ss.toString("yyyy-MM-dd"));
    SGWorld.ProjectTree.SetClientData(caseid,"EndBuildingDate",ee.toString("yyyy-MM-dd"));
    dp.scrollTo(curdate);
    dp.init();
    
 //   alert("������ɣ�");
}

function SaveProcess()
{
    var evts=dp.events.all();	
    for(var k=evts.length-1;k>=0;k--) 
    {    	
	SGWorld.ProjectTree.SetClientData(evts[k].id(),"StartBuildingDate",evts[k].start().toString("yyyy-MM-dd"));
        SGWorld.ProjectTree.SetClientData(evts[k].id(),"EndBuildingDate",evts[k].end().toString("yyyy-MM-dd"));
    }
    
    alert("�ѱ��棡");
}

///�������ܺ�����

function RefreshBar()
{
	var objid=SGWorld.ProjectTree.GetNextItem(gid,11);
    if (objid=="") return;
    
     dp.scale=$("#charttype").val(); 
     dp.separators = [
        {color:"Red", location:curdate, layer: "BelowEvents"}
    ];
   
    var sdate,edate,objname;
     sdate=SGWorld.ProjectTree.GetClientData(objid,"StartBuildingDate");
     edate=SGWorld.ProjectTree.GetClientData(objid,"EndBuildingDate");     
     objname =SGWorld.ProjectTree.GetItemName(objid);
     
     var len,sl,el;
     el=parseFloat(SGWorld.ProjectTree.GetClientData(objid,"EndLC"));
     sl=parseFloat(SGWorld.ProjectTree.GetClientData(objid,"StartLC"));     
     len=el-sl;
     totaldays=0;
     finishdays=0;
     
     AddTask(objid,objname,len,sdate,edate);
    
    
    objid=SGWorld.ProjectTree.GetNextItem(objid,13);
    while(objid!="")
    {   
        sdate=SGWorld.ProjectTree.GetClientData(objid,"StartBuildingDate");
        edate=SGWorld.ProjectTree.GetClientData(objid,"EndBuildingDate");     
        objname =SGWorld.ProjectTree.GetItemName(objid);
	
        el=parseFloat(SGWorld.ProjectTree.GetClientData(objid,"EndLC"));
        sl=parseFloat(SGWorld.ProjectTree.GetClientData(objid,"StartLC"));     
        len=el-sl;
        AddTask(objid,objname,len,sdate,edate);
	objid=SGWorld.ProjectTree.GetNextItem(objid,13);
    }
    
    var r=finishdays*100/totaldays;
    
    $("#ratio").val(r.toFixed(2)+"%");
   
}




function AddTask(sid,name,len,sd,ed)
 {    
       var start=new DayPilot.Date(sd);
       var end = new DayPilot.Date(ed);     
       
       var dur =new DayPilot.Duration(start,end);
       var done=new DayPilot.Duration(start,curdate);     
       
       var c=done.days();       
       if(c<0) c=0;
       if(c>dur.days()) c=dur.days();
       
       finishdays = finishdays + c;        
       totaldays = totaldays + dur.days();
              
       var com = c*100/dur.days();
       
       var cik;
       cik=3;      
       if (com<=0)  {  com=0;   cik = 1; };
       
       if (com>=100)  {  com=100;   cik = 0; }
       
 	//alert(cik);
 	
 	var e = new DayPilot.Event({
            start: start,
            end: end,
            id: sid,//DayPilot.guid()
            text: name,
            barColor: barColor(cik),
            barBackColor: barBackColor(cik)
,
            complete: com,  //Math.floor(Math.random() * 101), // 0 to 100
            columns: [ { html: len.toFixed(2)+"m"}]
        });
        dp.events.add(e);
 }
 




