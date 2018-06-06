var global_AgentId = $("#hdnAgentId").val();
var global_RoleId = $("#hdnRoleId").val();
var global_pageLength = 6, global_pageIndex = 1;

$(document).ready(function () {

    $("#selAgents").change(function () {
        global_pageLength = 6, global_pageIndex = 1;
        //  getCallEvaluationReports();
    });
    $("#txtDatefilter").daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });
    $(document).delegate(".applyBtn", "click", function () {
        global_pageLength = 6, global_pageIndex = 1;
        //  getCallEvaluationReports();
    });
    $(document).delegate(".cancelBtn", "click", function () {
        $("#txtDatefilter").val("");
        global_pageLength = 6, global_pageIndex = 1;
        //  getCallEvaluationReports();
    });

    $("#btnGetReports").click(function () {

        getCallEvaluationReports();

    });

    getAgents();
    getCallEvaluationReports();

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
        async: true,
        data: { type: 7 },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (res.Success == "True") {
                resHtml += "<option value='0'>All</option>";
                if (res.AgentDetails.length > 0) {
                    for (var i = 0; i < res.AgentDetails.length; i++) {
                        resHtml += "<option value='"+ res.AgentDetails[i].Id +"'>"+ res.AgentDetails[i].Name +"</option>";
                    }
                    $("#selAgents").html(resHtml);
                } else {
                    $("#selAgents").html("<option value='0'>No Agents</option>");
                }
            } else {
                $("#selAgents").html("<option value='0'>No Agents</option>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#selAgents").html("<option value='0'>No Agents</option>");
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

function getCallEvaluationReports() {

    //$("#btnGetReports").attr("disabled", true);
    //$("#callEvaluationReports").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");

    var dateFilter = "", agentId = 0;
    if ($('#selAgents').length > 0) {
        agentId = $("#selAgents option:selected").val();
    } else {
        agentId = global_AgentId;
    }
    if ($('#txtDatefilter').length > 0) {
        dateFilter = $('#txtDatefilter').val();
    }
    var fromDate = '';
    var toDate = '';
    var selecteddate = "";
    if (dateFilter != "") {
        selecteddate = dateFilter.split("-");
        fromDate = selecteddate[0].trim();
        toDate = selecteddate[1].trim();
    }


    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Scorecards.ashx",
        dataType: "JSON",
        async: true,
        data: { type: 13, agentId: agentId, fromDate: fromDate, toDate: toDate, index: global_pageIndex, lenght: global_pageLength },
        success: function (res) {
            $.unblockUI();
           $("#btnGetReports").attr("disabled", false);
            var resHtml = "";
            if (res.Success == "True") {
                if (res.Total > 0) {
                    $("#page-selection").show();
                    $("#recordscount").show();
                    pagination(res.Total, global_pageLength)
                    if (res.Reports.length > 0) {
                        for (var i = 0; i < res.Reports.length; i++) {
                            resHtml += "<tr><td>" + res.Reports[i].ScoredTime + "</td>";
                            resHtml += "<td>" + res.Reports[i].ScoredByName + "</td>";
                            resHtml += "<td>" + res.Reports[i].AgentName + "</td>";



                       

                            resHtml += "<td><label class='txt-lite-grey f_12 bold-6'>" + res.Reports[i].SkillGroup + "</label></td>";


                            resHtml += "<td>" + res.Reports[i].CallerNumber + "</td>";

                            resHtml += "<td>" + res.Reports[i].CallTime + "</td>";

                            if (res.Reports[i].RecordingURL == "") { resHtml += "<td class='col-sm-3 text-center'>-</td>"; }

                            else { resHtml += "<td class='col-sm-3'><audio controls><source src='" + res.Reports[i].RecordingURL + "' type='audio/mpeg'></audio></td>"; }

                         

                            resHtml += "<td>" + res.Reports[i].TotalQuestions + "</td>";
                            resHtml += "<td>" + res.Reports[i].PositiveCount + "</td>";
                            resHtml += "<td>" + res.Reports[i].NegativeCount + "</td>";
                            resHtml += "<td>" + res.Reports[i].TotalScore + "</td>";
                            resHtml += "<td>" + res.Reports[i].Rating + "</td>";
                            if (res.Reports[i].Comments == "") { resHtml += "<td class='text-center'>-</td>"; }
                            else { resHtml += "<td>" + res.Reports[i].Comments + "</td>"; }
                            if (global_RoleId == "1") {
                                resHtml += "<td><a href='/ScoreCardView.aspx?CallId=" + res.Reports[i].CallId + "&AgentId=" + res.Reports[i].AgentId + "' target='_new'>View</a></td></tr>";
                            } else {
                                if (res.Reports[i].IsDraft == "True") {
                                    resHtml += "<td><a href='/ScoreCard.aspx?CallId=" + res.Reports[i].CallId + "&AgentId=" + res.Reports[i].AgentId + "' target='_new'>Resume</a></td></tr>";
                                } else {
                                    resHtml += "<td><a href='/ScoreCardView.aspx?CallId=" + res.Reports[i].CallId + "&AgentId=" + res.Reports[i].AgentId + "' target='_new'>View</a></td></tr>";
                                }
                            }
                        }
                        $("#callEvaluationReports").html(resHtml);
                    } else {
                        $("#callEvaluationReports").html("<tr><td colspan='14' class='text-center'>No Reports</td></tr>");
                        $("#page-selection").hide();
                        $("#recordscount").hide();
                    }
                }
                else {
                    $("#callEvaluationReports").html("<tr><td colspan='14' class='text-center'>No Reports</td></tr>");
                    $("#page-selection").hide();
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
                $("#callEvaluationReports").html("<tr><td colspan='14' class='text-center'>" + res.Message + "</td></tr>");
                $("#page-selection").hide();
                $("#recordscount").hide();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#callEvaluationReports").html("<tr><td colspan='14' class='text-center'>No Reports</td></tr>");
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
           // alert(global_pageIndex);
            getCallEvaluationReports();
          
        }
    });
}