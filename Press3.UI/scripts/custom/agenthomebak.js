var glbPageSize = 50, glbPageNumber = 1;
var isCtrlPressed = 0;
var agentStatus = "";
var callStartTimeInSeconds = 0;
var glbCallerSequenceNumber = 0;
var glbHttpUrl = "";
var glbConferenceName = "";
var glbCallerFsMemberId = 0;
var glbTalkingAgentRequestUUID = "";
var glbToAgentrequestUUID = "";


$(document).ready(function () {

    $("#callerNotes").addClass("tab-btn").removeClass("tab-btn-select");
    $("#agentScripts").addClass("tab-btn-select").removeClass("tab-btn");
    $("#header").html("<i class='fa fa-history margin-right-5'></i>Scripts");


    $(document).on("input", "#txtCallerMobile", function () {
        this.value = this.value.replace(/[^\d\.\-]/g, '');
    });

    $("#editCallerDetails").click(function () {
        $("#editCallerDetailsModal").modal("show");
    });

    GetAgentScriptsAndCallSummary();
    //if (agentStatus == "Ready" || agentStatus == "On Call")
    //{
    LoginVerto();
    //}

    $("#spanAgentStatus").html(agentStatus);

    $("#btnAnswerCall").click(function () {
        var result = AnswerCall();
        if (result == 1) {
            isAnswer = 1;
            $("#spanAgentStatus").html("On Call")
            $("#editCallerDetails").show();
            $("#answerModal").hide();
            $("#divSidePanel").show();
            $("#divNotesPanel").show();
            $("#divNotes").hide();
            $("#txtAcw").val("");
            $(".call_time").timer({
                format: "%H:%M:%S",
                seconds: "" + 0
            });
            $("#lblCBR").show();
            $("#txtAcw").removeClass("txt_high");
            $("#lblNotes").removeClass("margin-left-70");
            $("#divInboundCall").show();
            $("#btnSubmitAcw").attr("CallId", callId)
            $("#divTransferCall").hide();
            $("#divWarmTransferCall").hide();
            inCall = 1;
            GetAgentScriptsAndCallSummary();
            ChangeCallStatus(callId, "Talking to Agent", "Answer");

        }

    });

    $("#btnMakeCall").click(function () {
        var result = MakeCall($("#hdnToNumber").val(), "Narasimha", $("#hdnNumber").val(), true, true)
    });

    $("#lblMute").click(function () {
        var result = MuteCall();
        if (result == 1) {
            $(this).hide();
            $("#lblUnMute").show();
            ChangeCallActions(callId, 1, "Mute");
        }
    });

    $("#lblUnMute").click(function () {
        var result = UnMuteCall();
        if (result == 1) {
            $(this).hide();
            $("#lblMute").show();
            ChangeCallActions(callId, 0, "Mute");
        }
    });

    $("#lblHold").click(function () {
        var result = HoldCall();
        if (result == 1) {
            $(this).hide();
            $("#lblUnHold").show();
            ChangeCallActions(callId, 1, "Hold");
        }
    });

    $("#lblUnHold").click(function () {
        var result = UnholdCall();
        if (result == 1) {
            $(this).hide();
            $("#lblHold").show();
            ChangeCallActions(callId, 0, "Hold");
        }
    });

    $("#divtransferCall").click(function () {
        $("#divTransferCall").hide();
        GetAvailableAgents(callId, 1);
    });
    $("#divwarmTransferCall").click(function () {
        GetAvailableAgents(callId, 2);
    });
    $("#divConference").click(function () {
        GetAvailableAgents(callId, 3);
    });
    $("#btnTransferCall").click(function () {
        var destinationNumber = $("#ddlAgents").val();
        var toAgentId = $("#ddlAgents option:selected").attr("AgentId")
        TransferCall(callId, toAgentId, destinationNumber, false)
    });
    $("#btnWarmTransferCall").click(function () {
        var destinationNumber = $("#ddlManagers").val();
        var toAgentId = $("#ddlManagers option:selected").attr("AgentId")
        TransferCall(callId, toAgentId, destinationNumber, true)
    });

    $("#btnStartConference").click(function () {
        var destinationNumber = $("#ddlConferenceAgents").val();
        var toAgentId = $("#ddlConferenceAgents option:selected").attr("AgentId")
        StartConference(callId, toAgentId, destinationNumber, 1)
    });
    $("#btnAddParticipantToConference").click(function () {
        var destinationNumber = $("#ddlAddParticipantAgents").val();
        var toAgentId = $("#ddlAddParticipantAgents option:selected").attr("AgentId")
        StartConference(callId, toAgentId, destinationNumber, 1)
    });
    $("#btnEndConference").click(function () {
        EndConference(callId);
    });
    $("#btnAddParticipant").click(function () {
        GetAvailableAgents(callId, 4);
    });


    $("#divHangUpCall").click(function () {
        var result = HangUpCall();
        if (result == 1) {
            inCall = 0;
            isAnswer = 0;
        }

    });

    $("#agentScripts").click(function () {
        $(this).removeClass("tab-btn");
        $(this).addClass("tab-btn-select");
        $("#callerNotes").removeClass("tab-btn-select");
        $("#callerNotes").addClass("tab-btn");
        $("#lstAgentScripts").show();
        $("#lstCallBackRequest").hide();
        $("#header").html("");
        $("#header").html("<i class='fa fa-history margin-right-5'></i> Scripts");
    });

    $("#callerNotes").click(function () {
        $(this).removeClass("tab-btn");
        $(this).addClass("tab-btn-select");
        $("#agentScripts").removeClass("tab-btn-select");
        $("#agentScripts").addClass("tab-btn");
        $("#lstAgentScripts").hide();
        $("#lstCallBackRequest").show();
        $("#header").html("");
        $("#header").html("<i class='fa fa-history margin-right-5'></i>Note History");
    });

    $("#btnUpdateCallerdetails").click(function () {
        var table = $("#tblEditCallerDetails");
        var detailsObj = {};
        $("#lblEditErrorMsg").html("");
        var isValid = 1;
        $("#tblEditCallerDetails .required").each(function (index) {
            if ($(this).val() == "") {
                $("#lblEditErrorMsg").html($(this).attr("key") + " is Mandatory")
                isValid = 0;
                return false;
            }
        });
        if (isValid == 0) {
            return false;
        }

        var callerName = $("#txtCallerName").val();
        var callerMobile = $("#txtCallerMobile").val();
        var callerEmail = $("#txtCallerEmail").val();
        if (!isEmail(callerEmail)) {
            $("#lblEditErrorMsg").html("Please Enter Valid Email");
            return false;
        }

        table.find('.metadata').each(function (i, el) {
            var $tds = $(this).find('td');
            var Key = $tds.eq(0).attr("key");
            var value = $tds.eq(1).find('input').val();
            detailsObj[Key] = value;
        });
        var details = JSON.stringify(detailsObj);
        UpdateCallerInformation(details, callNumber, callerName, callerMobile, callerEmail);
    });

    $("#btnSubmitAcw").click(function () {
        var notes = $("#txtAcw").val();
        var submitCallId = $(this).attr("CallId");
        SubmitACW(notes, submitCallId, isTransfer);
        $(this).removeAttr("CallId");
        $("#txtAcw").val("");
        $("#tblViewCallerDetails").html("");
        $("#divCallHistory").html("");
        $("#lstCallBackRequest").html("");
        $("#lstAgentScripts").show();
        $("#editCallerDetails").attr("CallerAttributesMetadata", "");
        $("#tblEditCallerDetails").html("");
        $("#callerNotes").addClass("tab-btn").removeClass("tab-btn-select");
        $("#agentScripts").addClass("tab-btn-select").removeClass("tab-btn");
        $("#header").html("<i class='fa fa-history margin-right-5'></i>Scripts");
        $("#spanAgentStatus").html("Online");
        $("#editCallerDetails").hide();
        $("#divNotesPanel").hide();
        $(this).hide();
        inCall = 0;
        callId = 0;
        callNumber = "";

    });

    $("#lblNotes").click(function () {
        $("#divNotes").show();
    });

    $("#lblNotesClose").click(function () {
        $("#divNotes").hide();
    });

    $("#btnCompleteWarmTransfer").click(function () {
        CompleteTransfer(glbCallerSequenceNumber, glbHttpUrl, glbConferenceName, glbCallerFsMemberId, false, glbTalkingAgentRequestUUID)
    })
    $("#btnUnHoldWarmTransfer").click(function () {
        var Action = $(this).attr("Action");
        if (Action == "Hold") {
            HoldUnHolduser(glbCallerSequenceNumber, glbHttpUrl, glbConferenceName, glbCallerFsMemberId, true);
        }
        else {
            HoldUnHolduser(glbCallerSequenceNumber, glbHttpUrl, glbConferenceName, glbCallerFsMemberId, false);
        }
    })
    $("#btnCancelWarmTransfer").click(function () {
        Canceltransfer(glbCallerSequenceNumber, glbHttpUrl, glbConferenceName, glbCallerFsMemberId, false, glbToAgentrequestUUID)
    })
    $("#ConfMemb").click(function () {
        GetConferenceRoom(callId);
    });
    $(document).on("click", ".singleMuteUnmute", function () {

        var httpUrl = $(this).attr("HttpURL");
        var action = $(this).attr("Action");
        var fsMemberId = $(this).attr("FsMemberId");
        var requestUUID = $(this).attr("CallUUID");
        var sequenceNumber = $(this).attr("SequenceNumber");
        alert(sequenceNumber);
        var isMute = false;
        if (action == "Mute") {
            isMute = true
        }
        MuteUnMute(isMute, fsMemberId, httpUrl, requestUUID, sequenceNumber);
        if (action == "Mute") {
            $(this).attr("Action", "UnMute")
            $(this).removeClass("fa fa-microphone-slash fa-x font-blue-soft").addClass("fa fa-microphone fa-x font-blue-soft");
        }
        else {
            $(this).attr("Action", "Mute")
            $(this).removeClass("fa fa-microphone fa-x font-blue-soft").addClass("fa fa-microphone-slash fa-x font-blue-soft");
        }


    });
    $(document).on("click", ".singleHangUp", function () {
        var httpUrl = $(this).attr("HttpURL");
        var requestUUID = $(this).attr("CallUUID");
        HangUp(httpUrl, requestUUID);
    });


});
function MuteUnMute(isMute, fsMemberId, httpUrl, requestUUID, sequenceNumber) {

    $.ajax({
        url: "Handlers/Conference.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 8, IsMute: isMute, FsMemberId: fsMemberId, HttpUrl: httpUrl, ConferenceRoom: requestUUID, SequenceNumber: sequenceNumber
        },
        success: function (res) {
            console.log(res);
            if (res.Success == true) {
            }
            else {
                alert(res.Message);
            }
            return true;

        },
        error: function (jqXHR, textStatus, errorThrown) {
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
function HangUp(httpUrl, requestUUID) {

    $.ajax({
        url: "Handlers/Conference.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 7, TalkingAgentRequestUUID: requestUUID, HttpURL: httpUrl
        },
        success: function (res) {
            console.log(res);
            if (res.Success == true) {
                $("#" + requestUUID).remove();
            }
            else {
                alert(res.Message);
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
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
function GetConferenceRoom(callId) {
    var membersData = "";
    $.ajax({
        url: "Handlers/Conference.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 6, CallId: callId
        },
        success: function (res) {
            console.log(res);
            if (res.Success == "True") {
                if (res.ConferenceRoomDetails.length > 0) {
                    for (var i = 0; i < res.ConferenceRoomDetails.length; i++) {
                        membersData += "<div class='col-sm-6 margin-bottom-5' id = '" + res.ConferenceRoomDetails[i].RequestUUID + "'><div class='well well-grey well-sm margin-bottom-10'>"
                        membersData += "<label class='pull-left txt-lite-grey f_13 mb-0'>" + res.ConferenceRoomDetails[i].MemberType + " : ";
                        membersData += "<span class='bold-6'>" + res.ConferenceRoomDetails[i].MemberName + "</span></label>"
                        membersData += "<label class='pull-right mb-0'>";
                        if (res.ConferenceRoomDetails[i].IsInMute == "False") {
                            membersData += "<i style='cursor:pointer;' Action='Mute' SequenceNumber ='" + res.ConferenceRoomDetails[i].SequenceNumber + "' FsMemberId ='" + res.ConferenceRoomDetails[i].FsMemberId + "' CallUUID='" + res.ConferenceRoomDetails[i].RequestUUID + "' HttpUrl='" + res.ConferenceRoomDetails[i].HttpUrl + "' class='fa fa-microphone-slash fa-x font-blue-soft margin-right-10 singleMuteUnmute'></i>"
                        }
                        else {
                            membersData += "<i style='cursor:pointer;' Action='UnMute' SequenceNumber ='" + res.ConferenceRoomDetails[i].SequenceNumber + "' FsMemberId='" + res.ConferenceRoomDetails[i].FsMemberId + "' CallUUID='" + res.ConferenceRoomDetails[i].RequestUUID + "' HttpUrl='" + res.ConferenceRoomDetails[i].HttpUrl + "' class='fa fa-microphone fa-x font-blue-soft margin-right-10 singleMuteUnmute' ></i>"
                        }

                        membersData += "<i style='cursor:pointer;' HttpUrl='" + res.ConferenceRoomDetails[i].HttpUrl + "' CallUUID='" + res.ConferenceRoomDetails[i].RequestUUID + "' class='fa fa-phone font-red fa-x singleHangUp' title='Hangup Call'></i></label>"
                        membersData += "<div class='clearfix'></div></div></div>"

                    }
                    $("#divConferenceMembersData").html(membersData);
                    $("#ConferenceList").modal("show");

                }

            }
            else {
                alert(res.Message);
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function StartConference(callId, toAgentId, toNumber, mode) {

    $.ajax({
        url: "Handlers/Conference.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 4, CallId: callId, ToAgentId: toAgentId, ToNumber: toNumber, Mode: mode
        },
        success: function (res) {
            console.log(res);
            if (res.Success == "True") {
                console.log(res);
                $("#divConferenceCall").show();
                $("#divConferenceCallAction").hide();
                $("#divConferenceCallActions").show();
                $("#divAddParticipant").hide();
                $("#lblAddConference").hide();
                $("#lblAddParticipant").hide();
                $("#divConferenceInProgress").show();
                isConference = 1;
                $(".conference_call_time").timer({
                    format: "%H:%M:%S",
                    seconds: "" + 0
                });
                //$("#spanAgentStatus").html("ACW");
                //isTransfer = true;
                //$("#divWarmTransferCallAction").hide();
                //$("#divWarmTransferCallActions").show();
                //if (res.GatewayInfo.length > 0) {
                //    glbCallerSequenceNumber = res.GatewayInfo[0].CallerSequenceNumber;
                //    glbHttpUrl = res.GatewayInfo[0].HttpUrl;
                //    glbConferenceName = res.GatewayInfo[0].ConferenceRoom;
                //    glbCallerFsMemberId = res.GatewayInfo[0].CallerFsMemberId;
                //    glbTalkingAgentRequestUUID = res.GatewayInfo[0].TalkingAgentRequestUUID;
                //    glbToAgentrequestUUID = res.ToAgentRequestUUID;
                //}
            }
            else {
                alert(res.Message);
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function EndConference(conferenceCallId) {

    $.ajax({
        url: "Handlers/Conference.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 5, CallId: conferenceCallId
        },
        success: function (res) {
            console.log(res);
            if (res.Success == "True") {
                $(".conference_call_time").timer("remove");
                $("#divConferenceCall").hide();
                $("#divConferenceInProgress").hide();
                isConference = 0;

            }
            else {
                alert(res.Message);
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function Canceltransfer(conferenceSequenceNumber, httpUrl, conferenceName, callerFsMemberId, isPrivate, toAgentrequestUUID) {
    $.ajax({
        url: "Handlers/Conference.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 3, CallerSequenceNumber: conferenceSequenceNumber, HttpURL: httpUrl, ConferenceName: conferenceName,
            CallerFsMemberId: callerFsMemberId, IsPrivate: isPrivate, TalkingAgentRequestUUID: toAgentrequestUUID
        },
        success: function (res) {
            if (res.Success == "True") {
                $("#divWarmTransferCall").hide();
            }
            else {
                alert(res.Message);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function HoldUnHolduser(conferenceSequenceNumber, httpUrl, conferenceName, callerFsMemberId, isPrivate) {
    $.ajax({
        url: "Handlers/Conference.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, CallerSequenceNumber: conferenceSequenceNumber, HttpURL: httpUrl, ConferenceName: conferenceName,
            CallerFsMemberId: callerFsMemberId, IsPrivate: isPrivate
        },
        success: function (res) {
            if (res.Success == true) {
                alert(res.Message);
                if (!isPrivate) {
                    $("#btnUnHoldWarmTransfer").html("Hold User");
                    $("#btnUnHoldWarmTransfer").attr("Action", "Hold")
                }
                else {
                    $("#btnUnHoldWarmTransfer").html("UnHold User");
                    $("#btnUnHoldWarmTransfer").attr("Action", "UnHold")
                }

            }
            else {
                alert(res.Message);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function CompleteTransfer(conferenceSequenceNumber, httpUrl, conferenceName, callerFsMemberId, isPrivate, talkingAgentRequestUUID) {
    $.ajax({
        url: "Handlers/Conference.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 1, CallerSequenceNumber: conferenceSequenceNumber, HttpURL: httpUrl, ConferenceName: conferenceName,
            CallerFsMemberId: callerFsMemberId, IsPrivate: isPrivate, TalkingAgentRequestUUID: talkingAgentRequestUUID
        },
        success: function (res) {
            if (res.Success == "True") {
                $("#divWarmTransferCall").hide();
            }
            else {
                alert(res.Message);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function SubmitACW(notes, callId, isTransfer) {

    $.ajax({
        url: "Handlers/Calls.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 3, Notes: notes, CallId: callId, IsTransfer: isTransfer
        },
        success: function (res) {

            if (res.Success == "True") {
            }
            else {

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function UpdateCallerInformation(callerDetails, fromNumber, callerName, callerMobile, callerEmail) {
    $.ajax({
        url: "Handlers/Caller.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, DetailsObj: callerDetails, Mode: 2, FromNumber: fromNumber, CallerName: callerName, CallerMobile: callerMobile, CallerEmail: callerEmail
        },
        success: function (res) {

            if (res.Success == "True") {
                GetCallerInformation(fromNumber);
            }
            else {

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function GetAgentScriptsAndCallSummary() {

    var agentScripts = "";
    $.ajax({
        url: "Handlers/Agents.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2
        },
        success: function (res) {

            if (res.Success == "True") {
                if (res.CallSummary.length > 0) {
                    $("#waitingCalls").html(res.CallSummary[0].WaitingInQueue);
                    $("#avgCallDuration").html(res.CallSummary[0].AvgCallDuration);
                    $("#avgWaitTime").html(res.CallSummary[0].AvgWaitTime);
                    $("#spnInboundCallDate").html(res.CallSummary[0].AnswerTime);
                    agentStatus = res.CallSummary[0].AgentStatus;
                }
                if (res.AgentScripts.length > 0) {
                    for (var i = 0; i < res.AgentScripts.length ; i++) {
                        agentScripts += "<li><label>Topic - <span class='bold'> ";
                        agentScripts += res.AgentScripts[i].Title + " </span></label>";
                        agentScripts += "<pre>" + res.AgentScripts[i].Script + "</pre></li>"
                    }
                }

            }
            else {

            }

            $("#lstAgentScripts").html(agentScripts);

        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function GetCallHistory(fromNumber, pageSize, pageNumber, callId) {
    var callHistoryContent = "", callBackrequestContent = "";
    $.ajax({
        url: "Handlers/Caller.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 1, FromNumber: fromNumber, CallId: callId, PageSize: pageSize, PageNumber: pageNumber
        },
        success: function (res) {
            if (res.Success == "True") {
                for (var i = 0; i < res.CallHistory.length ; i++) {
                    callHistoryContent += "<div class='timeline-item'><div class='timeline-badge'><div class='timeline-icon'>";
                    callHistoryContent += "<i class='fa fa-phone'></i></div></div><div class='timeline-body'>"
                    callHistoryContent += "<div class='timeline-body-arrow'></div><div class='timeline-body-content'>";
                    callHistoryContent += "<div id='' class='call_history'><h5>" + res.CallHistory[i].CallTime + "</h5><label>";
                    callHistoryContent += res.CallHistory[i].Direction + " call with agent: <span class='bold'> "
                    callHistoryContent += res.CallHistory[i].AgentName + "</span></label>";
                    if (res.CallHistory[i].Notes.length > 50) {
                        callHistoryContent += "<p><b>Notes: </b> " + res.CallHistory[i].Notes.substring(0, 45) + "... </p>";
                    }
                    else {
                        callHistoryContent += "<p><b>Notes: </b> " + res.CallHistory[i].Notes + "</p>";
                    }

                    callHistoryContent += "</div></div></div></div>";

                    callBackrequestContent += "<li id='" + res.CallHistory[i].RowNumber + "'><label>Call back request - <span class='bold'> ";
                    callBackrequestContent += res.CallHistory[i].CallTime + " by " + res.CallHistory[i].AgentName + " </span></label>";
                    callBackrequestContent += "<p>" + res.CallHistory[i].Notes + "</p></li>"

                }
                $("#divCallHistory").html(callHistoryContent);
                $("#lstCallBackRequest").html(callBackrequestContent);
            }
            else {
                alert(res.Message);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function LoginVerto() {
    var loginNumber = "", Password = "", ip = "", port = "", url = ""
    $.ajax({
        url: "Handlers/Agents.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 1
        },
        success: function (res) {
            if (res.Success == "True") {
                loginNumber = res.GatewayDetails[0].UserName;
                password = res.GatewayDetails[0].Password;
                ip = res.GatewayDetails[0].Ip;
                port = res.GatewayDetails[0].Port;
                url = "wss://" + ip + ":8082";
                Initlogin(loginNumber, password, url, ip);
            }
            else {
                alert(res.Message);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function ChangeVertoRegistrationStatus(status) {
    $.ajax({
        url: "Handlers/Agents.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 3, Status: status
        },
        success: function (res) {
            if (res.Success == "True") {

            }
            else {

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function GetCallerInformation(fromNumber) {
    var callerDetailsData = "", editCallerDetailsData = "", priority = 0;
    $.ajax({
        url: "Handlers/Caller.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, FromNumber: fromNumber, DetailsObj: "", Mode: 1, CallerName: "", CallerMobile: "", CallerEmail: ""
        },
        success: function (res) {
            if (res.Success == "True") {
                priority = 1;

                callerDetailsData += "<table class='table no-border caller-det'>"
                editCallerDetailsData += "<table id='tblEditCallerDetails' class='table no-border caller-det'>"
                editCallerDetailsData += "<tr><td colspan='2'  style='text-align:center;'><label  color='red' id='lblEditErrorMsg'></label></td></tr>"

                callerDetailsData += "<tr><td class='col-sm-5'> Name* </td><td class='col-sm-5'>" + res.CallerDetails[0].Name + " </td></tr>"
                editCallerDetailsData += "<tr><td class='col-sm-5'> Name* </td><td class='col-sm-5'><input key='Name' id='txtCallerName' class='required' value = " + res.CallerDetails[0].Name + " /> </td></tr>"
                if (res.CallerDetails[0].Mobile == "") {
                    callerDetailsData += "<tr><td class='col-sm-5'> Mobile* </td><td class='col-sm-5'>" + callNumber + " </td></tr>"
                    editCallerDetailsData += "<tr><td class='col-sm-5'> Mobile* </td><td class='col-sm-5'><input key='Mobile' id='txtCallerMobile' class='required' value = " + res.CallerDetails[0].Mobile + " /> </td></tr>"
                }
                else {
                    callerDetailsData += "<tr><td class='col-sm-5'> Mobile* </td><td class='col-sm-5'>" + res.CallerDetails[0].Mobile + " </td></tr>"
                    editCallerDetailsData += "<tr><td class='col-sm-5'> Mobile* </td><td class='col-sm-5'><input key='Mobile' id='txtCallerMobile' class='required' value = " + res.CallerDetails[0].Mobile + " /> </td></tr>"
                }

                callerDetailsData += "<tr><td class='col-sm-5'> Email* </td><td class='col-sm-5'>" + res.CallerDetails[0].Email + " </td></tr>"
                editCallerDetailsData += "<tr><td class='col-sm-5'> Email* </td><td class='col-sm-5'><input key='Email' id='txtCallerEmail' class='required' value = " + res.CallerDetails[0].Email + " /> </td></tr>"

                var MetaData = res.CallerDetails[0].MetaData;
                if (MetaData == "") {
                    var obj1 = jQuery.parseJSON(res.CallerDetails[0].CallerAttributesMetadata);
                    for (var el in obj1) {
                        var da = obj1[el];
                        var keys = Object.keys(da);
                        for (var i in keys) {
                            var key1 = keys[i]
                            if (key1 == "FieldName") {
                                callerDetailsData += "<tr><td  class='col-sm-5'>" + da[key1] + "</td>"
                                editCallerDetailsData += "<tr class='metadata'><td key='" + da[key1] + "' class='col-sm-5'>" + da[key1] + "</td>"
                                if (da[key1] == "Mobile") {
                                    callerDetailsData += "<td><label id='lbl" + da[key1] + "'> " + callNumber + "</label></td></tr>"
                                    editCallerDetailsData += "<td><input key='" + da[key1] + "' type='text' id='txt" + da[key1] + "' value='" + callNumber + "'/></td></tr>"
                                }
                                else {
                                    callerDetailsData += "<td><label id='lbl" + da[key1] + "'></label></td></tr>"
                                    editCallerDetailsData += "<td><input key='" + da[key1] + "' type='text' id='txt" + da[key1] + "'/></td></tr>"
                                }


                            }


                        }

                    }
                }
                else {

                    var obj = jQuery.parseJSON(res.CallerDetails[0].MetaData);
                    var obj1 = jQuery.parseJSON(res.CallerDetails[0].CallerAttributesMetadata);


                    for (var el in obj1) {
                        var da = obj1[el];
                        var keys = Object.keys(da);
                        for (var i in keys) {
                            var key1 = keys[i]
                            if (key1 == "FieldName") {
                                callerDetailsData += "<tr ><td  class='col-sm-5'>" + da[key1] + "</td>"
                                editCallerDetailsData += "<tr class='metadata'><td key='" + da[key1] + "' class='col-sm-5'>" + da[key1] + "</td>"
                                $.each(obj, function (key, value) {
                                    if (key == da[key1]) {
                                        callerDetailsData += "<td><label id='lbl" + da[key1] + "'>" + value + "</label></td></tr>"
                                        editCallerDetailsData += "<td><input key='" + da[key1] + "' type='text' value='" + value + "' id='txt" + da[key1] + "'/></td></tr>"
                                    }

                                });
                            }


                        }

                    }
                }

                //}

                editCallerDetailsData += "</table>";
                callerDetailsData += "</table>"
                $("#tblViewCallerDetails").html(callerDetailsData);
                $("#editCallerDetails").attr("CallerAttributesMetadata", res.CallerDetails[0].CallerAttributesMetadata);
                $("#tblEditCallerDetails").html(editCallerDetailsData);
            }
            else {
                alert(res.Message);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function ChangeCallStatus(callId, status, action) {
    $.ajax({
        url: "Handlers/Calls.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 1, Status: status, CallId: callId, Action: action
        },
        success: function (res) {
            if (res.Success == "True") {
                callStartTimeInSeconds = res.CallTimeInSeconds;
            }
            else {
                alert(res.Message);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function ChangeCallActions(callId, status, action) {
    $.ajax({
        url: "Handlers/Calls.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, Status: status, CallId: callId, Action: action
        },
        success: function (res) {
            if (res.Success == "True") {

            }
            else {
                alert(res.Message);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function GetAvailableAgents(callId, agentType) {
    var agentsData = "";
    $.ajax({
        url: "Handlers/Agents.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 5, CallId: callId
        },
        success: function (res) {
            if (res.Success == "True") {
                if (res.Agents.length > 0) {
                    for (var i = 0 ; i < res.Agents.length; i++) {
                        agentsData += "<option AgentId=" + res.Agents[i].Id + " value='" + res.Agents[i].UserName + "'> " + res.Agents[i].NAME + " </option>"
                    }
                    if (agentType == 1) {
                        $("#ddlAgents").html(agentsData);
                        $("#divTransferCall").show();
                        $("#divWarmTransferCall").hide();
                        $("#divWarmTransferCallAction").hide();
                        $("#divWarmTransferCallActions").hide();
                        $("#divConferenceCall").hide();
                        $("#divAddParticipant").hide();
                    }
                    else if (agentType == 2) {
                        $("#divTransferCall").hide();
                        $("#divWarmTransferCall").show();
                        $("#divWarmTransferCallAction").show();
                        $("#divWarmTransferCallActions").hide();
                        $("#divConferenceCall").hide();
                        $("#divAddParticipant").hide();
                        $("#ddlManagers").html(agentsData);
                    }
                    else if (agentType == 3) {
                        $("#divTransferCall").hide();
                        $("#divWarmTransferCall").hide();
                        $("#divWarmTransferCallAction").hide();
                        $("#divWarmTransferCallActions").hide();
                        $("#divConferenceCall").show();
                        $("#divAddParticipant").hide();

                        $("#ddlConferenceAgents").html(agentsData);
                        if (isConference == 1) {
                            $("#lblAddConference").hide();
                            $("#divConferenceCallAction").hide();
                            $("#divConferenceCallActions").show();
                        }
                        else {
                            $("#lblAddConference").show();
                            $("#divConferenceCallAction").show();
                            $("#divConferenceCallActions").hide();
                        }

                    }
                    else {
                        $("#divTransferCall").hide();
                        $("#divWarmTransferCall").hide();
                        $("#divWarmTransferCallAction").hide();
                        $("#divWarmTransferCallActions").hide();
                        $("#divConferenceCall").hide();
                        $("#divAddParticipant").show();
                        $("#lblAddParticipant").show();
                        $("#ddlAddParticipantAgents").html(agentsData);
                    }
                    $("#divNoTransferCall").hide();
                }
                else {
                    if (agentType == 1) {
                        $("#divTransferCall").hide();
                        $("#divWarmTransferCall").hide();
                        $("#divAddParticipant").hide();
                        $("#divConferenceCall").hide();
                        $("#divConferenceCallActions").hide();
                    }
                    else if (agentType == 2) {
                        $("#divTransferCall").hide();
                        $("#divWarmTransferCall").hide();
                        $("#divAddParticipant").hide();
                        $("#divConferenceCall").hide();
                        $("#divConferenceCallActions").hide();
                    }
                    else if (agentType == 3) {
                        if (isConference == 1) {
                            $("#divConferenceCall").show();
                            $("#lblAddConference").hide();
                            $("#divConferenceCallAction").hide();
                            $("#divConferenceCallActions").show();
                        }
                        else {
                            $("#divConferenceCall").hide();
                        }

                    }
                    else {
                        //if (isConference == 1) {
                        //    $("#divAddParticipant").show();
                        //    $("#lblAddParticipant").hide();

                        //}
                        //else {
                        //    $("#divAddParticipant").hide();
                        //}

                    }
                    $("#divNoTransferCall").show();
                }
            }
            else {
                alert(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function TransferCall(callId, toAgentId, toNumber, isWarmTransfer) {
    glbCallerSequenceNumber = 0;
    glbHttpUrl = "";
    glbConferenceName = "";
    glbCallerFsMemberId = 0;
    glbTalkingAgentRequestUUID = "";
    glbToAgentrequestUUID = "";
    $.ajax({
        url: "Handlers/Calls.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 4, CallId: callId, ToAgentId: toAgentId, ToNumber: toNumber, IsWarmTransfer: isWarmTransfer
        },
        success: function (res) {
            if (res.Success == "True") {
                console.log(res);
                $("#spanAgentStatus").html("ACW");
                isTransfer = true;
                $("#divWarmTransferCallAction").hide();
                $("#divWarmTransferCallActions").show();
                if (res.GatewayInfo.length > 0) {
                    glbCallerSequenceNumber = res.GatewayInfo[0].CallerSequenceNumber;
                    glbHttpUrl = res.GatewayInfo[0].HttpUrl;
                    glbConferenceName = res.GatewayInfo[0].ConferenceRoom;
                    glbCallerFsMemberId = res.GatewayInfo[0].CallerFsMemberId;
                    glbTalkingAgentRequestUUID = res.GatewayInfo[0].TalkingAgentRequestUUID;
                    glbToAgentrequestUUID = res.ToAgentRequestUUID;
                }

            }
            else {
                alert(res.Message);
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}



//function disableF5(e) {

//    if((e.which || e.keyCode) == 17){
//        isCtrlPressed = 1
//    }


//    if ((e.which || e.keyCode) == 116 || (isCtrlPressed == 1 && (e.which || e.keyCode == 82))) {
//        if (inCall == 1) {
//            e.preventDefault();
//        }
//    }

//};
