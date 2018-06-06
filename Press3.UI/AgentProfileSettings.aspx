<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="AgentProfileSettings.aspx.cs" Inherits="Press3.UI.AgentProfileSettings" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - Agent Profile Settings</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="css/jquery.multiselect.css" rel="stylesheet" />
    <link href="css/croppie.css" rel="stylesheet" />
    <style type="text/css">
        .multiselect {
            border: 1px solid #ddd;
            border-radius: 50px !important;
            margin: 0;
            width: 100%;
            font-family: arial;
            background: #f9f9f9 url("/Images/nw_selarw.png") no-repeat scroll 97.5% center;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <div class="page-content">
        <input type="hidden" id="hdnType" value="<%=type %>" />
        <input type="hidden" id="hdnAgentId" value="<%=agentId %>" />
        <input type="file" id="profileUpload" name="userfile" value="Choose File" style="visibility: hidden" />
        <div class="portlet lite">
            <div class="row">
                <div class="col-sm-3 col-md-3">
                    <div id="profileImage" class="agent_pic">
                        <span class="label-edit" style="position: absolute; right: 0px; top: 50px;" onclick="javascript: document.getElementById('profileUpload').click();"><i class="fa fa-edit"></i></span>
                        <img id="agentProfilePic" src="/assets/img/user.jpg" class="img-responsive" alt="" />
                    </div>
                    <div id="updateProfilePic" style="display: none;">
                        <div id="demo-basic"></div>
                        <div>
                            <input type="button" id="btnSaveImage" value="Save" />
                        </div>
                    </div>
                </div>
                <div class="col-sm-9 col-md-9">
                    <h4 class="bold txt-lite-grey">Personal Settings</h4>
                    <hr>
                    <div class="row agent_prof_details">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label>Display Name</label>
                                <input type="text" controlname="Display Name" id="txtFullName" class="form-control required" autocomplete="off" maxlength="40" />
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label>First Name</label>
                                <input type="text" controlname="First Name" id="txtFirstName" class="form-control required" autocomplete="off" maxlength="30" />
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label>Last Name</label>
                                <input type="text" controlname="Last Name" id="txtLastName" class="form-control required" autocomplete="off" maxlength="30" />
                            </div>
                        </div>

                    </div>
                    <div class="row agent_prof_details">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label>Mobile Number</label>
                                <input type="text" controlname="Mobile" id="txtMobile" class="form-control required" autocomplete="off" maxlength="15" />
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label>Login Email Id</label>
                                <input type="text" controlname="Email" id="txtAgentEmail" class="form-control required" autocomplete="off" onfocus="this.type='txtAgentEmail'" maxlength="50" />
                            </div>
                        </div>
                        <% if (type == 0)
                           { %>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label>Login Password</label>
                                <input type="password" controlname="Password" id="txtAgentPassword" class="form-control required" autocomplete="off" maxlength="30" />
                            </div>
                        </div>
                        <% }
                           else
                           { %>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label>Reset Password</label>
                                <input type="checkbox" id="chkReset" />
                                <input style="display: none;" type="password" id="txtResetPassword" class="form-control" autocomplete="off" maxlength="30" />
                            </div>
                        </div>
                        <%} %>
                    </div>
                </div>
            </div>
            <div class="agent_prof_details pad-15">
                <h4 class="bold txt-lite-grey">Professional Settings</h4>
                <hr>
                <div class="row">
                    <div class="col-sm-6 col-md-3">
                        <div class="form-group">
                            <label>Designation</label>
                            <div class="wrapper">
                                <div class="sbx" id="yoe_fld">
                                    <span id="spnDesignation" class="cus_selt" id="desig_txt">Select</span>
                                    <select id="ddlDesignation" class="styled">
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-md-3">
                        <div class="form-group">
                            <div class="clearfix">
                                <label class="pull-left">Device type</label>
                                <label class="pull-right"><a class="margin-bottom-10" id="deviceTypeDetailsAttached"></a></label>
                            </div>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span id="spnDeviceType" class="cus_selt">Select</span>
                                    <select id="ddlDeviceType" class="styled">
                                    </select>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div class="col-sm-4 col-md-3">
                        <div class="form-group">
                            <label>Profile Status</label>
                            <div class="wrapper">
                                <div class="sbx" id="st_fld">
                                    <span class="cus_selt" id="spnProfileStatus"></span>
                                    <select id="ddlProfileStatus" class="styled">
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-4 col-md-3">
                        <div class="form-group">
                            <label>Skills <span id="spnSkills" class="margin-left-15"><i class="fa fa-pencil"></i></span></label>
                            <div id="divSelectedSkills">
                            </div>
                        </div>
                    </div>

                </div>

                <div class="row">
                    <div class="col-sm-6 col-md-3">
                        <div class="form-group">
                            <label>Out Bound Access</label>
                            <span class="pull-right" id="outBoundAccess"></span>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span id="outBoundType" class="cus_selt">Select</span>
                                    <select id="ddloutBoundType" class="styled">
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-md-3" id="hdnlogin" style="display: none">
                        <div class="form-group">
                            <label>Login Type</label>
                            <span class="pull-right" id="LoginType"></span>
                            <div class="wrapper">
                                <div class="sbx">
                                    <span id="loginTypeId" class="cus_selt">Select</span>
                                    <select id="ddlLoginType" class="styled">
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="divReportingMangers" class="col-sm-6 col-md-3 ">
                        <div class="form-group">
                            <label>Reporting Managers</label>
                            <div class="wrapper">
                                <select id="ddlReportingManagers" class="" multiple="multiple">
                                </select>
                            </div>
                        </div>
                    </div>
                    <div id="divReportingSupervisors" class="col-sm-6 col-md-3 ">
                        <div class="form-group">
                            <label>Reporting Supervisors</label>
                            <div class="wrapper">
                                <select id="ddlReportingSupervisors" multiple="multiple">
                                </select>
                            </div>
                        </div>
                    </div>


                    <%--<div class="col-sm-4" id="divPstn" style="display: none;">
                        <div class="form-group">
                            <label for="txtPstn">PSTN</label>
                            <div class="Wrapper">
                                <input type="text" id="txtPstn" />
                            </div>
                        </div>
                    </div>--%>
                </div>
                <div class="row">
                </div>
                <hr>
                <div class="text-center">
                    <% if (type == 0)
                       { %>
                    <button id="btnSave" type="button" class="btn btn-circle blue margin-right-10 btn-100">Save</button>
                    <% }
                       else
                       { %>
                    <button id="btnUpdate" type="button" class="btn btn-circle blue margin-right-10 btn-100">Update</button>
                    <% } %>
                    <button type="button" class="btn btn-circle blue margin-right-10 btn-100 cancel">Cancel</button>
                </div>

            </div>
        </div>
    </div>

    <div class="modal fade" id="skillsModel" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modalHeader" class="modal-title bold font-blue-soft">Select Skills </h3>
                </div>
                <div id="divSkills" class="modal-body">
                </div>
                <div class="modal-footer">
                    <button type="button" id="btnSaveSkills" class="btn btn-success btn-circle">Save</button>
                    <button type="button" id="btnCancelSkills" class="btn btn-default btn-circle" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="deviceTypeModal" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title bold font-blue-soft">Press3 Softphone</h3>
                </div>
                <div id="DeviceTypeSelection" class="modal-body">
                    <div class='row metaData f_13'>
                        <label class='text-danger text-center col-sm-12' id='lblErrorMsg'></label>
                        <div class='col-sm-6'>
                            <div class='form-group'>
                                <label class='txt-grey'>User Name<span class='text-danger'>*</span></label>
                                <input id='SoftPhoneUserName' type="text" controlname="Softphone Username" class='form-control AlphaNumerics txtRequired field' value='' maxlength="38" />
                            </div>
                        </div>
                        <div class='col-sm-6'>
                            <div class='form-group'>
                                <label class='txt-grey'>Password<span class='text-danger'>*</span></label>
                                <input id='SoftPhonePwd' type='password' controlname="Softphone password" class='form-control txtRequired field password-strength' value='' maxlength="48" />
                            </div>
                            <input class="showPwd" type="checkbox" />
                            <span class="showHide">show password</span>
                        </div>
                        <div class='col-sm-6'>
                            <div class='form-group'>
                                <label class='txt-grey'>GateWay</label>
                                <select id='SoftPhoneGateWay' class='field form-control'>
                                    <option value='0'>Select </option>
                                </select>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" id="btnSaveDeviceDetails" class="btn btn-primary btn-circle">Save</button>
                    <button type="button" id="btnCancel" class="btn btn-default btn-circle" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="ExternaldeviceTypeModal" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title bold font-blue-soft">External Sip Account </h3>
                </div>
                <div id="ExternalDeviceTypeSelection" class="modal-body">
                    <div class='row metaData f_13'>
                        <label class='text-danger text-center col-sm-12' id='ExternallblErrorMsg'></label>
                        <div class='col-sm-6'>
                            <div class='form-group'>
                                <label class='txt-grey'>Ext.Sip User Id<span class='text-danger'>*</span></label>
                                <input id='ExternalSipUserName' controlname="ExternalSip UserName" class='form-control number Numeric txtRequired field' maxlength='5' value='' />
                            </div>
                        </div>
                        <div class='col-sm-6'>
                            <div class='form-group'>
                                <label class='txt-grey'>Password<span class='text-danger'>*</span></label>
                                <input id='ExternalSipPwd' type='password' controlname="ExternalSip Password" class='form-control txtRequired field password-strength' value='' maxlength="48" />
                                <input class="showPwd" type="checkbox" />
                                <span class="showHide">show password</span>
                            </div>
                        </div>
                        <div class='col-sm-6'>
                            <div class='form-group'>
                                <label class='txt-grey'>Port Number<span class='text-danger'>*</span></label>
                                <input id='ExternalSipPortNum' controlname="ExternalSip PortNumber" class='form-control Numeric txtRequired field' maxlength='5' size='5' value='' />
                            </div>
                        </div>
                        <div class='col-sm-6'>
                            <div class='form-group'>
                                <label class='txt-grey'>GateWay</label>
                                <select id='ExternalSipGateWay' class='field form-control'>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" id="ExternalDeviceSaveDetails" class="btn btn-primary btn-circle">Save</button>
                    <button type="button" id="ExternalbtnCancel" class="btn btn-default btn-circle" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="scripts/jquery_ui.js" type="text/javascript"></script>
    <script src="scripts/jquery.iframe-transport.js" type="text/javascript"></script>
    <script src="scripts/jquery.fileupload.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/custom/common-validations.js"></script>
    <script src="scripts/croppie.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/jquery.multiselect.js"></script>
    <script src="scripts/custom/agentprofilesettings.js?type=v3" type="text/javascript"></script>
</asp:Content>
