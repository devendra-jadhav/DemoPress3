<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="AgentCallEvaluationReport.aspx.cs" Inherits="Press3.UI.AgentCallEvaluationReport" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Press3 - Agent CallEvaluation Reports </title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <input type="hidden" id="hdnAgentId" value="<%= agentId %>" />
    <input type="hidden" id="hdnRoleId" value="<%= roleId %>" />
    <div class="page-content">
        <div class="row">
            <% if (roleId != 1)
               { %>
            <div class="col-sm-3 col-md-3 col-lg-2">
                <div class="portlet lite">
                    <h4 class="bold-6"><i class="fa fa-sliders margin-right-5"></i>Filters</h4>
                    <hr />
                    <div class="form-group">
                        <label class="txt-grey">Agent Name</label>
                        <div class="select-style">
                            <select id="selAgents">
                                <option value="0">All</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="txt-grey blocked">Date Range</label>
                        <input type="text" class="form-control" placeholder="Select Date" id="txtDatefilter" style="opacity: 1;" readonly />
                    </div>
                    <div class="form-group">
                        <input type="button" id="btnGetReports" class="btn btn-circle btn-success" value="Get Reports" />
                    </div>
                </div>
            </div>
            <% } %>
            <% if (roleId != 1)
               { %>
            <div class="col-sm-9 col-md-9 col-lg-10">
                <% } %>
                <% else
               { %>
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <% } %>
                    <div class="graphs-panel">
                        <div class="graphs-panel-head">
                            <h4 class="bold-6 mb-0 mt-0">Call Evaluation Reports</h4>
                        </div>
                         <div class="graphs-panel-body" id="recordscount">
                        <label class="pull-right mb-0 txt-lite-grey bold">
                            <span id="fromnumber">0</span>- <span id="tonumber">0</span> of <span id="totalnumber">0</span>
                        </label>
                       </div>
                        <div class="graphs-panel-body">
                            <div class="table-responsive">
                                <table class="table table-advance table-bordered score_reports">
                                    <thead>
                                        <tr>
                                            <th rowspan="2">Date</th>
                                            <th rowspan="2">Evaluated by</th>
                                            <th rowspan="2">Evaluated to</th>
                                            <th colspan="4" class="text-center">Call Details</th>
                                            <th rowspan="2">Total Questions</th>
                                            <th rowspan="2">Positive</th>
                                            <th rowspan="2">Negative</th>
                                            <th rowspan="2">Score</th>
                                            <th rowspan="2">Rating</th>
                                            <th rowspan="2">Manager Advise</th>
                                            <th rowspan="2">Actions</th>
                                        </tr>
                                        <tr>
                                            <td>SkillGroup</td>
                                            <td>Caller Number</td>
                                            <td>Date &amp; time</td>
                                            <td>Call Clip</td>
                                        </tr>
                                    </thead>
                                    <tbody id="callEvaluationReports">
                                    </tbody>
                                </table>
                            </div>
                             <div id="page-selection"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="assets/global/plugins/bootstrap-daterangepicker/moment.min.js" type="text/javascript"></script>
    <script src="assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js" type="text/javascript"></script>
    <script src="scripts/jquery.bootpag.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/custom/agent-call-evaluation-reports.js"></script>
</asp:Content>
