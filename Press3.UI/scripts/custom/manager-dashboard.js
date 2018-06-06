var global_AgentsList = "", id_and_timers = [];
var accountId = 0, agentId = 0, roleId = 0;
var studioId = 0;

$(document).ready(function () {
    studioId = $("#selectIvrStudio").find("option:selected").val();
    accountId = $("#hdnAccountId").val();
    agentId = $("#hdnAgentId").val();
    roleId = $("#hdnRoleId").val();

    var domain = location.host
    var host = (location.protocol === 'https:') ? 'wss://' : 'ws://';
    var page = '/ConferenceWebSocket.sub?Channel_Name=';
    var ws;
    var hostTotal = host + domain + page + "manager_" + accountId;
    console.log(hostTotal);
    ws = new WebSocket(hostTotal);
    ws.onopen = function (evt) {
        console.log("WebSocket Connection Open");
    };
    ws.onmessage = function (evt) {
        console.log("WebSocket Connection data ");
        console.log(evt);
        var websocketResult = "";
        if (evt != "") {
            websocketResult = jQuery.parseJSON(evt.data);
            if ("ActiveCallers" in websocketResult) {
                $("#spanActiveCallers").text(websocketResult.ActiveCallers);
            }
            if ("WaitingCallers" in websocketResult) {
                $("#spanWaitingCallers").text(websocketResult.WaitingCallers);
            }
            if ("AgentsLoggedin" in websocketResult) {
                $("#h2AgentsLoggedin").text(websocketResult.AgentsLoggedin);
            }
            if ("AgentsReady" in websocketResult) {
                $("#h2AgentsReady").text(websocketResult.AgentsReady);
            }
            if ("AgentsOncall" in websocketResult) {
                $("#h2AgentsOncall").text(websocketResult.AgentsOnCall);
            }
            if ("TotalCallsToday" in websocketResult) {
                $("#h2TotalCalls").text(websocketResult.TotalCallsToday);
            }
            if ("AvgSpeedOfAnswer" in websocketResult) {
                $("#h2AvgAnswerSpeed").text(websocketResult.AvgSpeedOfAnswer);
            }
            if ("LongestCall" in websocketResult) {
                $("#h2LongestCall").text(websocketResult.LongestCall);
            }
            if ("LongestWaitingCall" in websocketResult) {
                $("#h2LongestWaitingCall").text(websocketResult.LongestWaitingCall);
            }
            if ("CallsAbove5min" in websocketResult) {
                $("#h2CallsAbove5min").text(websocketResult.CallsAbove5min);
            }
            if ("Escalations" in websocketResult) {
                $("#h2Escalations").text(websocketResult.Escalations);
            }
            if ("TotalConferencesToday" in websocketResult) {
                $("#h2TotalConferences").text(websocketResult.TotalConferencesToday);
            }
            if ("CurrentSLA" in websocketResult) {
                $("#spanCurrentSLA").text(websocketResult.CurrentSLA + '%');
            }
            if ("TargetSLA" in websocketResult) {
                $("#spanTargetSLA").text(websocketResult.TargetSLA + '%');
            }
            if ("ActiveCallers" in websocketResult && "WaitingCallers" in websocketResult) {
                var websocketTotalCallers = parseInt(websocketResult.ActiveCallers) + parseInt(websocketResult.WaitingCallers);
            }
            if (websocketTotalCallers == 0) {
                $("#current_call").attr("aria-valuenow", "0").css("width", "0%");
            } else {
                var websocketActiveCallersPercentage = (parseInt(websocketResult.ActiveCallers) / websocketTotalCallers) * 100;
                $("#current_call").attr("aria-valuenow", websocketActiveCallersPercentage / 100).css("width", websocketActiveCallersPercentage + "%");
            }

            if ("CurrentSLA" in websocketResult && "TargetSLA" in websocketResult) {
                $("#divSLA").attr("aria-valuenow", websocketResult.CurrentSLA / 100).css("width", websocketResult.CurrentSLA + "%");
            }

           

            //if ("CallEvent" in websocketResult) {
            //    if ($("#divSupervisorView").is(":visible")) {
            //setTimeout(function () {
                    getDashboard();
                    getLoggedInAgents();
                    getAgentsSummary(1);
                    getAgentsActiveOrWaitingCalls(1, 1);
                    getAgentsActiveOrWaitingCalls(2, 1);
                    getAgentsAvgTalkTimeVsWaitTimeReport();
                    getAgentsHandleTimeByHourReport();
                    getAgentsCallAbandonmentByHourReport();
                    getAgentsAvailabilityStatuses();
            //}, 1500);
            //    }
            //}
        }
    };
    loginVerto();

    $("#divManagerView").show();
    $("#divSupervisorView").hide();

    getDashboard();
    getDashboardHeadServiceLevels();
    getAgentsTotalCallsReceivedByHour();
    getAgentsAvgTalkTimeVsWaitTimeReport();
    getAgentsHandleTimeByHourReport();
    getAgentsCallAbandonmentByHourReport();
    getAgentsAvailabilityStatuses();

    $(".roleViews").click(function () {
        var roleType = $(this).attr("roleType");
        if (roleType == 1) {
            $(".durationActions").addClass("label-default").removeClass("label-primary");
            $(".durationActions:first-of-type").addClass("label-primary").removeClass("label-default");
            //$(".callTypes").addClass("label-default").removeClass("label-primary");
            //$(".callTypes:first-of-type").addClass("label-primary").removeClass("label-default");
            $(".roleViews").text("Back to Manager View").attr("roleType", 2);
            $("#divManagerView").hide();
            getLoggedInAgents();
            getAgentsAvailabilityStatuses();
            getAgentsSummary(1);
            getAgentsActiveOrWaitingCalls(1, 1);
            getAgentsActiveOrWaitingCalls(2, 1);
            $("#divSupervisorView").fadeIn(1500);

        } else if (roleType == 2) {
            $("#divManagerView").fadeIn(1500);
            $("#divSupervisorView").hide();
            $(".roleViews").text("Click here for Supervisor View").attr("roleType", 1);
            getDashboard();
            getAgentsAvgTalkTimeVsWaitTimeReport();
            getAgentsHandleTimeByHourReport();
            getAgentsCallAbandonmentByHourReport();
        }
    });



    $("#selectIvrStudio").change(function () {
        studioId = $(this).find("option:selected").val();
        

        getDashboard();
        getLoggedInAgents();
        getAgentsSummary(1);
        getAgentsActiveOrWaitingCalls(1, 1);
        getAgentsActiveOrWaitingCalls(2, 1);
        getAgentsAvgTalkTimeVsWaitTimeReport();
        getAgentsHandleTimeByHourReport();
        getAgentsCallAbandonmentByHourReport();
       
    });


   
    $(document).delegate(".durationActions", "click", function () {
        $(".durationActions").addClass("label-default").removeClass("label-primary");
        $(this).addClass("label-primary").removeClass("label-default");
        var selectedStatus = $("#agentStatusFilter").val();
        var duration = $(this).attr("actionType");
        getAgentsSummary(duration, selectedStatus);
    });
    $("#agentStatusFilter").change(function(){
        var selectedStatus= $("#agentStatusFilter").val();
        var duration = $(this).attr("actionType");
        getAgentsSummary(duration,selectedStatus);
    })

    $(document).delegate(".callTypes", "click", function () {
        getAgentsActiveOrWaitingCalls(1, $(this).attr("callType"));
        getAgentsActiveOrWaitingCalls(2, $(this).attr("callType"));
        $(".callTypes").addClass("label-default").removeClass("label-primary");
        $(this).addClass("label-primary").removeClass("label-default");
    });

    $(document).delegate(".lblListen,.lblWhisper,.lblJoin", "click", function () {
        getAgentStatuses(1);
        if (IsReg == 1) {
            var callId = $(this).attr("callId");
            var calEvent = $(this).attr("Event");
            if (calEvent == "Listen Start" || calEvent == "Whisper Start" || calEvent == "Join Start") {
                $(".managerActions").attr("disabled", "disabled");
                $(this).removeAttr("disabled");
                CallActions(callId, agentId, 4, calEvent);
            }
            else if (calEvent == "Listen End" || calEvent == "Whisper End" || calEvent == "Join End") {
                var requestUUID = $(this).attr("RequestUUID");
                var httpUrl = $(this).attr("HttpURL");
                $(".managerActions").removeAttr("disabled");
                HangUp(callId, httpUrl, requestUUID, calEvent);
            }
            glbCallEvent = calEvent;
        }
    });

    $(document).delegate(".selPriorities", "change", function () {
        var callId = $(this).attr("callId");
        var priority = $(this).find("option:selected").val();

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
            data: { type: 13, callId: callId, priority: priority },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {
                    $(".selPriorities[callId='" + callId + "']").val(priority);
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
    });
    $("#agentDetailsRedirect").click(function () {
        //window.location.href = "/AgentDetails.aspx";
        window.open('/AgentDetails.aspx', '_target');
    });
});

function getAgentsAvailabilityStatuses() {
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
        data: { type: 41 },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.AgentAvailableStatuses.length > 0) {
                    var agentStatuses = "<option value='0'>select</option>";
                    for (var i = 0; i < res.AgentAvailableStatuses.length; i++) {
                        agentStatuses += "<option value='" + res.AgentAvailableStatuses[i].Id + "'>" + res.AgentAvailableStatuses[i].Status + "</option>";
                    }
                    $("#agentStatusFilter").html(agentStatuses);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else {
                console.log(errorThrown);
            }
        }
    });
}


