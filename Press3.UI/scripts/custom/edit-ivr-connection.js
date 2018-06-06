function drawConnection(sourceNode, targetNode, sourcePort, targetPort, line, canvasobj) {

    sourcePort = sourceNode + "_" + sourcePort;
    targetPort = targetNode + "_" + targetPort;



    var startx = $("#" + sourcePort).position().left + $("#" + sourceNode).position().left + $(canvasobj.getCanvas).scrollLeft();
    var starty = $("#" + sourcePort).position().top + $("#" + sourceNode).position().top + $(canvasobj.getCanvas).scrollTop();
    var endx = $("#" + targetPort).position().left + $("#" + targetNode).position().left + $(canvasobj.getCanvas).scrollLeft();
    var endy = $("#" + targetPort).position().top + $("#" + targetNode).position().top + $(canvasobj.getCanvas).scrollTop();
    var sourceNodeX = $("#" + sourceNode).position().left + $(canvasobj.getCanvas).scrollLeft();
    var sourceNodeY = $("#" + sourceNode).position().top + $(canvasobj.getCanvas).scrollTop();
    var sourceNodeWidth = $("#" + sourceNode).width();
    var sourceNodeHeight = $("#" + sourceNode).height();
    var halfSourceNodeWidth = Math.floor(sourceNodeWidth / 2);
    var halfSourceNodeHeight = Math.floor(sourceNodeHeight / 2);
    var targetNodeX = $("#" + targetNode).position().left + 10 + $(canvasobj.getCanvas).scrollLeft();
    var targetNodeY = $("#" + targetNode).position().top + 10 + $(canvasobj.getCanvas).scrollTop();
    var targetNodeWidth = $("#" + targetNode).width();
    var targetNodeHeight = $("#" + targetNode).height();
    var halfTargetNodeWidth = Math.floor(targetNodeWidth / 2);
    var halfTargetNodeHeight = Math.floor(targetNodeHeight / 2);
    var zone;
    var sourcePortNumber;
    var targetPortNumber;
    var halfVerticalDistance;
    var halfHorizontalDistance;
    var maxRightDistance = ((sourceNodeX + sourceNodeWidth) > (targetNodeX + targetNodeWidth)) ? sourceNodeX + sourceNodeWidth : targetNodeX + targetNodeWidth;
    var minLeftDistance = (sourceNodeX < targetNodeX) ? sourceNodeX : targetNodeX;
    var minTopDistance = (sourceNodeY < targetNodeY) ? sourceNodeY : targetNodeY;
    var maxBottomDistance = ((sourceNodeY + sourceNodeHeight) > (targetNodeY + targetNodeHeight)) ? sourceNodeY + sourceNodeHeight : targetNodeY + targetNodeHeight;


    if (sourcePort.match(/_n$/)) {
        sourcePortNumber = 1;
    } else if (sourcePort.match(/_e$/)) {
        sourcePortNumber = 2;
    } else if (sourcePort.match(/_s$/)) {
        sourcePortNumber = 3;
    } else if (sourcePort.match(/_w$/)) {
        sourcePortNumber = 4;
    }

    if (targetPort.match(/_n$/)) {
        targetPortNumber = 1;
    } else if (targetPort.match(/_e$/)) {
        targetPortNumber = 2;
    } else if (targetPort.match(/_s$/)) {
        targetPortNumber = 3;
    } else if (targetPort.match(/_w$/)) {
        targetPortNumber = 4;
    }

    var connectionType = parseInt(sourcePortNumber + "" + targetPortNumber);

    if (endx <= (sourceNodeX + halfSourceNodeWidth)) {
        if (endy <= (sourceNodeY + halfSourceNodeHeight)) // Top Left Corner
        {
            if (endy <= sourceNodeY) // z8, z1a
            {
                if (endy >= sourceNodeY - 10 && endx > sourceNodeX) {
                    zone = "Z1A10";
                } else {
                    if (endx <= sourceNodeX - 10) {
                        zone = "Z8";
                        switch (connectionType) {
                            case 11:
                                zone = "NN ---> Z8";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15, endx, minTopDistance - 15);
                                line.drawLine(endx, minTopDistance - 15, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 12:
                                zone = "NE ---> Z8";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, endy);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx - 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 13:
                                zone = "NS ---> Z8";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), endx, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine(endx, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 14:
                                zone = "NW ---> Z8";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), targetNodeX - 10, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine(targetNodeX - 10, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), targetNodeX - 10, endy);
                                line.drawLine(targetNodeX - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 21:
                                zone = "EN ---> Z8";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, minTopDistance - 10);
                                line.drawLine(maxRightDistance + 10, minTopDistance - 10, endx, minTopDistance - 10);
                                line.drawLine(endx, minTopDistance - 10, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 22:
                                zone = "EE ---> Z8";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, endy);
                                line.drawLine(maxRightDistance + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 23:
                                zone = "ES ---> Z8";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(endx, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 24:
                                zone = "EW ---> Z8";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(targetNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX - 10, endy);
                                line.drawLine(targetNodeX - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 31:
                                zone = "SN ---> Z8";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 15, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy - 10);
                                line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy - 10, endx, endy - 10);
                                line.drawLine(endx, endy - 10, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();

                                break;
                            case 32:
                                zone = "SE ---> Z8";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy);
                                line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 33:
                                zone = "SS ---> Z8";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                                line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 34:
                                zone = "SW ---> Z8";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, minLeftDistance - 10, maxBottomDistance + 10);
                                line.drawLine(minLeftDistance - 10, maxBottomDistance + 10, minLeftDistance - 10, endy);
                                line.drawLine(minLeftDistance - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 41:
                                zone = "WN ---> Z8";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), targetNodeY - 10);
                                line.drawLine(sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), targetNodeY - 10, endx, targetNodeY - 10);
                                line.drawLine(endx, targetNodeY - 10, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 42:
                                zone = "WE ---> Z8";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, (targetNodeX + targetNodeWidth) + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy);
                                line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 43:
                                zone = "WS ---> Z8";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, endx, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(endx, sourceNodeY + halfSourceNodeHeight, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 44:
                                zone = "WW ---> Z8";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, endy);
                                line.drawLine(minLeftDistance - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;

                        }

                    } else {
                        zone = "Z1A";
                        switch (connectionType) {
                            case 11:
                                zone = "NN ---> Z1A";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY - 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY - 10, minLeftDistance - 10, sourceNodeY - 10);
                                line.drawLine(minLeftDistance - 10, sourceNodeY - 10, minLeftDistance - 10, endy - 10);
                                line.drawLine(minLeftDistance - 10, endy - 10, endx, endy - 10);
                                line.drawLine(endx, endy - 10, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 12:
                                zone = "NE ---> Z1A";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, endy);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx - 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 13:
                                zone = "NS ---> Z1A";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), endx, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine(endx, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 14:
                                zone = "NW ---> Z1A";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), targetNodeX - 10, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine(targetNodeX - 10, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), targetNodeX - 10, endy);
                                line.drawLine(targetNodeX - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 21:
                                zone = "EN ---> Z1A";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, minTopDistance - 10);
                                line.drawLine(maxRightDistance + 10, minTopDistance - 10, endx, minTopDistance - 10);
                                line.drawLine(endx, minTopDistance - 10, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 22:
                                zone = "EE ---> Z1A";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, endy);
                                line.drawLine(maxRightDistance + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 23:
                                zone = "ES ---> Z1A";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(endx, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 24:
                                zone = "EW ---> Z1A";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(targetNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX - 10, endy);
                                line.drawLine(targetNodeX - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 31:
                                zone = "SN ---> Z1A";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 15, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, minLeftDistance - 10, sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine(minLeftDistance - 10, sourceNodeY + sourceNodeHeight + 10, minLeftDistance - 10, minTopDistance - 10);
                                line.drawLine(minLeftDistance - 10, minTopDistance - 10, endx, minTopDistance - 10);
                                line.drawLine(endx, minTopDistance - 10, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 32:
                                zone = "SE ---> Z1A";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, maxRightDistance + 10, maxBottomDistance + 10);
                                line.drawLine(maxRightDistance + 10, maxBottomDistance + 10, maxRightDistance + 10, endy);
                                line.drawLine(maxRightDistance + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 33:
                                zone = "SS ---> Z1A";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, sourceNodeX - 10, sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine(sourceNodeX - 10, sourceNodeY + sourceNodeHeight + 10, sourceNodeX - 10, targetNodeY + targetNodeHeight + 10);
                                line.drawLine(sourceNodeX - 10, targetNodeY + targetNodeHeight + 10, endx, targetNodeY + targetNodeHeight + 10);
                                line.drawLine(endx, targetNodeY + targetNodeHeight + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 34:
                                zone = "SW ---> Z1A";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, minLeftDistance - 10, maxBottomDistance + 10);
                                line.drawLine(minLeftDistance - 10, maxBottomDistance + 10, minLeftDistance - 10, endy);
                                line.drawLine(minLeftDistance - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 41:
                                zone = "WN ---> Z1A";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, minTopDistance - 10);
                                line.drawLine(minLeftDistance - 10, minTopDistance - 10, endx, minTopDistance - 10);
                                line.drawLine(endx, minTopDistance - 10, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 42:
                                zone = "WE ---> Z1A";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(sourceNodeX - 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx + 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(endx + 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx + 10, endy);
                                line.drawLine(endx + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 43:
                                zone = "WS ---> Z1A";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(sourceNodeX - 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(endx, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 44:
                                zone = "WW ---> Z1A";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, endy);
                                line.drawLine(minLeftDistance - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                        }

                    }
                }

            } else {
                if (endx <= sourceNodeX - 10) {
                    zone = "Z7B";
                    switch (connectionType) {
                        case 11:
                            zone = "NN ---> Z7B";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15, endx, minTopDistance - 15);
                            line.drawLine(endx, minTopDistance - 15, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 12:
                            zone = "NE ---> Z7B";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10, targetNodeX + targetNodeWidth + 10, minTopDistance - 10);
                            line.drawLine(targetNodeX + targetNodeWidth + 10, minTopDistance - 10, targetNodeX + targetNodeWidth + 10, endy);
                            line.drawLine(targetNodeX + targetNodeWidth + 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx - 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 13:
                            zone = "NS ---> Z7B";
                            line.clear();
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10);
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY - 10);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY - 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10, endx, targetNodeY + targetNodeHeight + 10);
                            line.drawLine(endx, targetNodeY + targetNodeHeight + 10, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 14:
                            zone = "NW ---> Z7B";
                            line.clear();
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, minTopDistance - 10);
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, minTopDistance - 10, targetNodeX - 10, minTopDistance - 10);
                            line.drawLine(targetNodeX - 10, minTopDistance - 10, targetNodeX - 10, endy);
                            line.drawLine(targetNodeX - 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 21:
                            zone = "EN ---> Z7B";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, minTopDistance - 10);
                            line.drawLine(maxRightDistance + 10, minTopDistance - 10, endx, minTopDistance - 10);
                            line.drawLine(endx, minTopDistance - 10, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 22:
                            zone = "EE ---> Z7B";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY - 10);
                            line.drawLine(maxRightDistance + 10, sourceNodeY - 10, endx + 10, sourceNodeY - 10);
                            line.drawLine(endx + 10, sourceNodeY - 10, endx + 10, endy);
                            line.drawLine(endx + 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 23:
                            zone = "ES ---> Z7B";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, maxBottomDistance + 10);
                            line.drawLine(maxRightDistance + 10, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                            line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 24:
                            zone = "EW ---> Z7B";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, minTopDistance - 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + 10, minTopDistance - 10, targetNodeX - 10, minTopDistance - 10);
                            line.drawLine(targetNodeX - 10, minTopDistance - 10, targetNodeX - 10, endy);
                            line.drawLine(targetNodeX - 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 31:
                            zone = "SN ---> Z7B";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 15, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy - 10);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy - 10, endx, endy - 10);
                            line.drawLine(endx, endy - 10, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 32:
                            zone = "SE ---> Z7B";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy, endx, endy);
                            line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 33:
                            zone = "SS ---> Z7B";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                            line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 34:
                            zone = "SW ---> Z7B";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, minLeftDistance - 10, maxBottomDistance + 10);
                            line.drawLine(minLeftDistance - 10, maxBottomDistance + 10, minLeftDistance - 10, endy);
                            line.drawLine(minLeftDistance - 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 41:
                            zone = "WN ---> Z7B";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), targetNodeY - 10);
                            line.drawLine(sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), targetNodeY - 10, endx, targetNodeY - 10);
                            line.drawLine(endx, targetNodeY - 10, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 42:
                            zone = "WE ---> Z7B";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, (targetNodeX + targetNodeWidth) + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy, endx, endy);
                            line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 43:
                            zone = "WS ---> Z7B";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, endx, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(endx, sourceNodeY + halfSourceNodeHeight, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 44:
                            zone = "WW ---> Z7B";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), targetNodeY - 10);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), targetNodeY - 10, endx - 10, targetNodeY - 10);
                            line.drawLine(endx - 10, targetNodeY - 10, endx - 10, endy);
                            line.drawLine(endx - 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                    }

                } else {
                    zone = "Z7B10";
                    //line.clear();
                }

            }
        } else // Bottom Left Corner
        {
            if (endy >= sourceNodeY + sourceNodeHeight) // z6, z5b
            {
                if ((endy <= sourceNodeY + sourceNodeHeight + 10) && (endx >= sourceNodeX)) {
                    zone = "Z5B10";
                    //line.clear();
                } else {
                    if (endx <= sourceNodeX - 10) {
                        zone = "Z6";
                        switch (connectionType) {
                            case 11:
                                zone = "NN ---> Z6";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15, endx, minTopDistance - 15);
                                line.drawLine(endx, minTopDistance - 15, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 12:
                                zone = "NE ---> Z6";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10, targetNodeX + targetNodeWidth + 10, minTopDistance - 10);
                                line.drawLine(targetNodeX + targetNodeWidth + 10, minTopDistance - 10, targetNodeX + targetNodeWidth + 10, endy);
                                line.drawLine(targetNodeX + targetNodeWidth + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx - 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 13:
                                zone = "NS ---> Z6";
                                line.clear();
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10);
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY - 10);
                                line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY - 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10);
                                line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10, endx, targetNodeY + targetNodeHeight + 10);
                                line.drawLine(endx, targetNodeY + targetNodeHeight + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();

                                break;
                            case 14:
                                zone = "NW ---> Z6";
                                line.clear();
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, minTopDistance - 10);
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, minTopDistance - 10, targetNodeX - 10, minTopDistance - 10);
                                line.drawLine(targetNodeX - 10, minTopDistance - 10, targetNodeX - 10, endy);
                                line.drawLine(targetNodeX - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 21:
                                zone = "EN ---> Z6";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 22:
                                zone = "EE ---> Z6";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, endy);
                                line.drawLine(maxRightDistance + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 23:
                                zone = "ES ---> Z6";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, maxBottomDistance + 10);
                                line.drawLine(maxRightDistance + 10, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                                line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 24:
                                zone = "EW ---> Z6";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(targetNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX - 10, endy);
                                line.drawLine(targetNodeX - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 31:
                                zone = "SN ---> Z6";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 15, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 32:
                                zone = "SE ---> Z6";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, endy);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 33:
                                zone = "SS ---> Z6";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                                line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 34:
                                zone = "SW ---> Z6";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx - 10, endy);
                                line.drawLine(endx - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 41:
                                zone = "WN ---> Z6";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, endx, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(endx, sourceNodeY + halfSourceNodeHeight, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 42:
                                zone = "WE ---> Z6";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, (targetNodeX + targetNodeWidth) + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy);
                                line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 43:
                                zone = "WS ---> Z6";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy + 10);
                                line.drawLine(sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy + 10, endx, endy + 10);
                                line.drawLine(endx, endy + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 44:
                                zone = "WW ---> Z6";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, endy);
                                line.drawLine(minLeftDistance - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                        }

                    } else {
                        zone = "Z5B";
                        switch (connectionType) {
                            case 11:
                                zone = "NN ---> Z5B";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY - 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY - 10, sourceNodeX - 10, sourceNodeY - 10);
                                line.drawLine(sourceNodeX - 10, sourceNodeY - 10, sourceNodeX - 10, (sourceNodeY + sourceNodeHeight) + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX - 10, (sourceNodeY + sourceNodeHeight) + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, (sourceNodeY + sourceNodeHeight) + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx, (sourceNodeY + sourceNodeHeight) + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 12:
                                zone = "NE ---> Z5B";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10, maxRightDistance + 10, minTopDistance - 10);
                                line.drawLine(maxRightDistance + 10, minTopDistance - 10, maxRightDistance + 10, endy);
                                line.drawLine(maxRightDistance + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx - 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 13:
                                zone = "NS ---> Z5B";
                                line.clear();
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10);
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10, minLeftDistance - 10, sourceNodeY - 10);
                                line.drawLine(minLeftDistance - 10, sourceNodeY - 10, minLeftDistance - 10, targetNodeY + targetNodeHeight + 10);
                                line.drawLine(minLeftDistance - 10, targetNodeY + targetNodeHeight + 10, endx, targetNodeY + targetNodeHeight + 10);
                                line.drawLine(endx, targetNodeY + targetNodeHeight + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 14:
                                zone = "NW ---> Z5B";
                                line.clear();
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10);
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10, minLeftDistance - 10, sourceNodeY - 10);
                                line.drawLine(minLeftDistance - 10, sourceNodeY - 10, minLeftDistance - 10, endy);
                                line.drawLine(minLeftDistance - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 21:
                                zone = "EN ---> Z5B";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 22:
                                zone = "EE ---> Z5B";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, endy);
                                line.drawLine(maxRightDistance + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 23:
                                zone = "ES ---> Z5B";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, maxBottomDistance + 10);
                                line.drawLine(maxRightDistance + 10, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                                line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 24:
                                zone = "EW ---> Z5B";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(targetNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX - 10, endy);
                                line.drawLine(targetNodeX - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 31:
                                zone = "SN ---> Z5B";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 15, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 32:
                                zone = "SE ---> Z5B";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, endy);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 33:
                                zone = "SS ---> Z5B";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(targetNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX - 10, endy + 10);
                                line.drawLine(targetNodeX - 10, endy + 10, endx, endy + 10);
                                line.drawLine(endx, endy + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 34:
                                zone = "SW ---> Z5B";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx - 10, endy);
                                line.drawLine(endx - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 41:
                                zone = "WN ---> Z5B";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 42:
                                zone = "WE ---> Z5B";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx + 10, endy);
                                line.drawLine(endx + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 43:
                                zone = "WS ---> Z5B";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, maxBottomDistance + 10);
                                line.drawLine(minLeftDistance - 10, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                                line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 44:
                                zone = "WW ---> Z5B";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, endy);
                                line.drawLine(minLeftDistance - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                        }

                    }
                }

            } else {
                if (endx <= sourceNodeX - 10) {
                    zone = "Z7A";
                    switch (connectionType) {
                        case 11:
                            zone = "NN ---> Z7A";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15, endx, minTopDistance - 15);
                            line.drawLine(endx, minTopDistance - 15, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 12:
                            zone = "NE ---> Z7A";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10, targetNodeX + targetNodeWidth + 10, minTopDistance - 10);
                            line.drawLine(targetNodeX + targetNodeWidth + 10, minTopDistance - 10, targetNodeX + targetNodeWidth + 10, endy);
                            line.drawLine(targetNodeX + targetNodeWidth + 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx - 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 13:
                            zone = "NS ---> Z7A";
                            line.clear();
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10);
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY - 10);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY - 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10, endx, targetNodeY + targetNodeHeight + 10);
                            line.drawLine(endx, targetNodeY + targetNodeHeight + 10, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 14:
                            zone = "NW ---> Z7A";
                            line.clear();
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, minTopDistance - 10);
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, minTopDistance - 10, targetNodeX - 10, minTopDistance - 10);
                            line.drawLine(targetNodeX - 10, minTopDistance - 10, targetNodeX - 10, endy);
                            line.drawLine(targetNodeX - 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 21:
                            zone = "EN ---> Z7A";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, minTopDistance - 10);
                            line.drawLine(maxRightDistance + 10, minTopDistance - 10, endx, minTopDistance - 10);
                            line.drawLine(endx, minTopDistance - 10, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 22:
                            zone = "EE ---> Z7A";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine(maxRightDistance + 10, sourceNodeY + sourceNodeHeight + 10, endx + 10, sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine(endx + 10, sourceNodeY + sourceNodeHeight + 10, endx + 10, endy);
                            line.drawLine(endx + 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 23:
                            zone = "ES ---> Z7A";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, maxBottomDistance + 10);
                            line.drawLine(maxRightDistance + 10, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                            line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 24:
                            zone = "EW ---> Z7A";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, maxBottomDistance + 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + 10, maxBottomDistance + 10, targetNodeX - 10, maxBottomDistance + 10);
                            line.drawLine(targetNodeX - 10, maxBottomDistance + 10, targetNodeX - 10, endy);
                            line.drawLine(targetNodeX - 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 31:
                            zone = "SN ---> Z7A";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 15, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy - 10);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy - 10, endx, endy - 10);
                            line.drawLine(endx, endy - 10, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 32:
                            zone = "SE ---> Z7A";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy, endx, endy);
                            line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                            line.paint(); break;
                        case 33:
                            zone = "SS ---> Z7A";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                            line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 34:
                            zone = "SW ---> Z7A";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, minLeftDistance - 10, maxBottomDistance + 10);
                            line.drawLine(minLeftDistance - 10, maxBottomDistance + 10, minLeftDistance - 10, endy);
                            line.drawLine(minLeftDistance - 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 41:
                            zone = "WN ---> Z7A";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, endx, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(endx, sourceNodeY + halfSourceNodeHeight, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 42:
                            zone = "WE ---> Z7A";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, (targetNodeX + targetNodeWidth) + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy, endx, endy);
                            line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 43:
                            zone = "WS ---> Z7A";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy + 10);
                            line.drawLine(sourceNodeX - Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), endy + 10, endx, endy + 10);
                            line.drawLine(endx, endy + 10, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 44:
                            zone = "WW ---> Z7A";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10);
                            line.drawLine(targetNodeX + targetNodeWidth + Math.floor((sourceNodeX - (targetNodeX + targetNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10, endx - 10, targetNodeY + targetNodeHeight + 10);
                            line.drawLine(endx - 10, targetNodeY + targetNodeHeight + 10, endx - 10, endy);
                            line.drawLine(endx - 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                    }

                } else {
                    zone = "Z7A10";
                    //line.clear();
                }

            }

        }

    } else {
        if (endy <= (sourceNodeY + halfSourceNodeHeight)) // Top Right Corner
        {
            if (endy <= sourceNodeY) // z1b, z2
            {
                if (endy >= sourceNodeY - 10 && endx <= sourceNodeWidth) {
                    zone = "Z1B10";
                    //line.clear();
                } else {
                    if (endx <= sourceNodeX + sourceNodeWidth) {
                        zone = "Z1B";
                        switch (connectionType) {
                            case 11:
                                zone = "NN ---> Z1B";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY - 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY - 10, maxRightDistance + 10, sourceNodeY - 10);
                                line.drawLine(maxRightDistance + 10, sourceNodeY - 10, maxRightDistance + 10, endy - 10);
                                line.drawLine(maxRightDistance + 10, endy - 10, endx, endy - 10);
                                line.drawLine(endx, endy - 10, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 12:
                                zone = "NE ---> Z1B";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), endx + 15, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine(endx + 15, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), endx + 15, endy);
                                line.drawLine(endx + 15, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx - 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 13:
                                zone = "NS ---> Z1B";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), endx, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine(endx, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 14:
                                zone = "NW ---> Z1B";
                                line.clear();
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, endy);
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 21:
                                zone = "EN ---> Z1B";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, minTopDistance - 10);
                                line.drawLine(maxRightDistance + 10, minTopDistance - 10, endx, minTopDistance - 10);
                                line.drawLine(endx, minTopDistance - 10, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 22:
                                zone = "EE ---> Z1B";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, endy);
                                line.drawLine(maxRightDistance + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 23:
                                zone = "ES ---> Z1B";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(endx, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 24:
                                zone = "EW ---> Z1B";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(targetNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX - 10, endy);
                                line.drawLine(targetNodeX - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 31:
                                zone = "SN ---> Z1B";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 15, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, maxRightDistance + 10, sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine(maxRightDistance + 10, sourceNodeY + sourceNodeHeight + 10, maxRightDistance + 10, minTopDistance - 10);
                                line.drawLine(maxRightDistance + 10, minTopDistance - 10, endx, minTopDistance - 10);
                                line.drawLine(endx, minTopDistance - 10, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 32:
                                zone = "SE ---> Z1B";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, maxRightDistance + 10, maxBottomDistance + 10);
                                line.drawLine(maxRightDistance + 10, maxBottomDistance + 10, maxRightDistance + 10, endy);
                                line.drawLine(maxRightDistance + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 33:
                                zone = "SS ---> Z1B";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + 10, sourceNodeX + sourceNodeWidth + 10, targetNodeY + targetNodeHeight + 10);
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, targetNodeY + targetNodeHeight + 10, endx, targetNodeY + targetNodeHeight + 10);
                                line.drawLine(endx, targetNodeY + targetNodeHeight + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 34:
                                zone = "SW ---> Z1B";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, minLeftDistance - 10, maxBottomDistance + 10);
                                line.drawLine(minLeftDistance - 10, maxBottomDistance + 10, minLeftDistance - 10, endy);
                                line.drawLine(minLeftDistance - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 41:
                                zone = "WN ---> Z1B";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, minTopDistance - 10);
                                line.drawLine(minLeftDistance - 10, minTopDistance - 10, endx, minTopDistance - 10);
                                line.drawLine(endx, minTopDistance - 10, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 42:
                                zone = "WE ---> Z1B";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(sourceNodeX - 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx + 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(endx + 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx + 10, endy);
                                line.drawLine(endx + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 43:
                                zone = "WS ---> Z1B";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(sourceNodeX - 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(endx, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 44:
                                zone = "WW ---> Z1B";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, endy);
                                line.drawLine(minLeftDistance - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                        }

                    } else {
                        zone = "Z2";
                        switch (connectionType) {
                            case 11:
                                zone = "NN ---> Z2";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15, endx, minTopDistance - 15);
                                line.drawLine(endx, minTopDistance - 15, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 12:
                                zone = "NE ---> Z2";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), endx + 15, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine(endx + 15, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), endx + 15, endy);
                                line.drawLine(endx + 15, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx - 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 13:
                                zone = "NS ---> Z2";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), endx, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)));
                                line.drawLine(endx, (sourceNodeY - Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2)), endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 14:
                                zone = "NW ---> Z2";
                                line.clear();
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, endy);
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 21:
                                zone = "EN ---> Z2";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), minTopDistance - 10);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), minTopDistance - 10, endx, minTopDistance - 10);
                                line.drawLine(endx, minTopDistance - 10, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 22:
                                zone = "EE ---> Z2";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, endy);
                                line.drawLine(maxRightDistance + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 23:
                                zone = "ES ---> Z2";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, endx, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(endx, sourceNodeY + halfSourceNodeHeight, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 24:
                                zone = "EW ---> Z2";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 31:
                                zone = "SN ---> Z2";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 15, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY - 10);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY - 10, endx, targetNodeY - 10);
                                line.drawLine(endx, targetNodeY - 10, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 32:
                                zone = "SE ---> Z2";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, maxRightDistance + 10, maxBottomDistance + 10);
                                line.drawLine(maxRightDistance + 10, maxBottomDistance + 10, maxRightDistance + 10, endy);
                                line.drawLine(maxRightDistance + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 33:
                                zone = "SS ---> Z2";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                                line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 34:
                                zone = "SW ---> Z2";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 41:
                                zone = "WN ---> Z2";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, minTopDistance - 10);
                                line.drawLine(minLeftDistance - 10, minTopDistance - 10, endx, minTopDistance - 10);
                                line.drawLine(endx, minTopDistance - 10, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 42:
                                zone = "WE ---> Z2";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(sourceNodeX - 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx + 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(endx + 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx + 10, endy);
                                line.drawLine(endx + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 43:
                                zone = "WS ---> Z2";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(sourceNodeX - 10, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2));
                                line.drawLine(endx, targetNodeY + targetNodeHeight + Math.floor((sourceNodeY - (targetNodeY + targetNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 44:
                                zone = "WW ---> Z2";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, endy);
                                line.drawLine(minLeftDistance - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                        }

                    }
                }

            } else {
                if (endx <= sourceNodeX + sourceNodeWidth + 10) {
                    zone = "Z3A10";
                    //line.clear();
                } else {
                    zone = "Z3A";
                    switch (connectionType) {
                        case 11:
                            zone = "NN ---> Z3A";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15, endx, minTopDistance - 15);
                            line.drawLine(endx, minTopDistance - 15, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 12:
                            zone = "NE ---> Z3A";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10, targetNodeX + targetNodeWidth + 10, minTopDistance - 10);
                            line.drawLine(targetNodeX + targetNodeWidth + 10, minTopDistance - 10, targetNodeX + targetNodeWidth + 10, endy);
                            line.drawLine(targetNodeX + targetNodeWidth + 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx - 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 13:
                            zone = "NS ---> Z3A";
                            line.clear();
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10);
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY - 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY - 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10, endx, targetNodeY + targetNodeHeight + 10);
                            line.drawLine(endx, targetNodeY + targetNodeHeight + 10, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 14:
                            zone = "NW ---> Z3A";
                            line.clear();
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10);
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY - 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY - 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 21:
                            zone = "EN ---> Z3A";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), minTopDistance - 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), minTopDistance - 10, endx, minTopDistance - 10);
                            line.drawLine(endx, minTopDistance - 10, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 22:
                            zone = "EE ---> Z3A";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY - 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY - 10, endx + 10, targetNodeY - 10);
                            line.drawLine(endx + 10, targetNodeY - 10, endx + 10, endy);
                            line.drawLine(endx + 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 23:
                            zone = "ES ---> Z3A";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, endx, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(endx, sourceNodeY + halfSourceNodeHeight, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 24:
                            zone = "EW ---> Z3A";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 31:
                            zone = "SN ---> Z3A";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 15, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY - 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY - 10, endx, targetNodeY - 10);
                            line.drawLine(endx, targetNodeY - 10, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 32:
                            zone = "SE ---> Z3A";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, maxRightDistance + 10, maxBottomDistance + 10);
                            line.drawLine(maxRightDistance + 10, maxBottomDistance + 10, maxRightDistance + 10, endy);
                            line.drawLine(maxRightDistance + 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 33:
                            zone = "SS ---> Z3A";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                            line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 34:
                            zone = "SW ---> Z3A";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 41:
                            zone = "WN ---> Z3A";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, minTopDistance - 10);
                            line.drawLine(minLeftDistance - 10, minTopDistance - 10, endx, minTopDistance - 10);
                            line.drawLine(endx, minTopDistance - 10, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 42:
                            zone = "WE ---> Z3A";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, minTopDistance - 10);
                            line.drawLine(sourceNodeX - 10, minTopDistance - 10, maxRightDistance + 10, minTopDistance - 10);
                            line.drawLine(maxRightDistance + 10, minTopDistance - 10, maxRightDistance + 10, endy);
                            line.drawLine(maxRightDistance + 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 43:
                            zone = "WS ---> Z3A";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, maxBottomDistance + 10);
                            line.drawLine(minLeftDistance - 10, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                            line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 44:
                            zone = "WW ---> Z3A";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY - 10);
                            line.drawLine(sourceNodeX - 10, sourceNodeY - 10, targetNodeX - Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY - 10);
                            line.drawLine(targetNodeX - Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY - 10, targetNodeX - Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy);
                            line.drawLine(targetNodeX - Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                    }

                }

            }

        } else // Bottom Right Corner
        {
            if (endy >= sourceNodeY + sourceNodeHeight) // z5a, z4
            {
                if ((endy <= sourceNodeY + sourceNodeHeight + 10) && (endx <= sourceNodeX + sourceNodeWidth)) {
                    zone = "Z5A10";
                    //line.clear();
                } else {
                    if (endx <= sourceNodeX + sourceNodeWidth) {
                        zone = "Z5A";
                        switch (connectionType) {
                            case 11:
                                zone = "NN ---> Z5A";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY - 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY - 10, sourceNodeX + sourceNodeWidth + 10, sourceNodeY - 10);
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY - 10, sourceNodeX + sourceNodeWidth + 10, (sourceNodeY + sourceNodeHeight) + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, (sourceNodeY + sourceNodeHeight) + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, (sourceNodeY + sourceNodeHeight) + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx, (sourceNodeY + sourceNodeHeight) + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 12:
                                zone = "NE ---> Z5A";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10, maxRightDistance + 10, minTopDistance - 10);
                                line.drawLine(maxRightDistance + 10, minTopDistance - 10, maxRightDistance + 10, endy);
                                line.drawLine(maxRightDistance + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx - 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 13:
                                zone = "NS ---> Z5A";
                                line.clear();
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10);
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10, maxRightDistance + 10, sourceNodeY - 10);
                                line.drawLine(maxRightDistance + 10, sourceNodeY - 10, maxRightDistance + 10, targetNodeY + targetNodeHeight + 10);
                                line.drawLine(maxRightDistance + 10, targetNodeY + targetNodeHeight + 10, endx, targetNodeY + targetNodeHeight + 10);
                                line.drawLine(endx, targetNodeY + targetNodeHeight + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 14:
                                zone = "NW ---> Z5A";
                                line.clear();
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10);
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10, minLeftDistance - 10, sourceNodeY - 10);
                                line.drawLine(minLeftDistance - 10, sourceNodeY - 10, minLeftDistance - 10, endy);
                                line.drawLine(minLeftDistance - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 21:
                                zone = "EN ---> Z5A";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 22:
                                zone = "EE ---> Z5A";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, endy);
                                line.drawLine(maxRightDistance + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 23:
                                zone = "ES ---> Z5A";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, maxBottomDistance + 10);
                                line.drawLine(maxRightDistance + 10, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                                line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 24:
                                zone = "EW ---> Z5A";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX + sourceNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(targetNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX - 10, endy);
                                line.drawLine(targetNodeX - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 31:
                                zone = "SN ---> Z5A";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 15, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 32:
                                zone = "SE ---> Z5A";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx + 10, endy);
                                line.drawLine(endx + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 33:
                                zone = "SS ---> Z5A";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX + targetNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(targetNodeX + targetNodeWidth + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), targetNodeX + targetNodeWidth + 10, endy + 10);
                                line.drawLine(targetNodeX + targetNodeWidth + 10, endy + 10, endx, endy + 10);
                                line.drawLine(endx, endy + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 34:
                                zone = "SW ---> Z5A";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, endy);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 41:
                                zone = "WN ---> Z5A";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 42:
                                zone = "WE ---> Z5A";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx + 10, endy);
                                line.drawLine(endx + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 43:
                                zone = "WS ---> Z5A";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, maxBottomDistance + 10);
                                line.drawLine(minLeftDistance - 10, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                                line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 44:
                                zone = "WW ---> Z5A";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, endy);
                                line.drawLine(minLeftDistance - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                        }

                    } else {
                        zone = "Z4";
                        switch (connectionType) {
                            case 11:
                                zone = "NN ---> Z4";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15, endx, minTopDistance - 15);
                                line.drawLine(endx, minTopDistance - 15, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 12:
                                zone = "NE ---> Z4";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10, targetNodeX + targetNodeWidth + 10, minTopDistance - 10);
                                line.drawLine(targetNodeX + targetNodeWidth + 10, minTopDistance - 10, targetNodeX + targetNodeWidth + 10, endy);
                                line.drawLine(targetNodeX + targetNodeWidth + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx - 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 13:
                                zone = "NS ---> Z4";
                                line.clear();
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10);
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY - 10);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY - 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10, endx, targetNodeY + targetNodeHeight + 10);
                                line.drawLine(endx, targetNodeY + targetNodeHeight + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 14:
                                zone = "NW ---> Z4";
                                line.clear();
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10);
                                line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY - 10);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY - 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 21:
                                zone = "EN ---> Z4";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, endx, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(endx, sourceNodeY + halfSourceNodeHeight, endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 22:
                                zone = "EE ---> Z4";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(maxRightDistance + 10, sourceNodeY + halfSourceNodeHeight, maxRightDistance + 10, endy);
                                line.drawLine(maxRightDistance + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 23:
                                zone = "ES ---> Z4";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy + 10);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy + 10, endx, endy + 10);
                                line.drawLine(endx, endy + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 24:
                                zone = "EW ---> Z4";
                                line.clear();
                                line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy);
                                line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 31:
                                zone = "SN ---> Z4";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 15, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 32:
                                zone = "SE ---> Z4";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx + 10, endy);
                                line.drawLine(endx + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 33:
                                zone = "SS ---> Z4";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                                line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 34:
                                zone = "SW ---> Z4";
                                line.clear();
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, endy);
                                line.drawLine((sourceNodeX) + halfSourceNodeWidth, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 41:
                                zone = "WN ---> Z4";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx, endy);
                                line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                                line.paint();
                                break;
                            case 42:
                                zone = "WE ---> Z4";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(sourceNodeX - 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2));
                                line.drawLine(endx + 10, sourceNodeY + sourceNodeHeight + Math.floor((targetNodeY - (sourceNodeY + sourceNodeHeight)) / 2), endx + 10, endy);
                                line.drawLine(endx + 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                            case 43:
                                zone = "WS ---> Z4";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, maxBottomDistance + 10);
                                line.drawLine(minLeftDistance - 10, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                                line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                                line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                                line.paint();
                                break;
                            case 44:
                                zone = "WW ---> Z4";
                                line.clear();
                                line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                                line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, endy);
                                line.drawLine(minLeftDistance - 10, endy, endx, endy);
                                line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                                line.paint();
                                break;
                        }

                    }
                }

            } else {
                if (endx <= sourceNodeX + sourceNodeWidth + 10) {
                    zone = "Z3B10";
                    //line.clear();
                } else {
                    zone = "Z3B";
                    switch (connectionType) {
                        case 11:
                            zone = "NN ---> Z3B";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 15, endx, minTopDistance - 15);
                            line.drawLine(endx, minTopDistance - 15, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 12:
                            zone = "NE ---> Z3B";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY, (sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, minTopDistance - 10, targetNodeX + targetNodeWidth + 10, minTopDistance - 10);
                            line.drawLine(targetNodeX + targetNodeWidth + 10, minTopDistance - 10, targetNodeX + targetNodeWidth + 10, endy);
                            line.drawLine(targetNodeX + targetNodeWidth + 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx - 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 13:
                            zone = "NS ---> Z3B";
                            line.clear();
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10);
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY - 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY - 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10, endx, targetNodeY + targetNodeHeight + 10);
                            line.drawLine(endx, targetNodeY + targetNodeHeight + 10, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 14:
                            zone = "NW ---> Z3B";
                            line.clear();
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY, sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10);
                            line.drawLine(sourceNodeX + halfSourceNodeWidth, sourceNodeY - 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY - 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY - 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 21:
                            zone = "EN ---> Z3B";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, endx, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(endx, sourceNodeY + halfSourceNodeHeight, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 22:
                            zone = "EE ---> Z3B";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY + targetNodeHeight + 10, endx + 10, targetNodeY + targetNodeHeight + 10);
                            line.drawLine(endx + 10, targetNodeY + targetNodeHeight + 10, endx + 10, endy);
                            line.drawLine(endx + 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 23:
                            zone = "ES ---> Z3B";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy + 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy + 10, endx, endy + 10);
                            line.drawLine(endx, endy + 10, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 24:
                            zone = "EW ---> Z3B";
                            line.clear();
                            line.drawLine(sourceNodeX + sourceNodeWidth, sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + halfSourceNodeHeight, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();

                            break;
                        case 31:
                            zone = "SN ---> Z3B";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 15, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY - 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), targetNodeY - 10, endx, targetNodeY - 10);
                            line.drawLine(endx, targetNodeY - 10, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 32:
                            zone = "SE ---> Z3B";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, maxRightDistance + 10, maxBottomDistance + 10);
                            line.drawLine(maxRightDistance + 10, maxBottomDistance + 10, maxRightDistance + 10, endy);
                            line.drawLine(maxRightDistance + 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 33:
                            zone = "SS ---> Z3B";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                            line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 34:
                            zone = "SW ---> Z3B";
                            line.clear();
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight, (sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine((sourceNodeX) + halfSourceNodeWidth, sourceNodeY + sourceNodeHeight + 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10, sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy);
                            line.drawLine(sourceNodeX + sourceNodeWidth + Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 41:
                            zone = "WN ---> Z3B";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, minTopDistance - 10);
                            line.drawLine(minLeftDistance - 10, minTopDistance - 10, endx, minTopDistance - 10);
                            line.drawLine(endx, minTopDistance - 10, endx, endy);
                            line.fillPolygon(new Array(endx - 5, endx + 5, endx), new Array(endy, endy, endy + 5));
                            line.paint();
                            break;
                        case 42:
                            zone = "WE ---> Z3B";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, maxBottomDistance + 10);
                            line.drawLine(sourceNodeX - 10, maxBottomDistance + 10, maxRightDistance + 10, maxBottomDistance + 10);
                            line.drawLine(maxRightDistance + 10, maxBottomDistance + 10, maxRightDistance + 10, endy);
                            line.drawLine(maxRightDistance + 10, endy, endx, endy);
                            line.fillPolygon(new Array(endx + 5, endx + 5, endx), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                        case 43:
                            zone = "WS ---> Z3B";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(minLeftDistance - 10, sourceNodeY + halfSourceNodeHeight, minLeftDistance - 10, maxBottomDistance + 10);
                            line.drawLine(minLeftDistance - 10, maxBottomDistance + 10, endx, maxBottomDistance + 10);
                            line.drawLine(endx, maxBottomDistance + 10, endx, endy);
                            line.fillPolygon(new Array(endx, endx - 5, endx + 5), new Array(endy - 5, endy + 5, endy + 5));
                            line.paint();
                            break;
                        case 44:
                            zone = "WW ---> Z3B";
                            line.clear();
                            line.drawLine(sourceNodeX, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight);
                            line.drawLine(sourceNodeX - 10, sourceNodeY + halfSourceNodeHeight, sourceNodeX - 10, sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine(sourceNodeX - 10, sourceNodeY + sourceNodeHeight + 10, targetNodeX - Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10);
                            line.drawLine(targetNodeX - Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), sourceNodeY + sourceNodeHeight + 10, targetNodeX - Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy);
                            line.drawLine(targetNodeX - Math.floor((targetNodeX - (sourceNodeX + sourceNodeWidth)) / 2), endy, endx, endy);
                            line.fillPolygon(new Array(endx, endx, endx + 5), new Array(endy - 5, endy + 5, endy));
                            line.paint();
                            break;
                    }
                }
            }
        }
    }
}

