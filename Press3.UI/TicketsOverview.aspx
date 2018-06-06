<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="TicketsOverview.aspx.cs" Inherits="Press3.UI.TicketsOverview" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Press3 - TicketsOverview</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="assets/global/plugins/bootstrap-datepicker/css/datepicker3.css" rel="stylesheet" />
    <style type="text/css">
        .graphs-panel-body {
            height: auto !important;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <div id="div-constant-content" style="display: none;"></div>
    <div class="page-content">
        <div class="portlet lite">
            <h4 class="bold mb-0">Tickets Overview Report</h4>
            <hr />
            <div class="clearfix">
                <label class="pull-left">
                    <%--<select class="form-control input-inline">
                        <option>Jan 2018</option>
                    </select>--%>
                    <input type="text" id="txt-datepicker" class="form-control input-inline margin-right-5" readonly placeholder="select" style="background: #fff;" />
                    <button type="button" class="btn btn-success" id="btn-submit">Submit</button>
                </label>
                <%-- <label class="pull-right"><a class="font-blue-soft"><i class="fa fa-file-pdf-o margin-right-5"></i>Download PDF</a></label>--%>
            </div>
        </div>

        <div class="portlet">
            <div class="row">
                <div class="col-sm-6">
                    <div class="graphs-panel">
                        <div class="graphs-panel-head">
                            <span class="bold">Total Complaints</span><br />
                            <span class="f_12">Online vs Offline</span>
                        </div>
                        <div class="graphs-panel-body" id="div-total-complaints"></div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="graphs-panel">
                        <div class="graphs-panel-head">
                            <span class="bold">Complaints by Priority</span><br />
                            <span class="f_12">Number of complaints segregated by ticket priority</span>
                        </div>
                        <div class="graphs-panel-body" id="div-priority-complaints"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="portlet">
            <div class="graphs-panel">
                <div class="graphs-panel-head">
                    <span class="bold">Complaints by Category</span><br />
                    <span class="f_12">Percentage of complaints segregated by ticket Categories</span>
                </div>
                <div class="graphs-panel-body" id="div-categories">
                    <%--  <div class="row row-category" row-id="0">
                        <div class="col-sm-4 text-center row-sets"><div id="div-category-complaints-0"></div></div>
                        <div class="col-sm-4 text-center row-sets"><div id="div-category-complaints-2"></div></div>
                        <div class="col-sm-4 text-center row-sets"><div id="div-category-complaints-3"></div></div>
                    </div>--%>
                    <%--<div class="row">
                        <div class="col-sm-4 text-center"><div id="div-category-complaints-0"></div></div>
                        <div class="col-sm-4 text-center"><div id="div-category-complaints-2"></div></div>
                        <div class="col-sm-4 text-center"><div id="div-category-complaints-3"></div></div>
                    </div>--%>
                    <%-- <div class="clearfix"></div>
                    <div class="row">
                        <div class="col-sm-4 text-center"><div id="div-category-complaints-4"></div></div>
                        <div class="col-sm-4 text-center"><div id="div-category-complaints-5"></div></div>
                        <div class="col-sm-4 text-center"><div id="div-category-complaints-6"></div></div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4 text-center"><div id="div-category-complaints-7"></div></div>
                        <div class="col-sm-4 text-center"><div id="div-category-complaints-8"></div></div>
                        <div class="col-sm-4 text-center"><div id="div-category-complaints-9"></div></div>
                    </div>--%>
                </div>
            </div>
        </div>
        <div class="portlet">
            <div class="graphs-panel">
                <div class="graphs-panel-head">
                    <span class="bold">Overall TAT &amp; Complaint Resolution</span><br />
                    <span class="f_12">Turn around time for complaint resolution &amp; Percentage of intime resolutions</span>
                </div>
                <div class="graphs-panel-body">
                    <div class="clearfix">
                        <div class="col-sm-6 text-center">
                            <span class="bord-r"></span>
                            <div id="div-closed-complaints" class="text-center">
                            </div>
                            <div>
                                <table class="table table-striped table-bordered" style="width: 70%; margin: auto" id="div-closed-complaints-table">
                                </table>
                            </div>
                        </div>
                        <div class="col-sm-6 text-center">
                            <div id="div-duedate-closed-complaints">
                            </div>
                            <div>
                                <table class="table table-striped table-bordered" style="width: 70%; margin: auto" id="div-duedate-closed-complaints-table">
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/jsapi.js"></script>
    <script type="text/javascript" src="scripts/chartsloader.js"></script>
    <script type="text/javascript" src="assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
    <script type="text/javascript" src="scripts/custom/tickets-overview.js"></script>
    <script type="text/javascript">
        google.load('visualization', '1.0', { 'packages': ['corechart', 'bar', 'gauge'] });
    </script>
</asp:Content>
