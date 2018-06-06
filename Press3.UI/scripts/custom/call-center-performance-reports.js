var now = new Date();
var getMonth = now.getMonth();
var month = 0;
var year = now.getFullYear();

$(document).ready(function () { 
    $(".pie_progress").asPieProgress({
        'namespace': 'pie_progress'
    });
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
            getCallCenterPerformanceReports();
        }
    });
    getCallCenterPerformanceReports();
});

function getCallCenterPerformanceReports() {

    //$("#btn-submit").attr("disabled", true);
    //$("#divAvgTalktimeReport").html("<img style='margin-left:300px;margin-top:80px;' src='/assets/img/ajax-loader.gif' />");
    //$("#divAbandonmentReport").html("<img style='margin-left:300px;margin-top:80px;' src='/assets/img/ajax-loader.gif' />");
    //$("#divAvgHandletimeReport").html("<img style='margin-left:300px;margin-top:80px;' src='/assets/img/ajax-loader.gif' />");


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
        data: { type: 38, month: month, year: year },
        success: function (res) {
            $.unblockUI();

           // $("#btn-submit").attr("disabled", false);
            if (res.Success == "True") {
                if (res.ReportDetails.length > 0) {
                    var targetSLA = res.ReportDetails[0].TargetSLA;
                    $("#div-pie-SLA").attr("aria-valuenow", res.ReportDetails[0].CurrentSLA);
                    $('#div-pie-SLA').asPieProgress('go', res.ReportDetails[0].CurrentSLA);
                    $("#div-current-SLA").text(res.ReportDetails[0].CurrentSLA + '%');
                    $("#div-target-SLA").text("Target SLA - " + targetSLA + '%');
                    $("#spn-threshold-SLA").text(res.ReportDetails[0].SLAThresholdInSeconds);
                    $("#div-total-calls").text(res.ReportDetails[0].TotalCalls);
                    $("#div-answered-calls").text(res.ReportDetails[0].AnsweredCalls);
                    $("#div-abandoned-calls").text(res.ReportDetails[0].AbandonedCalls);
                    $("#div-missed-calls").text(res.ReportDetails[0].MissedCalls);
                    $("#div-handle-time").text(res.ReportDetails[0].AvgHandleTime);
                    $("#div-talk-time").text(res.ReportDetails[0].AvgTalkTime);
                    $("#div-answer-speed").text(res.ReportDetails[0].AvgSpeedOfAnswer);
                } else {
                    $("#div-pie-SLA").attr("aria-valuenow", 0);
                    $('#div-pie-SLA').asPieProgress('go', 0);
                    $("#div-current-SLA").text(0 + '%');
                    $("#div-target-SLA").text("Target SLA - " + 0 + '%');
                    $("#spn-threshold-SLA").text(0);
                    $("#div-total-calls").text(0);
                    $("#div-answered-calls").text(0);
                    $("#div-abandoned-calls").text(0);
                    $("#div-missed-calls").text(0);
                    $("#div-handle-time").text('00:00');
                    $("#div-talk-time").text('00:00');
                    $("#div-answer-speed").text('00:00');
                }
                //-------------------------------------------------SLA report starts----------------------------------------------------------------//
                if (res.SLAReportDetails.length > 0) {
                    var arrSLAValues = [];
                    for (var i = 0; i < res.SLAReportDetails.length; i++) {
                        //arrSLAValues.push(["0", 0, parseFloat(targetSLA)]);
                        arrSLAValues.push([res.SLAReportDetails[i].Dates, parseFloat(res.SLAReportDetails[i].CurrentSLA), parseFloat(targetSLA)]);
                    }
                    var figures = new google.visualization.DataTable();
                    figures.addColumn('string', 'Days');
                    figures.addColumn('number', 'Current SLA');
                    figures.addColumn('number', 'Target SLA');
                    figures.addRows(arrSLAValues);

                    var options = {
                        curveType: 'function',
                        width:'100%',
                        height:275,
                        legend: { position: 'top' },
                        animation: {
                            startup: true,
                            duration: 1000,
                            easing: 'out',
                        },
                        hAxis: {
                            title: "SLA by date",
                            titleTextStyle: {
                                fontName: "Times New Roman",
                                //italic: true,
                                fontSize: 16
                            },
                            baseline: 0, baselineColor: 'blue'
                        },
                        vAxis: {
                            viewWindow: { min: 0 },
                            gridlines: {
                                color: 'transparent'
                            }
                        },
                        series: {
                            0: {
                                pointSize: 15,
                                pointShape: { type: 'square' }
                            },
                        }
                    };

                    var chart = new google.visualization.LineChart(document.getElementById('divSLAReport'));

                    chart.draw(figures, options);
                } else {
                    $("#divSLAReport").html("");
                    console.log(res.Message);
                }
                //-------------------------------------------------SLA report ends-------------------------------------------------------------------//

                //-------------------------------------------------Average Handle time report starts--------------------------------------------------------------------------------//
                if (res.HandleTimeReportDetails.length > 0) {
                    var arrHandleTimeValues = [];
                    for (var i = 0; i < res.HandleTimeReportDetails.length; i++) {
                        arrHandleTimeValues.push([res.HandleTimeReportDetails[i].Dates, parseFloat(res.HandleTimeReportDetails[i].AvgTalkTime), parseFloat(res.HandleTimeReportDetails[i].AvgHoldTime), parseFloat(res.HandleTimeReportDetails[i].AvgACWTime)]);
                    }
                    var figures = new google.visualization.DataTable();
                    figures.addColumn('string', 'Days');
                    figures.addColumn('number', 'Talk time');
                    figures.addColumn('number', 'Hold time');
                    figures.addColumn('number', 'After call work');
                    figures.addRows(arrHandleTimeValues);

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
                        hAxis: {
                            title: "days",
                            titleTextStyle: {
                                fontName: "Times New Roman",
                                italic: true,
                                fontSize: 16
                            },
                        },
                        colors: ["#5d55b1", "#dcc30f", "#87cefa"]
                    };

                    var chart = new google.visualization.ColumnChart(document.getElementById('divAvgHandletimeReport'));

                    chart.draw(figures, options);
                } else {
                    $("#divAvgHandletimeReport").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                    console.log(res.Message);
                }
                //-------------------------------------------------Average Handle time report starts--------------------------------------------------------------------------------//

                //-------------------------------------------------Call Abandonment report starts--------------------------------------------------------------------------------//
                if (res.AbandonmentReportDetails.length > 0) {
                    var arrAbandonmentValues = [];
                    for (var i = 0; i < res.AbandonmentReportDetails.length; i++) {
                        arrAbandonmentValues.push([res.AbandonmentReportDetails[i].Dates, parseInt(res.AbandonmentReportDetails[i].TotalCalls), 0, 0, 0]);
                        arrAbandonmentValues.push([res.AbandonmentReportDetails[i].Dates, 0, parseInt(res.AbandonmentReportDetails[i].AbandonedCalls60), parseInt(res.AbandonmentReportDetails[i].AbandonedCalls40), parseInt(res.AbandonmentReportDetails[i].AbandonedCalls20)]);
                    }
                    var figures = new google.visualization.DataTable();
                    figures.addColumn('string', 'Days');
                    figures.addColumn('number', 'Total Calls');
                    figures.addColumn('number', 'Abandoned 40 - 60 sec');
                    figures.addColumn('number', 'Abandoned 20 - 40 sec');
                    figures.addColumn('number', 'Abandoned < 20 sec');
                    figures.addRows(arrAbandonmentValues);

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
                        hAxis: {
                            title: "days",
                            titleTextStyle: {
                                fontName: "Times New Roman",
                                italic: true,
                                fontSize: 16
                            },
                        },
                        colors: ["#356bbf", "#cd4128", "#f06211", "#5584b1"]
                    };

                    var chart = new google.visualization.ColumnChart(document.getElementById('divAbandonmentReport'));
                    chart.draw(figures, options);
                } else {
                    console.log(res.Message);
                    $("#divAbandonmentReport").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                }
                //-------------------------------------------------Call Abandonment report ends--------------------------------------------------------------------------------//

                //-------------------------------------------------Average talk time vs Wait time report starts----------------------------------------------------------------//
                if (res.TalkTimeReportDetails.length > 0) {
                    var arrValues = [];
                    for (var i = 0; i < res.TalkTimeReportDetails.length; i++) {
                        arrValues.push([res.TalkTimeReportDetails[i].Dates, parseFloat(res.TalkTimeReportDetails[i].AvgTalkTime), parseFloat(res.TalkTimeReportDetails[i].AvgWaitTime)]);
                    }
                    var figures = new google.visualization.DataTable();
                    figures.addColumn('string', 'Days');
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
                        hAxis: {
                            title: "days",
                            titleTextStyle: {
                                fontName: "Times New Roman",
                                italic: true,
                                fontSize: 16
                            },
                        },
                    };

                    var chart = new google.visualization.LineChart(document.getElementById('divAvgTalktimeReport'));

                    chart.draw(figures, options);
                } else {
                    $("#divAvgTalktimeReport").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                    console.log(res.Message);
                }
                //-------------------------------------------------Average talk time vs Wait time report ends-------------------------------------------------------------------//
            }
            else {
                $("#divSLAReport").html("");
                $("#divAvgTalktimeReport").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                $("#divAbandonmentReport").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                $("#divAvgHandletimeReport").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                $("#div-pie-SLA").attr("aria-valuenow", 0);
                $('#div-pie-SLA').asPieProgress('go', 0);
                $("#div-current-SLA").text(0 + '%');
                $("#div-target-SLA").text("Target SLA - " + 0 + '%');
                $("#spn-threshold-SLA").text(0);
                $("#div-total-calls").text(0);
                $("#div-answered-calls").text(0);
                $("#div-abandoned-calls").text(0);
                $("#div-missed-calls").text(0);
                $("#div-handle-time").text('00:00');
                $("#div-talk-time").text('00:00');
                $("#div-answer-speed").text('00:00');
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