function drawTempConnection(node, direction, port, canvasobj, line) {

    direction = node + "_" + direction;

    var startx;
    var starty;
    var endx = port.position().left + $("#" + node).position().left + $(canvasobj.getCanvas).scrollLeft();
    var endy = port.position().top + $("#" + node).position().top + $(canvasobj.getCanvas).scrollTop();
    var nodex = $("#" + node).position().left + $(canvasobj.getCanvas).scrollLeft();
    var nodey = $("#" + node).position().top + $(canvasobj.getCanvas).scrollTop();
    var nodeWidth = $("#" + node).width();
    var nodeHeight = $("#" + node).height();
    var halfNodeWidth = Math.floor(nodeWidth / 2);
    var halfNodeHeight = Math.floor(nodeHeight / 2);
    var zone;
    var portNumber;

    if (direction.match(/_n$/)) {
        startx = nodex + halfNodeWidth;
        starty = nodey;
        portNumber = 1;
    } else if (direction.match(/_e$/)) {
        startx = nodex + nodeWidth;
        starty = nodey + halfNodeHeight;
        portNumber = 2;
    } else if (direction.match(/_s$/)) {
        startx = nodex + halfNodeWidth;
        starty = nodey + nodeHeight;
        portNumber = 3;
    } else if (direction.match(/_w$/)) {
        startx = nodex;
        starty = nodey + halfNodeHeight;
        portNumber = 4;
    }




    if (endx <= (nodex + halfNodeWidth)) {
        if (endy <= (nodey + halfNodeHeight)) /* Top Left Corner*/ {
            if (endy <= nodey) /* z8, z1a*/ {
                if (endy >= nodey - 10 && endx > nodex) {
                    zone = "Z1A10";
                    line.clear();
                } else {
                    if (endx <= nodex - 10) {
                        zone = "Z8";
                        switch (portNumber) {
                            case 1:
                                zone = "N ---> Z8";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey, (nodex) + halfNodeWidth, endy);
                                line.drawLine((nodex) + halfNodeWidth, endy, endx, endy);
                                line.paint();
                                break;
                            case 2:
                                zone = "E ---> Z8";
                                line.clear();
                                line.drawLine((nodex) + nodeWidth, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, nodey + halfNodeHeight);
                                line.drawLine((nodex) + nodeWidth + 10, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, endy);
                                line.drawLine((nodex) + nodeWidth + 10, endy, endx, endy);
                                line.paint();
                                break;
                            case 3:
                                zone = "S ---> Z8";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight, (nodex) + halfNodeWidth, nodey + nodeHeight + 10);
                                line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight + 10, endx, nodey + nodeHeight + 10);
                                line.drawLine(endx, nodey + nodeHeight + 10, endx, endy);
                                line.paint();
                                break;
                            case 4:
                                zone = "W ---> Z8";
                                line.clear();
                                line.drawLine(nodex, nodey + halfNodeHeight, endx, nodey + halfNodeHeight);
                                line.drawLine(endx, nodey + halfNodeHeight, endx, endy);
                                line.paint();
                                break;
                        }

                    } else {
                        zone = "Z1A";
                        switch (portNumber) {
                            case 1:
                                zone = "N ---> Z1A";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey, (nodex) + halfNodeWidth, endy);
                                line.drawLine((nodex) + halfNodeWidth, endy, endx, endy);
                                line.paint();
                                break;
                            case 2:
                                zone = "E ---> Z1A";
                                line.clear();
                                line.drawLine((nodex) + nodeWidth, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, nodey + halfNodeHeight);
                                line.drawLine((nodex) + nodeWidth + 10, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, endy);
                                line.drawLine((nodex) + nodeWidth + 10, endy, endx, endy);
                                line.paint();
                                break;
                            case 3:
                                zone = "S ---> Z1A";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight, (nodex) + halfNodeWidth, nodey + nodeHeight + 10);
                                line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight + 10, nodex - 10, nodey + nodeHeight + 10);
                                line.drawLine(nodex - 10, nodey + nodeHeight + 10, nodex - 10, endy);
                                line.drawLine(nodex - 10, endy, endx, endy);
                                line.paint();
                                break;
                            case 4:
                                zone = "W ---> Z1A";
                                line.clear();
                                line.drawLine(nodex, nodey + halfNodeHeight, nodex - 10, nodey + halfNodeHeight);
                                line.drawLine(nodex - 10, nodey + halfNodeHeight, nodex - 10, endy);
                                line.drawLine(nodex - 10, endy, endx, endy);
                                line.paint();
                                break;
                        }

                    }
                }

            } else {
                if (endx <= nodex - 10) {
                    zone = "Z7B";
                    switch (portNumber) {
                        case 1:
                            zone = "N ---> Z7B";
                            line.clear();
                            line.drawLine((nodex) + halfNodeWidth, nodey, (nodex) + halfNodeWidth, nodey - 10);
                            line.drawLine((nodex) + halfNodeWidth, nodey - 10, endx, nodey - 10);
                            line.drawLine(endx, nodey - 10, endx, endy);
                            line.paint();
                            break;
                        case 2:
                            zone = "E ---> Z7B";
                            line.clear();
                            line.drawLine((nodex) + nodeWidth, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, nodey + halfNodeHeight);
                            line.drawLine((nodex) + nodeWidth + 10, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, nodey - 10);
                            line.drawLine((nodex) + nodeWidth + 10, nodey - 10, endx, nodey - 10);
                            line.drawLine(endx, nodey - 10, endx, endy);
                            line.paint();
                            break;
                        case 3:
                            zone = "S ---> Z7B";
                            line.clear();
                            line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight, (nodex) + halfNodeWidth, nodey + nodeHeight + 10);
                            line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight + 10, endx, nodey + nodeHeight + 10);
                            line.drawLine(endx, nodey + nodeHeight + 10, endx, endy);
                            line.paint();
                            break;
                        case 4:
                            zone = "W ---> Z7B";
                            line.clear();
                            line.drawLine(nodex, nodey + halfNodeHeight, endx, nodey + halfNodeHeight);
                            line.drawLine(endx, nodey + halfNodeHeight, endx, endy);
                            line.paint();
                            break;
                    }

                } else {
                    zone = "Z7B10";
                    line.clear();
                }

            }
        } else /* Bottom Left Corner*/ {
            if (endy >= nodey + nodeHeight) /* z6, z5b*/ {
                if ((endy <= nodey + nodeHeight + 10) && (endx >= nodex)) {
                    zone = "Z5B10";
                    line.clear();
                } else {
                    if (endx <= nodex - 10) {
                        zone = "Z6";
                        switch (portNumber) {
                            case 1:
                                zone = "N ---> Z6";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey, (nodex) + halfNodeWidth, nodey - 10);
                                line.drawLine((nodex) + halfNodeWidth, nodey - 10, endx, nodey - 10);
                                line.drawLine(endx, nodey - 10, endx, endy - 10);
                                line.paint();
                                break;
                            case 2:
                                zone = "E ---> Z6";
                                line.clear();
                                line.drawLine((nodex) + nodeWidth, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, nodey + halfNodeHeight);
                                line.drawLine((nodex) + nodeWidth + 10, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, endy);
                                line.drawLine((nodex) + nodeWidth + 10, endy, endx, endy);
                                line.paint();
                                break;
                            case 3:
                                zone = "S ---> Z6";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight, (nodex) + halfNodeWidth, endy);
                                line.drawLine((nodex) + halfNodeWidth, endy, endx, endy);
                                line.paint();
                                break;
                            case 4:
                                zone = "W ---> Z6";
                                line.clear();
                                line.drawLine(nodex, nodey + halfNodeHeight, endx, nodey + halfNodeHeight);
                                line.drawLine(endx, nodey + halfNodeHeight, endx, endy);
                                line.paint();
                                break;
                        }

                    } else {
                        zone = "Z5B";
                        switch (portNumber) {
                            case 1:
                                zone = "N ---> Z5B";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey, (nodex) + halfNodeWidth, nodey - 10);
                                line.drawLine((nodex) + halfNodeWidth, nodey - 10, nodex - 20, nodey - 10);
                                line.drawLine(nodex - 20, nodey - 10, nodex - 20, endy);
                                line.drawLine(nodex - 20, endy, endx, endy);
                                line.paint();
                                break;
                            case 2:
                                zone = "E ---> Z5B";
                                line.clear();
                                line.drawLine((nodex) + nodeWidth, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, nodey + halfNodeHeight);
                                line.drawLine((nodex) + nodeWidth + 10, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, endy);
                                line.drawLine((nodex) + nodeWidth + 10, endy, endx, endy);
                                line.paint();
                                break;
                            case 3:
                                zone = "S ---> Z5B";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight, (nodex) + halfNodeWidth, endy);
                                line.drawLine((nodex) + halfNodeWidth, endy, endx, endy);
                                line.paint();
                                break;
                            case 4:
                                zone = "W ---> Z5B";
                                line.clear();
                                line.drawLine(nodex, nodey + halfNodeHeight, nodex - 10, nodey + halfNodeHeight);
                                line.drawLine(nodex - 10, nodey + halfNodeHeight, nodex - 10, endy);
                                line.drawLine(nodex - 10, endy, endx, endy);
                                line.paint();
                                break;
                        }

                    }
                }

            } else {
                if (endx <= nodex - 10) {
                    /*zone="Z7A";*/
                    switch (portNumber) {
                        case 1:
                            zone = "N ---> Z7A";
                            line.clear();
                            line.drawLine((nodex) + halfNodeWidth, nodey, (nodex) + halfNodeWidth, nodey - 10);
                            line.drawLine((nodex) + halfNodeWidth, nodey - 10, endx, nodey - 10);
                            line.drawLine(endx, nodey - 10, endx, endy);
                            line.paint();

                            break;
                        case 2:
                            zone = "E ---> Z7A";
                            line.clear();
                            line.drawLine((nodex) + nodeWidth, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, nodey + halfNodeHeight);
                            line.drawLine((nodex) + nodeWidth + 10, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, nodey + nodeHeight + 10);
                            line.drawLine((nodex) + nodeWidth + 10, nodey + nodeHeight + 10, endx, nodey + nodeHeight + 10);
                            line.drawLine(endx, nodey + nodeHeight + 10, endx, endy);
                            line.paint();
                            break;
                        case 3:
                            zone = "S ---> Z7A";
                            line.clear();
                            line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight, (nodex) + halfNodeWidth, nodey + nodeHeight + 10);
                            line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight + 10, endx, nodey + nodeHeight + 10);
                            line.drawLine(endx, nodey + nodeHeight + 10, endx, endy);
                            line.paint();
                            break;
                        case 4:
                            zone = "W ---> Z7A";
                            line.clear();
                            line.drawLine(nodex, nodey + halfNodeHeight, endx, nodey + halfNodeHeight);
                            line.drawLine(endx, nodey + halfNodeHeight, endx, endy);
                            line.paint();

                            break;
                    }

                } else {
                    zone = "Z7A10";
                    line.clear();
                }

            }

        }

    } else {
        if (endy <= (nodey + halfNodeHeight)) /* Top Right Corner*/ {
            if (endy <= nodey) /* z1b, z2*/ {
                if (endy >= nodey - 10 && endx <= nodeWidth) {
                    zone = "Z1B10";
                    line.clear();
                } else {
                    if (endx <= nodex + nodeWidth) {
                        zone = "Z1B";
                        switch (portNumber) {
                            case 1:
                                zone = "N ---> Z1B";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey, (nodex) + halfNodeWidth, endy);
                                line.drawLine((nodex) + halfNodeWidth, endy, endx, endy);
                                line.paint();
                                break;
                            case 2:
                                zone = "E ---> Z1B";
                                line.clear();
                                line.drawLine((nodex) + nodeWidth, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, nodey + halfNodeHeight);
                                line.drawLine((nodex) + nodeWidth + 10, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, endy);
                                line.drawLine((nodex) + nodeWidth + 10, endy, endx, endy);
                                line.paint();
                                break;
                            case 3:
                                zone = "S ---> Z1B";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight, (nodex) + halfNodeWidth, nodey + nodeHeight + 10);
                                line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight + 10, nodex + nodeWidth + 10, nodey + nodeHeight + 10);
                                line.drawLine(nodex + nodeWidth + 10, nodey + nodeHeight + 10, nodex + nodeWidth + 10, endy);
                                line.drawLine(nodex + nodeWidth + 10, endy, endx, endy);
                                line.paint();
                                break;
                            case 4:
                                zone = "W ---> Z1B";
                                line.clear();
                                line.drawLine(nodex, nodey + halfNodeHeight, nodex - 10, nodey + halfNodeHeight);
                                line.drawLine(nodex - 10, nodey + halfNodeHeight, nodex - 10, endy);
                                line.drawLine(nodex - 10, endy, endx, endy);
                                line.paint();
                                break;
                        }

                    } else {
                        zone = "Z2";
                        switch (portNumber) {
                            case 1:
                                zone = "N ---> Z2";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey, (nodex) + halfNodeWidth, endy);
                                line.drawLine((nodex) + halfNodeWidth, endy, endx, endy);
                                line.paint();
                                break;
                            case 2:
                                zone = "E ---> Z2";
                                line.clear();
                                line.drawLine((nodex) + nodeWidth, nodey + halfNodeHeight, endx, nodey + halfNodeHeight);
                                line.drawLine(endx, nodey + halfNodeHeight, endx, endy);
                                line.paint();
                                break;
                            case 3:
                                zone = "S ---> Z2";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight, (nodex) + halfNodeWidth, nodey + nodeHeight + 10);
                                line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight + 10, endx, nodey + nodeHeight + 10);
                                line.drawLine(endx, nodey + nodeHeight + 10, endx, endy);
                                line.paint();
                                break;
                            case 4:
                                zone = "W ---> Z2";
                                line.clear();
                                line.drawLine(nodex, nodey + halfNodeHeight, nodex - 10, nodey + halfNodeHeight);
                                line.drawLine(nodex - 10, nodey + halfNodeHeight, nodex - 10, endy);
                                line.drawLine(nodex - 10, endy, endx, endy);
                                line.paint();
                                break;
                        }

                    }
                }

            } else {
                if (endx <= nodex + nodeWidth + 10) {
                    zone = "Z3A10";
                    line.clear();
                } else {
                    zone = "Z3A";
                    switch (portNumber) {
                        case 1:
                            zone = "N ---> Z3A";
                            line.clear();
                            line.drawLine((nodex) + halfNodeWidth, nodey, (nodex) + halfNodeWidth, nodey - 10);
                            line.drawLine((nodex) + halfNodeWidth, nodey - 10, endx, nodey - 10);
                            line.drawLine(endx, nodey - 10, endx, endy);
                            line.paint();
                            break;
                        case 2:
                            zone = "E ---> Z3A";
                            line.clear();
                            line.drawLine((nodex) + nodeWidth, nodey + halfNodeHeight, endx, nodey + halfNodeHeight);
                            line.drawLine(endx, nodey + halfNodeHeight, endx, endy);
                            line.paint();
                            break;
                        case 3:
                            zone = "S ---> Z3A";
                            line.clear();
                            line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight, (nodex) + halfNodeWidth, nodey + nodeHeight + 10);
                            line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight + 10, endx, nodey + nodeHeight + 10);
                            line.drawLine(endx, nodey + nodeHeight + 10, endx, endy);
                            line.paint();
                            break;
                        case 4:
                            zone = "W ---> Z3A";
                            line.clear();
                            line.drawLine(nodex, nodey + halfNodeHeight, nodex - 10, nodey + halfNodeHeight);
                            line.drawLine(nodex - 10, nodey + halfNodeHeight, nodex - 10, nodey - 10);
                            line.drawLine(nodex - 10, nodey - 10, endx, nodey - 10);
                            line.drawLine(endx, nodey - 10, endx, endy);
                            line.paint();
                            break;
                    }

                }

            }

        } else /* Bottom Right Corner*/ {
            if (endy >= nodey + nodeHeight) /* z5a, z4*/ {
                if ((endy <= nodey + nodeHeight + 10) && (endx <= nodex + nodeWidth)) {
                    zone = "Z5A10";
                    line.clear();
                } else {
                    if (endx <= nodex + nodeWidth) {
                        zone = "Z5A";
                        switch (portNumber) {
                            case 1:
                                zone = "N ---> Z5A";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey, (nodex) + halfNodeWidth, nodey - 10);
                                line.drawLine((nodex) + halfNodeWidth, nodey - 10, nodex + nodeWidth + 10, nodey - 10);
                                line.drawLine(nodex + nodeWidth + 10, nodey - 10, nodex + nodeWidth + 10, endy);
                                line.drawLine(nodex + nodeWidth + 10, endy, endx, endy);
                                line.paint();
                                break;
                            case 2:
                                zone = "E ---> Z5A";
                                line.clear();
                                line.drawLine((nodex) + nodeWidth, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, nodey + halfNodeHeight);
                                line.drawLine((nodex) + nodeWidth + 10, nodey + halfNodeHeight, (nodex) + nodeWidth + 10, endy);
                                line.drawLine((nodex) + nodeWidth + 10, endy, endx, endy);
                                line.paint();
                                break;
                            case 3:
                                zone = "S ---> Z5A";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight, (nodex) + halfNodeWidth, endy);
                                line.drawLine((nodex) + halfNodeWidth, endy, endx, endy);
                                line.paint();
                                break;
                            case 4:
                                zone = "W ---> Z5A";
                                line.clear();
                                line.drawLine(nodex, nodey + halfNodeHeight, nodex - 10, nodey + halfNodeHeight);
                                line.drawLine(nodex - 10, nodey + halfNodeHeight, nodex - 10, endy);
                                line.drawLine(nodex - 10, endy, endx, endy);
                                line.paint();
                                break;
                        }

                    } else {
                        zone = "Z4";
                        switch (portNumber) {
                            case 1:
                                zone = "N ---> Z4";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey, (nodex) + halfNodeWidth, nodey - 10);
                                line.drawLine((nodex) + halfNodeWidth, nodey - 10, endx, nodey - 10);
                                line.drawLine(endx, nodey - 10, endx, endy);
                                line.paint();
                                break;
                            case 2:
                                zone = "E ---> Z4";
                                line.clear();
                                line.drawLine((nodex) + nodeWidth, nodey + halfNodeHeight, endx, nodey + halfNodeHeight);
                                line.drawLine(endx, nodey + halfNodeHeight, endx, endy);
                                line.paint();
                                break;
                            case 3:
                                zone = "S ---> Z4";
                                line.clear();
                                line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight, (nodex) + halfNodeWidth, endy);
                                line.drawLine((nodex) + halfNodeWidth, endy, endx, endy);
                                line.paint();
                                break;
                            case 4:
                                zone = "W ---> Z4";
                                line.clear();
                                line.drawLine(nodex, nodey + halfNodeHeight, nodex - 10, nodey + halfNodeHeight);
                                line.drawLine(nodex - 10, nodey + halfNodeHeight, nodex - 10, endy);
                                line.drawLine(nodex - 10, endy, endx, endy);
                                line.paint();
                                break;
                        }

                    }
                }

            } else {
                if (endx <= nodex + nodeWidth + 10) {
                    zone = "Z3B10";
                    line.clear();
                } else {
                    zone = "Z3B";
                    switch (portNumber) {
                        case 1:
                            zone = "N ---> Z3B";
                            line.clear();
                            line.drawLine((nodex) + halfNodeWidth, nodey, (nodex) + halfNodeWidth, nodey - 10);
                            line.drawLine((nodex) + halfNodeWidth, nodey - 10, endx, nodey - 10);
                            line.drawLine(endx, nodey - 10, endx, endy);
                            line.paint();
                            break;
                        case 2:
                            zone = "E ---> Z3B";
                            line.clear();
                            line.drawLine((nodex) + nodeWidth, nodey + halfNodeHeight, endx, nodey + halfNodeHeight);
                            line.drawLine(endx, nodey + halfNodeHeight, endx, endy);
                            line.paint();
                            break;
                        case 3:
                            zone = "S ---> Z3B";
                            line.clear();
                            line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight, (nodex) + halfNodeWidth, nodey + nodeHeight + 10);
                            line.drawLine((nodex) + halfNodeWidth, nodey + nodeHeight + 10, endx, nodey + nodeHeight + 10);
                            line.drawLine(endx, nodey + nodeHeight + 10, endx, endy);
                            line.paint();
                            break;
                        case 4:
                            zone = "W ---> Z3B";
                            line.clear();
                            line.drawLine(nodex, nodey + halfNodeHeight, nodex - 10, nodey + halfNodeHeight);
                            line.drawLine(nodex - 10, nodey + halfNodeHeight, nodex - 10, nodey + nodeHeight + 10);
                            line.drawLine(nodex - 10, nodey + nodeHeight + 10, endx, nodey + nodeHeight + 10);
                            line.drawLine(endx, nodey + nodeHeight + 10, endx, endy);
                            line.paint();
                            break;
                    }
                }
            }
        }
    }
}

