
var now = new Date();
var getMonth = now.getMonth();
var month = 0;
var year = now.getFullYear();
var accountId = 0, agentsId = 0, roleId = 0;

$(document).ready(function () {

    accountId = $("#hdnAccountId").val();
    agentsId = $("#hdnAgentId").val();
    roleId = $("#hdnRoleId").val();


    month = 01;
    if (getMonth == 11) {
        month = 12;
    } else {
        month = getMonth + 1
        if (month.toString().length == 1) {
            month = '0' + month
        }
    }











    //Highcharts.chart('divCallsByMinutess', {
    //    chart: {
    //        type: 'column'
    //    },
    //    title: {
    //        text: 'Monthly Average Rainfall'
    //    },
    //    subtitle: {
    //        text: 'Source: WorldClimate.com'
    //    },
    //    xAxis: {
    //        categories: [
    //            'Jan',
    //            'Feb',
    //            'Mar',
    //            'Apr',
    //            'May',
    //            'Jun',
    //            'Jul',
    //            'Aug',
    //            'Sep',
    //            'Oct',
    //            'Nov',
    //            'Dec',
    //            'ff',
    //            'uu'
    //        ],
    //        crosshair: true
    //    },
    //    yAxis: {
    //        min: 0,
    //        title: {
    //            text: 'Calls'
    //        }
    //    },
    //    tooltip: {
    //        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    //        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
    //            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
    //        footerFormat: '</table>',
    //        shared: true,
    //        useHTML: true
    //    },
    //    plotOptions: {
    //        column: {
    //            pointPadding: 0.2,
    //            borderWidth: 0
    //        }
    //    },
    //    series: [{
    //        name: 'Tokyo',
    //        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 80.23, 78.21]

    //    }, {
    //        name: 'New York',
    //        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3, 80.23, 78.21]

    //    }]
    //});














    getAgentPerformanceReports();

    $("#txt-datepicker").datepicker({
        format: "mm-yyyy",
        viewMode: "months",
        minViewMode: "months",
        endDate: month + '-' + now.getFullYear(),
        keyboardNavigation: true
    });
    $("#txt-datepicker").val(month + '-' + now.getFullYear());

    $("#btn-submit").click(function () {
        var selectedDate = $("#txt-datepicker").val();
        if (selectedDate == "") {
            alert("Select month and year");
            return false;
        } else {
            var dates = selectedDate.toString().split("-");
            month = dates[0];
            year = dates[1];
            getAgentPerformanceReports();
        }
    });




});

