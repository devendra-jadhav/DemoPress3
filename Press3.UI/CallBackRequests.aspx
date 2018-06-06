<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="CallBackRequests.aspx.cs" Inherits="Press3.UI.CallBackRequests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - CallBack Requests</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="assets/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet" />
    <link href="assets/global/plugins/bootstrap-datepicker/css/datepicker3.css" rel="stylesheet" />
    <link href="assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <style type="text/css">
        .cbr-cancel-btn {
            background: #fff;
            margin-top: 5px !important;
            color: #3b77ff;
            border: 1px solid #3b77ff;
        }

        .cbr-call-btn {
            background: #3b77ff;
            margin-top: 5px !important;
            color: #fff;
            border: 1px solid #3b77ff;
        }

        .cbr-call-btn:hover {
            background: #2c54af;
            margin-top: 5px !important;
            color: #fff;
            border: 1px solid #2c54af;
        }

        .cbr-view-btn {
            color: #3b77ff;
            background-color: #e9f0ff;
            border: 1px solid #6e8acc;
        }

        .cbr-view-btn:hover {
            color: #ffffff;
            background-color: #bccae8;
            border: 1px solid #bccae8;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <div class="page-content">
        <input type="hidden" runat="server" value="" id="hdnSearchText" />
        <input type="hidden" runat="server" value="0" id="hdnstatus" />
        <input type="hidden" runat="server" value="0" id="hdnStickyAgent" />
        <input type="hidden" runat="server" value="0" id="hdnSkillGroup" />
        <input type="hidden" runat="server" value="0" id="hdnDialOutType" />
        <input type="hidden" runat="server" value="" id="hdnFromDate" />
        <input type="hidden" runat="server" value="" id="hdnToDate" />
        <input type="hidden" runat="server" value="0" id="hdnStudioId" />

         <input type="hidden" value="<%=CbrId %>" id="hdnCbrId" />
        <input type="hidden"  id ="hdnAgentId" value="<%=agentId %>"/>

        <div class="row">
            <div class="col-sm-3 col-md-3 col-lg-2">
                <div class="portlet lite margin-bottom-20">
                    <h5 class="txt-grey bold-6 f_15 margin-top-5">
                        <i class="fa fa-sliders margin-right-5"></i>Filters
                    </h5>
                    <hr class="margin-top-5 margin-bottom-10" />


                    <div class="form-group">
                        <label class="txt-lite-grey">Status</label>
                        <div class="select-style">
                            <select id="ddlStatus">
                            </select>
                        </div>
                    </div>


                    <div class="form-group">
                        <label class="txt-lite-grey">Sticky Agent</label>
                        <div class="select-style">
                            <select id="ddlAgents">
                                <option value='0'>Select</option>
                            </select>
                        </div>
                    </div>


                    <div class="form-group">
                        <label class="txt-lite-grey">Skill Group</label>
                        <div class="select-style">
                            <select id="ddlSkillGroups">
                            </select>
                        </div>

                    </div>


                    <div class="form-group">
                        <label class="txt-lite-grey">Dial out Type</label>
                        <div class="select-style">
                            <select id="ddlDialOutType">
                                <option value="0">Select</option>
                                <option value="1">Auto</option>
                                <option value="2">Manual</option>
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

                    <div class="form-group">
                        <label class="txt-lite-grey">Schedule date range</label>
                        <div class="clearfix">
                            <div class="input-group pull-left margin-right-5">
                                <div class="input-icon right">
                                    <i class="fa fa-calendar"></i>
                                    <input id="txtFromDate" type="text" class="form-control date-picker" style="width: 124px" placeholder="From" />
                                </div>
                            </div>
                            <div class="input-group pull-left">
                                <div class="input-icon right">
                                    <i class="fa fa-calendar"></i>
                                    <input id="txtToDate" type="text" class="form-control date-picker" style="width: 124px" placeholder="To" />
                                </div>
                            </div>
                        </div>
                        <label class="margin-top-5">
                            <button id="btnGet" type="button" class="btn btn-success ">Get</button></label>
                    </div>


                </div>
            </div>
            <div class="col-sm-9 col-md-9 col-lg-10">
                <div class="graphs-panel">
                    <div class="graphs-panel-head clearfix">
                        <div class="col-sm-4">
                            <h5 class="bold-6 f_15 margin-top-5">Callback Request History</h5>
                        </div>
                        <div class="col-sm-4">
                            <div class="input-group">
                                <div class="input-icon left">
                                    <i class="fa fa-search"></i>
                                    <input type="text" id="txtSearch" class="form-control inp-left-radius" placeholder="Search by Caller Name or Number" />
                                </div>
                                <span class="input-group-btn">
                                    <button id="btnSearch" type="button" class="btn btn-success btn-right-radius">Search</button></span>
                            </div>
                        </div>
                        <div class="col-sm-4 text-right">
                            <label class="mb-0">
                                <asp:Button ID="DownloadExcelReports" runat="server" CssClass="btn btn-success btn-sm btn-circle" Text="Download to Excel" OnClick="DownloadToExcel_Click" />
                            </label>
                        </div>
                    </div>
                    <br />
                    <div class="row">
                        <div class="col-md-12" style="text-align: right;"><span style="color: #496176" id="showingRecords">0-0 of 0</span></div>
                    </div>
                    <div class="graphs-panel-body">

                        <div id="callBackRequests" class="table-responsive">
                        </div>
                        <div id="page-selection"></div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/jquery.bootpag.min.js"></script>
    <script type="text/javascript" src="assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
    <script src="assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js"></script>
    <script type="text/javascript" src="scripts/custom/callbackrequests.js?type=v1"></script>
    
</asp:Content>
