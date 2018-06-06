var searchText = "", status = 0, assignedAgentId = 0, skillGroupId = 0, dialOuttype = 0, fromDate = "", toDate = "";
var glbAgentsData = "";
var global_pageLength = 7, global_pageIndex = 1;
var downloadbtnToggle = true; global_StudioId = 0;
var agentId = $("#hdnAgentId").val();
var communicationTypeId = 0;
var domain = location.host
var host = (location.protocol === 'https:') ? 'wss://' : 'ws://';
var page = '/ConferenceWebSocket.sub?Channel_Name=';
var ws;

$(document).ready(function () {
    AgentsManagement(2);
    getCBRSearchRelatedData()
    getCallBackRequests(2);
    $("#txtFromDate").datepicker();
    $("#txtToDate").datepicker();

    $("#btnSearch,#btnGet").click(function () {
        searchText = $("#txtSearch").val();
        searchText = searchText.trim();
        status = $("#ddlStatus").val();
        assignedAgentId = $("#ddlAgents").val();
        skillGroupId = $("#ddlSkillGroups").val();
        dialOuttype = $("#ddlDialOutType").val();
        fromDate = $("#txtFromDate").val();
        toDate = $("#txtToDate").val();
        global_StudioId = $("#ddlIvrStudio").val();
        $('#hdnSearchText').val(searchText);
        $('#hdnstatus').val(status);
        $('#hdnStickyAgent').val(assignedAgentId);
        $('#hdnSkillGroup').val(skillGroupId);
        $('#hdnDialOutType').val(dialOuttype);
        $('#hdnFromDate').val(fromDate);
        $('#hdnToDate').val(toDate);
        $('#hdnStudioId').val(global_StudioId);
        global_pageLength = 7;
        global_pageIndex = 1;
        getCallBackRequests(2);
    })

    $('#txtSearch').on('keypress', function (e) {
        if (e.which === 13) {
            $("#btnSearch").click();
            e.preventDefault();
        }

    });
    $('#txtSearch').on('keyup', function (e) {
        if (this.value == "") {
            $("#btnSearch").click();
            e.preventDefault();
        }

    });

    $(document).delegate(".Agents", "change", function () {

        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
        var agentId = $(this).val();
        var requestId = $(this).attr("RequestId");

        $.ajax({
            type: "GET",
            url: "Handlers/Calls.ashx",
            dataType: "JSON",
            async: false,
            data: {
                type: 9, toAgentId: agentId, requestId: requestId
            },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {

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

    });
});

function getCallBackRequests(mode) {

    //$("#btnGet").attr("disabled", true);

    //$("#callBackRequests").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");

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
        async: true,
        data: {
            type: 7, mode: mode, searchText: searchText, status: status, assignesAgentId: assignedAgentId, skillGroupId: skillGroupId,
            dialType: dialOuttype, fromDate: fromDate, toDate: toDate, length: global_pageLength, index: global_pageIndex, StudioId: global_StudioId
        },
        success: function (res) {

            $.unblockUI();

            $("#btnGet").attr("disabled", false);
            if (res.Success == "True") {
                //$.unblockUI();
                var callBackRequestsData = ""
                callBackRequestsData = "<table class='table table-advance table-bordered cbr_his'><thead><tr>";
                callBackRequestsData += "<th>Status</th><th>Closed By</th><th>Scheduled On</th><th>Caller Name</th>";
                callBackRequestsData += "<th>Number</th><th>CBR Notes</th><th>IVR-Studio</th><th>Created By</th><th>Created On</th>";
                callBackRequestsData += "<th>Skill Group</th><th>Sticky Agent</th><th>Dial Out Type</th><th>Actions</th></tr></thead><tbody>";
                if (res.Total > 0) {
                    $("#page-selection").show();
                    pagination(res.Total, global_pageLength)
                    if (res.CallBackRequests.length > 0) {

                        if (downloadbtnToggle == false) {
                            $('#DownloadExcelReports').show("slow");
                            downloadbtnToggle = true;
                        }

                        for (var i = 0; i < res.CallBackRequests.length; i++) {
                            //<div class='label label-xs label-success f_11 margin-left-5'  id=''>Cancelled</div></td>
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
                            callBackRequestsData += "<td>" + res.CallBackRequests[i].CallerName + "</td>";
                            callBackRequestsData += "<td>" + res.CallBackRequests[i].Mobile + "</td>";
                            callBackRequestsData += "<td>" + res.CallBackRequests[i].Notes + "</td>";
                            callBackRequestsData += "<td>" + res.CallBackRequests[i].StudioName + "</td>";
                            callBackRequestsData += "<td>" + res.CallBackRequests[i].CreatedBy + "</td>"
                            callBackRequestsData += "<td>" + res.CallBackRequests[i].CreatedOn + "</td>";
                            callBackRequestsData += "<td><label class='label_round_blue'>" + res.CallBackRequests[i].Name + "</label></td>";
                            if (res.CallBackRequests[i].Status == "Closed") {
                                callBackRequestsData += "<td>" + res.CallBackRequests[i].AssignedToAgent + "</td>";
                            }
                            else {
                                if (res.CallBackRequests[i].AssignedTo == 0) {
                                    callBackRequestsData += "<td><div><select RequestId=" + res.CallBackRequests[i].Id + " class='Agents' ><option value='0'> Not Assigned </option> " + glbAgentsData + " </select></div></td>";
                                }
                                else {
                                    callBackRequestsData += "<td><div><select RequestId=" + res.CallBackRequests[i].Id + " AssignedAgent=" + res.CallBackRequests[i].AssignedTo + " class='Agents AssignedAgents' >" + glbAgentsData + " </select></div></td>";
                                }


                            }

                            callBackRequestsData += "<td>" + res.CallBackRequests[i].DialType + "</td>";
                            if (res.CallBackRequests[i].Status == "Closed" && res.CallBackRequests[i].CallId != "") {
                                callBackRequestsData += "<td><button type='button' class='btn btn-xs cbr-view-btn f_11 margin-left-5' callId='" + res.CallBackRequests[i].CallId + "' cbrid='" + res.CallBackRequests[i].Id + "' id='viewCbr'>View</button></td></tr>";
                            }
                            else if (res.CallBackRequests[i].Status == "Cancelled") {
                                callBackRequestsData += "<td>-</tr>";
                            }
                            else {
                                //callBackRequestsData += "<td><div class='btn-group' style='width: 140px;'><button type='button' class='btn btn-xs cbr-call-btn f_11'><i class='fa fa-phone margin-right-5'></i>Call</button><button type='button' class='btn btn-xs cbr-cancel-btn f_11 margin-left-5' cbrid='" + res.CallBackRequests[i].Id + "' id='cancelCbr'>Cancel</button></div></td></tr>";
                                callBackRequestsData += "<td><div class='btn-group' style='width: 140px;'><button type='button' class='btn btn-xs cbr-call-btn f_11 btn-outbound-call' caller-id='" + res.CallBackRequests[i].CallerId + "' caller-mobile='" + res.CallBackRequests[i].Mobile + "' cbr-id='" + res.CallBackRequests[i].Id + "'><i class='fa fa-phone margin-right-5'></i>Call</button><img src='/assets/img/ajax-loader.gif' style='display:none;width: 20px;height:20px;margin-left:12px;' class='loader-gif' caller-id='" + res.CallBackRequests[i].CallerId + "' cbr-id='" + res.CallBackRequests[i].Id + "' /><button type='button' class='btn btn-xs cbr-cancel-btn f_11 margin-left-5' cbrid='" + res.CallBackRequests[i].Id + "' id='cancelCbr'>Cancel</button></div></td></tr>"
                            }
                        }
                        $("#showingRecords").html(parseInt(parseInt(global_pageIndex - 1) * 7 + 1) + " - " + parseInt(((global_pageIndex - 1) * 7) + res.CallBackRequests.length) + " of " + res.Total);
                    }

                    else {
                        callBackRequestsData += "<tr><td colspan='12' class='text-center' > No Data Found </td></tr>"
                        $('#DownloadExcelReports').hide("slow");
                        downloadbtnToggle = false;
                        $("#page-selection").hide();
                    }
                } else {
                    callBackRequestsData += "<tr><td colspan='12' class='text-center' > No Data Found </td></tr>"
                    $('#DownloadExcelReports').hide("slow");
                    downloadbtnToggle = false;
                    $("#page-selection").hide();
                }
                callBackRequestsData += "</tbody></table>";
                $("#callBackRequests").html(callBackRequestsData);
                $(".AssignedAgents").each(function () {
                    var assigned = $(this).attr("AssignedAgent");
                    $(this).val(assigned);
                });

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

function getCBRSearchRelatedData() {

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
            type: 8
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                var agentsData = "";
                var statusesData = "<option value='0' >Select</option>";
                var skillGroupsData = "<option value='0' >Select</option>";
                var ivrstudio = "<option value='0' >Select</option>";
                if (res.Agents.length > 0) {
                    for (var i = 0; i < res.Agents.length ; i++) {
                        agentsData += "<option value='" + res.Agents[i].Id + "'>" + res.Agents[i].Name + "</option>";
                    }
                }

                if (res.CallBackRequestsStatuses.length > 0) {
                    for (var i = 0; i < res.CallBackRequestsStatuses.length ; i++) {
                        statusesData += "<option value='" + res.CallBackRequestsStatuses[i].Id + "'>" + res.CallBackRequestsStatuses[i].Status + "</option>";
                    }
                }

                if (res.SkillGroups.length > 0) {
                    for (var i = 0; i < res.SkillGroups.length ; i++) {
                        skillGroupsData += "<option value='" + res.SkillGroups[i].Id + "'>" + res.SkillGroups[i].Name + "</option>";
                    }

                }
                if (res.Ivr_Studios.length > 0) {
                    for (var i = 0; i < res.Ivr_Studios.length ; i++) {
                        ivrstudio += "<option value='" + res.Ivr_Studios[i].Id + "'>" + res.Ivr_Studios[i].Name + "</option>";
                    }

                }
                $("#ddlStatus").html(statusesData);
                $("#ddlAgents").append(agentsData);
                $("#ddlSkillGroups").html(skillGroupsData);
                $("#ddlIvrStudio").html(ivrstudio);

                glbAgentsData = agentsData
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

$(document).delegate("#cancelCbr", "click", function () {

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    var cbrid = $(this).attr("cbrid");
    $.ajax({
        type: "GET",
        url: "Handlers/Calls.ashx",
        dataType: "JSON",
        async: false,
        data: {
            type: 16, cbrId: cbrid, status: 3
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                getCallBackRequests(2);
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
})


$(document).delegate("#viewCbr", "click", function () {
    var cbrid = $(this).attr("cbrid");
    if (cbrid > 0) {
        window.location.href = "/CallHistory.aspx?cbrid=" + cbrid;
    }
    
});

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