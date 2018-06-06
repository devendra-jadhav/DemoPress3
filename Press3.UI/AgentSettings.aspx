<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="AgentSettings.aspx.cs" Inherits="Press3.UI.AgentSettings" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - Agent Settings</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="css/jstree_style.css" rel="stylesheet" />
    <link href="css/jquery_ui.css" rel="stylesheet" />
    <link href="bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css" rel="stylesheet" />
    <style type="text/css">
        .input-inline {
            width: auto !important;
            display: inline-block !important;
        }

        body {
            background: #26364F;
        }

        .bfh-colorpicker input.form-control {
            width: auto;
        }

        .graphs-panel {
            margin-bottom: 20px;
        }
        .wid89{
            width:89%;
        }
        .wid100{
            width:100%;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">

    <div class="page-content">
        <div class="graphs-panel">
            <div class="graphs-panel-head clearfix">
                <h4 class="bold-6 pull-left mb-0 margin-top-5">Caller Basic Details</h4>
                <label class="pull-right mb-0">
                    <a class="btn btn-success margin-right-15" id="btnAddField"><i class="fa fa-plus margin-right-5"></i>Add New Field</a>
                    <a class="btn btn-success" id="btnEditField"><i class="fa fa-edit margin-right-5"></i>Edit Fields</a>
                </label>
            </div>
            <div class="graphs-panel-body">
                <div id="divFields">

                    <div class="field_panel">
                        <label class="txt-grey blocked f_15 margin-bottom-10">Name</label>
                        <div class="row">
                            <label class="col-sm-2 col-md-2">
                                <input type="text" class="form-control input-inline" placeholder="Name" /></label>
                            <div class="col-sm-10 col-md-10">
                                <ul class="chats">
                                    <li class="in">
                                        <div class="message">
                                            <span class="arrow"></span>
                                            <label class="margin-right-20">
                                                Input Type : 
                                                <span class="font-grey-gallery bold-6">Alpha Numeric</span>
                                            </label>

                                            <label class="margin-right-20">Max char Limit : <span class="font-grey-gallery bold-6">50</span></label>
                                            <label class="margin-right-10">
                                                Mandatory Field : 
                                            <span class="font-grey-gallery bold-6">Yes</span>
                                            </label>

                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="field_panel">
                        <label class="txt-grey blocked f_15 margin-bottom-10">Mobile</label>
                        <div class="row">
                            <label class="col-sm-2 col-md-2">
                                <input type="text" class="form-control input-inline" placeholder="Mobile" /></label>
                            <div class="col-sm-10 col-md-10">
                                <ul class="chats">
                                    <li class="in">
                                        <div class="message">
                                            <span class="arrow"></span>
                                            <label class="margin-right-20">
                                                Input Type : 
                                                <span class="font-grey-gallery bold-6">Numeric</span>
                                            </label>

                                            <label class="margin-right-20">Max char Limit : <span class="font-grey-gallery bold-6">20</span></label>
                                            <label class="margin-right-10">
                                                Mandatory Field : 
                                            <span class="font-grey-gallery bold-6">Yes</span>
                                            </label>

                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="field_panel">
                        <label class="txt-grey blocked f_15 margin-bottom-10">Email</label>
                        <div class="row">
                            <label class="col-sm-2 col-md-2">
                                <input type="text" class="form-control input-inline" placeholder="Email" /></label>
                            <div class="col-sm-10 col-md-10">
                                <ul class="chats">
                                    <li class="in">
                                        <div class="message">
                                            <span class="arrow"></span>
                                            <label class="margin-right-20">
                                                Input Type : 
                                            <span class="font-grey-gallery bold-6">Alpha Numeric</span>
                                            </label>

                                            <label class="margin-right-20">Max char Limit : <span class="font-grey-gallery bold-6">200</span></label>
                                            <label class="margin-right-10">
                                                Mandatory Field : 
                                        <span class="font-grey-gallery bold-6">Yes</span>
                                            </label>

                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
                <div id="divSecondaryFields" class="connectedSortable">
                </div>

                <div class="text-center">
                    <button type="button" style="display: none;" id="btnAddFields" class="btn btn-success btn-100 margin-right-10">Save</button>
                    <button type="button" style="display: none;" id="btnUpdateFields" class="btn btn-success btn-100">Update</button>
                </div>
            </div>
        </div>

        <h4 class="bold-6">Ticket Management</h4>
        <br />

        <div class="row">
            <div class="col-sm-12 col-md-6 f_13">
                <div class="graphs-panel">
                    <div class="graphs-panel-head clearfix">
                        <h4 class="bold-6 mb-0 mt-0 pull-left">Status</h4>
                        <label id="lblStatusErrorMsg" class="font-red-soft bold-6 f_15 mb-0 pull-left"></label>
                        <label class="pull-right" id="lblStatusEdit">
                            <a id="createStatus" class="font-green margin-right-5" title="Add New Status"><i class="icon-plus"></i></a>
                            <a id="editStatus" class="font-blue margin-right-5" title="Rename"><i class="icon-pencil"></i></a>
                            <a id="deleteStatus" class="font-red" title="Delete Status"><i class="icon-trash"></i></a>
                        </label>
                        <label class="pull-right" id="lblStatusUpdate" style="display: none;">
                            <a class="font-green margin-right-5" id="updateStatus" title="Update"><i class="icon-check font-green f_20"></i></a>
                            <a class="font-red" id="cancelStatus" title="Cancel"><i class="icon-close font-red f_20"></i></a>
                        </label>
                    </div>
                    <div class="graphs-panel-body">
                        <div id="accountStatuses"></div>

                        <%--<div class="form-group">
                        <label class="txt-grey bold-6">
                           
                                <input class="margin-right-5" type="checkbox"/>
                            Open</label>
                    </div>--%>
                        <%--<div class="form-group">
                        <label class="txt-grey bold-6">
                            
                                <input class="margin-right-5" type="checkbox" />
                            Work in progress (WIP)</label>
                    </div>--%>
                        <%--<div class="form-group">
                        <label class="txt-grey bold-6">
                            
                                <input class="margin-right-5" type="checkbox" />
                            Closed </label>
                    </div>--%>
                    </div>
                </div>

            </div>


            <div class="col-sm-12 col-md-6 f_13">
                <div class="graphs-panel">
                    <div class="graphs-panel-head clearfix">
                        <h4 class="bold-6 mb-0 mt-0 pull-left">Priority </h4>
                        <label id="lblPriorityErrorMsg" class="font-red-soft bold-6 f_15 mb-0 pull-left"></label>
                        <label class="pull-right" id="lblEdit">
                            <a id="createPriority" class="font-green margin-right-5" title="Add"><i class="icon-plus"></i></a>
                            <a id="editPriority" class="font-blue margin-right-5" title="Rename"><i class="icon-pencil"></i></a>
                            <a id="deletePriority" class="font-red" title="Delete"><i class="icon-trash"></i></a>
                        </label>
                        <label class="pull-right" id="lblUpdate" style="display: none;">
                            <a class="font-green margin-right-5" id="updatePriority" title="Update"><i class="icon-check font-green f_20"></i></a>
                            <a class="font-red" id="cancelPriority" title="Cancel"><i class="icon-close font-red f_20"></i></a>
                        </label>
                    </div>
                    <div class="graphs-panel-body">
                        <div id="accountPriorities"></div>
                    </div>
                </div>


            </div>
        </div>


        <div class="graphs-panel">
            <div class="graphs-panel-head">
                <h4 class="bold-6 mt-0 mb-0">Category </h4>
            </div>
            <div class="graphs-panel-body">
                <div>
                    <button type="button" class="btn btn-sm btn-success margin-right-10" id="btnCreateRoot">Create Root</button>
                    <button type="button" class="btn btn-sm btn-primary margin-right-10" id="btnCreateNode">Create Node</button>
                    <button type="button" class="btn btn-sm btn-danger" id="btnRemoveNode">Remove Node</button>
                </div>

                <div>
                    <div id="jsTree" class="margin-top-20 f_13"></div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="createFields" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title bold font-blue-soft">Add New Field</h4>
                    </div>
                    <div class="modal-body f_13">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label class="label-head">Field Name</label>
                                    <input type="text" id="txtFieldName" class="form-control" maxlength="200" />
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label class="label-head">Field Type</label>
                                    <select id="ddlFieldType" class="form-control">
                                        <option value="0">Select</option>
                                        <option value="1">Textbox</option>
                                        <option value="2">Dropdown</option>
                                        <option value="3">Textarea</option>
                                    </select>
                                </div>
                            </div>
                        </div>


                        <div class="textboxFields" style="display: none;">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="label-head">Input Type</label>
                                        <select id="ddlInputType" class="form-control">
                                            <option value="0">Select</option>
                                            <option value="1">Numeric</option>
                                            <option value="2">Alphabets</option>
                                            <option value="3">AlphaNumerics</option>
                                            <option value="4">Unicode</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="label-head">Max Char Limit</label>
                                        <input type="text" id="txtMaxchars" maxlength="50" class="form-control number" />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div class="dropdownFields" style="display: none;">
                            <div class="form-group" id="optionsData">
                            </div>
                        </div>


                        <div class="textareaFields" style="display: none;">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="label-head">Max Char Limit</label>
                                        <input type="text" id="txtareaMaxchars" class="form-control number" maxlength="4" />
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label class="label-head">Mandatory Field</label>
                                    <select id="ddlMandatory" class="form-control">

                                        <option value="1" selected="selected">Yes</option>
                                        <option value="2">No</option>
                                    </select>
                                </div>
                            </div>

                            <div class="col-sm-6 textboxFields" style="display: none">
                                <div class="form-group">
                                    <label class="label-head">Allow Special Characters</label>
                                    <select id="ddlSpecialchars" class="form-control">

                                        <option value="1">Yes</option>
                                        <option value="2">No</option>
                                    </select>
                                </div>
                            </div>


                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" id="btnSaveField" class="btn btn-success btn-circle btn-sm" data-dismiss="modal">Save</button>
                        <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>
                    </div>

                </div>

            </div>
        </div>


        <div class="modal fade" id="addCategory" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title bold font-blue-soft">Add Root</h4>
                    </div>
                    <div class="modal-body f_13">
                        <div class="form-group">
                            <label class="label-head blocked">Name</label>
                            <input type="text" id="txtNodeName" class="form-control margin-top-10" maxlength="200" />
                        </div>
                        <div class="form-group">
                            <label class="label-head blocked">Color Code</label>

                            <label class='priorityColorCode input-group colorpicker-component colorpicker-element'>
                                <input id='priorityColorPicker' type="text" value="#FF0000" class="form-control" />
                                <span class="input-group-addon"><i></i></span></label>



                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" id="btnSaveRoot" class="btn btn-success btn-circle btn-sm" data-dismiss="modal">Save</button>
                        <button type="button" id="btnSaveNode" class="btn btn-success btn-circle btn-sm" data-dismiss="modal">Save</button>
                        <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>
                    </div>

                </div>

            </div>
        </div>

    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="scripts/jquery_ui.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/jstree.min.js"></script>
    <script src="bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js" type="text/javascript"></script>
    <script src="scripts/custom/agentsettings.js?type=v1" type="text/javascript"></script>
</asp:Content>
