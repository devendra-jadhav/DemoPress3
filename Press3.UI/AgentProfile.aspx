<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="AgentProfile.aspx.cs" Inherits="Press3.UI.AgentProfile" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Press3 - Agent Profile </title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="css/jquery.rateyo.min.css" rel="stylesheet" />
    <link href="assets/global/plugins/bootstrap-datepicker/css/datepicker3.css" rel="stylesheet" />
    <link href="assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <style type="text/css">
        .jq-ry-container > .jq-ry-group-wrapper > .jq-ry-group {
            z-index: 5 !important;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <input type="hidden" value="<%= agentId %>" id="hdnAgentId" />
    <input type="hidden" value="<%= roleId %>" id="hdnRoleId" />
    <div class="page-content">
        <div class="row">
            <div class="col-md-3 col-sm-3">
                <div class="portlet lite">
                    <div class="profie_pic">
                        <img src="assets/img/user.jpg" class="img-responsive" alt="Profile" id="imgProfilePic" />
                        <div class="profile_name text-capitalize" id="divProfileName">-</div>
                        <label class="profile_location" id="lblProfileLocation">-</label>
                    </div>
                    <div class="profile_rate">
                        <label class="txt-lite-grey blocked margin-bottom-10">Profile Rating</label>
                        <label class="rate" style="margin: auto;">
                        </label>
                        <label class="blocked text-success f_13" id="lblRating" style="margin-top: 10px;">(0.0)</label>
                    </div>
                    <hr />

                    <div class="row margin-bottom-10">
                        <div class="col-sm-6" style="padding-right: 5px;">
                            <div class="agent_avail">
                                <label id="lblAvailableTime">00.00 %</label>
                                <span>Available</span>
                            </div>
                        </div>
                        <div class="col-sm-6" style="padding-left: 5px;">
                            <div class="agent_call">
                                <label id="lblOnCallTime">00.00 %</label>
                                <span>On Call</span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-6" style="padding-right: 5px;">
                            <div class="agent_work">
                                <label id="lblAWATime">00.00 %</label>
                                <span>Other Work</span>
                            </div>
                        </div>
                        <div class="col-sm-6" style="padding-left: 5px;">
                            <div class="agent_break">
                                <label id="lblInBreakTime">00.00 %</label>
                                <span>In Break</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-9 col-sm-9">
                <div class="portlet lite">
                    <div class="tabbable-custom">
                        <ul class="nav nav-tabs ">
                            <li class="active">
                                <a href="#tab_5_1" data-toggle="tab">My Profile </a>
                            </li>
                            <li>
                                <a href="#tab_5_2" data-toggle="tab">My Contacts </a>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane active" id="tab_5_1">
                                <div class="row">
                                    <div class="col-md-4 col-sm-4">
                                        <div class="pad-10">
                                            <label class="txt-lite-grey margin-right-10" id="lblSkillGroups">Skill Group :</label>
                                        </div>
                                    </div>
                                    <div class="col-md-8 col-sm-8 text-right">
                                        <div class="pad-10">
                                            <label class="txt-lite-grey margin-right-10" id="lblSkills">Skills :</label>
                                        </div>
                                    </div>
                                </div>
                                <hr class="margin-top-10" />
                                <div class="row f_13">
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Full Name</label>
                                            <label id="full_name" data-toggle="tooltip" data-placement="right" title=""></label>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Mobile Number</label>
                                            <label id="mobile"></label>
                                        </div>
                                    </div>
                                    <div class="col-sm-3" id="sipAccountUserNameHide">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Sip Account UserName</label>
                                            <label id="extensionNum"></label>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Email Id</label>
                                            <label id="email"></label>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Designation</label>
                                            <label id="designation"></label>
                                        </div>
                                    </div>
                                    <div class="col-sm-3" id="div-reporting-manager">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Reporting Manager</label>
                                            <label id="reportingManager"></label>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Device Type</label>
                                            <label id="deviceType"></label>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Profile Type</label>
                                            <label class="font-green-soft bold-6" id="profileType"></label>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div class="row">
                                    <div class="col-sm-5">
                                        <label class="txt-lite-grey margin-top-5">Logged in Since: <span class="bold" id="spnLoggedHrs"></span></label>
                                    </div>
                                    <div class="col-sm-4">
                                        <div class="input-group ">
                                            <div class="input-icon right">
                                                <i class="fa fa-calendar"></i>
                                                <input id="statusChangeOn" type="text" class="form-control  date-picker" placeholder="Date" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-3"><a class="btn btn-success btn-100" id="BtnGet">Get</a></div>
                                </div>
                                <div class="margin-top-25 scroll" style="height: 400px; overflow-y: auto">
                                    <ul class="chats" id="ulStatusChanges"></ul>
                                </div>
                            </div>

                            <div class="tab-pane pad-15" id="tab_5_2">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <label class="margin-top-10"><a class="font-green" id="newContact"><i class="fa fa-plus margin-right-5"></i>Create New Contact </a></label>
                                    </div>
                                    <div class="col-sm-6 f_13">
                                        <span class="txt-lite-grey">Contact List </span>
                                        <select id="contactId" class="form-control input-inline margin-left-10">
                                            <option>All Contacts</option>
                                        </select>

                                    </div>
                                </div>
                                <div class="table-responsive margin-top-15">
                                    <table id="contatsTable" class="table table-advance">
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="createContact" role="dialog">
                        <div class="modal-dialog">
                            <!-- Modal content-->
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title bold font-blue-soft">Add New Field</h4>
                                </div>
                                <div class="modal-body f_13">
                                    <table class="table no-border">
                                        <tr>
                                            <td>Name</td>
                                            <td>
                                                <input type="text" id="txtContactName" maxlength="35" class="form-control txtRequired " /></td>
                                        </tr>
                                        <tr>
                                            <td>Mobile Number</td>
                                            <td>
                                                <input type="text" id="txtMobile" maxlength="20" class="field form-control Numeric txtRequired " /></td>
                                        </tr>
                                        <tr>
                                            <td>Alternate Number</td>
                                            <td>
                                                <input type="text" id="txtAlternateMobile" maxlength="20" class="form-control" /></td>
                                        </tr>
                                        <tr>
                                            <td>Email</td>
                                            <td>
                                                <input type="text" id="txtContactEmail" maxlength="50" class="form-control" /></td>
                                        </tr>
                                        <tr>
                                            <td>Notes</td>
                                            <td>
                                                <textarea class="form-control" id="txtNote" rows="3"></textarea></td>
                                        </tr>
                                        <tr>
                                            <td>Add to Group</td>
                                            <td>
                                                <span id="spanContactGroup" class="txt-lite-grey">Group List </span>
                                                <select id="ddlContactGroups" class="form-control">
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>New Group</td>
                                            <td>
                                                <input type="text" id="txtNewGroup" maxlength="15" class="form-control" /></td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="modal-footer">
                                    <label id="lblEditErrorMsg" style="color: red"></label>
                                    <button type="button" id="btnNewContact" class="btn btn-success btn-circle btn-sm" data-dismiss="modal">Save</button>
                                    <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="deletContact" role="dialog">
                        <div class="modal-dialog">
                            <!-- Modal content-->
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title bold font-blue-soft">Are you sure you want to delete</h4>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" id="btnDeleteContact" contactid_="" class="btn btn-success btn-circle btn-sm" data-dismiss="modal">Delete</button>
                                    <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="scripts/jquery.rateyo.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/jquery.bootpag.min.js"></script>
    <script type="text/javascript" src="assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
    <script src="assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js"></script>
    <script src="scripts/custom/agent-profile.js" type="text/javascript"></script>
</asp:Content>
