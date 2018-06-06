<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="ScoreCardView.aspx.cs" Inherits="Press3.UI.ScoreCardView" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Press3 - Agent Scorecard View </title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link href="css/jquery.rateyo.min.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <input type="hidden" id="hdnCallId" value="<%= callId %>" />
    <input type="hidden" id="hdnAgentId" value="<%= agentId %>" />
    <div class="page-content">

        <div class="row">
            <div class="col-sm-8 col-md-9">
                <div class="portlet lite">
                    <div>
                        <h4 class="bold-6 font-grey-gallery pull-left">Agent Call Scoring Evaluation Form <span id="scoreCard"></span></h4>
                        <%--<label class="pull-right margin-top-10"><a class="font-green f_13"><i class="fa fa-download margin-right-5"></i> Download Pdf</a></label>--%>
                        <div class="clearfix"></div>
                    </div>

                    <hr class="margin-top-10" />

                    <div class="score_qsns margin-top-20">
                        <div id="sectionQuestions">
                        </div>
                        <div class="form-group">
                            <label class="bold-6">Comment / Advise to the agent</label>
                            <p class="f_12 txt-lite-grey" id="comments"></p>
                        </div>

                    </div>
                </div>
            </div>
            <div class="col-sm-4 col-md-3">
                <div class="scoreBoard_panel">
                    <h4>Score Board</h4>
                    <hr class="margin-top-10" />
                    <div class="score">
                        <label class="agent_score">
                            <h5 id="totalScore">0</h5>
                            <span>Score</span>
                        </label>
                        <label class="total_score">
                            <h5 id="outofScore">0</h5>
                            <span>Out of</span>
                        </label>
                    </div>

                    <div class="rating">
                        <div class="rate text-center" style="margin: auto;">
                        </div>
                        <label class="f_12">(<span id="lblRating">0</span>)</label>
                    </div>

                    <div class="score_Details">
                        <label class="margin-right-20"><span id="positiveScore">0</span> +ve</label>
                        <label class="margin-right-20"><span id="negativeScore">0</span>  -ve</label>
                        <label><span id="notapplicableScore">0</span> N/A</label>
                    </div>

                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="scripts/jquery.rateyo.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/custom/score-card-view.js"></script>
</asp:Content>
