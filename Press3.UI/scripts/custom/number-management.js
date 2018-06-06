var global_DeletedCallerIds = [];

getGateways();
getCallerIdNumbers();

$("#addGateway").click(function () {
    $("#divGatewayError, #divGatewaySuccess").html("");
    $("#txtGatewayName").val("");
    $("#txtIp").val("");
    $("#txtTotalChannels").val("");
    $("#chkRange, #chkNumber").prop("checked", false);
    $(".DynamicNumbers, .DynamicRanges").remove();
    $("#addRange").hide();
    $("#addNumber").hide();
    $("#btnSaveGateway").attr("gatewayId", 0).text("Save");
    global_DeletedCallerIds = [];
    $("#createGateway").modal("show");
});
$("input:text").keypress(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        return false;
    }
});




$("#chkRange").click(function () {
    if ($(this).is(":checked")) {
        $(".DynamicRanges").remove();
        $("#addRange").show();
    } else {
        $(".DynamicRanges").remove();
        $("#addRange").hide();
    }
});
$("#chkNumber").click(function () {
    if ($(this).is(":checked")) {
        $(".DynamicNumbers").remove();
        $("#addNumber").show();
    } else {
        $(".DynamicNumbers").remove();
        $("#addNumber").hide();
    }
});

$("#addRange").click(function () {
    var latestRangeId = 0, i = 0, resHtml = "";
    if ($(".RangeOfNumbers").length > 0) {
        latestRangeId = $(".RangeOfNumbers").last().attr("rangeId");
        i = parseInt(latestRangeId) + 1;
    } else {
        i = 1;
    }
    resHtml += "<tr class='RangeOfNumbers DynamicRanges' id='Range_" + i + "' rangeId='" + i + "'><td></td>";
    resHtml += "<td>";
    resHtml += "<label class='margin-right-10'><input type='text' class='form-control input-inline w-120 onlynumbers' placeholder='Prefix' id='prefix_" + i + "' maxlength='20' /></label>";
    resHtml += "<label class='margin-right-10'><input type='text' class='form-control input-inline w-120 onlynumbers' placeholder='From Range' id='fromRange_" + i + "' maxlength='5' /></label>";
    resHtml += "<label><input type='text' class='form-control input-inline w-120 onlynumbers' placeholder='To Range' id='toRange_" + i + "' maxlength='5' /></label>";
    resHtml += "</td>";
    resHtml += "<td closeId='" + i + "' class='removeRanges'><i class='fa fa-times pointer'></i></td>";
    resHtml += "</tr>";
    $("#Range_" + (i - 1)).after(resHtml);
});

$("#addNumber").click(function () {
    var latestNumberId = 0, i = 0, resHtml = "";
    if ($(".IndividualNumbers").length > 0) {
        latestNumberId = $(".IndividualNumbers").last().attr("numberId");
        i = parseInt(latestNumberId) + 1;
    } else {
        i = 1;
    }
    resHtml += "<tr id='Number_"+ i +"' class='IndividualNumbers DynamicNumbers' numberId='"+ i +"'>";
    resHtml += "<td class='txt-lite-grey col-sm-3'></td><td>";
    resHtml += "<label class='blocked'><input type='text' class='form-control input-inline margin-right-5 onlynumbers' id='indNumber_" + i + "' maxlength='20' /></label>";
    resHtml += "</td>";
    resHtml += "<td closeId='" + i + "' class='removeNumbers' callerIdNum=''><i class='fa fa-times pointer'></i></td>";
    resHtml += "</tr>";
    $("#Number_" + (i - 1)).after(resHtml);
});
$(document).delegate(".removeRanges", "click", function () {
    var closeRangeId = $(this).attr("closeId");
    $("#Range_" + closeRangeId).remove();
});
$(document).delegate(".removeNumbers", "click", function () {
    var closeNumberId = $(this).attr("closeId");
    var closeNumber = $(this).attr("callerIdNum");
    if (closeNumber != "") {
        global_DeletedCallerIds.push({ "number": closeNumber });
    }
    $("#Number_" + closeNumberId).remove();
});
$(document).delegate(".onlynumbers", "keypress", function (e) {
    numericValidation(e);
});
$("#txtTotalChannels, .onlynumbers").keypress(function (e) {
    numericValidation(e);
});
$(document).delegate("#txtIp", "keypress", function (e) {
    var ipAddress1 = $("#txtIp").val();
    var count = 0;
    var operator = '.';
    for (var i = 0; i < ipAddress1.length; i++) {
        var hh = ipAddress1.charAt(i);
        if (operator == hh) {
            count = count + 1;
        }
        
        if (count >= 3 && e.which != 8 && e.which == 46) {
            e.preventDefault();
        }
    }
      ipAddressValidation(e);

});
$("#selAvailableStatus, #selAssignedStatus").change(function () {
   // getCallerIdNumbers();
});

