var glbDate; var global_pageIndex = 1; var global_pageLength = 10;

$(document).ready(function () {
    glbDate='Today';
    $("#ddlAgent").val(0);
    $("#ddlCallType").val(0);
    $("#ddlCallDirection").val(0);
    $("#ddlCallEndStatus").val(0);
    $("#ddlDate").val(0);
    $("#ddlIVR_studo").val(0);
    $('#spnDateText').text('Today')
    GetSearchInformation(0, "AgentsAndSkillGroups");
    GetCallAbandenedHistory("Today");
    $("#To_Timepicker").hide();
    $("#from_Timepicker").hide();
    $("#txtDateFrom").datepicker();
    $("#txtDateTo").datepicker();
    $("#txtDateFrom").val("");
    $("#txtDateTo").val("");
});
$("#ddlDate").change(function () {
    if ($('#ddlDate').val() == 4)
    {
        glbDate = $("#ddlDate option:selected").text();
        $('#spnDateText').text('Date Range');
        $("#To_Timepicker").show();
        $("#from_Timepicker").show();
        global_pageIndex = 1;
    }
    else {
        glbDate = $("#ddlDate option:selected").text();

        $("#spnDateText").html($("#ddlDate option:selected").text());
        $("#To_Timepicker").hide();
        $("#from_Timepicker").hide();
        global_pageIndex = 1;
    }
});
$("#ddlIVR_studo").change(function () {

    $("#SpanIVR_studio").html($("#ddlIVR_studo option:selected").text());
    global_pageIndex = 1;


});

$('#btnGetReports').click(function () {
    global_pageIndex = 1;
    GetCallAbandenedHistory(glbDate);
});
$("#ddlAgent").change(function () {

    $("#spnAgent").html($("#ddlAgent option:selected").text());
    global_pageIndex = 1;

});
$("#ddlCallType").change(function () {
    $("#spnCallType").html($("#ddlCallType option:selected").text());
    global_pageIndex = 1;


});
$("#ddlRingGroup").change(function () {

    $("#spnRingGroup").html($("#ddlRingGroup option:selected").text());
    global_pageIndex = 1;
  

});
//$("#ddlCallDirection").change(function () {
//    $("#spnCallDirection").html($("#ddlCallDirection option:selected").text());


//});
$("#ddlCallEndStatus").change(function () {
    $("#spnCallEndStatus").html($("#ddlCallEndStatus option:selected").text());
    global_pageIndex = 1;

});
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
        async: false,
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
                    var IVR_studio = "<option value='0'>Select</option>";

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
                            IVR_studio += "<option value='" + res.Ivr_Studio_Name[i].Id + "'>" + res.Ivr_Studio_Name[i].Name + "</option>"
                        }
                    }
                    $("#ddlAgent").html(agents);
                    $("#ddlRingGroup").html(skillGroups);
                    $("#ddlIVR_studo").html(IVR_studio);
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

