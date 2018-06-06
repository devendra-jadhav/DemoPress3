<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="GeneralSettings.aspx.cs" Inherits="Press3.UI.GeneralSettings" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Press3 - General Settings</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="bootstrap-switch/bootstrap-switch.min.css" rel="stylesheet" type="text/css" />
    <link href="css/redactor.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
        .redactor_btn_image, .redactor_btn_video, .redactor_btn_table, .redactor_btn_link, .redactor_btn_alignment {
            display: none !important;
        }

        .redactor_dropdown {
            z-index: 99999 !important;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
<div class="page-content">
 <div class="portlet lite">
    <div class="pad-15">
        <h4 class="bold-6 txt-lite-grey">Service Level :</h4>
                <hr class="margin-top-5" />
        <div class="form-group">
        <label class="margin-right-10 txt-grey">Service level threshold (in sec) :</label>
                    <input type="text" class="form-control input-inline" style="width: 100px; margin-bottom: 5px;" id="SLAThresholdInSeconds" maxlength="3" />
        <p class="f_12 font-grey-mint">(The service level threshold is the number of seconds you set as a goal for connecting a call with an agent.)</p>
        </div>
        <div class="form-group">
            <label class="margin-right-10 txt-grey">Service level type :</label>
                    <select class="form-control input-inline" id="selSLAType">
                <option value="0">Select SLA Type</option>
            </select>
            <div class="well well-sm well-grey txt-lite-grey brd margin-top-15">
                <div id="SLADescription">
                No Description
                </div>
            </div>
        </div>
        <div class="form-group">
                    <input type="checkbox" id="DailExtension" />
                    <label class="margin-right-10 txt-grey">Include DialExtension </label>
        </div>
        <div class="form-group">
            <label class="margin-right-10 txt-grey">Target Service level percentage :</label>
                    <input type="text" class="form-control input-inline" style="width: 100px; margin-bottom: 5px;" id="SLATargetPercentage" maxlength="3" />
            <p class="f_12 font-grey-mint">(Your goal to answer "Percentage of calls" with the 'Service level threshold time'.)</p>
        </div>

        <div class="form-group text-right">
          <button type="button" class="btn btn-sm btn-success" id="btnUpdateSLA">Update</button>
        </div>

        <div class="form-group">
                    <div id="SLAError" class="text-center" style="color: red;"></div>
                    <div id="SLASuccess" class="text-center" style="color: green;"></div>
        </div>

      <%--  <h4 class="bold-6 txt-lite-grey">Schedule Adherence :</h4>
        <hr class="margin-top-5"/>
        <p class="f_12">Percentagewise share of a number of hours actualyy worked from a number of hours prescheduled to work, after deducting duration of meetings,
        lunch time, breaks and other legitimate non-productive periods.
        </p>
        <label class="f_13 txt-lite-grey margin-bottom-10">Schedule Adherence = [Phone time] / ([shift time]-[lunch]-[break]+[Exception time]+[Overtime])</label>
               
        <div class="form-group">
            <label class="margin-right-10 txt-grey">Actual shift duration in hours :</label>
        <input type="text" class="form-control input-inline input-circle" style="width:100px; margin-bottom:5px;"/>
            <p class="f_12 font-grey-mint">(Including producting and non-productive hours. Overtime will be calculated automatically)</p>
        </div>
                
        <div class="form-group">
            <label class="margin-right-10 txt-grey">Prescheduled hours of work per shift :</label>
        <input type="text" class="form-control input-inline input-circle" style="width:100px; margin-bottom:5px;"/>
            <p class="f_12 font-grey-mint">(Excluding legitimate non-productive hours)</p>
        </div>
                
        <div class="form-group">
            <label class="margin-right-10 txt-grey">Target schedule Adherence Percentage :</label>
        <input type="text" class="form-control input-inline input-circle" style="width:100px; margin-bottom:5px;"/>
        </div>--%>
                
        <h4 class="bold-6 txt-lite-grey">SMS Templates :</h4>
                <hr class="margin-top-5" />
        <div class="compose_panel">
        <div class="form-group">
        <label class="txt-grey">Select Template</label>
        <select class="form-control" id="selSmsTemplate">
        <option value="0">Template Name</option>
        </select>
        </div>
        <div class="form-group">
        <textarea class="form-control" rows="5" placeholder="Content type here" id="smsContent"></textarea>
                        <p><span id="remainingChars"></span><span id="messagesCnt"></span></p>
        </div>
        <div>
                        <label class="pull-left"><a href="javascript:;" id="lnkAddSmsTemplate"><i class="fa fa-plus margin-right-5"></i>Add New Template</a></label>
        <label class="pull-right">
        <button type="button" class="btn btn-sm btn-success margin-right-10" id="btnUpdateSmsTemplate">Update</button>
        <button type="button" class="btn btn-sm btn-danger margin-right-10" id="btnDeleteSmsTemplate">Delete</button>
        <%--<button type="button" class="btn btn-sm btn-default" id="btnCancelSmsTemplate">Cancel</button>--%>
        </label>
        <div class="clearfix"></div>
        </div>
                    <div id="smsUpdateError" class="text-center" style="color: red;"></div>
                    <div id="smsUpdateSuccess" class="text-center" style="color: green;"></div>
        </div>
                
            <h4 class="bold-6 txt-lite-grey">Email Templates :</h4>
                <hr class="margin-top-5" />
        <div class="compose_panel">
        <div class="form-group">
        <label class="txt-grey">Select Template</label>
        <select class="form-control" id="selEmailTemplate">
        <option value="0">Template Name</option>
        </select>
        </div>
        <div class="form-group">
        <label class="txt-grey">Subject</label>
        <input type="text" class="form-control" id="emailSubject" />
        </div>
        <div class="form-group">
        <label class="txt-grey">Message</label>
        <textarea class="form-control" rows="5" placeholder="Content type here" id="emailContent"></textarea>
        </div>
        <div>
                        <label class="pull-left"><a href="javascript:;" id="lnkAddEmailTemplate"><i class="fa fa-plus margin-right-5"></i>Add New Template</a></label>
        <label class="pull-right">
        <button type="button" class="btn btn-sm btn-success margin-right-10" id="btnUpdateEmailTemplate">Update</button>
        <button type="button" class="btn btn-sm btn-danger margin-right-10" id="btnDeleteEmailTemplate">Delete</button>
        <%--<button type="button" class="btn btn-sm btn-default" id="btnCancelEmailTemplate">Cancel</button>--%>
        </label>
        <div class="clearfix"></div>
        </div>
                    <div id="emailUpdateError" class="text-center" style="color: red;"></div>
                    <div id="emailUpdateSuccess" class="text-center" style="color: green;"></div>
        </div>
                
                

        <div class="form-group margin-top-15 margin-bottom-10">
        <h4 class="bold-6 mt-0 txt-lite-grey pull-left margin-right-20">Voice Mail :</h4>
                    <label>
                        <input id="chkVoiceMails" type="checkbox" name="chkVoiceMails" data-on-text="Enable" data-off-text="Disable" data-size="mini" data-off-color="danger" data-on-color="success" /></label>
        <div id="voiceMailError" class="text-danger margin-left-15 inline"></div>
        <div id="voiceMailSuccess" class="text-success margin-left-15 inline"></div>
        </div>
                <hr class="mt-0" />
               
        <h4 class="bold-6 txt-lite-grey margin-bottom-15">Outbound Communications :</h4>
               
        <div class="row">
        <div class="col-sm-6 col-md-3 margin-bottom-15">
        <div>
        <label class="bold-6 margin-right-20">Calls :</label>
                            <label>
                                <input id="chkOutboundCalls" type="checkbox" name="chkOutboundCalls" data-on-text="Enable" data-off-text="Disable" data-size="mini" data-off-color="danger" data-on-color="success" /></label>
        </div>
                        <div class="well well-sm well-lite-grey brd margin-top-10 out_bound" id="callerIdsView" style="display: none;">
            <div class="select-style">
                <select id="selCallerIds">
                </select>
            </div>
                 <%--<label class="label_round_blue margin-top-10 f_12" id="lblCallerId" style="display:none;"></label>--%>
        </div>   
        
        </div>
        <div class="col-sm-6 col-md-3 margin-bottom-15">
        <div>
        <label class="bold-6 margin-right-20">SMS :</label>
                            <label class="margin-right-20">
                                <input id="chkOutboundSms" type="checkbox" name="chkOutboundSms" data-on-text="Enable" data-off-text="Disable" data-size="mini" data-off-color="danger" data-on-color="success" /></label>
        <a class="font-grey-gallery" href="javascript:;" id="manageSenderIds" title="Manage SenderIds"><i class="icon-plus"></i></a>
        </div>
                        <div class="well well-sm well-lite-grey brd margin-top-10 out_bound" id="senderIdsView" style="display: none;">
            <div class="select-style">
                <select id="selSenderIds">
                </select>
            </div>
                 <%--<label class="label_round_blue margin-top-10 f_12">SenderID</label>--%>
        </div>
        
        </div>
        <div class="col-sm-6 col-md-3 margin-bottom-15">
        <div>
        <label class="bold-6 margin-right-20">Email :</label>
                            <label class="margin-right-20">
                                <input id="chkOutboundEmail" type="checkbox" name="chkOutboundEmail" data-on-text="Enable" data-off-text="Disable" data-size="mini" data-off-color="danger" data-on-color="success" /></label>
                            <a class="font-grey-gallery" href="javascript:;" id="manageEmail" title="Manage Email" style="display: none;"><i class="icon-plus"></i></a>
        </div>
       
        
                
        </div>
        </div>
        <div id="outBoundError" class="text-danger"></div>
        <div id="outBoundSuccess" class="text-success"></div>
    </div>
 </div>
</div>

    <div class="modal fade" id="newEmailTemplateModal" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title bold font-blue-soft">New Email Template</h4>
                </div>
                <div class="modal-body f_13">
                 <table class="table no-border">
                 <tr>
                            <td>
                                <label class="txt-grey">Name</label></td>
                            <td>
                                <input type="text" class="form-control input-basic" id="txtEmailTemplateName" /></td>
                 </tr>
                 <tr>
                            <td>
                                <label class="txt-grey">Subject</label></td>
                            <td>
                                <input type="text" class="form-control input-basic" id="txtEmailTemplateSubject" /></td>
                 </tr>
                 <tr>
                            <td>
                                <label class="txt-grey">Content</label></td>
                            <td>
                                <textarea class="form-control input-basic" id="txtEmailTemplateContent"></textarea></td>
                 </tr>
                 </table>
                </div>
                <div id="emailTemplateErr" class="margin-top-10 margin-bottom-10 text-center" style="color: red;"></div>
                <div id="emailTemplateSuccess" class="margin-top-10 margin-bottom-10 text-center" style="color: green;"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success btn-circle btn-sm" id="btnSaveEmailTemplate">Save</button>
                    <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="newSmsTemplateModal" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title bold font-blue-soft">New SMS Template</h4>
                </div>
                <div class="modal-body f_13">
                 <table class="table no-border">
                 <tr>
                            <td>
                                <label class="txt-grey">Name</label></td>
                            <td>
                                <input type="text" class="form-control input-basic" id="txtSmsTemplateName" /></td>
                 </tr>
                 <tr>
                            <td>
                                <label class="txt-grey">Content</label></td>
                            <td>
                                <textarea class="form-control input-basic" id="txtSmsTemplateContent"></textarea>
                                <p>
                                    <span id="remaining">160 characters remaining</span> <span id="messages">1 message(s)</span>
                 </td>
                 </tr>
                 </table>
                </div>
                <div id="smsTemplateErr" class="margin-top-10 text-center margin-bottom-10" style="color: red;"></div>
                <div id="smsTemplateSuccess" class="margin-top-10 text-center margin-bottom-10" style="color: green;"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success btn-circle btn-sm" id="btnSaveSmsTemplate">Save</button>
                    <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="cnfmPopup" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                    <h4>Delete confirmation </h4>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete this template?
                        <div id="cnfmPopupError" class="margin-bottom-10 text-center" style="color: red;"></div>
                    <div id="cnfmPopupSuccess" class="margin-bottom-10 text-center" style="color: green;"></div>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-success btn-circle btn-sm btn-100" id="btnCnfm" templateid="" templatetype="">Yes</button>
                        <button type="button" class="btn btn-default btn-circle btn-sm btn-100" data-dismiss="modal">No</button>
                    </div>
                 </div>
            </div>
    </div>

    <div class="modal fade" id="configureMail" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title bold font-blue-soft">Configure your email ID</h4>
                    </div>
                    <div class="modal-body f_13">
                     <table class="table no-border">
                     <tr>
                            <td class="col-sm-3">
                                <label class="txt-grey">Record Type :</label></td>
                     <td>Lorem Ipsum</td>
                     </tr>
                     <tr>
                            <td>
                                <label class="txt-grey">Host</label></td>
                            <td>
                                <input type="text" class="form-control input-basic"></td>
                     </tr>
                     <tr>
                            <td>
                                <label class="txt-grey">Points to</label></td>
                            <td>
                                <input type="text" class="form-control input-basic"></td>
                     </tr>
                     </table>
                    <p class="f_12">
                        Please configure the above values in your DNS settings and press verify button below.
                     An email with the instructions has been sent to the given email ID.
                     </p>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-success btn-circle btn-sm" data-dismiss="modal">Verify</button>
                        <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>

                    </div>

                </div>

            </div>
        </div>

    <div class="modal fade" id="senderIdPopup" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title bold font-blue-soft">Sender Ids</h4>
                </div>
                <div class="modal-body">
                    <div class="row" id="senderIdRow">
                    </div>
                <div id="senderIdError" class="margin-top-10 margin-bottom-10 text-center text-danger"></div>
                <div id="senderIdSuccess" class="margin-top-10 margin-bottom-10 text-center text-success"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success btn-circle btn-sm" id="btnSaveSenderId">Save</button>
                    <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="emailConfigurePopup" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title bold font-blue-soft">Configure Email</h4>
                </div>
                <div class="modal-body">
                    <div class="margin-bottom-15">
                        <label class="margin-right-20 txt-grey">
                            <input type="radio" name="mail_type" class="margin-right-5" value="1" />
                            SMTP
                        </label>
                        <label class="txt-grey">
                            <input type="radio" name="mail_type" class="margin-right-5" value="2" />
                            Amazon SES
                        </label>
                    </div>

                    <div class="row" id="divAmazonSES" style="display: none;">
                        <div class="col-sm-4">
                            <input type="text" class="form-control" placeholder="AWS Key" id="txtAWSKey" maxlength="50" /></div>
                        <div class="col-sm-4">
                            <input type="text" class="form-control" placeholder="AWS Secret" id="txtAWSSecret" maxlength="50" /></div>
                        <div class="col-sm-4">
                            <input type="text" class="form-control" placeholder="From Email Id" id="txtAWSEmail" maxlength="50" /></div>
                    </div>

                    <div class="row" id="divSmtp" style="display: none;">
                        <div class="col-sm-4">
                            <input type="text" class="form-control" placeholder="Ip Address" id="txtIp" maxlength="50" /></div>
                        <div class="col-sm-4">
                            <input type="text" class="form-control" placeholder="Port" id="txtPort" maxlength="5" /></div>
                        <div class="col-sm-4">
                            <input type="text" class="form-control" placeholder="From Email Id" id="txtFromEmail" maxlength="50" /></div>
                    </div>

                <div id="emailConfigureError" class="margin-top-10 margin-bottom-10 text-center text-danger"></div>
                <div id="emailConfigureSuccess" class="margin-top-10 margin-bottom-10 text-center text-success"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success btn-circle btn-sm" id="btnConfigureEmail">Save</button>
                    <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="bootstrap-switch/bootstrap-switch.js"></script>
    <script type="text/javascript" src="scripts/redactor.min.js"></script>
    <script type="text/javascript" src="assets/global/plugins/jquery.blockui.min.js"></script>
    <script src="scripts/jquery.blockui.min.js"></script>

    <script type="text/javascript" src="scripts/custom/common-validations.js"></script>
    <script type="text/javascript" src="scripts/custom/general-settings.js"></script>
</asp:Content>