$("#btnGetReports").click(function () {

    getCallerIdNumbers();

});

$("#btnSearchNumber").click(function () {
    searchGateway();
});
$('#txtSearch').keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        searchGateway();
    }
});

$(document).delegate(".statusUpdate", "click", function () {
    var status = $(this).text();
    var callerId = $(this).attr("callerId");
    if (status != "") {
        var statusId = 0;
        if (status.toLowerCase() == "disable") {
            $("#modalMessage").html("Are you sure, you want to disable the number ?");
            statusId = 3;
        } else if (status.toLowerCase() == "enable") {
            $("#modalMessage").html("Are you sure, you want to enable the number ?");
            statusId = 1;
        } if (status.toLowerCase() == "release") {
            $("#modalMessage").html("Are you sure, you want to release the number ?");
            statusId = 1;
        }
        $("#btnCnfm").attr("statusId", statusId).attr("callerId", callerId);
        
        $("#cnfmPopup").modal("show");
    }
});
$("#btnCnfm").click(function () {
    var editStatusId = $(this).attr("statusId");
    var editCallerId = $(this).attr("callerId");
    if (editStatusId != "") {

        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
        $.ajax({
            url: "Handlers/Manager.ashx",
            type: "POST",
            async: false,
            dataType: "JSON",
            data: {
                type: 18, statusId: editStatusId, callerId: editCallerId
            },
            success: function (res) {
                $.unblockUI();
                var resHtml = "";
                if (res.Success == "True") {
                    getCallerIdNumbers();
                    $("#cnfmPopup").modal("hide");
                } else {
                    console.log(res.Message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.unblockUI();
                if (jqXHR.status == 401) {
                    window.location.href = "/Login.aspx?message=Session expired";
                } else if (jqXHR.status == 406) {
                    $("#modalPreviousSession").modal("show");
                } else {
                    console.log(errorThrown);
                }
            }
        });
    }
});

$(document).delegate(".editGateways", "click", function () {
    global_DeletedCallerIds = [];
    $("#divGatewayError, #divGatewaySuccess").html("");
    var editGatewayId = $(this).attr("gatewayId");
    if (editGatewayId != "") {

        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
        $.ajax({
            url: "Handlers/Manager.ashx",
            type: "POST",
            async: false,
            dataType: "JSON",
            data: {
                type: 16, gatewayId: editGatewayId
            },
            success: function (res) {
                $.unblockUI();
                var resHtml = "";
                if (res.Success == "True") {
                    if (res.Gateways.length > 0) {
                        $("#txtGatewayName").val(res.Gateways[0].Name);
                        $("#txtIp").val(res.Gateways[0].Ip);
                        $("#txtTotalChannels").val(res.Gateways[0].TotalChannels);
                        $("#chkNumber").prop("checked", true);
                        $("#chkRange").prop("checked", false);
                        $("#addRange").hide();
                        $("#addNumber").show();
                        $(".DynamicNumbers, .DynamicRanges").remove();
                        if (res.Numbers.length > 0) {
                            for (var i = 0; i < res.Numbers.length; i++) {
                                resHtml += "<tr id='Number_" + (i+1) + "' class='IndividualNumbers DynamicNumbers' numberId='" + (i+1) + "'>";
                                resHtml += "<td class='txt-lite-grey col-sm-3'></td><td>";
                                resHtml += "<label class='blocked'><input type='text' class='form-control input-inline margin-right-5 onlynumbers' id='indNumber_" + (i+1) + "' value='" + res.Numbers[i].Number + "' disabled /></label>";
                                resHtml += "</td>";
                                resHtml += "<td closeId='" + (i + 1) + "' class='removeNumbers' callerIdNum='" + res.Numbers[i].Number + "'><i class='fa fa-times pointer'></i></td>";
                                resHtml += "</tr>";
                            }
                            $("#Number_0").after(resHtml);
                        }
                        $("#divGatewayError").html("");
                        $("#btnSaveGateway").attr("gatewayId", editGatewayId).text("Update");
                        $("#createGateway").modal("show");
                        }
                } else {
                    console.log(res.Message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.unblockUI();
                if (jqXHR.status == 401) {
                    window.location.href = "/Login.aspx?message=Session expired";
                } else if (jqXHR.status == 406) {
                    $("#modalPreviousSession").modal("show");
                } else {
                    console.log(errorThrown);
                }
            }
        });
    }
});


$("#btnSaveGateway").click(function () {
    var gatewayId = $(this).attr("gatewayId");
    var gatewayName = $("#txtGatewayName").val();
    var serverIp = $("#txtIp").val();
    var channelsCount = $("#txtTotalChannels").val();
    gatewayName = gatewayName.trim();
    if (gatewayName == "") {
        $("#divGatewayError").html("Please enter Gateway name");
        return false;
    }
    if (serverIp == "") {
        $("#divGatewayError").html("Please enter Server ip");
        return false;
    }
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(serverIp) == false)
    {  
        alert("You have entered an invalid IP address!");
        return (false)
    }  
    
   
    if (channelsCount == "") {
        $("#divGatewayError").html("Please enter Total channels");
        return false;
    }
    
    var rangeArray = []; checkRange = 0;
    //if ($("input[name='num']:checked").val() == "1"){
    if($("#chkRange").is(":checked")){
        var rangeId = 0, prefix = "", fromRange = "", toRange = "";

        $(".RangeOfNumbers").each(function(){
            rangeId = $(this).attr("rangeId");
            prefix = $("#prefix_" + rangeId).val();
            fromRange = $("#fromRange_" + rangeId).val();
            toRange = $("#toRange_" + rangeId).val();

            if (prefix == "") {
                $("#divGatewayError").html("Please enter Prefix value");
                checkRange = 1;
                return false;
            }

            if (fromRange == "") {
                $("#divGatewayError").html("Please enter From range value");
                checkRange = 1;
                return false;
            }

            if (toRange == "") {
                $("#divGatewayError").html("Please enter To range value");
                checkRange = 1;
                return false;
            }

            if (parseInt(fromRange) > parseInt(toRange)) {
                $("#divGatewayError").html("From range should be less than To range");
                checkRange = 1;
                return false;
            }

            if (toRange.startsWith("0")) {
                $("#divGatewayError").html("To range should not contain leading zeros");
                checkRange = 1;
                return false;
            }

            rangeArray.push({ "prefix": $("#prefix_" + rangeId).val(), "fromrange": $("#fromRange_" + rangeId).val(), "torange": toRange });
        });
    }

    if (checkRange == 1) {
        return false;
    }

    var individualNumberArray = [], checkNumber = 0;
    // if ($("input[name='num']:checked").val() == "0") {
    if ($("#chkNumber").is(":checked")) {
        var numberId = 0, indNumber = "";
        $(".IndividualNumbers").each(function () {
            numberId = $(this).attr("numberId");
            indNumber = $("#indNumber_" + numberId).val();
            if (indNumber == "") {
                $("#divGatewayError").html("Please enter number");
                checkNumber = 1;
                return false;
            }
            individualNumberArray.push({"number": indNumber});
        });
    }

    if (checkNumber == 1) {
        return false;
    }

    if (rangeArray.length == 0 && individualNumberArray.length == 0) {
        $("#divGatewayError").html("Please enter Ranges or Individual Numbers ");
        return false;
    }

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
        $.ajax({
            url: "Handlers/Manager.ashx",
            type: "POST",
            async: false,
            dataType: "JSON",
            data: {
                type: 15, gatewayId: gatewayId, gatewayName: gatewayName, serverIp: serverIp,
                rangeCallerIds: JSON.stringify(rangeArray), individualCallerIds: JSON.stringify(individualNumberArray),
                totalChannels: channelsCount, deletedCallerIds: JSON.stringify(global_DeletedCallerIds)
            },
            success: function (res) {
                $.unblockUI();
                var resHtml = "";
                if (res.Success == "True") {
                    $("#divGatewaySuccess").html(res.Message);
                    $("#divGatewayError").html("");
                    getGateways();
                    getCallerIdNumbers();
                    setTimeout(function () { $("#createGateway").modal("hide"); }, 500);
                } else {
                    $("#divGatewayError").html(res.Message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.unblockUI();
                $("#divGatewayError").html(res.Message);
                if (jqXHR.status == 401) {
                    window.location.href = "/Login.aspx?message=Session expired";
                } else if (jqXHR.status == 406) {
                    $("#modalPreviousSession").modal("show");
                } else {
                    console.log(errorThrown);
                }
            }
        });
});

function searchGateway() {
    //var searchNumber = $("#txtSearch").val();
    //if (searchNumber == "") {
    //    alert("Please enter search value");
    //    return false;
    //} else {
        getCallerIdNumbers();
    //}
}

function getGateways() {

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });


    $.ajax({
        url: "Handlers/Manager.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 14
        },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (res.Success == "True") {
                if (res.Gateways.length > 0) {
                    for (var i = 0; i < res.Gateways.length; i++) {
                        resHtml += "<tr>";
                        resHtml += "<td>"+ res.Gateways[i].Name +"</td>";
                        resHtml += "<td>"+ res.Gateways[i].Ip +"</td>";
                        resHtml += "<td>" + res.Gateways[i].Channels + "</td>";
                        resHtml += "<td><a class='font-blue editGateways' gatewayId='"+ res.Gateways[i].Id +"'><i class='icon-pencil'></i></a></td>";
                        resHtml += "</tr>";
                    }
                    $("#tbodyGateways").html(resHtml);
                } else {
                    $("#tbodyGateways").html("<tr><td colspan='4' class='text-center' style='color:red;'>No Gateways</td></tr>");
                }
            } else {
                $("#tbodyGateways").html("<tr><td colspan='4' class='text-center' style='color:red;'>No Gateways</td></tr>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
           $.unblockUI();
            $("#tbodyGateways").html("<tr><td colspan='4' class='text-center' style='color:red;'>No Gateways</td></tr>");
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else if (jqXHR.status == 406) {
                $("#modalPreviousSession").modal("show");
            } else {
                console.log(errorThrown);
            }
        }
    });
}

function getCallerIdNumbers() {

   

    var searchText = $("#txtSearch").val();
    searchText = searchText.trim();
    var availableStatus = $("#selAvailableStatus option:selected").val();
    var assignedStatus = $("#selAssignedStatus option:selected").val();

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });

    $.ajax({
        url: "Handlers/Manager.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 17, searchText: searchText, availableStatus: availableStatus, assignedStatus: assignedStatus
        },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (res.Success == "True") {
                if (res.CallerIds.length > 0) {
                    for (var i = 0; i < res.CallerIds.length; i++) {
                        resHtml += "<tr>";
                        resHtml += "<td>"+ res.CallerIds[i].CallerIdNumber +"</td>";
                        resHtml += "<td>"+ res.CallerIds[i].GatewayName +"</td>";
                        resHtml +=  "<td><div>";
                        if (res.CallerIds[i].StatusId == "1"){
                            resHtml += "<label class='stat_label'>Yes</label><label class='stat_label'>No</label>";
                        }else  if (res.CallerIds[i].StatusId == "2"){ 
                            resHtml += "<label class='stat_label'>Yes</label><label class='stat_label'>Yes</label>";
                        }else  if (res.CallerIds[i].StatusId == "3"){ 
                            resHtml += "<label class='stat_label'>No</label><label class='stat_label'>No</label>";
                        }
                        resHtml += "</div></td>";
                        if (res.CallerIds[i].StudioName != "") {
                            resHtml += "<td>" + res.CallerIds[i].StudioName + "</td>";
                        } else {
                            resHtml += "<td> - </td>";
                        }
                        
                        resHtml += "<td>";
                        if (res.CallerIds[i].StatusId == "1"){
                            resHtml += "<label class='btn btn-sm grey statusUpdate' callerId='" + res.CallerIds[i].CallerId + "'>Disable</label>";
                        }
                        else if (res.CallerIds[i].StatusId == "2"){
                            resHtml += "<label class='btn btn-sm btn-success statusUpdate' callerId='" + res.CallerIds[i].CallerId + "'>Release</label>";
                        }
                        else if (res.CallerIds[i].StatusId == "3"){
                            resHtml += "<label class='btn btn-sm blue statusUpdate' callerId='" + res.CallerIds[i].CallerId + "'>Enable</label>";
                        }
                        resHtml += "</td>";
                        resHtml += "</tr>";
                    }
                    $("#tblCallerIdNumbers").html(resHtml);
                } else {
                    $("#tblCallerIdNumbers").html("<tr><td colspan='4' class='text-center' style='color:red;'>No CallerIds</td></tr>");
                }
            } else {
                $("#tblCallerIdNumbers").html("<tr><td colspan='4' class='text-center' style='color:red;'>No CallerIds</td></tr>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#tblCallerIdNumbers").html("<tr><td colspan='4' class='text-center' style='color:red;'>No CallerIds</td></tr>");
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else if (jqXHR.status == 406) {
                $("#modalPreviousSession").modal("show");
            } else {
                console.log(errorThrown);
            }
        }
    });
}