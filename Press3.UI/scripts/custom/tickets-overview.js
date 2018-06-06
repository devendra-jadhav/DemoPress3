var now = new Date();
var getMonth = now.getMonth();
var month = 0;
var year = now.getFullYear();

$(document).ready(function () {
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
            getCallCenterTicketPerformanceReports();
        }
    });
    getCallCenterTicketPerformanceReports();
});

function getCallCenterTicketPerformanceReports() {


    //$("#btn-submit").attr("disabled", true);

    //$("#div-total-complaints").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");
    //$("#div-priority-complaints").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");
    //$("#div-categories").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");
    //$("#div-closed-complaints").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");
    //$("#div-duedate-closed-complaints").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");

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
        data: { type: 40, month: month, year: year },
        success: function (res) {
            $.unblockUI();

            $("#btn-submit").attr("disabled", false);
            if (res.Success == "True") {
                //-------------------------------------------------Total complaints report starts---------------------------------------------------//
                if (res.ReportDetails.length > 0) {
                    var arrValues = [];
                    for (var i = 0; i < res.ReportDetails.length; i++) {
                        arrValues.push([res.ReportDetails[i].Dates, parseInt(res.ReportDetails[i].Online), parseInt(res.ReportDetails[i].Offline)]);
                    }
                    var figures = new google.visualization.DataTable();
                    figures.addColumn('string', 'Days');
                    figures.addColumn('number', 'Online');
                    figures.addColumn('number', 'Offline');
                    figures.addRows(arrValues);

                    var options = {
                        curveType: 'function',
                        legend: { position: 'top' },
                        width: 577,
                        height: 200,
                        animation: {
                            startup: true,
                            duration: 1000,
                            easing: 'out',
                        },
                        hAxis: {
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
                                pointSize: 10,
                                pointShape: { type: 'square' }
                            },
                            1: {
                                pointSize: 10,
                                pointShape: { type: 'square' }
                            }
                        }
                    };

                    var chart = new google.visualization.LineChart(document.getElementById('div-total-complaints'));

                    chart.draw(figures, options);
                } else {
                    $("#div-total-complaints").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                    console.log(res.Message);
                }
                //-------------------------------------------------Total complaints report ends-----------------------------------------------------//
                //-------------------------------------------------Priority complaints report starts----------------------------------------------------------------//
                if (res.PriorityReportDetails.length > 0) {
                    var arrPriorityValues = [];
                    for (var i = 0; i < res.PriorityReportDetails.length; i++) {
                        arrPriorityValues.push([res.PriorityReportDetails[i].Priority, parseInt(res.PriorityReportDetails[i].TotalTickets)]);
                    }
                    var figures = new google.visualization.DataTable();
                    figures.addColumn('string', 'Priority');
                    figures.addColumn('number', 'Total Tickets');
                    figures.addRows(arrPriorityValues);

                    var options = {
                        curveType: 'function',
                        legend: { position: 'top' },
                        width: 577,
                        height: 200,
                        animation: {
                            startup: true,
                            duration: 1000,
                            easing: 'out',
                        },
                        hAxis: {
                            baseline: 0, baselineColor: 'blue'
                        },
                        vAxis: {
                            viewWindow: { min: 0 },
                            gridlines: {
                                color: 'transparent'
                            }
                        }
                    };

                    var chart = new google.visualization.ColumnChart(document.getElementById('div-priority-complaints'));

                    chart.draw(figures, options);
                } else {
                    $("#div-priority-complaints").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                    console.log(res.Message);
                }
                //-------------------------------------------------Priority complaints report ends-------------------------------------------------------------------//
                //-------------------------------------------------Closed complaints report starts----------------------------------------------------------------//
                if (res.ClosedReportDetails.length > 0) {
                    if (parseInt(res.ClosedReportDetails[0].TotClosedWithin1Hour) == 0 && parseInt(res.ClosedReportDetails[0].TotClosedWithin24Hours) == 0 &&
                        parseInt(res.ClosedReportDetails[0].TotClosedWithin48Hours) == 0 && parseInt(res.ClosedReportDetails[0].TotClosedAfter48Hours) == 0) {
                        $("#div-closed-complaints").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                    } else {
                        var arrClosedValues = [];
                        var tableClosedData = "";
                        arrClosedValues.push(['Within 1Hr', parseInt(res.ClosedReportDetails[0].TotClosedWithin1Hour)]);
                        arrClosedValues.push(['Within 24Hr', parseInt(res.ClosedReportDetails[0].TotClosedWithin24Hours)]);
                        arrClosedValues.push(['Within 48Hr', parseInt(res.ClosedReportDetails[0].TotClosedWithin48Hours)]);
                        arrClosedValues.push(['Other', parseInt(res.ClosedReportDetails[0].TotClosedAfter48Hours)]);
                        tableClosedData += "<thead><tr><th>With in(hrs)</th><th>Closed</th></tr></thead><tbody>";
                        //var obj = jQuery.parseJSON(res.ClosedReportDetails[0]);
                        //for (var item in obj) {
                        //    tableClosedData += "<tr><td>" + obj.name + "</td><td>" + obj.value + "</td></tr>";
                        //}
                        tableClosedData += "<tr><td> 1 hour</td><td>" + res.ClosedReportDetails[0].TotClosedWithin1Hour + "</td></tr>";
                        tableClosedData += "<tr><td> 24 hours</td><td>" + res.ClosedReportDetails[0].TotClosedWithin24Hours + "</td></tr>";
                        tableClosedData += "<tr><td> 48 hours</td><td>" + res.ClosedReportDetails[0].TotClosedWithin48Hours + "</td></tr>";
                        tableClosedData += "<tr><td> After 48 hours</td><td>" + res.ClosedReportDetails[0].TotClosedAfter48Hours + "</td></tr>";
                        tableClosedData += "</tbody>";
                        $("#div-closed-complaints-table").html(tableClosedData);
                        var figures = new google.visualization.DataTable();
                        figures.addColumn('string', 'Closed');
                        figures.addColumn('number', 'Total Tickets');
                        figures.addRows(arrClosedValues);

                        var options = {
                            legend: { position: 'top' },
                            width: 577,
                            height: 200,
                            sliceVisibilityThreshold: 0
                        };

                        var chart = new google.visualization.PieChart(document.getElementById('div-closed-complaints'));
                        chart.draw(figures, options);
                    }
                } else {
                    $("#div-closed-complaints").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                    console.log(res.Message);
                }
                //-------------------------------------------------Closed complaints report ends-------------------------------------------------------------------//
                //-------------------------------------------------DueDate Closed complaints report starts----------------------------------------------------------------//
                if (res.DueDateClosedReportDetails.length > 0) {
                    if (parseInt(res.DueDateClosedReportDetails[0].TotClosedWithinDueDate) == 0 && parseInt(res.DueDateClosedReportDetails[0].TotClosedAfterDueDate) == 0) {
                        $("#div-duedate-closed-complaints").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                    } else {
                        var arrClosedValues = [];
                        var tableDueClosedData = "";
                        arrClosedValues.push(['In Time', parseInt(res.DueDateClosedReportDetails[0].TotClosedWithinDueDate)]);
                        arrClosedValues.push(['Late', parseInt(res.DueDateClosedReportDetails[0].TotClosedAfterDueDate)]);
                        tableDueClosedData += "<thead><tr><th>In time</th><th>Late</th></tr></thead><tbody>";
                        tableDueClosedData += "<tr><td> " + res.DueDateClosedReportDetails[0].TotClosedWithinDueDate + "</td><td>" + res.DueDateClosedReportDetails[0].TotClosedAfterDueDate + "</td></tr>";
                        tableDueClosedData += "</tbody>";
                        $("#div-duedate-closed-complaints-table").html(tableDueClosedData);

                        var figures = new google.visualization.DataTable();
                        figures.addColumn('string', 'Closed');
                        figures.addColumn('number', 'Total Tickets');
                        figures.addRows(arrClosedValues);

                        var options = {
                            legend: { position: 'top' },
                            width: 577,
                            height: 200,
                            sliceVisibilityThreshold: 0
                        };

                        var chart = new google.visualization.PieChart(document.getElementById('div-duedate-closed-complaints'));
                        chart.draw(figures, options);
                    }
                } else {
                    $("#div-duedate-closed-complaints").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                    console.log(res.Message);
                }
                //-------------------------------------------------DueDate Closed complaints report ends-------------------------------------------------------------------//
                //-------------------------------------------------Category complaints report starts----------------------------------------------------------------//
                if (res.CategoryReportDetails.length > 0) {

                    $("#div-constant-content").html("");
                    $("#div-categories").html("");
                    var container = $("#div-categories");
                    var resHtml = "", resCloseHtml = "";

                    for (var i = 0; i < res.CategoryReportDetails.length; i++) {
                        if (i == 0 || i % 3 == 0) {
                            resHtml += "<div class='row row-category' row-id='" + (i + 1) + "'>";
                            //container.append("<div class='row row-category' row-id='" + i + "'>");
                        }
                        if (i == res.CategoryReportDetails.length - 1) {
                            resHtml += "<div class='col-sm-4 text-center row-sets'><div id='div-category-complaints-" + (i + 1) + "'></div><div><table class='table table-striped table-bordered' id = 'div-category-complaints-table" + (i + 1) + "'></table></div></div>";
                        } else {
                            resHtml += "<div class='col-sm-4 text-center row-sets'><span class='bord-r'></span><div id='div-category-complaints-" + (i + 1) + "'></div><div><table class='table table-striped table-bordered' id = 'div-category-complaints-table" + (i + 1) + "'></table></div></div>";
                        }
                       
                        if ((i + 1) % 3 == 0) {
                            //container.append("</div>");
                            resHtml += "</div>";
                        }
                        if (i == res.CategoryReportDetails.length - 1) {
                            resCloseHtml = resHtml + "</div>";
                            $("#div-constant-content").html(resCloseHtml);
                            var getRows = $("#div-constant-content").find(".row-category").last().find(".row-sets").length;
                            if (parseInt(getRows) == 1) {
                                resHtml += "<div class='col-sm-4 text-center row-sets'><div id='div-category-complaints-" + (res.CategoryReportDetails.length + 1) + "'></div><div><table class='table table-striped table-bordered' id = 'div-category-complaints-table" + (res.CategoryReportDetails.length + 1) + "'></table></div></div>";
                                resHtml += "<div class='col-sm-4 text-center row-sets'><div id='div-category-complaints-" + (res.CategoryReportDetails.length + 2) + "'></div><div><table class='table table-striped table-bordered' id = 'div-category-complaints-table" + (res.CategoryReportDetails.length + 2) + "'></table></div></div>";
                                resHtml += "</div>";
                            } else if (parseInt(getRows) == 2) {
                                resHtml += "<div class='col-sm-4 text-center row-sets'><div id='div-category-complaints-" + (res.CategoryReportDetails.length + 1) + "'></div><div><table class='table table-striped table-bordered' id = 'div-category-complaints-table" + (res.CategoryReportDetails.length + 1) + "'></table></div></div>";
                                resHtml += "</div>";
                            }
                        }
                    }
                    container.append(resHtml);
                    $("#div-constant-content").html("");
                    
                    for (var k = 0; k < res.CategoryReportDetails.length; k++) {
                        var subCategories = []; var ticketsShare = [];
                        if (res.CategoryReportDetails[k].SubCategories.indexOf(',') > -1) {
                             subCategories = res.CategoryReportDetails[k].SubCategories.split(",");
                        }else{
                             subCategories.push(res.CategoryReportDetails[k].SubCategories);
                        }
                        if (res.CategoryReportDetails[k].TicketsShare.indexOf(',') > -1) {
                            ticketsShare = res.CategoryReportDetails[k].TicketsShare.split(",");
                        } else {
                            ticketsShare.push(res.CategoryReportDetails[k].TicketsShare);
                        }

                        var arrValues = [];
                        var tableData = "";
                        tableData += "<thead><tr><th>Categories</th><th>Tickets Raised</th></tr></thead><tbody>";
                        if (subCategories.length > 1 && ticketsShare.length > 1) {
                            
                            for (var j = 0; j < subCategories.length; j++) {
                                arrValues.push([subCategories[j], parseInt(ticketsShare[j])]);
                                tableData += "<tr><td>" + subCategories[j] + "</td>";
                                tableData += "<td>" + ticketsShare[j] + "</td></tr>"
                            }
                           
                        } else {
                            arrValues.push([subCategories[0], parseInt(ticketsShare[0])]);
                            tableData += "<tr><td>" + subCategories[0] + "</td>";
                            tableData += "<td>" + parseInt(ticketsShare[0]) + "</td></tr>"
                        }

                        tableData += "</tbody>";
                        $("#div-category-complaints-table" + (k + 1)).html(tableData);

                        var figures = new google.visualization.DataTable();
                        figures.addColumn('string', 'Categories');
                        figures.addColumn('number', 'Total Tickets');
                        figures.addRows(arrValues);
                       
                        var options = {
                            legend: { position: 'top' },
                            title: res.CategoryReportDetails[k].Category,
                            sliceVisibilityThreshold: 0
                            //width: 577,
                            //height: 200
                        };

                        console.log(document.getElementById('div-category-complaints-'+(k+ 1)));
                        var chart = new google.visualization.PieChart(document.getElementById('div-category-complaints-'+(k+ 1)));
                            chart.draw(figures, options);
                    }
                } else {
                    $("#div-categories").html("<div class='text-center' style='margin-top:8%;'>No Reports</div>");
                    console.log(res.Message);
                }
                //-------------------------------------------------Category complaints report ends-------------------------------------------------------------------//
            } else {
                $("#div-closed-complaints").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                $("#div-duedate-closed-complaints").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                $("#div-priority-complaints").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                $("#div-total-complaints").html("<div class='text-center' style='margin-top:15%;'>No Reports</div>");
                $("#div-categories").html("<div class='text-center' style='margin-top:8%;'>No Reports</div>");
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