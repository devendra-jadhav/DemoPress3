<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="SupervisorDashboard.aspx.cs" Inherits="Press3.UI.SupervisorDashboard" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Press3 - Dashboard</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <style type="text/css">
        .hour_report th, .hour_report td {
            padding: 5px !important;
        }

        .graphs-panel {
            margin-bottom: 20px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <input id="hdnAccountId" type="hidden" value="<%= accountId %>" />
    <input id="hdnAgentId" type="hidden" value="<%= agentId %>" />
    <input id="hdnRoleId" type="hidden" value="<%= roleId %>" />

    <div class="page-content">

        <%--   <div class="row" style="margin-bottom:10px;margin-top:-10px;">
           
            <div class="col-md-2 pull-right">
        
           
                
              <div class="select-style">
                   
        <select id="selectIvrStudio" style="padding-right:35px;">
         
        </select>
        </div>
                </div>

                </div>	--%>
        <div class="row margin-bottom-20">
            <div class="col-md-3 col-sm-3 col-xs-12">
                <div class="circu_box text-center">
                    <div class="row">
                        <div class="col-md-2 col-sm-12 col-xs-12">
                            <img src="assets/img/avg_chat.png" width="60" alt="talk time" />
                        </div>
                        <div class="col-md-10 col-sm-12 col-xs-12">
                            <h4 class="number" id="h4AvgTalkTime">00:00</h4>
                            <label class="name">Average Talk Time (mm:ss)</label>
                        </div>
                    </div>

                    <div class="margin-top-10 circu_footer">
                        <div class="dropdown dropdown-user text-left">
                            <a href="#" class="dropdown-toggle txt-lite-grey" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">Hourly Report 
                    <i class="fa fa-angle-right margin-left-10"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-default">
                                <table class="table no-border text-center hour_report mb-0" id="tblAvgTalkTimeReport">
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="col-md-3 col-sm-3 col-xs-12">
                <div class="circu_box text-center">
                    <div class="row">
                        <div class="col-md-2 col-sm-12 col-xs-12">
                            <img src="assets/img/handle_call.png" width="60" alt="talk time" />
                        </div>
                        <div class="col-md-10 col-sm-12 col-xs-12">
                            <h4 class="number" id="h4AvgHandleTime">00:00</h4>
                            <label class="name">Average Handle Time (mm:ss)</label>
                        </div>
                    </div>

                    <div class="margin-top-10 circu_footer">
                        <div class="dropdown dropdown-user text-left">
                            <a href="#" class="dropdown-toggle txt-lite-grey" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">Hourly Report 
                    <i class="fa fa-angle-right margin-left-10"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-default">
                                <table class="table no-border text-center hour_report mb-0" id="tblAvgHandleTimeReport">
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="col-md-3 col-sm-3 col-xs-12">
                <div class="circu_box text-center">
                    <div class="row">
                        <div class="col-md-2 col-sm-12 col-xs-12">
                            <img src="assets/img/call_service.png" width="60" alt="talk time" />
                        </div>
                        <div class="col-md-10 col-sm-12 col-xs-12">
                            <h4 class="number" id="h4CurrentSLA">0%</h4>
                            <label class="name font-green-soft">Service Level <span class="font-sm" id="spnTargetSLA">(Target: 0%) </span></label>
                        </div>
                    </div>

                    <div class="margin-top-10 circu_footer">
                        <div class="dropdown dropdown-user text-left">
                            <a href="#" class="dropdown-toggle txt-lite-grey" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">Hourly Report 
                    <i class="fa fa-angle-right margin-left-10"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-default">
                                <table class="table no-border text-center hour_report mb-0" id="tblSLAReport">
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="col-md-3 col-sm-3 col-xs-12">
                <div class="circu_box text-center">
                    <div class="row">
                        <div class="col-md-2 col-sm-12 col-xs-12">
                            <img src="assets/img/call_abond.png" width="60" alt="talk time" />
                        </div>
                        <div class="col-md-10 col-sm-12 col-xs-12">
                            <h4 class="number" id="h4CallsAbondonedDuration">00.00</h4>
                            <label class="name font-red">Call Abandonment (mm:ss)</label>
                        </div>
                    </div>

                    <div class="margin-top-10 circu_footer">
                        <div class="dropdown dropdown-user text-left">
                            <a href="#" class="dropdown-toggle txt-lite-grey" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">Hourly Report 
                    <i class="fa fa-angle-right margin-left-10"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-default">
                                <table class="table no-border text-center hour_report mb-0" id="tblCallAbandonmentReport">
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div class="graphs-panel">
            <div class="graphs-panel-head">
                <h4 class="bold-6 mb-0 mt-0">Call Metrics</h4>
            </div>
            <div class="graphs-panel-body">
                <div class="row margin-top-10 margin-bottom-30">
                    <div class="col-md-2 col-sm-4">
                        <div class="call-details">
                            <label class="name">Average Speed of Answer</label>
                            <h4 class="number" id="h4AvgAnswerSpeed">00:00</h4>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4">
                        <div class="call-details">
                            <label class="name">Calls <i class="fa fa-angle-right font-grey-gallery"></i>5 Min</label>
                            <h4 class="number" id="h4CallsAbove5min">0</h4>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4">
                        <div class="call-details">
                            <label class="name">Longest Call Duration</label>
                            <h4 class="number" id="h4LongestCall">00:00 sec</h4>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4">
                        <div class="call-details">
                            <label class="name">Transfer Calls</label>
                            <h4 class="number" id="h4Escalations">0</h4>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4">
                        <div class="call-details">
                            <label class="name">Conferences</label>
                            <h4 class="number" id="h4TotalConferences">0</h4>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4">
                        <div class="call-details device_bord">
                            <label class="name">Total Calls</label>
                            <h4 class="number" id="h4TotalCalls">0</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="graphs-panel">
            <div class="graphs-panel-head">
                <h4 class="bold-6 mb-0 mt-0">Agent Metrics</h4>
            </div>
            <div class="graphs-panel-body">
                <div class="row margin-top-10 margin-bottom-10">
                    <div class="col-md-2 col-sm-4">
                        <div class="call-details">
                            <label class="name">Agents Logged In</label>
                            <h4 class="number" id="h4AgentsLoggedin">0</h4>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4">
                        <div class="call-details">
                            <label class="name">Ready</label>
                            <h4 class="number font-green-soft" id="h4AgentsReady">0</h4>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4">
                        <div class="call-details">
                            <label class="name">On Call</label>
                            <h4 class="number font-blue" id="h4AgentsOnCall">0</h4>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4">
                        <div class="call-details">
                            <label class="name">In Break</label>
                            <h4 class="number font-yellow-gold" id="h4AgentsInBreak">0</h4>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4">
                        <div class="call-details">
                            <label class="name">After Call Work</label>
                            <h4 class="number" id="h4AgentsACW">0</h4>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4">
                        <div class="call-details device_bord">
                            <label class="name">Other Work Assigned</label>
                            <h4 class="number" id="h4AgentsOWA">0</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>



        <div id="divSupervisorView">
            <div class="graphs-panel">
                <div class="graphs-panel-head clearfix">
                    <h4 class="bold-6 mt-0 pull-left mb-0">Agents Activity</h4>
                    <div class="pull-right">
                        <div class="pull-left margin-right-10">
                            <label class="label bold margin-right-5" style="color: #335283;">Agent status :</label>
                            <select name="" id="agentStatusFilter">
                            </select>
                        </div>
                        <label class="label label-primary label-round mb-0 margin-right-5 durationActions" style="cursor: pointer;" actiontype="1">Today</label>
                        <label class="label label-default label-round mb-0 margin-right-5 durationActions" style="cursor: pointer;" actiontype="2">Week</label>
                        <label class="label label-default label-round mb-0 durationActions" style="cursor: pointer;" actiontype="3">Month</label>
                    </div>
                </div>
                <div class="graphs-panel-body">
                    <div class="table-responsive scroller" style="height: 230px; overflow-y: auto;" id="divAgentsSummary">
                    </div>
                </div>
            </div>

            <div class="graphs-panel">
                <div class="graphs-panel-head clearfix">
                    <h4 class="bold-6 pull-left mb-0 mt-0">Active Calls
                        <label class="margin-left-10 txt-lite-grey">Real Time - <span class="label label-circle label-grey bold" id="spanActiveCalls">0</span></label></h4>
                    <%-- <div class="pull-right">
                        <label class="label label-primary label-round mb-0 margin-right-5 callTypes" calltype="1" style="cursor: pointer;">All</label>
                        <label class="label label-default label-round mb-0 margin-right-5 callTypes" calltype="3" style="cursor: pointer;">In Bound</label>
                        <label class="label label-default label-round mb-0 callTypes" calltype="2" style="cursor: pointer;">Out Bound</label>
                    </div>--%>
                </div>
                <div class="graphs-panel-body">
                    <div class="table-responsive scroller" style="height: 225px; overflow-y: auto;" id="divActiveCalls">
                    </div>
                </div>
            </div>

            <div class="graphs-panel">
                <div class="graphs-panel-head">
                    <h4 class="bold-6 mb-0 mt-0">Calls Waiting
                        <label class="margin-left-10 txt-lite-grey">Real Time - <span class="label label-circle label-grey bold" id="spanWaitingCalls">0</span></label></h4>
                </div>
                <div class="graphs-panel-body">
                    <div class="table-responsive" style="height: 225px; overflow-y: auto;" id="divWaitingCalls">
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/verto-min.js"></script>
    <script type="text/javascript" src="scripts/custom/supervisor-dashboard.js?v=11"></script>
    <script type="text/javascript" src="scripts/custom/manager-webphone.js"></script>
</asp:Content>
