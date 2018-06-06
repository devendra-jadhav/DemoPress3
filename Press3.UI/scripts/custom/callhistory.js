var glbDate = "Today", glbCallType =0, glblDirection = "0", glbAgent = "0", glbRingGroup = "0", glbSkill = "0";
var global_RoleId = $("#hdnRoleId").val();
var global_DateFilter = "";
var global_StudioId= 0;
var global_Selecteddate = "",global_FromDate = '',global_ToDate = '';
var global_pageLength = 10, global_pageIndex = 1;
var callId = ""
var ConferenceCallTypeId = "";
$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}
var callId_ = 0;
var cbrid = 0;
var isOutbound = 0;
//IsOutBound




$(document).ready(function () {
    if ($.urlParam('cbrid') != null) {

        cbrid = $.urlParam('cbrid');
        GetOutBoundHistory();
        isOutbound = 1;
    }
    else if ($.urlParam('callId') != null) {
        callId_ = $.urlParam('callId');
    }
    else {
        callId_ = 0;
    }
    if (cbrid == 0 || !isNaN(cbrid)) {
        GetCallHistory();
    }
    glbCallType = $("#ddlCallType").val();
    $(document).delegate(".DownloadClip", "click", function () {
        var dwnldClip = $(this).attr("dynclip");
        window.open("/Handlers/Calls.ashx?type=10&clip=" + dwnldClip)
        ;
    });
    $("#ddlDate").val(1);
    $("#ddlDirection").val(0);
    $("#ddlCallType").val(0);
    $("#ddlDate").change(function () {
        if ($('#ddlDate').val() == 4) {
            $('#spnDateText').text('Date Range');
            $("#txtDatefilter").show();
            global_DateFilter = $('#txtDatefilter').val();
        }
        else {
            $("#spnDateText").html($("#ddlDate option:selected").text());
            $("#txtDatefilter").hide();
        }
    });
    $('#txtDatefilter').daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });
    $(document).delegate(".applyBtn", "click", function () {
       // GetCallHistory();
    });

    $(document).delegate(".transferCalls", "click", function () {
        callId = ""
        ConferenceCallTypeId = "";
        callId = $(this).attr("callId");
        ConferenceCallTypeId = $(this).attr("conferenceCallTypeId");
        $("#hdn_TC_CallId").val("");
        $("#hdn_TC_CallId").val(callId);
        $("#hdnCallsType").val(ConferenceCallTypeId);
        getTransferAndConferenceCalls(callId,ConferenceCallTypeId);
    });
    
    $(document).delegate(".conferenceCalls", 'click', function () {
        callId = ""
       ConferenceCallTypeId = "";
        callId = $(this).attr("callId");
        ConferenceCallTypeId = $(this).attr("conferenceCallTypeId");
        $("#hdn_TC_CallId").val("");
        $("#hdnCallsType").val("");
        $("#hdn_TC_CallId").val(callId);
        $("#hdnCallsType").val(ConferenceCallTypeId);
        getTransferAndConferenceCalls(callId, ConferenceCallTypeId);
    });



    $("#ddlDirection").change(function () {
        $("#spnDirection").html($("#ddlDirection option:selected").text());
        var callType = $(this).val();
        if (callType == "1") {
            $("#hdnSkillGroup").hide();
            $("#hdnSkills").hide();
            $("#inboundButton").hide();
            $("#outboundButton").show();
            $("#hdnStudio").hide();
            $("#div-Call-Type").hide();
            
        } else {
            $("#hdnSkillGroup").show();
            $("#hdnSkills").show();
            $("#outboundButton").hide();
            $("#inboundButton").show();
            $("#hdnStudio").show();
            $("#div-Call-Type").show();
        }
    });
    $("#ddlAgent").change(function () {
        $("#spnAgent").html($("#ddlAgent option:selected").text());
    });
    $("#ddlIvrStudio").change(function () {
        $("#IvrStudio").html($("#ddlIvrStudio option:selected").text());
    });

    $("#ddlRingGroup").change(function () {
        $("#spnRingGroup").html($("#ddlRingGroup option:selected").text());
        var skillGroupid = 0;
        skillGroupid = $("#ddlRingGroup option:selected").val();
        if (skillGroupid != 0) {
            GetSearchInformation(skillGroupid, "Skills")
            $("#ddlSkill").val(0);
            $("#spnSkill").text("Select");
        }
        else {
            $("#ddlSkill").html("<option value='0'>Select</option>")
            $("#spnSkill").html("Select");
        }
        
    });
    $("#ddlCallType").change(function () {
        $("#spnCallType").html($("#ddlCallType option:selected").text());
    });
    $("#ddlSkill").change(function () {
        $("#spnSkill").html($("#ddlSkill option:selected").text());
    });
    $("#ddlCallDuration").change(function () {
        $("#spnCallDuration").html($("#ddlCallDuration option:selected").text());
    });
    $("#btnGetReports").click(function () {
        global_pageLength = 10, global_pageIndex = 1;
        glbDate = $("#ddlDate option:selected").text();
        glblDirection = $("#ddlDirection").val();
        glbCallType = $("#ddlCallType").val();
        glbAgent = $("#ddlAgent").val();
        global_StudioId = $("#ddlIvrStudio").val();
        glbRingGroup = $("#ddlRingGroup").val();
        glbSkill = $("#ddlSkill").val();
        global_DateFilter = $('#txtDatefilter').val();
        if (global_DateFilter != "") {
            global_Selecteddate = global_DateFilter.split("-");
            global_FromDate = global_Selecteddate[0].trim();
            global_ToDate = global_Selecteddate[1].trim();
        }
        if (glblDirection == "1") {
            $("#tblCallHistory").hide();
            $("#tblOutBoundCallHistory").show();
            
            GetOutBoundHistory();
        } else {
            $("#tblOutBoundCallHistory").hide();
            $("#tblCallHistory").show();
            GetCallHistory();

        }
        $("#hdnDate").val(glbDate);
        $("#hdnCallType").val(glblDirection);
        $("#hdnAgent").val(glbAgent);
        $("#hdnRingGroup").val(glbRingGroup);
        $("#hdnSkill").val(glbSkill);
        $("#hdnFromDate").val(global_FromDate);
        $("#hdnToDate").val(global_ToDate);
        $("#hdnStudioId").val(global_StudioId);
        $("#hdnCallDirection").val(glblDirection);
        $("#hdnPageSize").val(global_pageLength);
        $("#hdnPageIndex").val(global_pageIndex);
        $("#hdnPageNumber").val(global_pageIndex);
        
    });
    GetSearchInformation(0, "AgentsAndSkillGroups");
    //GetCallHistory();
    //document.addEventListener('play', function (e) {
    //    var audios = document.getElementsByTagName('audio');
    //    for (var i = 0, len = audios.length; i < len; i++) {
    //        if (audios[i] != e.target) {
    //            audios[i].pause();
    //        }
    //    }
    //}, true);
    
});


