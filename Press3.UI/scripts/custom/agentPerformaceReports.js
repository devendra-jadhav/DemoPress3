var now = new Date();
var getMonth = now.getMonth();
var month = 0;
var year = now.getFullYear();

$(document).ready(function () {

    
    alert("Hello");
    month = 01;
    //getAgentPerformanceReports();


    if (getMonth == 11) {
        month = 12;
    } else {
        month = getMonth + 1
        if (month.toString().length == 1) {
            month = '0' + month
        }
    }



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

    $.ajax({
        type: "GET",
        url: "Handlers/Manager.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 39, month: month, year: year },
        success: function (res) {
            if (res.Success == "True") {

                var resHtml = "";
                var resAgentHtml = "";
                if (res.AgentAccuTimeDetails.length > 0) {


                    $("#agentPerformCharts").html(resHtml);

                    for(var i=0;i<res.AgentAccuTimeDetails.length;i++)
                    {


                        resHtml += "<div class='col-sm-6'><div id='chart"+i+"' style='height:250px;border:1px solid;'> </div></div>";


                    }



                    $("#agentPerformCharts").html(resHtml);


                }

               
              

                  
                    function drawChart() {

                        var data = "";

                        var options = "";

                       

                        

                        for (var j = 0; j < res.AgentAccuTimeDetails.length; j++)
                        {

                            var AvgOnCallTimeInSeconds = res.AgentAccuTimeDetails[j].AvgOnCallTimeInSeconds;
                           
                            if (AvgOnCallTimeInSeconds == "")
                            {
                                AvgOnCallTimeInSeconds = 0;
                            }
                            else
                            {
                                AvgOnCallTimeInSeconds = parseInt(AvgOnCallTimeInSeconds);

                            }
                           


                            var AvgAcwTimeInSeconds = res.AgentAccuTimeDetails[j].AvgAcwTimeInSeconds;
                            if (AvgAcwTimeInSeconds == "") {
                                AvgAcwTimeInSeconds = 0;
                            }
                            else {
                                AvgAcwTimeInSeconds = parseInt(AvgAcwTimeInSeconds);

                            }


                            var AvgOwaTimeInSeconds = res.AgentAccuTimeDetails[j].AvgOwaTimeInSeconds;
                            if (AvgOwaTimeInSeconds == "") {
                                AvgOwaTimeInSeconds = 0;
                            }
                            else {
                                AvgOwaTimeInSeconds = parseInt(AvgOwaTimeInSeconds);

                            }

                            var AvgInBreakTimeInSeconds = res.AgentAccuTimeDetails[j].AvgInBreakTimeInSeconds;
                            if (AvgInBreakTimeInSeconds == "") {
                                AvgInBreakTimeInSeconds = 0;
                            }
                            else {
                                AvgInBreakTimeInSeconds = parseInt(AvgInBreakTimeInSeconds);

                            }

                            var AvgIdleTimeInSeconds = res.AgentAccuTimeDetails[j].AvgIdleTimeInSeconds;
                            if (AvgIdleTimeInSeconds == "") {
                                AvgIdleTimeInSeconds = 0;
                            }
                            else {
                                AvgIdleTimeInSeconds = parseInt(AvgIdleTimeInSeconds);

                            }
                          

                            var total = AvgOnCallTimeInSeconds + AvgAcwTimeInSeconds + AvgOwaTimeInSeconds + AvgInBreakTimeInSeconds + AvgIdleTimeInSeconds;


                            //AvgOnCallTimeInSeconds = (AvgOnCallTimeInSeconds / total) * 360;
                            //AvgAcwTimeInSeconds = (AvgAcwTimeInSeconds / total) * 360;
                            //AvgOwaTimeInSeconds = (AvgOwaTimeInSeconds / total) * 360;
                            //AvgInBreakTimeInSeconds = (AvgInBreakTimeInSeconds / total) * 360;
                            //AvgIdleTimeInSeconds = (AvgIdleTimeInSeconds / total) * 360;

                          


                         data = google.visualization.arrayToDataTable([
                         ['Task', 'Hours per Day'],
                         ['AvgOnCallTime', AvgOnCallTimeInSeconds],
                         ['AvgAcwTime', AvgAcwTimeInSeconds],
                         ['AvgOwaTime', AvgOwaTimeInSeconds],
                         ['AvgInBreakTime', AvgInBreakTimeInSeconds],
                         ['AvgIdleTime', AvgIdleTimeInSeconds]
                            ]);

                            var agentid= res.AgentAccuTimeDetails[j].AgentId;
                            var name = res.AgentAccuTimeDetails[j].Name;
                            var temp = "";
                            if (total == 0)
                            {
                                temp = "( No Data )";
                            }

                            options = {
                               
                                title: 'Agent - '+ name + temp,
                                sliceVisibilityThreshold: 0,

                            };


                            new google.visualization.PieChart(document.getElementById('chart' + j)).draw(data, options);
                            
                            
                        }

                       

                    }
                   



                

                google.charts.load('current', { 'packages': ['corechart'] });
                google.charts.setOnLoadCallback(drawChart);


                  
                
                for (var k = 0; k < res.AgentAccuTimeDetails.length; k++) {

                    

                    var serviceLevel = res.AgentAccuTimeDetails[k].ServiceLevel;
                    if (serviceLevel == "")
                    {
                        serviceLevel = 0;
                    }



                    var agentrating = res.AgentAccuTimeDetails[k].AvgAgentRatings;
                    if (agentrating == "")
                    {
                        agentrating = 0;

                    }



                    var handletime = res.AgentAccuTimeDetails[k].AvgHandleTimeInSeconds;
                    if (handletime == "")
                    {
                        handletime = "00:00:00";

                    }
                    else {

                        handletime=  secondsToHms(handletime);

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


                $("#agentMetricsTable").html(resAgentHtml);




                //////ddd

                var arrayfirst = ['AgentName', 'Answered Calls', 'Unanswered Calls', 'Minutes'];
                var arrValuesMain = [];
                arrValuesMain.push(arrayfirst);

                for (var p = 0; p < res.AgentAccuTimeDetails.length; p++)
                {
                    var arrValues = [];

                  
                        

                        arrValues.push(res.AgentAccuTimeDetails[p].Name);
                        arrValues.push(parseInt( res.AgentAccuTimeDetails[p].AvgAnsweredCalls));
                        arrValues.push( parseInt( res.AgentAccuTimeDetails[p].AvgUnAnsweredCalls));
                        arrValues.push(100);


                   

                    arrValuesMain.push(arrValues);

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

                    var chart = new google.visualization.ComboChart(document.getElementById('divCallsByMinutes'));
                    chart.draw(data, options);
                }



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

function secondsToHms(d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}