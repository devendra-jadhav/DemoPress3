<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="Callers.aspx.cs" Inherits="Press3.UI.Callers" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - Callers</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="assets/global/css/bootstrap-formhelpers.min.css" rel="stylesheet" />
    <style type="text/css">
        #sheet-err-txt {
            color: red;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <input type="hidden" id="hdnAgentId" value="<%= agentId %>" />
    <input type="hidden" id="hdnRoleId" value="<%= roleId %>" />
    <div class="page-content">
        <div class="row">
            <div class="col-sm-3 col-md-2">
                <div class="portlet lite">

                    <div id="grps">
                        <div>
                            <h5 class="f_15 bold-6 pull-left"><i class="icon-users margin-right-10"></i>Groups</h5>
                            <label class="pull-right createGroup"><i class="icon-plus text-blue margin-top-10" title="Create Group"></i></label>
                            <div class="clearfix"></div>
                        </div>
                        <hr class="margin-top-10" />
                        <ul id="lstGroups" class="crmLeftLinks">
                        </ul>

                    </div>

                    <div id="labels" class="margin-top-25">
                        <div>
                            <h5 class="f_15 bold-6 pull-left"><i class="icon-tag margin-right-10"></i>Labels</h5>
                            <label class="createLabel pull-right"><i class="icon-plus text-blue margin-top-10" title="Create Label"></i></label>
                            <div class="clearfix"></div>
                        </div>
                        <hr class="margin-top-10">
                        <ul id="lstLabels" class="crmLeftLinks">
                        </ul>

                    </div>

                </div>
            </div>
            <div class="col-sm-9 col-md-10">
                <div class="graphs-panel">
                    <div class="graphs-panel-head">
                        <div class="row">
                            <div class="col-sm-5">
                                <div class="input-group">
                                <div class="input-icon left">
                                    <i class="fa fa-search"></i>
                                    <input type="text" id="txtSearch" class="form-control inp-left-radius" placeholder="Search" />
                                </div>
                                <span class="input-group-btn">
                                    <button type="button" id="btnSearch" class="btn btn-success btn-right-radius">Search</button></span>
                            </div>
                            </div>
                            <div class="col-sm-7">
                                <div class="clearfix crm_btns">
                           
                            <div class="btn-group pull-left margin-right-10">
                                <a class="btn btn-sm grey-steel dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false">
                                    <i class="icon-users margin-right-10"></i>Move <i class="fa fa-angle-down"></i>
                                </a>
                                <ul id="lstMoveGroups" class="dropdown-menu">
                                </ul>
                            </div>

                            <div class="btn-group pull-left">
                                <a class="btn btn-sm grey-steel dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false">
                                    <i class="icon-tag margin-right-10"></i>Add <i class="fa fa-angle-down"></i>
                                </a>
                                <ul id="lstMoveLabels" class="dropdown-menu">
                                </ul>
                            </div>

                            <div class="btn-group pull-left margin-left-10 moreOption">
                                        <a class="btn btn-sm grey-steel dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false">More <i class="fa fa-angle-down"></i>
                                </a>
                                <ul id="lstMoreOptions" class="dropdown-menu callerGroups active"> 
                                            <li id="raiseTicket" groupid="" callerid=""><a href="#"><i class="icon-tag"></i>Raise Offline Ticket</a></li>
                                            <li id="delContact" groupid="" callerids="" title=" Delete Contact from this label/Group"><a href="#"><i class="fa fa-trash font-blue-hoki "></i>Delete Contact</a></li>
                                            <li id="delGroup" groupid="" title="Delete Group"><a href="#"><i class="fa fa-trash font-blue-hoki "></i>Delete Group</a></li>
                                            <li id="delLabel" labelid="" title="Delete Label"><a href="#"><i class="fa fa-trash font-blue-hoki "></i>Delete Label</a></li>
                                            <li id="EditGroup" groupid="" title="Edit Group"><a href="#"><i class="fa fa-edit  font-blue-hoki "></i>Edit Group</a></li>
                                            <li id="EditLabel" labelid="" title="Edit Label"><a href="#"><i class="fa fa-edit  font-blue-hoki "></i>Edit Label</a></li>
                                </ul>  
                            </div>

                              <div class="btn-group pull-left margin-left-10 raiseOffTick">
                            <span class="input-group-btn pull-left">
                                    <button type="button" id="btnOffRaiseTicket" class="btn btn-success btn-circle btn-sm grey-steel">Raise Offline Ticket</button></span>
                                  </div>

                            

                            <label id="addContacts" class="pull-right">
                                <button type="button" class="btn btn-success" id="addCont"><i class="fa fa-plus margin-right-5"></i>Add Contacts</button>
                            </label>

                        </div>
                            </div>
                        </div>
                         
                        
                    </div>
                    <div class="graphs-panel-body" id="recordscount">
                        <label class="pull-right mb-0 txt-lite-grey bold">
                            <span id="fromnumber" >0</span>- <span id="tonumber">0</span>of <span id="totalnumber">0</span>
                        </label>
                    </div>
                    <div class="graphs-panel-body">
                        <div class="table-responsive">
                        <table id="callersDetails" class='table table-advance table-bordered'>
                        </table>
                    </div>
                        <div id="page-selection"></div> 
                    </div>

                </div>
                
            </div>
        </div>
        <div class="modal fade" id="createGroup" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title bold font-blue-soft">Create group</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label class="txt-grey">Group Name</label>
                                    <input type="text" id="txtGroupName" maxlength="25" class="form-control" />
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label class="txt-grey">Color Code</label>
                                    <div id="createGroupColorCode" class="bfh-colorpicker" data-name="colorpicker2" data-color="#FF0000"></div>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div class="modal-footer">
                        <button id="btnCreateGroup" type="button" class="btn btn-success btn-circle btn-sm">Create</button>
                        <button id="btnCloseGroup" type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>

                    </div>

                </div>

            </div>
        </div>
        <div class="modal fade" id="createLabel" role="dialog"  data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title bold font-blue-soft">Create Label</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label class="txt-grey">Label Name</label>
                                    <input type="text" id="txtLabelName" maxlength="25" class="form-control" />
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label class="txt-grey">Color Code</label>
                                    <div id="createlabelColorCode" class="bfh-colorpicker" data-name="colorpicker2" data-color="#FF0000"></div>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div class="modal-footer">
                        <button id="btnCreateLabel" type="button" class="btn btn-success btn-circle btn-sm">Create</button>
                        <button id="btnCloseLabel" type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>

                    </div>

                </div>

            </div>
        </div>
          <div class="modal fade" id="deleteGroup" role="dialog">
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title bold font-blue-soft" style="font-size: x-large">Do You Want To Proceed ?</h3>
                          </div>
						 <%-- <div class="modal-body"> </div>--%>
                    <div class="modal-footer">
                        <button id="btndeleteGroup" type="button" class="btn btn-success btn-circle btn-sm" groupid="">Ok</button>
                        <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="deleteCaller" role="dialog">
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title bold font-blue-soft" style="font-size: x-large">Do You Want To Proceed ?</h3>
                                
                        <%--<h4><label>Confirmation Dialog</label></h4>   --%>
                          
						  <%--<div class="modal-body">
                              <h4><label>Do You Want To Proceed?</label></h4>
                    </div>--%>
                    <div class="modal-footer">
                        <button id="btndeleteCaller" type="button" class="btn btn-success btn-circle btn-sm" groupid="" callerids="">Ok</button>
                        <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>
                    </div>
                        </div>
                </div>
            </div>
        </div>

         <div class="modal fade" id="deleteLabel" role="dialog">
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title bold font-blue-soft" style="font-size: x-large">Do You Want To Proceed ? </h3>
                          
						 
                    <div class="modal-footer">
                        <button id="btndeleteLabel" type="button" class="btn btn-success btn-circle btn-sm" labelid="">Ok</button>
                        <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>
           </div>
                        </div>
                </div>
            </div>
        </div>


        <div class="modal fade" id="addCaller" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <h3 class="modal-title bold font-blue-soft">Add Contacts</h3>
                    </div>
                    <div class="modal-body">
                        <div class="tabbable-line">
                            <ul class="nav nav-tabs uploadCallers">
                                <li class="active" id-value="0">
                                    <a href="#tblAddCallerDetails" data-toggle="tab">Add Contacts </a>
                                </li>
                                <li id-value="1">
                                    <a href="#excel-caller-upload" data-toggle="tab">Excel Upload </a>
                                </li>

                            </ul>
                            <div class="tab-content">
                                <div class="tab-pane active" id="tblAddCallerDetails">
                                </div>

                                <div class="tab-pane" id="excel-caller-upload">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <label class="txt-grey">Choose File</label>
                                            <input type="file" id="excelUploadFile" />
                                            <br />
                                            <div id="sheet-file-name"></div>
                                            <div id="sheet-err-txt"></div>
                                        </div>
                                        <div class="col-sm-6 show-for-file">
                                            <label class="txt-grey">File has header</label>
                                            <div>
                                                <label class="pull-left margin-right-20">
                                                    Yes
                                                    <input type="radio" class="margin-left-5 radio_head" name="radiog_head" value='1' />
                                                </label>
                                                <label class="pull-left">
                                                    No
                                                    <input type="radio" class="margin-left-5 radio_head" name="radiog_head" value='2' /></label>
                                            </div>
                                        </div>
                                    </div>

                                    <h5 class="f_15 bold-6 show-for-file">Choose Columns</h5>
                                    <hr class="margin-top-5 margin-bottom-10 show-for-file" />
                                    <div class="row userBasic f_13 margin-bottom-15 show-for-file" id="xlinfo">
                                    </div>


                                </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <div class="pull-left" id="caller-msg"></div>
                            <button type="button" id="btnCreateCaller" class="btn btn-success">Add</button>
                            <button type="button" id="btnCancelUpdateCallerDetails" class="btn btn-default" data-dismiss="modal">Cancel</button>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/jquery_ui.js"></script>
     <script type="text/javascript" src="scripts/jquery.bootpag.min.js"></script> 
    <script type="text/javascript" src="assets/global/plugins/bootstrap-formhelpers.js"></script>
    <script type="text/javascript" src="scripts/jquery.fileupload.js"></script>
    <script type="text/javascript" src="scripts/custom/callers.js?type=v5"></script>
    <script src="scripts/jquery.blockui.min.js"></script>    
</asp:Content>
