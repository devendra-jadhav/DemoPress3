$(document).ready(function () {

    setTimeout(function () {
        window.location.reload(1);
    }, 59000)
    var i = 0;
    setInterval(function () {
        i = i + 1;
        $("#reloadTime").text("Updated page " + i + " sec ago..")
    }, 1000)
    getAgents();
    $("#fixTable2").tableHeadFixer();
    $("#selectLoginStatus").change(function () {
        getAgents();
    });
    $("#selectRole").change(function () {
        getAgents();
    });

    $("#selectLoginRequired").change(function () {
        getAgents();
    });

    $("#selectDeviceStatus ,#selectDeviceType").change(function () {
        getAgents();
    });
});


$("#btnSearch").click(function () {

    getAgents();

});

function getAgents() {

    //$("#agentSkills").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");

    var portalLoginStatus = $('[Id="selectLoginStatus"] option:selected').val();
    var selectedRole = $('[Id="selectRole"] option:selected').val();
    var LoginRequired = $('[Id="selectLoginRequired"] option:selected').val();

    var deviceStatusId = $('[Id="selectDeviceStatus"] option:selected').val();
    var deviceType = $("#selectDeviceType").val();

    searchText = $("#txtSearch").val();

    var agentSkills = "";
    var agents = "";
    var supervisorslist = "<option value='0'>Select</option>";

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        url: "Handlers/Agents.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 16, LoginStatus: portalLoginStatus, SelectedRole: selectedRole, LoginRequired: LoginRequired, deviceStatusId: deviceStatusId, DeviceType: deviceType
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {

                $("#h2NoOfRecords").html(res.AgentSkills.length);

                if (res.AgentSkills.length > 0) {

                    for (var i = 0; i < res.AgentSkills.length; i++) {
                        agentSkills += "<tr><td><a class='btn-link view' title=AgentId=" + res.AgentSkills[i].Id + " href='/AgentProfileSettings.aspx?AgentId=" + res.AgentSkills[i].Id + "'>" + res.AgentSkills[i].Name + "</a></td><td>" + res.AgentSkills[i].Designation + "</td>";
                        

                        if (res.AgentSkills[i].LoginType == "") {
                            res.AgentSkills[i].LoginType = "--";
                        }

                        if (res.AgentSkills[i].DeviceType == "") {
                            res.AgentSkills[i].DeviceType = "--";
                        }

                        if (res.AgentSkills[i].OBAccessType == "") {
                            res.AgentSkills[i].OBAccessType = "--";
                        }

                        if (res.AgentSkills[i].Gateway == "") {
                            res.AgentSkills[i].Gateway = "--";
                        }

                        if (res.AgentSkills[i].DeviceStatus == "") {
                            res.AgentSkills[i].DeviceStatus = "--";
                        }

                        if (res.AgentSkills[i].LastSignalReceived == "") {
                            res.AgentSkills[i].LastSignalReceived = "--";
                        }


                        if (res.AgentSkills[i].LoggedInFromWeb == "") {
                            res.AgentSkills[i].LoggedInFromWeb = "--";
                        }

                        agentSkills += "<td>" + res.AgentSkills[i].LoginType + "</td>";

                        if (res.AgentSkills[i].LoggedInFromWeb == "Online") {
                            agentSkills += "<td> <label class='label label-success'>Online</label> </td>";
                        }
                        else if (res.AgentSkills[i].LoggedInFromWeb == "Offline") {
                            agentSkills += "<td><label class='label label-info'>Offline</label></td>";
                        }
                        else {
                            agentSkills += "<td>" + res.AgentSkills[i].LoggedInFromWeb + "</td>";
                        }

                        agentSkills += "<td>" + res.AgentSkills[i].DeviceType + "</td>";

                        if (res.AgentSkills[i].DeviceType != "PSTN") {
                            agentSkills += "<td>" + res.AgentSkills[i].UserName + "@" + res.AgentSkills[i].IPAddress + ":" + res.AgentSkills[i].Port + "</td>";
                        }
                        else {
                            agentSkills += "<td>" + res.AgentSkills[i].AgentMobile + "</td>";
                        }

                        agentSkills += "<td>" + res.AgentSkills[i].Gateway + "</td>";

                        if (res.AgentSkills[i].DeviceStatus == "Active") {
                            agentSkills += "<td> <label class='label label-primary'>Registered</label> </td>";
                        }
                        else if (res.AgentSkills[i].DeviceStatus == "Not Activated") {
                            agentSkills += "<td><label class='label label-danger'>Not Registered</label></td>";
                        }
                        else {
                            agentSkills += "<td>" + res.AgentSkills[i].DeviceStatus + "</td>";
                        }
                        
                        agentSkills += "<td>" + res.AgentSkills[i].OBAccessType + "</td>";

                        if (res.AgentSkills[i].DeviceIdle == 1) {
                            agentSkills += "<td style='color:red;'>" + res.AgentSkills[i].LastSignalReceived + "</td></tr>";
                        }
                        else {
                            agentSkills += "<td>" + res.AgentSkills[i].LastSignalReceived + "</td></tr>";
                        }
                        
                    }
                    $("#agentSkills").html(agentSkills);
                } else {
                    $("#agentSkills").html(agentSkills);
                    console.log(res.Message);
                }
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