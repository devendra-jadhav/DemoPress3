var currentCall = null;
var verto;
var ringing = false;
var autocall = false;
var glbLoginNumber;
var glbSocketUrl;
var glbLoginPassword;
var glbHostName;
var inCall = 0;
var callId = 0;
var callType = "";
var callNumber = "";
var isAnswer = 0;
var isConference = false;
var isTransfer = false;
var glbIsWarmTransfer = false;
var metaData = {};
var conferenceRoom = "";
var vertoConf, liveArray;
var agentRequestUUID = "", callerRequestUUID = "";
var glbHttpurl = "";
var callerMemberId = 0;
var agentFsMemberId = 0;
var glbCallType = "";
var vertoHandle, vertoCallbacks;
var testflag = 0;
var currentAgentStatus = $("#spanAgentStatus").text();

var callBacks = {
    onDialogState: function (d) {
        currentCall = d;
        if (d.state == $.verto.enum.state.ringing) {
            ringing = true;
        } else {
            ringing = false;
        }
        switch (d.state) {
            case $.verto.enum.state.ringing:
                callId = 0;
                isAnswer = 0;
                callId = d.params.caller_id_name;
                callNumber = d.params.caller_id_number;
                metaData = jQuery.parseJSON(d.params.callee_id_name);
                conferenceRoom = metaData.ConferenceRoom;
                callType = metaData.CallType;
                console.log("------Ringing------");
                console.log(d);
                console.log("-------------------");
                ringingActions();
                break;
            case $.verto.enum.state.trying:
                alert("trying");
                //-------------------------outbound call---------------------
                // callerId = 32;
                // callId = 0;
                // isAnswer = 0;
                // callId = 1; //d.params.caller_id_name;
                // callNumber = "9703449988"; //d.params.caller_id_number;
                //// metaData = jQuery.parseJSON(d.params.callee_id_name);
                // conferenceRoom = "123ABC"; //metaData.ConferenceRoom;
                // callType = 5; //metaData.CallType;
                // console.log("------Trying------");
                // console.log(d);
                // console.log("-------------------");
                // ringingActions();
                //-------------------------outbound call---------------------
                break;
            case $.verto.enum.state.early:
                alert("early");
            case $.verto.enum.state.active:
                break;
            case $.verto.enum.state.hangup:
                console.log("------Hangup------");
                console.log(d);
                console.log("-------------------");
                hangupActions();
            case $.verto.enum.state.destroy:
                currentCall = null;
                break;
            case $.verto.enum.state.held:
                break;
            case $.verto.enum.state.recovering:
                $("#pageContent").addClass("col-md-9");
                if ($("#side-panel").attr("class").indexOf("page-content") == -1) {
                    $("#side-panel").addClass("page-content");
                }
                $(".status_agent").remove();
                $("#divider-status").remove();
                $(".ulAgentStatuses").hide();
                console.log("------Recovering------");
                console.log(d);
                console.log("-------------------");
                isAnswer = 1;
                var callParams = d.params.caller_id_name;
                var callParamsParse = JSON.parse(callParams);

                for (var key in callParamsParse) {
                    if (key == "ConferenceRoom") {
                        var callUUId = callParamsParse[key];
                    }
                }
                // callId = d.params.caller_id_name;
                // callNumber = d.params.caller_id_number;
                callStartTimeInSeconds = 0
                getCallIdFromCallUUId(callUUId);
                ChangeCallStatus(callId, "Talking to Agent", "Recover", isOutbound);

                GetAgentScriptsAndCallSummary();
                GetCallerInformation(callNumber);

                GetCallerTicketHistory();
                GetCallHistory(callNumber, glbPageSize, glbPageNumber, callId);
                $("#callerTokens").show();

                $("#spanAgentStatus").html("On Call")
                $("#editCallerDetails").show();
                $("#divSidePanel").show();
                $(".call_time").timer({
                    format: "%H:%M:%S",
                    seconds: "" + callStartTimeInSeconds
                });
                $("#divInboundCall").show();
                inCall = 1;
                isTransfer = false;
                isRaiseTicket = false;
                GetTicketCategries(5, 0, "");
                $("#offlineTicketsDiv").hide();
                break;
            default:
                break;
        }
    },
    onWSLogin: function (v, success) {
        currentCall = null;
        ChangeVertoRegistrationStatus(1)
        randomUUID = createUUID();
        if (communicationTypeId == "1" && customerId != "") {
            $.ajax({
                type: "GET",
                url: "Handlers/Calls.ashx",
                dataType: "JSON",
                async: false,
                data: { type: 13, customerId: customerId, callUUID: randomUUID },
                success: function (res) {
                    if (res.Success.toString().toLowerCase() == "true") {
                        agentCallUUID = randomUUID;
                        isOutbound = 1;
                        $("#callFrom").html("Incoming Call");
                        $("#pageContent").addClass("col-md-9");
                        if ($("#side-panel").attr("class").indexOf("page-content") == -1) {
                            $("#side-panel").addClass("page-content");
                        }
                        isTransfer = false;
                        isRaiseTicket = false;
                        callId = hdnCallId;
                        callerId = customerId;
                        callNumber = customerMobile;
                        callId = res.CallId;
                        $("#spanAgentStatus").html("On Call");
                        $("#btnAnswerCall").show();
                        $("#answerModal").show();
                        inCall = 1;
                    } else {

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
    },
    onWSClose: function (v, success) {
        //ChangeVertoRegistrationStatus(0)
    }
};

function SubscribeWebScocket(channelName) {
    console.log(channelName);
    var domain = location.host
    var host = (location.protocol === 'https:') ? 'wss://' : 'ws://';
    var page = '/ConferenceWebSocket.sub?Channel_Name=';
    var ws;
    var hostTotal = host + domain + page + channelName;
    ws = new WebSocket(hostTotal);
    ws.onopen = function (evt) {
        console.log("WebSocket Connection Open ");
        ChangeVertoRegistrationStatus(1);
    };
    ws.onmessage = function (evt) {
        console.log("Message " + evt.data);
        currentAgentStatus = $("#spanAgentStatus").text();

        if (typeof (evt.data) != "undefined" || evt.data != "") {
            var data = JSON.parse(evt.data);

            if (data.Event == "enter") {
                //if (data.CallType == "1") {
                //    testflag = 1;
                //    }
                conferenceRoom = data.ConferenceRoom;
                var domain = location.host
                var host = (location.protocol === 'https:') ? 'wss://' : 'ws://';
                var page = '/ConferenceWebSocket.sub?Channel_Name=';
                var wsConference;
                var hostTotal = host + domain + page + conferenceRoom + "_" + callId;
                console.log(hostTotal);
                wsConference = new WebSocket(hostTotal);
                wsConference.onopen = function (evt) {
                    console.log("WebSocket Connection Open for Channel_Name: " + conferenceRoom + "_" + callId);
                };
                wsConference.onmessage = function (evt) {
                    var websocketResult = "";
                    console.log(evt);
                    console.log(evt.data);
                    if (evt != "") {
                        websocketResult = jQuery.parseJSON(evt.data);
                        if (websocketResult.CallType == "3") {
                            $("#divSidePanelWithOutActions").hide();
                            $("#callFrom").html("Incoming call from");
                            $("#editCallerDetails").show();
                            $("#divSidePanel").show();
                            $("#divInboundCall").show();
                            callType = "2";
                        }
                    }
                };
                // }
                if (data.IsOutbound == "1") {
                    GetCallerInformation(customerMobile);
                }
            }

            if (data.Event == "enter" && data.IsAgent == false) {

                isAnswer = 0;
                callId = 0;
                isTransfer = false;
                isRaiseTicket = false;
                callId = data.CallId;
                callNumber = data.FromNumber;
                callType = data.CallType;
                GetCallerInformation(callNumber);
                conferenceRoom = data.ConferenceRoom;
                ringingActions();
                // if (glbCallType == "External"){$("#btnAnswerCall").hide();}
                $("#btnAnswerCall").hide();
            }
            else if (data.Event == "enter") {
                if (communicationTypeId == "1") { glbCallType == "Verto" }
                else { glbCallType = "External"; }
                $("#afterCallWork").hide();
                isTransfer = false;
                isRaiseTicket = false;
                callId = data.CallId;
                callNumber = data.FromNumber;
                callType = data.CallType;
                if (data.IsAgent == true) {
                    agentRequestUUID = data.RequestUUID;
                }
                else {
                    callerRequestUUID = data.RequestUUID;
                }
                inCall = 1;
                isAnswer = 1;
                $("#answerModal").hide();
                $("#spanAgentStatus").html("On Call");
                if (callType == "3" || callType == "4") {
                    //if (data.IsAgent == true) {
                    //    $("#divSidePanel").show();
                    //}
                    // else { 
                    $("#divSidePanelWithOutActions").show();
                    // }
                }
                else {
                    console.log("callId" + callId);
                    $("#editCallerDetails").show();
                    $("#divSidePanel").show();
                    $("#divInboundCall").show();
                    ChangeCallStatus(callId, "Talking to Agent", "Answer", isOutbound);
                }
                $(".call_time").timer({
                    format: "%H:%M:%S",
                    seconds: "" + 0
                });
                $(".actionsData").hide();
                inCall = 1;

            } else if (data.Event == "conference" && data.IsAgent == false) {
                $("#answerModal").hide();
                $("#divSidePanelWithOutActions").show();
                $("#spanAgentStatus").html("On Call");
            }
            else if (data.Event == "AgentQueue") {
                var calls = data.waitcalls;
                if (calls > 0) {
                    $("#waitingCalls").val(calls);
                }
            }
            else if (data.Event == "exit" && currentAgentStatus != "In Break") {
                //alert(callType);

                if (callType == 0)
                    callType = data.CallType;
                if (isOutbound != 1) { hangupActions(); }
                else if (isOutbound == 1 && communicationTypeId != "1") {
                    hangupActions();
                }
            } else if (data.Event == "CustomerOutBound") {
                makeOutboundCallToCustomer();
            }
            else if (data.Event == "CBR") {
                //data.CbrId
                getAssignedCbr(data.CBRId);
            }
        }

    };
    ws.onerror = function (evt) {
        console.log("WebSocket Connection Failed" + evt.message);
    };
    ws.onclose = function () {
        console.log("WebSocket Connection Closed");
    };
}
function Initlogin(login, passwd, socketUrl, hostName) {
    glbLoginNumber = login;
    glbLoginPassword = passwd;
    glbSocketUrl = socketUrl;
    glbHostName = hostName;
    verto = new $.verto({
        login: login + "@" + hostName,
        passwd: passwd,
        socketUrl: socketUrl,
        tag: "webcam",
        ringFile: "sounds/bell_ring2.wav",
        //videoParams: {
        //    "minWidth": "1280",
        //    "minHeight": "720",
        //    "minFrameRate": 30
        //},
        iceServers: [{
            url: 'stun:stun.1.google.com:19302'
        }],
        audioParams: {
            googAutoGainControl: false,
            googNoiseSuppression: false,
            googHighpassFilter: false

        },

    }, callBacks);

    //-------------------------oubound call---------------------
    //makeOutboundCall();
    //MakeCall("9703449988", "Sneha", "9703449988", 1, 1);
    //-------------------------oubound call---------------------
}

function MakeCall(toNumber, callerIdName, callerIdNumber, useStereo, useMic) {
    if (currentCall) {
        return 0;
    }
    currentCall = verto.newCall({
        destination_number: toNumber,
        caller_id_name: callerIdName,
        caller_id_number: callerIdNumber,
        useStereo: useStereo,
        useMic: useMic,
        useSpeak: true,
        dedEnc: false

    });
    return 1;
}

function AnswerCall() {
    if (currentCall == null) {
        return 0;
    }
    currentCall.answer();
    return 1;
}

function HangUpCall() {
    if (currentCall == null) {
        return 0;
    }
    currentCall.hangup();
    currentCall = null;
    return 1;
}

function MuteCall() {
    if (currentCall == null) {
        return 0;
    }
    currentCall.setMute("off");
    return 1;
};

function UnMuteCall() {
    if (currentCall == null) {
        return 0;
    }
    currentCall.setMute("on");
    return 1;
};

//function TransferCall(transferNumber) {

//    if (currentCall == null) {
//        return 0;
//    }
//    if (!transferNumber) {
//        return 0;
//    }
//    currentCall.transfer(transferNumber);
//    return 1;
//}

function HoldCall() {
    if (currentCall == null) {
        return 0;
    }
    currentCall.hold();
    return 1;
};

function UnholdCall() {
    if (currentCall == null) {
        return 0;
    }
    currentCall.unhold();
    return 1
};

function hangupActions() {
    // $("#pageContent").removeClass("col-md-9");

    $("#afterCallWork").show();
    if (callType == "3" || callType == "4") {
        $("#divSidePanelWithOutActions").hide()
        $("#pageContent").removeClass("col-md-9");
        $("#spanAgentStatus").html("Ready");
        callStatus = 'Ready'
        getAgentStatuses(null);
        //$(".ulAgentStatuses").show();
    }
    else {


        if (isAnswer == "0") {

            $("#callerTokens").hide();
            $("#divSidePanel").hide();
            $("#spn-ivr-details").hide();
            $("#pageContent").removeClass("col-md-9");
            $("#side-panel").removeClass("page-content");
            $("#tblViewCallerDetails").hide();
            $("#offlineTicketsDiv").show();
            $("#btnOfflineTicket").show();

        }

        $(".divHangUpCall").hide();
        $(".divSubmitAcwNew").show();


        if (isAnswer == 1) {
            $("#divtransferCall").hide();
            $("#divwarmTransferCall").hide();
            $("#divConference").hide();
            $("#divCallbackRequest").hide();

            $("#divAgents").hide();
            $("#divTransferCall").hide();
            $("#divWarmTransferCall").hide();
            $("#divConferenceCall").hide();
            $("#lblMute").hide();
            $("#lblHold").hide();
            $("#lblUnHold").hide();
            $("#lblUnMute").hide();
        }


        //$("#divtransferCall").css("pointer-events", "none");
        //$("#divwarmTransferCall").css("pointer-events", "none");
        //$("#divConference").css("pointer-events", "none");
        //$("#divCallbackRequest").css("pointer-events", "none");

        //$("#divAgents").css("pointer-events", "none");
        //$("#divTransferCall").css("pointer-events", "none");
        //$("#divWarmTransferCall").css("pointer-events", "none");
        //$("#divConferenceCall").css("pointer-events", "none");


        $("#lbl-call-type").text("Call Disconnected");


        if (isAnswer == 1) {
            callStatus = 'ACW'
            $("#spanAgentStatus").html("ACW");
        }
        else {
            callStatus = 'Ready'
            $("#divSidePanel").hide();
            $("#spanAgentStatus").html("Ready");
            getAgentStatuses(null);
            //$(".ulAgentStatuses").show();
        }
        if (isOutbound == 1 && isAnswer == 1) {
            callStatus = 'ACW'
            $("#spanAgentStatus").html("ACW");
        } else if (isOutbound == 1 && isAnswer == 0) {
            callStatus = 'Ready'
            $("#divSidePanel").hide();
            $("#spanAgentStatus").html("Ready");
            getAgentStatuses(null);
        }
    }
    ChangeCallStatus(callId, callStatus, "HangUp", isOutbound);
    $(".call_time").timer("remove");
    $("#answerModal").hide();

    var callStatus = "";
    $(".conference_call_time").timer("remove");
    $("#divConferenceInProgress").hide();
    $("#ConferenceList").modal("hide");
    $(".callActions").attr("IsStop", "False");
    isCall = 0;
    callType = "";
    isConference = false;
    glbIsWarmTransfer = false;
    isTransfer = false;
    conferenceRoom = "";
    if (isOutbound == 1 && isAnswer == 0) {
        window.location.href = "/Agenthome.aspx"
    }
}
function ringingActions() {
    $("#callerTokens").show();
    $("#pageContent").addClass("col-md-9");
    if ($("#side-panel").attr("class").indexOf("page-content") == -1) {
        $("#side-panel").addClass("page-content");
    }
    $(".divHangUpCall").show();
    $(".divSubmitAcwNew").hide();
    $("#spn-ivr-details").show();
    $("#tblViewCallerDetails").show();
    $("#lbl-call-type").text("Inbound call in progress");
    $("#ElementName").css("pointer-events", "auto");
    $("#divtransferCall").css("pointer-events", "auto");
    $("#divwarmTransferCall").css("pointer-events", "auto");
    $("#divConference").css("pointer-events", "auto");
    $("#divCallbackRequest").css("pointer-events", "auto");

    $("#divAgents").css("pointer-events", "auto");
    $("#divTransferCall").css("pointer-events", "auto");
    $("#divWarmTransferCall").css("pointer-events", "auto");
    $("#divConferenceCall").css("pointer-events", "auto");
    $("#lblMute").show();
    $("#lblHold").show();



    isTransfer = false;
    isRaiseTicket = false;
    getIvrStudioSelectionDetails(callId);

    if (callType == "3" || callType == "4") {

        $("#callFrom").html("Conference call from");
        $(".status_agent").remove();
        $("#divider-status").remove();
        $(".ulAgentStatuses").hide();
    }
        //-------------------------outbound call---------------------
        //else if (callType == "5") {
        //    $("#callFrom").html("Outgoing call to");
        //}
        //-------------------------outbound call---------------------
    else {
        $("#callFrom").html("Incoming call from");
        $(".status_agent").remove();
        $("#divider-status").remove();
        $(".ulAgentStatuses").hide();
    }
    $("#modalHeader").html(callNumber);
    GetCallerInformation(callNumber);
    if (callerId != "0") {
        GetCallerTicketHistory();
        GetCallHistory(callNumber, glbPageSize, glbPageNumber, callId);
    }
    GetTicketCategries(5, 0, "");
    $("#answerModal").show();
    $("#offlineTicketsDiv").hide();
    inCall = 1;
}
function testfunction() {
    //alert("function called..!");
    testflag = 1;
}


