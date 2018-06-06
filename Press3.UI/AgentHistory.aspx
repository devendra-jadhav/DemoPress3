<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="AgentHistory.aspx.cs" Inherits="Press3.UI.AgentHistory" ClientIDMode="Static" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Press3 - Agent History</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <input type="hidden" runat="server" value="0" id="hdnAgentId" />
    <input type="hidden" runat="server" value="0" id="hdnDurationType" />
    <input type="hidden" runat="server" value="" id="hdnFromDate" />
    <input type="hidden" runat="server" value="" id="hdnToDate" />
    <input type="hidden" runat="server" value="0" id="hdnSkillGroupId" />
    <input type="hidden" runat="server" value="0" id="hdnRating" />
    <input type="hidden" runat="server" value="1" id="hdnPageNumber" />

    <div class="page-content">
        <div class="row">
            <div class="col-sm-3 col-md-3 col-lg-2">
                <div class="portlet lite">
                    <div class="pad-5">
                        <h5 class="txt-grey bold-6 f_15 margin-top-5">
                            <i class="fa fa-sliders margin-right-5"></i>Filters
                        </h5>
                        <hr class="margin-top-5 margin-bottom-10" />

                        <div class="form-group">
                            <label class="txt-lite-grey">Date</label>
                            <div class="wrapper">
                                <div class="sbx" id="yoe_fld">
                                    <span class="cus_selt" id="sel_txt">Today</span>
                                    <select id="selectDuration" class="styled">
                                        <option value="0">All</option>
                                        <option value="1">Today</option>
                                        <option value="2">This Week</option>
                                        <option value="3">This Month</option>
                                        <option value="4">Date Range</option>
                                    </select>
                                </div>
                            </div>
                            <input type="text" class="form-control margin-top-5" placeholder="Select Date" id="txtDatefilter" style="opacity: 1; display: none;" readonly />
                        </div>

                        <div class="form-group">
                            <label class="txt-lite-grey">Agents</label>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span class="cus_selt" id="age_txt">All</span>
                                    <select id="selectAgent" class="styled">
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="txt-lite-grey">Skill Group</label>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span class="cus_selt" id="grp_txt">All</span>
                                    <select id="selectSkillGroup" class="styled"></select>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="txt-lite-grey">Rating</label>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span class="cus_selt" id="rate_txt">All</span>
                                    <select id="selectRating" class="styled">
                                        <option value="0">All</option>
                                        <option value="1">0 - 1</option>
                                        <option value="2">1 - 2</option>
                                        <option value="3">2 - 3</option>
                                        <option value="4">3 - 4</option>
                                        <option value="5">4 - 5</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <input type="button" id="btnGetReports" class="btn btn-circle btn-success" value="Get Reports" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-9 col-md-9 col-lg-10">
                <div class="graphs-panel">
                    <div class="graphs-panel-head clearfix">
                        <label class="pull-left margin-top-10 mb-0">Agent Performance Report</label>
                        <label class="pull-right mb-0">
                            <asp:Button ID="DownloadExcelReports" runat="server" CssClass="btn btn-success btn-sm" Text="Download to Excel" OnClick="DownloadExcelReports_Click" />
                        </label>
                    </div>
                     <div class="graphs-panel-body" id="recordscount">
                        <label class="pull-right mb-0 txt-lite-grey bold">
                            <span id="fromnumber">0</span>- <span id="tonumber">0</span>of <span id="totalnumber">0</span>
                        </label>
                    </div>
                    <div class="graphs-panel-body">
                        <div class="table-scrollable" id="divAgentHistory">
                        </div>
                        <div id="page-selection"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="scripts/jquery.bootpag.min.js" type="text/javascript"></script>
    <script src="assets/global/plugins/bootstrap-daterangepicker/moment.min.js" type="text/javascript"></script>
    <script src="assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js" type="text/javascript"></script>
    <script src="scripts/custom/agent-history.js" type="text/javascript"></script>
</asp:Content>
