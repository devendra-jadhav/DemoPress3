<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="OutboundCall.aspx.cs" Inherits="Press3.UI.OutboundCall" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - Outbound Call</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <audio id="webcam" autoplay="autoplay" hidden="true"></audio>
    <div id="pageContent" class="page-content">
        <div class="portlet lite">
            <div class="row">
                <input type="button" value="Make Call" class="btn btn-success" id="btn-make-call" />
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/jquery.json-2.4.min.js"></script>
    <script type="text/javascript" src="scripts/verto-min.js"></script>
    <script type="text/javascript" src="scripts/custom/outbound-call.js"></script>
</asp:Content>