function getAgentPerformanceReports() {

    //$("#btn-submit").attr("disabled", true);
    //$("#agentPerformCharts").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");
    //$("#divCallsByMinutes").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");
    //$("#agentMetricsTable").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");


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
        data: { type: 39, month: month, year: year, agentsId: agentsId, roleId: roleId },
        success: function (res) {
            $.unblockUI();

          //  $("#btn-submit").attr("disabled", false);
            if (res.Success == "True") {

                var resHtml = "";
                var resAgentHtml = "";
                $("#agentPerformCharts").html(resHtml);
                $("#divCallsByMinutes").html(resHtml);
                $("#agentMetricsTable").html(resHtml);


                if (res.AgentAccuTimeDetails.length != 0) {


                    //var agtWithNoTotal = 0;

                    //for (var z = 0; z < res.AgentAccuTimeDetails.length; z++)
                    //{
                    //    var tot = parseInt(res.AgentAccuTimeDetails[z].SumOnCallTimeInSeconds) + parseInt(res.AgentAccuTimeDetails[z].SumAcwTimeInSeconds) + parseInt(res.AgentAccuTimeDetails[z].SumOwaTimeInSeconds) + parseInt(res.AgentAccuTimeDetails[z].SumInBreakTimeInSeconds) + parseInt(res.AgentAccuTimeDetails[z].SumIdleTimeInSeconds);
                    //    if (tot>0)
                    //    {
                    //        agtWithNoTotal = agtWithNoTotal + 1;
                    //    }
                    //}


                    for (var i = 0; i < res.AgentAccuTimeDetails.length; i++) {

                        var tot = parseInt(res.AgentAccuTimeDetails[i].SumOnCallTimeInSeconds) + parseInt(res.AgentAccuTimeDetails[i].SumAcwTimeInSeconds) + parseInt(res.AgentAccuTimeDetails[i].SumOwaTimeInSeconds) + parseInt(res.AgentAccuTimeDetails[i].SumInBreakTimeInSeconds) + parseInt(res.AgentAccuTimeDetails[i].SumIdleTimeInSeconds);

                        if (tot > 0)
                        {
                            resHtml += "<div class='col-sm-6'><div id='chart" + i + "' style='height:250px;border:1px solid;'> </div></div>";

                        }
                       
                    }
                    $("#agentPerformCharts").html(resHtml);


                }
                else {
                    $("#agentPerformCharts").html("<div>No Records Present</div>");

                    $("#divCallsByMinutes").html("</br><center>No Records Present</center>");
                   
                }

                function drawChart() {
                    var data = "";
                    var options = "";
                    for (var j = 0; j < res.AgentAccuTimeDetails.length; j++) {
                        var SumOnCallTimeInSeconds = res.AgentAccuTimeDetails[j].SumOnCallTimeInSeconds;
                        if (SumOnCallTimeInSeconds == "") {
                            SumOnCallTimeInSeconds = 0;
                        }
                        else {
                            SumOnCallTimeInSeconds = parseInt(SumOnCallTimeInSeconds);
                        }

                        var SumAcwTimeInSeconds = res.AgentAccuTimeDetails[j].SumAcwTimeInSeconds;
                        if (SumAcwTimeInSeconds == "") {
                            SumAcwTimeInSeconds = 0;
                        }
                        else {
                            SumAcwTimeInSeconds = parseInt(SumAcwTimeInSeconds);
                        }

                        var SumOwaTimeInSeconds = res.AgentAccuTimeDetails[j].SumOwaTimeInSeconds;
                        if (SumOwaTimeInSeconds == "") {
                            SumOwaTimeInSeconds = 0;
                        }
                        else {
                            SumOwaTimeInSeconds = parseInt(SumOwaTimeInSeconds);
                        }

                        var SumInBreakTimeInSeconds = res.AgentAccuTimeDetails[j].SumInBreakTimeInSeconds;
                        if (SumInBreakTimeInSeconds == "") {
                            SumInBreakTimeInSeconds = 0;
                        }
                        else {
                            SumInBreakTimeInSeconds = parseInt(SumInBreakTimeInSeconds);
                        }

                        var SumIdleTimeInSeconds = res.AgentAccuTimeDetails[j].SumIdleTimeInSeconds;
                        if (SumIdleTimeInSeconds == "") {
                            SumIdleTimeInSeconds = 0;
                        }
                        else {
                            SumIdleTimeInSeconds = parseInt(SumIdleTimeInSeconds);

                        }
                        var total = SumOnCallTimeInSeconds + SumAcwTimeInSeconds + SumOwaTimeInSeconds + SumIdleTimeInSeconds;


                        //AvgOnCallTimeInSeconds = (AvgOnCallTimeInSeconds / total) * 360;
                        //AvgAcwTimeInSeconds = (AvgAcwTimeInSeconds / total) * 360;
                        //AvgOwaTimeInSeconds = (AvgOwaTimeInSeconds / total) * 360;
                        //AvgInBreakTimeInSeconds = (AvgInBreakTimeInSeconds / total) * 360;
                        //AvgIdleTimeInSeconds = (AvgIdleTimeInSeconds / total) * 360;



                        data = google.visualization.arrayToDataTable([
                        ['Task', 'Hours per Day'],
                        ['Total OnCall Time', SumOnCallTimeInSeconds],
                        ['Total Acw Time', SumAcwTimeInSeconds],
                        ['Total Owa Time', SumOwaTimeInSeconds],
                        ['Total InBreak Time', SumInBreakTimeInSeconds],
                        ['Total Idle Time', SumIdleTimeInSeconds]
                        ]);

                        var agentid = res.AgentAccuTimeDetails[j].AgentId;
                        var name = res.AgentAccuTimeDetails[j].Name;
                        var temp = "";
                        if (total == 0) {
                            temp = "( No Data )";
                        }

                        options = {

                            title: 'Agent - ' + name +' ' +temp,
                            sliceVisibilityThreshold: 0,

                        };
                        if (total != 0)
                        {
                            new google.visualization.PieChart(document.getElementById('chart' + j)).draw(data, options);

                        }
                       

                    }

                }

                if (res.AgentAccuTimeDetails.length > 0) {
                    google.charts.load('current', { 'packages': ['corechart'] });
                    google.charts.setOnLoadCallback(drawChart);

                }

                if (res.AgentAccuTimeDetails.length > 0) {
                    for (var k = 0; k < res.AgentAccuTimeDetails.length; k++) {

                        var serviceLevel = res.AgentAccuTimeDetails[k].ServiceLevel;
                        if (serviceLevel == "") {
                            serviceLevel = 0;
                        }

                        var agentrating = res.AgentAccuTimeDetails[k].AvgAgentRatings;
                        if (agentrating == "") {
                            agentrating = 0;
                        }

                        var handletime = res.AgentAccuTimeDetails[k].AvgHandleTimeInSeconds;
                        if (handletime == "") {
                            handletime = "00:00:00";
                        }
                        else {
                            handletime = secondsToHms(handletime);
                        }

                        var speedofans = res.AgentAccuTimeDetails[k].AvgSpeedOfAnswerInSeconds;
                        if (speedofans == "") {
                            speedofans = "00:00:00";
                        }
                        else {
                            speedofans = secondsToHms(speedofans);
                        }

                        var talktime = res.AgentAccuTimeDetails[k].AvgTalkTimeInSeconds;
                        if (talktime == "") {
                            talktime = "00:00:00";
                        }
                        else {
                            talktime = secondsToHms(talktime);
                        }
                        resAgentHtml += "<tr>";
                        resAgentHtml += "<td>" + res.AgentAccuTimeDetails[k].Name + "</td><td>" + serviceLevel + "</td><td>" + agentrating + "</td><td>" + handletime + "</td><td>" + speedofans + "</td><td>" + talktime + "</td>";
                        resAgentHtml += "</tr>";

                    }
                }
                else {
                    resAgentHtml = "<tr><td colspan='6'><center>No Records Present</center></td></tr>";
                }

                $("#agentMetricsTable").html(resAgentHtml);




                //////ddd

                var arrayfirst = ['AgentName', 'Answered Calls', 'Unanswered Calls'];
                var arrValuesMain = [];
                arrValuesMain.push(arrayfirst);

                if (res.AgentAccuTimeDetails.length > 0) {

                    for (var p = 0; p < res.AgentAccuTimeDetails.length; p++) {
                        var arrValues = [];


                        var AnsUnsSum = parseInt(res.AgentAccuTimeDetails[p].SumAnsweredCalls) + parseInt(res.AgentAccuTimeDetails[p].SumUnAnsweredCalls);

                        if (AnsUnsSum > 0)
                        {

                            arrValues.push(res.AgentAccuTimeDetails[p].Name);
                            arrValues.push(parseInt(res.AgentAccuTimeDetails[p].SumAnsweredCalls));
                            arrValues.push(parseInt(res.AgentAccuTimeDetails[p].SumUnAnsweredCalls));
                            //  arrValues.push(parseInt(0));
                            arrValuesMain.push(arrValues);
                        }

                       
                    }

                    
                }
                else {
                    arrValuesMain.push(['', 0, 0, 0]);
                }

                google.charts.load('current', { 'packages': ['corechart'] });
                google.charts.setOnLoadCallback(drawVisualization);

                function drawVisualization() {
                    // Some raw data (not necessarily accurate)
                    var data = google.visualization.arrayToDataTable(arrValuesMain);

                    var options = {
                        title: 'Calls/Minutes by Agent',
                        vAxis: { title: 'Number of Calls' },
                        hAxis: { title: 'Agents' },
                        seriesType: 'bars',
                        series: { 2: { type: 'line' } }
                    };

                    var chart = new google.visualization.ColumnChart(document.getElementById('divCallsByMinutes'));
                    chart.draw(data, options);
                }
            }
            else {

                $("#agentPerformCharts").html("<div>No Records Present</div>");

                $("#divCallsByMinutes").html("</br><center>No Records Present</center>");
                $("#agentMetricsTable").html("<tr><td colspan='6'><center>No Records Present</center></td></tr>");

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

function secondsToHms(d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}