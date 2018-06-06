<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="VoiceMails.aspx.cs" Inherits="Press3.UI.VoiceMails" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Press3 - Voice Mails</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">

    <input id="hdnAgentId" type="hidden" value="<%= agentId %>" />
    <input id="hdnRoleId" type="hidden" value="<%= roleId %>" />

    <div class="page-content">

        <div class="row">
            <div class="col-sm-3 col-md-3 col-lg-2">
                <div class="portlet lite">
                    <h5 class="txt-grey bold-6 f_15 margin-top-5">
                        <i class="fa fa-sliders margin-right-5"></i>Filters
                    </h5>
                    <hr class="margin-top-5 margin-bottom-10" />

                    <div class="form-group">
                        <label class="txt-lite-grey">Skill Group</label>
                        <div class="select-style">
                            <select id="selectSkillGroup">
                                <option value="0">Select</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="txt-lite-grey">IVR-Studio</label>
                        <div class="select-style">
                            <select id="ddlIvrStudio">
                            </select>
                        </div>
                    </div>

                    <div id="divAssignStatus" style="display: none">
                        <div class="form-group">
                            <label class="txt-lite-grey">Assign Status</label>
                            <div class="select-style">
                                <select id="sel-assign-status">
                                    <option value="0">All</option>
                                    <option value="1">Assigned</option>
                                    <option value="2">Unassigned</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div id="divSelectAgent" style="display: none">
                        <div class="form-group">
                            <label class="txt-lite-grey">Agent</label>
                            <div class="select-style">
                                <select id="selectAgent">
                                    <option value="0">Select</option>

                                </select>
                            </div>

                        </div>
                    </div>

                    <div class="form-group">
                        <label class="txt-lite-grey">Date Range</label>

                        <div class="input-group margin-right-5 btn_full">
                            <div class="input-icon right">
                                <i class="fa fa-calendar"></i>
                                <input type="text" class="form-control input-inline" placeholder="Select Date" id="txtDatefilter" />
                            </div>
                        </div>



                    </div>

                    <div class="form-group">
                        <input type="button" id="btnGetReports" class="btn btn-circle btn-success" value="Get Reports" />
                    </div>

                </div>
            </div>
            <div class="col-sm-9 col-md-9 col-lg-10">
                <div class="graphs-panel">
                    <div class="graphs-panel-head">
                        <div class="clearfix">
                            <div class="col-sm-4">
                                <h5 class="bold-6 f_15 margin-top-10">Voicemail History </h5>
                            </div>
                            <div class="col-sm-6">
                                <div class="input-group">
                                    <div class="input-icon left">
                                        <i class="fa fa-search"></i>
                                        <input type="text" class="form-control inp-left-radius" placeholder="Search by Caller Name or Number" id="txt-caller-details" />
                                    </div>
                                    <span class="input-group-btn">
                                        <button type="button" class="btn btn-success btn-right-radius" id="btn-search">Search</button></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="graphs-panel-body" id="recordscount">
                        <label class="pull-right mb-0 txt-lite-grey bold">
                            <span id="fromnumber">0</span>-<span id="tonumber">0</span> of <span id="totalnumber">0</span>
                        </label>
                    </div>
                    <div class="graphs-panel-body">
                        <div class="table-responsive">
                            <table class="table table-advance table-bordered cbr_his" id="tbody-voice-mails" style="overflow: scroll;">
                                <%-- <thead>
       <tr>
       <th>Date &amp; Time</th>
       <th>Caller Name</th>
       <th>Caller Number</th>
       <th>Skill Group</th>
       <th>Agent</th>
       <th>Clip</th>
       
       </tr>
       </thead>
       <tbody id="tbody-voice-mails">
     
       </tbody>--%>
                            </table>
                        </div>
                        <div id="page-selection"></div>
                    </div>
                </div>
            </div>
        </div>



    </div>

    <div class="modal fade" id="cnfm-popup" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h4>Confirmation Popup</h4>
                </div>
                <div class="modal-body" id="popup-body">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-circle btn-sm btn-100" data-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="assets/global/plugins/bootstrap-daterangepicker/moment.min.js" type="text/javascript"></script>
    <script src="assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js" type="text/javascript"></script>
    <script src="scripts/jquery.bootpag.min.js" type="text/javascript"></script>
    <script src="scripts/custom/voice-mail.js" type="text/javascript"></script>
</asp:Content>