function getTransferAndConferenceCalls(callId, ConferenceCallTypeId) {
    $.ajax({
        url: "Handlers/Calls.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 20, CallId: callId, ConferenceCallTypeId: ConferenceCallTypeId
        },
        success: function (res) {
            var conferenceAndTransferCalls = "";
            conferenceAndTransferCalls += "<thead><th>Participant Details</th><th>From</th><th>To</th><th>Total Duration</th></thead><tbody>";
            if (res.Success == "True") {
                $('#downloadReport').prop("disabled", false);
                 if (res.TransferAndConferenceCalls.length > 0) {
                    for (var i = 0 ; i < res.TransferAndConferenceCalls.length; i++) {
                        conferenceAndTransferCalls += "<tr>";
                        conferenceAndTransferCalls += "<td>" + res.TransferAndConferenceCalls[i].Name + "</td>";
                        conferenceAndTransferCalls += "<td>" + res.TransferAndConferenceCalls[i].FromTime + "</td>";
                        conferenceAndTransferCalls += "<td>" + res.TransferAndConferenceCalls[i].ToTime + "</td>";
                        conferenceAndTransferCalls += "<td>" + res.TransferAndConferenceCalls[i].Duration + "</td>";
                        conferenceAndTransferCalls += "</tr>";
                    }
                }
            } else {
                $('#downloadReport').prop("disabled", true);
                conferenceAndTransferCalls += "<tr><td colspan='4'>No Reports</td></tr>";
            }
            conferenceAndTransferCalls += "</tbody>";
            $("#transferCallsAndConfernceCalls").html(conferenceAndTransferCalls);
            $("#Tranfercalls").modal("show");
          
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



function GetSearchInformation(skillGroupid, searchFor) {
    
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    
    $.ajax({
        url: "Handlers/Calls.ashx",
        type: "POST",
        async: true,
        dataType: "JSON",
        data: {
            type: 5, SkillGroupId: skillGroupid, SearchFor: searchFor
        },
        success: function (res) {

            $.unblockUI();

            if (res.Success == "True") {
                if (searchFor == "AgentsAndSkillGroups") {
                    var agents = "<option value='0'>Select</option>";
                    var skillGroups = "<option value='0'>Select</option>";
                    var ivrStudioname = "<option value='0'>Select</option>";
                    if (res.Agents.length > 0) {
                        for (i = 0; i < res.Agents.length; i++) {
                            agents += "<option value='" + res.Agents[i].Id + "'>" + res.Agents[i].Name + "</option>"
                        }
                    }
                    if (res.SkillGroups.length > 0) {
                        for (i = 0; i < res.SkillGroups.length; i++) {
                            skillGroups += "<option value='" + res.SkillGroups[i].Id + "'>" + res.SkillGroups[i].Name + "</option>"
                        }
                    }
                    if (res.Ivr_Studio_Name.length > 0) {
                        for (i = 0; i < res.Ivr_Studio_Name.length; i++) {
                            ivrStudioname += "<option value='" + res.Ivr_Studio_Name[i].Id + "'>" + res.Ivr_Studio_Name[i].Name + "</option>"
                        }
                    }
                    $("#ddlAgent").html(agents);
                    $("#ddlRingGroup").html(skillGroups);
                    $("#ddlIvrStudio").html(ivrStudioname);

                }
                else if (searchFor == "Skills") {
                    var skills = "<option value='0'>Select</option>";
                    if (res.Skills.length > 0) {
                        for (i = 0; i < res.Skills.length; i++) {
                            skills += "<option value='" + res.Skills[i].Id + "'>" + res.Skills[i].Name + "</option>"
                        }
                    }
                    $("#ddlSkill").html(skills);

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


function GetCallHistory() {

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
   
    glbCallType = $("#ddlCallType").val();
   
    //$.blockUI({ message: '<h4><img src="/assets/img/Press3_Gif.gif" /></h4>' });
    //$("#btnGetReports").attr("disabled", true);
    //$("#tblCallHistory").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");

    $("#hdnCallId").val(callId_);

    $.ajax({
        url: "Handlers/Calls.ashx",
        type: "POST",
        async: true,
        dataType: "JSON",
        data: {
            type: 6, Date: glbDate, CallDirection: glblDirection, AgentId: glbAgent, SkillGroupId: glbRingGroup,
            SkillId: glbSkill, PageSize: global_pageLength, PageNumber: global_pageIndex, CallType : glbCallType,
            FromDate: global_FromDate, ToDate: global_ToDate, CallId: callId_, StudioId: global_StudioId
        },
        success: function (res) {

            $.unblockUI();
          //  $("#btnGetReports").attr("disabled", false);
            

            if (res.Success == "True") {
                // $("#page-selection").show();
                //pagination(res.Total, global_pageLength)
                var callHistory = ""
                callHistory += "<tbody><tr><th>Time Stamp</th><th>Call Type</th><th>Caller Details</th><th>Skill Group</th><th>Skill Selection Flow</th>";
                callHistory += "<th>Agent</th><th>Wait Time (HH:MM:SS)</th><th>Duration (HH:MM:SS)</th><th>Hold Time (HH:MM:SS)</th><th>Ivr Studio</th><th>Transfer</th><th>Conference</th><th>Recording</th>";
                if (global_RoleId == "2" || global_RoleId == "3") {
                    callHistory += "<th>Actions</th>";
                }
                callHistory += "</tr>";

                ShowRange(res.Total, res.CallHistoryReports.length);

                if (res.Total > 0) {
                    $("#page-selection").show();
                    pagination(res.Total, global_pageLength);
                    
                    if (res.CallHistoryReports.length > 0) {

                        for (var i = 0; res.CallHistoryReports.length > i ; i++) {
                            callHistory += "<tr>";
                            if (res.CallHistoryReports[i].CallDirection == 0) {
                                callHistory += "<td><div><img src='Images\\inbound.png' alt='InBound' data-toggle='tooltip' data-placement='right' title='InBound' style='cursor:pointer;'></div>" + res.CallHistoryReports[i].DateTime + "</td>";
                            }
                            else{
                                callHistory += "<td><div><img src='Images\\outbound.png' alt='OutBound' data-toggle='tooltip' data-placement='right' title='OutBound' style='cursor:pointer;'></div>" + res.CallHistoryReports[i].DateTime + "</td>";
                            }
                            callHistory += "<td>" + res.CallHistoryReports[i].CallType + "</td>";
                            callHistory += "<td> <span class='callerDetail' data-toggle='tooltip' data-placement='right' title='Caller Name'>" + res.CallHistoryReports[i].CallerDetails + "</span> <span class='callerDetail' data-toggle='tooltip' data-placement='right' title='Caller Number'> " + res.CallHistoryReports[i].Source + "</span></td>";
                            callHistory += "<td>" + res.CallHistoryReports[i].RingGroup + "</td>";
                            callHistory += "<td>" + res.CallHistoryReports[i].Skills + "</td>";
                            callHistory += "<td>" + res.CallHistoryReports[i].Agent + "</td>";
                            callHistory += "<td>" + res.CallHistoryReports[i].WaitTime + "</td>";
                            callHistory += "<td>" + res.CallHistoryReports[i].Duration + "</td>";
                            callHistory += "<td>" + res.CallHistoryReports[i].HoldTime + "</td>";
                            callHistory += "<td>" + res.CallHistoryReports[i].Ivr_Studio + "</td>";
                            callHistory += "<td><a class='transferCalls' conferenceCallTypeId= '2,3' callid = '" + res.CallHistoryReports[i].CallId + "'>" + res.CallHistoryReports[i].TransferCalls + "</a></td>";
                            callHistory += "<td><a class='conferenceCalls' conferenceCallTypeId= '4' callid = '" + res.CallHistoryReports[i].CallId + "'>" + res.CallHistoryReports[i].ConferenceCalls + "</a></td>";
                            //callHistory += "<td>" + res.CallHistoryReports[i].Transfers + "</td>";
                            //var clip = "http://localhost:64811/VoiceClips/CMwaitclip_New_04055611.mp3";
                            if (res.CallHistoryReports[i].Recording != "") {
                                callHistory += "<td><audio controls><source src='" + res.CallHistoryReports[i].Recording + "' type='audio/mpeg'></audio></td>";
                            }
                            else {
                                callHistory += "<td></td>";
                            }
                            if (global_RoleId == "2" || global_RoleId == "3") {
                                if (res.CallHistoryReports[i].AgentId != "" && parseInt(res.CallHistoryReports[i].AgentId) > 0) {
                                    // alert(res.CallHistoryReports[i].IsDraft);
                                    if (res.CallHistoryReports[i].IsDraft == 'False') {
                                        callHistory += "<td><a href='/ScoreCard.aspx?CallId=" + res.CallHistoryReports[i].CallId + "&AgentId=" + res.CallHistoryReports[i].AgentId + "' target='_new'>Score Card</a></td>";
                                    } else {
                                        callHistory += "<td><a href='/ScoreCardView.aspx?CallId=" + res.CallHistoryReports[i].CallId + "&AgentId=" + res.CallHistoryReports[i].AgentId + "' target='_new'>Score Card</a></td>";
                                    }
                                } else {
                                    callHistory += "<td> - </td>";
                                }
                            }
                            callHistory += "</tr>";
                            if (callId_ != 0) {
                                $("#spnAgent").html(res.CallHistoryReports[i].Agent);
                                $("#ddlAgent").val(res.CallHistoryReports[i].AgentId);
                                $("#ddlDirection").val(0);
                                $("#spnDirection").html("In Bound");
                                $("#ddlRingGroup").val(res.CallHistoryReports[i].SkillGroupId)
                                $("#spnRingGroup").html(res.CallHistoryReports[i].RingGroup);

                            }

                        }
                    }
                    else {
                        callHistory += "<tr><td colspan='10'>No data found with the selected search criteria</td></tr>";
                        $("#page-selection").hide();
                    }
                } else {
                    callHistory += "<tr><td colspan='10'>No data found with the selected search criteria</td></tr>";
                    $("#page-selection1").hide();
                    $("#page-selection").hide();
                }
                callHistory += "</tbody>";
                $("#tblCallHistory").html(callHistory);
                $('[data-toggle="tooltip"]').tooltip();
            }
            else {
             
              //  alert(res.Message);
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


function ShowRange(totalNo, currentLen) {
    var total = totalNo;
    var first = ((global_pageIndex - 1) * 10) + 1;
    var second = (first + currentLen) - 1;
    if (totalNo != 0){
        $("#pagerange").html("<b>" + first + "-" + second + "</b> of <b>" + total + "</b>");
    }
    else{
        $("#pagerange").html("<b>" + 0 + "-" + 0 + " of " + 0 + "</b>");
    }
}

function pagination(rowCount, global_pageLength) {
    $("#page-selection1").hide();
    $('#page-selection').bootpag({
        total: Math.ceil(rowCount / global_pageLength),
        next: "Next",
        prev: "Prev",
        maxVisible: 8
    }).on("page", function (event, num) {
        if (global_pageIndex != num) {
            
            global_pageIndex = num;
            $("#hdnPageNumber").val(global_pageIndex);
            GetCallHistory()

        }
    });
    if (global_pageIndex == "1") {
        $(".pagination").find("li").removeClass('active');
        $(".pagination").find("li[data-lp='1']").addClass('active');
    }
}

function GetOutBoundHistory() {

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });

   // $("#outboundCallHistoryReports").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");
    var callHistory = "";
    $.ajax({
        url: "Handlers/Calls.ashx",
        type: "POST",
        async: true,
        dataType: "JSON",
        data: {
            type: 15, Date: glbDate, CallType: glblDirection, AgentId: glbAgent, PageSize: global_pageLength, PageNumber: global_pageIndex,
            FromDate: global_FromDate, ToDate: global_ToDate, CbrId: cbrid
        },
        success: function (res) {
            
            if (res.Success == "True") {
             

                // $("#page-selection").show();
                //pagination(res.Total, global_pageLength)
                
              
                if (res.Total > 0) {
                    $("#page-selection1").show();
                    pagination1(res.Total, global_pageLength)
                    if (res.CallHistoryReports.length > 0) {
                       
                        for (var i = 0; res.CallHistoryReports.length > i ; i++) {
                            callHistory += "<tr>";
                            callHistory += "<td><div><img src='Images\\outbound.png' alt='OutBound'></div>" + res.CallHistoryReports[i].TimeStamp + "</td>";
                            callHistory += "<td>" + res.CallHistoryReports[i].FromNumber + "</td>";
                            callHistory += "<td>" + res.CallHistoryReports[i].ToNumber + "</td>";
                            callHistory += "<td>" + res.CallHistoryReports[i].AgentName + "</td>";
                            callHistory += "<td>" + res.CallHistoryReports[i].AccessType + "</td>";
                            if (res.CallHistoryReports[i].RingTime != "") {
                                callHistory += "<td>" + res.CallHistoryReports[i].RingTime + "</td>";
                            } else {
                                callHistory += "<td> - </td>";
                            }
                            if (res.CallHistoryReports[i].AnswerTime != "") {
                                callHistory += "<td>" + res.CallHistoryReports[i].AnswerTime + "</td>";
                            } else {
                                callHistory += "<td> - </td>";
                            }
                            if (res.CallHistoryReports[i].EndTime != "") {
                                callHistory += "<td>" + res.CallHistoryReports[i].EndTime + "</td>";
                            } else {
                                callHistory += "<td> - </td>";
                            }
                            if (res.CallHistoryReports[i].Duration != "") {
                                callHistory += "<td>" + res.CallHistoryReports[i].Duration + "</td>";
                            } else {
                                callHistory += "<td> - </td>";
                            }
                            if (res.CallHistoryReports[i].EndReason != "") {
                                callHistory += "<td>" + res.CallHistoryReports[i].EndReason + "</td>";
                            } else {
                                callHistory += "<td> - </td>";
                            }
                            
                            if (res.CallHistoryReports[i].Recording != "") {
                                callHistory += "<td><audio controls><source src='" + res.CallHistoryReports[i].Recording + "' type='audio/mpeg'></audio></td>";
                               
                            }
                            else {
                                callHistory += "<td> -</td>";
                            }
                            callHistory += "</tr>";
                            if (cbrid != 0) {
                                $("#ddlDirection").val(1);
                                $("#spnDirection").html("Out bound");
                                $("#hdnSkillGroup,#hdnSkills,#inboundButton,#hdnStudio,#div-Call-Type,#tblCallHistory").hide();
                                $("#outboundButton,#tblOutBoundCallHistory").show();
                                
                            }
                        }
                    }
                    else {
                        callHistory += "<tr><td colspan='8'>No Call History Found</td></tr>";
                        $("#page-selection1").hide();
                    }
                } else {
                    callHistory += "<tr><td colspan='8'>No Call History Found</td></tr>";
                    $("#page-selection1").hide();
                    $("#page-selection").hide();

                }
                callHistory += "</tbody>"

                $("#outboundCallHistoryReports").html(callHistory);
                $('[data-toggle="tooltip"]').tooltip();
            }
            else {
                callHistory += "<tr><td colspan='8'>No Call History Found</td></tr>";
                $("#outboundCallHistoryReports").html(callHistory);
                $("#page-selection1").hide();
                $("#page-selection").hide();

               // alert(res.Message);
            }
            $.unblockUI();
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


function pagination1(rowCount, global_pageLength) {
    $("#page-selection").hide();
    $('#page-selection1').bootpag({
        total: Math.ceil(rowCount / global_pageLength),
        next: "Next",
        prev: "Prev",
        maxVisible: 8
    }).on("page", function (event, num) {
        if (global_pageIndex != num) {
            global_pageIndex = num;
            GetOutBoundHistory();

        }
    });
    if (global_pageIndex == "1") {
        $(".pagination").find("li").removeClass('active');
        $(".pagination").find("li[data-lp='1']").addClass('active');
    }
}