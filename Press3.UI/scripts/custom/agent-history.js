var global_DurationType = $("#selectDuration option:selected").val();
var global_AgentId = $("#selectAgent option:selected").val();
var global_SkillGroupId = $("#selectSkillGroup option:selected").val();
var global_Rating = $("#selectRating").val();
var global_DateFilter = $('#txtDatefilter').val();
var global_FromDate = '';
var global_ToDate = '';
var global_Selecteddate = "";
var global_pageLength = 7, global_pageIndex = 1;

$(document).ready(function () {
    $("#selectDuration").val("1");
    getAgents();
    getSkillGroups();
    getAgentsHistory();
    $("#selectDuration").change(function () {
        global_pageLength = 7, global_pageIndex = 1;
        var durationOption = $(this).find('option:selected').text();
        $('#sel_txt').text(durationOption);
        if ($(this).find('option:selected').val() == 4) {
            $("#txtDatefilter").val("");
            $("#txtDatefilter").show();
        }
        else {
            $("#txtDatefilter").hide();
           // getAgentsHistory();
        }
    });
    $("#selectAgent").change(function () {
        global_pageLength = 7, global_pageIndex = 1;
        var option = $(this).find('option:selected').text();
        $('#age_txt').text(option);
       // getAgentsHistory();
    });

    $("#selectSkillGroup").change(function () {
        global_pageLength = 7, global_pageIndex = 1;
        var option = $(this).find('option:selected').text();
        $('#grp_txt').text(option);
       // getAgentsHistory();
    });
    $("#selectRating").change(function () {
        global_pageLength = 7, global_pageIndex = 1;
        var option = $(this).find('option:selected').text();
        $('#rate_txt').text(option);
       // getAgentsHistory();
    });
    $('#txtDatefilter').daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        },
        maxDate: new Date()
    });
    $(document).delegate(".applyBtn", "click", function () {
        global_pageLength = 7, global_pageIndex = 1;
      //  getAgentsHistory();
    });
    $(document).delegate(".cancelBtn", "click", function () {
        global_pageLength = 7, global_pageIndex = 1;
        $("#txtDatefilter").val("");
    });


    $("#btnGetReports").click(function () {
       
        getAgentsHistory();

    });
});








//function setInputFields() {
//    global_DurationType = $("#selectDuration option:selected").val();
//    global_AgentId = $("#selectAgent option:selected").val();
//    global_SkillGroupId = $("#selectSkillGroup option:selected").val();
//    global_Rating = $("#selectRating").val();
//    global_DateFilter = $('#txtDatefilter').val();
//    global_FromDate = '';
//    global_ToDate = '';
//    global_Selecteddate = "";
//    if (global_DateFilter != "") {
//        global_Selecteddate = global_DateFilter.split("-");
//        global_FromDate = global_Selecteddate[0].trim();
//        global_ToDate = global_Selecteddate[1].trim();
//    }
//    $("#hdnAgentId").val(global_AgentId);
//    $("#hdnDurationType").val(global_DurationType);
//    $("#hdnFromDate").val(global_FromDate);
//    $("#hdnToDate").val(global_ToDate);
//    $("#hdnSkillGroupId").val(global_SkillGroupId);
//    $("#hdnRating").val(global_Rating);
//    //$("#hdnRating").val(global_Rating);
//}

