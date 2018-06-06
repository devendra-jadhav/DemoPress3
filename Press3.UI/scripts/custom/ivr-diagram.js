Node = function (params) {
    var node = this;
    if (!params)
        params = { 'empty': 'empty' };
    node.nodeId = (params["nodeId"]) ? params["nodeId"] : new Date().getTime() + Math.floor(Math.random() * 11111);
    node.nodeText = (params["nodeText"]) ? params["nodeText"] : "";
    node.nodeType = (params["nodeType"]) ? params["nodeType"] : "NODE";
    node.nodeContent = (params["nodeContent"]) ? params["nodeContent"] : "Edit";
    node.parentid = (params["parentid"]) ? params["parentid"] : "";
    node.xPosition = (params["xPosition"]) ? params["xPosition"] : 100;
    node.yPosition = (params["yPosition"]) ? params["yPosition"] : 100;
    node.width = (params["width"]) ? params["width"] : 100;
    node.height = (params["height"]) ? params["height"] : 100;
    node.bgColor = (params["bgColor"]) ? params["bgColor"] : "#FFFFFF";
    node.borderColor = (params["borderColor"]) ? params["borderColor"] : "#AAAAAA";
    node.borderWidth = (params["borderWidth"]) ? params["borderWidth"] : 1;
    node.fontColor = (params["fontColor"]) ? params["fontColor"] : "#0072bc";
    node.fontSize = (params["fontSize"]) ? params["fontSize"] : "7pt";
    node.fontType = (params["fontType"]) ? params["fontType"] : "verdana";
    node.minHeight = (params["minHeight"]) ? params["minHeight"] : 40;
    node.maxHeight = (params["maxHeight"]) ? params["maxHeight"] : 400;
    node.minWidth = (params["minWidth"]) ? params["minWidth"] : 40;
    node.maxWidth = (params["maxWidth"]) ? params["maxWidth"] : 400;
    node.nPort = (params["nPort"] == false) ? params["nPort"] : true;
    node.ePort = (params["ePort"] == false) ? params["ePort"] : true;
    node.sPort = (params["sPort"] == false) ? params["sPort"] : true;
    node.wPort = (params["wPort"] == false) ? params["wPort"] : true;
    node.nPortMakeConnection = (params["nPortMakeConnection"] == false) ? params["nPortMakeConnection"] : true;
    node.ePortMakeConnection = (params["ePortMakeConnection"] == false) ? params["ePortMakeConnection"] : true;
    node.sPortMakeConnection = (params["sPortMakeConnection"] == false) ? params["sPortMakeConnection"] : true;
    node.wPortMakeConnection = (params["wPortMakeConnection"] == false) ? params["wPortMakeConnection"] : true;
    node.nPortAcceptConnection = (params["nPortAcceptConnection"] == false) ? params["nPortAcceptConnection"] : true;
    node.ePortAcceptConnection = (params["ePortAcceptConnection"] == false) ? params["ePortAcceptConnection"] : true;
    node.sPortAcceptConnection = (params["sPortAcceptConnection"] == false) ? params["sPortAcceptConnection"] : true;
    node.wPortAcceptConnection = (params["wPortAcceptConnection"] == false) ? params["wPortAcceptConnection"] : true;
    node.image = (params["image"]) ? params["image"] : "images/defaultimage.png";
    node.imageWidth = (params["imageWidth"]) ? params["imageWidth"] : "100";
    node.imageHeight = (params["imageHeight"]) ? params["imageHeight"] : "100";
    node.draggable = (params["draggable"] == false) ? params["draggable"] : true;
    node.resizable = (params["resizable"] == false) ? params["resizable"] : true;
    //node.editable=(params["editable"] == false)? params["editable"] : true;
    node.selectable = (params["selectable"] == false) ? params["selectable"] : true;
    node.deletable = (params["deletable"] == false) ? params["deletable"] : true;
    node.className = (params["className"]) ? params["className"] : "";
    node.childNodes = (params["childNodes"]) ? params["childNodes"] : "";
    node.p_id = (params["p_id"]) ? params["p_id"] : "";

    if (node.width > node.maxWidth)
        node.width = node.maxWidth;
    if (node.width < node.minWidth)
        node.width = node.minWidth;
    if (node.height > node.maxHeight)
        node.height = node.maxHeight;
    if (node.height < node.minHeight)
        node.height = node.minHeight;


    if (node.nodeType == "NODE") {
        // nothing to do right now

    } else if (node.nodeType == "IMAGE") {
        node.borderWidth = 0;
        //node.editable=false;
        if (node.imageWidth < node.minWidth)
            node.imageWidth = node.minWidth;
        if (node.imageWidth > node.maxWidth)
            node.imageWidth = node.maxWidth;
        if (node.imageHeight < node.minHeight)
            node.imageHeight = node.minHeight;
        if (node.imageHeight > node.maxHeight)
            node.imageHeight = node.maxHeight;

        node.width = parseInt(node.imageWidth) + 24;
        node.height = parseInt(node.imageHeight) + 24;

    } else if (node.nodeType == "TEXT") {
        node.borderWidth = 0;
        node.nPort = false;
        node.ePort = false;
        node.sPort = false;
        node.wPort = false;
    }

    node.isNew = true;
    node.isModified = false;
    node.isSelected = false;
    node.affectedConnections = [];
    node.affectedNodes = [];
};

Connection = function (nodeFrom, portFrom, nodeTo, portTo, color, stroke, nodeText) {
    this.nodeFrom = nodeFrom;
    this.portFrom = portFrom;
    this.nodeTo = nodeTo;
    this.portTo = portTo;
    this.stroke = (stroke) ? stroke : 2;
    this.color = (color) ? color : "#FF0000";
    this.connectionId = '';
    this.nodeText = nodeText;
};


