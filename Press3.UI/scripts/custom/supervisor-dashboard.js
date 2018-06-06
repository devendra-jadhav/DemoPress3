var global_AgentsList = "", id_and_timers = [];
var accountId = 0, agentId = 0, roleId = 0;
$(document).ready(function () {
    accountId = $("#hdnAccountId").val();
    agentId = $("#hdnAgentId").val();
    roleId = $("#hdnRoleId").val();

    var domain = location.host
    var host = (location.protocol === 'https:') ? 'wss://' : 'ws://';
    var page = '/ConferenceWebSocket.sub?Channel_Name=';
    var ws;
    var hostTotal = host + domain + page + "manager_" + accountId;
    console.log(hostTotal);
    ws = new WebSocket(hostTotal);
    ws.onopen = function (evt) {
        console.log("WebSocket Connection Open ");
    };
    ws.onmessage = function (evt) {
        console.log("WebSocket Connection data ");
        console.log(evt);
        var websocketResult = "";
        if (evt != "") {
            websocketResult = jQuery.parseJSON(evt.data);
                    if ("AgentsLoggedin" in websocketResult) {
                        $("#h4AgentsLoggedin").text(websocketResult.AgentsLoggedin);
                    }
                    if ("AgentsReady" in websocketResult) {
                        $("#h4AgentsReady").text(websocketResult.AgentsReady);
                    }
                    if ("AgentsOncall" in websocketResult) {
                        $("#h4AgentsOnCall").text(websocketResult.AgentsOnCall);
                    }
                    if ("TotalCallsToday" in websocketResult) {
                        $("#h4TotalCalls").text(websocketResult.TotalCallsToday);
                    }
                    if ("AvgSpeedOfAnswer" in websocketResult) {
                        $("#h4AvgAnswerSpeed").text(websocketResult.AvgSpeedOfAnswer);
                    }
                    if ("LongestCall" in websocketResult) {
                        $("#h4LongestCall").text(websocketResult.LongestCall);
                    }
                    if ("CallsAbove5min" in websocketResult) {
                        $("#h4CallsAbove5min").text(websocketResult.CallsAbove5min);
                    }
                    if ("Escalations" in websocketResult) {
                        $("#h4Escalations").text(websocketResult.Escalations);
                    }
                    if ("TotalConferencesToday" in websocketResult) {
                        $("#h4TotalConferences").text(websocketResult.TotalConferencesToday);
                    }
                    if ("CurrentSLA" in websocketResult) {
                        $("#h4CurrentSLA").text(websocketResult.CurrentSLA + '%');
                    }
                    if ("TargetSLA" in websocketResult) {
                        $("#spnTargetSLA").text("(Target: " + websocketResult.TargetSLA + "%)");
                    }
                    if ("AvgTalkTime" in websocketResult) {
                        if (websocketResult.AvgTalkTime == "") { $("#h4AvgTalkTime").text("00:00");}
                        else { $("#h4AvgTalkTime").text(websocketResult.AvgTalkTime); }
                    }
                    if ("AvgHandleTime" in websocketResult) {
                        if (websocketResult.AvgHandleTime == "") { $("#h4AvgHandleTime").text("00:00"); }
                        else { $("#h4AvgHandleTime").text(websocketResult.AvgHandleTime); }
                    }
                    if ("CallsAbondonedDuration" in websocketResult) {
                        if (websocketResult.CallsAbondonedDuration == "") { $("#h4CallsAbondonedDuration").text("00:00"); }
                        else { $("#h4CallsAbondonedDuration").text(websocketResult.CallsAbondonedDuration); }
                    }

                    if ("AgentsInBreak" in websocketResult) {
                        $("#h4AgentsInBreak").text(websocketResult.AgentsInBreak);
                    }
                    if ("AgentsACW" in websocketResult) {
                        $("#h4AgentsACW").text(websocketResult.AgentsACW);
                    }
                    if ("AgentsOWA" in websocketResult) {
                        $("#h4AgentsOWA").text(websocketResult.AgentsOWA);
                    }

            //if ("CallEvent" in websocketResult) {
            //    if ($("#divSupervisorView").is(":visible")) {
             //       setTimeout(function () {
                        getDashboard();
                        getLoggedInAgents();
                        getAgentsSummary(1);
                        getAgentsActiveOrWaitingCalls(1, 1);
                        getAgentsActiveOrWaitingCalls(2, 1);
                        getAgentsAvgTalkTimeVsWaitTimeReport();
                        getAgentsHandleTimeByHourReport();
                        getAgentsCallAbandonmentByHourReport();
                        getAgentsAvailabilityStatuses();
             //       }, 1500);
            //    }
            //}
        }
    };

    loginVerto();
        getDashboard();
        getLoggedInAgents();
        getAgentsSummary(1);
        getAgentsActiveOrWaitingCalls(1, 1);
        getAgentsActiveOrWaitingCalls(2, 1);
        getAgentsAvgTalkTimeVsWaitTimeReport();
        getAgentsHandleTimeByHourReport();
        getSLAByHourReport();
        getAgentsCallAbandonmentByHourReport();
        getAgentsAvailabilityStatuses();

    $(document).delegate(".durationActions", "click", function () {
        $(".durationActions").addClass("label-default").removeClass("label-primary");
        $(this).addClass("label-primary").removeClass("label-default");
        var selectedStatus = $("#agentStatusFilter").val();
        var duration = $(this).attr("actionType");
        getAgentsSummary(duration, selectedStatus);
    });
    $("#agentStatusFilter").change(function(){
        var selectedStatus= $("#agentStatusFilter").val();
        var duration = $(this).attr("actionType");
        getAgentsSummary(duration,selectedStatus);
    })
    $(document).delegate(".callTypes", "click", function () {
        getAgentsActiveOrWaitingCalls(1, $(this).attr("callType"));
        getAgentsActiveOrWaitingCalls(2, $(this).attr("callType"));
        $(".callTypes").addClass("label-default").removeClass("label-primary");
        $(this).addClass("label-primary").removeClass("label-default");
    });

    $(document).delegate(".lblListen,.lblWhisper,.lblJoin", "click", function () {
        if (IsReg == 1) {
            var callId = $(this).attr("callId");
            var calEvent = $(this).attr("Event");
            if (calEvent == "Listen Start" || calEvent == "Whisper Start" || calEvent == "Join Start") {
                $(".managerActions").attr("disabled", "disabled");
                $(this).removeAttr("disabled");
                CallActions(callId, agentId, 4, calEvent);
            }
            else if (calEvent == "Listen End" || calEvent == "Whisper End" || calEvent == "Join End") {
                var requestUUID = $(this).attr("RequestUUID");
                var httpUrl = $(this).attr("HttpURL");
                $(".managerActions").removeAttr("disabled");
                HangUp(callId, httpUrl, requestUUID, calEvent);
            }
            glbCallEvent = calEvent;
        }
    });

    $(document).delegate(".selPriorities", "change", function () {
        var callId = $(this).attr("callId");
        var priority = $(this).find("option:selected").val();

        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });

        $.ajax({
            type: "GET",
            url: "Handlers/Supervisor.ashx",
            dataType: "JSON",
            async: false,
            data: { type: 13, callId: callId, priority: priority },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {
                    $(".selPriorities[callId='" + callId + "']").val(priority);
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
function getDashboard() {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Supervisor.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 1 },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.DashboardDetails.length > 0) {
                    $("#spanActiveCallers").text(res.DashboardDetails[0].ActiveCallers);
                    $("#spanWaitingCallers").text(res.DashboardDetails[0].WaitingCallers);
                    var totalCallers = parseInt(res.DashboardDetails[0].ActiveCallers) + parseInt(res.DashboardDetails[0].WaitingCallers);
                    if (totalCallers == 0) {
                        $("#current_call").attr("aria-valuenow", "0").css("width", "0%");
                    } else {
                        var activeCallersPercentage = (parseInt(res.DashboardDetails[0].ActiveCallers) / totalCallers) * 100;
                        $("#current_call").attr("aria-valuenow", activeCallersPercentage / 100).css("width", activeCallersPercentage + "%");
                    }
                    $("#h4CurrentSLA").text(res.DashboardDetails[0].CurrentSLA + "%");
                    $("#spanTargetSLA").text(res.DashboardDetails[0].TargetSLA + "%");
                    $("#divSLA").attr("aria-valuenow", res.DashboardDetails[0].CurrentSLA / 100).css("width", res.DashboardDetails[0].CurrentSLA + "%");

                        $("#spnTargetSLA").text("(Target: " + res.DashboardDetails[0].TargetSLA + "%)");
                        if (res.DashboardDetails[0].AvgTalkTime == "") {
                            $("#h4AvgTalkTime").text("00:00");
                        }
                        else {
                            $("#h4AvgTalkTime").text(res.DashboardDetails[0].AvgTalkTime);
                        }
                        if (res.DashboardDetails[0].AvgHandleTime == "") {
                            $("#h4AvgHandleTime").text("00:00");
                        }
                        else {
                            $("#h4AvgHandleTime").text(res.DashboardDetails[0].AvgHandleTime);
                        }
                        if (res.DashboardDetails[0].CallsAbondonedDuration == "") {
                            $("#h4CallsAbondonedDuration").text("00:00");
                        }
                        else {
                            $("#h4CallsAbondonedDuration").text(res.DashboardDetails[0].CallsAbondonedDuration);
                        }

                        $("#h4AgentsLoggedin").text(res.DashboardDetails[0].AgentsLoggedin);
                        $("#h4AgentsAvailable").text(res.DashboardDetails[0].AgentsAvailable);
                        $("#h4AgentsOnCall").text(res.DashboardDetails[0].AgentsOnCall);
                        $("#h4AgentsInBreak").text(res.DashboardDetails[0].AgentsInBreak);
                        $("#h4AgentsACW").text(res.DashboardDetails[0].AgentsACW);
                        $("#h4AgentsOWA").text(res.DashboardDetails[0].AgentsOWA);
                        $("#h4AgentsReady").text(res.DashboardDetails[0].AgentsReady);

                        $("#h4CallsAbove5min").text(res.DashboardDetails[0].CallsAbove5min);
                        $("#h4LongestCall").text(res.DashboardDetails[0].LongestCall);
                        $("#h4TotalCalls").text(res.DashboardDetails[0].TotalCallsToday);
                        $("#h4Escalations").text(res.DashboardDetails[0].Escalations);
                        $("#h4AvgAnswerSpeed").text(res.DashboardDetails[0].AvgSpeedOfAnswer);
                        $("#h4TotalConferences").text(res.DashboardDetails[0].TotalConferencesToday);

                } else {
                    console.log(res.Message);
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
function getAgentsSummary(durationType, selectedAgentStatus) {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Supervisor.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 2, durationType: durationType, AgentStatus: selectedAgentStatus },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (res.Success == "True") {
                if (res.AgentDetails.length > 0) {

                    resHtml += "<table class='table ag_stat table-striped'><tr><th>Agent Name</th><th>Device Status</th><th>Login Type</th><th>Current Status</th><th>From (HH:MM:SS)</th><th>Inbound</th><th>Outbound</th><th>Answered</th><th>Handle Time (HH:MM:SS)</th><th>Idle Time (HH:MM:SS)</th></tr>";

                  //  resHtml += "<table class='table ag_stat table-striped'><tr><th>Agent Name</th><th>Login Type</th><th>Current Status</th><th>From (HH:MM:SS)</th><th>Inbound</th><th>Outbound</th><th>Answered</th><th>Handle Time (HH:MM:SS)</th><th>Idle Time (HH:MM:SS)</th></tr>";

                    for (var i = 0; i < res.AgentDetails.length; i++) {
                        resHtml += "<tr>";
                        if (res.AgentDetails[i].Name.length > 15) {
                            resHtml += "<td title=" + res.AgentDetails[i].Name.replace(" ", "") + "><a href='/AgentProfile.aspx?AgentId=" + res.AgentDetails[i].AgentId + "' target='_new'>" + res.AgentDetails[i].Name.substring(0, 15) + "...</a></td>";
                        }
                        else {
                            resHtml += "<td><a href='/AgentProfile.aspx?AgentId=" + res.AgentDetails[i].AgentId + "' target='_new'>" + res.AgentDetails[i].Name + "</a></td>";
                        }
                        if (res.AgentDetails[i].AgentActiveStatus == "!") {
                            resHtml += "<td><img src='Images\\nosignal.png' alt='No signal' data-toggle='tooltip' data-placement='right' title='No Signal' style='cursor:pointer;'></td>";
                        }
                        else if (res.AgentDetails[i].AgentActiveStatus == "RED") {
                            resHtml += "<td><img src='Images\\notregistered.png' alt='Not registered' data-toggle='tooltip' data-placement='right' title='Not Registered' style='cursor:pointer;'></td>";
                        }
                        else if (res.AgentDetails[i].AgentActiveStatus == "GREEN") {
                            resHtml += "<td><img src='Images\\registered.png' alt='registered' data-toggle='tooltip' data-placement='right' title='Registered' style='cursor:pointer;'></td>";
                        }
                        else {
                            resHtml += "<td>NA</td>";
                        }
                        
                        if (res.AgentDetails[i].LoginStatus.toString().toLowerCase() == "online") {
                            resHtml += "<td style='color:#2FB97A'>" + res.AgentDetails[i].LoginStatus + "</td>";
                        } else if (res.AgentDetails[i].LoginStatus.toString().toLowerCase() == "offline") {
                            resHtml += "<td style='color:#A7A7A7'>" + res.AgentDetails[i].LoginStatus + "</td>";
                        } else {
                            resHtml += "<td>" + res.AgentDetails[i].LoginStatus + "</td>";
                        }
                        resHtml += "<td style='color: " + res.AgentDetails[i].TextColorCode + "'>" + res.AgentDetails[i].PresentStatus + "</td>";
                        resHtml += "<td>" + res.AgentDetails[i].PresentStatusFrom + "</td><td>" + res.AgentDetails[i].Inbound + "</td><td>" + res.AgentDetails[i].Outbound + "</td><td>" + res.AgentDetails[i].AnsweredCalls + "</td><td>" + res.AgentDetails[i].HandleTime + "</td>";
                        resHtml += "<td>" + res.AgentDetails[i].IdleTime + "</td>";
                        resHtml += "</tr>";
                    }
                    resHtml += "</table>";
                } else {
                    resHtml += "<p style='text-align:center; margin-top:40px'>No Agents available</p>";
                }
            }
            else {
                resHtml += "<p style='text-align:center; margin-top:40px'>No Agents available</p>";
            }
            $("#divAgentsSummary").html(resHtml);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#divAgentsSummary").html("<p style='text-align:center; margin-top:40px'>No Agents available</p>");
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
function getAgentsActiveOrWaitingCalls(statusType, callType) {
    resetTimers();
    if (statusType == 1) { $("#divActiveCalls").html("<img style='margin-left:330px;margin-top:80px;' src='/assets/img/ajax-loader.gif' />"); }
    else { $("#divWaitingCalls").html("<img style='margin-left:500px;margin-top:80px;' src='/assets/img/ajax-loader.gif' />"); }

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });


    $.ajax({
        type: "GET",
        url: "Handlers/Supervisor.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 3, statusType: statusType, callType: callType },
        success: function (res) {
            $.unblockUI();
            var resActiveHtml = ""; resWaitingHtml = "";
            if (statusType == 1) { // Active calls
                if (res.Success == "True") {
                    if (res.ReportDetails.length > 0) {
                        $("#spanActiveCalls").text(res.ReportDetails.length);
                        resActiveHtml += "<table class='table ag_stat'><tr><th>Call Type</th><th>User Details</th><th>Skill Group</th><th>Agent</th><th>Duration</th><th>Actions</th></tr>";
                        for (var i = 0; i < res.ReportDetails.length; i++) {
                            resActiveHtml += "<tr>";
                            resActiveHtml += "<td>" + res.ReportDetails[i].CallType + "</td><td>" + res.ReportDetails[i].Customer + "</td>";
                            resActiveHtml += "<td>" + res.ReportDetails[i].SkillGroupName + "</td><td>" + res.ReportDetails[i].AgentName + "</td>";
                            resActiveHtml += "<td class='tdActiveCallsTimer' id='tdActiveCallsTimer_" + i + "'>" + res.ReportDetails[i].DurationTime + "</td>";
                            //resActiveHtml += "<td> - </td>";
                            resActiveHtml += "<td><label Event='Listen Start' CallId = " + res.ReportDetails[i].CallId + " class='lblListen margin-right-5 btn btn-sm btn-grey btn-circle managerActions' title='Listen'><i class='fa fa-headphones'></i></label>";
                            resActiveHtml += "<label Event='Whisper Start' CallId = " + res.ReportDetails[i].CallId + " class='lblWhisper margin-right-5 btn btn-sm btn-grey btn-circle managerActions' title='Whisper'><i class='fa fa-microphone'></i></label>";
                            resActiveHtml += "<label Event='Join Start' CallId = " + res.ReportDetails[i].CallId + " class='lblJoin margin-right-5 btn btn-sm btn-grey btn-circle managerActions' title='Join'><i class='icon icon-shuffle'></i></label>";
                            resActiveHtml += "<a href='/ScoreCard.aspx?CallId=" + res.ReportDetails[i].CallId + "&AgentId=" + res.ReportDetails[i].AgentId + "' target='_new'><label Event='Score Card' CallId = " + res.ReportDetails[i].CallId + " class='margin-right-5 btn btn-sm btn-grey btn-circle' title='Score Card'><i class='icon-tag'></i></label></a>";
                            resActiveHtml += "</tr>";
                        }
                        resActiveHtml += "</table>";
                    } else {
                        $("#spanActiveCalls").text(0);
                        resActiveHtml += "<p style='text-align:center; margin-top:40px'>No Active calls</p>";
                    }
                } else {
                    $("#spanActiveCalls").text(0);
                    resActiveHtml += "<p style='text-align:center; margin-top:40px'>No Active calls</p>";
                }
                $("#divActiveCalls").html(resActiveHtml);
                //$(".tdActiveCallsTimer").each(function () {
                //    var initialCount = $(this).text();
                //    startCount($(this).attr("id"), initialCount);
                //});
            }
            else if (statusType == 2) { // Waiting calls
                if (res.Success == "True") {
                    if (res.ReportDetails.length > 0) {
                        $("#spanWaitingCalls").text(res.ReportDetails.length);
                        resWaitingHtml += "<table class='table ag_stat'><tr><th>Waiting Time</th><th>User Details</th><th>Skill Group</th><th>Skills</th><th>Queue</th><th>Actions</th></tr>";
                        for (var i = 0; i < res.ReportDetails.length; i++) {
                            resWaitingHtml += "<tr>";
                            resWaitingHtml += "<td class='tdActiveCallsTimer' id='tdWaitingCallsTimer_" + i + "'>" + res.ReportDetails[i].DurationTime + "</td><td>" + res.ReportDetails[i].Customer + "</td>";
                            resWaitingHtml += "<td>" + res.ReportDetails[i].SkillGroupName + "</td><td>" + res.ReportDetails[i].Skills + "</td>";
                            resWaitingHtml += "<td>" + res.ReportDetails[i].QueueNo + "</td>";
                            resWaitingHtml += "<td><select class='form-control selPriorities' style='width:100px;' callId='" + res.ReportDetails[i].CallId + "'>" + setPriority(res.ReportDetails[i].Priority) + "</select></td>";
                            //resWaitingHtml += "<td><label class='margin-right-10 btn btn-sm btn-success pull-left' title='Listen'><i class='fa fa-phone margin-right-5'></i> Answer</label>";
                            //resWaitingHtml += "<div class='input-group input-group-sm pull-left'><select class='form-control' style='width:85px;' placeholder='Agents'>"+ global_AgentsList +"</select>";
                            //resWaitingHtml += "<span class='input-group-btn' style='width:auto;'><button class='btn blue' type='button'>Connect</button></span></div></td>";
                            resWaitingHtml += "</tr>";
                        }
                        resWaitingHtml += "</table>";
                    } else {
                        $("#spanWaitingCalls").text(0);
                        resWaitingHtml += "<p style='text-align:center; margin-top:40px'>No Waiting calls</p>";
                    }
                } else {
                    $("#spanWaitingCalls").text(0);
                    resWaitingHtml += "<p style='text-align:center; margin-top:40px'>No Waiting calls</p>";
                }
                $("#divWaitingCalls").html(resWaitingHtml);
            }
            else {
                console.log(res.Message);
                $("#divActiveCalls").html("<hr /><p style='text-align:center;'>No Active calls</p>");
                $("#divWaitingCalls").html("<hr /><p style='text-align:center;'>No Waiting calls</p>");
            }
            initializeTimers();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#divActiveCalls").html("<hr /><p style='text-align:center;'>No Active calls</p>");
            $("#divWaitingCalls").html("<hr /><p style='text-align:center;'>No Waiting calls</p>");
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
function getAgentsAvgTalkTimeVsWaitTimeReport() {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Supervisor.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 4 },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            resHtml += "<tr><th>Hour</th><th>Value</th></tr>";
            if (res.Success == "True") {
                if (res.ReportDetails.length > 0) {
                    for (var i = 0; i < res.ReportDetails.length; i++) {
                        resHtml += "<tr><th>"+ res.ReportDetails[i].Hour +"</th><th>"+ res.ReportDetails[i].AvgTalkTimeMin +"</th></tr>";
                    }
                    $("#tblAvgTalkTimeReport").html(resHtml);
                } else {
                    $("#tblAvgTalkTimeReport").html("No Reports");
                    console.log(res.Message);
                }
            }
            else {
                $("#tblAvgTalkTimeReport").html("No Reports");
                console.log(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#tblAvgTalkTimeReport").html("No Reports");
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
function getAgentsHandleTimeByHourReport() {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Supervisor.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 5 },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            resHtml += "<tr><th>Hour</th><th>Value</th></tr>";
            if (res.Success == "True") {
                if (res.ReportDetails.length > 0) {
                    for (var i = 0; i < res.ReportDetails.length; i++) {
                        resHtml += "<tr><th>" + res.ReportDetails[i].Hour + "</th><th>" + res.ReportDetails[i].AvgHandleTime + "</th></tr>";
                    }
                    $("#tblAvgHandleTimeReport").html(resHtml);
                } else {
                    $("#tblAvgHandleTimeReport").html("No Reports");
                    console.log(res.Message);
                }
            }
            else {
                $("#tblAvgHandleTimeReport").html("No Reports");
                console.log(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#tblAvgHandleTimeReport").html("No Reports");
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

function getAgentsCallAbandonmentByHourReport() {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Supervisor.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 6 },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            resHtml += "<tr><th>Hour</th><th>Value</th></tr>";
            if (res.Success == "True") {
                if (res.ReportDetails.length > 0) {
                    for (var i = 0; i < res.ReportDetails.length; i++) {
                        resHtml += "<tr><th>" + res.ReportDetails[i].Hour + "</th><th>" + res.ReportDetails[i].RateAll + "</th></tr>";
                    }
                    $("#tblCallAbandonmentReport").html(resHtml);
                } else {
                    $("#tblCallAbandonmentReport").html("No Reports");
                    console.log(res.Message);
                }
            }
            else {
                $("#tblCallAbandonmentReport").html("No Reports");
                console.log(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#tblCallAbandonmentReport").html("No Reports");
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
function getSLAByHourReport() {

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Supervisor.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 14 },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            resHtml += "<tr><th>Hour</th><th>Value</th></tr>";
            if (res.Success == "True") {
                if (res.ReportDetails.length > 0) {
                    for (var i = 0; i < res.ReportDetails.length; i++) {
                        resHtml += "<tr><th>" + res.ReportDetails[i].Hour + "</th><th>" + res.ReportDetails[i].CurrentSLA + " %</th></tr>";
                    }
                    $("#tblSLAReport").html(resHtml);
                } else {
                    $("#tblSLAReport").html("No Reports");
                    console.log(res.Message);
                }
            }
            else {
                $("#tblSLAReport").html("No Reports");
                console.log(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#tblSLAReport").html("No Reports");
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
function getLoggedInAgents() {

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Supervisor.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 7 },
        success: function (res) {
            $.unblockUI();
            global_AgentsList = "";
            if (res.Success == "True") {
                if (res.AgentDetails.length > 0) {
                    for (var i = 0; i < res.AgentDetails.length; i++) {
                        global_AgentsList += "<option value='" + res.AgentDetails[i].Id + "'>" + res.AgentDetails[i].Name + "</option>";
                    }
                } else {
                    console.log(res.Message);
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
function startCount(td_id) {
    var timer = setInterval(count, 1000, td_id);
    id_and_timers.push({ "td_id": td_id, "timer": timer });
}
function count(td_id) {
    var time_shown = $("#" + td_id).text();
    if (time_shown == "") {
        time_shown = "00:00:00";
    }
    var time_chunks = time_shown.split(":");
    var hour, mins, secs;

    hour = Number(time_chunks[0]);
    mins = Number(time_chunks[1]);
    secs = Number(time_chunks[2]);
    secs++;
    if (secs == 60) {
        secs = 0;
        mins = mins + 1;
    }
    if (mins == 60) {
        mins = 0;
        hour = hour + 1;
    }
    //if (hour == 13) {
    //    hour = 1;
    //}

    $("#" + td_id).text(getCurrent(hour) + ":" + getCurrent(mins) + ":" + getCurrent(secs));
}

function getCurrent(digit) {

    var zpad = digit + '';
    if (digit < 10) {
        zpad = "0" + zpad;
    }
    return zpad;
}

function resetTimers() {
    if (id_and_timers.length > 0) {
        for (var i = 0; i < id_and_timers.length; i++) {
            console.log("Clearing", id_and_timers[i]);
            console.log(id_and_timers[i].timer)
            clearInterval(id_and_timers[i].timer);
        }
    }
    id_and_timers = [];
}

function initializeTimers() {
    $(".tdActiveCallsTimer").each(function () {
        var initialCount = $(this).text();
        if (initialCount == "") { initialCount = "00:00:00"; }
        startCount($(this).attr("id"), initialCount);
    });
}

function loginVerto() {
    var loginNumber = "", Password = "", ip = "", port = "", url = ""
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        url: "Handlers/Agents.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 1
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.GatewayDetails.length > 0) {
                    loginNumber = res.GatewayDetails[0].UserName;
                    password = res.GatewayDetails[0].Password;
                    ip = res.GatewayDetails[0].Ip;
                    port = res.GatewayDetails[0].Port;
                    url = "wss://" + ip + ":8082";
                    Initlogin(loginNumber, password, url, ip);
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

function changeVertoRegistrationStatus(status) {
    //$.blockUI({
    //    message: '<img src="/assets/img/Press3_Gif.gif" />',
    //    css: {
    //        border: 'none',
    //        backgroundColor: 'transparent',
    //    }
    //});
    $.ajax({
        url: "Handlers/Agents.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 3, Status: status
        },
        success: function (res) {
            //$.unblockUI();
            if (res.Success == "True") {

            }
            else {

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            //$.unblockUI();
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

function CallActions(callId, toAgentId, mode, calEvent) {
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
            type: 11, CallId: callId, ToAgentId: toAgentId, Mode: mode, CallEvent: calEvent
        },
        success: function (res) {
            $.unblockUI();
            console.log($(".lblListen[CallId='" + callId + "']").html());
            if (res.Success == "True") {
                if (calEvent == "Listen Start") {
                    $(".lblListen[CallId='" + callId + "']").attr("Event", "Listen End");
                    $(".lblListen[CallId='" + callId + "']").attr("RequestUUID", res.RequestUUID);
                    $(".lblListen[CallId='" + callId + "']").attr("HttpURL", res.ConferenceInfo[0].HttpUrl);
                    $(".lblListen[CallId='" + callId + "']").removeClass("btn-grey").addClass("btn-success");
                }
                else if (calEvent == "Whisper Start") {
                    $(".lblWhisper[CallId='" + callId + "']").attr("Event", "Whisper End");
                    $(".lblWhisper[CallId='" + callId + "']").attr("RequestUUID", res.RequestUUID);
                    $(".lblWhisper[CallId='" + callId + "']").attr("HttpURL", res.ConferenceInfo[0].HttpUrl);
                    $(".lblWhisper[CallId='" + callId + "']").removeClass("btn-grey").addClass("btn-success");
                }
                else if (calEvent == "Join Start") {
                    $(".lblJoin[CallId='" + callId + "']").attr("Event", "Join End");
                    $(".lblJoin[CallId='" + callId + "']").attr("RequestUUID", res.RequestUUID);
                    $(".lblJoin[CallId='" + callId + "']").attr("HttpURL", res.ConferenceInfo[0].HttpUrl);
                    $(".lblJoin[CallId='" + callId + "']").removeClass("btn-grey").addClass("btn-success");
                }
            }
            else {
                alert(res.Message);
                $(".lblListen[CallId='" + callId + "']").attr("Event", "Listen End");
                $(".lblListen[CallId='" + callId + "']").attr("RequestUUID", "");
                $(".lblListen[CallId='" + callId + "']").attr("HttpURL", "");
                $(".lblListen[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
                $(".lblWhisper[CallId='" + callId + "']").attr("Event", "Whisper End");
                $(".lblWhisper[CallId='" + callId + "']").attr("RequestUUID", "");
                $(".lblWhisper[CallId='" + callId + "']").attr("HttpURL", "");
                $(".lblWhisper[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
                $(".lblJoin[CallId='" + callId + "']").attr("Event", "Join End");
                $(".lblJoin[CallId='" + callId + "']").attr("RequestUUID", "");
                $(".lblJoin[CallId='" + callId + "']").attr("HttpURL", "");
                $(".lblJoin[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $(".lblListen[CallId='" + callId + "']").attr("Event", "Listen End");
            $(".lblListen[CallId='" + callId + "']").attr("RequestUUID", "");
            $(".lblListen[CallId='" + callId + "']").attr("HttpURL", "");
            $(".lblListen[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
            $(".lblWhisper[CallId='" + callId + "']").attr("Event", "Whisper End");
            $(".lblWhisper[CallId='" + callId + "']").attr("RequestUUID", "");
            $(".lblWhisper[CallId='" + callId + "']").attr("HttpURL", "");
            $(".lblWhisper[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
            $(".lblJoin[CallId='" + callId + "']").attr("Event", "Join End");
            $(".lblJoin[CallId='" + callId + "']").attr("RequestUUID", "");
            $(".lblJoin[CallId='" + callId + "']").attr("HttpURL", "");
            $(".lblJoin[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
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

function HangUp(callId, httpUrl, requestUUID, callEvent) {
    if (requestUUID == "") {
        alert("can not hangup right now");
        return false;
    }
    if (httpUrl == "") {
        alert("can not hangup right now");
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
        url: "Handlers/Conference.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 7, TalkingAgentRequestUUID: requestUUID, HttpURL: httpUrl
        },
        success: function (res) {
            $.unblockUI();
            console.log($(".lblListen[CallId='" + callId + "']").html());
            $(".lblListen[CallId='" + callId + "']").removeClass("btn-success").addClass("btn-grey");
            if (res.Success == true) {
                $(".managerActions").removeAttr("disabled");
                if (callEvent == "Listen End") {
                    $(".lblListen[CallId='" + callId + "']").attr("Event", "Listen Start");
                    $(".lblListen[CallId='" + callId + "']").attr("RequestUUID", "");
                    $(".lblListen[CallId='" + callId + "']").attr("HttpURL", "");
                    $(".lblListen[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
                }
                else if (callEvent == "Whisper End") {
                    $(".lblWhisper[CallId='" + callId + "']").attr("Event", "Whisper Start");
                    $(".lblWhisper[CallId='" + callId + "']").attr("RequestUUID", "");
                    $(".lblWhisper[CallId='" + callId + "']").attr("HttpURL", "");
                    $(".lblWhisper[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
                }
                else if (callEvent == "Join End") {
                    $(".lblJoin[CallId='" + callId + "']").attr("Event", "Join Start");
                    $(".lblJoin[CallId='" + callId + "']").attr("RequestUUID", "");
                    $(".lblJoin[CallId='" + callId + "']").attr("HttpURL", "");
                    $(".lblJoin[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
                }
            }
            else {
                alert(res.Message);
                $(".lblListen[CallId='" + callId + "']").attr("Event", "Listen Start");
                $(".lblListen[CallId='" + callId + "']").attr("RequestUUID", "");
                $(".lblListen[CallId='" + callId + "']").attr("HttpURL", "");
                $(".lblListen[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
                $(".lblWhisper[CallId='" + callId + "']").attr("Event", "Whisper Start");
                $(".lblWhisper[CallId='" + callId + "']").attr("RequestUUID", "");
                $(".lblWhisper[CallId='" + callId + "']").attr("HttpURL", "");
                $(".lblWhisper[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
                $(".lblJoin[CallId='" + callId + "']").attr("Event", "Join Start");
                $(".lblJoin[CallId='" + callId + "']").attr("RequestUUID", "");
                $(".lblJoin[CallId='" + callId + "']").attr("HttpURL", "");
                $(".lblJoin[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $(".lblListen[CallId='" + callId + "']").attr("Event", "Listen Start");
            $(".lblListen[CallId='" + callId + "']").attr("RequestUUID", "");
            $(".lblListen[CallId='" + callId + "']").attr("HttpURL", "");
            $(".lblListen[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
            $(".lblWhisper[CallId='" + callId + "']").attr("Event", "Whisper Start");
            $(".lblWhisper[CallId='" + callId + "']").attr("RequestUUID", "");
            $(".lblWhisper[CallId='" + callId + "']").attr("HttpURL", "");
            $(".lblWhisper[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
            $(".lblJoin[CallId='" + callId + "']").attr("Event", "Join Start");
            $(".lblJoin[CallId='" + callId + "']").attr("RequestUUID", "");
            $(".lblJoin[CallId='" + callId + "']").attr("HttpURL", "");
            $(".lblJoin[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
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
function setPriority(priority) {
    var priorities = "";
    if (priority == 0) {
        priorities += "<option value=0 selected='true'>Not Set</option>";
    }
    else {
        priorities += "<option value=0>Not Set</option>";
    }
    for (var i = 1; i < 11; i++) {
        if (i == parseInt(priority)) {
            priorities += "<option value='" + i + "' selected='true' >" + i + "</option>";
        } else {
            priorities += "<option value='" + i + "' >" + i + "</option>";
        }
    }
    return priorities;
}
function getAgentsAvailabilityStatuses() {

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Manager.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 41 },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.AgentAvailableStatuses.length > 0) {
                    var agentStatuses = "<option value='0'>select</option>";
                    for (var i = 0; i < res.AgentAvailableStatuses.length; i++) {
                        agentStatuses += "<option value='" + res.AgentAvailableStatuses[i].Id + "'>" + res.AgentAvailableStatuses[i].Status + "</option>";
                    }
                    $("#agentStatusFilter").html(agentStatuses);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else {
                console.log(errorThrown);
            }
        }
    });
}