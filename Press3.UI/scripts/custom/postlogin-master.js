var roleId = $("#hdnRoleId").val();
var AgentAvailableStatusId = 0;
var AgentLogInStatus = '';
var AgentCallStatus = '';
var sec = 0;
var min = 0;
var myTimer = 0;
var IsRole = 0;
var currentPage = window.location.href;
var timer;
var lastPathSegment = currentPage.substr(currentPage.lastIndexOf('/') + 1);
var presentStatus = "";
var agentId = $("#hdnAgentId").val();
var IsReg = 0;

//getAgentStatuses(null);
//getAgentStatuses();
//if (roleId == "1") {
if(lastPathSegment.lastIndexOf('?') > 0)
{
    lastPathSegment= lastPathSegment.substr(0,lastPathSegment.lastIndexOf('?'));
}
$(".showforAgent").show();

if (lastPathSegment == "AgentHome.aspx" || lastPathSegment == "ManagerDashboard.aspx" || lastPathSegment == "SupervisorDashboard.aspx") {
    $(".li").removeClass("start active open");
    $("#SideBarToggle1").addClass("start active open");
}
if (lastPathSegment == "TicketManagement.aspx") {
    $(".li").removeClass("start active open");
    if (roleId == 4) { $("#SideBarToggle1").addClass("start active open"); }
    else { $("#SideBarToggle2").addClass("start active open"); }
}

else if (lastPathSegment == "CallHistory.aspx" || (lastPathSegment == "CallAbandonedHistory.aspx" || lastPathSegment == "AgentHistory.aspx")) {
    $(".li").removeClass("start active open");
    $("#SideBarToggle2").addClass("start active open");
}





else if (lastPathSegment == "MyCallBackRequests.aspx" || (lastPathSegment == "VoiceMails.aspx" || lastPathSegment == "AgentCallEvaluationReport.aspx")) {

    $(".li").removeClass("start active open");
    $("#SideBarToggle2").addClass("start active open");
}
else if (lastPathSegment == "AgentCallEvaluationReport.aspx" || lastPathSegment == "ScoreCardView.aspx") {
    $(".li").removeClass("start active open");
    $("#SideBarToggle2").addClass("start active open");}
else if (lastPathSegment == "CallBackRequests.aspx" || lastPathSegment == "CallcenterPerformanceReports.aspx" || lastPathSegment == "AgentPerformance.aspx" || lastPathSegment == "TicketsOverview.aspx") {
    $(".li").removeClass("start active open");
    $("#SideBarToggle2").addClass("start active open");
}

else if (lastPathSegment == "Callers.aspx") {
    $(".li").removeClass("start active open");
    $("#SideBarToggle3").addClass("start active open");
}
else if (lastPathSegment == "GeneralSettings.aspx" || (lastPathSegment == "NumberManagement.aspx" || lastPathSegment == "Studios.aspx")) {
    $(".li").removeClass("start active open");
    $("#SideBarToggle4").addClass("start active open");
}

else if (lastPathSegment == "ManageSkills.aspx" || (lastPathSegment == "Scripts.aspx" || (lastPathSegment == "adminScorecards.aspx" || lastPathSegment == "AgentSettings.aspx"))) {
    $(".li").removeClass("start active open");
    $("#SideBarToggle4").addClass("start active open");
}

//else
//{
//    $(".li").removeClass("start active open");
//    $("#SideBarToggle2").addClass("start active open");
//}









$(document).on('click', 'a', function (e) {
    if (lastPathSegment.toLowerCase().indexOf("agenthome") == 0) {
        if ($(this).attr("class").indexOf("ticketDetails") < 0 && $(this).attr("class").indexOf("dropdown-toggle") < 0 && $(this).attr("class").indexOf("logout_modal") < 0) {
            var redirectPage;
            e.preventDefault();
            var url = $(this).attr('href');

            if (typeof url != "undefined") {
                redirectPage = url.substr(url.lastIndexOf('/') + 1);
            }
            //if (lastPathSegment == 'AgentHome.aspx') {
            if (redirectPage != 'javascript:;') {
                if (redirectPage != lastPathSegment) {

                    if (typeof redirectPage != "undefined")
                        window.open(url, '_blank');
                }
            } else {
                e.preventDefault();
            }
            //} else {
            //    window.open(url, '_self');
            //}
        }
    }
});


