var searchText = "";
var agentId = $("#hdnAgentId").val();
var global_pageLength = 7, global_pageIndex = 1;
var domain = location.host
var host = (location.protocol === 'https:') ? 'wss://' : 'ws://';
var page = '/ConferenceWebSocket.sub?Channel_Name=';
var ws;
var communicationTypeId = 0;

$(document).ready(function () {
    var hdnCbrId = $("#hdnCbrId").val();
    if (!isNaN(hdnCbrId)) {
        
        getCallBackRequests(2, hdnCbrId);
    }
    else {
        getCallBackRequests(2);
    }
    AgentsManagement(2);
    

    $("#txtSearch").keypress(function (e) {
        if(e.which == 13)
        {
            e.preventDefault();
            $("#btnSearch").click();
        }
    });

    $("#btnSearch").click(function () {
        searchText = $("#txtSearch").val();
        getCallBackRequests(2);
    })


    $(document).delegate(".btn-outbound-call", "click", function () {
        $(".btn-outbound-call").attr("disabled", true);
        var customerId = $(this).attr("caller-id");
        var customerMobile = $(this).attr("caller-mobile");
        var cbrId = $(this).attr("cbr-id");
        $(".btn-outbound-call[cbr-id='" + cbrId + "']").hide();
        //var customerId = $(this).attr("caller-id");
        $(".loader-gif[cbr-id='" + cbrId + "']").show();
        var randomUUID = createUUID();
        if (communicationTypeId != "" && parseInt(communicationTypeId) > 0) {
            if (communicationTypeId == "1") {
                window.location.href = "/AgentHome.aspx?CbrId=" + cbrId + "&CustomerId=" + customerId + "&CustomerMobile=" + customerMobile + "&CommunicationTypeId=" + communicationTypeId;
            }
            else {
                var hostTotal = host + domain + page + "Agent_o_" + randomUUID;
                ws = new WebSocket(hostTotal);
                ws.onopen = function (evt) {
                    console.log("WebSocket Connection Open");
                    console.log(hostTotal);
                };
                ws.onmessage = function (evt) {
                    console.log("WebSocket Connection data ");
                    console.log(evt);
                    var websocketResult = "";
                    if (evt != "") {
                        websocketResult = jQuery.parseJSON(evt.data);
                        if (websocketResult.Event == "hangup") {
                            alert("Unable to connect to your device. Please check the connectivity. Cause: (" + websocketResult.Message.replace(/_/g, " ") + ")");
                        } else if (websocketResult.Event == "newcall") {
                            window.location.href = "/AgentHome.aspx?CallId=" + websocketResult.CallId + "&CbrId=" + cbrId + "&CustomerId=" + customerId + "&CustomerMobile=" + customerMobile + "&CallUUID=" + randomUUID;
                        }
                        $(".loader-gif[cbr-id='" + cbrId + "']").hide();
                        $(".btn-outbound-call[cbr-id='" + cbrId + "']").show();
                        $(".btn-outbound-call").attr("disabled", false);
                    } else {
                        $(".loader-gif[cbr-id='" + cbrId + "']").hide();
                        $(".btn-outbound-call[cbr-id='" + cbrId + "']").show();
                        $(".btn-outbound-call").attr("disabled", false);
                    }
                };

                $.blockUI({
                    message: '<img src="/assets/img/Press3_Gif.gif" />',
                    css: {
                        border: 'none',
                        backgroundColor: 'transparent',
                    }
                });
                $.ajax({
                    type: "GET",
                    url: "Handlers/Calls.ashx",
                    dataType: "JSON",
                    async: false,
                    data: { type: 13, customerId: customerId, callUUID: randomUUID, cbrId: cbrId },
                    success: function (res) {
                        $.unblockUI();
                        if (res.Success.toString().toLowerCase() == "true") {

                        } else {
                            $(".loader-gif[cbr-id='" + cbrId + "']").hide();
                            $(".btn-outbound-call[cbr-id='" + cbrId + "']").show();
                            $(".btn-outbound-call").attr("disabled", false);
                            alert(res.Message);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        $.unblockUI();
                        $(".loader-gif[cbr-id='" + cbrId + "']").hide();
                        $(".btn-outbound-call[cbr-id='" + cbrId + "']").show();
                        $(".btn-outbound-call").attr("disabled", false);
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
        }
    });

});

function getCallBackRequests(mode, cbrid) {

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    
    $.ajax({
        type: "GET",
        url: "Handlers/Calls.ashx",
        dataType: "JSON",
        async: false,
        data: {
            type: 7, mode: mode, searchText: searchText, assignesAgentId: agentId, length: global_pageLength, index: global_pageIndex,
            CbrId: cbrid
        },
        success: function (res) {
            $.unblockUI();
            if(res.Success == "True")
            {
                
                var callBackRequestsData = "<table class='table table-advance table-bordered cbr_his'><thead><tr>";
                callBackRequestsData += "<th>Status</th><th>Status Closed By</th><th>Scheduled On</th><th>IVR-Studio</th><th>Caller Name</th>";
                callBackRequestsData += "<th>Number</th><th>CBR Notes</th><th>Created By</th><th>Created On</th>";
                callBackRequestsData += "<th>Skill Group</th><th>Dial Out Type</th><th>Actions</th></tr></thead><tbody>";
                if (res.Total > 0) {
                    $("#page-selection").show();
                    pagination(res.Total, global_pageLength)
                    if (res.CallBackRequests.length > 0) {

                        for (var i = 0; i < res.CallBackRequests.length; i++) {
                            if (res.CallBackRequests[i].Status == "Scheduled") {
                                callBackRequestsData += "<tr><td><div class='label label-xs label-warning f_11 margin-left-5'>Scheduled</div></td></td>";
                            }
                            else if (res.CallBackRequests[i].Status == "Cancelled") {
                                callBackRequestsData += "<tr><td><div class='label label-xs label-default f_11 margin-left-5'>Cancelled</div></td></td>";
                            }
                            else if (res.CallBackRequests[i].Status == "Closed") {
                                callBackRequestsData += "<tr><td><div class='label label-xs label-success f_11 margin-left-5'>Closed</div></td></td>";
                            }
                            else if (res.CallBackRequests[i].Status == "Open") {
                                callBackRequestsData += "<tr><td><div class='label label-xs label-danger f_11 margin-left-5'>Open</div></td>";
                            }
                            callBackRequestsData += "<td class='text-center'>-</td>";
                            callBackRequestsData += "<td>" + res.CallBackRequests[i].CallDateTime + "</td>";
                            callBackRequestsData += "<td>" + res.CallBackRequests[i].StudioName + "</td>";
                            callBackRequestsData += "<td>" + res.CallBackRequests[i].CallerName + "</td>";
                            callBackRequestsData += "<td>" + res.CallBackRequests[i].Mobile + "</td>";
                            callBackRequestsData += "<td>" + res.CallBackRequests[i].Notes + "</td>";
                            callBackRequestsData += "<td>" + res.CallBackRequests[i].CreatedBy + "</td>"
                            callBackRequestsData += "<td>" + res.CallBackRequests[i].CreatedOn + "</td>";
                            callBackRequestsData += "<td><label class='label_round_blue'>" + res.CallBackRequests[i].Name + "</label></td>";
                            //callBackRequestsData += "<td>" + res.CallBackRequests[i].DialType + "</td><td><button type='button' class='btn btn-xs btn-success f_11'><i class='fa fa-phone margin-right-5'></i>Call</button></td></tr>";
                            callBackRequestsData += "<td>" + res.CallBackRequests[i].DialType + "</td>";
                            //"<td><button type='button' class='btn btn-xs btn-success f_11 btn-outbound-call' caller-id='" + res.CallBackRequests[i].CallerId + "' caller-mobile='" + res.CallBackRequests[i].Mobile + "' cbr-id='" + res.CallBackRequests[i].Id + "'><i class='fa fa-phone margin-right-5'></i>Call</button><img src='/assets/img/ajax-loader.gif' style='display:none;width: 20px;height:20px;margin-left:12px;' class='loader-gif' caller-id='" + res.CallBackRequests[i].CallerId + "' cbr-id='" + res.CallBackRequests[i].Id + "' /></td></tr>";
                            if (res.CallBackRequests[i].Status == "Closed" && res.CallBackRequests[i].CallId != "") {
                                callBackRequestsData += "<td><button type='button' class='btn btn-xs btn-danger f_11 margin-left-5' callId='" + res.CallBackRequests[i].CallId + "' cbrid='" + res.CallBackRequests[i].Id + "' id='viewCbr'>View</button></td></tr>";
                            }
                            else if (res.CallBackRequests[i].Status == "Cancelled") {
                                callBackRequestsData += "<td>-</tr>";
                            }
                            else {
                                //callBackRequestsData += "<td><button type='button' class='btn btn-xs btn-success f_11'><i class='fa fa-phone margin-right-5'></i>Call</button></td></tr>";
                                callBackRequestsData += "<td><button type='button' class='btn btn-xs btn-success f_11 btn-outbound-call' caller-id='" + res.CallBackRequests[i].CallerId + "' caller-mobile='" + res.CallBackRequests[i].Mobile + "' cbr-id='" + res.CallBackRequests[i].Id + "'><i class='fa fa-phone margin-right-5'></i>Call</button><img src='/assets/img/ajax-loader.gif' style='display:none;width: 20px;height:20px;margin-left:12px;' class='loader-gif' caller-id='" + res.CallBackRequests[i].CallerId + "' cbr-id='" + res.CallBackRequests[i].Id + "' /></td></tr>"
                            }
                        }
                    }
                    else
                    {
                        callBackRequestsData += "<tr><td colspan='11' class='text-center' > No Data Found </td></tr>"
                    }
                  }
                else
                {
                    callBackRequestsData += "<tr><td colspan='11' class='text-center' > No Data Found </td></tr>"
                }
                callBackRequestsData += "</tbody></table>";
                $("#callBackRequests").html(callBackRequestsData);
                if (res.IsInCall.toString().toLowerCase() == "true") {
                    $(".btn-outbound-call").attr("disabled", true);
                }
            }
            else {
                alert(res.Message);
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
function pagination(rowCount, global_pageLength) {
    $('#page-selection').bootpag({
        total: Math.ceil(rowCount / global_pageLength),
        next: "Next",
        prev: "Prev",
        maxVisible: 8
    }).on("page", function (event, num) {
        if (global_pageIndex != num) {
            global_pageIndex = num;
            getCallBackRequests(2)
        }
    });
}
function createUUID() {
    var s = []; var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++)
    { s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1); }
    s[14] = "4";
    // bits 12-15 of the time_hi_and_version field to 0010 
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    // bits 6-7 of the clock_seq_hi_and_reserved to 01 
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}
function AgentsManagement(mode) {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "POST",
        url: "Handlers/Agents.ashx",
        dataType: "JSON",
        async: false,
        data: {
            type: 8, Mode: mode, AgentId: agentId
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.AgentInformation.length > 0) {
                    communicationTypeId = res.AgentInformation[0].CommunicationTypeId;
                }
            } else {
                alert(res.Message);
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

$(document).delegate("#viewCbr", "click", function () {
    var cbrid = $(this).attr("cbrid");
    if (cbrid > 0) {
        window.location.href = "/CallHistory.aspx?cbrid=" + cbrid;
    }
});