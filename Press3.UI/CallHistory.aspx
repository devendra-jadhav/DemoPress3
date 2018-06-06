<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="CallHistory.aspx.cs" Inherits="Press3.UI.CallHistory" ClientIDMode="Static"%>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - Call History</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="css/jquery_ui.css" rel="stylesheet" />
    <link href="assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css" rel="stylesheet" />
    <link href="assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs2.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <input type="hidden" id="hdnRoleId" value="<%= roleId %>" />
    <div class="page-content">
        <div class="row">
            <input type="hidden" runat="server" value="Today" id="hdnDate" />
            <input type="hidden" runat="server" value="0" id="hdnCallType" />
            <input type="hidden" runat="server" value="0" id="hdnAgent" />
            <input type="hidden" runat="server" value="0" id="hdnRingGroup" />
            <input type="hidden" runat="server" value="0" id="hdnSkill" />
            <input type="hidden" runat="server" value="0" id="hdnPageSize" />
            <input type="hidden" runat="server" value="1" id="hdnPageNumber" />
            <input type="hidden" runat="server" value="" id="hdnFromDate" />
            <input type="hidden" runat="server" value="" id="hdnToDate" />
            <input type="hidden" runat="server" value="0" id="hdnCallId" />
            <input type="hidden" runat="server" value="0" id="hdnStudioId" />
             <input type="hidden" runat="server" value="0" id="hdnCallDirection" />
            <input type="hidden" runat="server" value="0" id="hdn_TC_CallId" />
            <input type="hidden" runat="server" value="" id="hdnCallsType"/>


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
                            <input type="text" class="form-control input-circle" placeholder="Select Date" id="txtDatefilter" style="margin-top: 10px; display: none;" />
                        </div>
                        <div class="form-group">
                            <label class="txt-lite-grey">Direction</label>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span class="cus_selt" id="spnDirection">In bound</span>
                                    <select id="ddlDirection" class="styled">
                                        <option value="0">In bound</option>
                                        <option value="1">Out bound</option>

                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" id="div-Call-Type">
                            <label class="txt-lite-grey">Call Type</label>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span class="cus_selt" id="spnCallType">Select</span>
                                    <select id="ddlCallType" class="styled">
                                        <option value="0">Select</option>
                                        <option value="1">Missed</option>
                                        <option value="2">Abandoned</option>
                                        <option value="3">Answered</option>
                                        <%--<option value="4">Conference</option>--%>
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
                        <div class="form-group" id="hdnSkillGroup">
                            <label class="txt-lite-grey">Skill Group</label>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span class="cus_selt" id="spnRingGroup">Select</span>
                                    <select id="ddlRingGroup" class="styled">
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="form-group" id="hdnSkills">
                            <label class="txt-lite-grey">Skill</label>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span class="cus_selt" id="spnSkill">Select</span>
                                    <select id="ddlSkill" class="styled">
                                        <option value="0">Select</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="form-group" id="hdnStudio">
                            <label class="txt-lite-grey">IVR- Studio</label>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span class="cus_selt" id="IvrStudio">select</span>
                                    <select id="ddlIvrStudio" class="styled">
                                    </select>
                                </div>
                            </div>
                        </div>

                        <%-- <div class="form-group">
            <label class="txt-lite-grey">Duration</label>
             <div class="wrapper">
            <div class="sbx">
               <span class="cus_selt" id="spnCallDuration">Call Duration</span>
              <select id="ddlCallDuration" class="styled">
                  <option>Call Duration</option>
                  <option>Wait Time</option>
                  <option>Hold Time</option>
                </select>
             </div>
           </div>
           
           
           
            </div>--%>

                        <div class="text-center">
                            <input type="button" id="btnGetReports" class="btn btn-circle btn-success" value="Get Reports" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-9 col-md-10" style="padding-left: 0px;">
                <div class="graphs-panel">
                   
                    <div class="graphs-panel-head clearfix">
                        <label class="pull-left mb-0 margin-top-10">Call History Report Test</label>
                    <label class="pull-right mb-0">
                            <label id="inboundButton" class="mb-0">
                                <asp:Button ID="DownloadExcelReports" runat="server" CssClass="btn btn-success btn-sm" Text="Download to Excel" OnClick="DownloadExcelReports_Click" /></label>
                            <label id="outboundButton" style="display: none">
                        <asp:Button ID="DownloadOutBoundExcelReports" runat="server" CssClass="btn btn-success btn-sm" Text="Download to Excel" OnClick="DownloadOutBoundExcelReports_Click" /></label>
                    </label>
                    </div>
                     <div class="col-md-12" style="text-align:right;"> <span style="color:#496176" id="pagerange">0-0 of 0</span></div>
                    <div class="graphs-panel-body">
                         <div class="table-scrollable">
                        <table id="tblCallHistory" class="table agent_report text-center table-bordered">
                           
                        </table>
                            <table id="tblOutBoundCallHistory" class="table agent_report text-center table-bordered" style="display: none">
                                <thead>
                                    <tr>
                                        <th>Time Stamp</th>
                                        <th>From Number</th>
                                        <th>To Number</th>
                                        <th>Agent Name</th>
                                        <th>Access Type</th>
                                        <th>Ring Time</th>
                                        <th>Answer Time</th>
                                        <th>End Time</th>
                                        <th>Duration (HH:MM:SS)</th>
                                        <th>End Reason</th>
                                        <th>Recording</th>
                                    </tr>
                                </thead>
                            <tbody id="outboundCallHistoryReports"></tbody>
                        </table>
                        
                  
                    </div>
                    <div id="page-selection"></div>
                    <div id="page-selection1"></div>
                    </div>
                </div>
              
            </div>
        </div>
    </div>


        <div class="modal fade" id="Tranfercalls" role="dialog">
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <div class="text-left">
                             <asp:Button ID="downloadReport" runat="server" CssClass="btn btn-success btn-sm" Text="Download Reports" OnClick="Download_Reports_Click" />
                        </div>
                        <%--<h4 class="modal-title bold font-blue-soft">Create group</h4>--%>
                </div>
                    <div class="modal-body">
                       <table id="transferCallsAndConfernceCalls" class="table agent_report text-center table-bordered">
                           
              
                       </table>
                     </div>
            </div>
                    <div class="modal-footer">
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/jquery_ui.js"></script>
    <script type="text/javascript" src="scripts/jquery.bootpag.min.js"></script> 
    <script type="text/javascript" src="assets/global/plugins/bootstrap-daterangepicker/moment.min.js"></script>
    <script type="text/javascript" src="assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js"></script>
    <script type="text/javascript" src="scripts/custom/callhistory.js?type=v2"></script>
</asp:Content>
