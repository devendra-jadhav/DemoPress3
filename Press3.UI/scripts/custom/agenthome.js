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
var glbToAgentId = 0;
var callerId = 0;
var isRaiseTicket = false;
var sections = [];
var topics = [];
var ticketId = 0, ticketStatus = "", ticketPriority = "";
var glbAgentId = $("#hdnAgentId").val();
var isAutoSubject = $("#hdnIsAutoSubject").val();
var isAlsagr = $("#hdnIsAlsagr").val();
var DefaultScript = "";
$("#spn-ivr-details").text("");
var Attachfields = "";
var Newcaller = "";
var isAutoRefresh = $("#isAutoRefresh").val();
var ACWInTime = 0;
var myTimer = 0;
var counter = 0;
var searchContacts = "";



//-------------------------start outbound sneha-----------------------------------------------------
var isOutbound = 0;
var hdnCallId = $("#hdnCallId").val();
var customerId = $("#hdnCustomerId").val();
var agentCallUUID = $("#hdnCallUUID").val();
var customerMobile = $("#hdnCustomerMobile").val();
var cbrId = $("#hdnCbrId").val();
var communicationTypeId = $("#hdnCommunicationTypeId").val();
var randomUUID = "";
//-------------------------end outbound sneha-----------------------------------------------------

window.setInterval(function () {
    GetAgentScriptsAndCallSummary();
}, 10000);

$(".dropdown-user").click(function () {
    var presentStatus = $("#spanAgentStatus").html();
    if (presentStatus.toLowerCase() == "ready" || (presentStatus.toLowerCase() == "in break" || presentStatus.toLowerCase() == "other work assigned")) {

        if ($("#answerModal").is(":visible")) {
            $(".ulAgentStatuses").hide();
        } else {
            if ($(".ulAgentStatuses").is(":visible"))
                $(".ulAgentStatuses").hide();
            else
                $(".ulAgentStatuses").show();
        }
    }
});

$(document).keydown(function (event) {
    if (event.keyCode == 116 && event.ctrlKey) {
        event.preventDefault();
    }
    else if ((event.which || event.keyCode) == 116) {
        event.preventDefault();
    }
    else if ((event.ctrlKey && event.keyCode) == 82 || (event.ctrlKey && event.keyCode) == 114) {
        event.preventDefault();
    }
    else {
        return true;
    }
});

