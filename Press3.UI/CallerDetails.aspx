<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="CallerDetails.aspx.cs" Inherits="Press3.UI.CallerDetails" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - Caller Details</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="assets/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet" />
    <link href="assets/global/plugins/bootstrap-datepicker/css/datepicker.css" rel="stylesheet" />
    <link href="assets/global/plugins/bootstrap-datepicker/css/datepicker3.css" rel="stylesheet" />
    <link href="assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <link href="css/select2.css" rel="stylesheet" />

    <style>
        .categoryValue {
            width: 239px;
            text-align: left;
        }
        h5,p { word-break: break-all }
    </style>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">

      <input type="hidden" id="hdnIsAutoSubject" value="<%= isAutoSubject %>" />
        <input type="hidden" id="hdnIsAlsagr" value="<%= isAlsagr %>" />
    <input type="hidden" id="hdnCallId" value="<%= callId %>" />

        <input type="hidden" id="hdnFlagpopup" value="<%= flagpopup %>" />

    <div class="page-content">

        <div class="row">
            <div class="col-sm-4 col-md-3">
                <div class="portlet lite caller_prof">
                    <span id="editCaller" class="edit_icon">
                        <img src="assets/img/edit-circle-icn.png" alt="edit" height="24"></span>
                    <div class="caller_pic">
                        <img src="assets/img/user.jpg" class="img-responsive" alt="">
                    </div>
                    <div id="viewCallerDetails" class="text-center margin-bottom-15">
                        <%--<button type="button" class="btn btn-sm btn-success btn-circle"><i class="fa fa-phone margin-right-5"></i>Call</button>--%>
                        <h5 id="callerName" class="f_15 txt-grey bold-6"></h5>
                        <label id="callerMobile" class="blocked txt-lite-grey f_13"></label>
                         <label id="callerAlternatemobile" class="blocked txt-lite-grey f_13"></label>
                        <label id="callerEmail" class="blocked txt-lite-grey f_13"></label>
                    </div>


                    <div id="editCallerDetails" style="display: none;">
                        <div class="text-center margin-bottom-15 caller_edit">
                            <label>
                                <input type="text" style="height: 32px;" id="txtName" class="form-control input-inline" placeholder="Enter Name" /></label>
                            <label>
                                <input type="text" style="height: 32px;" id="txtEmail" class="form-control input-inline" placeholder="Enter Email" /></label>
                        </div>
                        <div class="text-center margin-top-15">
                            <span id="updateCallerDetails" style="cursor: pointer" class="margin-right-10"><i class="icon-check font-green f_20"></i></span>
                            <span id="cancelUpdate" style="cursor: pointer"><i class="icon-close font-red f_20"></i></span>
                        </div>
                    </div>




                </div>
            </div>
            <div class="col-sm-8 col-md-9">
                <div class="portlet lite">
                    <div>
                        <h5 class="f_15 bold-6 pull-left"><i class="icon-user margin-right-10"></i>General Details</h5>
                        <div class="pull-right">
                            <label id="editBasicDetails">
                                <img src="assets/img/edit-circle-icn.png" alt="edit" height="24"></label>
                            <div id="viewOptions" style="display: none;">
                                <label id="updateBasicDetails" class="margin-right-5"><i class="icon-check font-green f_20 margin-top-10"></i></label>
                                <label id="cancelBasicDetails"><i class="icon-close font-red f_20 margin-top-10"></i></label>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <hr class="margin-top-5">
                    <div id="lblEditErrorMsg"></div>
                    <div id="editCallerBasicDetails" style="display: none;" class="row userBasic f_13 margin-bottom-10">
                    </div>


                    <div id="viewCallerBasicDetails" class="row userBasic f_13 margin-bottom-15">
                    </div>

                    <h5 class="f_15 bold-6"><i class="fa fa-history margin-right-10"></i>History</h5>
                    <hr>
                    <div class="user_his margin-top-20">
                        <div class="tabbable-custom nav-justified">
                            <ul class="nav nav-tabs nav-justified">
                                <li class="active" >
                                    <a href="#tab_1_1_1" data-toggle="tab" class="ticketTab">
                                        <h4 class="bold-6 txt-grey"><span id="spnTicketsCount">0</span> Tickets</h4>
                                        <label class="f_13">
                                            <span class="font-blue margin-right-10"><span id="spnOpenTicketsCount">0</span> Open</span>
                                            <span class="font-yellow-gold margin-right-10"><span id="spnWIPTicketsCount">0</span> WIP</span>
                                            <span class="font-green"><span id="spnClosedTicketsCount">0</span> Closed</span>
                                        </label>
                                    </a>
                                </li>
                                <li>
                                    <a href="#tab_1_1_2" data-toggle="tab">
                                        <h4 class="bold-6 txt-grey"><span id="callsCount"></span> Calls</h4>
                                        <label class="f_13">
                                            <span id="inboundCount" class="font-blue-soft margin-right-10"></span>
                                            <span id="outboundCount" class="font-grey-gallery"></span>
                                        </label>
                                    </a>
                                </li>

                            </ul>
                            <div class="tab-content">
                                <div class="tab-pane active" id="tab_1_1_1">
                                    <h5 class="txt-lite-grey bold"><i class="fa fa-ticket margin-right-5"></i>Token History</h5>
                                       <div class="margin-top-30 margin-bottom-30">
                                              <button id="btnOfflineTicket" class="btn pull-right" type="button">Raise Offline Ticket</button>
                                              <br>
                                         </div>
                                    <hr class="margin-bottom-10" />
                                   
                                       <div class="margin-top-30 margin-bottom-30">
                                           </div>
                                       
                                
                                    <div id="callerTokenHistory">
                                    </div>
                                     <!--token view-->
            <div class="token_view" style="display: none;">

                <div id="viewToken">
                </div>

                                        <div class="row manageTickets" style="display: none">
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
                         <label class="txt-grey margin-right-5">Description:</label>
                        <textarea id="tokenCalllog" class="form-control" rows="3"></textarea>
                    </div>
                </div>

                                        <div class="text-center margin-top-10 manageAction" style="display: none">
                    <button type="button" id="updateViewToken" class="btn btn-sm btn-circle blue margin-right-10">Update</button>
                    <button type="button" id="cancelViewToken" class="btn btn-sm btn-circle btn-default">Cancel</button>
                </div>

            </div>
            <!--token view end-->
                                </div>
                                <div class="tab-pane" id="tab_1_1_2">
                                    <h5 class="txt-lite-grey bold"><i class="fa fa-phone margin-right-5"></i>Call History</h5>
                                    <hr class="margin-bottom-10" />
                                    <div id="callerCallHistory">
                                    </div>


                                </div>

                            </div>
                        </div>
                        <input id="hdnCallerNumber" type="hidden" value="<%=callerNumber %>" />



                    </div>

                </div>
            </div>
        </div>



              <%--Create Ticket PopUp--%>

        <div class="modal fade" id="tokenCreate" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content text-left">
                    <div class="modal-header">
                        <h4 class="modal-title bold font-blue-soft">Create New Ticket</h4>
                    </div>
                    <div class="modal-body f_13">

                        <div class="row">
                            <div class="col-sm-6">
                                    <div class="form-group parent">
                                        <label class="label-head">Category</label>
                                    <%-- <select id="ddlRootCategories" class="form-control categories ddlRequired">
                                    </select>--%>

                                    <div class='dropdown'>
                                        <button class='btn btn-default dropdown-toggle selectedCategory' type='button' data-toggle='dropdown' aria-haspopup="true" categoryId ="0" aria-expanded="false" style="width: 269px;text-align: left;">Select
                                        <span class='caret mainSpan' style="float:right;"></span></button>
                                        <ul class='dropdown-menu' id="ddlRootCategories"></ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label class="label-head">Priority</label>
                                    <select class="form-control ddlRequired" id="ddlPriority">
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label class="label-head">Due Date</label>
                                    <input id="txtDueDate" type="text" class="form-control required" />
                                </div>
                            </div>
                             <% if (isAlsagr == 0)
                           { %>
			                 <div class="col-sm-6">
                                <div class="form-group">
                                    <label class="label-head">Subject</label>
                                    <input id="txtSubject" class="form-control required" type="text" />
                                </div>
                            </div>
                            <% }  %>
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label class="label-head">Description</label>
                                    <textarea id="txtDescription" class="form-control required" rows="3"></textarea>
                                </div>
                            </div>
                        </div>



                        <%-- --%>
                    </div>

                    <div class="modal-footer">
                        <div id="ticketSuccessMsg" class="pull-left" style="color: green;"></div>
                        <button type="button" id="btnCreateTicket" class="btn blue btn-circle btn-sm">Create</button>
                        <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>

                    </div>

                </div>

            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
        <script type="text/javascript" src="scripts/jquery.json-2.4.min.js"></script>
    <script src="scripts/jquery_ui.js" type="text/javascript"></script>
           <script type="text/javascript" src="assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
         <script src="assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js"></script>
        <script type="text/javascript" src="scripts/select2.min.js"></script>
    <script src="scripts/custom/callerdetails.js?type=v4" type="text/javascript"></script>
              <script type="text/javascript">
                  $(document).ready(function () {
                      Index.init();
                      Index.initCalendar(); // init index page's custom scripts
                  });
      </script>
</asp:Content>
