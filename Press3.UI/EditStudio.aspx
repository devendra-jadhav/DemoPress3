<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="EditStudio.aspx.cs" Inherits="Press3.UI.EditStudio" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - Edit Studio</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="css/ivr-diagram.css" rel="stylesheet" type="text/css" />
    <link href="css/ivr-font-awesome.css" rel="stylesheet" type="text/css" />
    <link href="css/bootstrap-timepicker.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
        .errordiv {
            color: red;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <input type="hidden" id='hdn_ivrclipsurl' value='<%= ivrStudioShowClipUploadPath %>' />
    <input type="hidden" id="hdnStudioId" value="<%= studioId %>" />
    <input type="hidden" id='hdnactionUrl' value='<%= actionUrl %>' />
    <div class="page-content">
        <div class="portlet lite">
            <div class="alert alert-error hide" style='margin: 5px;'>
                <button class="close" data-dismiss="alert"></button>
                <span></span>
            </div>
            <div id="ivr-layout">
                <div class="controls_row">

                    <div style='width: 100%; text-align: center; display: none;' id='auto_save_msg'>
                        saving to draft......
                    </div>
                    <h3 class="page-title">Controls</h3>
                    <ul id='ivr-toolbar' class="sub-menu" style="display: block;">
                        <li name="Play message" id='pl_msg'>
                            <i class="icon-play" style="color: #e987ff"></i>
                            <span>Play message</span>
                        </li>
                        <li name="Play message with options" id='pl_msg_opt' style="display: none;">
                            <i class="icon-sitemap" style="color: #e987ff"></i>
                            <span>Play message with options</span>
                        </li>
                        <li name="Menu" id='menu'>
                            <i class="icon-sitemap" style="color: #92dafa"></i>
                            <span>Menu</span>
                        </li>
                        <li name="Time of the day" id='time'>
                            <i class="icon-time" style="color: #fdd04d"></i>
                            <span>Time of the day</span>
                        </li>
                        <li name="Ring user(s)" id='ring'>
                            <i class="icon-group" style="color: #e987ff"></i>
                            <span>Ring user(s)</span>
                        </li>
                        <li name="Voice mail" id='voice'>
                            <i class="icon-bullhorn" style="color: #92dafa"></i>
                            <span>Voice mail</span>
                        </li>
                        <%-- <li name="Conference" id='conf' style="display: none;">
				<i class="icon-group" style="color:#e987ff"></i> 
				<span>Conference</span>
			</li>--%>
                        <%-- <li name="Record message" id='record_msg'  >
				<i class="icon-play" style="color:#e987ff"></i> 
				<span>Record message</span>
			</li>--%>
                        <li name="Dial Extension" id='dialextension'>
                            <i>
                                <img src="/assets/img/hangup.png" /></i>
                            <span>Dial Extension</span>
                        </li>
                        <li name="Hang Up" id='hngup'>
                            <i>
                                <img src="/assets/img/hangup.png" /></i>
                            <span>Hang Up</span>
                        </li>
                        <li name="goto" id='goto'>
                            <i class="icon-circle-arrow-right" style="color: #9dd52a"></i>
                            <span>goto</span>
                        </li>
                        <li name="Email" id='email'>
                            <i class="icon-envelope" style="color: #e987ff"></i>
                            <span>Email</span>
                        </li>
                        <li name="SMS" id='sms'>
                            <i class="icon-comments" style="color: #92dafa"></i>
                            <span>SMS</span>
                        </li>
                        <li name="End flow" id='endflow'>
                            <i class="fa fa-ban" style="color: #ff9b9b"></i>
                            <span>End flow</span>
                        </li>
                    </ul>
                    <div class="drag_arrow">
                        <img src="assets/img/drag_arrow.png" />
                        <span>Drag &amp; Drop the Control</span>
                    </div>
                </div>

                <div class="clear"></div>
                <div id='ivr-flowchart'></div>

            </div>
        </div>
        <div class="btn_ivr_save">
            <a id='btnSave' class="btn blue button-next" href="javascript:void(0);">Update
               <i class="m-icon-swapright m-icon-white"></i></a>
        </div>
    </div>

    <div id='ivr_popups'></div>
    <div class='clear'></div>


    <!-- END CONTAINER -->


    <div class="modal fade" id="saveStudioPopup" role="dialog">
        <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title bold font-blue-soft">Save Studio</h4>
                </div>
                <div class="modal-body">
                    <table class="table no-border">
                        <tr>
                            <td>Name</td>
                            <td>
                                <input type="text" class="form-control" id="txtStudioName" placeholder="Studio name" maxlength="50" /></td>
                        </tr>
                        <tr>
                            <td>Purpose</td>
                            <td>
                                <select id="selStudioPurpose" class="form-control"></select></td>
                        </tr>
                        <tr id="trStudioPurpose" style="display: none;">
                            <td></td>
                            <td>
                                <textarea id="txtStudioPurpose" rows="5" cols="10" class="form-control"></textarea></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <label class="margin-right-20">
                                    <input type="radio" name="radioCallType" value="1" />
                                    Outbound</label>
                                <label>
                                    <input type="radio" name="radioCallType" value="0" />
                                    Inbound</label></td>
                        </tr>
                        <tr id="trCallerIdNumbers">
                            <td>CallerId Numbers</td>
                            <td>
                                <select id="selCallerIdNumbers" class="form-control"></select></td>
                        </tr>
                    </table>
                    <div id="saveStudioErr" class="text-center margin-top-10" style="color: red;"></div>
                    <div id="saveStudioSuccess" class="text-center margin-top-10" style="color: green;"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" id="btnSaveStudioDetails">Save</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <!-- popup delete control confirm -->
    <div id='del_cnfm_control' role="dialog" class="modal fade in" data-keyboard="false">
        <<div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <h4 class="text-center">Are you sure you want to delete this control?</h4>
                    <div class="text-center margin-top-15">
                        <button id="del_ok" class="btn green" type="button">OK</button>
                        <button class="btn" data-dismiss="modal" type="button">Cancel</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/jquery_ui.js"></script>
    <script type="text/javascript" src="scripts/jsapi.js"></script>
    <script type="text/javascript" src="scripts/custom/edit-ivr-connection.js"></script>
    <script type="text/javascript" src="scripts/custom/ivr-graphics.js"></script>
    <script type="text/javascript" src="scripts/custom/ivr-diagram.js"></script>
    <script type="text/javascript" src="scripts/bootstrap-timepicker.js"></script>
    <script type="text/javascript" src="scripts/jquery.iframe-transport.js"></script>
    <script type="text/javascript" src="scripts/jquery.fileupload.js"></script>
    <script type="text/javascript" src="scripts/jquery.blockui.min.js"></script>
    <script type="text/javascript" src="scripts/custom/common-validations.js"></script>
    <script type="text/javascript" src="scripts/custom/edit-studio.js"></script>
</asp:Content>
