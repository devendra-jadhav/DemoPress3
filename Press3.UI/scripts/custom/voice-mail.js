var global_agentsList = [];
var global_pageLength = 10, global_pageIndex = 1;
var roleid = $("#hdnRoleId").val();


$(document).ready(function () {

    if (roleid != 1) {
        $("#divAssignStatus").show();
        $("#divSelectAgent").show();
    }

    getAgents();
    getSkillGroups();
    getVoiceMails();

    $('#txt-caller-details').on('keyup', function (e) {
        if (this.value == "") {
            $("#btn-search").click();
            e.preventDefault();
        }
    });
    $("#ddlIvrStudio").change(function () {
        global_pageLength = 10, global_pageIndex = 1;
      //  getVoiceMails();
    });
    $("#selectAgent").change(function () {
        global_pageLength = 10, global_pageIndex = 1;
      //  getVoiceMails();
    });
    $("#selectSkillGroup").change(function () {
        global_pageLength = 10, global_pageIndex = 1;
       // getVoiceMails();
    });
    $("#sel-assign-status").change(function () {
        global_pageLength = 10, global_pageIndex = 1;
       // getVoiceMails();
    });
    $('#txtDatefilter').daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });
    $(document).delegate(".applyBtn", "click", function () {
        global_pageLength = 10, global_pageIndex = 1;
       // getVoiceMails();
    });
    $(document).delegate(".cancelBtn", "click", function () {
        $("#txtDatefilter").val("");
        global_pageLength = 10, global_pageIndex = 1;
      //  getVoiceMails();
    });
    $("#btn-search").click(function () {
        getVoiceMails();
    });
    $('#txt-caller-details').keypress(function (e) {
        if (e.which == 13) {
            e.preventDefault();
            getVoiceMails();
        }
    });
    $(document).delegate(".sel-assignee", "change", function () {
        var selVoiceMailId = $(this).attr("voiceMailId");
        var selAssignee = $(this).find("option:selected").val();
        // if (selAssignee != "" && parseInt(selAssignee) > 0) {
        assignAgentToVoiceMail(selVoiceMailId, selAssignee);
        // }
    });

    $("#btnGetReports").click(function () {

        getVoiceMails();

    });
});


