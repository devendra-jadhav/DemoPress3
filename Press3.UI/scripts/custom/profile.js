

$(document).ready(function () {

    var agentId = $("#hdnAgentId").val();

    $.ajax({
        type: "POST",
        url: "Handlers/Agents.ashx",
        dataType: "JSON",
        async: false,
        data: {
            type: 8, Mode: 2,AgentId: agentId
        },
        success: function (res) {
            if (res.Success == "True") {

                if(res.AgentInformation.length > 0)
                {
                    var skills = [];
                    var selectedSkills = "";
                    $("#lblName").text(res.AgentInformation[0].Name);
                    $("#agentName").html(res.AgentInformation[0].Name);
                    $("#lblMobile").text(res.AgentInformation[0].Mobile);
                    $("#lblExtensionNumber").text(res.AgentInformation[0].ExtensionNumber);
                    $("#lblEmail").text(res.AgentInformation[0].Email);
                    $("#lblDesignation").text(res.AgentInformation[0].Role);
                    $("#lblReportingManagers").text(res.AgentInformation[0].ReportingAgents);
                    $("#lblPhoneType").text(res.AgentInformation[0].Type);
                    if(res.AgentInformation[0].Status == "Active")
                    {
                        $("#profileType").html("<label class='font-green-soft bold-6'>Active</label>");
                    }
                    else
                    {
                        $("#profileType").html("<label class='font-red bold-6'>Blocked</label>");
                    }
                    if (res.AgentInformation[0].ProfileImagePath != "")
                    {
                        $("#imgAgentProfilePic").attr("src", res.AgentInformation[0].ProfileImagePath)
                    }
                    
                    
                }
                
            } else {
                alert(res.Message);

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else {
                console.log(errorThrown);
                alert(errorThrown);
            }
        }
    });

    getAgentProfile(agentId);
});

function getAgentProfile(agentId)
{
    $.ajax({
        type: "GET",
        url: "Handlers/Manager.ashx",
        dataType: "JSON",
        async: false,
        data: {
            type: 10, agentId: agentId
        },
        success: function (res) {
            var loginActivitiesData = "";
            var skillGroups = [];
            var skills = [];
            var selectedSkills = "";
            var skillGroupsData = "<label class='txt-lite-grey margin-right-10'>Ring Group :</label>";

            
                                            
            if (res.Success == "True") {
               
                //LoggedInHrs
                //SkillGroups
                if (res.AgentBasicDetails.length > 0)
                {
                    skillGroups = res.AgentBasicDetails[0].SkillGroups.split(",");
                    skillGroupsData = "<label class='txt-lite-grey margin-right-10'>Skills :</label>";

                    $.each(skillGroups, function (index, value) {
                        skillGroupsData += "<label class='label_round f_13'>" + value + "</label>";
                    });


                    skills = res.AgentBasicDetails[0].Skills.split(",");
                    selectedSkills = "<label class='txt-lite-grey margin-right-10'>Skills :</label>";
                    $.each(skills, function (index, value) {
                        selectedSkills += "<label class='label_round margin-right-5 f_13'>" + value + "</label>";
                    });
                    $(".rate").rateYo({
                        "rating": res.AgentBasicDetails[0].Rating,
                        "readOnly": true,
                        "spacing": "10px",
                        "multiColor": { "startColor": "#35aa47", "endColor": "#35aa47" },
                        "starWidth": "20px"
                    });
                    $("#lblRating").text("(" + res.AgentBasicDetails[0].Rating + ")");
                    $("#skillsData").html(selectedSkills);
                    $("#spnLoginHrs").html(res.AgentBasicDetails[0].LoggedInHrs);
                }
                if (res.AgentStatusChanges.length > 0) {

                    for (var i = 0; i < res.AgentStatusChanges.length ; i++)
                    {
                        loginActivitiesData += "<li class='in'><img class='avatar' alt='' src='assets/img/user.jpg' />";
                        loginActivitiesData += "<div class='message'><span class='arrow'></span><span href='#' class='name bold'>Status Change </span>";
                        loginActivitiesData += "<span class='datetime'>at " + res.AgentStatusChanges[i].ChangedTime + "</span>";
                        loginActivitiesData += "<span class='body'>Changed to :" + res.AgentStatusChanges[i].Status + "</span></div></li>";
                    }
                    

                }
                $("#loginActivities").html(loginActivitiesData);
                if (res.AgentCallStatistics.length > 0) {
                    $("#lblInBreak").html(res.AgentCallStatistics[0].InBreakTimePercent);
                    $("#lblOtherWork").html(res.AgentCallStatistics[0].OWATimePercent);
                    $("#lblOnCall").html(res.AgentCallStatistics[0].OnCallTimePercent);
                    $("#lblAvailable").html(res.AgentCallStatistics[0].AvailableTimePercent);
                }


            } else {
                alert(res.Message);

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else {
                console.log(errorThrown);
                alert(errorThrown);
            }
        }
    });
}