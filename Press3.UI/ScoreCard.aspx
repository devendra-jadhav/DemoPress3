<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="ScoreCard.aspx.cs" Inherits="Press3.UI.ScoreCard" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Press3 - Score Card</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/rateYo/2.2.0/jquery.rateyo.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <input type="hidden" id="hdnCallId" value="<%= callId %>" />
    <input type="hidden" id="hdnAgentId" value="<%= agentId %>" />
    <div class="page-content">

        <div class="row">
            <div class="col-sm-8 col-md-9">
                <div class="portlet lite">
                    <h4 class="bold-6 font-grey-gallery">Agent Call Scoring Evaluation Form</h4>
                    <hr />

                    <div class="form-group">
                        <label class="txt-grey margin-right-10 pull-left margin-top-5">Load Scorecards :</label>
                        <div class="select-style pull-left" style="width: 250px;">
                            <select id="selScoreCards">
                                <option value="0">Select ScoreCard</option>
                            </select>
                        </div>
                        <div class="clearfix"></div>
                    </div>

                    <div class="score_qsns margin-top-20">
                        <div id="sectionQuestions">
                        </div>
                        <div id="commentToAgent" style="display: none;">
                            <div class="form-group">
                                <label>Comment / Advise to the agent</label>
                                <textarea class="form-control" rows="3" id="comments"></textarea>
                            </div>
                            <div class="text-center">
                                <button type="button" class="btn btn-sm btn-circle btn-success margin-right-5 btn-100" id="btnSubmitScores">Submit</button>
                                <button type="button" class="btn btn-sm btn-circle btn-primary margin-right-5 btn-100" id="btnDraftScores">Save As Draft</button>
                                <button type="button" class="btn btn-sm btn-circle btn-default btn-100" id="btnCancelScores">Cancel</button>
                                <div class="text-danger text-center margin-top-15" id="scoreError"></div>
                                <div class="text-success text-center margin-top-15" id="scoreSuccess"></div>
                            </div>
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
                        <label class="margin-right-20"><span id="negativeScore">0</span> -ve</label>
                        <label><span id="notapplicableScore">0</span> N/A</label>
                    </div>

                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script src="scripts/jquery.rateyo.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/custom/score-card.js"></script>
</asp:Content>
