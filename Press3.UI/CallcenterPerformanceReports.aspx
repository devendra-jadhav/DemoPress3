<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="CallcenterPerformanceReports.aspx.cs" Inherits="Press3.UI.CallcenterPerformanceReports" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Press3 - CallcenterPerformanceReports</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="css/asPieProgress.min.css" rel="stylesheet" />
    <link href="assets/global/plugins/bootstrap-datepicker/css/datepicker3.css" rel="stylesheet" />
    <style type="text/css">
        .graphs-panel-body-add {
            position: relative;
            height: auto;
        }

        .cur_sla {
            top: 40%;
            left: 48%;
        }

        .total_val, .total_time, .cur_sla {
            font-size: 18px;
            color: #505050;
            position: absolute;
        }

        .total_val {
            top: 40%;
            left: 48%;
        }

        .total_time {
            top: 40%;
            left: 45%;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <div class="page-content">
        <div class="text-right margin-bottom-10">
            <input type="text" id="txt-datepicker" class="form-control input-inline margin-right-5" readonly placeholder="select" style="background: #fff;" />
            <button type="button" class="btn btn-success" id="btn-submit">Submit</button>
        </div>
        <div class="portlet">
            <div class="graphs-panel">
                <div class="graphs-panel-head">Service Level
                    <br />
                    ( Percentage of calls treated within <span id="spn-threshold-SLA">0</span> sec)</div>
                <div class="graphs-panel-body graphs-panel-body-add text-center">
                    <div class="row">
                        <div class="col-sm-6">
                            <label id="div-target-SLA" class="font-blue bold-6"></label>
                            <span id="div-current-SLA" class="cur_sla"></span>
                            <div id="div-pie-SLA" class="pie_progress" role="progressbar" data-barcolor="#ffc300" aria-valuenow="0" style="height: 200px; width: 200px; margin: auto"></div>
                            <br />
                            <span>Cumulative monthly SLA</span>
                        </div>
                        <div class="col-sm-6">
                            <div id="divSLAReport"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="portlet">
            <div class="graphs-panel">
                <div class="graphs-panel-head">Cumulative Call Metrics</div>
                <div class="graphs-panel-body graphs-panel-body-add">
                    <div class="row margin-bottom-20">
                        <div class="col-sm-3">
                            <div class="callMetricBox">
                                <h4 class="head">Total Calls Received</h4>
                                <label class="num" id="div-total-calls">0</label>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="callMetricBox">
                                <h4 class="head">Total Answered</h4>
                                <label class="num" id="div-answered-calls">0</label>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="callMetricBox">
                                <h4 class="head">Total Abandoned</h4>
                                <label class="num" id="div-abandoned-calls">0</label>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="callMetricBox">
                                <h4 class="head">Total Missed</h4>
                                <label class="num" id="div-missed-calls">0</label>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-3">
                            <div class="callMetricBox">
                                <h4 class="head">Avg Handle Time</h4>
                                <label class="num" id="div-handle-time">0</label>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="callMetricBox">
                                <h4 class="head">Avg Talk Time</h4>
                                <label class="num" id="div-talk-time">0</label>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="callMetricBox">
                                <h4 class="head">Avg Speed Of Answer</h4>
                                <label class="num" id="div-answer-speed">0</label>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <div class="portlet">
            <div class="row">
                <div class="col-sm-6">
                    <div class="graphs-panel">
                        <div class="graphs-panel-head">Average talk time vs Wait time report </div>
                        <div class="graphs-panel-body" id="divAvgTalktimeReport"></div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="graphs-panel">
                        <div class="graphs-panel-head">Call Abandonment report </div>
                        <div class="graphs-panel-body" id="divAbandonmentReport"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="portlet">
            <div class="row">
                <div class="col-sm-3"></div>
                <div class="col-sm-6">
                    <div class="graphs-panel">
                        <div class="graphs-panel-head">Average Handle time report </div>
                        <div class="graphs-panel-body" id="divAvgHandletimeReport"></div>
                    </div>
                </div>
                <div class="col-sm-3"></div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/jsapi.js"></script>
    <script type="text/javascript" src="scripts/chartsloader.js"></script>
    <script type="text/javascript" src="scripts/jquery-asPieProgress.min.js"></script>
    <script type="text/javascript" src="assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
    <script type="text/javascript" src="scripts/custom/call-center-performance-reports.js"></script>
    <script type="text/javascript">
        google.load('visualization', '1.0', { 'packages': ['corechart', 'bar', 'gauge'] });
    </script>
</asp:Content>