$(document).keydown(function (e) {
    var element = e.target.nodeName.toLowerCase();
    if (element != 'input' && element != 'textarea' && element != 'div') {
        if (e.keyCode === 8) {
            return false;
        }
    }
});
$(document).delegate(".status_agent", "click", function () {
    var status = $(this).attr("status");
    var labelColorCode = $(this).attr("labelcolorcode");
    var textColorCode = $(this).attr("textcolorcode");

    $.ajax({
        type: "GET",
        url: "Handlers/Agents.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 4, status: status },
        success: function (res) {
            if (res.Success == "True") {
                $("#spanAgentStatus").text(status).attr("style", "position: absolute; left: 61px; font-size: 11px; top: 36px; background: " + labelColorCode + "; font-weight: 600; color: " + textColorCode + "");
                if (status == "Ready") {
                    LoginVerto();
                    GetAgentScriptsAndCallSummary();
                }
                //if (status == "In Break" || status == "Ready") {
                //    getAgentStatuses();
                //    $(".ulAgentStatuses").show();
                //}
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else {
                console.log(errorThrown);
            }
        }
    });
});
$(document).contextmenu(function (e) {
    if (lastPathSegment.toLowerCase().indexOf("agenthome") == 0)
        return false;
})

$(document).ready(function () {
    loginTimePolling()
    getAgentStatuses(0);   
    getOpenCbrCount();
    //getStatusOfAgent();
    // getAgentStatuses(null);
    


    if (roleId == 1) {

        $("#closeAgentIdle").click(function () {
            // myFunction();
            //   clearIdleTime();
            // timeRunner();

        });

        var sta = $("#spanAgentStatus").text();
        if (sta == "Ready" || lastPathSegment == "AgentHome.aspx") {
            //  myFunction();
        }

        //timeRunner();
    }

    //if (roleId == "3" || roleId == "2") {

    //    $("#spanAgentStatus").text("Ready").attr("style", "position: absolute; left: 61px; font-size: 11px; top: 36px; background: #8af3fd; font-weight: 600; color: #2FB97A");

    //}
    //$("#spanAgentStatus").on('change', function () {
    //    //Do calculation and change value of other span2,span3 here
    //    alert("hai");
    //});

});

//$(function (ready) {
//    $('#spanAgentStatus').change(function () {
//        alert("chhh");
//    });
//});



//$("#spanAgentStatus").change(function () {
//    alert("The text has been changed.");
//});

//$(document).delegate("#spanAgentStatus", "change", function () {
//    var agentsta = $(this).text();
//    alert(agentsta);
//});
function getOpenCbrCount() {
    $.ajax({
        type: "GET",
        url: "Handlers/Agents.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 17 },
        success: function (res) {
            if (res.Success == "True") {
                $("#notificationBadge, .cbr-notfctn").text(res.Cbrcount);
                $("#notificationBadge, .cbr-notfctn").show();
            }
            else {
                $("#notificationBadge, .cbr-notfctn").hide();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else {
                console.log(errorThrown);
            }
        }
    });
}

$("#spanAgentStatus").on('change', function () {
    //Do calculation and change value of other span2,span3 here
    //  alert("hai");
});
function myFunction() {
    var delayTime = 1000 * 60 * 5;
    //var delayTime = 1000 ;
    timer = 0;
    timer = setInterval(function () {
        getAgentDetails();
        if (AgentAvailableStatusId == 10) {
            $('#AgentIdle').modal('show');
            myStopFunction();
        } else {

        }
    }, delayTime);
}

function myStopFunction() {
    clearTimeout(timer);

}
function clearIdleTime() {
    clearInterval(myTimer);
}

function timeRunner() {
    sec = 0;
    min = 0;
    $("#min").text("0" + min);
    $("#sec").text("0" + sec);
    myTimer = 0;
    myTimer = setInterval(function () {
        if (sec >= 0) {
            sec = sec + 1;
            if (sec == 60) {
                min = min + 1;
                if (min >= 10) {
                    $("#min").text(min);
                    sec = 0
                    $("#sec").text("0" + sec);
                } else {
                    $("#min").text("0" + min);
                    sec = 0
                    $("#sec").text("0" + sec);
                }
            } else {
                if (sec >= 10) {
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



function getAgentDetails() {
    AgentAvailableStatusId = 0;
    AgentLogInStatus = '';
    AgentCallStatus = '';
    $.ajax({
        type: "GET",
        url: "Handlers/Manager.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 8, agentId: agentId, durationType: 1 },
        success: function (res) {
            if (res.Success == "True") {
                //     alert(res.AgentHistory[0].LoggedInHrs);
                var idleTime = res.AgentHistory[0].IdleTimeInHrs;
                idleTime = idleTime.substr(0, 7);
                $("#agentIdleTime").text(idleTime);
                //  AgentAvailableStatusId = res.AgentHistory[0].AgentAvailableStatusId;
                AgentLogInStatus += "<div class='col-sm-3 text-left'>";
                AgentLogInStatus += "<label class='blocked txt-lite-grey f_13'>Logged In :</label>";
                var LoggedInHrs = res.AgentHistory[0].LoggedInHrs;
                LoggedInHrs = LoggedInHrs.substr(0, 7);
                AgentLogInStatus += "<h4 class='bold-6 txt-grey'>" + LoggedInHrs + "</h4></div>";
                AgentLogInStatus += "<div class='col-sm-3 text-left'>";
                AgentLogInStatus += "<label class='blocked font-green f_13'>Available :</label>";
                var AvailableTimeInHrs = res.AgentHistory[0].AvailableTimeInHrs;
                AvailableTimeInHrs = AvailableTimeInHrs.substr(0, 7);
                AgentLogInStatus += "<h4 class='bold-6 txt-grey'>" + AvailableTimeInHrs + "</h4></div>";
                AgentLogInStatus += "<div class='col-sm-3 text-left'>";
                AgentLogInStatus += "<label class='blocked text-warning f_13'>On Break :</label>";
                var InBreakTimeInHrs = res.AgentHistory[0].InBreakTimeInHrs;
                InBreakTimeInHrs = InBreakTimeInHrs.substr(0, 7);

                AgentLogInStatus += "<h4 class='bold-6 txt-grey'>" + InBreakTimeInHrs + "</h4></div>";
                AgentLogInStatus += "<div class='col-sm-3 text-left'>";
                AgentLogInStatus += "<label class='blocked font-blue-soft f_13'>Other Work :</label>";
                var OWATimeInHrs = res.AgentHistory[0].OWATimeInHrs;
                OWATimeInHrs = OWATimeInHrs.substr(0, 7);

                AgentLogInStatus += "<h4 class='bold-6 txt-grey'>" + OWATimeInHrs + "</h4></div>";

                AgentCallStatus += "<div class='col-sm-3 text-left'>";
                AgentCallStatus += "<label class='blocked f_13 txt-lite-grey'>Avg service level :</label>";
                AgentCallStatus += "<h4 class='bold-6 txt-grey'>" + res.AgentHistory[0].CurrentSLA + "</h4></div>";
                AgentCallStatus += "<div class='col-sm-3 text-left'>";
                AgentCallStatus += "<label class='blocked f_13 txt-lite-grey'>Avg speed of ans :</label>";
                if (res.AgentHistory[0].SpeedOfAnswer == '') {
                    AgentCallStatus += "<h4 class='bold-6 txt-grey'>00:00</h4>";
                } else {
                    var SpeedOfAnswer = res.AgentHistory[0].SpeedOfAnswer;
                    SpeedOfAnswer = SpeedOfAnswer.substr(0, 7);
                    AgentCallStatus += "<h4 class='bold-6 txt-grey'>" + SpeedOfAnswer + "</h4>";


                }
                AgentCallStatus += "</div>";
                AgentCallStatus += "<div class='col-sm-3 text-left'>";
                AgentCallStatus += "<label class='blocked f_13 txt-lite-grey'>AHT :</label>";
                if (res.AgentHistory[0].HandleTime == '') {
                    AgentCallStatus += "<h4 class='bold-6 txt-grey'>00:00</h4>";
                } else {
                    var HandleTime = res.AgentHistory[0].HandleTime;
                    HandleTime = HandleTime.substr(0, 7);
                    AgentCallStatus += "<h4 class='bold-6 txt-grey'>" + HandleTime + "</h4>";

                }


                AgentCallStatus += "</div>";
                AgentCallStatus += "<div class='col-sm-3 text-left'>";
                AgentCallStatus += "<label class='blocked f_13 txt-lite-grey'>Total Calls :</label>";

                if (res.AgentHistory[0].TotalCalls == '') {
                    AgentCallStatus += "<h4 class='bold-6 txt-grey'>0</h4>";
                } else {
                    AgentCallStatus += "<h4 class='bold-6 txt-grey'>" + res.AgentHistory[0].TotalCalls + "</h4>";
                }
                AgentCallStatus += "</div>";




                $("#agentLoginStatus").html(AgentLogInStatus);
                $("#agentCallStatus").html(AgentCallStatus);
                AgentAvailableStatusId = res.AgentHistory[0].AgentAvailableStatusId;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else {
                console.log(errorThrown);
            }
        }
    });


}






function getAgentStatuses(IsRole)
{

    $.ajax({
        type: "GET",
        url: "Handlers/Agents.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 6 },
        success: function (res) {
            if (res.Success == "True") {

                var statuses = "";
                if (res.AgentStatuses.length > 0) {
                    statuses += "<li class='divider' id='divider-status'></li>";
                    for (var i = 0; i < res.AgentStatuses.length; i++) {
                        statuses += "<li class='status_agent' statusId=" + res.AgentStatuses[i].Id + " status='" + res.AgentStatuses[i].Status + "' labelcolorcode='" + res.AgentStatuses[i].LabelColorCode + "' textcolorcode='" + res.AgentStatuses[i].TextColorCode + "'>";
                        if (res.AgentStatuses[i].Status.toLowerCase() == "in break") { statuses += "<span>" + res.AgentStatuses[i].Status + " / " + "Prayer Time</span>"; }
                        else { statuses += "<span>" + res.AgentStatuses[i].Status + "</span>"; }
                        statuses += "</li>";
                    }
                }
                if ($(".ulAgentStatuses li").length == 2) {
                    $(".ulAgentStatuses li").last().after(statuses);
                }


                //////for getAgentPic


                if (IsRole == 0) {
                    if (res.AgentProfilePic.length > 0) {
                        if (res.AgentProfilePic[0].ProfileImagePath != "undefined" && res.AgentProfilePic[0].ProfileImagePath != "") {
                            $("#profilePic").attr("src", res.AgentProfilePic[0].ProfileImagePath);
                        } else {
                            $("#profilePic").attr("src", "assets/img/user.jpg");
                        }
                    }

                    if (res.AgentDeviceStatus.length > 0) {
                        if (res.AgentDeviceStatus[0].RoleId == "1") {
                            if (res.AgentDeviceStatus[0].IsRegistered == "False") {
                                if (res.AgentDeviceStatus[0].Type != "PSTN") {
                                    if (res.AgentDeviceStatus[0].Type == "External Sip Account") {
                                        if (res.AgentDeviceStatus[0].ExternalSipReg == "False") {
                                            alert("Your Device Is Not Ready");
                                        }
                                    } else if (res.AgentDeviceStatus[0].Type == "Press3 Soft Phone") {
                                        alert("Your Device Is Not Ready");
                                    }

                                }
                            }
                        }
                    }
                }
                else if (IsRole == 1) {
                    if (res.AgentDeviceStatus.length > 0) {
                        if (res.AgentDeviceStatus[0].Type == "PSTN") {
                            IsReg = 1;
                        } else {
                            if (res.AgentDeviceStatus[0].IsRegistered == "False") {
                                IsReg = 0;
                                alert("Your device is not ready");
                            } else {
                                IsReg = 1;
                            }
                        }
                    }
                }


                ///////////getStatusOfAgent

      
                if (res.AgnetLoginDetails.length > 0) {

                    var availStatusId = res.AgnetLoginDetails[0].AvailabilityStatusId;
                    var labelColorCode = "", textColorCode = "";

                    for (var i = 0; i < res.AgentStatuses.length; i++) {

                        if (res.AgentStatuses[i].Id == availStatusId) {
                            labelColorCode = res.AgentStatuses[i].LabelColorCode;
                            textColorCode = res.AgentStatuses[i].TextColorCode;
                        }

                    }

                    $("#spanAgentStatus").text(res.AgnetLoginDetails[0].Status).attr("style", "position: absolute; left: 61px; font-size: 11px; top: 36px; background: " + labelColorCode + "; font-weight: 600; color: " + textColorCode + "");


                }

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else {
                console.log(errorThrown);
            }
        }
    });



}

setInterval(function () {
    loginTimePolling();
}, 15000);

function loginTimePolling() {
    $.ajax({
        type: "GET",
        url: "Handlers/Agents.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 18 },
        success: function (res) {
            if (res.Success == "True") {

            }
            //else {
            //    window.location.href = "/Login.aspx";
            //}
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else {
                console.log(errorThrown);
            }
        }
    });
    
}
