<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="AgentStatus.aspx.cs" Inherits="Press3.UI.AgentStatus" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - Agent Status</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <div class="page-content">
        <div class="breadcrumb brd">
            <label class="pull-left">Gateways</label>
            <div class="clearfix"></div>
        </div>
        <div class="portlet lite">
            <div class="table-scrollable">
                <table class="table table-striped text-center table-bordered table-responsive table-scrollable">
                    <thead>
                        <tr>
                            <th>Id </th>
                            <th>Name </th>
                            <th>HTTP URL </th>
                            <th>OriginationUrl </th>
                            <th>RecordingPath</th>
                            <th>ResourceUrl </th>
                            <th>TotalChannels </th>
                            <th>VertoRegistrationPort </th>
                        </tr>
                    </thead>
                    <tbody id="gatewayReports"></tbody>
                </table>
            </div>
        </div>
        <div class="breadcrumb brd">
            <label class="pull-left">Agents</label>
            <div class="clearfix"></div>
        </div>
        <div class="portlet lite">
            <div class="table-scrollable">
                <table class="table table-striped text-center table-bordered table-responsive table-scrollable">
                    <thead>
                        <tr>
                            <th>Id </th>
                            <th>Name </th>
                            <th>Email </th>
                            <th>Mobile </th>
                            <th>Status </th>
                            <th>Availability </th>
                            <th>LoginType </th>
                            <th>OBAccess </th>
                            <th>CommunicationType </th>
                            <th>GatewayId </th>
                            <th>IP </th>
                            <th>Port </th>
                            <th>UserName </th>
                            <th>IsRegistered </th>
                            <th>LastSignalReceived </th>
                        </tr>
                    </thead>
                    <tbody id="agentReports"></tbody>
                </table>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/custom/agent-status.js"></script>
</asp:Content>
