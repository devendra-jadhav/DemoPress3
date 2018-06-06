<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="AgentHome.aspx.cs" Inherits="Press3.UI.AgentHome" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - Agent Home</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="assets/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet" />
    <link href="assets/global/plugins/bootstrap-datepicker/css/datepicker3.css" rel="stylesheet" />
    <link href="assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <link href="css/select2.css" rel="stylesheet" />
    <style type="text/css">
        body {
            background: #15253f;
        }

        #side-panel {
            margin-left: 10px !important;
            background: #15253f;
            padding-left: 5px;
            padding-right: 0px;
        }

        #tblViewCallerDetails table th, #tblViewCallerDetails table td {
            padding: 6px;
        }

        .txt_high {
            height: 300px !important;
        }

        .margin-left-70 {
            margin-left: 70px;
        }

        .element {
            height: 150px;
            width: 150px;
            margin: 0 auto;
            background-color: #10f0e9;
            animation-name: stretch;
            animation-duration: 0.9s;
            animation-timing-function: ease-out;
            animation-delay: 0;
            animation-direction: alternate;
            animation-iteration-count: infinite;
            animation-fill-mode: none;
            animation-play-state: running;
            border-radius: 100px !important;
        }

        .animate-right {
            position: relative;
            animation: animateright 0.6s;
        }

        @keyframes animateright {
            from {
                right: -300px;
                opacity: 0;
            }

            to {
                right: 0;
                opacity: 1;
            }
        }

        .element i {
            font-size: 4.5em !important;
            color: #029995;
            padding-top: 14px;
        }

        @keyframes stretch {
            0% {
                transform: scale(.2);
                background-color: #10f0e9;
                border-radius: 100px;
                animation-duration: 0.1s;
            }

            50% {
                background-color: #10f0e9;
                border-radius: 100px;
            }

            100% {
                transform: scale(.4);
                background-color: #10f0e9;
                border-radius: 100px;
            }
        }

        .linear-wipe {
            background: linear-gradient(to right, #26364f 20%, #fff 40%, #fff 20%, #26364f 60%);
            background-size: 200% auto;
            color: #26364f;
            background-clip: text;
            text-fill-color: transparent;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shine 2s linear infinite;
        }

        @keyframes shine {
            to {
                background-position: 200% center;
            }
        }

        .categoryValue {
            width: 239px;
            text-align: left;
        }

        .btn-green {
            background: #39b2bc;
            color: #fff;
        }

            .btn-green:hover, .btn-green:focus, .btn-green:active {
                background: #269ba5;
                color: #fff;
            }

        .graphs-panel {
            margin-bottom: 20px;
        }
        .notify_box{
            cursor:pointer;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <!-- BEGIN CONTAINER -->
    <!-- BEGIN SIDEBAR -->
    <input id="hdnAgentId" type="hidden" value="<%= agentId %>" />
    <input type="hidden" id="hdnIsAutoSubject" value="<%= isAutoSubject %>" />
    <input type="hidden" id="hdnIsAlsagr" value="<%= isAlsagr %>" />
     <input type="hidden" id="hdnCustomerId" value="<%= customerId %>" />
    <input type="hidden" id="hdnCallUUID" value="<%= callUUID %>" />
    <input type="hidden" id="hdnCustomerMobile" value="<%= customerMobile %>" />
    <input type="hidden" id="hdnCallId" value="<%= callId %>" />
    <input type="hidden" id="hdnCbrId" value="<%= cbrId %>" />
    <input type="hidden" id="hdnCommunicationTypeId" value="<%= communicationTypeId %>" />
    <input type="hidden" id="isAutoRefresh" value="<%= IsAutoRefresh %>" />

    <audio id="webcam" autoplay="autoplay" hidden="true"></audio>
    <div id="pageContent" class="page-content">
        <%--Call Statuses--%>
        <div class="portlet lite">
            <div class="row">
                <div class="col-sm-4">
                    <div class="agentStat">
                        <label id="avgWaitTime" class="number margin-right-10"></label>
                        <label class="name">
                            Average wait time
                            <br />
                            <span id="idle">(HH:MM:SS)</span></label>
                    </div>

                </div>
                <div class="col-sm-5">
                    <div class="agentStat">
                        <label class="number margin-right-10" id="avgCallDuration"></label>
                        <label class="name">
                            Average call duration
                            <br>
                            <span>(HH:MM:SS)</span></label>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="agentStat">
                        <label class="number margin-right-10" id="waitingCalls"></label>
                        <label class="name">Queue</label>
                    </div>
                </div>
            </div>
        </div>

        <%--Scripts--%>
        <div class="row">
            <div class="col-md-7">
                <div class="graphs-panel note_history">
                        <div class="graphs-panel-head">
                            <h4 class="bold-6 mt-0 mb-0">Scripts</h4>
                        </div>
                    <div class="graphs-panel-body">
                         <div class="row">
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label class="txt-grey margin-right-5">Scripts</label>
                                    <select id="ddlScripts" class="input-basic" style="height: 25px; padding: 0px; width: 98px;">
                                        <option value="0">Select</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label class="txt-grey margin-right-5">Sections</label>
                                    <select id="ddlSections" class="input-basic" style="height: 25px; padding: 0px; width: 90px;">
                                        <option value="0">Select</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label class="txt-grey margin-right-5">Topics</label>
                                    <select id="ddlTopics" class="input-basic" style="height: 25px; padding: 0px; width: 98px;">
                                        <option value="0">Select</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div id="sciptsdata" class="scroller" style="height: 215px;"></div>
                    </div>
                </div>
               
            </div>

            <div class="col-md-5" style="padding-left: 0px;">
                <div class="graphs-panel">
                    <div class="graphs-panel-head clearfix">
                         <h4 class="pull-left bold-6 mt-0 mb-0">Customer Basic Details</h4>
                        <label style="display: none; cursor: pointer;" id="editCallerDetails" class="pull-right label-edit mb-0"><i class="fa fa-edit"></i></label>
                    </div>
                    <div class="graphs-panel-body">
                        <div class="scroller" style="height: 250px;">
                        <div class="table-responsive" id="tblViewCallerDetails">
                        </div>
                    </div>
                </div>
                </div>


<%--          <button id="btnTest" class="btn btn-success" type="button">StartTime</button>
                  <span id="timer" class="number" style="font-size:larger;font-weight:bold;"></span>--%>
            </div>
        </div>

            <div id="offlineTicketsDiv" style="display: visible" class="portlet lite">
            <div class="text-center margin-top-20 margin-bottom-30">
                    <button id="btnOfflineTicket" class="btn btn-success" type="button" style="display: visible">Raise Offline Ticket</button>
            </div>
        </div>

        <div id="callerTokens" style="display: none;" class="portlet lite">
            <div class="text-center margin-top-20 margin-bottom-30" id="callsPanel">
                <button id="btnTokens" class="tab-btn-select btn tab-btn-left" type="button">Tickets</button>
                <button id="btnCallHistory" class="tab-btn btn tab-btn-right" type="button">Calls</button>
            </div>

            <%--Call History--%>

            <div id="callHistory" style="display: none;">
                <h5 class="txt-lite-grey bold"><i class="fa fa-phone margin-right-5"></i>Call History</h5>
                <hr class="margin-bottom-10" />

                <div id="callHistoryData">
                </div>

            </div>

            <!--token view-->
            <div class="token_view" style="display: none;">

                <div id="viewToken">
                </div>

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
            <!--token view end-->

            <%--Tokens--%>

            <div id="tokens">



                <div class="row f_13">
                    <div class="col-sm-4">
                        <label class="txt-grey">Search by Ticket Number </label>
                        <div class="input-group btn-w-lg">
                            <div class="input-icon left">
                                <i class="fa fa-search"></i>
                                <input id="txtTicketNumber" type="text" class="form-control input-circle" style="width: 100%;" placeholder="Search Ticket Number" />
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="form-group">
                            <label class="txt-grey">Status </label>
                            <select id="ddlTicketStatus" class="form-control">
                            </select>
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="form-group">
                            <label class="txt-grey">Priority </label>
                            <select id="ddlPriorities" class="form-control">
                            </select>
                        </div>
                    </div>
                    <div class="col-sm-2">
                        <button type="button" class="btn btn-success btn-circle btn-sm margin-top-25" id="newToken">Raise New</button>
                    </div>
                </div>
                    <div class="margin-top-10 margin-bottom-20 text-center" id="afterCallWork" style="display: none;">
                   <%-- <a id="btnSubmitAcw" class="font-yellow-gold f-13">Click here to submit ACW</a>--%>
                        <input type="button" id="btnSubmitAcw" class="btn btn-warning btn-circle" value="Click here to submit ACW" style="display: none" />
                </div>
                <h5 class="txt-lite-grey bold"><i class="fa fa-phone margin-right-5"></i>Ticket History</h5>
                <hr class="margin-bottom-10">
                <div id="ticketHistory">
                </div>

            </div>


        </div>

        
           
            <div class="notify_main_div" id="notifyCbr" style=""></div>

        <div class="call_back_box" id="unreadNotifier" style="display: none;">
                Call Back Request <span class="label label-white label-circle margin-left-10" id="notificationCount" style="color:#3b77ff;">2</span>
                <a class="margin-left-30 f_12" id="showCbrNotifications">Show</a>
            </div>
    <%--ACW StatusAlertBox--%>

            <div class="modal fade" id="changestatusacw" data-backdrop="static" data-keyboard="false" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <%--<button type="button" class="close" data-dismiss="modal"></button>--%>
                        <h3 class="modal-title bold font-blue-soft">Alert</h3>
                    </div>
                    <div class="modal-body">


                          <h5 class="modal-title bold font-red-soft">It seems you are on After Call Work for a while, Please submit it to take calls further </h5>

                        <div class="modal-footer">
                            <div class="pull-left" id="caller-msg"></div>
                            <button type="button" id="btnOkpop" class="btn btn-success" data-dismiss="modal">OK</button>
                           <%-- <button type="button" id="btnCancelpop" class="btn btn-default" data-dismiss="modal">Cancel</button>--%>
                        </div>

                    </div>

                </div>
            </div>
        </div>


 


    </div>
    <%--Side Panel--%>
    <div class="col-md-2 pull-left" id="side-panel">
            <div style="color: #e2f6fa; font-size: 11px;" id="spn-ivr-details" class="margin-bottom-10"></div>
        <div id="answerModal" class="animate-right margin-top-30" style="display: none;">
            <h4 class="call-prog blocked margin-bottom-10 bold linear-wipe" id="callFrom"></h4>
            <span class="margin-top-10 blocked" style="color: #e2f6fa;" id="modalHeader"></span>
            <button type="button" id="btnAnswerCall" class="btn btn-circle btn-success margin-top-15"><i class="fa fa-phone faa-wrench animated margin-right-5"></i>Answer</button>
        </div>
        <div>
            <div id="divSidePanel" style="display: none;" class="animate-right">
                <h5 class="mt-0 f_15" style="color: #74e0ff;"><i class="fa fa-comments margin-right-5"></i>Communication Panel</h5>
                <hr class="margin-top-5">
                <label class="call-prog blocked margin-bottom-10" id="lbl-call-type">Inbound call in progress</label>
                <label class="call_time">00:00:00</label>
                <div id="divConferenceInProgress" style="display: none;">
                    <hr style="border-color: #fff; border-width: 1px; width: 40px; margin: 15px auto;" />
                    <label class="blocked margin-top-15 margin-bottom-5"><a class="call-prog" id="ConfMemb">Conference Call <i class="fa fa-angle-right margin-left-5"></i></a></label>
                    <span class="f_13 bold-6 font-white conference_call_time">00:00:00</span>
                </div>


                <div class="margin-top-20 margin-bottom-15">
                    <label id="lblMute" style="cursor: pointer;" class="call_icon margin-right-15"><i class="fa fa-microphone-slash"></i></label>
                    <label id="lblUnMute" style="display: none; cursor: pointer;" class="call_icon_select margin-right-15"><i class="fa fa-microphone"></i></label>
                    <label id="lblHold" style="cursor: pointer;" class="call_icon"><i class="fa fa-pause"></i></label>
                    <label style="display: none; cursor: pointer;" id="lblUnHold" class="call_icon_select"><i class="fa fa-play"></i></label>
                </div>
                <div>
                    <div class="input-group margin-bottom-5">
                        <div id="divtransferCall" class="input-group-btn callActions">
                            <button type="button" class="btn btn-sm dark_blue" style="width: 20%;"><i class="fa fa-exchange"></i></button>
                            <button type="button" class="btn btn-sm lite_blue" style="width: 80%;">Transfer</button>
                        </div>
                    </div>
                    <div class="input-group  margin-bottom-5">
                        <div id="divwarmTransferCall" class="input-group-btn callActions">
                            <button type="button" class="btn btn-sm dark_blue" style="width: 20%;"><i class="fa fa-random"></i></button>
                            <button type="button" class="btn btn-sm btn-w-lg lite_blue" style="width: 80%;">Warm transfer</button>
                        </div>
                    </div>

                    <div class="input-group margin-bottom-5">
                        <div id="divConference" class="input-group-btn callActions">
                            <button type="button" class="btn btn-sm dark_blue" style="width: 20%;"><i class="fa fa-plus"></i></button>
                            <button type="button" class="btn btn-sm btn-w-lg lite_blue" style="width: 80%;">Add to conference</button>
                        </div>
                    </div>
                    <div class="input-group margin-bottom-5">
                        <div id="divCallbackRequest" class="input-group-btn">
                            <button type="button" class="btn btn-sm dark_blue" style="width: 20%;"><i class="fa fa-long-arrow-left"></i></button>
                            <button type="button" class="btn btn-sm btn-w-lg lite_blue" style="width: 80%;">Call back request</button>
                        </div>
                    </div>


                    <div class="divHangUpCall">
                        <button type="button" class=" btn btn-sm btn-danger btn_full">Wrap up call</button>
                    </div>

                       <div>
                            <div class="divSubmitAcwNew margin-top-20" style="display: none;">
                            <button type="button" class="btn btn-green">I'm READY for next call</button>
                        </div>
                    </div>
                </div>

                <div id="divAgents" style="display: none;" class="actionsData margin-top-15 sub-elements">
                    <div class="form-group">
                        <label id="lblAction"></label>
                        <select id="ddlTransfers" class="form-control">
                            <option value="0">---Select---</option>
                            <option value="1">Agents</option>
                            <%--<option value="2">Extension</option>
                            <option value="3">Mobile</option>--%>
                        </select>
                        <div class="form-group" id="divTransfers"></div>
                    </div>
                </div>
                <div id="divTransferCall" style="display: none;" class="actionsData margin-top-15 sub-elements">
                    <div class="form-group text-center mb-0">
                        <button type="button" id="btnTransferCall" class="btn btn-sm btn-circle btn-success margin-bottom-5" style="width: 165px;">Transfer Now</button>
                    </div>
                </div>
                <div id="divWarmTransferCall" style="display: none;" class="actionsData margin-top-15 sub-elements">
                    <div id="divWarmTransferCallAction" class="form-group text-center mb-0">
                        <button type="button" id="btnWarmTransferCall" class="btn btn-sm btn-circle btn-success margin-bottom-5" style="width: 165px;">Transfer Now</button>
                    </div>
                    <div id="divWarmTransferCallActions" style="display: none;" class="form-group text-center mb-0">
                        <button id="btnCancelWarmTransfer" type="button" class="btn btn-sm btn-circle btn-danger margin-bottom-5" style="width: 165px;"><i class="fa fa-times margin-right-5"></i>Cancel Transfer</button>
                        <button action="UnHold" id="btnUnHoldWarmTransfer" type="button" class="btn btn-sm btn-circle btn-default margin-bottom-5" style="width: 165px;"><i class="fa fa-microphone-slash margin-right-5"></i>UnHold Customer</button>
                        <button id="btnCompleteWarmTransfer" type="button" class="btn btn-sm btn-circle btn-primary margin-bottom-5" style="width: 165px;"><i class="fa fa-check margin-right-5"></i>Complete Transfer</button>
                    </div>
                </div>

                <div id="divConferenceCall" style="display: none;" class="actionsData margin-top-15 sub-elements">
                    <div id="divConferenceCallAction" class="form-group text-center mb-0">
                        <button id="btnStartConference" type="button" class="btn btn-sm btn-circle btn-success margin-bottom-5" style="width: 165px;"><i class="fa fa-check margin-right-5"></i>Start Conference</button>
                    </div>
                    <div id="divConferenceCallActions" style="display: none;" class="form-group text-center mb-0">
                        <button id="btnEndConference" type="button" class="btn btn-sm btn-circle btn-default font-red margin-bottom-5" style="width: 165px;"><i class="fa fa-times margin-right-5 font-red"></i>End Conference</button>
                        <button id="btnAddParticipant" type="button" class="btn btn-sm btn-circle btn-success margin-bottom-5" style="width: 165px;"><i class="fa fa-plus margin-right-5"></i>Add Participant</button>
                    </div>
                    <div id="divAddParticipantAction" style="display: none;" class="form-group text-center mb-0">
                        <button id="btnAddParticipantToConference" type="button" class="btn btn-sm btn-circle btn-default margin-bottom-5" style="width: 165px;"><i class="fa fa-plus margin-right-5"></i>Add Participant</button>
                    </div>
                </div>



                <div id="divSidePanelWithOutActions" class="animate-right" style="display: none">
                    <h5 class="mt-0 f_15" style="color: #74e0ff;"><i class="fa fa-comments margin-right-5"></i>Communication Panel</h5>
                    <hr class="margin-top-5" />
                    <label class="call-prog blocked margin-bottom-10">call in progress</label>
                    <label class="call_time">00:00:00</label>
                    <div>
                        <div class="divHangUpCall">
                            <button type="button" class="divHangUpCall btn btn-sm btn-danger btn_full">Wrap up call</button>
                        </div>
                    </div>

                     <div>
                        <div class="divSubmitAcwNew margin-top-20">
                            <button type="button" class="btn btn-green">I'm READY for next call</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <%--Edit Caller Details PopUp--%>

        <div class="modal fade" id="editCallerDetailsModal" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <h3 class="modal-title bold font-blue-soft">Update Caller Details</h3>
                    </div>
                    <div class="modal-body" id="tblEditCallerDetails">
                    </div>

                    <div class="modal-footer">
                            <button type="button" id="btnUpdateCallerdetails" class="btn btn-success" data-dismiss="modal" contactnumber="">Update</button>
                        <button type="button" id="btnCancelUpdateCallerDetails" class="btn btn-default" data-dismiss="modal">Cancel</button>

                    </div>

                </div>

            </div>
        </div>

        <%--Conference Call PopUp--%>

        <div class="modal fade" id="ConferenceList" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title bold font-blue-soft">Manage Members</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row" id="divConferenceMembersData">
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-success btn-circle btn-sm" data-dismiss="modal">Submit</button>
                        <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>

                    </div>

                </div>

            </div>
        </div>

        <%--Create Ticket PopUp--%>

        <div class="modal fade" id="tokenCreate" role="dialog" data-keyboard="false" data-backdrop="static">
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
                                        <button class='btn btn-default dropdown-toggle selectedCategory' type='button' data-toggle='dropdown' aria-haspopup="true" categoryid="0" aria-expanded="false" style="width: 269px; text-align: left;">
                                            Select
                                        <span class='caret mainSpan' style="float: right;"></span>
                                        </button>
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
                            <button type="button" id="btnCreateTicket" class="btn blue btn-circle btn-sm" isoffline="0">Create</button>
                        <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>

                    </div>

                </div>

            </div>
        </div>

        <div class="modal fade" id="callBackRequest" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content text-left">
                    <div class="modal-header">
                        <h4 class="modal-title bold font-blue-soft">Callback Request</h4>
                    </div>
                    <div class="modal-body f_13">
                        <div class="form-group">
                            <label class="txt-grey">Date &amp; Time</label>

                            <input class="form-control" id="txtDateTime" type="text" />


                        </div>
                        <div class="form-group">
                            <label class="txt-grey">Dial out type</label>
                         <%--   <select id="ddlDialType" class="form-control">
                              <%--  <option value="1">auto</option>--%>
                                <label class="txt-Black">Manual</label>
                            <%--</select>--%>
                        </div>
                        <div class="form-group">
                            <label class="txt-grey">Notes</label>
                            <textarea id="taNotes" class="form-control" rows="4"></textarea>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" id="btnSubmitCallBackRequest" class="btn btn-success btn-circle btn-sm">Submit</button>
                        <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>

                    </div>

                </div>

            </div>
        </div>

        <!-- Offline ticket popup -->
        <div class="modal fade" id="offlineTicketPopup" role="dialog" data-keyboard="false" data-backdrop="static">
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close closeOffline" data-dismiss="modal"></button>
                        <h4 class="bold">Raise offline ticket for </h4>
                    </div>
                    <div class="modal-body">
                        <div class="row margin-bottom-10">
                            <div class="col-md-6">
                                    <input type="radio" value="0" name="customerType" class="form-control" />
                                    Existing Customer
                            </div>
                            <div class="col-md-6">
                                    <input type="radio" value="1" name="customerType" class="form-control" />
                                    New Customer
                            </div>
                        </div>
                            <div id="existingUsersDiv" style="display: none;">
                                <div class='input-group'><div class='input-icon left'>
                                <i class='fa fa-search'></i><input id='txtContactSearch' class='form-control btn-circle-left' placeholder='Search' type='text'/>
                                </div><span class='input-group-btn'><button type='button' id='btnSearchContact' class='btn btn-success btn-circle-right'>Search</button></span></div>
                                    <br/>                          
                            <select id="selExistingUser" class="form-control">
                            </select>
                        </div>
                        <div id="userDetailsDiv" style="display: none;" class="margin-top-20">
                                <div id="userDetails" style="display: none; border: 1px solid grey; padding: 5px;" class="margin-top-10">
                            </div>
                            <div id="btnNextDiv" style="display: none;" class="margin-top-10">
                                <input type="button" value="Next" class="btn btn-success" id="btnNext" />
                            </div>
                        </div>
                        
                       <%-- <div id="offlineTickets" style="display:none;" class="margin-top-20">
                            <div class='margin-top-10'><input type='button' value='Raise a ticket' class="btn btn-success" id="btnRaiseTicket" /></div>
                            <div id="offlineTicketsHistory"></div>
                        </div>--%>
                    </div>
                    <div class="modal-footer">
                            <div id="callerSuccess" style="color: green;" class="text-center"></div>
                        <%--<button type="button" class="btn btn-success btn-circle btn-sm btn-100" id="btnCnfm">Yes</button>
                        <button type="button" class="btn btn-default btn-circle btn-sm btn-100" data-dismiss="modal">No</button>--%>
                    </div>
                 </div>
            </div>
            </div>
            <div class="modal fade" id="AgentIdle" data-backdrop="static" data-keyboard="false" role="dialog">
                    <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                        <div class="modal-header" style="border-bottom: none">
                       <button id="closeAgentIdle" type="button" class="close" data-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-danger text-center">
                            Idle Time : <span class="bold-6 margin-left-10" id="agentIdleTime"></span>
                        </div>

                        <div class="row" id="agentLoginStatus">                            
                        </div>
                        <hr />
                            <div class="row margin-bottom-20" id="agentCallStatus">
                        </div>
                       <%-- <div class="well well-sm well-lite-grey text-left">
                           <label class="bold-6 blocked"> Supervisor's Message :</label>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>--%>
                    </div>

                </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="finishACWPopup" role="dialog" data-backdrop="static" data-keyboard="false">
             <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content text-left">
                    <div class="modal-header">
                        <h4 class="modal-title bold font-blue-soft">It seems you are in AFTER CALL WORK for more than <span id="ACWInTime"></span>minutes!</h4>
                    </div>
                    <div class="modal-body f_13">
                        <div class="form-group text-center">
                            <h5 class="modal-title bold font-blue-soft">Finish your ‘ACW’ now or your status will be changed to ‘Ready’ automatically</h5>
                        </div>
                        <div class="form-group text-center"><span class="" style="color: #D2691E; font-size: 26px"><span id="min"></span>:<span id="sec"></span></span></div>
						
                    </div>
                    <div class="modal-footer ">
                        <div class="text-center">
                            <button type="button" id="finishAcw" class="btn btn-success btn-circle btn-sm ">Finish ACW</button>
                        </div>
                    </div>
				</div>
			</div>
        </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/jquery.json-2.4.min.js"></script>
    <script type="text/javascript" src="scripts/verto-min.js"></script>
    <script type="text/javascript" src="scripts/timer.jquery.js"></script>
    <script type="text/javascript" src="assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
    <script type="text/javascript" src="assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js"></script>
    <script type="text/javascript" src="scripts/select2.min.js"></script>
    <script type="text/javascript" src="scripts/jquery.slimscroll.min.js"></script>
    <script type="text/javascript" src="scripts/custom/webphone.js?type=v7"></script>
    <script type="text/javascript" src="scripts/custom/agenthome.js?type=194"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            Metronic.init(); // init metronic core componets
            Layout.init(); // init layout
        });
    </script>
</asp:Content>