function getAgents() {
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
        data: { type: 7 },
        success: function (res) {
            $.unblockUI();
            var agentsList = "";
            agentsList += "<option value='0'>All Agents</option>";
            if (res.Success == "True") {
                if (res.AgentDetails.length > 0) {
                    for (var i = 0; i < res.AgentDetails.length; i++) {
                        agentsList += "<option value='" + res.AgentDetails[i].Id + "'>" + res.AgentDetails[i].Name + "</option>";
                        global_agentsList.push({ "AgentId": res.AgentDetails[i].Id, "AgentName": res.AgentDetails[i].Name });
                    }
                } else {
                    console.log(res.Message);
                }
            } else {
                console.log(res.Message);
            }
            $("#selectAgent").html(agentsList);
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
function getSkillGroups() {
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
        async: true,
        data: { type: 9 },
        success: function (res) {
            $.unblockUI();
            var skillGroupList = "";
            skillGroupList += "<option value='0'>All Skillgroups</option>";
            var ivrstudio = "<option value='0' >Select</option>";
            if (res.Success == "True") {
                if (res.SkillGroups.length > 0) {
                    for (var i = 0; i < res.SkillGroups.length; i++) {
                        skillGroupList += "<option value='" + res.SkillGroups[i].Id + "'>" + res.SkillGroups[i].Name + "</option>";
                    }
                }
                if (res.Ivr_Studios.length > 0) {
                    for (var i = 0; i < res.Ivr_Studios.length; i++) {
                        ivrstudio += "<option value='" + res.Ivr_Studios[i].Id + "'>" + res.Ivr_Studios[i].Name + "</option>";
                    }
                }
                        
              
            } else {
                console.log(res.Message);
            }
                $("#selectSkillGroup").html(skillGroupList);
                $("#ddlIvrStudio").html(ivrstudio);
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
function getVoiceMails() {


    var isCallerDetails = 0;
    var skillGroupId = $("#selectSkillGroup option:selected").val();
    var Studioid = $("#ddlIvrStudio option:selected").val();
    //var assignStatus = $("#sel-assign-status option:selected").val();

    var assignStatus = 1; //1 for assigned voicemails
    var agentId = $("#hdnAgentId").val();


    if (roleid != 1)
    {
        assignStatus = $("#sel-assign-status option:selected").val();
        agentId = $("#selectAgent option:selected").val();

    }

    var dateFilter = $('#txtDatefilter').val();
    var fromDate = "";
    var toDate = "";
    var selecteddate = "";
    if (dateFilter != "") {
        selecteddate = dateFilter.split("-");
        fromDate = selecteddate[0].trim();
        toDate = selecteddate[1].trim();
    }
    var callerDetails = $("#txt-caller-details").val();

    //$("#btnGetReports").attr("disabled", true);

    //$("#tbody-voice-mails").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");

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
        async: true,
        data: {
            type: 34, skillGroupId: skillGroupId, assignStatus: assignStatus, agentId: agentId, fromDate: fromDate,
            toDate: toDate, callerDetails: callerDetails, index: global_pageIndex, length: global_pageLength, StudioId: Studioid
        },
        success: function (res) {
            $.unblockUI();
           // $("#btnGetReports").attr("disabled", false);
            var voiceMails = "";
            if (res.Success == "True") {
                if (res.Total > 0) {
                    $("#page-selection").show();
                    $("#recordscount").show();
                    pagination(res.Total, global_pageLength)
                    if (res.VoiceMails.length > 0) {

                        if (roleid == 1) {
                            voiceMails += "<thead><tr><th>Date &amp; Time</th><th>IVR-Studio</th><th>Caller Name</th><th>Caller Number</th><th>Skill Group</th><th>Clip</th></tr></thead>";
                        }
                        else {
                            voiceMails += "<thead><tr><th>Date &amp; Time</th><th>IVR-Studio</th><th>Caller Name</th><th>Caller Number</th><th>Skill Group</th><th>Agent</th><th>Clip</th></tr></thead>";
                            
                        }

                        voiceMails += "<tbody>";
                        for (var i = 0; i < res.VoiceMails.length; i++) {
                            voiceMails += "<tr>";
                            voiceMails += "<td>" + res.VoiceMails[i].CreatedTime + "</td>"; 
                            voiceMails += "<td>" + res.VoiceMails[i].StudioName + "</td>";
                            voiceMails += "<td>" + res.VoiceMails[i].CustomerName + "</td>";
                            voiceMails += "<td><span class='margin-right-10'>" + res.VoiceMails[i].CustomerMobileNumber + "</span><button type='button' class='btn btn-success btn-xs'><i class='fa fa-phone margin-right-5'></i> Call</button></td>";
                            voiceMails += "<td><label class='label_round_blue'>" + res.VoiceMails[i].SkillGroup + "</label></td>";

                            if (roleid != 1) {
                                voiceMails += "<td><select class='sel-assignee' style='padding:5px; border:1px solid #ddd; background:#F9F9F9;' voiceMailId='" + res.VoiceMails[i].VoiceMailId + "'>" + setAgent(res.VoiceMails[i].AgentId) + "</select></td>";
                            }
                            if (res.VoiceMails[i].RecordedURL != "") {
                                voiceMails += "<td><audio controls><source src='" + res.VoiceMails[i].RecordedURL + "' type='audio/mpeg'></audio></td>";
                            } else {
                                voiceMails += "<td> - </td>";
                            }
                            voiceMails += "</tr>";
                        }

                        voiceMails += " </tbody>";
                        $("#tbody-voice-mails").html(voiceMails);
                      
                        if (res.Total >= global_pageLength) {
                            var fromnumber = (global_pageIndex > 1 ? ((global_pageIndex - 1) * global_pageLength) + 1 : 1);
                            var tonumber = (global_pageIndex * global_pageLength >= res.Total ? res.Total : global_pageIndex * global_pageLength);

                          
                            $("#fromnumber").html(fromnumber);
                            $("#tonumber").html(tonumber);
                            $("#totalnumber").html(res.Total);

                        }
                        else {
                            $("#fromnumber").html("1");
                            $("#tonumber").html(res.Total);
                            $("#totalnumber").html(res.Total);

                        }
                    } else {
                        $("#tbody-voice-mails").html("<tr><td colspan='6' class='text-center'>No Voicemails found</td></tr>");
                        $("#page-selection").hide();
                        $("#recordscount").hide();
                        
                    }
                } else {
                    $("#tbody-voice-mails").html("<tr><td colspan='6' class='text-center'>No Voicemails found</td></tr>");
                    $("#page-selection").hide();
                    $("#recordscount").hide();
                }
            } else {
                $("#tbody-voice-mails").html("<tr><td colspan='6' class='text-center'>No Voicemails found</td></tr>");
                $("#page-selection").hide();
                $("#recordscount").hide();
            }
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#tbody-voice-mails").html("<tr><td colspan='6' class='text-center'>No Voicemails found</td></tr>");
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
            getVoiceMails();
        }
    });
}
function setAgent(agentId) {
    var agentsList = "";
    if (agentId == 0) {
        agentsList += "<option value=0 selected='true'>Not Assigned</option>";
    }
    else {
        agentsList += "<option value=0>Not Assigned</option>";
    }
    for (var i = 0; i < global_agentsList.length; i++) {
        if (global_agentsList[i].AgentId == parseInt(agentId)) {
            agentsList += "<option value='" + global_agentsList[i].AgentId + "' selected='true' >" + global_agentsList[i].AgentName + "</option>";
        } else {
            agentsList += "<option value='" + global_agentsList[i].AgentId + "' >" + global_agentsList[i].AgentName + "</option>";
        }
    }
    return agentsList;
}

function assignAgentToVoiceMail(voiceMailId, assignedTo) {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "POST",
        url: "Handlers/Manager.ashx",
        dataType: "JSON",
        async: true,
        data: { type: 35, voiceMailId: voiceMailId, assignedTo: assignedTo },
        success: function (res) {
            if (res.Success == "True") {
                if (parseInt(assignedTo) == 0) {
                    $("#popup-body").html("Voice mail is not assigned to any agent");
                }
                else {
                    $("#popup-body").html("Voice mail is assigned to the agent");
                }
                $("#cnfm-popup").modal("show");
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