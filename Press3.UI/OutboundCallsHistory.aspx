<%@ Page Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="OutboundCallsHistory.aspx.cs" Inherits="Press3.UI.OutboundCallsHistory" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Press3 - Outbound Calls History</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <div class="page-content">
        <table id="filters" class="table table-responsive">
            <tbody>
                <tr>
                    <td>Time</td>
                    <td>
                        <input type="text" class="form-control input-inline input-circle" placeholder="Select Date" id="txtDatefilter" readonly />
                    </td>
                    <td>From Number</td>
                    <td>
                        <input type="text" id="txtFromNumber" class="form-control input-inline input-circle" placeholder="From Number" /></td>
                    <td>To Number</td>
                    <td>
                        <input type="text" id="txtToNumber" class="form-control input-inline input-circle" placeholder="To Number" /></td>
                </tr>
                <tr>
                    <td colspan="6" style="padding-left: 45%">
                        <input type="button" value="Submit" class="btn btn-primary" /></td>
                </tr>
            </tbody>
        </table>
        <table id="result">
        </table>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="assets/global/plugins/bootstrap-daterangepicker/moment.min.js" type="text/javascript"></script>
    <script src="assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js" type="text/javascript"></script>
    <script src="scripts/custom/OutboundCallsHistory.js" type="text/javascript"></script>
</asp:Content>