Diagram = function (params) {
    var self = this;

    if (!params)
        params = { 'empty': 'empty' };
    this.canvid = (params["id"]) ? params["id"] : "dgrm_" + new Date().getTime() + Math.floor(Math.random() * 11111);
    this.xPosition = (params["xPosition"]) ? params["xPosition"] : 20;
    this.yPosition = (params["yPosition"]) ? params["yPosition"] : 30;
    this.width = (params["width"]) ? params["width"] : 1000;
    this.height = (params["height"]) ? params["height"] : 500;
    this.connectionWidth = (params["connectionWidth"]) ? params["connectionWidth"] : 3;
    this.connectionColor = (params["connectionColor"]) ? params["connectionColor"] : '#888888';
    this.height = (params["height"]) ? params["height"] : 500;
    this.imagesPath = (params["imagesPath"]) ? params["imagesPath"] : '/assets/img/';
    this.noToolbar = (params["noToolbar"] == true) ? params["noToolbar"] : false;
    this.toolbar_add_button = (params["toolbar_add_button"] == false) ? params["toolbar_add_button"] : true;
    this.toolbar_save_button = (params["toolbar_save_button"] == false) ? params["toolbar_save_button"] : true;
    this.toolbar_delete_button = (params["toolbar_delete_button"] == false) ? params["toolbar_delete_button"] : true;
    this.toolbar_background_color_button = (params["toolbar_background_color_button"] == false) ? params["toolbar_background_color_button"] : true;
    this.toolbar_border_color_button = (params["toolbar_border_color_button"] == false) ? params["toolbar_border_color_button"] : true;
    this.toolbar_font_color_button = (params["toolbar_font_color_button"] == false) ? params["toolbar_font_color_button"] : true;
    this.toolbar_font_size_button = (params["toolbar_font_size_button"] == false) ? params["toolbar_font_size_button"] : true;
    this.toolbar_font_family_button = (params["toolbar_font_family_button"] == false) ? params["toolbar_font_family_button"] : true;
    this.toolbar_border_width_button = (params["toolbar_border_width_button"] == false) ? params["toolbar_border_width_button"] : true;

    this.onSave = (params["onSave"]) ? params["onSave"] : null;
    this.onDelete = (params["onDelete"]) ? params["onDelete"] : null;
    this.onSelect = (params["onSelect"]) ? params["onSelect"] : null;
    this.onBeforeDelete = (params["onBeforeDelete"]) ? params["onBeforeDelete"] : null;
    this.onNodeDelete = (params["onNodeDelete"]) ? params["onNodeDelete"] : null;


    this.canvasId = this.canvid;
    this.nodes = [];
    this.connections = [];
    this.hoverEffect = false;
    this.tempLine = null;

    //add main container for the diagram
    var diagramcontainer = '<div style="position:absolute; left:' + self.xPosition + 'px;width:100%;height:804px;z-index:-2;padding:0px; margin:0px;" class="ui-widget-header ui-corner-all"></div>';

    diagramcontainer += '<div id="' + self.canvid + '" style="position:absolute; left:' + (self.xPosition + 2) + 'px;width:99.9%;height:800px;overflow:auto;z-index:0;"><div id="' + self.canvid + '_templine" style="position: absolute;z-index:1000;"></div></div>';
    $('#' + params["containerid"]).prepend(diagramcontainer);


    tmplin = new jsGraphics(self.canvid + '_templine');
    tmplin.setColor(self.connectionColor);
    tmplin.setStroke(self.connectionWidth);
    self.tempLine = tmplin;


    this.getCanvas = $("#" + self.canvid);
    //done add main container for the diagram

    $("#" + self.canvid).click(function (event) { if (!((event.target.id).match(/_content$/)) && !((event.target.id).match(/_imagenode$/))) { self.clearSelection() } });
    $("#" + self.canvid).droppable({
        accept: '.node_palette_item',
        drop: function (event, ui) {
            if (($(ui.draggable).attr("id")).indexOf(self.canvid) != -1) {
                arr = self.mytoolbar.getNodeByOrder($(ui.draggable).attr("id").replace("_" + self.canvasId, ""));
                self.addNode(new Node({
                    'nodeType': arr['nodeType'],
                    'nodeText': arr['nodeText'],
                    'nodeContent': arr['nodeContent'],
                    'xPosition': (ui.position.left + $("#" + self.canvid).scrollLeft()),
                    'yPosition': (ui.position.top + $("#" + self.canvid).scrollTop()),
                    'width': arr['width'],
                    'height': arr['height'],
                    'bgColor': arr['bgColor'],
                    'borderColor': arr['borderColor'],
                    'borderWidth': arr['borderWidth'],
                    'fontColor': arr['fontColor'],
                    'fontSize': arr['fontSize'],
                    'fontType': arr['fontType'],
                    'minHeight': arr['minHeight'],
                    'maxHeight': arr['maxHeight'],
                    'minWidth': arr['minWidth'],
                    'maxWidth': arr['maxWidth'],
                    'nPort': arr['nPort'],
                    'ePort': arr['ePort'],
                    'sPort': arr['sPort'],
                    'wPort': arr['wPort'],
                    'image': arr['image'],
                    'imageWidth': arr['imageWidth'],
                    'imageHeight': arr['imageHeight'],
                    'draggable': arr['draggable'],
                    'resizable': arr['resizable'],
                    //'editable':arr['editable'],
                    'selectable': arr['selectable'],
                    'deletable': arr['deletable'],
                    'nPortMakeConnection': arr['nPortMakeConnection'],
                    'ePortMakeConnection': arr['ePortMakeConnection'],
                    'sPortMakeConnection': arr['sPortMakeConnection'],
                    'wPortMakeConnection': arr['wPortMakeConnection'],
                    'nPortAcceptConnection': arr['nPortAcceptConnection'],
                    'ePortAcceptConnection': arr['ePortAcceptConnection'],
                    'sPortAcceptConnection': arr['sPortAcceptConnection'],
                    'wPortAcceptConnection': arr['wPortAcceptConnection'],
                    'className': arr['className']
                }));
            }
        }
    });

    var portImage = self.imagesPath + 'redport.png';
    var activePortImage = self.imagesPath + 'greenport.png';
    var portStyle = "<style> ." + self.canvid + "port {width: 12px;height: 12px;border: 1px solid #000;background-color: red;background-image:url('" + portImage + "');background-repeat:repeat;visibility: hidden;cursor:pointer;} ." + self.canvid + "activeport {width: 12px;height: 12px;border: 1px solid #000;background-color: green;background-image:url('" + activePortImage + "');background-repeat:repeat;}</style>";
    $('body').append(portStyle);


    this.addNode = function (node) {
        var cls = '';
        var noclose_cls = ['default-nodes', 'text-nodes', 'invalid-nodes', 'menu-invalid-nodes', 'next_nodes'];

        var callerObj = this; cls = node.className;
        var container = '<div id="' + node.nodeId + '" parentid="' + node.parentid + '"  p_id="' + node.p_id + '"';
        container += 'class="ui-widget-content node ' + cls + '" style="width: ' + node.width + 'px; height: ' + node.height + 'px;left:' + node.xPosition + 'px; top:' + node.yPosition + 'px ;border:0px;">';
        container += '<table width="100%" height="100%" cellpadding=0 cellspacing=0>'
        container += '<tr><td colspan=3 width="100%" align=center valign=bottom ><div class="nodetext">' + node.nodeText + '</div></td></tr>';
        container += '<tr><td colspan=3 width="100%" align=center valign=bottom >';
        if (node.nPort)
            container += '<div id="' + node.nodeId + '_n" class="' + callerObj.canvasId + 'port"><img src="' + self.imagesPath + 'redport.png"></div>';
        else
            container += '<div style="width:12px;height:12px;overflow:hidden">&nbsp;</div>';
        container += '</td></tr><tr style="height: 100%;"><td width="1%" valign=middle align=right>';
        if (node.wPort)
            container += '<div id="' + node.nodeId + '_w" class="' + callerObj.canvasId + 'port"><img src="' + self.imagesPath + 'redport.png"></div>';
        else
            container += '<div style="width:12px;height:12px;overflow:hidden">&nbsp;</div>';
        container += '</td><td id="' + node.nodeId + '_content"  class="nodecontent" valign=top align=center style="';
        if (node.nodeType == 'TEXT' || node.nodeType == 'IMAGE')
            container += 'background: url(\'' + self.imagesPath + 'transparent.gif\') repeat; ';
        container += '">';
        if (node.nodeType == 'IMAGE')
            container += '<img id="' + node.nodeId + '_imagenode" src="' + node.image + '" width=' + node.imageWidth + 'px height=' + node.imageHeight + 'px border=0>';
        else
            if ($.inArray(cls, noclose_cls) < 0) {
               // if (node.nodeContent != "drop a control") {
                    container += "<div class='head-step'><div class='step-no' nodeid='" + node.nodeId + "' step='" + node.nodeId + "' nodeContent='"+ node.nodeContent +"'>" + node.nodeId + "</div>";
               // }
                container += "<a href='#' class='remove' name='" + node.nodeId + "'><i class='fa fa-times' style='font-size:12px;'></i></a>";
            }
        container += "</div>";
        container += "<div class='nodename'>" + node.nodeContent + "</div>";
        container += '</td><td width="1%" valign=middle align=left>';
        if (node.ePort)
            container += '<div id="' + node.nodeId + '_e" class="' + callerObj.canvasId + 'port"><img src="' + self.imagesPath + 'redport.png"></div>';
        else
            container += '<div style="width:12px;height:12px;overflow:hidden">&nbsp;</div>';
        container += '</td></tr><tr><td colspan=3 width="100%" align=center valign=top>';
        if (node.sPort)
            container += '<div id="' + node.nodeId + '_s" class="' + callerObj.canvasId + 'port"><img src="' + self.imagesPath + 'redport.png"></div>';
        else
            container += '<div style="width:12px;height:12px;overflow:hidden">&nbsp;</div>';
        container += '</td></tr></table></div>';

        var ports = "";
        if (node.nPort)
            ports += "#" + node.nodeId + "_n, ";
        if (node.ePort)
            ports += "#" + node.nodeId + "_e, ";
        if (node.sPort)
            ports += "#" + node.nodeId + "_s, ";
        if (node.wPort)
            ports += "#" + node.nodeId + "_w, ";
        if ((ports.charAt(ports.length - 2)) == ',') { ports = ports.substring(0, ports.length - 2); }
        $(callerObj.getCanvas).append(container);

        $("#" + node.nodeId + " a.remove").click(function (e) {
            e.stopPropagation();
            if (callerObj.onNodeDelete != null) { callerObj.onNodeDelete(this.name); }
            //if(confirm('Are you sure you want to delete this node ?'))
            //{
            //var prev_id=0;
            //callerObj.setNodeAffectedConnections(this.name);
            //var node = callerObj.getNodeById(this.name);
            //if(node.affectedConnections.length >0){prev_id=node.affectedConnections[0].nodeFrom}
            //if(callerObj.onBeforeDelete != null){callerObj.onBeforeDelete(this.name,prev_id);}
            //callerObj.deleteNode(this.name);
            //}
        });
        $("#" + node.nodeId).hover(function () {
            if (callerObj.hoverEffect) { $(ports).css("visibility", "visible") }
        }, function () { if (callerObj.hoverEffect) { $(ports).css("visibility", "hidden"); } });


        if (node.draggable) {
            $("#" + node.nodeId).draggable({ start: function (event, ui) { callerObj.setNodeAffectedConnections(node.nodeId); }, drag: function () { callerObj.redrawNodeAffectedConnections(node.nodeId); }, stop: function () { callerObj.updateNodeCoordinates(node.nodeId, $("#" + node.nodeId).position().left + $(callerObj.getCanvas).scrollLeft(), $("#" + node.nodeId).position().top + $(callerObj.getCanvas).scrollTop(), $("#" + node.nodeId).width(), $("#" + node.nodeId).height()) } });
        }

        if (node.resizable) {
            if (node.nodeType == 'IMAGE')
                $("#" + node.nodeId).resizable({ handles: "all", autoHide: true, alsoResize: "#" + node.nodeId + "_imagenode", maxHeight: node.maxHeight, maxWidth: node.maxWidth, minHeight: node.minHeight, minWidth: node.minWidth, start: function () { callerObj.setNodeAffectedConnections(node.nodeId) }, resize: function () { callerObj.redrawNodeAffectedConnections(node.nodeId) }, stop: function () { callerObj.updateNodeCoordinates(node.nodeId, $("#" + node.nodeId).position().left + $(callerObj.getCanvas).scrollLeft(), $("#" + node.nodeId).position().top + $(callerObj.getCanvas).scrollTop(), $("#" + node.nodeId).width(), $("#" + node.nodeId).height()) } });
            else
                $("#" + node.nodeId).resizable({ handles: "all", autoHide: true, maxHeight: node.maxHeight, maxWidth: node.maxWidth, minHeight: node.minHeight, minWidth: node.minWidth, start: function () { callerObj.setNodeAffectedConnections(node.nodeId) }, resize: function () { callerObj.redrawNodeAffectedConnections(node.nodeId) }, stop: function () { callerObj.updateNodeCoordinates(node.nodeId, $("#" + node.nodeId).position().left + $(callerObj.getCanvas).scrollLeft(), $("#" + node.nodeId).position().top + $(callerObj.getCanvas).scrollTop(), $("#" + node.nodeId).width(), $("#" + node.nodeId).height()) } });
        }
        if (node.selectable) {
            $("#" + node.nodeId).click(function (event, ui) { callerObj.selectNode(node.nodeId); });
        }


        if (node.nPort) {
            if (node.nPortMakeConnection) {
                $("#" + node.nodeId + "_n").draggable({
                    revert: true,
                    revertDuration: 1,
                    start: function () {
                        $("#" + node.nodeId + "").resizable('destroy');
                        $("#" + node.nodeId + "").draggable('destroy');
                        $("#" + node.nodeId + "").unbind('mouseenter mouseleave');
                        $("." + callerObj.canvasId + "port").css("visibility", "visible");
                        $("." + callerObj.canvasId + "port").fadeTo('fast', "0.5");
                        callerObj.hoverEffect = false;
                    },
                    drag: function () {
                        drawTempConnection("" + node.nodeId, (this.id + "").charAt((this.id + "").length - 1), $(this), callerObj, callerObj.tempLine);
                    },
                    stop: function () {
                        $(ports).css("visibility", "hidden");
                        $("." + callerObj.canvasId + "port").css("visibility", "hidden");
                        $("." + callerObj.canvasId + "port").fadeTo('fast', "1");
                        callerObj.hoverEffect = true;
                        $("#" + node.nodeId).hover(function () { if (callerObj.hoverEffect) { $(ports).css("visibility", "visible") } }, function () { if (callerObj.hoverEffect) { $(ports).css("visibility", "hidden"); } });
                        if (node.draggable) {
                            $("#" + node.nodeId).draggable({ start: function (event, ui) { callerObj.setNodeAffectedConnections(node.nodeId); }, drag: function () { callerObj.redrawNodeAffectedConnections(node.nodeId); }, stop: function () { callerObj.updateNodeCoordinates(node.nodeId, $("#" + node.nodeId).position().left + $(callerObj.getCanvas).scrollLeft(), $("#" + node.nodeId).position().top + $(callerObj.getCanvas).scrollTop(), $("#" + node.nodeId).width(), $("#" + node.nodeId).height()) } });
                        }
                        if (node.resizable) {
                            if (node.nodeType == 'IMAGE')
                                $("#" + node.nodeId).resizable({ handles: "all", autoHide: true, alsoResize: "#" + node.nodeId + "_imagenode", maxHeight: node.maxHeight, maxWidth: node.maxWidth, minHeight: node.minHeight, minWidth: node.minWidth, start: function () { callerObj.setNodeAffectedConnections(node.nodeId) }, resize: function () { callerObj.redrawNodeAffectedConnections(node.nodeId) }, stop: function () { callerObj.updateNodeCoordinates(node.nodeId, $("#" + node.nodeId).position().left + $(callerObj.getCanvas).scrollLeft(), $("#" + node.nodeId).position().top + $(callerObj.getCanvas).scrollTop(), $("#" + node.nodeId).width(), $("#" + node.nodeId).height()) } });
                            else
                                $("#" + node.nodeId).resizable({ handles: "all", autoHide: true, maxHeight: node.maxHeight, maxWidth: node.maxWidth, minHeight: node.minHeight, minWidth: node.minWidth, start: function () { callerObj.setNodeAffectedConnections(node.nodeId) }, resize: function () { callerObj.redrawNodeAffectedConnections(node.nodeId) }, stop: function () { callerObj.updateNodeCoordinates(node.nodeId, $("#" + node.nodeId).position().left + $(callerObj.getCanvas).scrollLeft(), $("#" + node.nodeId).position().top + $(callerObj.getCanvas).scrollTop(), $("#" + node.nodeId).width(), $("#" + node.nodeId).height()) } });
                        }
                        if (node.selectable) {
                            $("#" + node.nodeId).click(function (event, ui) { callerObj.selectNode(node.nodeId); });
                        }

                        callerObj.clearTempLine();
                    }
                });
            }
            if (node.nPortAcceptConnection) {
                $("#" + node.nodeId + "_n").droppable({
                    accept: "." + callerObj.canvasId + "port",
                    hoverClass: callerObj.canvasId + "activeport",
                    drop: function (event, ui) {
                        var sourceNode = $(ui.draggable).attr("id").substring(0, $(ui.draggable).attr("id").indexOf('_'));
                        var targetNode = $(this).attr("id").substring(0, $(this).attr("id").indexOf('_'));
                        var sourceNodePort = $(ui.draggable).attr("id");
                        var targetNodePort = $(this).attr("id");
                        callerObj.clearTempLine();
                        var connection = new Connection(sourceNode, sourceNodePort.charAt(sourceNodePort.length - 1), targetNode, targetNodePort.charAt(targetNodePort.length - 1), callerObj.connectionColor, callerObj.connectionWidth, '');
                        callerObj.addConnection(connection);
                    }
                });
            }

        } //if(node.nPort)

        if (node.ePort) {
            if (node.ePortMakeConnection) {
                $("#" + node.nodeId + "_e").draggable({
                    revert: true,
                    revertDuration: 1,
                    start: function () {
                        $("#" + node.nodeId + "").resizable('destroy');
                        $("#" + node.nodeId + "").draggable('destroy');
                        $("#" + node.nodeId + "").unbind('mouseenter mouseleave');
                        $("." + callerObj.canvasId + "port").css("visibility", "visible");
                        $("." + callerObj.canvasId + "port").fadeTo('fast', "0.5");
                        callerObj.hoverEffect = false;
                    },
                    drag: function () {
                        drawTempConnection("" + node.nodeId, (this.id + "").charAt((this.id + "").length - 1), $(this), callerObj, callerObj.tempLine);
                    },
                    stop: function () {
                        $(ports).css("visibility", "hidden");
                        $("." + callerObj.canvasId + "port").css("visibility", "hidden");
                        $("." + callerObj.canvasId + "port").fadeTo('fast', "1");
                        callerObj.hoverEffect = true;
                        $("#" + node.nodeId).hover(function () { if (callerObj.hoverEffect) { $(ports).css("visibility", "visible") } }, function () { if (callerObj.hoverEffect) { $(ports).css("visibility", "hidden"); } });
                        if (node.draggable) {
                            $("#" + node.nodeId).draggable({ start: function (event, ui) { callerObj.setNodeAffectedConnections(node.nodeId); }, drag: function () { callerObj.redrawNodeAffectedConnections(node.nodeId); }, stop: function () { callerObj.updateNodeCoordinates(node.nodeId, $("#" + node.nodeId).position().left + $(callerObj.getCanvas).scrollLeft(), $("#" + node.nodeId).position().top + $(callerObj.getCanvas).scrollTop(), $("#" + node.nodeId).width(), $("#" + node.nodeId).height()) } });
                        }
                        if (node.resizable) {
                            if (node.nodeType == 'IMAGE')
                                $("#" + node.nodeId).resizable({ handles: "all", autoHide: true, alsoResize: "#" + node.nodeId + "_imagenode", maxHeight: node.maxHeight, maxWidth: node.maxWidth, minHeight: node.minHeight, minWidth: node.minWidth, start: function () { callerObj.setNodeAffectedConnections(node.nodeId) }, resize: function () { callerObj.redrawNodeAffectedConnections(node.nodeId) }, stop: function () { callerObj.updateNodeCoordinates(node.nodeId, $("#" + node.nodeId).position().left + $(callerObj.getCanvas).scrollLeft(), $("#" + node.nodeId).position().top + $(callerObj.getCanvas).scrollTop(), $("#" + node.nodeId).width(), $("#" + node.nodeId).height()) } });
                            else
                                $("#" + node.nodeId).resizable({ handles: "all", autoHide: true, maxHeight: node.maxHeight, maxWidth: node.maxWidth, minHeight: node.minHeight, minWidth: node.minWidth, start: function () { callerObj.setNodeAffectedConnections(node.nodeId) }, resize: function () { callerObj.redrawNodeAffectedConnections(node.nodeId) }, stop: function () { callerObj.updateNodeCoordinates(node.nodeId, $("#" + node.nodeId).position().left + $(callerObj.getCanvas).scrollLeft(), $("#" + node.nodeId).position().top + $(callerObj.getCanvas).scrollTop(), $("#" + node.nodeId).width(), $("#" + node.nodeId).height()) } });
                        }
                        if (node.selectable) {
                            $("#" + node.nodeId).click(function (event, ui) { callerObj.selectNode(node.nodeId); });
                        }
                        callerObj.clearTempLine();
                    }
                });
            }
            if (node.ePortAcceptConnection) {
                $("#" + node.nodeId + "_e").droppable({
                    accept: "." + callerObj.canvasId + "port",
                    hoverClass: callerObj.canvasId + "activeport",
                    drop: function (event, ui) {
                        var sourceNode = $(ui.draggable).attr("id").substring(0, $(ui.draggable).attr("id").indexOf('_'));
                        var targetNode = $(this).attr("id").substring(0, $(this).attr("id").indexOf('_'));
                        var sourceNodePort = $(ui.draggable).attr("id");
                        var targetNodePort = $(this).attr("id");
                        callerObj.clearTempLine();
                        var connection = new Connection(sourceNode, sourceNodePort.charAt(sourceNodePort.length - 1), targetNode, targetNodePort.charAt(targetNodePort.length - 1), callerObj.connectionColor, callerObj.connectionWidth, '');
                        callerObj.addConnection(connection);
                    }
                });
            }
        } //if(node.ePort)


        if (node.sPort) {
            if (node.sPortMakeConnection) {
                $("#" + node.nodeId + "_s").draggable({
                    revert: true,
                    revertDuration: 1,
                    start: function () {
                        $("#" + node.nodeId + "").resizable('destroy');
                        $("#" + node.nodeId + "").draggable('destroy');
                        $("#" + node.nodeId + "").unbind('mouseenter mouseleave');
                        $("." + callerObj.canvasId + "port").css("visibility", "visible");
                        $("." + callerObj.canvasId + "port").fadeTo('fast', "0.5");
                        callerObj.hoverEffect = false;
                    },
                    drag: function () {
                        drawTempConnection("" + node.nodeId, (this.id + "").charAt((this.id + "").length - 1), $(this), callerObj, callerObj.tempLine);
                    },
                    stop: function () {
                        $(ports).css("visibility", "hidden");
                        $("." + callerObj.canvasId + "port").css("visibility", "hidden");
                        $("." + callerObj.canvasId + "port").fadeTo('fast', "1");
                        callerObj.hoverEffect = true;
                        $("#" + node.nodeId).hover(function () { if (callerObj.hoverEffect) { $(ports).css("visibility", "visible") } }, function () { if (callerObj.hoverEffect) { $(ports).css("visibility", "hidden"); } });
                        if (node.draggable) {
                            $("#" + node.nodeId).draggable({ start: function (event, ui) { callerObj.setNodeAffectedConnections(node.nodeId); }, drag: function () { callerObj.redrawNodeAffectedConnections(node.nodeId); }, stop: function () { callerObj.updateNodeCoordinates(node.nodeId, $("#" + node.nodeId).position().left + $(callerObj.getCanvas).scrollLeft(), $("#" + node.nodeId).position().top + $(callerObj.getCanvas).scrollTop(), $("#" + node.nodeId).width(), $("#" + node.nodeId).height()) } });
                        }
                        if (node.resizable) {
                            if (node.nodeType == 'IMAGE')
                                $("#" + node.nodeId).resizable({ handles: "all", autoHide: true, alsoResize: "#" + node.nodeId + "_imagenode", maxHeight: node.maxHeight, maxWidth: node.maxWidth, minHeight: node.minHeight, minWidth: node.minWidth, start: function () { callerObj.setNodeAffectedConnections(node.nodeId) }, resize: function () { callerObj.redrawNodeAffectedConnections(node.nodeId) }, stop: function () { callerObj.updateNodeCoordinates(node.nodeId, $("#" + node.nodeId).position().left + $(callerObj.getCanvas).scrollLeft(), $("#" + node.nodeId).position().top + $(callerObj.getCanvas).scrollTop(), $("#" + node.nodeId).width(), $("#" + node.nodeId).height()) } });
                            else
                                $("#" + node.nodeId).resizable({ handles: "all", autoHide: true, maxHeight: node.maxHeight, maxWidth: node.maxWidth, minHeight: node.minHeight, minWidth: node.minWidth, start: function () { callerObj.setNodeAffectedConnections(node.nodeId) }, resize: function () { callerObj.redrawNodeAffectedConnections(node.nodeId) }, stop: function () { callerObj.updateNodeCoordinates(node.nodeId, $("#" + node.nodeId).position().left + $(callerObj.getCanvas).scrollLeft(), $("#" + node.nodeId).position().top + $(callerObj.getCanvas).scrollTop(), $("#" + node.nodeId).width(), $("#" + node.nodeId).height()) } });
                        }
                        if (node.selectable) {
                            $("#" + node.nodeId).click(function (event, ui) { callerObj.selectNode(node.nodeId); });
                        }
                        callerObj.clearTempLine();
                    }
                });
            }
            if (node.sPortAcceptConnection) {
                $("#" + node.nodeId + "_s").droppable({
                    accept: "." + callerObj.canvasId + "port",
                    hoverClass: callerObj.canvasId + "activeport",
                    drop: function (event, ui) {
                        var sourceNode = $(ui.draggable).attr("id").substring(0, $(ui.draggable).attr("id").indexOf('_'));
                        var targetNode = $(this).attr("id").substring(0, $(this).attr("id").indexOf('_'));
                        var sourceNodePort = $(ui.draggable).attr("id");
                        var targetNodePort = $(this).attr("id");
                        callerObj.clearTempLine();
                        var connection = new Connection(sourceNode, sourceNodePort.charAt(sourceNodePort.length - 1), targetNode, targetNodePort.charAt(targetNodePort.length - 1), callerObj.connectionColor, callerObj.connectionWidth, '');
                        callerObj.addConnection(connection);
                    }
                });
            }
        } //if(node.nPort)


        if (node.wPort) {
            if (node.wPortMakeConnection) {
                $("#" + node.nodeId + "_w").draggable({
                    revert: true,
                    revertDuration: 1,
                    start: function () {
                        $("#" + node.nodeId + "").resizable('destroy');
                        $("#" + node.nodeId + "").draggable('destroy');
                        $("#" + node.nodeId + "").unbind('mouseenter mouseleave');
                        $("." + callerObj.canvasId + "port").css("visibility", "visible");
                        $("." + callerObj.canvasId + "port").fadeTo('fast', "0.5");
                        callerObj.hoverEffect = false;
                    },
                    drag: function () {
                        drawTempConnection("" + node.nodeId, (this.id + "").charAt((this.id + "").length - 1), $(this), callerObj, callerObj.tempLine);
                    },
                    stop: function () {
                        $(ports).css("visibility", "hidden");
                        $("." + callerObj.canvasId + "port").css("visibility", "hidden");
                        $("." + callerObj.canvasId + "port").fadeTo('fast', "1");
                        callerObj.hoverEffect = true;
                        $("#" + node.nodeId).hover(function () { if (callerObj.hoverEffect) { $(ports).css("visibility", "visible") } }, function () { if (callerObj.hoverEffect) { $(ports).css("visibility", "hidden"); } });
                        if (node.draggable) {
                            $("#" + node.nodeId).draggable({ start: function (event, ui) { callerObj.setNodeAffectedConnections(node.nodeId); }, drag: function () { callerObj.redrawNodeAffectedConnections(node.nodeId); }, stop: function () { callerObj.updateNodeCoordinates(node.nodeId, $("#" + node.nodeId).position().left + $(callerObj.getCanvas).scrollLeft(), $("#" + node.nodeId).position().top + $(callerObj.getCanvas).scrollTop(), $("#" + node.nodeId).width(), $("#" + node.nodeId).height()) } });
                        }
                        if (node.resizable) {
                            if (node.nodeType == 'IMAGE')
                                $("#" + node.nodeId).resizable({ handles: "all", autoHide: true, alsoResize: "#" + node.nodeId + "_imagenode", maxHeight: node.maxHeight, maxWidth: node.maxWidth, minHeight: node.minHeight, minWidth: node.minWidth, start: function () { callerObj.setNodeAffectedConnections(node.nodeId) }, resize: function () { callerObj.redrawNodeAffectedConnections(node.nodeId) }, stop: function () { callerObj.updateNodeCoordinates(node.nodeId, $("#" + node.nodeId).position().left + $(callerObj.getCanvas).scrollLeft(), $("#" + node.nodeId).position().top + $(callerObj.getCanvas).scrollTop(), $("#" + node.nodeId).width(), $("#" + node.nodeId).height()) } });
                            else
                                $("#" + node.nodeId).resizable({ handles: "all", autoHide: true, maxHeight: node.maxHeight, maxWidth: node.maxWidth, minHeight: node.minHeight, minWidth: node.minWidth, start: function () { callerObj.setNodeAffectedConnections(node.nodeId) }, resize: function () { callerObj.redrawNodeAffectedConnections(node.nodeId) }, stop: function () { callerObj.updateNodeCoordinates(node.nodeId, $("#" + node.nodeId).position().left + $(callerObj.getCanvas).scrollLeft(), $("#" + node.nodeId).position().top + $(callerObj.getCanvas).scrollTop(), $("#" + node.nodeId).width(), $("#" + node.nodeId).height()) } });
                        }
                        if (node.selectable) {
                            $("#" + node.nodeId).click(function (event, ui) { callerObj.selectNode(node.nodeId); });
                        }
                        callerObj.clearTempLine();
                    }
                });
            }
            if (node.wPortAcceptConnection) {
                $("#" + node.nodeId + "_w").droppable({
                    accept: "." + callerObj.canvasId + "port",
                    hoverClass: callerObj.canvasId + "activeport",
                    drop: function (event, ui) {
                        var sourceNode = $(ui.draggable).attr("id").substring(0, $(ui.draggable).attr("id").indexOf('_'));
                        var targetNode = $(this).attr("id").substring(0, $(this).attr("id").indexOf('_'));
                        var sourceNodePort = $(ui.draggable).attr("id");
                        var targetNodePort = $(this).attr("id");
                        callerObj.clearTempLine();
                        var connection = new Connection(sourceNode, sourceNodePort.charAt(sourceNodePort.length - 1), targetNode, targetNodePort.charAt(targetNodePort.length - 1), callerObj.connectionColor, callerObj.connectionWidth, '');
                        callerObj.addConnection(connection);
                    }
                });
            }
        } //if(node.nPort)


        //if(node.editable)
        //$("#"+node.nodeId+"_content").editable(node.nodeId,callerObj);				

        this.nodes[this.nodes.length] = node;
    };

    this.addConnection = function (connection) {
        caller = this;
        var connectionId = "" + new Date().getTime() + Math.floor(Math.random() * 11111);
        var connectionDiv = '<div id="' + connectionId + '" ></div>';
        $(caller.getCanvas).append(connectionDiv);
        var connectionLine = new jsGraphics(document.getElementById(connectionId));
        $("#" + connectionId).click(function () { caller.deleteConnection(connectionId) });
        connectionLine.setColor(connection.color);
        connectionLine.setStroke(connection.stroke);
        connection.line = connectionLine;
        connection.connectionId = connectionId;
        this.connections[this.connections.length] = connection;
        drawConnection(connection.nodeFrom, connection.nodeTo, connection.portFrom, connection.portTo, connection.line, caller);
        //if (errchk == 1) {
        //    return false;
        //}
        $('#' + connection.nodeTo).attr("fromnode", connection.nodeFrom);
    };

    this.deleteConnection = function (nodeId) {
        deleteCon = [];
        for (i = 0; i < this.connections.length; i++) {
            //alert("connection:" + this.connections[i].nodeFrom);
            //alert("node:" + nodeId);
            if (this.connections[i].nodeFrom == nodeId) {
                this.connections[i].line.clear();
                this.connections.splice(i,1);
            }
        }
       
        //if(confirm('delete this connection ...'))
        //{
        	//var conn='';
        	//for(i=0;i<this.connections.length;i++)
        	//{
        	//    alert(this.connections.length);
        	//	if(this.connections[i].connectionId==connectionId)
        	//	{
        	//	    alert(this.connections[i].connectionId);
        	//	    alert(connectionId);
        	//		this.connections[i].line.clear();
        	//		this.connections.splice(i,1);
        	//		break;
        	//	}
        	//}			
        //}		
    };

    this.setNodeAffectedConnections = function (nodeId) {
        affected = [];
        for (i = 0; i < this.connections.length; i++)
            if (this.connections[i].nodeFrom == nodeId || this.connections[i].nodeTo == nodeId)
                affected.push(this.connections[i]);

        for (i = 0; i < this.nodes.length; i++)
            if (this.nodes[i].nodeId == nodeId)
                this.nodes[i].affectedConnections = affected;

    };

    this.redrawNodeAffectedConnections = function (nodeId) {
        var caller = this;
        var node = '';
        for (i = 0; i < this.nodes.length; i++)
            if (this.nodes[i].nodeId == nodeId)
                node = this.nodes[i];

        var affectedConnections = node.affectedConnections;
       
        for (i = 0; i < affectedConnections.length; i++) {
            drawConnection(affectedConnections[i].nodeFrom, affectedConnections[i].nodeTo, affectedConnections[i].portFrom, affectedConnections[i].portTo, affectedConnections[i].line, caller);
        }

    };

    this.selectNode = function (nodeId) {
        //this.clearSelection();
        for (i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].nodeId == nodeId) {
                if ($("#" + this.nodes[i].nodeId + "_content").hasClass("selected")) {
                    this.nodes[i].isSelected = false;
                    $("#" + this.nodes[i].nodeId + "_content").removeClass("selected");
                }
                else {
                    this.nodes[i].isSelected = true;
                    $(".nodecontent.selected").removeClass("selected");
                    if ($('#' + this.nodes[i].nodeId).hasClass("next-step")) { $("#" + this.nodes[i].nodeId + "_content").addClass("selected"); }
                }
                if (this.onSelect != null) {
                    this.onSelect(nodeId);
                }
            }
        }
    };

    this.clearSelection = function () {
        for (i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].isSelected) {
                //this.nodes[i].isSelected=false;
                //$("#"+this.nodes[i].nodeId+"_content").removeClass("selected");
            }
        }
    };


    this.getSelectedNodes = function () {
        var selections = [];
        for (i = 0; i < this.nodes.length; i++)
            if (this.nodes[i].isSelected)
                selections.push(this.nodes[i]);
        return selections;
    };



    this.updateNodeCoordinates = function (nodeId, xPosition, yPosition, width, height) {
        var node = this.getNodeById(nodeId);
        node.xPosition = xPosition;
        node.yPosition = yPosition;
        node.width = width;
        node.height = height;
    };

    this.updateChildNodes = function (nodeId, childnodes) {
        var node = this.getNodeById(nodeId);
        node.childNodes = childnodes;
    };

    this.updateClassName = function (nodeId, classname) {
        var node = this.getNodeById(nodeId);
        node.className = classname;
    };

    this.updateNodeBGColor = function (nodeId, bgcolor) {
        var node = this.getNodeById(nodeId);
        node.bgColor = bgcolor;
        $("#" + nodeId + "_content").css('background-color', bgcolor);
    };

    this.updateNodeBorderColor = function (nodeId, bordercolor) {
        var node = this.getNodeById(nodeId);
        node.borderColor = bordercolor;
        $("#" + nodeId + "_content").css('border-color', bordercolor);
    };

    this.updateNodeBorderWidth = function (nodeId, borderWidth) {
        var node = this.getNodeById(nodeId);
        node.borderWidth = borderWidth;
        $("#" + nodeId + "_content").css('border-width', borderWidth);
    };

    this.updateNodeFontColor = function (nodeId, fontColor) {
        var node = this.getNodeById(nodeId);
        node.fontColor = fontColor;
        $("#" + nodeId + "_content").css('color', fontColor);

    };

    this.updateNodeFontSize = function (nodeId, fontSize) {
        var node = this.getNodeById(nodeId);
        node.fontSize = fontSize;
        $("#" + nodeId + "_content").css('font-size', fontSize);
    };


    this.updateNodeFontType = function (nodeId, fontType) {
        var node = this.getNodeById(nodeId);
        node.fontType = fontType;
        $("#" + nodeId + "_content").css('font-family', fontType);
    };


    this.updateNodeContent = function (nodeId, nodeContent) {
        var node = this.getNodeById(nodeId);
        node.nodeContent = nodeContent;
    };

    this.updateNodeText = function (nodeId, nodeText) {
        var node = this.getNodeById(nodeId);
        node.nodeText = nodeText;
    };

    this.updateSelectedNodesBGColor = function (bgcolor) {
        var selectedNodes = this.getSelectedNodes();
        for (index = 0; index < selectedNodes.length; index++) {
            this.updateNodeBGColor(selectedNodes[index].nodeId, bgcolor);
        }
    };


    this.updateSelectedNodesBorderColor = function (bordercolor) {
        var selectedNodes = this.getSelectedNodes();
        for (index = 0; index < selectedNodes.length; index++) {
            this.updateNodeBorderColor(selectedNodes[index].nodeId, bordercolor);
        }
    };

    this.updateSelectedNodesBorderWidth = function (borderWidth) {
        var selectedNodes = this.getSelectedNodes();
        for (index = 0; index < selectedNodes.length; index++) {
            this.updateNodeBorderWidth(selectedNodes[index].nodeId, borderWidth);
        }
    };

    this.updateSelectedNodesFontColor = function (fontcolor) {
        var selectedNodes = this.getSelectedNodes();
        for (index = 0; index < selectedNodes.length; index++) {
            this.updateNodeFontColor(selectedNodes[index].nodeId, fontcolor);
        }
    };

    this.updateSelectedNodesFontSize = function (fontSize) {
        var selectedNodes = this.getSelectedNodes();
        for (index = 0; index < selectedNodes.length; index++) {
            this.updateNodeFontSize(selectedNodes[index].nodeId, fontSize);
        }
    };

    this.updateSelectedNodesFontType = function (fontType) {
        var selectedNodes = this.getSelectedNodes();
        for (index = 0; index < selectedNodes.length; index++) {
            this.updateNodeFontType(selectedNodes[index].nodeId, fontType);
        }
    };


    this.deleteSelectedNodes = function () {
        var selectedNodes = this.getSelectedNodes();
        if (selectedNodes.length > 0) {
            if (confirm("Selected nodes will be deleted, continue ...")) {
                for (index = 0; index < selectedNodes.length; index++) {

                    this.deleteNode(selectedNodes[index].nodeId);
                }
            }
        }

    };


    this.deleteNode = function (nodeId) {
        var del_nodes = [];
        this.setNodeAffectedConnections(nodeId);
        var node = this.getNodeById(nodeId);
        var nodeType = node.nodeType;

        for (i = 0; i < node.affectedConnections.length; i++) {
            for (j = 0; j < this.connections.length; j++) {
                if (this.connections[j].nodeFrom == node.affectedConnections[i].nodeFrom && this.connections[j].nodeTo == node.affectedConnections[i].nodeTo && this.connections[j].portFrom == node.affectedConnections[i].portFrom && this.connections[j].portTo == node.affectedConnections[i].portTo) {
                    this.connections[j].line.clear();
                    this.connections.splice(j, 1);
                    break;
                }
            }

            if (parseInt(node.affectedConnections[i].nodeTo) > nodeId) { del_nodes.push(node.affectedConnections[i].nodeTo); }

        }

        for (i = 0; i < this.nodes.length; i++)
            if (this.nodes[i].nodeId == nodeId)
                this.nodes.splice(i, 1);

        $("#" + nodeId).remove();
        for (var k = 0; k < del_nodes.length; k++) {
            this.deleteDependentNodes(del_nodes[k]);
        }
        if (this.onDelete != null) {
            this.onDelete(nodeId);
        }


    };

    this.deleteDependentNodes = function (nodeId) {
        var del_nodes = [];
        this.setNodeAffectedConnections(nodeId);
        var node = this.getNodeById(nodeId);
        var nodeType = node.nodeType;
        for (i = 0; i < node.affectedConnections.length; i++) {
            for (j = 0; j < this.connections.length; j++) {
                if (this.connections[j].nodeFrom == node.affectedConnections[i].nodeFrom && this.connections[j].nodeTo == node.affectedConnections[i].nodeTo && this.connections[j].portFrom == node.affectedConnections[i].portFrom && this.connections[j].portTo == node.affectedConnections[i].portTo) {
                    this.connections[j].line.clear();
                    this.connections.splice(j, 1);
                    break;
                }
            }
            if (parseInt(node.affectedConnections[i].nodeTo) > nodeId) { del_nodes.push(node.affectedConnections[i].nodeTo); }
        }

        for (i = 0; i < this.nodes.length; i++)
            if (this.nodes[i].nodeId == nodeId)
                this.nodes.splice(i, 1);

        if ($("#" + nodeId).length > 0) { $("#" + nodeId).remove(); }
        for (var k = 0; k < del_nodes.length; k++) {
            this.deleteDependentNodes(del_nodes[k]);
        }
        if (this.onDelete != null) {
            this.onDelete(nodeId);
        }
    };



    this.getNodeById = function (nodeId) {
        for (var i = 0; i < this.nodes.length; i++)
            if (this.nodes[i].nodeId == nodeId)
                return this.nodes[i];
    };

    this.getNodes = function () {
        for (var i = 0; i < this.nodes.length; i++)
          //  if (this.nodes[i].nodeId == nodeId)
                return this.nodes[i];
    };

    this.toXML = function () {
        var xml = "<diagram id='" + $(this.getCanvas).attr('id') + "' >\n"; // needs to be closed at the end
        for (i = 0; i < this.nodes.length; i++)
            xml += "<node nodeId='" + this.nodes[i].nodeId + "' nodeText='" + this.nodes[i].nodeText + "' nodeType='" + this.nodes[i].nodeType + "' nodeContent='" + this.nodes[i].nodeContent + "' className='" + this.nodes[i].className + "' parentid='" + this.nodes[i].parentid + "' xPosition='" + this.nodes[i].xPosition + "' yPosition='" + this.nodes[i].yPosition + "' width='" + this.nodes[i].width + "' height='" + this.nodes[i].height + "' bgColor='" + this.nodes[i].bgColor + "' borderColor='" + this.nodes[i].borderColor + "' borderWidth='" + this.nodes[i].borderWidth + "' fontColor='" + this.nodes[i].fontColor + "' fontSize='" + this.nodes[i].fontSize + "' fontType='" + this.nodes[i].fontType + "' minHeight='" + this.nodes[i].minHeight + "' maxHeight='" + this.nodes[i].maxHeight + "' minWidth='" + this.nodes[i].minWidth + "' maxWidth='" + this.nodes[i].maxWidth + "' nPort='" + this.nodes[i].nPort + "' ePort='" + this.nodes[i].ePort + "' sPort='" + this.nodes[i].sPort + "' wPort='" + this.nodes[i].wPort + "' nPortMakeConnection='" + this.nodes[i].nPortMakeConnection + "' ePortMakeConnection='" + this.nodes[i].ePortMakeConnection + "' sPortMakeConnection='" + this.nodes[i].sPortMakeConnection + "' wPortMakeConnection='" + this.nodes[i].wPortMakeConnection + "' nPortAcceptConnection='" + this.nodes[i].nPortAcceptConnection + "' ePortAcceptConnection='" + this.nodes[i].ePortAcceptConnection + "' sPortAcceptConnection='" + this.nodes[i].sPortAcceptConnection + "' wPortAcceptConnection='" + this.nodes[i].wPortAcceptConnection + "' image='" + this.nodes[i].image + "' imageWidth='" + this.nodes[i].imageWidth + "' imageHeight='" + this.nodes[i].imageHeight + "' draggable='" + this.nodes[i].draggable + "' resizable='" + this.nodes[i].resizable + "' selectable='" + this.nodes[i].selectable + "' deletable='" + this.nodes[i].deletable + "' childNodes='" + this.nodes[i].childNodes + "' p_id='" + this.nodes[i].p_id + "' />\n";


        for (i = 0; i < this.connections.length; i++)
            xml += "<connection connectionId='" + this.connections[i].connectionId + "' nodeFrom='" + this.connections[i].nodeFrom + "' nodeTo='" + this.connections[i].nodeTo + "' nodeText='" + this.connections[i].nodeText + "' portFrom='" + this.connections[i].portFrom + "' portTo='" + this.connections[i].portTo + "' color='" + this.connections[i].color + "' stroke='" + this.connections[i].stroke + "'/>\n";

        xml += "</diagram>";
        if (this.onSave != null) { this.onSave(xml); }

    };


    this.setTempLine = function (tempLine) {
        this.tempLine = tempLine;
    };

    this.clearTempLine = function () {
        this.tempLine.clear();
    };
};

