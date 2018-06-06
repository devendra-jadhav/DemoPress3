<%@ Page Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="ManageSkills.aspx.cs" Inherits="Press3.UI.ManageSkills" %>

<%--<!DOCTYPE html>--%>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - Manage Skills</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link type="text/css" href="bootstrap-timepicker/css/bootstrap-timepicker.min.css" rel="stylesheet" />
    <style>
        #selectable, #assigned_agents {
            list-style-type: none;
            margin: 0;
            padding: 0;
            width: 250px;
            height: auto;
            max-height: 400px;
            overflow-y: auto;
        }

            #selectable li, #assigned_agents li {
                margin: 3px;
                padding: 0.4em;
                font-size: medium;
                /*font-size: 1.4em;
            height: 18px;*/
            }

        .fa {
            cursor: pointer;
            margin: 0.5px;
        }

        #feedback {
            margin: 3px;
        }


        table thead th label {
            font-size: 17px;
            display: block;
            position: page;
        }

        table thead th {
            background-color: white;
            white-space: nowrap;
        }

        input[type=text] {
            cursor: default !important;
        }

        .graphs-panel {
            margin-bottom: 20px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <div class="page-content">
        <div class="graphs-panel">
            <div class="graphs-panel-head">
                <h4 class="bold-6 mb-0 ">Skills <a><i class="fa fa-plus-circle margin-left-15 fa-x createskill"></i></a></h4>
            </div>
            <div class="graphs-panel-body">
                <div id="skillsBody">
                </div>
            </div>
        </div>


        <div class="modal fade" id="create-skill" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <h4 class="modal-title bold font-blue-soft">Create New Skill</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="txt-grey">Skill</label><br />
                            <input type="text" id="txt1" class="form-control" maxlength="48" />
                        </div>
                        <div class="form-group">
                            <label class="txt-grey">Description</label><br />
                            <textarea id="txtarea1" cols="19" rows="4" maxlength="198" class="form-control"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="create" class="btn green" type="button">create</button>
                        <button class="btn" id="create_cancel" data-dismiss="modal" type="button">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="update-skill" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <h3 class="modal-title bold font-blue-soft">Are you sure you want to Update</h3>
                    </div>
                    <div class="modal-body skillname">
                        <label>Skill</label><br />
                        <input type="text" id="txt" maxlength="48" class="form-control" /><br />
                        <br />
                        <lable>Description</lable>
                        <br />
                        <textarea id="txtarea" cols="19" rows="6" maxlength="198" class="form-control"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button id="update" skillid="" rowid="" class="btn green" type="button">Update</button>
                        <button class="btn" id="update_cancel" data-dismiss="modal" type="button">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="delete-skill" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <h3 class="modal-title bold font-blue-soft">Are you sure you want to delete</h3>
                    </div>

                    <div class="modal-footer">
                        <button id="delete" skillid="" rowid="" skillname="" class="btn green" type="button">delete</button>
                        <button class="btn" id="delete_cancel" data-dismiss="modal" type="button">Cancel</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="create-skillgroup" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <h3 class="modal-title bold font-blue-soft">Create New SkillGroup</h3>
                    </div>
                    <div class="modal-body">
                        <lable>SkillGroup</lable>
                        <br />
                        <input type="text" id="txt2" class="form-control" maxlength="48" /><br />
                        <br />
                        <lable>Skills</lable>
                        <br />
                        <p id="skills">
                        </p>
                        <label>Description</label><br />
                        <textarea id="txtarea2" cols="19" rows="6" class="form-control" maxlength="198"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button id="create-group" class="btn green" type="button">create</button>
                        <button class="btn" id="create_group_cancel" data-dismiss="modal" type="button">Cancel</button>
                    </div>
                </div>
            </div>
        </div>



        <div class="graphs-panel">
            <div class="graphs-panel-head clearfix">
                <h4 class="bold-6 pull-left mb-0">Skill Groups</h4>
                <button type="button" class="btn btn-sm btn-success btn-circle pull-right creategroup"><i class="fa fa-plus margin-right-5 "></i>Add New Group</button>
            </div>
            <div class="graphs-panel-body">
                <div class="scroller" style="height: 270px;">
                    <table class="table table-advance table-bordered fixed_headers f_13" style="overflow: scroll; margin-top: -1px;" id="fixTable1">
                        <thead class="fixed_headers" style="background-color: white;">
                            <tr>
                                <th>
                                    <label>Group</label></th>
                                <th>
                                    <label>Skills</label></th>
                                <th>
                                    <label>Description</label></th>
                                <th>
                                    <label>Actions </label>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="skillGroup">
                        </tbody>

                    </table>
                </div>

                <div class="modal fade" id="update-skillGroup" role="dialog">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal"></button>
                                <h3 class="modal-title bold font-blue-soft">Are you sure you want to Update</h3>
                            </div>
                            <div>
                                &nbsp&nbsp&nbsp 
                                    <label>Group</label>
                                <br />
                                &nbsp&nbsp&nbsp 
                                    <input type="text" id="txt3" class="form-control" /><br />
                                <br />

                                <div class="modal-body groupSkills">
                                </div>
                                &nbsp&nbsp&nbsp 
                                    <label>Description</label>
                                <br />
                                &nbsp&nbsp&nbsp 
                                    <textarea id="txtarea3" cols="19" rows="6" class="form-control"></textarea>
                            </div>

                            <div class="modal-footer">
                                <button id="updateGroupSkills" skillgroupid="" class="btn green" type="button">Update</button>
                                <button class="btn" id="updateGroup_cancel" data-dismiss="modal" type="button">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="delete-skillGroup" role="dialog">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal"></button>
                                <h3 class="modal-title bold font-blue-soft">Are you sure you want to Delete</h3>
                            </div>

                            <div class="modal-footer">
                                <button id="deleteGroupSkills" skillgroupid_="" class="btn green" type="button">Delete</button>
                                <button class="btn" id="deleteGroup_cancel" data-dismiss="modal" type="button">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="graphs-panel">
            <div class="graphs-panel-head">
                <div class="clearfix">
                    <h4 class="bold-6 pull-left mb-0">Agents</h4>
                    <div class="col-sm-1">
                        <h4 class="txt-lite-grey bold-6 pull-left">( </h4>
                        <h4 class="txt-lite-grey bold-6 pull-left" id="h2NoOfRecords">0</h4>
                        <h4 class="txt-lite-grey bold-6 pull-left">) </h4>
                    </div>
                    <div class="btn btn-sm btn-success pull-left" id="agentDetailsRedirect"> Agent details <i class="fa fa-external-link" style="margin-left: 5px !important;"></i></div>

                    <button class="btn btn-sm btn-success btn-circle pull-right redirectpage"><i class="fa fa-plus margin-right-5"></i>Add New Agent</button>
                </div>
            </div>
            <div class="graphs-panel-body">
                <div class="row">


                    <div class="col-md-2 col-sm-4">
                        <div class="form-group">
                            <label class="txt-lite-grey">Account Status</label>
                            <div class="select-style">
                                <select id="selectAccountStatus">
                                    <option value="0">All</option>
                                    <option value="1">Active</option>
                                    <option value="2">Not Activated</option>
                                    <option value="3">Blocked</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4">
                        <div class="form-group">
                            <label class="txt-lite-grey">Agent Type</label>
                            <div class="select-style">
                                <select id="selectAgentType">
                                    <option value="0">All</option>
                                    <option value="1">Online  </option>
                                    <option value="2">Offline</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-2 col-sm-4">
                        <div class="form-group">
                            <label class="txt-lite-grey">Device Status</label>
                            <div class="select-style">
                                <select id="selectDeviceStatus">
                                    <option value="0">All</option>
                                    <option value="1">Active</option>
                                    <option value="2">Not Activated</option>
                                </select>
                            </div>
                        </div>
                    </div>



                    <div class="col-md-6 col-sm-8">
                        <label class="txt-lite-grey">Search Agent</label>
                        <div class="input-group">
                            <div class="input-icon left">
                                <i class="fa fa-search"></i>
                                <input type="text" id="txtSearch" class="form-control btn-circle-left" placeholder="Search Agent by Name.." />
                            </div>
                            <span class="input-group-btn">
                                <button type="button" id="btnSearch" class="btn btn-success btn-circle-right">Search</button></span>
                        </div>
                    </div>



                </div>

                <div class="table-responsive" style="height: 270px;">
                    <table class="table table-advance table-bordered fixed_headers f_13" style="overflow: scroll;" id="fixTable2">

                        <thead>
                            <tr>
                                <th>
                                    <label>Name</label></th>

                                <th>
                                    <label>Designation</label></th>


                                <th>
                                    <label>Skills</label></th>

                                <th>
                                    <label>Login Type</label></th>
                                <th>
                                    <label>Device Type</label></th>
                                <th>
                                    <label>Device Username</label></th>
                                <th>
                                    <label>Device Password</label></th>

                                <th>
                                    <label>IP Address </label>
                                </th>


                                <th>
                                    <label>Port Number</label></th>


                                <th>
                                    <label>Gateway</label></th>

                                <th>
                                    <label>Device Status</label></th>


                                <th>
                                    <label>Account Status</label></th>

                                <th>
                                    <label>OB Access Type</label></th>



                                <th>
                                    <label>Last Signal Received On</label></th>
                                <th>
                                    <label>LoggedInFromWeb</label></th>

                            </tr>
                        </thead>
                        <tbody id="agentSkills">
                        </tbody>

                    </table>
                </div>
            </div>
        </div>

        <div class="graphs-panel">
            <div class="graphs-panel-head">
                <h4 class="bold-6 mb-0 mt-0">Team Management</h4>
            </div>
            <div class="graphs-panel-body">
                <div class="row">
                    <div class="col-sm-4">
                        <h4 class="bold">Select Supervisors:</h4>

                        <div class="margin-top-10">
                            <label class="margin-right-10 txt-lite-grey">Select a Supervisor :</label>
                            <select class="form-control input-inline" id="Supervisor_list">
                            </select>
                        </div>
                        <p id="feedback">
                        </p>
                    </div>

                    <div class="col-sm-3">

                        <h4 class="bold">Unassigned Agents</h4>
                        <ol id="selectable">
                        </ol>
                    </div>

                    <div class="col-sm-4 margin-left-30">
                        <h4 class="bold">Assigned Agents</h4>

                        <ol id="assigned_agents">
                        </ol>
                    </div>
                </div>
            </div>
        </div>


        <div class="graphs-panel">
            <div class="graphs-panel-head clearfix">
                <h4 class="bold-6 mb-0 pull-left margin-top-10">Manage TimeSlots</h4>
                <label class="pull-right mb-0">
                    <button type="button" class="btn btn-success f_13" id="add-new-time-slot"><i class="fa fa-plus margin-right-5"></i>Add TimeSlot</button></label>
            </div>
            <div class="graphs-panel-body">
                <div class="row">
                    <div class="col-sm-4">
                        <select id="sel-time-slots" class="form-control">
                            <option value="0">Select TimeSlots</option>
                        </select>
                    </div>

                </div>
                <div id="div-view-time-slot" class="margin-top-10">
                </div>
            </div>
        </div>


        <div class="modal fade" id="time-slot-popup" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class='modal-header'>
                        <button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button>
                        <h4>New TimeSlot</h4>
                    </div>
                    <div class='modal-body'>
                        <div class='new' style='margin-left: 30px;' tabindex='-1'>
                            <div class='header' id='hh'></div>
                            <div class='body'>
                                <div class='field'>
                                    <label class='control-label' style='width: 50px; float: left;'>Name</label>
                                    <input type='text' style='width: 380px; float: left;' class='name form-control margin-bottom-10' id="txt-time-slot-name" />
                                </div>

                                <table class='module-list-time'>
                                    <%-- <tr name='all' class='week'>
                            <td><input type='checkbox' name='all' class='head-chk'/></td>
                            <td>Week days</td>
	                        <td>
                                <div class='bootstrap-timepicker'><input type='text' class='input-small timepicker-input mini head-from' /><i class='icon-time'></i></div>
                            </td>
		                    <td class='to-td'>to</td>
		                    <td>
			                    <div class='bootstrap-timepicker'><input type='text' class='input-small timepicker-input mini head-to' />
			                    <i class='icon-time'></i>
			                    </div>
		                    </td>
	                    </tr>--%>
                                    <tr name='monday' class='week-days'>
                                        <td>
                                            <input type='checkbox' name='monday' class='chk' /></td>
                                        <td style="padding-left: 5px;">Monday</td>
                                        <td style="padding-right: 20px;">
                                            <div class='bootstrap-timepicker'>
                                                <input type='text' name='mond' class='input-small timepicker-input mini from form-control' style="width: 90px !important" />
                                                <%-- <i class='icon-time'></i>--%>
                                            </div>
                                        </td>
                                        <td class='to-td'>to</td>
                                        <td style="padding-left: 20px;">
                                            <div class='bootstrap-timepicker'>
                                                <input type='text' class='input-small timepicker-input mini to form-control' style="width: 90px !important" />
                                                <%-- <i class='icon-time'></i>--%>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr name='tuesday' class='week-days'>
                                        <td>
                                            <input type='checkbox' name='tuesday' class='chk' /></td>
                                        <td style="padding-left: 5px;">Tuesday</td>
                                        <td style="padding-right: 20px;">
                                            <div class='bootstrap-timepicker'>
                                                <input type='text' class='input-small timepicker-input mini from form-control' style="width: 90px !important" />
                                                <%-- <i class='icon-time'></i>--%>
                                            </div>
                                        </td>
                                        <td class='to-td'>to</td>
                                        <td style="padding-left: 20px;">
                                            <div class='bootstrap-timepicker'>
                                                <input type='text' class='input-small timepicker-input mini to form-control' style="width: 90px !important" />
                                                <%--<i class='icon-time'></i>--%>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr name='wednesday' class='week-days'>
                                        <td>
                                            <input type='checkbox' name='wednesday' class='chk' /></td>
                                        <td style="padding-left: 5px;">Wednesday</td>
                                        <td style="padding-right: 20px;">
                                            <div class='bootstrap-timepicker'>
                                                <input type='text' class='input-small timepicker-input mini from form-control' style="width: 90px !important" />
                                                <%-- <i class='icon-time'></i>--%>
                                            </div>
                                        </td>
                                        <td class='to-td'>to</td>
                                        <td style="padding-left: 20px;">
                                            <div class='bootstrap-timepicker'>
                                                <input type='text' class='input-small timepicker-input mini to form-control' style="width: 90px !important" />
                                                <%-- <i class='icon-time'></i>--%>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr name='thursday' class='week-days'>
                                        <td>
                                            <input type='checkbox' name='thursday' class='chk' /></td>
                                        <td style="padding-left: 5px;">Thursday</td>
                                        <td style="padding-right: 20px;">
                                            <div class='bootstrap-timepicker'>
                                                <input type='text' class='input-small timepicker-input mini from form-control' style="width: 90px !important" />
                                                <%--<i class='icon-time'></i>--%>
                                            </div>
                                        </td>
                                        <td class='to-td'>to</td>
                                        <td style="padding-left: 20px;">
                                            <div class='bootstrap-timepicker'>
                                                <input type='text' class='input-small timepicker-input mini to form-control' style="width: 90px !important" />
                                                <%--<i class='icon-time'></i>--%>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr name='friday' class='week-days'>
                                        <td>
                                            <input type='checkbox' name='friday' class='chk' /></td>
                                        <td style="padding-left: 5px;">Friday</td>
                                        <td style="padding-right: 20px;">
                                            <div class='bootstrap-timepicker'>
                                                <input type='text' class='input-small timepicker-input mini from form-control' style="width: 90px !important" />
                                                <%-- <i class='icon-time'></i>--%>
                                            </div>
                                        </td>
                                        <td class='to-td'>to</td>
                                        <td style="padding-left: 20px;">
                                            <div class='bootstrap-timepicker'>
                                                <input type='text' class='input-small timepicker-input mini to form-control' style="width: 90px !important" />
                                                <%-- <i class='icon-time'></i>--%>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr name='saturday'>
                                        <td>
                                            <input type='checkbox' name='saturday' class='chk' /></td>
                                        <td style="padding-left: 5px;">Saturday</td>
                                        <td style="padding-right: 20px;">
                                            <div class='bootstrap-timepicker'>
                                                <input type='text' class='input-small timepicker-input mini from form-control' style="width: 90px !important" />
                                                <%--<i class='icon-time'></i>--%>
                                            </div>
                                        </td>
                                        <td class='to-td'>to</td>
                                        <td style="padding-left: 20px;">
                                            <div class='bootstrap-timepicker'>
                                                <input type='text' class='input-small timepicker-input mini to form-control' style="width: 90px !important" />
                                                <%-- <i class='icon-time'></i>--%>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr name='sunday'>
                                        <td>
                                            <input type='checkbox' name='sunday' class='chk' /></td>
                                        <td style="padding-left: 5px;">Sunday</td>
                                        <td style="padding-right: 20px;">
                                            <div class='bootstrap-timepicker'>
                                                <input type='text' class='input-small timepicker-input mini from form-control' style="width: 90px !important" />
                                                <%-- <i class='icon-time'></i>--%>
                                            </div>
                                        </td>
                                        <td class='to-td'>to</td>
                                        <td style="padding-left: 20px;">
                                            <div class='bootstrap-timepicker'>
                                                <input type='text' class='input-small timepicker-input mini to form-control' style="width: 90px !important" />
                                                <%--<i class='icon-time'></i>--%>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class='clear'>
                            </div>
                        </div>
                    </div>
                    <div class='modal-footer'>
                        <button type='button' id='btn-save-time-slot' class='btn btn-success' time-slot-id="">Save</button>
                        <button type='button' class='btn btn-default' data-dismiss='modal'>Cancel</button>
                        <div class="pull-left margin-left-10">
                            <div id="time-slot-err" style="color: red;"></div>
                            <div id="time-slot-success" style="color: green;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/tableHeadFixer.js"></script>
    <script type="text/javascript" src="bootstrap-timepicker/js/bootstrap-timepicker.min.js"></script>
    <script src="scripts/custom/ManageSkills.js" type="text/javascript"></script>
</asp:Content>
