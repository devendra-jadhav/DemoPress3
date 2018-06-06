$(document).ready(function () {    
    getConfigInfo();
});

function getConfigInfo() {
    $.ajax({
        type: "POST",
        url: "Handlers/Config.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 1 },
        success: function (res) {
            var resHtml1 = "";
            var resHtml2 = "";
            if (res.Success == "True") {

                if (res.GatewayDetails.length > 0) {
                    for (var i = 0; i < res.GatewayDetails.length; i++) {
                        resHtml1 += "<tr>";
                        resHtml1 += "<td>" + res.GatewayDetails[i].Id + "</td>";
                        resHtml1 += "<td>" + res.GatewayDetails[i].Name + "</td>";
                        resHtml1 += "<td>" + res.GatewayDetails[i].HttpUrl + "</td>";
                        resHtml1 += "<td>" + res.GatewayDetails[i].OriginationUrl + "</td>";
                        resHtml1 += "<td>" + res.GatewayDetails[i].RecordingPath + "</td>";
                        resHtml1 += "<td>" + res.GatewayDetails[i].ResourceUrl + "</td>";
                        resHtml1 += "<td>" + res.GatewayDetails[i].TotalChannels + "</td>";
                        resHtml1 += "<td>" + res.GatewayDetails[i].VertoRegistrationPort + "</td>";
                        resHtml1 += "</tr>";
                    }
                    $("#gatewayReports").html(resHtml1);
                }
            }

            if (res.AgentDetails.length > 0) {
                for (var i = 0; i < res.AgentDetails.length; i++) {
                    resHtml2 += "<tr>";
                    resHtml2 += "<td>" + res.AgentDetails[i].Id + "</td>";
                    resHtml2 += "<td>" + res.AgentDetails[i].Name + "</td>";
                    resHtml2 += "<td>" + res.AgentDetails[i].Email + "</td>";
                    resHtml2 += "<td>" + res.AgentDetails[i].Mobile + "</td>";
                    resHtml2 += "<td>" + res.AgentDetails[i].Status + "</td>";
                    resHtml2 += "<td>" + res.AgentDetails[i].Availability + "</td>";
                    resHtml2 += "<td>" + res.AgentDetails[i].LoginType + "</td>";
                    resHtml2 += "<td>" + res.AgentDetails[i].OBAccess + "</td>";
                    resHtml2 += "<td>" + res.AgentDetails[i].CommunicationType + "</td>";
                    resHtml2 += "<td>" + res.AgentDetails[i].GatewayId + "</td>";
                    resHtml2 += "<td>" + res.AgentDetails[i].IP + "</td>";
                    resHtml2 += "<td>" + res.AgentDetails[i].Port + "</td>";
                    resHtml2 += "<td>" + res.AgentDetails[i].UserName + "</td>";
                    resHtml2 += "<td>" + res.AgentDetails[i].Registered + "</td>";
                    resHtml2 += "<td>" + res.AgentDetails[i].LastSignalReceived + "</td>";
                    resHtml2 += "</tr>";
                }
                $("#agentReports").html(resHtml2);
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
