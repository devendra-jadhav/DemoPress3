<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="AgentPerformance.aspx.cs" Inherits="Press3.UI.AgentPerformance" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - Agent Performance</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">

     <input id="hdnAccountId" type="hidden" value="<%= accountId %>" />
    <input id="hdnAgentId" type="hidden" value="<%= agentId %>" />
    <input id="hdnRoleId" type="hidden" value="<%= roleId %>" />


    <link href="assets/global/plugins/bootstrap-datepicker/css/datepicker3.css" rel="stylesheet" />
    <style type="text/css">
        svg > g > g:last-child {
            pointer-events: none;
        }

        svg > g > g:last-child {
            pointer-events: none;
        }
    </style>
    <div class="page-content">
        <div class="portlet lite">
            <h4 class="bold mb-0">Agent Performance Reports</h4>
            <hr />
            <div class="clearfix">
                <div class="pull-left margin-bottom-10">
                    <input type="text" id="txt-datepicker" class="form-control input-inline margin-right-5" readonly placeholder="select" style="background: #fff;" />
                    <button type="button" class="btn btn-success" id="btn-submit">Submit</button>
                </div>
            </div>
        </div>

        <div class="portlet">
            <div class="graphs-panel">
                <div class="graphs-panel-head">Calls/Minutes by Agent</div>
                <div class="graphs-panel-body">
                    <div class="row">
                        <div class="col-sm-12 f_15 txt-lite-grey text-center">
                            <p class="margin-top-30">Chart comparing agents by the amount of Answered and Unanswered minutes and number of calls.</p>
                            <p class="margin-top-20">Designed to compare performance between agents during a specified period</p>
                        </div>
                    </div>
                    <div class="row" style="height: 450px;">
                        <div id="divCallsByMinutes" style="height: 350px;">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="portlet">
            <div class="graphs-panel">
                <div class="graphs-panel-head">Agent Accumulated Time ( InSeconds )</div>
                <div class="graphs-panel-body text-center">
                    <p class="txt-lite-grey">
                        Chart comparing agents by the percentage of time spent on different tasks.
                               Designed to compare performance between agents during a specified period
                    </p>
                    <hr />
                    <div class="row " id="agentPerformCharts">
                    </div>
                </div>
            </div>
        </div>

        <div class="portlet">
            <div class="graphs-panel">
                <div class="graphs-panel-head">
                    <span class="bold">Cumulative Agent Performance Metrics</span><br />
                    <span class="f_12">Periodic view of agents performance</span>
                </div>
                <div class="graphs-panel-body">
                    <div class="table-responsive" style="height: 300px !important;">
                        <table class="table table-bordered table-advance ">
                            <thead>
                                <tr>
                                    <th>Agent Name</th>
                                    <th>Service Level</th>
                                    <th>Rating</th>
                                    <th>Avrg Handle Time</th>
                                    <th>Avrg Speed of Answer</th>
                                    <th>Avrg Talk Time</th>
                                </tr>
                            </thead>
                            <tbody id="agentMetricsTable">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/jsapi.js"></script>
    <script type="text/javascript" src="scripts/chartsloader.js"></script>
    <script type="text/javascript" src="assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
    <script type="text/javascript" src="scripts/custom/agentPerformanceReports.js?ver=2"></script>
    <script type="text/javascript">
        google.load('visualization', '1.0', { 'packages': ['corechart', 'bar', 'gauge'] });
    </script>
</asp:Content>
