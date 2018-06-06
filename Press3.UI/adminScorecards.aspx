<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="adminScorecards.aspx.cs" Inherits="Press3.UI.adminScorecards" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - Admin Score Cards</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <style type="text/css">
        .graphs-panel {
            margin-bottom: 20px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <div class="page-content">
        <div class="graphs-panel">
            <div class="graphs-panel-head clearfix">
                <h4 class="pull-left bold-6 mb-0">Score Cards</h4>
                <label class="pull-right mb-0"><a class="btn btn-success" id="createScoreCard"><i class="fa fa-plus margin-right-5"></i>Create New Score Card</a></label>
            </div>
            <div class="graphs-panel-body">
                <div class="scroller" style="height: 250px;">
                    <div class="table-responsive">
                        <table class="table table-advance table-striped text-center table-bordered scorecard_list">
                            <thead>
                                <tr>
                                    <th>
                                        <label>Title</label>
                                    </th>
                                    <th>
                                        <label>Create Date</label>
                                    </th>
                                    <th>
                                        <label>Last Update</label>
                                    </th>
                                    <th>
                                        <label>Skills Attached</label>
                                    </th>
                                    <th>
                                        <label>Total Sections</label>
                                    </th>
                                    <th>
                                        <label>Total Questions</label>
                                    </th>
                                    <th>
                                        <label>Total Points</label>
                                    </th>
                                    <th>
                                        <label>Actions</label>
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="ScoreCards">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="portlet lite pad-15" id="scorecard" style="display: none">
            <div class="row">
                <div class="col-sm-4">
                    <div class="form-group">
                        <label class="label-head">Score Card Title</label>
                        <input type="text" class="input-circle form-control" id="txtscorecardTitle" maxlength="100" />
                    </div>
                </div>
                <div class="col-sm-8">
                    <div class="form-group">
                        <label class="label-head">Attach SkillGroup</label>
                        <div id="skillGrps">
                        </div>
                    </div>
                </div>
            </div>
            <div id="scorecardErr" class="text-center text-danger margin-bottom-20"></div>
            <div class="text-center margin-bottom-15">
                <a id="composeScorecard" class="btn-outline-select margin-right-15"><i class="fa fa-edit margin-right-5"></i>Compose</a>
                <a class="btn-outline" id="uploadScorecards"><i class="fa fa-upload margin-right-5"></i>Upload</a>
                <%--<a class="btn-outline" id="press3Scorecard"><i class="fa fa-file-text-o margin-right-5"></i>Press3 Score Card</a>--%>
            </div>
            <div>
                <div style="display: none;" id="addScorecardSectionDiv" class='margin-top-10 text-center '><a id='addScoreCardSection' class='font-green-soft'><i class='fa fa-plus margin-right-5 '></i>Add New Section</a></div>
                <div class="text-danger" id='sectionErr'></div>
            </div>
            <div id="scorecardSections" class="portlet lite pad-15"></div>
            <div id="createScorecardDiv" style="display: none;" class="text-center margin-top-10">
                <button type="button" class="btn btn-sm green btn-100 btn-circle margin-right-10" id="saveScorecard">Save</button>
                <button type="button" class="btn btn-sm btn-default btn-100 btn-circle" id="scorecardCancel">Cancel</button>
            </div>
        </div>
        <div id="editViewScorecards">
        </div>
        <div id="viewScorecards"></div>
        <div class="modal fade" id="delete-scorecard" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <h3 class="modal-title bold font-blue-soft">Are you sure you want to delete</h3>
                    </div>
                    <div class="modal-footer">
                        <button id="delete" scorecardid="" class="btn green" type="button">delete</button>
                        <button class="btn" id="delete_cancel" data-dismiss="modal" type="button">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="portlet lite pad-15 uploadscorecardfile" id="uploadscorecardfileclose" style="display: none">
            <div class="upload_panle">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="form-group">
                            <label class="label-head block">Upload File</label>
                            <input type="button" value="Browse" class="btn" onclick="javascript: document.getElementById('excelUploadScorecardFile').click();" />
                            <input type="file" id="excelUploadScorecardFile" style="display: none" />
                            <label id="upscorecardmsg"></label>
                        </div>
                    </div>
                    <div class="col-sm-6" id="headerselect" style="display: none">
                        <label class="label-head">File has Headers</label>
                        <div>
                            <label class="pull-left margin-right-20">
                                <input type="radio" value='1' class="css-checkbox radio_head" checked="true" id="header_1" name="radiog_head" />
                                <label class="css-rdb radiodchk" for="header_1">Yes</label>
                            </label>
                            &nbsp&nbsp
                <label class="pull-left">
                    <input type="radio" class="css-checkbox radio_head" id="header_2" value='2' name="radiog_head" />
                    <label class="css-rdb radiodchk" for="header_2">No</label>
                </label>
                        </div>
                    </div>
                </div>
                <div id="exlinfo"></div>
                <br />
                <div id="sheeterror" class="text-center text-danger" style="display: none">
                    <span id="sheettext"></span>
                </div>
                <div id="uploadSucessful"></div>
                <div class="form-group text-center" align="center">
                    <button type="button" class="btn btn-sm blue btn-100 btn-circle margin-right-10" id="saveScorecardExcelfile">Upload</button>
                    <button type="button" class="btn btn-sm btn-default btn-100 btn-circle" id="scorecardFileCancel">Cancel</button>
                </div>
                <div class="text-center f_13">
                    Download sample Excel format <a class="font-green" id="downloadScorecard">Here</a>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/jquery_ui.js"></script>
    <script type="text/javascript" src="scripts/jquery.iframe-transport.js"></script>
    <script type="text/javascript" src="scripts/jquery.fileupload.js"></script>
    <script type="text/javascript" src="scripts/custom/admin-scorecard.js"></script>
    <script type="text/javascript" src="scripts/custom/ScorecardExcelFile.js"></script>
    <script type="text/javascript" src="scripts/custom/common-validations.js"></script>
</asp:Content>