function GetCallAbandenedHistory(glbDate) {

  
    //$("#tblCallHistory").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");
    //$("#btnGetReports").attr("disabled", true);

    

    var date_ = glbDate;
    var CallDirection_ = 0;//$("#ddlCallDirection").val();
    var CallType_ = ($("#ddlCallType").val() == 0) ? 0 : $("#ddlCallType").val();
    var CallEndStatus_ = ($("#ddlCallEndStatus").val() == 0) ? 0 : $("#ddlCallEndStatus").val();
    var RingGroup_ = ($("#ddlRingGroup").val()==0)?0:$("#ddlRingGroup").val();
    var IVR_StudioId_ = ($("#ddlIVR_studo").val() == 0) ? 0 : $("#ddlIVR_studo").val();
    var Agent_ = ($("#ddlAgent").val() == 0) ? 0 : $("#ddlAgent").val();
    if ($("#ddlDate").val() != 4) {
      FromDate_ = '';
      ToDate_ = '';
    }
    else {
        glbdate_ = '';
        var FromDate_ = $("#txtDateFrom").val();
       
        var ToDate_ = $("#txtDateTo").val();
    }
    $("#hdnDate").val(date_);
    $("#hdnCallType").val(CallType_);
    $("#hdnAgent").val(Agent_);
    $("#hdnRingGroup").val(RingGroup_);
    $("#hdnFromDate").val(FromDate_);
    $("#hdnToDate").val(ToDate_);
    $("#hdnCallDirection").val(CallDirection_);
    $("#hdnCallEndStatus").val(CallEndStatus_);  
    $("#hdnPageNumber").val(global_pageIndex);
    $("#hdnPageSize").val(global_pageLength);
    $("#hdnStudioId").val(IVR_StudioId_);

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
        $.ajax({
            url: "Handlers/calls.ashx",
            type: "POST",
            async: true,
            dataType: "JSON",
            data: { 
                type: 14, Date: date_, CallDirection: CallDirection_, CallType: CallType_, CallEndStatus: CallEndStatus_, AgentId: Agent_, SkillGroupId: RingGroup_, FromDate: FromDate_, ToDate: ToDate_, PageNumber: global_pageIndex,PageSize:global_pageLength,StudioId: IVR_StudioId_
            },
            success: function (res) {
                $.unblockUI();

              //  $("#btnGetReports").attr("disabled", false);
                if (res.Success == "True") {
                    var resHtml = "",i,j, value="";
                    resHtml += "<tbody><tr><th>Call Received Time</th><th>IVR-Studio</th><th>Call Type</th><th>Call End Status</th><th>End Time</th><th>Call Direction</th>";
                    resHtml += "<th colspan='2'>Caller Details</th><th>Skill Group</th><th>Missed Agents</th><th>Answered Agents</th></tr>";
                    if (res.Abandonedcalldetails.length > 0)
                    {
                       

                        for (i = 0; i < res.Abandonedcalldetails.length; i++) {
                            {
                                resHtml += "<tr>";
                                resHtml += "<td>" + res.Abandonedcalldetails[i].CallReceivedTime + "</td>";
                                resHtml += "<td>" + res.Abandonedcalldetails[i].StudioName + "</td>";
                                resHtml += "<td>" + res.Abandonedcalldetails[i].CallType + "</td>";
                                resHtml += "<td>" + res.Abandonedcalldetails[i].CallEndStatus + "</td>";

                                resHtml += (res.Abandonedcalldetails[i].EndTime == '' ) ? "<td>-</td>" : ("<td>" + res.Abandonedcalldetails[i].EndTime +  " (" + res.Abandonedcalldetails[i].TimeDifference + " Secs)</td>");
                                resHtml += (res.Abandonedcalldetails[i].CallDirection == 0) ? "<td>In Bound</td>" : "<td>Ou tBound</td>";
                                if (res.Abandonedcalldetails[i].callerDetails == "" && res.Abandonedcalldetails[i].CallerNumber=="")
                                    resHtml += "<td colspan='2'>" + res.Abandonedcalldetails[i].source + "</td> "
                                else {
                                    resHtml += "<td>" + res.Abandonedcalldetails[i].callerDetails + "</td> "
                                    resHtml += "<td>" + res.Abandonedcalldetails[i].CallerNumber + "</td> "

                                }
                                resHtml += (res.Abandonedcalldetails[i].skillGroup != "") ? "<td>" + res.Abandonedcalldetails[i].skillGroup + "</td><td>" : "<td>-</td><td>";
                                if (res.Abandonedcalldetails[i].CallType == 'Missed') {
                                    var count = 0;
                                    for (j = 0; j < res.AgentsAssigned.length; j++) {
                                        if (res.AgentsAssigned[j].callid == res.Abandonedcalldetails[i].callId) 
                                            { 
                                            if (res.AgentsAssigned[j].AgentName == res.Abandonedcalldetails[i].AgentName  )
                                            {
                                                if (res.AgentsAssigned[j].AssignedCount > 1)
                                                { value = +(res.AgentsAssigned[j].AssignedCount - 1); }
                                                else {
                                                    break;
                                                }
                                            }
                                            else
                                            {
                                                value = +res.AgentsAssigned[j].AssignedCount;
                                            }
                                            resHtml +=  res.AgentsAssigned[j].AgentName + "("+value+ ") , "
                                            count++;
                                        }

                                        value = 0;
                                    }

                                    if (count == 0) {
                                        if (res.Abandonedcalldetails[i].CallEndStatus == 'Abandoned') {
                                            resHtml += (res.Abandonedcalldetails[i].AgentName == '') ? "-" : res.Abandonedcalldetails[i].AgentName + "(1)";
                                        }
                                        else {
                                            resHtml += "-";
                                        }
                                        }
                                    else {
                                        resHtml = resHtml.slice(0, -3);
                                    }
                                }
                                else { resHtml+= "-" }
                                resHtml += (res.Abandonedcalldetails[i].CallEndStatus == 'Answered') ? "</td><td><label><a  href='CallHistory.aspx?callId=" + res.Abandonedcalldetails[i].callId + "'> " + res.Abandonedcalldetails[i].AgentName + "</a><Label></td>" : "</td><td>-</td>"
                                resHtml += "</tr>"

                            }


                        }
                        if (res.Total > 0) {
                            $("#page-selection").show();
                            pagination(res.Total, global_pageLength)
                            $("#recordscount").show();
                        }
                        if (res.Total >= global_pageLength) {
                            var fromnumber = (global_pageIndex > 1 ? ((global_pageIndex-1) * global_pageLength) + 1 : 1);
                            var tonumber = (global_pageIndex * global_pageLength>=res.Total?res.Total:global_pageIndex * global_pageLength);
                            
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
                        
                    }

                    else
                    {
                        resHtml += "<tr><td colspan='10'>No Records Found</td></tr>";
                        $("#page-selection").hide();
                        $("#recordscount").hide();
                    }
                    resHtml += "</tbody>";
                    $("#tblCallHistory").html(resHtml);
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
            GetCallAbandenedHistory(glbDate);

        }
    });
    if (global_pageIndex == "1") {
        $(".pagination").find("li").removeClass('active');
        $(".pagination").find("li[data-lp='1']").addClass('active');
    }
}