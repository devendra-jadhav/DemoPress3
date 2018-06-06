<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="ManagerDashboard.aspx.cs" Inherits="Press3.UI.ManagerDashboard" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Press3 - Dashboard</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <style type="text/css">
        .amcharts-chart-div a {
            display: none !important;
        }
    </style>
    <link href="css/export.css" rel="stylesheet" media="all" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">


    <input id="hdnAccountId" type="hidden" value="<%= accountId %>" />
    <input id="hdnAgentId" type="hidden" value="<%= agentId %>" />
    <input id="hdnRoleId" type="hidden" value="<%= roleId %>" />

    <div class="page-content">
        <audio id="webcam" autoplay="autoplay" hidden="true"></audio>

      <%--  <span id="loaderForHead" class="row" style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif' style="margin-left: auto;margin-right: auto;display: block;"></span>--%>
        <div class="portlet lite pad-15" id="divForSingleIvr" style="display: none">
            <div class="row">
                <div class="col-sm-6">
                    <h4 class="bold-6">Service Level</h4>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" id="divSLA" aria-valuenow="0"
                            style="width: 0%">
                        </div>
                    </div>
                    <div class="prog-values">
                        <label class="margin-right-20">
                            <i class="fa fa-circle green margin-right-5"></i>
                            Current <span class="value" id="spanCurrentSLA">0%</span>
                        </label>
                        <label class="margin-left-15">
                            <i class="fa fa-circle grey margin-right-5"></i>
                            Target <span class="value" id="spanTargetSLA">0%</span>
                        </label>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <h4 class="bold-6">Current Calls</h4>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" id="current_call" aria-valuenow="0"
                            aria-valuemin="0" aria-valuemax="100" style="width: 0%">
                        </div>
                    </div>
                    <div class="prog-values">
                        <label class="margin-right-20">
                            <i class="fa fa-circle blue margin-right-5"></i>
                            Active Callers <span class="value" id="spanActiveCallers">0</span>
                        </label>
                        <label class="margin-left-15">
                            <i class="fa fa-circle grey margin-right-5"></i>
                            Waiting <span class="value" id="spanWaitingCallers">0</span>
                        </label>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
        </div>

        <div id="divForMultipleIvrKpi">
            <div class="row">
                <div class="col-sm-3">
                    <div id="div0" style="visibility: hidden;" class="portlet lite">
                        <div class="graphs-panel">
                            <div class="graphs-panel-head clearfix">
                                <label id="lblSlivr0" class="pull-left">IVR Name</label>
                                <label class="pull-right">
                                    <i class="fa fa-phone margin-right-5"></i>
                                    <span id="spanCallerId0"></span>
                                </label>
                            </div>
                            <div class="graphs-panel-body" id="divSer0" style="margin-bottom: -35px !important; height: 220px;">
                            </div>
                            <br />
                            <br />
                            <center><label>Service Level</label>
                                <br />

                                  <div class="prog-values text-center">
                        <label class="margin-right-20">
                            <i class="fa fa-circle blue margin-right-5"></i>
                            Active <span class="value" id="spanActiveCallers0">0</span>
                        </label>
                        <label>
                            <i class="fa fa-circle grey margin-right-5"></i>
                            Waiting  <span class="value" id="spanWaitingCallers0">0</span>
                        </label>
                        <div class="clearfix"></div>
                    </div>

                                </center>
                        </div>



                    </div>

                </div>

                <div class="col-sm-3">

                    <div id="div1" style="visibility: hidden;" class="portlet lite">
                        <div class="graphs-panel">
                            <div class="graphs-panel-head clearfix">
                                <label id="lblSlivr1" class="pull-left">IVR Name</label>
                                <label class="pull-right">
                                    <i class="fa fa-phone margin-right-5"></i>
                                    <span id="spanCallerId1"></span>
                                </label>
                            </div>
                            <div class="graphs-panel-body" id="divSer1" style="margin-bottom: -35px !important; height: 220px;">
                            </div>
                            <br />
                            <br />
                            <center><label>Service Level</label>
                               <br />

                              <%-- <div class="progress" style="margin-top:5px;">
                                <div class="progress-bar" role="progressbar" id="current_call1" aria-valuenow="0"
                                 aria-valuemin="0" aria-valuemax="100" style="width: 0%">
                                </div>
                                  
                         </div>--%>

                               
                                  <div class="prog-values text-center">
                        <label class="margin-right-20">
                            <i class="fa fa-circle blue margin-right-5"></i>
                            Active <span class="value" id="spanActiveCallers1">0</span>
                        </label>
                        <label>
                            <i class="fa fa-circle grey margin-right-5"></i>
                            Waiting  <span class="value" id="spanWaitingCallers1">0</span>
                        </label>
                        <div class="clearfix"></div>
                    </div>
                                </center>
                        </div>

                    </div>
                </div>

                <div class="col-sm-3">

                    <div id="div2" style="visibility: hidden;" class="portlet lite">
                        <div class="graphs-panel">
                            <div class="graphs-panel-head clearfix">
                                <label id="lblSlivr2" class="pull-left">IVR Name</label>
                                <label class="pull-right">
                                    <i class="fa fa-phone margin-right-5"></i>
                                    <span id="spanCallerId2"></span>
                                </label>
                            </div>
                            <div class="graphs-panel-body" id="divSer2" style="margin-bottom: -35px !important; height: 220px;">
                            </div>
                            <br />
                            <br />
                            <center><label>Service Level</label>
                                <br />

                               <%--<div class="progress" style="margin-top:5px;">
                                <div class="progress-bar" role="progressbar" id="current_call2" aria-valuenow="0"
                                 aria-valuemin="0" aria-valuemax="100" style="width: 0%">
                                </div>
                                  
                         </div>--%>
                                
                                  <div class="prog-values text-center">
                        <label class="margin-right-20">
                            <i class="fa fa-circle blue margin-right-5"></i>
                            Active <span class="value" id="spanActiveCallers2">0</span>
                        </label>
                        <label>
                            <i class="fa fa-circle grey margin-right-5"></i>
                            Waiting  <span class="value" id="spanWaitingCallers2">0</span>
                        </label>
                        <div class="clearfix"></div>
                    </div>
                               

                                </center>
                        </div>

                    </div>
                </div>

                <div class="col-sm-3">

                    <div id="div3" style="visibility: hidden;" class="portlet lite">
                        <div class="graphs-panel">
                            <div class="graphs-panel-head clearfix">
                                <label id="lblSlivr3" class="pull-left">IVR Name</label>
                                <label class="pull-right">
                                    <i class="fa fa-phone margin-right-5"></i>
                                    <span id="spanCallerId3"></span>
                                </label>
                            </div>
                            <div class="graphs-panel-body" id="divSer3" style="margin-bottom: -35px !important; height: 220px;">
                            </div>
                            <br />
                            <br />
                            <center><label>Service Level</label>
                               <br />

                             <%--  <div class="progress" style="margin-top:5px;">
                                <div class="progress-bar" role="progressbar" id="current_call3" aria-valuenow="0"
                                 aria-valuemin="0" aria-valuemax="100" style="width: 0%">
                                </div>
                                  
                         </div>--%>

                               
                                  <div class="prog-values text-center">
                        <label class="margin-right-20">
                            <i class="fa fa-circle blue margin-right-5"></i>
                            Active <span class="value" id="spanActiveCallers3">0</span>
                        </label>
                        <label>
                            <i class="fa fa-circle grey margin-right-5"></i>
                            Waiting  <span class="value" id="spanWaitingCallers3">0</span>
                        </label>
                        <div class="clearfix"></div>
                    </div>
                              

                                </center>
                        </div>

                    </div>
                </div>
            </div>
        </div>





        <div class="row" style="margin-bottom: 10px; margin-top: -10px;">

            <div class="col-md-2 pull-right">



                <div class="select-style">

                    <select id="selectIvrStudio" style="padding-right: 35px;">
                    </select>
                </div>
            </div>

        </div>





        <div class="portlet">
            <div class="kpi_panel">
                <div class="row">
                    <div class="col-md-2 col-sm-2 kpi_value">
                        <h2 id="h2AgentsLoggedin">0</h2>
                        <label>Agents Logged In</label>
                        <hr />
                        <h2 id="h2CallsAbove5min">0</h2>
                        <label>Calls <i class="fa fa-angle-right font-grey-gallery bold"></i>5 Mins</label>
                    </div>
                    <div class="col-md-2 col-sm-2 kpi_value">
                        <h2 id="h2AgentsReady">0</h2>
                        <label>Agents Ready</label>
                        <hr />
                        <h2 id="h2LongestCall">00:00:00 hrs</h2>
                        <label>Longest Call(HH:MM:SS)</label>
                    </div>
                    <div class="col-md-2 col-sm-2 kpi_value">
                        <h2 id="h2AgentsOncall">0</h2>
                        <label>Agents On Call</label>
                        <hr />
                        <h2 id="h2LongestWaitingCall">00:00:00 hrs</h2>
                        <label>Longest Wait Call(HH:MM:SS)</label>
                    </div>
                    <div class="col-md-2 col-sm-2 kpi_value">
                        <h2 id="h2TotalCalls">0</h2>
                        <label>Total Calls Today</label>
                        <hr />
                        <h2 id="h2Escalations">0</h2>
                        <label>Transfer Calls</label>
                    </div>
                    <div class="col-md-2 col-sm-2 kpi_value no-border">
                        <h2 id="h2AvgAnswerSpeed">0 sec</h2>
                        <label>Avrg Speed of Answer</label>
                        <hr />
                        <h2 id="h2TotalConferences">0</h2>
                        <label>Today Conferences</label>
                    </div>
                </div>
            </div>
            <div class="text-right margin-top-10"><a class="btn-link roleViews" style="text-decoration: underline;" roletype="1">Click here for Supervisor View</a></div>
        </div>

        <div id="divSupervisorView" style="display: none;">
            <div class="graphs-panel margin-bottom-20">
                <div class="graphs-panel-head clearfix">
                    <div class="pull-left">
                        <h5 class="bold mb-0">Agents Activity</h5>

                    </div>
                    <div class="btn btn-sm btn-success pull-left margin-left-10" id="agentDetailsRedirect">Agent Details<i class="fa fa-external-link" style="margin-left: 5px !important;"></i></div>
                    <div class="pull-right">
                        <div class="margin-top-5">
                            <div class="pull-left margin-right-10">
                                <label class="label bold margin-right-5" style="color: #335283;">Agent status :</label>
                                <select name="" id="agentStatusFilter">
                                </select>
                            </div>
                            <label class="label label-primary label-round margin-right-5 durationActions" style="cursor: pointer;" actiontype="1">Today</label>
                            <label class="label label-default label-round margin-right-5 durationActions" style="cursor: pointer;" actiontype="2">Week</label>
                            <label class="label label-default label-round durationActions" style="cursor: pointer;" actiontype="3">Month</label>
                        </div>
                    </div>
                </div>
                <div class="graphs-panel-body">
                    <div class="table-responsive " style="height: 230px; overflow-y: auto; overflow: scroll; overflow: auto" id="divAgentsSummary">
                    </div>
                </div>
            </div>
            <div class="graphs-panel margin-bottom-20">
                <div class="graphs-panel-head clearfix">
                    <div class="pull-left">
                        <h5 class="bold mb-0">Active Calls
                                    <label class="margin-left-10 txt-lite-grey">Real Time - <span class="label label-circle label-grey bold" id="spanActiveCalls">0</span></label></h5>
                    </div>
                   <%-- <div class="pull-right">
                        <div class="margin-top-5">
                            <label class="label label-primary label-round margin-right-5 callTypes" calltype="1" style="cursor: pointer;">All</label>
                            <label class="label label-default label-round margin-right-5 callTypes" calltype="3" style="cursor: pointer;">In Bound</label>
                            <label class="label label-default label-round callTypes" calltype="2" style="cursor: pointer;">Out Bound</label>
                        </div>
                    </div>--%>
                </div>
                <div class="graphs-panel-body">
                    <div class="table-responsive scroller" style="height: 225px; overflow-y: auto;" id="divActiveCalls">
                    </div>
                </div>
            </div>

            <div class="graphs-panel margin-bottom-20">
                <div class="graphs-panel-head">
                    <h5 class="bold mb-0">Calls Waiting
                        <label class="margin-left-10 txt-lite-grey">Real Time - <span class="label label-circle label-grey bold" id="spanWaitingCalls">0</span></label></h5>
                </div>
                <div class="graphs-panel-body">
                    <div class="table-responsive" style="height: 225px; overflow-y: auto;" id="divWaitingCalls">
                    </div>
                </div>
            </div>



        </div>


        <div id="divManagerView" style="display: none;">
            <div class="portlet">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="graphs-panel">
                            <div class="graphs-panel-head">Total Calls Received by hour</div>
                            <div class="graphs-panel-body" id="totalCallsReceived"></div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="graphs-panel">
                            <div class="graphs-panel-head">Call Abandonment report by hour </div>
                            <div class="graphs-panel-body" id="divAbandonmentReport"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="portlet">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="graphs-panel">
                            <div class="graphs-panel-head">Average Handle time by hour </div>
                            <div class="graphs-panel-body" id="divAvgHandletimeReport"></div>
                        </div>
                    </div>



                    <div class="col-sm-6">
                        <div class="graphs-panel">
                            <div class="graphs-panel-head">Average talk time vs Wait time by hour </div>
                            <div class="graphs-panel-body" id="divAvgTalktimeReport"></div>
                        </div>
            </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="assets/global/plugins/amcharts/amcharts/amcharts.js"></script>
    <script type="text/javascript" src="assets/global/plugins/amcharts/amcharts/gauge.js"></script>
    <script type="text/javascript" src="assets/global/plugins/amcharts/amcharts/light.js"></script>
    <script type="text/javascript" src="scripts/jsapi.js"></script>
    <script type="text/javascript" src="scripts/chartsloader.js"></script>
    <script type="text/javascript" src="scripts/verto-min.js"></script>
    <script type="text/javascript" src="scripts/custom/manager-dashboard.js?v=14"></script>
    <script type="text/javascript" src="scripts/custom/manager-webphone.js"></script>
    <script type="text/javascript">
        google.load('visualization', '1.0', { 'packages': ['corechart', 'bar', 'gauge'] });
    </script>
</asp:Content>
