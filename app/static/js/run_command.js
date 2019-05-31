function Run(id) {
  switch (id) {
    case "select":
      SGWorld.Command.Execute(1021, 0);
      break;
    case "AreaSelect":
      SGWorld.Command.Execute(1024, 0);
      break;
    case "pen":
      alert("need work!");
      break;
    case "undergroundmode":
      SGWorld.Command.Execute(1027, 0);
      break;
    case "location":
      SGWorld.Command.Execute(1016, 0);
      break;
    case "projectsettings":
      SGWorld.Command.Execute(1020, 0);
      break;
    case "publish":
      SGWorld.Command.Execute(1007, 0);
      break;
    case "query":
      SGWorld.Command.Execute(1023, 0);
      break;
    case "distance":
      SGWorld.Command.Execute(1035, 0);
      break;
    case "Hdistance":
      SGWorld.Command.Execute(1034, 0);
      break;
    case "3Ddistance":
      SGWorld.Command.Execute(1036, 0);
      break;
    case "area":
      SGWorld.Command.Execute(1165, 0);
      break;
    case "contourmap":
      SGWorld.Command.Execute(2216, 0);
      break;
    case "Areacontourmap":
      SGWorld.Command.Execute(1039, 0);
      break;
    case "AreaTerrainMap":
      SGWorld.Command.Execute(1040, 0);
      break;
    case "slopemap":
      SGWorld.Command.Execute(2217, 0);
      break;
    case "SlopeColorMap":
      SGWorld.Command.Execute(1092, 0);
      break;
    case "SlopeDirections":
      SGWorld.Command.Execute(1094, 0);
      break;
    case "bestpath":
      SGWorld.Command.Execute(1042, 0);
      break;
    case "terrainprofile":
      SGWorld.Command.Execute(1149, 28);
      break;
    case "flood":
      SGWorld.Command.Execute(1044, 0);
      break;
    case "volume":
      SGWorld.Command.Execute(1045, 0);
      break;
    case "lineofsight":
      SGWorld.Command.Execute(1046, 0);
      break;
    case "viewshed":
      SGWorld.Command.Execute(1047, 0);
      break;
    case "viewshedonroute":
      SGWorld.Command.Execute(2002, 0);
      break;
    case "threatdome":
      SGWorld.Command.Execute(1149, 33);
      break;
    case "shadow":
      SGWorld.Command.Execute(2118, 0);
      break;
    case "selectionshadow":
      SGWorld.Command.Execute(2119, 0);
      break;
    case "shadowquery":
      SGWorld.Command.Execute(1149, 27);
      break;
    case "imagerycomparison":
      SGWorld.Command.Execute(1149, 34);
      break;
    case "snapshotcomparison":
      SGWorld.Command.Execute(1149, 35);
      break;
    case "loadlayer":
      SGWorld.Command.Execute(1013, 0);
      break;
    case "datalibrary":
      SGWorld.Command.Execute(1149, 20);
      break;
    case "osmlayers":
      //SGWorld.Command.Execute(N/A,N/A);
      alert("No supported!");
      break;
    case "newlayer":
      SGWorld.Command.Execute(1013, 11);
      break;
    case "fly":
      SGWorld.Command.Execute(1013, 2);
      break;
    case "kml":
      SGWorld.Command.Execute(1013, 3);
      break;
    case "3dml":
      SGWorld.Command.Execute(2110, 0);
      break;
    case "bim":
      SGWorld.Command.Execute(1149, 36);
      break;
    case "pointcloud":
      SGWorld.Command.Execute(1012, 25);
      break;
    case "imagerylayer":
      //2 - Imagery Layer from File
      //3 - TerraGate Layer
      //4 - Web Map Service (WMS)
      //4 - Web Map Tile Service (WMTS)
      //5 - Oracle Spatial Database
      //6 - ArcSDE Database
      //7 - ECW Image Web Server
      SGWorld.Command.Execute(1014, 2);
      break;
    case "elevationlayer":
      //19 - Elevation Layer from File
      //20 - TerraGate Layer
      //21 - Web Map Service (WMS)
      //21 - Web Map Tile Service (WMTS)
      //22 - Oracle Spatial Database
      //23 - ArcSDE Database
      //24 - ECW Image Web Server
      SGWorld.Command.Execute(1014, 19);
      break;
    case "osmmap":
      //SGWorld.Command.Execute(N/A,N/A);
      alert("This is a dynamic menu coming from the server.");
      break;
    case "make3dml":
      SGWorld.Command.Execute(1149, 18);
      break;
    case "makexpt":
      SGWorld.Command.Execute(1149, 11);
      break;
    case "makecpt":
      SGWorld.Command.Execute(1149, 10);
      break;
    case "resolutionpyramid":
      SGWorld.Command.Execute(1149, 12);
      break;
    case "text":
      SGWorld.Command.Execute(1012, 0);
      break;
    case "iamge":
      SGWorld.Command.Execute(1012, 1);
      break;
    case "videoonterrain":
      SGWorld.Command.Execute(1012, 2);
      break;
    case "videobillboard":
      SGWorld.Command.Execute(1012, 3);
      break;
    case "polyline":
      SGWorld.Command.Execute(1012, 4);
      break;
    case "polygon":
      SGWorld.Command.Execute(1012, 5);
      break;
    case "rectangle":
      SGWorld.Command.Execute(1012, 6);
      break;
    case "regularpolygon":
      SGWorld.Command.Execute(1012, 7);
      break;
    case "arrow":
      SGWorld.Command.Execute(1012, 8);
      break;
    case "circle":
      SGWorld.Command.Execute(1012, 9);
      break;
    case "ellipse":
      SGWorld.Command.Execute(1012, 10);
      break;
    case "arc":
      SGWorld.Command.Execute(1012, 11);
      break;
    case "3dmodel":
      SGWorld.Command.Execute(1012, 13);
      break;
    case "3dpolygon":
      SGWorld.Command.Execute(1012, 17);
      break;
    case "box":
      SGWorld.Command.Execute(1012, 18);
      break;
    case "cylinder":
      SGWorld.Command.Execute(1012, 20);
      break;
    case "sphere":
      SGWorld.Command.Execute(1012, 21);
      break;
    case "cone":
      SGWorld.Command.Execute(1012, 22);
      break;
    case "pyramid":
      SGWorld.Command.Execute(1012, 23);
      break;
    case "3darrow":
      SGWorld.Command.Execute(1012, 24);
      break;
    case "building":
      SGWorld.Command.Execute(1012, 14);
      break;
    case "modifyterrain":
      SGWorld.Command.Execute(1012, 15);
      break;
    case "holeonterrain":
      SGWorld.Command.Execute(1012, 16);
      break;
    case "groundobject":
      SGWorld.Command.Execute(1012, 26);
      break;
    case "aerialobject":
      SGWorld.Command.Execute(1012, 27);
      break;
    case "movebytime":
      SGWorld.Command.Execute(1012, 47);
      break;
    case "datalibrary":
      SGWorld.Command.Execute(1149, 13);
      break;
    case "sketchupwarehouse":
      SGWorld.Command.Execute(1149, 15);
      break;
    case "3d":
      SGWorld.Command.Execute(1052, 0);
      break;
    case "2d":
      SGWorld.Command.Execute(1053, 0);
      break;
    case "2dn":
      SGWorld.Command.Execute(1054, 0);
      break;
    case "zoom":
      //Globe Level--5
      //Country Level--4
      //State Level--3
      //City Level--2 
      //Street Level--1
      //House Level--0
      SGWorld.Command.Execute(1055, 5);
      break;
    case "north":
      SGWorld.Command.Execute(1056, 0);
      break;
    case "rotate":
      SGWorld.Command.Execute(1057, 0);
      break;
    case "follow":
      //Circle Pattern--0
      //Oval Pattern--1
      //Arc Pattern--2
      //Line Pattern--3
      //Behind Object--4
      //Above Object--5
      //From Below--6
      //From Right--7
      //From Left--8
      //From Behind and Above--9
      //Cockpit View--10
      //From Ground Location--11
      SGWorld.Command.Execute(1057, 1);
      break;
    case "collisiondetection":
      SGWorld.Command.Execute(1140, 0);
      break;
    case "slidemode":
      SGWorld.Command.Execute(1050, 0);
      break;
    case "map":
      //Navigation Map Settings
      //Display Navigation Map--N/A
      SGWorld.Command.Execute(1058, 0);
      break;
    case "gps":
      SGWorld.Command.Execute(1149, 1);
      break;
    case "target":
      SGWorld.Command.Execute(1149, 2);
      break;
    case "multiplecoordsys":
      SGWorld.Command.Execute(1149, 3);
      break;
    case "lookaround":
      SGWorld.Command.Execute(1149, 37);
      break;
    case "hideterrain":
      //Null – Toggle
      //0 – Show
      //1 – Hide
      SGWorld.Command.Execute(1059, 0);
      break;
    case "fov":
      //Can be one of the following values: 90.0; 70.0; 53.0; 45.0; 35.0; 25.0; 15.0
      SGWorld.Command.Execute(1066, 90.0);
      break;
    case "snapshot":
      //Snapshot to New Window--1067
      //Snapshot to File--1068
      SGWorld.Command.Execute(1067, 0);
      break;
    case "extracttompt":
      SGWorld.Command.Execute(1141, 0);
      break;
    case "extracttovrml":
      SGWorld.Command.Execute(1142, 0);
      break;
    case "collaboration":
      SGWorld.Command.Execute(1149, 4);
      break;
    case "urbandesign":
      SGWorld.Command.Execute(1149, 38);
      break;
    case "duplicateobjects":
      SGWorld.Command.Execute(1149, 6);
      break;
    case "powerlines":
      SGWorld.Command.Execute(1149, 7);
      break;
    case "pipelines":
      SGWorld.Command.Execute(1149, 8);
      break;
    case "fenceandwall":
      SGWorld.Command.Execute(1149, 17);
      break;
    case "timespantags":
      SGWorld.Command.Execute(1149, 9);
      break;
    case "blockwidth":
      SGWorld.Command.Execute(1149, 16);
      break;
    default:
      alert("NO Find!");
      break;
  }
}