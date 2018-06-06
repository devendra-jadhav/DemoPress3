<%@ Page Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="AgentDetails.aspx.cs" Inherits="Press3.UI.AgentDetails" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Agent Details</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link type="text/css" href="bootstrap-timepicker/css/bootstrap-timepicker.min.css" rel="stylesheet" />
    <style>
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
                <div class="clearfix">
                    <h4 class="bold-6 pull-left mb-0">Agents</h4>
                    <div class="col-sm-2">
                        <h4 class="txt-lite-grey bold-6 pull-left">( </h4>
                        <h4 class="txt-lite-grey bold-6 pull-left" id="h2NoOfRecords">0</h4>
                        <h4 class="txt-lite-grey bold-6 pull-left">) </h4>
                    </div>
                    <button class="btn btn-sm btn-success btn-circle pull-right redirectpage margin-left-20"><i class="fa fa-sync margin-right-5"></i>Refresh </button>
                    <div class="pull-right margin-top-10 " style="color:#A9A9A9;font-size:11px" id="reloadTime"></div>
                </div>
            </div>
            <div class="graphs-panel-body">
                <div class="row">
                    <div class="col-md-2 col-sm-4">
                        <div class="form-group">
                            <label class="txt-lite-grey">Role</label>
                            <div class="select-style">
                                <select id="selectRole">
                                    <option value="0">All</option>
                                    <option value="1">Agent</option>
                                    <option value="2">Supervisor</option>
                                    <option value="3">Manager</option>
                                    <option value="4">Ticket Manager</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4">
                        <div class="form-group">
                            <label class="txt-lite-grey">Portal login required</label>
                            <div class="select-style">
                                <select id="selectLoginRequired">
                                    <option value="0">All</option>
                                    <option value="1">Yes </option>
                                    <option value="2">No</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4">
                        <div class="form-group">
                            <label class="txt-lite-grey">Portal Login Status</label>
                            <div class="select-style">
                                <select id="selectLoginStatus">
                                    <option value="2">All</option>
                                    <option value="1">Online</option>
                                    <option value="0">Offline</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4">
                        <div class="form-group">
                            <label class="txt-lite-grey">Device Type</label>
                            <div class="select-style">
                                <select id="selectDeviceType">
                                    <option value="0">All</option>
                                    <option value="1">Press3 Softphone</option>
                                    <option value="2">PSTN</option>
                                    <option value="3">External Sip Account</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4">
                        <div class="form-group">
                            <label class="txt-lite-grey">Device registration status</label>
                            <div class="select-style">
                                <select id="selectDeviceStatus">
                                    <option value="2">All</option>
                                    <option value="1">Registered</option>
                                    <option value="0">Not Registered</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="table-responsive" style="height: 400px;">
                    <table class="table table-advance table-bordered fixed_headers f_13" style="overflow: scroll;" id="fixTable2">
                        <thead>
                            <tr>
                                <th>
                                    <label>Name</label></th>
                                <th>
                                    <label>Role</label></th>
                                <th>
                                    <label>Portal Login Required</label></th>
                                <th>
                                    <label>Portal Login Status</label></th>
                                <th>
                                    <label>Device Type</label></th>
                                <th>
                                    <label>Device Details</label></th>
                                <th>
                                    <label>Gateway</label></th>
                                <th>
                                    <label>Device Status</label></th>
                                <th>
                                    <label>Out Bound Access Type</label></th>
                                <th>
                                    <label>Last Signal Received On</label></th>
                            </tr>
                        </thead>
                        <tbody id="agentSkills">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="scripts/tableHeadFixer.js"></script>
    <script type="text/javascript" src="bootstrap-timepicker/js/bootstrap-timepicker.min.js"></script>
    <script src="scripts/custom/AgentDetails.js" type="text/javascript"></script>
</asp:Content>