function getAgentsTotalCallsReceivedByHour()
{
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
            data: { type: 37 },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {
                    //taken data and options variables as upper scope 
                    var data = null;
                    
                    var legendpos = 'top';

                    if(res.MultipleIvrs.length > 0)
                    {
                        legendpos = 'top';
                    }
                    else {
                        legendpos = 'none';
                    }

                  var  options = {
                      legend: { position: legendpos, maxLines: 2 },
                        bar: { groupWidth: '55%', width: 40 },
                        isStacked: true,
                        animation: {
                            startup: true,
                            duration: 1000,
                            easing: 'out',
                        },
                        vAxis: {
                            viewWindow: { min: 0 },
                            title: "No of calls",
                            titleTextStyle: {
                                fontName: "Times New Roman",
                                italic: true,
                                fontSize: 10
                            },
                            gridlines: {
                                color: 'transparent'
                            }
                        },
                        vAxis: {
                            title: "",
                            viewWindow: { min: 0 },
                            title: "Calls Received by Hour",
                            //format: "#,###",
                            titleTextStyle: {
                                fontName: "Times New Roman",
                                italic: true,
                                fontSize: 12
                            },
                            gridlines: {
                                color: 'transparent'
                            }
                        },
                        height: 250
                        //colors: ["#5d55b1", "#dcc30f", "#87cefa", "#87cefa",]

                  };



                    if (res.MultipleIvrs.length > 0) {
                        console.log(res);
                        var arrValues = [];
                        var arrValues2 = [];
                        var temparr = [];
                        var allHours = [];
                        var allIvrNames = [];
                        var uniqueHours = [];
                        var uniqueIvrNames = [];
                        for (var i = 0; i < res.MultipleIvrs.length; i++) {
                            allHours.push(res.MultipleIvrs[i].Hour);
                        }
                        for (var n = 0; n < res.MultipleIvrs.length; n++)
                        {
                            allIvrNames.push(res.MultipleIvrs[n].StudioName);
                        }
                        uniqueHours = allHours.filter(function (itm, i, allHours) {
                            return i == allHours.indexOf(itm);
                        });

                        uniqueIvrNames = allIvrNames.filter(function (itm, i, allIvrNames) {
                            return i == allIvrNames.indexOf(itm);
                        });

                       // alert(uniqueIvrNames.length);
                        //alert(JSON.stringify(uniqueIvrNames));
                        for (j = 0; j < uniqueHours.length; j++) {

                            for (var l = 0; l < uniqueIvrNames.length; l++) {

                                var flag = 0;
                                var temp;
                                for(var i=0;i<res.MultipleIvrs.length;i++)
                                {
                                    if((uniqueHours[j]==res.MultipleIvrs[i].Hour)&&(uniqueIvrNames[l]==res.MultipleIvrs[i].StudioName))
                                    {
                                        flag = 1;
                                        temp = res.MultipleIvrs[i].CallsCount;
                                    }
                                }
                                if (flag == 1)
                                {
                                    temparr.push(temp);
                                }
                                else {
                                    temparr.push(null);
                                }
                            }
                            arrValues2.push(temparr);
                            //alert(JSON.stringify(temparr));
                            temparr = [];
                        }
                        arrValues.push(uniqueIvrNames);
                        var temp = [];
                        for(var k=0;k<arrValues2.length;k++)
                        {
                            var arr = arrValues2[k];
                            temp.push(uniqueHours[k].toString() + ":00");
                            for (var j = 0; j < uniqueIvrNames.length; j++) {
                                if (arr[j] != null || arr[j] != undefined)
                                {
                                    temp.push(Number(arr[j]));
                                }
                                else
                                {
                                    temp.push(null);
                                }
                            }
                            arrValues.push(temp);
                            temp = [];
                        }

                        uniqueIvrNames.splice(0, 0, "Hour");

                        //alert(JSON.stringify(arrValues));
                        //["Hour","Press3 Full Ivr","ivr_22 Apr, 2017 11:34 am","Bhanu_Narasimha","Test Local","outtest","studio_11 Sep, 2017 4:48 pm","Bhanu_created","demo ext dial 1","test breadcrumb selection"],["8:00",null,1631,34,192,1090,null,null,null,null,null],["9:00",null,null,null,192,1090,11,458,111,null,null],["10:00",null,null,null,null,null,null,null,111,177,null],["11:00",null,null,null,null,null,null,null,111,177,73],["12:00",null,null,null,null,null,null,null,111,null,null]

                           data = google.visualization.arrayToDataTable(arrValues);

                            // Create and draw the visualization.
                            new google.visualization.ColumnChart(document.getElementById('totalCallsReceived')).
                                    draw(data,options );
                    }
                    else
                    {
                        data = google.visualization.arrayToDataTable([['Hour', '', '', '', '', '', ''], ['4:00', 0, 0, 0, 0, 0, 0], ['5:00', 0, 0, 0, 0, 0, 0], ['6:00', 0, 0, 0, 0, 0, 0], ['7:00', 0, 0, 0, 0, 0, 0], ['8:00', 0, 0, 0, 0, 0, 0], ['9:00', 0, 0, 0, 0, 0, 0], ['10:00', 0, 0, 0, 0, 0, 0], ['11:00', 0, 0, 0, 0, 0, 0], ['12:00', 0, 0, 0, 0, 0, 0]]);
                        //options = {
                        //    legend: { Display: false }
                        //};
                      
                             
                        new google.visualization.ColumnChart(document.getElementById('totalCallsReceived')).draw(data, options);
                        //$("#totalCallsReceived").html("No Reports");
                        //console.log(res.Message);
                    }
                }
                else {
                    $("#totalCallsReceived").html("No Reports");
                    console.log(res.Message);
                }
                        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            $.unblockUI();
                $("#totalCallsReceived").html("No Reports");
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
function getDashboardHeadServiceLevels() {

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
        data: { type: 36 },
        success: function (res) {
            $.unblockUI();

            // $("#loaderForHead").css('visibility', 'hidden');

            $("#loaderForHead").css('display', 'none');

            var ddlOptions = "<option value=0>All</option>";
            var currentSla = 0, targetSLA = 0;
            if (res.Success == "True") {
                if (res.SlaTable.length > 0) {


                    if (res.SlaTable.length > 1) {

                        $("#div0").css('visibility', 'visible');
                        $("#div1").css('visibility', 'visible');
                        $("#div2").css('visibility', 'visible');
                        $("#div3").css('visibility', 'visible');


                        var data = null;
                        var options = null;


                        for (var i = 0; i < res.SlaTable.length; i++) {
                            currentSla = res.SlaTable[i].CurrentSLA;
                            targetSLA = res.SlaTable[i].TargetSLA;



                            var opt = {
                                "type": "gauge",
                                "theme": "none",
                                "axes": [{
                                    "axisThickness": 1,
                                    "axisAlpha": 0.2,
                                    "tickAlpha": 0.2,
                                    "valueInterval": 10,
                                    "bands": [{
                                        "color": "#3b77ff",
                                        "endValue": targetSLA,
                                        "innerRadius": "85%",
                                        "startValue": 0
                                    }, {
                                        "color": "#a5bdc3",
                                        "endValue": 100,
                                        "innerRadius": "85%",
                                        "startValue": targetSLA
                                    }],
                                    "export": {
                                        "enabled": false,
                                    },
                                    "bottomText": "0%",
                                    "bottomTextYOffset": -20,
                                    "endValue": 100
                                }],
                                "arrows": [{}],
                                "export": {
                                    "enabled": true
                                }
                            };



                            var gaugeChart1, gaugeChart2, gaugeChart3;
                          

                            if (i == 0)
                            {
                                var gaugeChart0 = AmCharts.makeChart("divSer0", opt);

                                var cla1 = currentSla;

                                setTimeout(function () {
                                    gaugeChart0.arrows[0].setValue(cla1);
                                    gaugeChart0.axes[0].setBottomText(cla1 + "%");
                                }, 1000);

                            }


                            if (i == 1) {
                                var gaugeChart1 = AmCharts.makeChart("divSer1", opt);
                                var cla2 = currentSla;
                                setTimeout(function () {
                                    gaugeChart1.arrows[0].setValue(cla2);
                                    gaugeChart1.axes[0].setBottomText(cla2 + "%");
                                }, 1000);

                            }

                            if (i == 2) {

                                var gaugeChart2 = AmCharts.makeChart("divSer2", opt);
                                var cla3 = currentSla;
                                setTimeout(function () {
                                    gaugeChart2.arrows[0].setValue(cla3);
                                    gaugeChart2.axes[0].setBottomText(cla3 + "%");
                                }, 1000);

                            }
                            if (i == 3) {

                                var gaugeChart3 = AmCharts.makeChart("divSer3", opt);
                                var cla4 = currentSla;
                                setTimeout(function () {
                                    gaugeChart3.arrows[0].setValue(cla4);
                                    gaugeChart3.axes[0].setBottomText(cla4 + "%");
                                }, 1000);

                            }



                                //gaugeChart.arrows[0].setValue(currentSla);
                                //gaugeChart.axes[0].setBottomText(currentSla + "%");
                          

                           //   setInterval(randomValue(20), 1000);
                         

                            var name = res.SlaTable[i].Name;
                            if (name.length > 4) {
                                name = name.substring(0, 4) + "...";
                            }

                            $("#lblSlivr" + i).html("IVR - " + name);

                            $("#lblSlivr" + i).prop('title', "IVR - " + res.SlaTable[i].Name);

                            $("#spanCallerId" + i).html(res.SlaTable[i].CallerId);

                        }

                        //function randomValue(val) {
                        //    var value = val;
                        //    if (gaugeChart) {
                        //        if (gaugeChart.arrows) {
                        //            if (gaugeChart.arrows[0]) {
                        //                if (gaugeChart.arrows[0].setValue) {
                        //                    gaugeChart.arrows[0].setValue(value);
                        //                    gaugeChart.axes[0].setBottomText(value + " km/h");
                        //                }
                        //            }
                        //        }
                        //    }
                        //}


                        var totalCallers = 0;
                        var activeCallersPercentage = 0;


                        for (var j = 0; j < res.SlaTable.length; j++) {
                            totalCallers = parseInt(res.SlaTable[j].ActiveCallers) + parseInt(res.SlaTable[j].WaitingCallers);

                            if (totalCallers == 0) {
                                $("#current_call" + j).attr("aria-valuenow", "0").css("width", "0%");
                            } else {
                                activeCallersPercentage = (parseInt(res.SlaTable[j].ActiveCallers) / totalCallers) * 100;
                                $("#current_call" + j).attr("aria-valuenow", activeCallersPercentage / 100).css("width", activeCallersPercentage + "%");
                            }
                            $("#spanActiveCallers" + j).text(res.SlaTable[j].ActiveCallers);
                            $("#spanWaitingCallers" + j).text(res.SlaTable[j].WaitingCallers);
                        }

                    }
                    else if(res.SlaTable.length == 1){

                        $("#divForSingleIvr").show();

                        $("#divForMultipleIvrKpi").hide();

                    }
                    else
                    {
                        $("#divForSingleIvr").hide();

                        $("#divForMultipleIvrKpi").hide();
                    }



                    if (res.SlaTable.length == 2) {

                        $("#div2").hide();
                        $("#div3").hide();
                    }
                    else if(res.SlaTable.length == 3)
                    {
                        $("#div2").show();
                        $("#div3").hide();
                    }
                    else if (res.SlaTable.length == 3) {

                        $("#div1").show();
                        $("#div2").show();
                        $("#div3").show();
                    }

                }
                if (res.MultipleIvrs.length > 0) {
                    for (var k = 0; k < res.MultipleIvrs.length; k++) {
                        ddlOptions += "<option value='" + res.MultipleIvrs[k].StudioId + "'> IVR - " + res.MultipleIvrs[k].Name + "</option>";
                    }
                }
                $("#selectIvrStudio").html(ddlOptions);
            }
            else {
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

function getDashboard() {
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
        data: { type: 1, studioId: studioId },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.DashboardDetails.length > 0) {
                    $("#spanActiveCallers").text(res.DashboardDetails[0].ActiveCallers);
                    $("#spanWaitingCallers").text(res.DashboardDetails[0].WaitingCallers);
                    var totalCallers = parseInt(res.DashboardDetails[0].ActiveCallers) + parseInt(res.DashboardDetails[0].WaitingCallers);
                    if (totalCallers == 0) {
                        $("#current_call").attr("aria-valuenow", "0").css("width", "0%");
                    } else {
                        var activeCallersPercentage = (parseInt(res.DashboardDetails[0].ActiveCallers) / totalCallers) * 100;
                        $("#current_call").attr("aria-valuenow", activeCallersPercentage / 100).css("width", activeCallersPercentage + "%");
                    }
                    $("#spanCurrentSLA").text(res.DashboardDetails[0].CurrentSLA + "%");
                    $("#spanTargetSLA").text(res.DashboardDetails[0].TargetSLA + "%");

                    $("#divSLA").attr("aria-valuenow", res.DashboardDetails[0].CurrentSLA / 100).css("width", res.DashboardDetails[0].CurrentSLA + "%");

                        $("#h2AgentsLoggedin").text(res.DashboardDetails[0].AgentsLoggedin);
                        $("#h2CallsAbove5min").text(res.DashboardDetails[0].CallsAbove5min);
                        $("#h2AgentsReady").text(res.DashboardDetails[0].AgentsReady);
                        $("#h2LongestCall").text(res.DashboardDetails[0].LongestCall);
                        $("#h2AgentsOncall").text(res.DashboardDetails[0].AgentsOnCall);
                        $("#h2LongestWaitingCall").text(res.DashboardDetails[0].LongestWaitingCall);
                        $("#h2TotalCalls").text(res.DashboardDetails[0].TotalCallsToday);
                        $("#h2Escalations").text(res.DashboardDetails[0].Escalations);
                        $("#h2AvgAnswerSpeed").text(res.DashboardDetails[0].AvgSpeedOfAnswer);
                        $("#h2TotalConferences").text(res.DashboardDetails[0].TotalConferencesToday);
                       

                } else {
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
function getAgentsSummary(durationType,selectedAgentStatus) {
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
        data: { type: 2, durationType: durationType, AgentStatus : selectedAgentStatus },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (res.Success == "True") {
                if (res.AgentDetails.length > 0) {
                    resHtml += "<table class='table ag_stat table-striped'><tr><th>Agent Name</th><th>Device Status</th><th>Login Type</th><th>Current Status</th><th>From (HH:MM:SS)</th><th>Inbound</th><th>Outbound</th><th>Answered</th><th>Handle Time (HH:MM:SS)</th><th>Idle Time (HH:MM:SS)</th></tr>";
                    for (var i = 0; i < res.AgentDetails.length; i++) {
                        resHtml += "<tr>";
                        if (res.AgentDetails[i].Name.length > 15) {
                            resHtml += "<td title=" + res.AgentDetails[i].Name.replace(" ", "") + "><a href='/AgentProfile.aspx?AgentId=" + res.AgentDetails[i].AgentId + "' target='_new'>" + res.AgentDetails[i].Name.substring(0, 15) + "... </a></td>";
                        }
                        else {
                            resHtml += "<td><a href='/AgentProfile.aspx?AgentId=" + res.AgentDetails[i].AgentId + "' target='_new'>" + res.AgentDetails[i].Name + "</a></td>";
                        }
                        if (res.AgentDetails[i].AgentActiveStatus == "!") {
                            resHtml += "<td><img src='Images\\nosignal.png' alt='No signal' data-toggle='tooltip' data-placement='right' title='No Signal' style='cursor:pointer;'></td>";
                        }
                        else if (res.AgentDetails[i].AgentActiveStatus == "RED") {
                            resHtml += "<td><img src='Images\\notregistered.png' alt='Not registered' data-toggle='tooltip' data-placement='right' title='Not Registered' style='cursor:pointer;'></td>";
                        }
                        else if (res.AgentDetails[i].AgentActiveStatus == "GREEN") {
                            resHtml += "<td><img src='Images\\registered.png' alt='registered' data-toggle='tooltip' data-placement='right' title='Registered' style='cursor:pointer;'></td>";
                        }
                        else {
                            resHtml += "<td>NA</td>";
                        }
                        if (res.AgentDetails[i].LoginStatus.toString().toLowerCase() == "online") {
                            resHtml += "<td style='color:#2FB97A'>" + res.AgentDetails[i].LoginStatus + "</td>";
                        } else if (res.AgentDetails[i].LoginStatus.toString().toLowerCase() == "offline") { 
                            resHtml += "<td style='color:#A7A7A7'>" + res.AgentDetails[i].LoginStatus + "</td>";
                        } else {
                            resHtml += "<td>" + res.AgentDetails[i].LoginStatus + "</td>";
                        }
                        resHtml += "<td style='color: "+ res.AgentDetails[i].TextColorCode +"'>" + res.AgentDetails[i].PresentStatus + "</td>";
                        resHtml += "<td>" + res.AgentDetails[i].PresentStatusFrom + "</td><td>" + res.AgentDetails[i].Inbound + "</td><td>" + res.AgentDetails[i].Outbound + "</td><td>" + res.AgentDetails[i].AnsweredCalls + "</td><td>" + res.AgentDetails[i].HandleTime + "</td>";
                        resHtml += "<td>" + res.AgentDetails[i].IdleTime + "</td>";
                        resHtml += "</tr>";
                    }
                    resHtml += "</table>";
                } else {
                    resHtml += "<hr /><p style='text-align:center;'>No Agents available</p>";
                }
            }
            else {
                resHtml += "<hr /><p style='text-align:center;'>No Agents available</p>";
            }
            $("#divAgentsSummary").html(resHtml);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#divAgentsSummary").html("<hr /><p style='text-align:center;'>No Agents available</p>");
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



function getAgentsActiveOrWaitingCalls(statusType, callType) {
    resetTimers();
    if (statusType == 1) { $("#divActiveCalls").html("<img style='margin-left:330px;margin-top:80px;' src='/assets/img/ajax-loader.gif' />"); }
    else {

        $("#divWaitingCalls").html("<img style='margin-left:500px;margin-top:80px;' src='/assets/img/ajax-loader.gif' />");
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
        url: "Handlers/Manager.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 3, statusType: statusType, callType: callType, studioId: studioId },
        success: function (res) {
            $.unblockUI();
            var resActiveHtml = ""; resWaitingHtml = "";
            if (statusType == 1) { // Active calls
                if (res.Success == "True") {
                    if (res.ReportDetails.length > 0) {
                        $("#spanActiveCalls").text(res.ReportDetails.length);
                        resActiveHtml += "<table class='table ag_stat'><tr><th>Call Type</th><th>User Details</th><th>Skill Group</th><th>Agent</th><th>Duration</th><th>Actions</th></tr>";
                        for (var i = 0; i < res.ReportDetails.length; i++) {
                            resActiveHtml += "<tr>";
                            resActiveHtml += "<td>" + res.ReportDetails[i].CallType + "</td><td>" + res.ReportDetails[i].Customer + "</td>";
                            resActiveHtml += "<td>" + res.ReportDetails[i].SkillGroupName + "</td><td>" + res.ReportDetails[i].AgentName + "</td>";
                            resActiveHtml += "<td class='tdActiveCallsTimer' id='tdActiveCallsTimer_" + i + "'>" + res.ReportDetails[i].DurationTime + "</td>";
                            //resActiveHtml += "<td> - </td>";
                            resActiveHtml += "<td><label Event='Listen Start' CallId = " + res.ReportDetails[i].CallId + " class='lblListen margin-right-5 btn btn-sm btn-grey btn-circle managerActions' title='Listen'><i class='fa fa-headphones'></i></label>";
                            resActiveHtml += "<label Event='Whisper Start' CallId = " + res.ReportDetails[i].CallId + " class='lblWhisper margin-right-5 btn btn-sm btn-grey btn-circle managerActions' title='Whisper'><i class='fa fa-microphone'></i></label>";
                            resActiveHtml += "<label Event='Join Start' CallId = " + res.ReportDetails[i].CallId + " class='lblJoin margin-right-5 btn btn-sm btn-grey btn-circle managerActions' title='Join'><i class='icon icon-shuffle'></i></label>";
                            resActiveHtml += "<a href='/ScoreCard.aspx?CallId=" + res.ReportDetails[i].CallId + "&AgentId=" + res.ReportDetails[i].AgentId + "' target='_new'><label Event='Score Card' CallId = " + res.ReportDetails[i].CallId + " class='margin-right-5 btn btn-sm btn-grey btn-circle' title='Score Card'><i class='icon-tag'></i></label></a>";
                            resActiveHtml += "</td></tr>";
                        }
                        resActiveHtml += "</table>";
                    } else {
                        $("#spanActiveCalls").text(0);
                        resActiveHtml += "<hr /><p style='text-align:center;'>No Active calls</p>";
                    }
                } else {
                    $("#spanActiveCalls").text(0);
                    resActiveHtml += "<hr /><p style='text-align:center;'>No Active calls</p>";
                }
                $("#divActiveCalls").html(resActiveHtml);
                //$(".tdActiveCallsTimer").each(function () {
                //    var initialCount = $(this).text();
                //    startCount($(this).attr("id"), initialCount);
                //});
            }
            else if (statusType == 2) { // Waiting calls
                if (res.Success == "True") {
                    if (res.ReportDetails.length > 0) {
                        $("#spanWaitingCalls").text(res.ReportDetails.length);
                        resWaitingHtml += "<table class='table ag_stat'><tr><th>Waiting Time</th><th>User Details</th><th>Skill Group</th><th>Skills</th><th>Queue</th><th>Actions</th></tr>";
                        for (var i = 0; i < res.ReportDetails.length; i++) {
                            resWaitingHtml += "<tr>";
                            resWaitingHtml += "<td class='tdActiveCallsTimer' id='tdWaitingCallsTimer_" + i + "'>" + res.ReportDetails[i].DurationTime + "</td><td>" + res.ReportDetails[i].Customer + "</td>";
                            resWaitingHtml += "<td>" + res.ReportDetails[i].SkillGroupName + "</td><td>" + res.ReportDetails[i].Skills + "</td>";
                            resWaitingHtml += "<td>" + res.ReportDetails[i].QueueNo + "</td>";
                            resWaitingHtml += "<td><select class='form-control selPriorities' style='width:100px;' callId='" + res.ReportDetails[i].CallId + "'>" + setPriority(res.ReportDetails[i].Priority) + "</select></td>";
                            //resWaitingHtml += "<td><label class='margin-right-10 btn btn-sm btn-success pull-left' title='Listen'><i class='fa fa-phone margin-right-5'></i> Answer</label>";
                            //resWaitingHtml += "<div class='input-group input-group-sm pull-left'><select class='form-control' style='width:85px;' placeholder='Agents'>"+ global_AgentsList +"</select>";
                            //resWaitingHtml += "<span class='input-group-btn' style='width:auto;'><button class='btn blue' type='button'>Connect</button></span></div></td>";
                            resWaitingHtml += "</tr>";
                        }
                        resWaitingHtml += "</table>";
                    } else {
                        $("#spanWaitingCalls").text(0);
                        resWaitingHtml += "<hr /><p style='text-align:center;'>No Waiting calls</p>";
                    }
                } else {
                    $("#spanWaitingCalls").text(0);
                    resWaitingHtml += "<hr /><p style='text-align:center;'>No Waiting calls</p>";
                }
                $("#divWaitingCalls").html(resWaitingHtml);
            }
            else {
                console.log(res.Message);
                $("#divActiveCalls").html("<hr /><p style='text-align:center;'>No Active calls</p>");
                $("#divWaitingCalls").html("<hr /><p style='text-align:center;'>No Waiting calls</p>");
            }
            initializeTimers();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#divActiveCalls").html("<hr /><p style='text-align:center;'>No Active calls</p>");
            $("#divWaitingCalls").html("<hr /><p style='text-align:center;'>No Waiting calls</p>");
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
function getAgentsAvgTalkTimeVsWaitTimeReport() {
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
        data: { type: 4, studioId: studioId },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.ReportDetails.length > 0) {
                    //    console.log(res);
                    var arrValues = [];
                    for (var i = 0; i < res.ReportDetails.length; i++) {
                        //if (i % 2 == 0) {
                        //    arrValues.push([res.ReportDetails[i].Hour + ":00", 10, 0]);
                        //} else {
                        //    arrValues.push([res.ReportDetails[i].Hour + ":00", 7, 1]);
                        //}
                        arrValues.push([res.ReportDetails[i].Hour + ":00", parseFloat(res.ReportDetails[i].AvgTalkTime), parseFloat(res.ReportDetails[i].AvgWaitTime)]);
                    }
                    var figures = new google.visualization.DataTable();
                    figures.addColumn('string', 'Hours');
                    figures.addColumn('number', 'Average Talk time');
                    figures.addColumn('number', 'Average Wait time');
                    figures.addRows(arrValues);

                    var options = {
                        curveType: 'function',
                        legend: { position: 'top' },
                        animation: {
                            startup: true,
                            duration: 1000,
                            easing: 'out',
                        },
                        hAxis: {
                            baseline: 1,
                            baselineColor: 'blue'
                        },
                        vAxis: {
                            viewWindow: { min: 0 },
                            title: "minutes",
                            //format: "#,###",
                            titleTextStyle: {
                                fontName: "Times New Roman",
                                italic: true,
                                fontSize: 16
                            },
                            gridlines: {
                                color: 'transparent'
                            }
                        },
                        height: 250
                    };

                    var chart = new google.visualization.LineChart(document.getElementById('divAvgTalktimeReport'));

                    chart.draw(figures, options);
                } else {
                    $("#divAvgTalktimeReport").html("No Reports");
                    console.log(res.Message);
                }
            }
            else {
                $("#divAvgTalktimeReport").html("No Reports");
                console.log(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#divAvgTalktimeReport").html("No Reports");
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
function getAgentsHandleTimeByHourReport() {
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
        data: { type: 5, studioId: studioId },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.ReportDetails.length > 0) {
                    //    console.log(res);
                    var arrValues = [];
                    for (var i = 0; i < res.ReportDetails.length; i++) {
                        //arrValues.push([res.ReportDetails[i].Hour + ":00", 10, 2, 1]);
                        arrValues.push([res.ReportDetails[i].Hour + ":00", parseFloat(res.ReportDetails[i].AvgTalkTime), parseFloat(res.ReportDetails[i].AvgHoldTime), parseFloat(res.ReportDetails[i].AvgACWTime)]);
                    }
                    var figures = new google.visualization.DataTable();
                    figures.addColumn('string', 'Hours');
                    figures.addColumn('number', 'Talk time');
                    figures.addColumn('number', 'Hold time');
                    figures.addColumn('number', 'After call work');
                    figures.addRows(arrValues);

                    var options = {
                        legend: { position: 'top', maxLines: 2 },
                        bar: { groupWidth: '75%' },
                        isStacked: true,
                        animation: {
                            startup: true,
                            duration: 1000,
                            easing: 'out',
                        },
                        vAxis: {
                            viewWindow: { min: 0 },
                            title: "minutes",
                            //format: "#,###",
                            titleTextStyle: {
                                fontName: "Times New Roman",
                                italic: true,
                                fontSize: 16
                            },
                            gridlines: {
                                color: 'transparent'
                            }
                        },
                        colors: ["#5d55b1", "#dcc30f", "#87cefa"],
                        height: 250
                    };

                    var chart = new google.visualization.ColumnChart(document.getElementById('divAvgHandletimeReport'));

                    chart.draw(figures, options);
                } else {
                    $("#divAvgHandletimeReport").html("No Reports");
                    console.log(res.Message);
                }
            }
            else {
                $("#divAvgHandletimeReport").html("No Reports");
                console.log(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#divAvgHandletimeReport").html("No Reports");
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
function getAgentsCallAbandonmentByHourReport() {
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
        data: { type: 6, studioId: studioId },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.ReportDetails.length > 0) {
                    //    console.log(res);
                    var arrValues = [];
                    for (var i = 0; i < res.ReportDetails.length; i++) {
                        //if (i % 2 != 0) {
                        //    arrValues.push([res.ReportDetails[i].Hour + ":00", 10, 0, 0, 0]);
                        //    arrValues.push([res.ReportDetails[i].Hour + ":00", 0, 1, 2, 3]);
                        //}
                        arrValues.push([res.ReportDetails[i].Hour + ":00", parseInt(res.ReportDetails[i].Total), 0, 0, 0]);
                        arrValues.push([res.ReportDetails[i].Hour + ":00", 0, parseInt(res.ReportDetails[i].Rate60), parseInt(res.ReportDetails[i].Rate40), parseInt(res.ReportDetails[i].Rate20)]);
                    }
                    var figures = new google.visualization.DataTable();
                    figures.addColumn('string', 'Hours');
                    figures.addColumn('number', 'Total Calls');
                    figures.addColumn('number', ' 40 - 60 sec');
                    figures.addColumn('number', ' 20 - 40 sec');
                    figures.addColumn('number', ' < 20 sec');
                    figures.addRows(arrValues);

                    var options = {
                        legend: { position: 'top', maxLines: 2 },
                        bar: { groupWidth: '75%' },
                        isStacked: true,
                        animation: {
                            startup: true,
                            duration: 1000,
                            easing: 'out',
                        },
                        vAxis: {
                            viewWindow: { min: 0 },
                            title: "no of calls",
                            //format: "#,###",
                            titleTextStyle: {
                                fontName: "Times New Roman",
                                italic: true,
                                fontSize: 16
                            },
                            gridlines: {
                                color: 'transparent'
                            }
                        },
                        colors: ["#356bbf", "#cd4128", "#f06211", "#5584b1"],
                        height: 250
                    };

                    var chart = new google.visualization.ColumnChart(document.getElementById('divAbandonmentReport'));
                    chart.draw(figures, options);
                    //var chart = new google.charts.Bar(document.getElementById('divAbondanmentReport'));
                    //chart.draw(figures, google.charts.Bar.convertOptions(options));
                } else {
                    console.log(res.Message);
                    $("#divAbandonmentReport").html("No Reports");
                }
            }
            else {
                console.log(res.Message);
                $("#divAbandonmentReport").html("No Reports");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#divAbandonmentReport").html("No Reports");
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
function getLoggedInAgents() {
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
            global_AgentsList = "";
            if (res.Success == "True") {
                if (res.AgentDetails.length > 0) {
                    for (var i = 0; i < res.AgentDetails.length; i++) {
                        global_AgentsList += "<option value='" + res.AgentDetails[i].Id + "'>" + res.AgentDetails[i].Name + "</option>";
                    }
                } else {
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
function startCount(td_id) {
    var timer = setInterval(count, 1000, td_id);
    id_and_timers.push({ "td_id": td_id, "timer": timer });
}
function count(td_id) {
    var time_shown = $("#" + td_id).text();
    if (time_shown == "") {
        time_shown = "00:00:00";
    }
    var time_chunks = time_shown.split(":");
    var hour, mins, secs;

    hour = Number(time_chunks[0]);
    mins = Number(time_chunks[1]);
    secs = Number(time_chunks[2]);
    secs++;
    if (secs == 60) {
        secs = 0;
        mins = mins + 1;
    }
    if (mins == 60) {
        mins = 0;
        hour = hour + 1;
    }
    //if (hour == 13) {
    //    hour = 1;
    //}

    $("#" + td_id).text(getCurrent(hour) + ":" + getCurrent(mins) + ":" + getCurrent(secs));

}

function getCurrent(digit) {

    var zpad = digit + '';
    if (digit < 10) {
        zpad = "0" + zpad;
    }
    return zpad;
}

function resetTimers() {
    if (id_and_timers.length > 0) {
        for (var i = 0; i < id_and_timers.length; i++) {
            console.log("Clearing", id_and_timers[i]);
            console.log(id_and_timers[i].timer)
            clearInterval(id_and_timers[i].timer);
        }
    }
    id_and_timers = [];
}

function initializeTimers() {
    $(".tdActiveCallsTimer").each(function () {
        var initialCount = $(this).text();
        if (initialCount == "") { initialCount = "00:00:00"; }
        startCount($(this).attr("id"), initialCount);
    });
}

function loginVerto() {
    

    var loginNumber = "", Password = "", ip = "", port = "", url = ""

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
            type: 1
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.GatewayDetails.length > 0) {
                    if (res.GatewayDetails[0].OriginationUrl.indexOf("verto.rtc") >= 0) {
                        loginNumber = res.GatewayDetails[0].UserName;
                        password = res.GatewayDetails[0].Password;
                        ip = res.GatewayDetails[0].Ip;
                        port = res.GatewayDetails[0].Port;
                        url = "wss://" + ip + ":" + port;
                        Initlogin(loginNumber, password, url, ip);
                    }
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

function changeVertoRegistrationStatus(status) {
    //$.blockUI({
    //    message: '<img src="/assets/img/Press3_Gif.gif" />',
    //    css: {
    //        border: 'none',
    //        backgroundColor: 'transparent',
    //    }
    //});
    $.ajax({
        url: "Handlers/Agents.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 3, Status: status
        },
        success: function (res) {
           // $.unblockUI();
            if (res.Success == "True") {

            }
            else {

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
          //  $.unblockUI();
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

function CallActions(callId, toAgentId, mode, calEvent) {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });

    $.ajax({
        url: "Handlers/Manager.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 11, CallId: callId, ToAgentId: toAgentId, Mode: mode, CallEvent: calEvent
        },
        success: function (res) {
            $.unblockUI();
            console.log($(".lblListen[CallId='" + callId + "']").html());
            if (res.Success == "True") {
                if (calEvent == "Listen Start") {
                    $(".lblListen[CallId='" + callId + "']").attr("Event", "Listen End");
                    $(".lblListen[CallId='" + callId + "']").attr("RequestUUID", res.RequestUUID);
                    $(".lblListen[CallId='" + callId + "']").attr("HttpURL", res.ConferenceInfo[0].HttpUrl);
                    $(".lblListen[CallId='" + callId + "']").removeClass("btn-grey").addClass("btn-success");
                }
                else if (calEvent == "Whisper Start") {
                    $(".lblWhisper[CallId='" + callId + "']").attr("Event", "Whisper End");
                    $(".lblWhisper[CallId='" + callId + "']").attr("RequestUUID", res.RequestUUID);
                    $(".lblWhisper[CallId='" + callId + "']").attr("HttpURL", res.ConferenceInfo[0].HttpUrl);
                    $(".lblWhisper[CallId='" + callId + "']").removeClass("btn-grey").addClass("btn-success");
                }
                else if (calEvent == "Join Start") {
                    $(".lblJoin[CallId='" + callId + "']").attr("Event", "Join End");
                    $(".lblJoin[CallId='" + callId + "']").attr("RequestUUID", res.RequestUUID);
                    $(".lblJoin[CallId='" + callId + "']").attr("HttpURL", res.ConferenceInfo[0].HttpUrl);
                    $(".lblJoin[CallId='" + callId + "']").removeClass("btn-grey").addClass("btn-success");
                }
            }
            else {
                alert(res.Message);
                $(".lblListen[CallId='" + callId + "']").attr("Event", "Listen End");
                $(".lblListen[CallId='" + callId + "']").attr("RequestUUID", "");
                $(".lblListen[CallId='" + callId + "']").attr("HttpURL", "");
                $(".lblListen[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
                $(".lblWhisper[CallId='" + callId + "']").attr("Event", "Whisper End");
                $(".lblWhisper[CallId='" + callId + "']").attr("RequestUUID", "");
                $(".lblWhisper[CallId='" + callId + "']").attr("HttpURL", "");
                $(".lblWhisper[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
                $(".lblJoin[CallId='" + callId + "']").attr("Event", "Join End");
                $(".lblJoin[CallId='" + callId + "']").attr("RequestUUID", "");
                $(".lblJoin[CallId='" + callId + "']").attr("HttpURL", "");
                $(".lblJoin[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $(".lblListen[CallId='" + callId + "']").attr("Event", "Listen End");
            $(".lblListen[CallId='" + callId + "']").attr("RequestUUID", "");
            $(".lblListen[CallId='" + callId + "']").attr("HttpURL", "");
            $(".lblListen[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
            $(".lblWhisper[CallId='" + callId + "']").attr("Event", "Whisper End");
            $(".lblWhisper[CallId='" + callId + "']").attr("RequestUUID", "");
            $(".lblWhisper[CallId='" + callId + "']").attr("HttpURL", "");
            $(".lblWhisper[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
            $(".lblJoin[CallId='" + callId + "']").attr("Event", "Join End");
            $(".lblJoin[CallId='" + callId + "']").attr("RequestUUID", "");
            $(".lblJoin[CallId='" + callId + "']").attr("HttpURL", "");
            $(".lblJoin[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
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

function HangUp(callId, httpUrl, requestUUID, callEvent) {
    if (requestUUID == "") {
        alert("can not hangup right now");
        return false;
    }
    if (httpUrl == "") {
        alert("can not hangup right now");
        return false;
    }

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });

    $.ajax({
        url: "Handlers/Conference.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 7, TalkingAgentRequestUUID: requestUUID, HttpURL: httpUrl
        },
        success: function (res) {
            $.unblockUI();
            console.log($(".lblListen[CallId='" + callId + "']").html());
            $(".lblListen[CallId='" + callId + "']").removeClass("btn-success").addClass("btn-grey");
            if (res.Success == true) {
                $(".managerActions").removeAttr("disabled");
                if (callEvent == "Listen End") {
                    $(".lblListen[CallId='" + callId + "']").attr("Event", "Listen Start");
                    $(".lblListen[CallId='" + callId + "']").attr("RequestUUID", "");
                    $(".lblListen[CallId='" + callId + "']").attr("HttpURL", "");
                    $(".lblListen[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
                }
                else if (callEvent == "Whisper End") {
                    $(".lblWhisper[CallId='" + callId + "']").attr("Event", "Whisper Start");
                    $(".lblWhisper[CallId='" + callId + "']").attr("RequestUUID", "");
                    $(".lblWhisper[CallId='" + callId + "']").attr("HttpURL", "");
                    $(".lblWhisper[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
                }
                else if (callEvent == "Join End") {
                    $(".lblJoin[CallId='" + callId + "']").attr("Event", "Join Start");
                    $(".lblJoin[CallId='" + callId + "']").attr("RequestUUID", "");
                    $(".lblJoin[CallId='" + callId + "']").attr("HttpURL", "");
                    $(".lblJoin[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
                }
            }
            else {
                alert(res.Message);
                $(".lblListen[CallId='" + callId + "']").attr("Event", "Listen Start");
                $(".lblListen[CallId='" + callId + "']").attr("RequestUUID", "");
                $(".lblListen[CallId='" + callId + "']").attr("HttpURL", "");
                $(".lblListen[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
                $(".lblWhisper[CallId='" + callId + "']").attr("Event", "Whisper Start");
                $(".lblWhisper[CallId='" + callId + "']").attr("RequestUUID", "");
                $(".lblWhisper[CallId='" + callId + "']").attr("HttpURL", "");
                $(".lblWhisper[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
                $(".lblJoin[CallId='" + callId + "']").attr("Event", "Join Start");
                $(".lblJoin[CallId='" + callId + "']").attr("RequestUUID", "");
                $(".lblJoin[CallId='" + callId + "']").attr("HttpURL", "");
                $(".lblJoin[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $(".lblListen[CallId='" + callId + "']").attr("Event", "Listen Start");
            $(".lblListen[CallId='" + callId + "']").attr("RequestUUID", "");
            $(".lblListen[CallId='" + callId + "']").attr("HttpURL", "");
            $(".lblListen[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
            $(".lblWhisper[CallId='" + callId + "']").attr("Event", "Whisper Start");
            $(".lblWhisper[CallId='" + callId + "']").attr("RequestUUID", "");
            $(".lblWhisper[CallId='" + callId + "']").attr("HttpURL", "");
            $(".lblWhisper[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
            $(".lblJoin[CallId='" + callId + "']").attr("Event", "Join Start");
            $(".lblJoin[CallId='" + callId + "']").attr("RequestUUID", "");
            $(".lblJoin[CallId='" + callId + "']").attr("HttpURL", "");
            $(".lblJoin[CallId='" + callId + "']").addClass("btn-grey").removeClass("btn-success");
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
function setPriority(priority) {
    var priorities = "";
    if (priority == 0) {
        priorities += "<option value=0 selected='true'>Not Set</option>";
    }
    else {
        priorities += "<option value=0>Not Set</option>";
    }
    for (var i = 1; i < 11; i++) {
        if (i == parseInt(priority)) {
            priorities += "<option value='" + i + "' selected='true' >" + i + "</option>";
        } else {
            priorities += "<option value='" + i + "' >" + i + "</option>";
        }
    }
    return priorities;
}