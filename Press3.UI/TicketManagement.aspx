<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="TicketManagement.aspx.cs" Inherits="Press3.UI.TicketManagement" ClientIDMode="Static"%>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Press3 - Ticket Management</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css" rel="stylesheet" />
    <style>
        p {
            word-wrap: break-word;
        }
        .categoryValue {
            width: 139px;
            text-align: left;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <input type="hidden" runat="server" id="hdnTicketId" value="0" />
    <input type="hidden" runat="server" id="hdnTicketSubject" value="" />
    <input type="hidden" runat="server" id="hdnTicketStatuses" value="" />
    <input type="hidden" runat="server" id="hdnTicketPriorities" value="" />
    <input type="hidden" runat="server" id="hdnTicketType" value="" />
    <input type="hidden" runat="server" id="hdnDueType" value="" />
    <input type="hidden" runat="server" id="hdnDurationType" value="" />
    <input type="hidden" runat="server" id="hdnIsStarred" value="" />
    <input type="hidden" runat="server" id="hdnPageIndex" value="1" />
    <input type="hidden" runat="server" id="hdnPageSize" value="1" />
    <input type="hidden" runat="server" value="" id="hdnFromDate" />
    <input type="hidden" runat="server" value="" id="hdnToDate" />
    <input type="hidden" runat="server" value="" id="hdnAgentId" />
    <input type="hidden" runat="server" id="hdnCategoryId" value="0" />
    <input type="hidden" id="hdnRoleId" value="<%= roleId %>" />

    <div class="page-content">
        <% if (Convert.ToInt32(Session["RoleId"]) == 4)
           { %>
        <div class="text-center margin-bottom-15">
            <label class="token_gap txt-lite-grey">
                <label class="ticket_sum" id="lblOverDueCount">0</label><br />
                Overdue</label>
            <label class="token_gap txt-lite-grey">
                <label class="ticket_sum" id="lblTodayDueCount">0</label><br />
                Due Today</label>
            <label class="txt-lite-grey">
                <label class="ticket_sum" id="lblTicketsOpenCount">0</label>
                <br />
                Open</label>
        </div>
        <% } 
        %>

        <div class="row">
            <div class="col-sm-3 col-md-3 col-lg-2">
                <div class="portlet lite">
                    <h4 class="txt-grey bold-6"><i class="fa fa-sliders margin-right-5"></i>Filters</h4>
                    <hr />
                    <div class="form-group margin-left-15">
                        <label class="txt-lite-grey bold-6">Status</label>
                        <div class="f_13">
                            <label class="blocked margin-bottom-10">
                                <input type="checkbox" class="margin-right-10 chkStatus" value="All" />
                                All</label>
                            <label class="blocked margin-bottom-10">
                                <input type="checkbox" class="margin-right-10 chkStatus" value="1" />
                                Open</label>
                            <label class="blocked margin-bottom-10">
                                <input type="checkbox" class="margin-right-10 chkStatus" value="2" />
                                Closed</label>
                            <label class="blocked margin-bottom-10">
                                <input type="checkbox" class="margin-right-10 chkStarredStatus" />
                                Starred</label>
                        </div>
                    </div>
                   
                                    <div class="form-group margin-left-15">
                                        <label class="txt-lite-grey bold-6">Category</label>
                                    <%-- <select id="ddlRootCategories" class="form-control categories ddlRequired">
                                    </select>--%>

                                    <div class='dropdown'style="width: 40%;">
                                        <button class='btn btn-default  dropdown-toggle selectedCategory lite-grey' type='button' data-toggle='dropdown' aria-haspopup="true" categoryid="0" aria-expanded="false" style="width: 164px;height:35px; text-align: left; font-size:small;background-color:#f9f9f9;">
                                            Select
                                        <span class='caret mainSpan' style="float: right;"></span>
                                        </button>
                                        <ul class='dropdown-menu ' id="ddlRootCategories"></ul>
                                    </div>
                                </div>
                           

                    <div class="form-group margin-left-15 f_13">
                        <label class="txt-lite-grey bold-6">Ticket Type</label>
                        <div>
                            <div class="select-style" style="width: 80%;">
                                <select id="selTicketType">
                                    <option value="0">Select</option>
                                    <option value="1">Online</option>
                                    <option value="2">Offline</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <% if (Convert.ToInt32(Session["RoleId"]) != 1)
                       { %>
                    <div class="form-group margin-left-15 f_13">
                        <label class="txt-lite-grey bold-6">Created/Modified By</label>
                        <div>
                            <div class="select-style" style="width: 80%;">
                                <select id="selAgent">
                                    <option value="0">Select</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <% } 
                    %>
                    <div class="form-group margin-left-15 f_13">
                        <label class="txt-lite-grey bold-6">Due By</label>
                        <div>
                            <div class="select-style" style="width: 80%;">
                                <select id="selDues">
                                    <option value="0">Select</option>
                                    <option value="1">Overdue</option>
                                    <option value="2">Today</option>
                                    <option value="3">Tomorrow</option>
                                    <option value="4">This Week</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-group margin-left-15 f_13" id="divTicketPriorities">
                        <label class="txt-lite-grey bold-6">Priority</label>
                        <div id="divPriorities">
                        </div>
                    </div>

                    <div class="form-group margin-left-15 f_13">
                        <label class="txt-lite-grey bold-6">Date Range</label>
                        <div>
                            <div class="select-style" style="width: 80%;">
                                <select id="selDurationType">
                                    <option value="0">Select</option>
                                    <option value="1">Today</option>
                                    <option value="2">Yesterday</option>
                                    <option value="3">This Week</option>
                                    <option value="4">This Month</option>
                                    <option value="5">Date Range</option>
                                </select>
                            </div>
                            <div class="row" id="divDatefilter" style="display: none; margin-top: 10px;">
                                <div class="col-md-12">
                                    <input type="text" class="form-control" placeholder="Select Date" id="txtDatefilter" style="width: 80%" readonly />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="col-sm-9 col-md-9 col-lg-10">
                <div class="graphs-panel">
                    <div class="graphs-panel-head">
                        <div class="clearfix">
                            <div class="col-sm-4">
                                <h5 class="bold f_15">Ticket History</h5>
                            </div>
                            <div class="col-sm-4">
                                <div class="input-group btn-w-lg">
                                    <div class="input-icon left">
                                        <i class="fa fa-search"></i>
                                        <input type="text" class="form-control inp-left-radius" style="width: 100%;" placeholder="Search Ticket Number" id="txtSearch" name="number" />
                                    </div>
                                    <span class="input-group-btn">
                                        <button type="button" class="btn btn-success btn-right-radius" id="btnSearchTicket">Search</button></span>

                                </div>
                            </div>
                            <div class="col-sm-4 text-right">
                                <span>
                                    <asp:Button ID="DownloadTicketExcelReports" runat="server" CssClass="btn btn-success btn-sm btn-circle" Text="Download to Excel" OnClick="DownloadTicketExcelReports_Click" />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="graphs-panel-body">
                        <div id="tokens">
                            <div class="row">
                                <div class="col-sm-6">
                                </div>
                                <div class="col-sm-6 text-right">
                                    <% if (Convert.ToInt32(Session["RoleId"]) == 4)
                                       { %>
                                    <label class="margin-right-20">
                                        <button type="button" class="btn btn-disable btn-sm btn-circle margin-right-5" id="merge">Merge</button>
                                        <button type="button" class="btn btn-disable btn-sm btn-circle margin-right-5" id="closeTicket">Close</button>
                                    </label>
                                    <% }
                                    %>
                                    <label class="txt-grey f_13">
                                        <span class="pageFromArrow" style="cursor: pointer;"><i class="fa fa-caret-left margin-right-5"></i></span>
                                        <span id="pageFrom"></span>
                                        of
            <span id="pageTo"></span>
                                        <span class="pageToArrow" style="cursor: pointer;"><i class="fa fa-caret-right margin-left-5"></i></span>
                                    </label>
                                </div>
                            </div>
                            <hr class="margin-top-5" id="hrTickets" />
                            <div id="divTickets"></div>
                            <div class="token_view" style="display: none;">

                                <div class="row">
                                    <div class="col-sm-3">
                                        <div class="form-group text-right">
                                            <label class="txt-grey margin-right-5">Status:</label>
                                            <select id="ddlTokenStatus" class="input-basic btn-100">
                                            </select>
                                        </div>

                                        <div class="form-group text-right">
                                            <label class="txt-grey margin-right-5">Priority:</label>
                                            <select id="ddlTokenPriority" class="input-basic btn-100">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-9">
                                        <textarea id="tokenCalllog" class="form-control" rows="3"></textarea>
                                    </div>
                                </div>

                                <div class="text-center margin-top-10">
                                    <button type="button" id="updateViewToken" class="btn btn-sm btn-circle blue margin-right-10">Update</button>
                                    <button type="button" id="cancelViewToken" class="btn btn-sm btn-circle btn-default">Cancel</button>
                                </div>

                            </div>

                            <%-- <div>
  			<div class="pull-left" style="width:5%;"><label style="margin-top:50px;"><input type="checkbox"></label></div>
            <div class="tokenHistory pull-left" style="width:95%">
            <span class="close_top"><i class="fa fa-star font-yellow-gold fa-x"></i></span>
            <div class="row">
            <div class="col-sm-8" style="border-right:1px solid #ddd;">
           <div class="pad-10">
            <div class="margin-bottom-10">
            <label class="margin-right-15 pull-left"><a class="text-uppercase font-yellow-gold bold-6 margin-left-5">#181497</a> 
            <span class="f_13 txt-grey margin-left-5">Opened on 23/04/2016</span> </label>
            <label class="pull-right text-danger f_12">
            Overdue
            </label>
            <div class="clearfix"></div>
            </div>
            <p class="txt-lite-grey">The charged call price is more than default price. Default price <strong>1.20 INR/min -</strong> Charged <strong>1.50INR/min</strong></p>
            <div class="text-right f_12">
            <a class="font-grey-gallery"><i class="fa fa-phone margin-right-5"></i> Kamal - 9848022338</a>
            </div>
            </div>
            
            </div>
            <div class="col-sm-4">
            <div class="pad-10">
            <label class="label label-sm label-danger">Closed</label>
            <label class="blocked text-primary margin-top-10 margin-bottom-10 f_13"><strong>Medium -</strong> <span class="f_11">(priority)</span></label>
            <div class="margin-bottom-10">
            <label class="label_round_blue f_11 margin-right-10">Complaint</label>
            <label class="label_round_blue f_11 margin-right-10">Press3</label>
            <label class="label_round_blue f_11">Call Tariff</label>
            </div>
            </div>
            </div>
            </div>
            </div>
              <div class="clearfix"></div>
            </div>--%>
                            <!--token view-->
                            <%-- <div class="token_view">
            <div class="row">
            <div class="col-sm-4">
            <h4 class="text-uppercase font-yellow-gold bold-6 margin-top-5">#181479 -<span class="font-red f_13 margin-left-25 text-lowercase">Overdue</span></h4>
            </div>
            <div class="col-sm-8 text-right">
            <label class="margin-right-20 f_13"><a class="font-grey-gallery"><i class="fa fa-phone margin-right-5"></i> Kamal - 9848022338</a></label>
            <label class="label_round_blue f_11 margin-right-10">Complaint</label>
            <label class="label_round_blue f_11 margin-right-10">Press3</label>
            </div>
            </div>
            
            <ul class="token_his">
            <li>
            <div>
            <label><span class="label label-success margin-right-5"> Opened </span> on High priority by <strong>Kamal</strong> on 18/04/2017 @18:14</label>
            <label class="margin-left-30 f_12 bold-6">Inbound Call - 18/05/2017</label>
            </div>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            </li>
             <li>
            <div>
            <label class="label label-danger margin-right-5">Closed</label> by <strong>Kamal</strong> on 18/04/2017 @18:14
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            </div>
            </li>
            </ul>
            
            <div class="row">
            <div class="col-sm-3">
            <div class="form-group text-right">
            <label class="txt-grey margin-right-5">Status:</label>
            <select class="input-basic btn-100">
            <option>Open</option>
            <option>Close</option>
            </select>
            </div>
           
             <div class="form-group text-right">
            <label class="txt-grey margin-right-5">Priority:</label>
            <select class="input-basic btn-100">
            <option>Urgent</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
            </select>
            </div>
            </div>
            <div class="col-sm-9">
            <textarea class="form-control" rows="3"></textarea>
            </div>
            </div>
            
            <div class="text-center margin-top-10">
            <button type="button" class="btn btn-sm btn-circle blue margin-right-10">Update</button>
            <button type="button" class="btn btn-sm btn-circle btn-default">Cancel</button>
            </div>
            
            </div>--%>
                            <!--token view end-->
                            <%-- <div>
            <div class="pull-left" style="width:5%;"><label style="margin-top:50px;"><input type="checkbox"></label></div>
            <div class="tokenHistory pull-left" style="width:95%">
            <span class="close_top"><i class="fa fa-star-o txt-grey fa-x"></i></span>
            <div class="row">
            <div class="col-sm-8" style="border-right:1px solid #ddd;">
           <div class="pad-10">
            <div class="margin-bottom-10">
            <label class="margin-right-15 pull-left"><a class="text-uppercase font-yellow-gold bold-6 margin-left-5">#181417</a> 
            <span class="f_13 txt-grey margin-left-5">Opened on 23/04/2016</span> </label>
            <label class="pull-right text-danger f_12">
            Due today / in 1 day
            </label>
            <div class="clearfix"></div>
            </div>
            <p class="txt-lite-grey">The charged call price is more than default price. Default price <strong>1.20 INR/min -</strong> Charged <strong>1.50INR/min</strong></p>
           <div class="text-right f_12">
           <a class="font-grey-gallery"><i class="fa fa-phone margin-right-5"></i> Kamal - 9848022338</a> 
            </div>
            </div>
            
            </div>
            <div class="col-sm-4">
            <div class="pad-10">
            <label class="label label-sm label-danger">Closed</label>
            <label class="blocked text-success margin-top-10 margin-bottom-10 f_13"><strong>High -</strong> <span class="f_11">(priority)</span></label>
            <div class="margin-bottom-10">
            <label class="label_round_blue f_11 margin-right-10">Complaint</label>
            <label class="label_round_blue f_11 margin-right-10">Press3</label>
            <label class="label_round_blue f_11">Call Tariff</label>
            </div>
            </div>
            </div>
            </div>
            </div>
            <div class="clearfix"></div>
            </div>--%>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>



    <div class="modal fade" id="mergeTicket" role="dialog">
        <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title bold font-blue-soft">Merge Tickets</h4>
                </div>
                <div class="modal-body">
                    <label class="txt-grey f_15"><span id="spnMergeTicketsCount">0</span> Tickets Selected - Select a primary ticket from below</label>
                    <p class="txt-lite-grey f_12">
                        All other tickets expect primary ticket will be closed. Conversations from the merged tickets will be added to the primary ticket history.
                    </p>

                    <div id="divMergeTickets"></div>

                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success btn-circle btn-sm btn-100" id="btnMerge">Merge</button>
                    <button type="button" class="btn btn-default btn-circle btn-sm btn-100" data-dismiss="modal">Close</button>

                </div>

            </div>

        </div>
    </div>

    <div class="modal fade" id="closeTicketModal" role="dialog">
        <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title bold font-blue-soft">Close Ticket</h4>
                </div>
                <div class="modal-body">
                    <label class="txt-lite-grey bold-6">Write closure note to close the ticket(s)</label>
                    <textarea class="form-control" rows="3" id="txtClosure"></textarea>

                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success btn-circle btn-sm btn-100" id="btnClosure">Update</button>
                    <button type="button" class="btn btn-default btn-circle btn-sm btn-100" data-dismiss="modal">Close</button>

                </div>

            </div>

        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="assets/global/plugins/bootstrap-daterangepicker/moment.min.js" type="text/javascript"></script>
    <script src="assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js" type="text/javascript"></script>
    <script src="scripts/custom/ticket-management.js" type="text/javascript"></script>
</asp:Content>