function getAgentsHistory() {

    

   // $.blockUI({ message: '<h4><img src="/assets/img/ajax-loader.gif" /></h4>' });
    //$("#btnGetReports").attr("disabled", true);
    //$("#divAgentHistory").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");
//    setInputFields();

    global_DurationType = $("#selectDuration option:selected").val();
    global_AgentId = $("#selectAgent option:selected").val();
    global_SkillGroupId = $("#selectSkillGroup option:selected").val();
    global_Rating = $("#selectRating").val();
    global_DateFilter = $('#txtDatefilter').val();
    global_FromDate = '';
    global_ToDate = '';
    global_Selecteddate = "";
    if (global_DateFilter != "") {
        global_Selecteddate = global_DateFilter.split("-");
        global_FromDate = global_Selecteddate[0].trim();
        global_ToDate = global_Selecteddate[1].trim();
    }
    $("#hdnAgentId").val(global_AgentId);
    $("#hdnDurationType").val(global_DurationType);
    $("#hdnFromDate").val(global_FromDate);
    $("#hdnToDate").val(global_ToDate);
    $("#hdnSkillGroupId").val(global_SkillGroupId);
    $("#hdnRating").val(global_Rating);
    $("#hdnPageNumber").val(global_pageIndex);
    //  alert(global_DurationType);

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
        data: { type: 8, agentId: global_AgentId, durationType: global_DurationType, skillGroupId: global_SkillGroupId, rating: global_Rating, fromDate: global_FromDate, toDate: global_ToDate,length : global_pageLength ,index : global_pageIndex },
        success: function (res) {

            $.unblockUI();

           // $("#btnGetReports").attr("disabled", false);
            var resHtml = "";
            if (res.Success == "True") {
                if (res.Total > 0) {
                    $("#page-selection").show();
                    $("#recordscount").show();
                    pagination(res.Total, global_pageLength)
                    if (res.AgentHistory.length > 0) {
                        resHtml += "<table class='table agent_report table-striped text-center table-bordered'>";
                        resHtml += "<tr><th style='width:450px !important;'>Agent Name</th>";
                        resHtml += "<th>Skill Group(s)</th><th>Logged In <span class='blocked'>HH:MM:SS</span></th>";
                        resHtml += "<th>Available <span class='blocked'>HH:MM:SS(%)</span></th>";
                        resHtml += "<th>In Break <span class='blocked'>HH:MM:SS(%)</span></th>";
                        resHtml += "<th>Idle <span class='blocked'>HH:MM:SS(%)</span></th>";
                        resHtml += "<th>OWA <span class='blocked'>HH:MM:SS(%)</span></th>";
                        resHtml += "<th>On Call <span class='blocked'>HH:MM:SS(%)</span></th>";
                        resHtml += "<th>ACW <span class='blocked'>HH:MM:SS(%)</span></th>";
                        resHtml += "<th>Total Calls</th><th>Service Level<br>(%)</th><th>Avg Speed of Answer <span class='blocked'>HH:MM:SS</span></th>";
                        resHtml += "<th>Avg Talktime <span class='blocked'>HH:MM:SS</span> </th><th>Avg Handle Time <span class='blocked'>HH:MM:SS</span></th><th>Rating</th></tr>";
                        for (var i = 0; i < res.AgentHistory.length; i++) {
                            resHtml += "<tr>";
                            resHtml += "<td><a class='btn-link' target='_new' href='/AgentProfile.aspx?AgentId=" + res.AgentHistory[i].AgentId + "'>" + res.AgentHistory[i].AgentName + "</a></td><td>" + res.AgentHistory[i].SkillGroups + "</td>";
                            resHtml += "<td>" + res.AgentHistory[i].LoggedInHrs + "</td><td class='font-green'>" + res.AgentHistory[i].AvailableTimeInHrs + "</td>";
                            resHtml += "<td class='font-yellow-gold'>" + res.AgentHistory[i].InBreakTimeInHrs + "</td><td>" + res.AgentHistory[i].IdleTimeInHrs + "</td>";
                            resHtml += "<td>" + res.AgentHistory[i].OWATimeInHrs + "</td><td>" + res.AgentHistory[i].OnCallTimeInHrs + "</td><td>" + res.AgentHistory[i].ACWTimeInHrs + "</td>";
                            resHtml += "<td class='bold'>" + res.AgentHistory[i].TotalCalls + "</td><td>" + res.AgentHistory[i].CurrentSLA + "</td>";
                            resHtml += "<td>" + res.AgentHistory[i].SpeedOfAnswer + "</td><td>" + res.AgentHistory[i].TalkTime + "</td>";
                            resHtml += "<td>" + res.AgentHistory[i].HandleTime + "</td>";
                            resHtml += "<td>" + res.AgentHistory[i].Rating + "</td>"
                            resHtml += "</tr>";
                        }
                        resHtml += "</table>";
                        $("#DownloadExcelReports").show();
                    } else {
                        resHtml += "<p style='text-align:center;margin-top:10px;'> Agent History not available</p>";
                        $("#page-selection, #DownloadExcelReports").hide();
                        $("#recordscount").hide();
                    }
                } else {
                    resHtml += "<p style='text-align:center;margin-top:10px;'> Agent History not available</p>";
                    $("#page-selection, #DownloadExcelReports").hide();
                    $("#recordscount").hide();
                }
                if (res.Total >= global_pageLength) {
                    var fromnumber = (global_pageIndex > 1 ? ((global_pageIndex - 1) * global_pageLength) + 1 : 1);
                    var tonumber = (global_pageIndex * global_pageLength >= res.Total ? res.Total : global_pageIndex * global_pageLength);

                    var total = res.Total;
                    $("#fromnumber").html(fromnumber);
                    $("#tonumber").html(tonumber);
                    $("#totalnumber").html(total);

                }
                else {
                    $("#fromnumber").html("1");
                    $("#tonumber").html(res.Total);
                    $("#totalnumber").html(res.Total);

                }
            } else {
                resHtml += "<p style='text-align:center;margin-top:10px;'> Agent History not available</p>";
                $("#page-selection, #DownloadExcelReports").hide();
                $("#recordscount").hide();
            }
            $("#divAgentHistory").html(resHtml);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#divAgentHistory").html("<p style='text-align:center;margin-top:10px;'> Agent History not available</p>");
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
            $("#hdnPageNumber").val(global_pageIndex);
            getAgentsHistory(global_AgentId, global_DurationType, global_SkillGroupId, global_Rating, global_FromDate, global_ToDate, global_pageLength, global_pageIndex)
          
        }
    });
}
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
            agentsList += "<option value='0'>All</option>";
            if (res.Success == "True") {
                if (res.AgentDetails.length > 0) {
                    for (var i = 0; i < res.AgentDetails.length; i++) {
                        agentsList += "<option value='" + res.AgentDetails[i].Id + "'>" + res.AgentDetails[i].Name + "</option>";
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
        async: false,
        data: { type: 9 },
        success: function (res) {

            $.unblockUI();
            var skillGroupList = "";
            skillGroupList += "<option value='0'>All</option>";
            if (res.Success == "True") {
                if (res.SkillGroups.length > 0) {
                    for (var i = 0; i < res.SkillGroups.length; i++) {
                        skillGroupList += "<option value='" + res.SkillGroups[i].Id + "'>" + res.SkillGroups[i].Name + "</option>";
                    }
                } else {
                    console.log(res.Message);
                }
            } else {
                console.log(res.Message);
            }
            $("#selectSkillGroup").html(skillGroupList);
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