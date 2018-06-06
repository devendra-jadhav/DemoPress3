<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="MyCallBackRequests.aspx.cs" Inherits="Press3.UI.MyCallBackRequests" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - My CallBack Requests</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
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
        <div class="portlet lite">
            <h5 class="txt-grey bold-6 f_15 margin-top-5">Callback Request History
            </h5>
            <hr class="margin-top-5 margin-bottom-10" />
            <div class="input-group margin-bottom-10">
                <div class="input-icon left">
                    <i class="fa fa-search"></i>
                    <input type="text" id="txtSearch" class="form-control input-circle-left" placeholder="Search by Caller Name or Number" />
                </div>
                <span class="input-group-btn">
                    <button id="btnSearch" type="button" class="btn btn-success btn-circle-right">Search</button></span>
            </div>
            <div id="callBackRequests" class="table-responsive">
            </div>
                  <div id="page-selection"></div>
        </div>
        <input type="hidden" value="<%=CbrId %>" id="hdnCbrId" />
        <input type="hidden"  id ="hdnAgentId" value="<%=agentId %>"/>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
     <script type="text/javascript" src="scripts/jquery.bootpag.min.js"></script>
    <script type="text/javascript" src="scripts/custom/mycallbackrequests.js?type=v1"></script>
</asp:Content>