$(document).ready(function () {
    $('#txtContactSearch').keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    });
    callbackRequestsPolling();

    $('.dropdown-toggle').dropdown();


    $("#offlineTicketsDiv").show();
    $("#btnCallHistory").addClass("tab-btn").removeClass("tab-btn-select");
    $("#btnTokens").addClass("tab-btn-select").removeClass("tab-btn");
    $(".callActions").attr("IsStop", "False");
    $("#txtDueDate").datepicker({
        //minDate: new Date()
        startDate: new Date()
    });
    $('.dropdown-submenu a.test').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });

    $("#btnOfflineTicket").click(function () {
        $("[name='customerType']").prop("checked", false);
        $("#existingUsersDiv").hide();
        $("#selExistingUser").html("");
        $("#offlineTickets").hide();
        $("#userDetails").html("");
        $("#userDetailsDiv").hide();
        $("#offlineTicketsHistory").html("");
        $("#btnNextDiv").hide();
        $("#offlineTicketPopup").modal("show");
    });
    $("[name='customerType']").click(function () {
        $("#txtContactSearch").val("");
        searchContacts = "";
        if ($(this).is(":checked")) {
            var checkedValue = $(this).val();
            if (checkedValue == "0") {
                $("#btnNext").attr("value", "Next");
                getAccountCustomers();
                $("#userDetails").html("");
                $("#userDetailsDiv").hide();
                $("#existingUsersDiv").show();
                $("#btnNext").val('Next');

            } else if (checkedValue == "1") {
                $("#btnNext").attr("value", "Create");
                // GetCallerInformation("");
                callersManagement(1);
                $("#btnNextDiv").show();
                $("#userDetailsDiv").show();
                $("#existingUsersDiv").hide();
                $("#selExistingUser").html("");
                $("#offlineTickets").hide();
                $("#offlineTicketsHistory").html("");
                $("#btnNext").val('Create & Next');
            }
        }
    });
    $("#selExistingUser").change(function () {
        var userValue = $(this).find("option:selected").val();
        var selCustomerId = $(this).find("option:selected").attr("customerId");
        if (userValue != "") {
            GetCallerInformation(userValue);
            $("#btnNext").attr("customerId", selCustomerId);
            $("#btnNextDiv").show();
        } else {
            $("#btnNext").attr("customerId", "");
            $("#userDetails").html("").show();
            $("#userDetailsDiv").hide();
            $("#btnNextDiv").hide();
        }
    });
    //$('#txtCallerName').keydown(function (e) {
    $(document).delegate("#txtCallerName", "keyup", function (e) {
        $('.remainCharacters').text('');
        var txtVal = $(this).val();

        var length = parseInt($('#txtCallerName').attr("maxlength"))
        var textlength = txtVal.length;
        var difference = length - textlength;
        if (difference > 1) {
            $(this).next('.remainCharacters').text(difference + ' digits are remaining');
        }
        else if (difference == 1)
        { $(this).next('.remainCharacters').text(difference + ' digit is remaining'); }
        else {
            $(this).next('.remainCharacters').text('');
        }

    });

    $(document).delegate(".closeOffline", "click", function () {
        $("#offlineTicketPopup").modal("hide");
    });


    $(document).delegate("#txtCallerEmail", "keyup", function (e) {

        var x = e.which || e.keyCode;
        if (x != 32) {

            $('.remainCharacters').text('');
            var txtVal = $(this).val();

            var length = parseInt($('#txtCallerEmail').attr("maxlength"))
            var textlength = txtVal.length;
            var difference = length - textlength;
            if (difference > 1) {
                $(this).next('.remainCharacters').text(difference + ' digits are remaining');
            }
            else if (difference == 1)
            { $(this).next('.remainCharacters').text(difference + ' digit is remaining'); }
            else {
                $(this).next('.remainCharacters').text('');
            }
        }
        else {

            e.preventDefault();
        }

    });

    $(document).delegate(".restrictChar", "keyup", function (e) {
        $('.remainCharacters').text('');
        var txtVal = $(this).val();

        var length = parseInt($(this).attr("maxlength"))
        var textlength = txtVal.length;
        var difference = length - textlength;
        if (difference > 1) {
            $(this).next('.remainCharacters').text(difference + ' digits are remaining');
        }
        else if (difference == 1)
        { $(this).next('.remainCharacters').text(difference + ' digit is remaining'); }
        else {
            $(this).next('.remainCharacters').text('');
        }

    });

    $(document).delegate("#btnSearchContact", "click", function () {
        searchContacts = "";
        searchContacts = $("#txtContactSearch").val();
        getAccountCustomers();
    });


    $("#btnNext").click(function () {
        var btnCustomerId = $(this).attr("customerId");
        if (btnCustomerId == "0") {
            var detailsObj = {};
            $("#lblEditErrorMsg").html("");
            var isValid = 1;
            $(".metaData .txtRequired").each(function (index) {
                if ($.trim($(this).val()) == "") {
                    $("#lblEditErrorMsg").html($(this).attr("key") + " is Mandatory");
                    isValid = 0;
                    return false;
                }
            });
            $(".metaData .NoSpecialChars").each(function (index) {
                if ($(this).val() != "") {

                    var re = /[$-/:-?{-~!@"^_`\[\]]/;
                    if (re.test($(this).val())) {
                        $("#lblEditErrorMsg").html("Special Characters Not Allowed In " + $(this).attr("key"));
                        isValid = 0;
                        return false;
                    }
                }
            });


            if (isValid == 0) {
                return false;
            }
            $(".metaData .ddlRequiredField").each(function (index) {
                if ($(this).val() == "Select") {
                    $("#lblEditErrorMsg").html("Please select " + $(this).attr("key"))
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
            callerName = callerName.trim();
            callerEmail = callerEmail.trim();
            if (callerName == "") {
                $("#lblEditErrorMsg").html("Please Enter Name");
                return false;
            }
            var moblen = callerMobile.length;

            if (moblen > 15 || moblen < 7) {
                $("#lblEditErrorMsg").html("Mobile Number length should be Min 7 and Max 15");
                return false;
            }

            if (callerEmail != "") {
                if (!isEmail(callerEmail)) {
                    $("#lblEditErrorMsg").html("Please Enter Valid Email");
                    return false;
                }
            }

            $(".metaData .field").each(function () {

                var Key = $(this).attr("Key");
                var fieldType = $(this).attr("FieldType");
                var value = $(this).val();
                //  alert(Key +" "+ fieldType +" "+value)
                detailsObj[Key] = value;

            });

            var details = JSON.stringify(detailsObj);
            CreateCaller(details, callerMobile, callerName, callerMobile, callerEmail);
        }
        else {
            callerId = btnCustomerId;
        }

        if (callerId > 0) {
            callId = 0;
            console.log(callerId);
            $("#offlineTicketPopup").modal("hide");
            //$("#newToken").trigger("click");

            $("#divCategories").each(function () {
                $(this).find(".subCategories").remove();
            });
            $("#ddlRootCategories,#ddlPriority").val("-1");
            $("#txtDueDate").val("");
            $("#txtSubject").val("");
            $("#txtDescription").val("");
            if (callerId == "" || callerId == "0" || callerId == 0) {
                alert("Please update customer details");
                return false;
            } else {
                $("#btnCreateTicket").attr("isOffline", "1");
                $("#tokenCreate").modal("show");
            }

            GetTicketCategries(5, 0, "");
        }

    });

    var script = $("#ddlScripts").val();

    $("#ddlScripts").val();


    $(document).on("input", "#txtCallerMobile,#txtTicketNumber,#txttransferTo", function () {
        this.value = this.value.replace(/[^\d\.\-]/g, '');
    });
    $(document).on("input", ".Numeric", function () {
        this.value = this.value.replace(/[^\d\.\-]/g, '');
    });
    $(document).on("input", ".Alphabets", function () {
        this.value = this.value.replace(/[^a-zA-Z]/g, '');
    });
    $(document).on("input", ".AlphaNumerics", function () {
        this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
    });
    var currentDate = new Date()
    $("#txtDateTime").datetimepicker({
        startDate: new Date()
    });
    $("#editCallerDetails").click(function () {
        var callerMobile = $("#txtCallerMobile").val();
        GetCallerInformation(callerMobile);
        $("#editCallerDetailsModal").modal("show");

    });

    GetAgentScriptsAndCallSummary();

    LoginVerto();
    scriptData(1, 0, 0, 0);

    //-------------------------start outbound sneha-----------------------------------------------------
    if (customerId != "" && parseInt(customerId) > 0 && communicationTypeId != "" && parseInt(communicationTypeId) != 1) {
        makeOutboundCallToCustomer();
    }
    //-------------------------end outbound sneha-----------------------------------------------------

    $("#btnAnswerCall").click(function () {
        testfunction();
        if (communicationTypeId == "1") {
            var result = AnswerCall();
            if (result == 1) {
                glbCallType == "Verto"
                $("#btnAnswerCall").hide();
                $("#callFrom").html("Connecting to Customer");
                $("#callerTokens").show();
                $("#pageContent").addClass("col-md-9");
                if ($("#side-panel").attr("class").indexOf("page-content") == -1) {
                    $("#side-panel").addClass("page-content");
                }
                $("#spanAgentStatus").html("On Call")
                $("#modalHeader").html(customerMobile);
                $(".status_agent").remove();
                $("#divider-status").remove();
                $(".ulAgentStatuses").hide();
                //inCall = 1;
                //makeOutboundCallToCustomer();
            }
        } else {
            managerDashBoardCounts();
            var result = AnswerCall();
            if (result == 1) {
                glbCallType = "Verto";
                isAnswer = 1;
                if ($("#pageContent").attr("class").indexOf("col-md-9") == -1) {
                    $("#pageContent").addClass("col-md-9");
                }
                if ($("#side-panel").attr("class").indexOf("page-content") == -1) {
                    $("#side-panel").addClass("page-content");
                }
                $("#answerModal").hide();
                $("#spanAgentStatus").html("On Call")
                if (callType == "3" || callType == "4") {
                    $("#divSidePanelWithOutActions").show()
                }
                else {
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
                GetAgentScriptsAndCallSummary();
                if (callType == "3" || callType == "4") {

                    var domain = location.host
                    var host = (location.protocol === 'https:') ? 'wss://' : 'ws://';
                    var page = '/ConferenceWebSocket.sub?Channel_Name=';
                    var ws;
                    var hostTotal = host + domain + page + conferenceRoom + '_' + callId;
                    console.log(hostTotal);
                    ws = new WebSocket(hostTotal);
                    ws.onopen = function (evt) {
                        console.log("WebSocket Connection Open for Channel_Name" + conferenceRoom + '_' + callId);
                    };
                    ws.onmessage = function (evt) {
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
                }
            }
        }
    });

    $("#btnMakeCall").click(function () {
        var result = MakeCall($("#hdnToNumber").val(), "Narasimha", $("#hdnNumber").val(), true, true)
    });

    $("#lblMute").click(function () {
        if (glbCallType == "External") {
            MuteUnMute("True", agentFsMemberId, glbHttpurl, conferenceRoom, "False", "Mute");
            var result = 1;
        }
        else {
            var result = MuteCall();

        }
        if (result == 1) {
            $(this).hide();
            $("#lblUnMute").show();
            ChangeCallActions(callId, 1, "Mute", conferenceRoom, isOutbound);
        }

    });

    $("#lblUnMute").click(function () {
        if (glbCallType == "External") {
            MuteUnMute("False", agentFsMemberId, glbHttpurl, conferenceRoom, "False", "Mute");
            var result = 1;
        }
        else {
            var result = UnMuteCall();
        }
        if (result == 1) {
            $(this).hide();
            $("#lblMute").show();
            ChangeCallActions(callId, 0, "Mute", conferenceRoom, isOutbound);
        }
    });

    $("#lblHold").click(function () {
        if (glbCallType == "External") {
            HoldUnHolduser(0, glbHttpurl, conferenceRoom, callerMemberId, true);
            var result = 1;
        }
        else {
            var result = HoldCall();
        }
        if (result == 1) {
            $(this).hide();
            $("#lblUnHold").show();
            ChangeCallActions(callId, 1, "Hold", conferenceRoom, isOutbound);
        }
    });

    $("#lblUnHold").click(function () {
        if (glbCallType == "External") {
            HoldUnHolduser(0, glbHttpurl, conferenceRoom, callerMemberId, false);
            var result = 1;
        }
        else {
            var result = UnholdCall();
        }
        if (result == 1) {
            $(this).hide();
            $("#lblHold").show();
            ChangeCallActions(callId, 0, "Hold", conferenceRoom, isOutbound);
        }
    });

    $("#divtransferCall").click(function () {
        var isStop = $(this).attr("IsStop");
        if (isStop == "True") {
            return false;
        }
        $(".actionsData").hide();
        $("#lblAction").html("Transfer Call To");
        $("#divAgents").show();
        $("#divTransfers").html("");
        $("#ddlTransfers").val("0");
        $("#divTransferCall").show();
    });

    $("#divwarmTransferCall").click(function () {
        var isStop = $(this).attr("IsStop");
        if (isStop == "True") {
            return false;
        }
        $(".actionsData").hide();
        $("#divWarmTransferCall").show();
        if (glbIsWarmTransfer) {
            $("#divAgents").hide();
            $("#divWarmTransferCallAction").hide();
            $("#divWarmTransferCallActions").show();
        }
        else {
            $("#lblAction").html("Warm Transfer Call To");
            $("#divAgents").show();
            $("#divTransfers").html("");
            $("#ddlTransfers").val("0");
            $("#divWarmTransferCallAction").show();
            $("#divWarmTransferCallActions").hide();
        }
    });

    $("#divConference").click(function () {
        var isStop = $(this).attr("IsStop");
        if (isStop == "True") {
            return false;
        }
        $(".actionsData").hide();
        $("#divConferenceCall").show();
        if (isConference) {
            $("#divAgents").hide();
            $("#divConferenceCallAction").hide();
            $("#divConferenceCallActions").show();
            $("#divAddParticipantAction").hide();
        }
        else {
            $("#lblAction").html("Conference Call To");
            $("#divAgents").show();
            $("#divTransfers").html("");
            $("#ddlTransfers").val("0");
            $("#divConferenceCallAction").show();
            $("#divConferenceCallActions").hide();
            $("#divAddParticipantAction").hide();
        }
    });

    $("#ddlTransfers").change(function () {
        var transfersTo = "";
        transfersTo = $(this).val();
        if (transfersTo == "1") {
            GetAvailableAgents(callId);
        }
        else {
            $("#divTransfers").html("<input type='text' class='form-control input-circle margin-top-10'  id='txttransferTo' />")
        }

    });

    $("#btnTransferCall").click(function () {
        if ($("#ddlTransfers").val() != "1") {
            alert("Please Select Agent");
            return false;

        }
        var toAgentId = $("#ddlAgents option:selected").attr("AgentId");
        TransferCall(callId, toAgentId, false);
    });

    $("#btnWarmTransferCall").click(function () {
        if ($("#ddlTransfers").val() != "1") {
            alert("Please Select Agent");
            return false;
        }
        var toAgentId = $("#ddlAgents option:selected").attr("AgentId");
        TransferCall(callId, toAgentId, true);
    });

    $("#btnStartConference").click(function () {
        if ($("#ddlTransfers").val() != "1") {
            alert("Please Select Agent");
            return false;
        }
        var toAgentId = $("#ddlAgents option:selected").attr("AgentId");
        StartConference(callId, toAgentId, 1)
    });

    $("#btnAddParticipantToConference").click(function () {
        if ($("#ddlTransfers").val() != "1") {
            alert("Please Select Agent");
            return false;
        }
        var toAgentId = $("#ddlAgents option:selected").attr("AgentId");
        StartConference(callId, toAgentId, 1)
    });

    $("#btnEndConference").click(function () {
        EndConference(callId);
    });

    $("#btnAddParticipant").click(function () {
        $("#divConferenceCallAction").hide();
        // $("#divConferenceCallActions").hide();
        $("#btnAddParticipant").hide();
        //  btnAddParticipant
        $("#divAgents").show();
        $("#lblAction").html("Add participant To Conference")
        $("#divTransfers").html("");
        $("#ddlTransfers").val("0");
        $("#divAddParticipantAction").show();
    });


    $(document).delegate(".divHangUpCall", "click", function () {
        if (glbCallType == "External") {
            //HangUp(glbHttpurl, agentRequestUUID);
            if (isOutbound == 1) {
                HangUp(glbHttpurl, agentRequestUUID, hdnCallId, 1);
            } else {
                HangUp(glbHttpurl, agentRequestUUID, callId, 0);
            }
            if (isAutoRefresh == "0") {
                startTimerForAcw();
            } else {
                startTimerForAcwNew();
            }
        }
        else {
            var result = HangUpCall();
            if (result == 1) {
                inCall = 0;
                isAnswer = 0;
                if (isAutoRefresh == "0") {
                    startTimerForAcw();
                } else {
                    startTimerForAcwNew();
                }
            }
        }
        $("#afterCallWork").show();

    });

    function startTimerForAcw() {
        // $("#timer").show();
        var count = 60;
        var counter = setInterval(timer, 1000);
        function timer() {
            count = count - 1;
            if (count <= 0) {
                clearInterval(counter);
                //counter ended, do something here
                //  $("#timer").hide();
                $("#changestatusacw").modal("show");
                return;
            }
            //document.getElementById("timer").innerHTML = "00:" + count + " secs";
        }

    }



    $(document).delegate("#finishAcw", "click", function () {
        $("#finishACWPopup").modal("hide");
        StopTimer();
        //myTimer = 0;
        //clearInterval(myTimer);
        clearInterval(counter);
        // timeRunner();
        startTimerForAcwNew();
    });

    function timeRunner() {
        var sec = 0;
        var min = 1;
        $("#min").text("0" + min);
        $("#sec").text("0" + sec);
        myTimer = 0;
        sec = 60
        myTimer = setInterval(function () {
            if (sec >= 0) {
                sec = sec - 1;
                if (sec >= 0) {
                    $("#min").text("0" + "0");
                    if (sec == 0) {
                        location.reload();
                    } else if (sec > 9) {
                        $("#sec").text(sec);
                    } else {
                        $("#sec").text("0" + sec);
                    }
                }
            }
            else {
                clearInterval(myTimer);

            }
        }, 1000);
    }

    function StopTimer() {
        clearInterval(myTimer);
    }

    function startTimerForAcwNew() {
        // $("#timer").show();
        var count = 0;
        count = 120;
        counter = setInterval(timer, 1000);
        function timer() {
            count = count - 1;
            if (count == 0) {
                ACWInTime += 2;
            }
            if (count <= 0) {
                clearInterval(counter);
                //counter ended, do something here
                //  $("#timer").hide();
                $("#ACWInTime").text("");
                $("#ACWInTime").text(ACWInTime);
                $("#finishACWPopup").modal("show");
                timeRunner();
                return;
            }
            //document.getElementById("timer").innerHTML = "00:" + count + " secs";
        }

    }


    ///////////deven


    $('input[name="customerType"]').on("keypress", function (e) {
        if (e.keyCode == 13) {
            return false; // prevent the button click from happening
        }
    });

    $('#txtTicketNumber').on("keypress", function (e) {
        if (e.keyCode == 13) {

            return false; // prevent the button click from happening
        }
    });

    $('#txtSubject').on("keypress", function (e) {
        if (e.keyCode == 13) {

            return false; // prevent the button click from happening
        }
    });


    $("#btnTokens").click(function () {
        $(this).removeClass("tab-btn");
        $(this).addClass("tab-btn-select");
        $("#btnCallHistory").removeClass("tab-btn-select");
        $("#btnCallHistory").addClass("tab-btn");
        $("#tokens").show();
        $("#callHistory").hide();
    });

    $(document).delegate("#btnSearch", "click", function () {
        var searchData = '';
        searchData = $("#txtSearch").val().trim();
        if (searchData == "") {
            alert("Please Enter the Name or Email or Mobile Number to Search.!!");
        }
        else {
            getContactInformation(searchData);
        }

    });
    $(document).delegate(".categoryValue", "click", function () {
        $(".selectedCategory").text("");
        $(".selectedCategory").attr("categoryId", $(this).attr("categoryId"));
        $(".selectedCategory").text($(this).attr("category"));

    });
    $(document).delegate("#AlternativeMobile", "click", function () {
        var caller_Id = $("#AlternativeMobile").attr("caller-id");
        var MobileNumber = $("#AlternativeMobile").attr("caller-mobile");
        AttachContact(caller_Id, MobileNumber);

    });
    $("#btnCallHistory").click(function () {
        $(this).removeClass("tab-btn");
        $(this).addClass("tab-btn-select");
        $("#btnTokens").removeClass("tab-btn-select");
        $("#btnTokens").addClass("tab-btn");
        $("#tokens").hide();
        $("#callHistory").show();
    });
    $("#newToken").click(function () {
        $("#divCategories").each(function () {
            $(this).find(".subCategories").remove();
        });
        $("#ddlRootCategories,#ddlPriority").val("-1");
        $("#txtDueDate").val("");
        $("#txtSubject").val("");
        $("#txtDescription").val("");
        if (callerId == "" || callerId == "0" || callerId == 0) {
            alert("Please update customer details");
            return false;
        } else {
            $("#btnCreateTicket").attr("isOffline", "0");
            $("#tokenCreate").modal("show");
        }
    });




    $("#btnUpdateCallerdetails").click(function () {
        var table = $("#tblEditCallerDetails");
        var detailsObj = {};
        $("#lblEditErrorMsg").html("");
        var isValid = 1;
        $("#tblEditCallerDetails .txtRequired").each(function (index) {
            if ($(this).val() == "") {
                $("#lblEditErrorMsg").html($(this).attr("key") + " is Mandatory")
                isValid = 0;
                return false;
            }
        });
        $("#tblEditCallerDetails .ddlRequiredField").each(function (index) {
            if ($(this).val() == "Select") {
                $("#lblEditErrorMsg").html("Please select " + $(this).attr("key"))
                isValid = 0;
                return false;
            }
        });
        if (isValid == 0) {
            return false;
        }

        var callerName = $("#txtCallerName").val();
        callerName = callerName.trim();
        if (callerName == "") {
            $("#lblEditErrorMsg").html("Please Enter valid name");
            return false;
        }
        if (callerName.length > 50) {
            $("#lblEditErrorMsg").html("Name will not allow 50 characters above.");
            return false;

        }
        var callerMobile = $("#txtCallerMobile").val();
        var callerEmail = $("#txtCallerEmail").val();
        if (callerEmail.length > 200) {
            $("#lblEditErrorMsg").html("Email will not allow 200 characters above.");
            return false;

        }
        if (callerEmail != "" && !isEmail(callerEmail)) {
            $("#lblEditErrorMsg").html("Please Enter Valid Email");
            return false;
        }

        table.find('.metadata').each(function (i, el) {
            var $tds = $(this).find('td');
            var Key = $tds.eq(0).attr("key");
            var fieldType = $tds.eq(0).attr("FieldType");
            if (fieldType == "TextBox") {
                var value = $tds.eq(1).find('input').val();
            }
            else if (fieldType == "DropDown") {
                var value = $tds.eq(1).find('select').val();
            } else if (fieldType == "TextArea") {
                var value = $tds.eq(1).find('textarea').val();
            }

            detailsObj[Key] = value;
        });
        var details = JSON.stringify(detailsObj);
        UpdateCallerInformation(details, callNumber, callerName, callerMobile, callerEmail);
    });




    $("#btnCancelUpdateCallerDetails").click(function () {
        $("#lblEditErrorMsg").html("");
        //   $("#txtCallerName").val("");
        //  $("#txtCallerMobile").val("");
        //  $("#txtCallerEmail").val("");
        //   table.find('.metadata').each(function (i, el) {
        //    var $tds = $(this).find('td');
        //    var fieldType = $tds.eq(0).attr("FieldType");
        //    if (fieldType == "TextBox") {
        //        $tds.eq(1).find('input').val("");
        //    }
        //    else if (fieldType == "DropDown") {
        //        $tds.eq(1).find('select').val("");
        //    }
        //});
    });

    $(".divSubmitAcwNew").click(function () {



        if (!isRaiseTicket) {
            alert("Please Raise Ticket");
            return false;
        }
        SubmitACW(callId, isTransfer);
        $("#pageContent").removeClass("col-md-9");
        $("#divSidePanel").hide();
        $("#side-panel").removeClass("page-content");
        $("#tblViewCallerDetails").html("");
        $("#divCallHistory").html("");
        $("#editCallerDetails").attr("CallerAttributesMetadata", "");
        $("#tblEditCallerDetails").html("");
        $("#spanAgentStatus").html("Online");
        $("#editCallerDetails").hide();
        $("#afterCallWork").hide();
        inCall = 0;
        callId = 0;
        callNumber = "";
        $("#callHistoryData").html("");
        $("#viewToken").html("");
        $("#ticketHistory").html("");
        $("#callerTokens").hide();
        alert("Submit ACW success..!");

    });

    $("#btnSubmitAcw").click(function () {
        if (!isRaiseTicket) {
            alert("Please Raise Ticket");
            return false;
        }
        SubmitACW(callId, isTransfer);

        $("#tblViewCallerDetails").html("");
        $("#divCallHistory").html("");
        $("#editCallerDetails").attr("CallerAttributesMetadata", "");
        $("#tblEditCallerDetails").html("");
        $("#spanAgentStatus").html("Online");
        $("#editCallerDetails").hide();
        $("#afterCallWork").hide();
        inCall = 0;
        callId = 0;
        callNumber = "";
        $("#callHistoryData").html("");
        $("#viewToken").html("");
        $("#ticketHistory").html("");
        $("#callerTokens").hide();


    });

    $("#btnCompleteWarmTransfer").click(function () {
        CompleteTransfer(glbCallerSequenceNumber, glbHttpUrl, glbConferenceName, glbCallerFsMemberId, false, glbTalkingAgentRequestUUID, callId)
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

        var isMute = false;
        if (action == "Mute") {
            isMute = true
        }
        MuteUnMute(isMute, fsMemberId, httpUrl, requestUUID, "False");
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

    //$(document).on("change", ".categories", function () {
    //  $(this).parent().nextAll().remove();
    // var parentId = $(this).find("option:selected").val();
    //  var parentCategory = $(this).find("option:selected").text();
    //  GetTicketCategries(5, parentId,parentCategory);
    //});

    $("#btnCreateTicket").click(function () {

        if ($(".selectedCategory").attr("categoryId") == "0") {
            alert("Category  Is Mandatory");
            return false;
        }
        var ticketvalidationResult = true
        var isOffine = 0;
        isOffine = $(this).attr("isOffline");

        $(".ddlRequired").each(function () {
            if ($(this).val() == "-1") {
                alert($(this).prev().html() + " Is Mandatory");
                ticketvalidationResult = false;
                return false;
            }
        });
        if (ticketvalidationResult == false) {
            return false;
        }
        $(".required").each(function () {
            if (isAutoSubject == "1") {
                if ($(this).attr("id") != "txtSubject") {
                    if ($.trim($(this).val()) == "") {
                        alert($(this).prev().html() + " Is Mandatory");
                        ticketvalidationResult = false;
                        return false;
                    }
                }
            } else {
                if ($.trim($(this).val()) == "") {
                    alert($(this).prev().html() + " Is Mandatory");
                    ticketvalidationResult = false;
                    return false;
                }
            }
        });
        if (ticketvalidationResult == false) {
            return false;
        }
        var categoryId = 0;
        var priorityid = 0;
        var dueDate = "";
        var description = "";
        var topic = "";

        if ($(".selSubCategories").length > 0) {
            categoryId = $(".selSubCategories").last().val();
        }
        else { categoryId = $(".categories").last().val(); }
        priorityid = $("#ddlPriority").val();
        dueDate = $("#txtDueDate").val();
        description = $("#txtDescription").val();
        categoryId = $(".selectedCategory").attr("categoryId");
        if (isAlsagr == "0") {
            topic = $("#txtSubject").val();
            topic = topic.trim();
            if (topic == "") {
                alert("subject is mandatory");
                ticketvalidationResult = false;
                return false;
            }
        }



        if (isAutoSubject == "1") {
            if (topic == "") {
                var dt = new Date();
                topic = dt.getDate() + '/' + (dt.getMonth() + 1) + '/' + dt.getFullYear() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
            }
        }

        if (callerId == "" || callerId == "0" || callerId == 0) {
            alert("Please update customer details");
            return false;
        } else {
            TokenManagement(1, categoryId, priorityid, dueDate, description, topic, callerId, callId, isOffine);
            GetCallerTicketHistory();
        }

    });
    $("#txtTicketNumber").keyup(function () {
        if (this.value != "") {
            ticketId = this.value;
            GetCallerTicketHistory();
        }
        else {
            ticketId = 0;
            GetCallerTicketHistory();
        }

    });
    $("#ddlPriorities").change(function () {
        ticketPriority = $(this).val();
        GetCallerTicketHistory();
    });
    $("#ddlTicketStatus").change(function () {
        ticketStatus = $(this).val();
        GetCallerTicketHistory();
    });
    $(document).on("click", ".ticketDetails", function () {
        var ticket = $(this).attr("TicketId");
        if (ticket == "0" || ticket == "undefined") {
            alert("failed");
            return false;
        }
        GetTicketDetails(ticket);

    });
    $("#cancelViewToken").click(function () {
        $(".token_view").hide();
        $("#viewToken").html("");
        if ($("#btnCallHistory").hasClass("tab-btn-select")) {
            $("#callHistory").show();
        }
        else {
            $("#tokens").show();
        }

        $("#callsPanel").show();
        GetCallerTicketHistory();
    });
    $("#updateViewToken").click(function () {
        var replyDescription = "";
        replyDescription = $("#tokenCalllog").val();
        if (replyDescription == "") {
            alert("Please enter call description");
            return false;
        }
        addReplyToTicket($(this).attr("TicketId"), $("#ddlTokenStatus").val(), $("#ddlTokenPriority").val(), replyDescription)
    });
    $("#ddlScripts").change(function () {
        if ($(this).val() == "0") {
            $("#sciptsdata").html("");
            $("#ddlSections").html("<option value='0'>Select</option>");
            $("#ddlTopics").html("<option value='0'>Select</option>");
            return false;
        }
        scriptData(2, $(this).val(), 0, 0);
    });
    $("#ddlSections").change(function () {
        if ($(this).val() == "0") {
            $("#sciptsdata").html("");
            $("#ddlTopics").html("<option value='0'>Select</option>");
            scriptData(2, $("#ddlScripts").val(), 0, 0);
            return false;
        }
        scriptData(3, 0, $(this).val(), 0);
    });
    $("#ddlTopics").change(function () {
        if ($(this).val() == "0") {
            $("#sciptsdata").html("");
            scriptData(3, 0, $("#ddlSections").val(), 0);
            return false;
        }
        $("#sciptsdata").html("");
        scriptsData = "<div class='well well-lite-grey well-sm f_13 brd'>";
        for (var j = 0; j < topics.length ; j++) {
            if (topics[j].TopicId == $(this).val()) {
                scriptsData += "<label class='bold-6'> " + topics[j].Topic + " </label>"
                scriptsData += "<p class='txt-grey'> " + topics[j].Description + " </p>"
            }
        }
        scriptsData += "</div>"
        $("#sciptsdata").html(scriptsData);
    });

    $("#divCallbackRequest").click(function () {
        if (callerId == "" || callerId == "0" || callerId == 0) {
            alert("Please update customer details");
            return false;
        }
        $("#txtDateTime").val("");
        $("#taNotes").val("");
        $("#ddlDialType").val("1");
        $("#callBackRequest").modal("show");
    });
    $("#btnSubmitCallBackRequest").click(function () {
        var cbrDateTime = $("#txtDateTime").val();
        var cbrDialType = $("#ddlDialType").val();
        var cbrNotes = $("#taNotes").val();
        if (cbrDateTime == "") {
            alert("please select date & time");
            return false;
        }
        if (cbrNotes == "") {
            alert("please enter notes");
            return false;
        }
        addCallBackRequest(1, callNumber, cbrDateTime, cbrDialType, cbrNotes, callId, callerId)
    });

    $("#ddlScripts > option").each(function () {
        if (this.text == DefaultScript) {
            var value = this.value;
            $("#ddlScripts").val(value);
            scriptData(2, value, 0, 0);
        }

    });
});



function addCallBackRequest(mode, mobile, dateTime, dialType, notes, callId) {
    $.ajax({
        url: "Handlers/Calls.ashx",
        type: "GET",
        async: false,
        dataType: "JSON",
        data: {
            type: 7, mode: 1, mobile: mobile, datetime: dateTime, dialType: dialType, notes: notes, callId: callId, callerId: callerId
        },
        success: function (res) {
            if (res.Success == "True") {
                $("#callBackRequest").modal("hide");
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

function scriptData(mode, scriptId, sectionId, skillGroupId) {
    var scriptsOptions = "<option value='0'>Select</option>";

    $.ajax({
        url: "Handlers/Scripts.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 7, mode: mode, scriptId: scriptId, sectionId: sectionId, skillGroupId: skillGroupId
        },
        success: function (res) {
            if (res.Success == "True") {
                if (res.ScriptsData.length > 0) {
                    for (var i = 0; i < res.ScriptsData.length ; i++) {
                        // if (res.DefaultScript[0].Title == res.ScriptsData[i].Name) {
                        //   scriptsOptions += "<option value='" + res.ScriptsData[i].Id + "' Selected>" + res.ScriptsData[i].Name + "</option>";

                        //} else {
                        scriptsOptions += "<option value='" + res.ScriptsData[i].Id + "'>" + res.ScriptsData[i].Name + "</option>";

                        //  }
                    }
                }
                if (res.DefaultScript != "") {
                    DefaultScript = res.DefaultScript;
                }

                if (mode == 1) {
                    var scriptsData = "";
                    $("#ddlScripts").html(scriptsOptions);
                    $("#sciptsdata").html("");
                    sections = res.Sections;
                    topics = res.Topics;
                    for (var i = 0; i < sections.length; i++) {
                        scriptsData += "<div class='well well-lite-grey well-sm f_13 brd'>";
                        scriptsData += "<h4 class='txt-grey bold-6 blocked'>" + sections[i].Section + "</h4>";
                        for (var j = 0; j < topics.length ; j++) {
                            if (sections[i].Id == topics[j].ScriptSectionId) {
                                scriptsData += "<label class='bold-6'> " + topics[j].Topic + " </label>"
                                scriptsData += "<p class='txt-grey'> " + topics[j].Description + " </p>"
                            }
                        }
                        scriptsData += "</div>"
                    }
                    scriptsData += "";
                    $("#sciptsdata").html(scriptsData);
                } else if (mode == 2) {
                    var scriptsData = "";
                    $("#ddlSections").html(scriptsOptions);
                    $("#sciptsdata").html("");

                    sections = res.Sections;
                    topics = res.Topics;
                    for (var i = 0; i < sections.length; i++) {
                        scriptsData += "<div class='well well-lite-grey well-sm f_13 brd'>";
                        scriptsData += "<h4 class='txt-grey bold-6 blocked'>" + sections[i].Section + "</h4>";
                        for (var j = 0; j < topics.length ; j++) {
                            if (sections[i].Id == topics[j].ScriptSectionId) {
                                scriptsData += "<label class='bold-6'> " + topics[j].Topic + " </label>"
                                scriptsData += "<p class='txt-grey'> " + topics[j].Description + " </p>"
                            }
                        }
                        scriptsData += "</div>"
                    }
                    scriptsData += "";
                    $("#sciptsdata").html(scriptsData);
                } else if (mode == 3) {
                    $("#ddlTopics").html(scriptsOptions);
                    $("#sciptsdata").html("");
                    scriptsData = "<div class='well well-lite-grey well-sm f_13 brd'>";
                    for (var j = 0; j < topics.length ; j++) {
                        if (topics[j].ScriptSectionId == sectionId) {
                            scriptsData += "<label class='bold-6'> " + topics[j].Topic + " </label>"
                            scriptsData += "<p class='txt-grey'> " + topics[j].Description + " </p>"
                        }
                    }
                    scriptsData += "</div>"
                    $("#sciptsdata").html(scriptsData);
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

function addReplyToTicket(ticketId, status, priority, description) {
    $.ajax({
        url: "Handlers/Tickets.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, ticketId: ticketId, StatusId: status, PriorityId: priority, Description: description, Mode: 2, CallId: callId
        },
        success: function (res) {
            if (res.Success == "True") {
                isRaiseTicket = true;
                $("#tokenCalllog").val("");
                $("#cancelViewToken").click();
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

function GetTicketDetails(ticket) {
    var ticketDetails = "";
    $.ajax({
        url: "Handlers/Tickets.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 9, ticketId: ticket
        },
        success: function (res) {
            if (res.Success == "True") {
                $("#tokens").hide();
                $("#callHistory").hide();

                if (res.TicketDetails.length > 0) {

                    ticketDetails += "<div class='row'><div class='col-sm-4'><h4 class='text-uppercase font-yellow-gold bold-6 margin-top-5'>ticket - ";
                    if (res.TicketDetails[0].Number != "") {
                        ticketDetails += res.TicketDetails[0].Number
                    } else {
                        ticketDetails += ticket
                    }
                    ticketDetails += "</h4></div>";
                    for (var i = 0; i < res.TicketDetails.length; i++) {
                        if (res.TicketDetails[i].TicketHistoryId == 0) {
                            if (res.TicketDetails[i].Categories != "") {
                                ticketDetails += "<div class='col-sm-8 text-right'>";
                                var catArray = res.TicketDetails[i].Categories.split(",");
                                var catColorsArray = res.TicketDetails[i].CategoryColorCodes.split(",");
                                for (var j = 0; j < catArray.length; j++) {
                                    if (catArray[j] != "") {
                                        if (catColorsArray[j] == "ebf1f6") { resHtml += "<label class='label_round_blue f_11 margin-right-10' style='background-color:" + catColorsArray[j] + ";font-size:12px !important;'>" + catArray[j] + "</label>"; }
                                        else { ticketDetails += "<label class='label_round_blue f_11 margin-right-10' style='background-color:" + catColorsArray[j] + ";color:white;font-size:12px !important;'>" + catArray[j] + "</label>"; }
                                    }
                                }
                                ticketDetails += "</div>";
                            }
                        }
                    }
                    ticketDetails += "</div>";
                    //ticketDetails += "<div class='col-sm-8 text-right'><label class='label_round_blue f_11 margin-right-10'>Complaint</label><label class='label_round_blue f_11 margin-right-10'>Press3</label></div></div>";
                 
                    ticketDetails += "<ul class='token_his'>";
                    for (var i = 0; i < res.TicketDetails.length; i++) {
                        ticketDetails += "<li><div><label><span style='color:#fff;background-color:" + res.TicketDetails[i].StatusColorCode + "' class='label margin-right-5'>" + res.TicketDetails[i].Status;
                        ticketDetails += "</span>on <span class='f_12 margin-right-5 brd' style='color:#fff;padding:1px 5px;background-color:" + res.TicketDetails[i].PriorityColorCode + "'>" + res.TicketDetails[i].Priority + " </span>  priority by <strong>" + res.TicketDetails[i].AgentName + "</strong>";
                        ticketDetails += " on " + res.TicketDetails[i].CreatedTime + "</label>";
                        ticketDetails += "<label class='margin-left-30 f_12 bold-6'>Inbound Call - " + res.TicketDetails[i].CreatedTime + "</label></div>";
                        ticketDetails += "<p> " + res.TicketDetails[i].Body + "</p></li>";
                    }

                    ticketDetails += "</ul>";

                }
                $("#viewToken").html(ticketDetails);
                $(".token_view").show();
                $("#updateViewToken").attr("TicketId", ticket);
                $("#callsPanel").hide();

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
function GetCallerTicketHistory() {
    var ticketHistory = ""
    $.ajax({
        url: "Handlers/Tickets.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 3, ticketId: ticketId, statusIds: ticketStatus, priorityIds: ticketPriority, customerId: callerId, pageSize: 100, pageIndex: 1, ticketId: ticketId
        },
        success: function (res) {
            if (res.Success == "True") {
                if (res.TicketDetails.length > 0) {
                    for (var i = 0; i < res.TicketDetails.length; i++) {
                        ticketHistory += "<div class='tokenHistory'><div class='row'><div class='col-sm-8'>";
                        ticketHistory += "<div class='pad-10'><div class='margin-bottom-10'><label class='margin-right-15 pull-left'>";
                        ticketHistory += "<a TicketId='" + res.TicketDetails[i].TicketId + "' IsOffline='" + res.TicketDetails[i].IsOffine + "' class='text-uppercase font-yellow-gold bold-6 margin-left-5 ticketDetails'># ";
                        if (res.TicketDetails[i].Number != "") {
                            ticketHistory += res.TicketDetails[i].Number;
                        } else {
                            ticketHistory += res.TicketDetails[i].TicketId;
                        }
                        ticketHistory += "</a>";
                        ticketHistory += "<span class='f_13 txt-grey margin-left-5'>Opened on " + res.TicketDetails[i].CreatedDate + "</span>";
                        if (res.TicketDetails[i].IsOffline == "True") {
                            ticketHistory += "<span class='margin-left-15 txt-lite-grey f_11'>(Offline)</span>";
                        }
                        ticketHistory += "</label>";
                        ticketHistory += "<label class='pull-right text-danger f_12'>" + res.TicketDetails[i].DueStatus + "</label><div class='clearfix'></div></div>";
                        ticketHistory += "<p class='txt-lite-grey'>" + res.TicketDetails[i].Body + "</p></div></div>";
                        ticketHistory += "<div class='col-sm-4 pad-10' style='border-left: 1px solid #ddd;'><label style='color:#fff;background-color:" + res.TicketDetails[i].StatusColorCode + ";' class='label label-sm'>" + res.TicketDetails[i].Status + "</label>";

                        // ticketHistory += "</br><label style='color:#fff;background-color:" + res.TicketDetails[i].PriorityColorCode + ";' class='text-primary margin-top-10 margin-bottom-10 f_13'><strong>" + res.TicketDetails[i].Priority + " -</strong> <span class='f_11'>(priority)</span></label>";

                        ticketHistory += "</br><label class='blocked f_13 margin-top-5' style='color:" + res.TicketDetails[i].PriorityColorCode + ";' margin-top-10 margin-bottom-10 f_13'><strong>" + res.TicketDetails[i].Priority + " -</strong> <span class='f_11'>(priority)</span></label>";

                        ticketHistory += "<div>";

                        if (res.TicketDetails[i].Category.substring(0, res.TicketDetails[i].Category.length - 1).split(",").length > 1) {
                            var categories = []
                            var categoryColorCode = []
                            categories = res.TicketDetails[i].Category.substring(0, res.TicketDetails[i].Category.length - 1).split(",")
                            categoryColorCode = res.TicketDetails[i].CategoryColorCodes.substring(0, res.TicketDetails[i].CategoryColorCodes.length - 1).split(",")

                            $.each(categories, function (itemIndex, value) {
                                // ticketHistory += "<label style='color:#fff;background-color:" + categoryColorCode[itemIndex] + ";' class='label_round_blue f_11 margin-right-10'>" + value + "</label>";
                                ticketHistory += "<label class='label_round_blue f_11 margin-right-10' >" + value + "</label>";
                            });
                        }
                        else {
                            // ticketHistory += "<label style='color:#fff;background-color:" + res.TicketDetails[i].CategoryColorCodes + ";' class='f_11 margin-right-10'>" + res.TicketDetails[i].Category + "</label>";
                            ticketHistory += "<label class='label_round_blue f_11 margin-right-10'>" + res.TicketDetails[i].Category + "</label>";
                        }


                        ticketHistory += "</div></div></div></div>";
                    }
                    $("#ticketHistory").html(ticketHistory);
                    $("#offlineTicketsHistory").html(ticketHistory);
                }
            }
            else {
                $("#ticketHistory").html(res.Message);
                $("#offlineTicketsHistory").html(res.Message);
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

function TokenManagement(mode, categoryId, priorityId, dueDate, description, topic, customerId, callId, isOffline) {
    $.ajax({
        url: "Handlers/Tickets.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, Mode: mode, CategoryId: categoryId, PriorityId: priorityId, DueDate: dueDate, Description: description, Topic: topic,
            CustomerId: customerId, CallId: callId, IsOffline: isOffline
        },
        success: function (res) {
            console.log(res);
            if (res.Success == "True") {
                isRaiseTicket = true;
                $("#ticketSuccessMsg").html("Ticket raised successfully");
                setTimeout(function () {
                    $("#tokenCreate").modal("hide");
                    $("#ticketSuccessMsg").html("");
                }, 2500);
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

function MuteUnMute(isMute, fsMemberId, httpUrl, requestUUID, isHold, action) {

    $.ajax({
        url: "Handlers/Conference.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 8, IsMute: isMute, FsMemberId: fsMemberId, HttpUrl: httpUrl, ConferenceRoom: requestUUID, IsHold: isHold, Action: action
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

function HangUp(httpUrl, requestUUID, argCallId, argIsOutbound) {

    $.ajax({
        url: "Handlers/Conference.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 7, TalkingAgentRequestUUID: requestUUID, HttpURL: httpUrl, callId: argCallId, isOutbound: argIsOutbound
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

function StartConference(callId, toAgentId, mode) {

    $.ajax({
        url: "Handlers/Conference.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 4, CallId: callId, ToAgentId: toAgentId, Mode: mode
        },
        success: function (res) {
            console.log(res);
            if (res.Success == "True") {
                console.log(res);
                $("#divAgents").hide();
                $("#divConferenceCallAction").hide();

                $("#divConferenceCallActions").show();
                $("#btnAddParticipant").show();



                $("#divAddParticipantAction").hide()
                $("#divConferenceInProgress").show();
                isConference = true;
                $(".conference_call_time").timer({
                    format: "%H:%M:%S",
                    seconds: "" + 0
                });
                $(".callActions").attr("IsStop", "True");
                $("#divConference").attr("IsStop", "False")
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
                $("#divConferenceInProgress").hide();
                $("#divConferenceCall").hide();

                $("#divAgents").hide();

                isConference = false;
                $(".callActions").attr("IsStop", "False");
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
                $("#divWarmTransferCallActions").hide();
                glbIsWarmTransfer = false;
                $(".callActions").attr("IsStop", "False");
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
            type: 2, CallerSequenceNumber: callId, HttpURL: httpUrl, ConferenceName: conferenceName,
            CallerFsMemberId: callerFsMemberId, IsPrivate: isPrivate, CallId: callId
        },
        success: function (res) {
            if (res.Success == true) {
                if (!isPrivate) {
                    $("#btnUnHoldWarmTransfer").html("Hold Customer");
                    $("#btnUnHoldWarmTransfer").attr("Action", "Hold")
                }
                else {
                    $("#btnUnHoldWarmTransfer").html("UnHold Customer");
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

function CompleteTransfer(conferenceSequenceNumber, httpUrl, conferenceName, callerFsMemberId, isPrivate, talkingAgentRequestUUID, calId) {

    $.ajax({
        url: "Handlers/Conference.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 1, CallerSequenceNumber: conferenceSequenceNumber, HttpURL: httpUrl, ConferenceName: conferenceName,
            CallerFsMemberId: callerFsMemberId, IsPrivate: isPrivate, TalkingAgentRequestUUID: talkingAgentRequestUUID, CallId: calId
        },
        success: function (res) {
            console.log("CompleteTransfer:" + res);
            if (res.Success == "True") {
                $("#spanAgentStatus").html("After Call Work");
                $(".callActions").attr("IsStop", "False");
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

function SubmitACW(callId, isTransfer) {
    $.ajax({
        url: "Handlers/Calls.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 3, CallId: callId, IsTransfer: isTransfer
        },
        success: function (res) {

            if (res.Success == "True") {
                isRaiseTicket = false;
                //location.reload();
                window.location.href = "/Agenthome.aspx";
                $("#offlineTicketsDiv").show();
                managerDashBoardCounts();
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


function managerDashBoardCounts() {
    $.ajax({
        url: "Handlers/Manager.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: { type: 31 },
        success: function (res) {
            if (res.Success == "True") {
                console.log("Websocket called on submiting ACW");
            }
            else {
                console.log("Websocket is not called on submiting ACW");
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
            type: 2, DetailsObj: callerDetails, Mode: 2, FromNumber: fromNumber, CallerName: callerName, CallerMobile: callerMobile, CallerEmail: callerEmail, Caller_Id: ''
        },
        success: function (res) {

            if (res.Success == "True") {
                if (isOutbound == 1) { GetCallerInformation(callerMobile); }
                else { GetCallerInformation(fromNumber); }
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

                    callHistoryContent += "<div class='call_history'><div class='row'><div class='col-sm-9 pad-10' style='border-right: 1px solid #ddd;'>";
                    if (res.CallHistory[i].Direction == "Inbound") {
                        callHistoryContent += "<label class='img_icn margin-left-20'><img src='assets/img/inbound.png' class='margin-right-5' height='18' alt='inbound'></label>"
                        callHistoryContent += "<div class='col-sm-11'><label class='txt-grey margin-bottom-10'><strong>";
                        callHistoryContent += res.CallHistory[i].Direction + " Call </strong>";
                    }
                    else if (res.CallHistory[i].Direction == "Outbound") {
                        callHistoryContent += "<label class='img_icn margin-left-20'><img src='/assets/img/outbound.png' class='margin-right-5' alt='outbound' height='18'></label>"
                        callHistoryContent += "<div class='col-sm-11'><label class='font-green-soft margin-bottom-10'><strong>";
                        callHistoryContent += res.CallHistory[i].Direction + " Call </strong>";
                    }
                    else {
                        callHistoryContent += "<label class='img_icn margin-left-20'><img src='assets/img/abandoned.png' class='margin-right-5' alt='inbound' height='18'></label>"
                        callHistoryContent += "<div class='col-sm-11'><label class='font-red margin-bottom-10'><strong>";
                        callHistoryContent += res.CallHistory[i].Direction + " Call </strong>";
                    }

                    callHistoryContent += "<span class='margin-left-5 txt-lite-grey'>" + res.CallHistory[i].CallTime + "</span></label>"
                    for (var j = 0; j < res.CallHistory[i].Tickets.length ; j++) {
                        callHistoryContent += "<div class='margin-bottom-5'><label class='margin-right-15'>Regarding ";
                        callHistoryContent += "<a TicketId = " + res.CallHistory[i].Tickets[j].Id + " class='text-uppercase font-yellow-gold bold-6 margin-left-5 ticketDetails'>ticket - ";
                        if (res.CallHistory[i].Tickets[j].Number == "") {
                            callHistoryContent += res.CallHistory[i].Tickets[j].Id;
                        } else {
                            callHistoryContent += res.CallHistory[i].Tickets[j].Number;
                        }

                        callHistoryContent += "</a></label>";
                        var categories = [];
                        categories = res.CallHistory[i].Tickets[j].Categories.substring(0, res.CallHistory[i].Tickets[j].Categories.length - 1).split(",");
                        $.each(categories, function (index, value) {
                            callHistoryContent += "<label class='label_round_blue f_11 margin-right-10'>" + value + "</label>";
                        });
                        callHistoryContent += "</div><p class='txt-lite-grey'>" + res.CallHistory[i].Tickets[j].Body + "</p>";
                        if (j != res.CallHistory[i].Tickets.length - 1) {
                            callHistoryContent += "<hr>"
                        }

                    }

                    callHistoryContent += "</div></div><div class='col-sm-3 pad-10'><div class='margin-bottom-10'><label class='label_round_sm margin-right-5'>" + res.CallHistory[i].SkillGroupName + "</label></div>";
                    callHistoryContent += "<h5 class='margin-bottom-5'>" + res.CallHistory[i].AgentName + "</h5>";
                    callHistoryContent += "<span class='f_12 txt-lite-grey'>(Agent)</span></div>";
                    callHistoryContent += "</div><div class='clearfix'></div></div>";
                }
                $("#callHistoryData").html(callHistoryContent);
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
                $("#spanAgentStatus").html("Ready");
                loginNumber = res.GatewayDetails[0].UserName;
                if (res.GatewayDetails[0].OriginationUrl.indexOf("verto.rtc") >= 0) {
                    password = res.GatewayDetails[0].Password;
                    ip = res.GatewayDetails[0].Ip;
                    port = res.GatewayDetails[0].Port;
                    url = "wss://" + ip + ":" + port;
                    Initlogin(loginNumber, password, url, ip);
                    SubscribeWebScocket("Agent_" + glbAgentId);
                }
                else {
                    glbHttpurl = res.GatewayDetails[0].HttpUrl;
                    SubscribeWebScocket("Agent_" + glbAgentId);
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



function getContactInformation(searchData) {
    var callerDetailInfo = "";
    var callerDetailsData = "";
    $.ajax({
        url: "Handlers/Caller.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, FromNumber: searchData, DetailsObj: "", Mode: 4, CallerName: "", CallerMobile: "", CallerEmail: "", Caller_Id: ""
        },
        success: function (res) {
            if (res.Success == "True") {

                if (res.CallerDetails.length <= 1) {
                    $("#tblViewCallerDetails").html("");
                    callerDetailsData += "<div Id ='newcaller'><center><h4 style='color:#00D057;'> <b>(New Caller)</b> </h4></center>"
                    callerDetailsData += "<div class=''><div class='input-group'><div class='input-icon left'>";
                    callerDetailsData += "<i class='fa fa-search'></i><input id='txtSearch' class='form-control btn-circle-left' placeholder='Search by Name, Mobile' type='text'>";
                    callerDetailsData += "</div><span class='input-group-btn'><button type='button' id='btnSearch' class='btn btn-success btn-circle-right'>Search</button></span></div></div>";



                    callerDetailInfo += "<table class='table no-border caller-det'>";
                    callerDetailInfo += "<tr><td class='col-sm-5'> Name<span class='text-danger'>*</span> </td><td class='col-sm-5'>" + res.CallerDetails[0].Name + " </td></tr>"
                    callerDetailInfo += "<tr><td class='col-sm-5'> Mobile<span class='text-danger'>*</span> </td><td class='col-sm-5'>" + callNumber + " </td></tr>"
                    callerDetailInfo += "<tr><td class='col-sm-5'> Email </td><td class='col-sm-5'>" + res.CallerDetails[0].Email + " </td></tr>"
                    var MetaData = res.CallerDetails[0].MetaData;
                    var callerDetailsObj = jQuery.parseJSON(MetaData);
                    var callerAttributesArray = jQuery.parseJSON(res.CallerDetails[0].CallerAttributesMetadata);
                    $.each(callerAttributesArray, function (key, value) {
                        var callerAttributesObj = callerAttributesArray[key];
                        callerDetailInfo += "<tr><td  class='col-sm-5'>" + callerAttributesObj.FieldName;
                        if (callerAttributesObj.Mandatory == "Yes") {
                            callerDetailInfo += "<span class='text-danger'>*</span>";
                        }
                        callerDetailInfo += "</td><td class='col-sm-5'>" + (typeof callerDetailsObj[callerAttributesObj.FieldName] == "undefined" ? "" : callerDetailsObj[callerAttributesObj.FieldName]) + "</td></tr>";


                    });

                    callerDetailInfo += "</table>";
                    var Caller_Id = res.CallerDetails[0].Id;

                    callerDetailInfo += Attachfields;
                    if ($("[name='customerType']").is(":visible")) {
                        $("#userDetails").html(callerDetailInfo).show();
                        $("#userDetailsDiv").show();
                        $("#btnNextDiv").show();
                    } else {
                        $("#tblViewCallerDetails").html(callerDetailInfo);
                    }
                    $("#AlternativeMobile").attr("caller-id", Caller_Id);
                } else {

                    alert("Contact Not Exists");
                }
            }
            else {
                $("#txtSearch").val("");
                alert("Contact Not Exists");
            }
        }
    });
}







function AttachContact(caller_Id, MobileNumber) {

    $.ajax({
        url: "Handlers/Caller.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, FromNumber: MobileNumber, DetailsObj: "", Mode: 5, CallerName: "", CallerMobile: "", CallerEmail: "", Caller_Id: caller_Id
        },
        success: function (res) {
            if (res.Success == "True") {


                alert("Contact Added Successfully");
                GetCallerInformation(MobileNumber);
                // $("#newcaller").hide();
                //  $("#newContact").hide();
            }
        }
    })
}



function GetCallerInformation(fromNumber) {
    var callerDetailsData = "", editCallerDetailsData = "", priority = 0;

    $.ajax({
        url: "Handlers/Caller.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, FromNumber: fromNumber, DetailsObj: "", Mode: 1, CallerName: "", CallerMobile: "", CallerEmail: "", Caller_Id: ""
        },
        success: function (res) {
            if (res.Success == "True") {
                if (res.CallerDetails.length > 0) {
                    priority = 1;
                    callerId = res.CallerDetails[0].Id;
                    callerMemberId = res.CallerDetails[0].CallerFsMemberId;
                    if (res.CallerDetails[0].Mobile == "") {
                        callerDetailsData += "<div Id ='newcaller'><center><h4 style='color:#00D057;'> <b>(New Caller)</b> </h4></center>"
                        callerDetailsData += "<div class='col-sm-12 col-md-7'><div class='input-group' style='width: 356px;'><div class='input-icon left'>";
                        callerDetailsData += "<i class='fa fa-search'></i><input id='txtSearch' class='form-control btn-circle-left' placeholder='Search by Name, Mobile' type='text'>";
                        callerDetailsData += "</div><span class='input-group-btn'><button type='button' id='btnSearch' class='btn btn-success btn-circle-right'>Search</button></span></div></div>";
                    }

                    callerDetailsData += "<table class='table no-border caller-det'>";
                    editCallerDetailsData += "<table id='tblEditCallerDetails' class='table no-border caller-det '>"
                    editCallerDetailsData += "<tr><td colspan='2'  style='text-align:center;'><label style='color:red;' id='lblEditErrorMsg'></label></td></tr>"

                    callerDetailsData += "<tr><td class='col-sm-5'> Name<span class='text-danger'>*</span> </td><td class='col-sm-5'>" + res.CallerDetails[0].Name + " </td></tr>"
                    editCallerDetailsData += "<tr><td class='col-sm-5'> Name<span class='text-danger'>*</span> </td><td class='col-sm-5'><input key='Name' id='txtCallerName' class='txtRequired' value = '" + res.CallerDetails[0].Name + "' maxlength='50' /> <label class='remainCharacters text-danger'></label></td></tr>"
                    if (res.CallerDetails[0].Mobile == "") {
                        callerDetailsData += "<tr><td class='col-sm-5'> Mobile<span class='text-danger'>*</span> </td><td class='col-sm-5'>" + callNumber + " </td></tr>"
                        editCallerDetailsData += "<tr><td class='col-sm-5'> Mobile<span class='text-danger'>*</span> </td><td class='col-sm-5'><input readonly key='Mobile' id='txtCallerMobile' class='txtRequired' value = '" + fromNumber + "' /> </td></tr>"
                    }
                    else {
                        callerDetailsData += "<tr><td class='col-sm-5'> Mobile<span class='text-danger'>*</span> </td><td class='col-sm-5'>" + res.CallerDetails[0].Mobile + " </td></tr>"
                        editCallerDetailsData += "<tr><td class='col-sm-5'> Mobile<span class='text-danger'>*</span> </td><td class='col-sm-5'><input readonly key='Mobile' id='txtCallerMobile' class='txtRequired' value = '" + res.CallerDetails[0].Mobile + "' /> </td></tr>"
                    }
                    if (res.CallerDetails[0].AlternativeMobile != "") {
                        callerDetailsData += "<tr><td class='col-sm-5'> AlternativeMobile<span class='text-danger'></span> </td><td class='col-sm-5'>" + res.CallerDetails[0].AlternativeMobile + " </td></tr>"
                    }
                    callerDetailsData += "<tr><td class='col-sm-5'> Email </td><td class='col-sm-5'>" + res.CallerDetails[0].Email + " </td></tr>"
                    editCallerDetailsData += "<tr><td class='col-sm-5'> Email </td><td class='col-sm-5'><input key='Email' id='txtCallerEmail' value = '" + res.CallerDetails[0].Email + "' maxlength='64' /><label class='remainCharacters text-danger'></label> </td></tr>"

                    var MetaData = res.CallerDetails[0].MetaData;
                    if (MetaData == "") {
                        if (res.CallerDetails[0].CallerAttributesMetadata != "") {
                            var callerAttributesArray = jQuery.parseJSON(res.CallerDetails[0].CallerAttributesMetadata);
                            $.each(callerAttributesArray, function (key, value) {
                                var callerAttributesObj = callerAttributesArray[key];
                                callerDetailsData += "<tr><td  class='col-sm-5'>" + callerAttributesObj.FieldName;
                                if (callerAttributesObj.Mandatory == "Yes") {
                                    callerDetailsData += "<span class='text-danger'>*</span>";
                                }
                                callerDetailsData += "</td><td class='col-sm-5'></td>";
                                editCallerDetailsData += "<tr class='metadata'><td class='col-sm-5' FieldType='" + callerAttributesObj.FieldType + "' key='" + callerAttributesObj.FieldName + "'>" + callerAttributesObj.FieldName;
                                if (callerAttributesObj.Mandatory == "Yes") {
                                    editCallerDetailsData += "<span class='text-danger'>*</span>";
                                }
                                editCallerDetailsData += "</td><td class='col-sm-5'>";
                                if (callerAttributesObj.FieldType == "TextBox") {
                                    editCallerDetailsData += "<input type='text' FieldType='" + callerAttributesObj.FieldType + "' key='" + callerAttributesObj.FieldName + "' maxlength='" + callerAttributesObj.MaxChars + "' class='" + callerAttributesObj.PlaceHolder;
                                    if (callerAttributesObj.Mandatory == "Yes") {
                                        editCallerDetailsData += " txtRequired restrictChar"
                                    } else {
                                        editCallerDetailsData += "restrictChar"
                                    }
                                    editCallerDetailsData += "' /><label class='remainCharacters text-danger'></label>";
                                }
                                if (callerAttributesObj.FieldType == "DropDown") {
                                    editCallerDetailsData += "<select FieldType='" + callerAttributesObj.FieldType + "' key='" + callerAttributesObj.FieldName + "' id='ddl" + callerAttributesObj.FieldName + "' class='";

                                    if (callerAttributesObj.Mandatory == "Yes") {
                                        editCallerDetailsData += " ddlRequiredField"
                                    }
                                    editCallerDetailsData += "'>";
                                    editCallerDetailsData += "<option value='Select'> Select </option>"
                                    var ddlOptions = callerAttributesObj.Options.split(",");
                                    $.each(ddlOptions, function (k, v) {
                                        editCallerDetailsData += "<option value='" + v + "'>" + v + "</option>";
                                    });
                                    editCallerDetailsData += "</select>"
                                }
                                if (callerAttributesObj.FieldType == "TextArea") {
                                    editCallerDetailsData += "<textarea rows='3' cols='15'  FieldType='" + callerAttributesObj.FieldType + "' key='" + callerAttributesObj.FieldName + "' maxlength='" + callerAttributesObj.MaxChars + "' class='" + callerAttributesObj.PlaceHolder;
                                    if (callerAttributesObj.Mandatory == "Yes") {
                                        editCallerDetailsData += " txtRequired restrictChar";
                                    } else {
                                        editCallerDetailsData += "restrictChar";
                                    }
                                    editCallerDetailsData += "' ></textarea><label class='remainCharacters text-danger'></label>"


                                }
                                editCallerDetailsData += "</td>"
                            });
                        }
                    }
                    else {

                        var callerDetailsObj = jQuery.parseJSON(MetaData);
                        if (res.CallerDetails[0].CallerAttributesMetadata != "") {
                            var callerAttributesArray = jQuery.parseJSON(res.CallerDetails[0].CallerAttributesMetadata);
                            $.each(callerAttributesArray, function (key, value) {
                                var callerAttributesObj = callerAttributesArray[key];
                                callerDetailsData += "<tr><td  class='col-sm-5'>" + callerAttributesObj.FieldName;
                                if (callerAttributesObj.Mandatory == "Yes") {
                                    callerDetailsData += "<span class='text-danger'>*</span>";
                                }
                                callerDetailsData += "</td><td class='col-sm-5'>" + (typeof callerDetailsObj[callerAttributesObj.FieldName] == "undefined" ? "" : callerDetailsObj[callerAttributesObj.FieldName]) + "</td>";
                                editCallerDetailsData += "<tr class='metadata'><td class='col-sm-5' FieldType='" + callerAttributesObj.FieldType + "' key='" + callerAttributesObj.FieldName + "'>" + callerAttributesObj.FieldName;
                                if (callerAttributesObj.Mandatory == "Yes") {
                                    editCallerDetailsData += "<span class='text-danger'>*</span>";
                                }
                                editCallerDetailsData += "</td><td class='col-sm-5'>";
                                if (callerAttributesObj.FieldType == "TextBox") {
                                    //  alert(callerAttributesObj.FieldName);
                                    //alert(callerDetailsObj[callerAttributesObj.FieldName]);
                                    editCallerDetailsData += "<input type='text' FieldType='" + callerAttributesObj.FieldType + "' key='" + callerAttributesObj.FieldName + "' maxlength='" + callerAttributesObj.MaxChars + "' value='" + (typeof callerDetailsObj[callerAttributesObj.FieldName] == "undefined" ? "" : callerDetailsObj[callerAttributesObj.FieldName]) + "' class='" + callerAttributesObj.PlaceHolder;
                                    if (callerAttributesObj.Mandatory == "Yes") {
                                        editCallerDetailsData += " txtRequired restrictChar";
                                    } else {
                                        editCallerDetailsData += "restrictChar";
                                    }
                                    editCallerDetailsData += "' /><label class='remainCharacters text-danger'></label>";

                                }
                                if (callerAttributesObj.FieldType == "DropDown") {
                                    editCallerDetailsData += "<select FieldType='" + callerAttributesObj.FieldType + "' key='" + callerAttributesObj.FieldName + "' id='ddl" + callerAttributesObj.FieldName + "' class='";

                                    if (callerAttributesObj.Mandatory == "Yes") {
                                        editCallerDetailsData += " ddlRequiredField"
                                    }
                                    editCallerDetailsData += "'>";
                                    editCallerDetailsData += "<option value='Select'> Select </option>"
                                    var ddlOptions = callerAttributesObj.Options.split(",");
                                    $.each(ddlOptions, function (k, v) {
                                        if (v == callerDetailsObj[callerAttributesObj.FieldName]) {
                                            editCallerDetailsData += "<option selected='true' value='" + v + "'>" + v + "</option>";
                                        }
                                        else {
                                            editCallerDetailsData += "<option value='" + v + "'>" + v + "</option>";
                                        }
                                    });
                                    editCallerDetailsData += "</select>"
                                }
                                if (callerAttributesObj.FieldType == "TextArea") {
                                    //alert(callerDetailsObj[callerAttributesObj.FieldName]);
                                    editCallerDetailsData += "<textarea rows='4' cols='18'  FieldType='" + callerAttributesObj.FieldType + "' key='" + callerAttributesObj.FieldName + "' maxlength='" + callerAttributesObj.MaxChars + "'   class='" + callerAttributesObj.PlaceHolder;
                                    if (callerAttributesObj.Mandatory == "Yes") {
                                        editCallerDetailsData += " txtRequired restrictChar"
                                    } else {
                                        editCallerDetailsData += "restrictChar"
                                    }
                                    editCallerDetailsData += "' >";
                                    if (callerDetailsObj[callerAttributesObj.FieldName] == undefined) {

                                    } else {
                                        editCallerDetailsData += callerDetailsObj[callerAttributesObj.FieldName];
                                    }


                                    editCallerDetailsData += "</textarea><label class='remainCharacters text-danger'></label>";


                                }
                                editCallerDetailsData += "</td>"
                            });
                        }
                    }

                    //}

                    editCallerDetailsData += "</table>";
                    callerDetailsData += "</table>";
                    Attachfields = "";
                    if (res.CallerDetails[0].Mobile == "") {
                        Attachfields += "<div style='align:center;' id='newContact' style='display:none;'><button type='button' class='btn btn-success btn-circle btn-sm margin-top-25' id='AlternativeMobile' caller-mobile=" + fromNumber + " caller-id=''>Attach</button></div>";
                    }
                    if ($("[name='customerType']").is(":visible")) {
                        $("#userDetails").html(callerDetailsData).show();
                        $("#userDetailsDiv").show();
                        $("#btnNextDiv").show();
                    } else {
                        $("#tblViewCallerDetails").html(callerDetailsData);
                        $("#editCallerDetails").attr("CallerAttributesMetadata", res.CallerDetails[0].CallerAttributesMetadata);
                        $("#tblEditCallerDetails").html(editCallerDetailsData);
                    }

                }
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



function ChangeCallStatus(callId, status, action, isOutbound) {
    $.ajax({
        url: "Handlers/Calls.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 1, Status: status, CallId: callId, Action: action, IsOutbound: isOutbound
        },
        success: function (res) {
            if (res.Success == "True") {
                callStartTimeInSeconds = res.CallTimeInSeconds;
                agentFsMemberId = res.AgentFsMemberId;
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

function ChangeCallActions(callId, status, action, conferenceRoom, isOutbound) {
    $.ajax({
        url: "Handlers/Calls.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, Status: status, CallId: callId, Action: action, conferenceRoom: conferenceRoom, isOutbound: isOutbound
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

function GetAvailableAgents(callId) {
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
                    agentsData += "<select id='ddlAgents' class='form-control margin-top-10'>";
                    for (var i = 0 ; i < res.Agents.length; i++) {
                        agentsData += "<option AgentId=" + res.Agents[i].Id + " value='" + res.Agents[i].UserName + "'> " + res.Agents[i].NAME + " </option>"
                    }
                    agentsData += "</select>"
                    $("#divTransfers").html(agentsData)
                }
                else {
                    $("#divTransfers").html("No Agents Available")
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

function TransferCall(callId, toAgentId, isWarmTransfer) {
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
            type: 4, CallId: callId, ToAgentId: toAgentId, IsWarmTransfer: isWarmTransfer
        },
        success: function (res) {
            if (res.Success == "True") {
                isTransfer = true;
                if (res.GatewayInfo.length > 0) {
                    glbCallerSequenceNumber = res.GatewayInfo[0].CallerSequenceNumber;
                    console.log(glbCallerSequenceNumber);
                    glbHttpUrl = res.GatewayInfo[0].HttpUrl;
                    glbConferenceName = res.GatewayInfo[0].ConferenceRoom;
                    glbCallerFsMemberId = res.GatewayInfo[0].CallerFsMemberId;
                    glbTalkingAgentRequestUUID = res.GatewayInfo[0].TalkingAgentRequestUUID;
                    glbToAgentrequestUUID = res.ToAgentRequestUUID;
                }
                if (isWarmTransfer) {
                    glbIsWarmTransfer = true;
                    $("#spanAgentStatus").html("On Call");
                    $("#btnUnHoldWarmTransfer").attr("action", "UnHold").text("UnHold Customer");
                    $("#divAgents").hide();
                    $("#divWarmTransferCallAction").hide();
                    $("#divWarmTransferCallActions").show();
                    $(".callActions").attr("IsStop", "True");
                    $("#divwarmTransferCall").attr("IsStop", "False");
                } else {
                    $("#spanAgentStatus").html("After Call Work");
                }
                if (glbCallType == "External") {
                    if (!isWarmTransfer) {
                        hangupActions();
                    }
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

function GetTicketCategries(mode, parentId, parentCategory) {
    $(".selectedCategory").attr("categoryId", 0);
    $(".selectedCategory").text("Select");
    $.ajax({
        type: "GET",
        url: "Handlers/Tickets.ashx",
        dataType: "JSON",
        async: false,
        data: {
            type: 1, Mode: mode, Category: "", ParentId: parentId, ColorCode: ""
        },
        success: function (res) {
            var categoriesOptions = "";
            var ticketPriorities = "";
            var ticketStatuses = "";
            //var ticketPriorities = "<option value='-1'>Select</option>";
            if (res.Success == "True") {
                if (res.TicketCategoryNodes.length > 0) {
                    //if (parentId == 0)
                    //{
                    //    categoriesOptions += "<option value='-1'>Select</option>"
                    //    for (var i = 0; i < res.TicketCategoryNodes.length; i++) {
                    //        categoriesOptions += "<option value=" + res.TicketCategoryNodes[i].Id + ">" + res.TicketCategoryNodes[i].Category + "</option>";
                    //    }
                    //    $("#ddlRootCategories").html(categoriesOptions);

                    //}
                    //else
                    //{
                    //    categoriesOptions += "<div class='form-group subCategories'><label class='label-head'>"+ parentCategory +" Sub-Category</label>";
                    //    categoriesOptions += "<select class='form-control ddlRequired selSubCategories'><option value='-1'>Select</option>";
                    //    for (var i = 0; i < res.TicketCategoryNodes.length; i++) {
                    //        categoriesOptions += "<option value=" + res.TicketCategoryNodes[i].Id + ">" + res.TicketCategoryNodes[i].Category + "</option>";
                    //    }
                    //    categoriesOptions += "</select></div>";
                    //    $("#divCategories").append(categoriesOptions);
                    //}
                    for (var i = 0; i < res.TicketCategoryNodes.length; i++) {
                        if (res.TicketCategoryNodes[i].Level == 1 && res.TicketCategoryNodes[i].childId == 0) {
                            categoriesOptions += "<li><a class='categoryValue' categoryId = '" + res.TicketCategoryNodes[i].Id + "' category='" + res.TicketCategoryNodes[i].Category + "'>" + res.TicketCategoryNodes[i].Category + "</a></li>";
                        } else if (res.TicketCategoryNodes[i].Level == 1 && res.TicketCategoryNodes[i].childId != 0) {
                            categoriesOptions += "<li class='dropdown-submenu'>";
                            categoriesOptions += "<a class='test categoryValue' categoryId = '" + res.TicketCategoryNodes[i].Id + "' category='" + res.TicketCategoryNodes[i].Category + "' >" + res.TicketCategoryNodes[i].Category + "</a>";
                            categoriesOptions += "<ul class='dropdown-menu' parentId = '" + res.TicketCategoryNodes[i].Id + "'>";
                            parentId = 0;
                            parentId = res.TicketCategoryNodes[i].Id;
                            for (var j = 0; j < res.TicketCategoryNodes.length; j++) {
                                if (res.TicketCategoryNodes[j].ParentId == parentId && res.TicketCategoryNodes[j].Level == 2 && res.TicketCategoryNodes[j].childId == 0) {
                                    categoriesOptions += "<li> <a class='categoryValue' categoryId = '" + res.TicketCategoryNodes[j].Id + "' category='" + res.TicketCategoryNodes[j].Category + "'>" + res.TicketCategoryNodes[j].Category + "</a></li>";
                                } else if (res.TicketCategoryNodes[j].ParentId == parentId && res.TicketCategoryNodes[j].Level == 2 && res.TicketCategoryNodes[j].childId != 0) {
                                    categoriesOptions += "<li class='dropdown-submenu'>";
                                    categoriesOptions += "<a class='test categoryValue' categoryId = '" + res.TicketCategoryNodes[j].Id + "' category='" + res.TicketCategoryNodes[j].Category + "' >" + res.TicketCategoryNodes[j].Category + "</a>";
                                    categoriesOptions += "<ul class='dropdown-menu' parentId = '" + res.TicketCategoryNodes[j].Id + "'>";
                                    for (var k = 0; k < res.TicketCategoryNodes.length; k++) {
                                        if (res.TicketCategoryNodes[k].ParentId == res.TicketCategoryNodes[j].Id && res.TicketCategoryNodes[k].Level == 3 && res.TicketCategoryNodes[k].childId == 0) {
                                            categoriesOptions += "<li> <a class='categoryValue' categoryId = '" + res.TicketCategoryNodes[k].Id + "' category='" + res.TicketCategoryNodes[k].Category + "'>" + res.TicketCategoryNodes[k].Category + "</a></li>";
                                        } else if (res.TicketCategoryNodes[k].ParentId == res.TicketCategoryNodes[j].Id && res.TicketCategoryNodes[k].Level == 3 && res.TicketCategoryNodes[k].childId != 0) {
                                            categoriesOptions += "<li class='dropdown-submenu'>";
                                            categoriesOptions += "<a class='test categoryValue' categoryId = '" + res.TicketCategoryNodes[k].Id + "' category='" + res.TicketCategoryNodes[k].Category + "' >" + res.TicketCategoryNodes[k].Category + "</a>";
                                            categoriesOptions += "<ul class='dropdown-menu' parentId = '" + res.TicketCategoryNodes[k].Id + "'>";
                                            for (var m = 0; m < res.TicketCategoryNodes.length; m++) {
                                                if (res.TicketCategoryNodes[m].ParentId == res.TicketCategoryNodes[k].Id && res.TicketCategoryNodes[m].Level == 4 && res.TicketCategoryNodes[m].childId == 0) {
                                                    categoriesOptions += "<li> <a class='categoryValue' categoryId = '" + res.TicketCategoryNodes[m].Id + "' category='" + res.TicketCategoryNodes[m].Category + "'>" + res.TicketCategoryNodes[m].Category + "</a></li>";
                                                } else if (res.TicketCategoryNodes[m].ParentId == res.TicketCategoryNodes[k].Id && res.TicketCategoryNodes[m].Level == 4 && res.TicketCategoryNodes[m].childId != 0) {
                                                    categoriesOptions += "<li class='dropdown-submenu'>";
                                                    categoriesOptions += "<a class='test categoryValue' categoryId = '" + res.TicketCategoryNodes[m].Id + "' category='" + res.TicketCategoryNodes[m].Category + "' >" + res.TicketCategoryNodes[m].Category + "</a>";
                                                    categoriesOptions += "<ul class='dropdown-menu' parentId = '" + res.TicketCategoryNodes[m].Id + "'>";
                                                    for (var z = 0 ; z < res.TicketCategoryNodes.length; z++) {
                                                        if (res.TicketCategoryNodes[z].ParentId == res.TicketCategoryNodes[m].Id && res.TicketCategoryNodes[z].Level == 5) {
                                                            categoriesOptions += "<li> <a class='categoryValue' categoryId = '" + res.TicketCategoryNodes[z].Id + "' category='" + res.TicketCategoryNodes[z].Category + "'>" + res.TicketCategoryNodes[z].Category + "</a></li>";
                                                        }
                                                    }
                                                    categoriesOptions += "</ul>";
                                                    categoriesOptions += "</li>";
                                                }
                                            }
                                            categoriesOptions += "</ul>";
                                            categoriesOptions += "</li>";
                                        }
                                    }
                                    categoriesOptions += "</ul>";
                                    categoriesOptions += "</li>";
                                }
                            }
                            categoriesOptions += "</ul>";
                            categoriesOptions += "</li>";
                        }

                    }
                    $("#ddlRootCategories").html(categoriesOptions);

                }

                if (res.TicketPriorities.length > 0) {
                    for (var i = 0 ; i < res.TicketPriorities.length ; i++) {
                        ticketPriorities += "<option value=" + res.TicketPriorities[i].Id + ">" + res.TicketPriorities[i].Priority + "</option>"
                    }
                    $("#ddlPriorities,#ddlTokenPriority").html(ticketPriorities);
                    $("#ddlPriority").html("<option value='-1'>Select</option>" + ticketPriorities);

                }
                if (res.TicketStatus.length > 0) {
                    for (var i = 0 ; i < res.TicketStatus.length ; i++) {
                        ticketStatuses += "<option value=" + res.TicketStatus[i].Id + ">" + res.TicketStatus[i].Status + "</option>"
                    }
                    $("#ddlTicketStatus,#ddlTokenStatus").html(ticketStatuses);
                    $("#ddlTicketStatus").val("1");
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

function getAccountCustomers() {
    $.ajax({
        type: "GET",
        url: "Handlers/Manager.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 32, SearchText: searchContacts },
        success: function (res) {
            var resHtml = "";
            if (res.Success == "True") {
                if (res.Customers.length > 0) {
                    $("#selExistingUser").html("");
                    resHtml += "<option value='' customerId=''>Select Customers</option>";
                    for (var i = 0; i < res.Customers.length; i++) {
                        resHtml += "<option value='" + res.Customers[i].Mobile + "' customerId='" + res.Customers[i].Id + "' >" + res.Customers[i].Name + "/" + res.Customers[i].Mobile + "/" + res.Customers[i].Email + "</option>";
                    }
                } else {
                    resHtml += "<option value='' customerId=''>No Customers</option>";
                }
            } else {
                resHtml += "<option value='' customerId=''>No Customers</option>";
            }
            $("#selExistingUser").html(resHtml);
            $("#selExistingUser").select2({
                placeholder: "Select an option",
                allowClear: true
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#selExistingUser").html("<option value='' customerId=''>No Customers</option>");
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

function callersManagement(mode) {
    //searchText = $("#txtSearch").val();
    var callersData = "";
    var tableHeadData = "";
    $.ajax({
        url: "Handlers/Caller.ashx",
        type: "GET",
        async: false,
        dataType: "JSON",
        data: {
            type: 3, mode: mode, searchText: "", groupId: 0, labelId: 0
        },
        success: function (res) {
            if (res.Success == "True") {
                tableHeadData += "<thead><tr><th><i class='fa fa-check-square-o'></i></th>";
                tableHeadData += "<th>Name</th><th>Mobile</th><th>Email</th>";



                global_CallerDetails = [], global_ExcelFields = [];
                global_ExcelFields.push({ "Label": "Name", "Mandatory": "Yes", "FieldType": "AlphaNumeric", "MaxChars": "50" });
                global_ExcelFields.push({ "Label": "Mobile", "Mandatory": "Yes", "FieldType": "Numeric", "MaxChars": "12" });
                global_ExcelFields.push({ "Label": "Email", "Mandatory": "No", "FieldType": "AlphaNumeric", "MaxChars": "150" });


                if (res.SettingsData != "") {
                    var settingsArray = JSON.parse(res.SettingsData);
                    global_CallerDetails = settingsArray;
                    $.each(global_CallerDetails, function (key, value) {
                        var attributesObj = settingsArray[key];
                        if (attributesObj.FieldType.toLowerCase() == "textbox") {
                            $.each(value, function (subkey, subvalue) {
                                if (subkey == "FieldName") {
                                    global_ExcelFields.push({ "Label": subvalue, "Mandatory": attributesObj.Mandatory, "FieldType": attributesObj.PlaceHolder, "MaxChars": attributesObj.MaxChars });
                                }
                            });
                        }
                    });
                    //global_ExcelFields.push({ "Label": "PAN Card", "Mandatory": "No", "FieldType": "AlphaNumeric", "MaxChars": "30" });
                    //global_ExcelFields.push({ "Label": "Aadhaar Card", "Mandatory": "Yes", "FieldType": "AlphaNumeric", "MaxChars": "30" });
                    console.log(JSON.stringify(global_ExcelFields));
                }

                var editCallerDetailsData = "<div class='row metaData f_13'><label class='text-danger text-center col-sm-12' id='lblEditErrorMsg'></label>"
                editCallerDetailsData += "<div class='col-sm-6'><div class='form-group'><label class='txt-grey'>Name<span class='text-danger'>*</span></label><input Key='Name' id='txtCallerName' class='form-control txtRequired field' value = '' maxlength = '50' /></div></div>"
                editCallerDetailsData += "<div class='col-sm-6'><div class='form-group'><label class='txt-grey'>Mobile<span class='text-danger'>*</span></label><label id='labeltextmobile' color='red' value=''></label><input Key='Mobile' id='txtCallerMobile' class='form-control txtRequired field' value = '' /></div></div>"
                editCallerDetailsData += "<div class='col-sm-6'><div class='form-group'><label class='txt-grey'>Email</label><input Key='Email' id='txtCallerEmail' class='form-control field' value = '' maxlength='64' /></div></div>"

                if (res.SettingsData != "") {
                    $.each(settingsArray, function (key, value) {
                        tableHeadData += "<th>" + value.FieldName + "</th>";

                        var callerAttributesObj = settingsArray[key];

                        editCallerDetailsData += "<div class='col-sm-6'><div class='form-group'><label class='txt-grey'>" + value.FieldName;
                        if (callerAttributesObj.Mandatory == "Yes") {
                            editCallerDetailsData += "<span class='text-danger'>*</span>";
                        }
                        editCallerDetailsData += "</label>"
                        if (callerAttributesObj.FieldType == "TextBox") {
                            editCallerDetailsData += "<input type='text' FieldType='" + callerAttributesObj.FieldType + "' Key='" + callerAttributesObj.FieldName + "' maxlength='" + callerAttributesObj.MaxChars + "' class='field form-control " + callerAttributesObj.PlaceHolder;
                            if (callerAttributesObj.Mandatory == "Yes") {
                                editCallerDetailsData += " txtRequired "
                            }
                            if (callerAttributesObj.AllowSpecialChars == "No") {
                                editCallerDetailsData += " NoSpecialChars"
                            }
                            editCallerDetailsData += "' />"
                        }
                        if (callerAttributesObj.FieldType == "DropDown") {
                            editCallerDetailsData += "<select FieldType='" + callerAttributesObj.FieldType + "' Key='" + callerAttributesObj.FieldName + "' id='ddl" + callerAttributesObj.FieldName + "' class='field form-control";

                            if (callerAttributesObj.Mandatory == "Yes") {
                                editCallerDetailsData += " ddlRequiredField"
                            }
                            editCallerDetailsData += "'>";
                            editCallerDetailsData += "<option value='Select'> Select </option>"
                            var ddlOptions = callerAttributesObj.Options.split(",");
                            $.each(ddlOptions, function (k, v) {
                                editCallerDetailsData += "<option value='" + v + "'>" + v + "</option>";
                            });
                            editCallerDetailsData += "</select>"
                        }
                        if (callerAttributesObj.FieldType == "TextArea") {
                            editCallerDetailsData += "<textarea row='4' cols='20' FieldType='" + callerAttributesObj.FieldType + "' key='" + callerAttributesObj.FieldName + "' maxlength='" + callerAttributesObj.MaxChars + "' class='" + callerAttributesObj.PlaceHolder;
                            if (callerAttributesObj.Mandatory == "Yes") {
                                editCallerDetailsData += " txtRequired "
                            }
                            editCallerDetailsData += " form-control field' ></textarea>"
                        }


                        editCallerDetailsData += "</div></div>"
                    });
                }
                tableHeadData += "</tr></thead>";

                editCallerDetailsData += "</div>";

                $("#userDetails").html(editCallerDetailsData).show();
                $("#btnNext").attr("customerId", 0);
                $("#btnNextDiv").show();
                $("#userDetailsDiv").show();
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

function CreateCaller(callerDetails, fromNumber, callerName, callerMobile, callerEmail) {
    $.ajax({
        url: "Handlers/Caller.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, DetailsObj: callerDetails, Mode: 3, FromNumber: fromNumber, CallerName: callerName, CallerMobile: callerMobile, CallerEmail: callerEmail
        },
        success: function (res) {
            if (res.Success == "True") {
                $("#callerSuccess").html("Customer created successfully");
                callerId = res.CustomerId;
                setTimeout(function () {
                    $("#addCaller").modal("hide");
                    $("#callerSuccess").html("");
                }, 2500);
                callersManagement(1);
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
};

function getCallIdFromCallUUId(callUUId) {
    $.ajax({
        url: "Handlers/Calls.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 11, callUUId: callUUId
        },
        success: function (res) {
            if (res.Success == "True") {
                callId = res.CallId;
                callNumber = res.CallerNumber;
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

function getIvrStudioSelectionDetails(callId) {
    $("#spn-ivr-details").text("");
    $.ajax({
        url: "Handlers/Calls.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 12, callId: callId
        },
        success: function (res) {
            if (res.Success == "True") {
                $("#spn-ivr-details").html(res.IvrSelectionDetails);
            }
            else {
                // alert(res.Message);
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

function makeOutboundCallToCustomer() {
    randomUUID = createUUID();
    if (agentCallUUID != "") {
        conferenceRoom = agentCallUUID;
    }
    isOutbound = 1;
    $("#callFrom").html("Connecting to Customer");
    $("#callerTokens").show();
    $("#pageContent").addClass("col-md-9");
    if ($("#side-panel").attr("class").indexOf("page-content") == -1) {
        $("#side-panel").addClass("page-content");
    }
    $(".status_agent").remove();
    $("#divider-status").remove();
    $(".ulAgentStatuses").hide();
    isTransfer = false;
    isRaiseTicket = false;
    callId = hdnCallId;
    console.log(customerId);
    callerId = customerId;
    callNumber = customerMobile;
    $("#spanAgentStatus").html("On Call")
    $("#editCallerDetails").show();
    $("#modalHeader").html(customerMobile);
    GetCallerInformation(customerMobile);
    if (callerId != "0") {
        GetCallerTicketHistory();
        GetCallHistory(customerMobile, glbPageSize, glbPageNumber, hdnCallId);
    }
    $("#ticketHistory").show();
    GetTicketCategries(5, 0, "");
    $("#btnAnswerCall").hide();
    $("#answerModal").show();
    $("#offlineTicketsDiv").hide();
    $("#divtransferCall").hide();
    $("#divwarmTransferCall").hide();
    $("#divConference").hide();
    $("#divCallbackRequest").hide();
    $("#lbl-call-type").text("Outbound call in progress");
    inCall = 1;
    if (customerId != "" && agentCallUUID != "") {
        $.ajax({
            type: "GET",
            url: "Handlers/Calls.ashx",
            dataType: "JSON",
            async: false,
            data: { type: 13, customerId: customerId, callUUID: agentCallUUID, customerCallUUID: randomUUID, isCustomer: 1, cbrId: cbrId },
            success: function (res) {
                if (res.Success.toString().toLowerCase() == "true") {
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
}

//notifications to Agent
setInterval(function () {
    callbackRequestsPolling();
}, 60000);
var flag = 0;

function callbackRequestsPolling(cbrIds, assigned) {

    $.ajax({
        type: "GET",
        url: "Handlers/Calls.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 17, cbrIds: cbrIds },
        success: function (res) {
            var notifyStr = "";
            if (res.Success.toString().toLowerCase() == "true") {
                if (!$("#divSidePanel").is(":visible") || $("#unreadNotifier").is(":visible")) {
                    for (var i = 0; i < res.UpcomingCBR.length; i++) {
                        if (assigned != 1) {
                            notifyStr += "<div class='notify_box CallCustomer' CbrId='" + res.UpcomingCBR[i].Id + "'><div class='clearfix'><h5 class='pull-left mt-0 bold-6 f_15'>Call Back Request</h5><i class='pull-right fa fa-times font-blue-hoki' cbrid='" + res.UpcomingCBR[i].Id + "'></i></div><hr/>";
                            notifyStr += "<h4>You have a scheduled call back now</h4>";
                            notifyStr += "<label class='txt-lite-grey f_13'>" + res.UpcomingCBR[i].Name + ", " + res.UpcomingCBR[i].Mobile + " @ " + res.UpcomingCBR[i].ScheduledTime + "</label>";
                            notifyStr += "<p><b>Notes :</b> " + res.UpcomingCBR[i].Notes + "</p></div>";
                        }
                        else {
                            notifyStr += "<div class='notify_box CallCustomer' CbrId='" + res.UpcomingCBR[i].Id + "'><div class='clearfix'><h5 class='pull-left mt-0 bold-6 f_15'>Call Back Request</h5><i class='pull-right fa fa-times font-blue-hoki'></i></div><hr />";
                            notifyStr += "<h4>A new call back has been assigned to you</h4>";
                            notifyStr += "<label class='txt-lite-grey f_13'>" + res.UpcomingCBR[i].Name + ", " + res.UpcomingCBR[i].Mobile + " @ " + res.UpcomingCBR[i].ScheduledTime + " </label>";
                            notifyStr += "<p><b>Notes :</b> " + res.UpcomingCBR[i].Notes + "</p></div>";
                        }
                    }
                    $("#notifyCbr").html(notifyStr);

                }
                else {
                    var cbrIds = "";
                    for (var i = 0; i < res.UpcomingCBR.length; i++) {
                        cbrIds += res.UpcomingCBR[i].Id + ",";
                    }
                    $("#showCbrNotifications").attr("cbrid", cbrIds);
                    $("#showCbrNotifications").attr("assigned", 0);
                    $("#notificationCount").text(res.UpcomingCBR.length);
                    $("#unreadNotifier").show();
                }
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

$(document).delegate("#showCbrNotifications", "click", function () {
    flag = 1;
    var assigned = $("#showCbrNotifications").attr("assigned");
    var cbrIds = $(this).attr("cbrid");
    if (assigned == 1) {
        callbackRequestsPolling(cbrIds, assigned);
    }
    else {
        callbackRequestsPolling(cbrIds);
    }
    $("#unreadNotifier").hide("slow");
    flag = 0;
})

$(document).delegate(".font-blue-hoki", "click", function (e) {

    $(this).parent().parent().hide('slow', function () { $(this).remove(); });
    var cbrid = $(this).attr("cbrid");
    if (cbrid > 0) {
        setReadStatus(cbrid);
    }
    e.stopPropagation();
});
function setReadStatus(cbrid) {
    $.ajax({
        type: "GET",
        url: "Handlers/Calls.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 18, Cbrid: cbrid },
        success: function (res) {
            var notifyStr = "";
            if (res.Success.toString().toLowerCase() == "true") {

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

function getAssignedCbr(cbrId) {
    $.ajax({
        type: "GET",
        url: "Handlers/Calls.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 19, cbrId: cbrId },
        success: function (res) {
            var notifyStr = "";
            if (res.Success.toString().toLowerCase() == "true") {
                if (!$("#divSidePanel").is(":visible")) {
                    for (var i = 0; i < res.UpcomingCBR.length; i++) {

                        notifyStr += "<div class='notify_box CallCustomer' CbrId='" + res.UpcomingCBR[i].Id + "'><div class='clearfix'><h5 class='pull-left mt-0 bold-6 f_15'>Call Back Request</h5><i class='pull-right fa fa-times font-blue-hoki'></i></div><hr />";
                        notifyStr += "<h4>A new call back has been assigned to you</h4>";
                        notifyStr += "<label class='txt-lite-grey f_13'>" + res.UpcomingCBR[i].Name + ", " + res.UpcomingCBR[i].Mobile + " @ " + res.UpcomingCBR[i].ScheduledTime + " </label>";
                        notifyStr += "<p><b>Notes :</b> " + res.UpcomingCBR[i].Notes + "</p></div>";

                    }
                    $("#notifyCbr").html(notifyStr);

                }
                else {
                    var cbrIds = "";
                    for (var i = 0; i < res.UpcomingCBR.length; i++) {
                        cbrIds += res.UpcomingCBR[i].Id + ",";
                    }
                    $("#showCbrNotifications").attr("cbrid", cbrIds);
                    $("#showCbrNotifications").attr("assigned", 1);
                    $("#notificationCount").text(res.UpcomingCBR.length);
                    $("#unreadNotifier").show();
                }
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

$(document).delegate(".CallCustomer", "click", function () {
    var callbackrequestId = $(this).attr("CbrId");
    setReadStatus(callbackrequestId);
    frmcon = "<form id='callCbrId' method='post' action='/MyCallBackRequests.aspx?CbrId=" + callbackrequestId + "'>";

    frmcon = frmcon + "</form>";

    $("body").html(frmcon);

    $('#callCbrId').submit();
})