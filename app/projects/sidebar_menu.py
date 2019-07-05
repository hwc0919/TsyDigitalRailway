# 用以下脚本从test.html 中获取数据
# <script>
#   jQuery(document).ready(function() {
#     var dict={}
#     jQuery("li").each(function() {
#         var title=jQuery(this).children("a").text()
#         dict[title]=[];
#         jQuery(this).find("input").each(function() {
#             var id=jQuery(this).attr("id");
#             var img = jQuery(this).attr("style").match( /\(img\/ (.*)\)/)[1];
#             dict[title].push([id, img]); })
#     })
#     console.log(JSON.stringify(dict));
#   })
# </script>


ITEMS = {
    "Home": [
        ["select", "select.png"],
        ["AreaSelect", "AreaSelect.png"],
        ["pen", "pen.png"],
        ["undergroundmode", "undergroundmode.png"],
        ["location", "location.png"],
        ["projectsetting", "projectsetting.png"],
        ["publish", "publish.png"],
        ["hideterrain", "hideterrain.png"],
        ["fov", "fov.png"],
        ["extracttompt", "extracttompt.png"],
        ["extracttovrml", "extracttovrml.png"],
        ["collaboration", "collaboration.png"],
        ["urbandesign", "urbandesign.png"],
        ["duplicateobjects", "duplicateobjects.png"],
        ["imagerycomparison", "imagerycomparison.png"],
        ["snapshotcomparison", "snapshotcomparison.png"]
    ],
    "Analysis": [
        ["query", "query.png"],
        ["distance", "distance.png"],
        ["Hdistance", "HRuler02.png"],
        ["3Ddistance", "3DRuler.png"],
        ["area", "area.png"],
        ["contourmap", "contourmap.png"],
        ["Areacontourmap", "AreaContour.png"],
        ["AreaTerrainMap", "AreaTerrainMap.png"],
        ["slopemap", "slopemap.png"],
        ["SlopeColorMap", "SlopeColorMap.png"],
        ["SlopeDirections", "SlopeDirections.png"],
        ["bestpath", "bestpath.png"],
        ["terrainprofile", "terrainprofile.png"],
        ["flood", "flood.png"], ["volume", "volume.png"],
        ["lineofsight", "lineofsight.png"],
        ["viewshed", "viewshed.png"],
        ["viewshedonroute", "viewshedonroute.png"],
        ["threatdome", "threatdome.png"],
        ["shadow", "shadow.png"],
        ["selectionshadow", "selectionshadow.png"],
        ["shadowquery", "shadowquery.png"]
    ],
    "Layers": [
        ["loadlayer", "loadlayer.png"],
        ["datalibrary", "datalibrary.png"],
        ["osmlayers", "osmlayers.png"],
        ["newlayer", "newlayer.png"],
        ["fly", "fly.png"],
        ["kml", "kml.png"],
        ["3dml", "3dml.png"],
        ["bim", "bim.png"],
        ["pointcloud", "pointcloud.png"],
        ["imagerylayer", "imagerylayer.png"],
        ["elevationlayer", "elevationlayer.png"],
        ["osmmap", "osmmap.png"],
        ["make3dml", "make3dml.png"],
        ["makexpl", "makexpl.png"],
        ["makecpt", "makecpt.png"],
        ["resolutionpyramid", "resolutionpyramid.png"]
    ],
    "Objects": [
        ["text", "text.png"],
        ["image", "image.png"],
        ["videoonterrain", "videoonterrain.png"],
        ["videobillboard", "videobillboard.png"],
        ["polyline", "polyline.png"],
        ["polygon", "polygon.png"],
        ["3dmodel", "3dmodel.png"], ["building", "building.png"],
        ["modifyterrain", "modifyterrain.png"],
        ["holeonterrain", "holeonterrain.png"],
        ["groundobject", "groundobject.png"],
        ["aerialobject", "aerialobject.png"],
        ["movebytime", "movebytime.png"],
        ["datalibrary", "datalibrary.png"],
        ["sketchupwarehouse", "sketchupwarehouse.png"]
    ],
    "Shapes": [
        ["rectangle", "rectangle.png"],
        ["regularpolygon", "regularpolygon.png"],
        ["arrow", "arrow.png"],
        ["circle", "circle.png"],
        ["ellipse", "ellipse.png"],
        ["arc", "arc.png"],
        ["3dpolygon", "3dpolygon.png"],
        ["box", "box.png"],
        ["cylinder", "cylinder.png"],
        ["sphere", "sphere.png"],
        ["cone", "cone.png"],
        ["pyramid", "pyramid.png"],
        ["3darrow", "3darrow.png"]
    ],
    "Navigation": [
        ["3d", "3d.png"],
        ["2d", "2d.png"],
        ["2dn", "2dn.png"],
        ["zoom", "zoom.png"],
        ["north", "north.png"],
        ["rotate", "rotate.png"],
        ["follow", "follow.png"],
        ["collisiondetection", "collisiondetection.png"],
        ["slidemode", "slidemode.png"],
        ["map", "map.png"],
        ["gps", "gps.png"],
        ["target", "target.png"],
        ["multiplecoordsys", "multiplecoordsys.png"],
        ["lookaround", "lookaround.png"]
    ],
    "Animation": [
        ["customanimation", "customanimation.png"],
        ["firesmokewhite", "firesmokewhite.png"],
        ["firesmokeblack", "firesmokeblack.png"],
        ["bonfire", "bonfire.png"],
        ["buildingfire", "buildingfire.png"],
        ["forestfire", "forestfire.png"],
        ["groundexplosion", "groundexplosion.png"],
        ["fireworkstwocolors", "fireworkstwocolors.png"],
        ["fireworksring", "fireworksring.png"],
        ["fountain", "fountain.png"],
        ["pipeburst", "pipeburst.png"],
        ["oceans", "oceans.png"]
    ]
}
