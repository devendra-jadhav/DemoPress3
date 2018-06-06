<%@ Page Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="CallAbandonedHistory.aspx.cs" Inherits="Press3.UI.CallAbandonedHistory" ClientIDMode="Static" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - Call Abandoned History</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="css/jquery_ui.css" rel="stylesheet" />
    <link href="assets/global/plugins/bootstrap-datepicker/css/datepicker3.css" rel="stylesheet" />
    <link href="assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <input type="hidden" id="hdnRoleId" value="<%= roleId %>" />
    <div class="page-content">
        <div class="row">
            <input type="hidden" runat="server" value="Today" id="hdnDate" />
            <input type="hidden" runat="server" value="0" id="hdnCallType" />
            <input type="hidden" runat="server" value="0" id="hdnCallDirection" />
            <input type="hidden" runat="server" value="0" id="hdnCallEndStatus" />
            <input type="hidden" runat="server" value="0" id="hdnAgent" />
            <input type="hidden" runat="server" value="0" id="hdnRingGroup" />
            <input type="hidden" runat="server" value="" id="hdnFromDate" />
            <input type="hidden" runat="server" value="" id="hdnToDate" />
            <input type="hidden" runat="server" value="0" id="hdnPageSize" />
            <input type="hidden" runat="server" value="1" id="hdnPageNumber" />
            <input type="hidden" runat="server" value="0" id="hdnStudioId" />
            <div class="col-sm-3 col-md-2">
                <div class="portlet lite">
                    <div class="margin-bottom-20 pad-5">
                        <h5 class="txt-grey bold-6 f_15 margin-top-5">
                            <i class="fa fa-sliders margin-right-5"></i>Filters
                        </h5>
                        <hr class="margin-top-5 margin-bottom-10">
                        <div class="form-group">
                            <label class="txt-lite-grey">Date</label>
                            <div class="wrapper">
                                <div class="sbx" id="yoe_fld">
                                    <span class="cus_selt" id="spnDateText">Today</span>
                                    <select id="ddlDate" class="styled">
                                        <option value="1">Today</option>
                                        <option value="2">This Week</option>
                                        <option value="3">This Month</option>
                                        <option value="4">Date Range</option>
                                    </select>

                                </div>
                            </div>
                            <div class="margin-bottom-10">

                                <div class="wrapper " id="from_Timepicker">
                                    <div class="input-icon right">
                                        <i class="fa fa-calendar"></i>
                                        <span>
                                            <input id="txtDateFrom" type="text" class="form-control  date-picker " placeholder="FROM" /></span>
                                    </div>
                                </div>

                            </div>
                            <div class="margin-bottom-10" id="To_Timepicker">

                                <div class="wrapper ">
                                    <div class="input-icon right">
                                        <i class="fa fa-calendar"></i>
                                        <span>
                                            <input id="txtDateTo" type="text" class="form-control  date-picker" placeholder="TO" /></span>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <%--<div class="form-group">
                            <label class="txt-lite-grey">Call Direction</label>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span class="cus_selt" id="spnCallDirection">In bound</span>
                                    <select id="ddlCallDirection" class="styled">
                                        <option value="0">In bound</option>
                                        <option value="1">Out bound</option>

                                    </select>
                                </div>
                            </div>
                        </div>--%>
                        <div class="form-group">
                            <label class="txt-lite-grey">Call Type</label>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span class="cus_selt" id="spnCallType">Select</span>
                                    <select id="ddlCallType" class="styled">
                                        <option value="0">Select</option>
                                        <option value="1">Missed</option>
                                        <option value="2">Abandoned</option>

                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="txt-lite-grey">Call End Status</label>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span class="cus_selt" id="spnCallEndStatus">Select</span>
                                    <select id="ddlCallEndStatus" class="styled">
                                        <option value="0">Select</option>
                                        <option value="1">Abandoned</option>
                                        <option value="2">Answered</option>

                                    </select>
                                </div>
                            </div>
                        </div>
                        <% if (roleId != 1)
                           { %>
                        <div class="form-group">
                            <label class="txt-lite-grey">Agent</label>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span class="cus_selt" id="spnAgent">Select</span>
                                    <select id="ddlAgent" class="styled">
                                    </select>
                                </div>

                            </div>
                        </div>
                        <% } %>
                        <div class="form-group">
                            <label class="txt-lite-grey">Skill Group</label>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span class="cus_selt" id="spnRingGroup">Select</span>
                                    <select id="ddlRingGroup" class="styled">
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="txt-lite-grey">IVR-Studio</label>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span class="cus_selt" id="SpanIVR_studio">Select</span>
                                    <select id="ddlIVR_studo" class="styled">
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="text-center">
                            <input type="button" id="btnGetReports" class="btn btn-circle btn-success" value="Get Reports" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-9 col-md-10" style="padding-left: 0px;">
                <div class="graphs-panel">
                    <div class="graphs-panel-head clearfix">
                        <label class="pull-left mb-0 margin-top-10">Missed Calls History </label>
                        <label class="pull-right mb-0">
                            <asp:Button ID="DownloadExcelReports" runat="server" CssClass="btn btn-success btn-sm" Text="Download to Excel" OnClick="DownloadExcelReports_Click" />
                        </label>
                    </div>
                    <div class="graphs-panel-body" id="recordscount">
                        <label class="pull-right mb-0 txt-lite-grey bold">
                            <span id="fromnumber">0</span>- <span id="tonumber">0</span> of <span id="totalnumber">0</span>
                        </label>
                    </div>
                    <div class="graphs-panel-body">
                        <div class="table-scrollable">
                        <table id="tblCallHistory" style="max-height:500px; overflow:scroll auto" class="table agent_report  text-center table-bordered"  >
                       
                            </table>
                        </div>
                        <div id="page-selection"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/jquery_ui.js"></script>
    <script type="text/javascript" src="scripts/jquery.bootpag.min.js"></script>
    <script type="text/javascript" src="assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
    <script type="text/javascript" src="assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js"></script>
    <script type="text/javascript" src="scripts/custom/CallAbandonedHistory.js"></script>
</asp:Content>
