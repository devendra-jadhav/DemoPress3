<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="Profile.aspx.cs" Inherits="Press3.UI.Profile" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - Profile</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link rel="stylesheet" href="css/jquery.rateyo.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <div class="page-content">
        <div class="row">
            <input type="hidden" id="hdnAgentId" value="<%=agentId %>" />
            <div class="col-md-3 col-sm-3">
                <div class="portlet lite">
                    <div class="profie_pic">
                        <img src="assets/admin/layout/img/photo3.jpg" id="imgAgentProfilePic" class="img-responsive" alt="Profile" />
                        <div id="agentName" class="profile_name text-capitalize"></div>
                        <label class="profile_location">Hyderabad</label>
                    </div>
                    <div class="profile_rate">
                        <label class="txt-lite-grey blocked margin-bottom-10">Profile Rating</label>
                        <label class="rate" style="margin: auto;"></label>
                        <%--<label class="rate">
                            <i class="fa fa-star margin-right-10 fa-x font-green"></i>
                            <i class="fa fa-star margin-right-10 fa-x font-green"></i>
                            <i class="fa fa-star margin-right-10 fa-x font-green"></i>
                            <i class="fa fa-star-half-empty margin-right-10 fa-x font-green"></i>
                            <i class="fa fa-star-o fa-x"></i>
                        </label>--%>

                        <label id="lblRating" class="blocked text-success f_13"></label>
                    </div>
                    <hr />

                    <div class="row margin-bottom-10">
                        <div class="col-sm-6" style="padding-right: 5px;">
                            <div class="agent_avail">
                                <label id="lblAvailable"></label>
                                <span>Available</span>
                            </div>
                        </div>
                        <div class="col-sm-6" style="padding-left: 5px;">
                            <div class="agent_call">
                                <label id="lblOnCall"></label>
                                <span>On Call</span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-6" style="padding-right: 5px;">
                            <div class="agent_work">
                                <label id="lblOtherWork"></label>
                                <span>Other Work</span>
                            </div>
                        </div>
                        <div class="col-sm-6" style="padding-left: 5px;">
                            <div class="agent_break">
                                <label id="lblInBreak"></label>
                                <span>In Break</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="col-md-9 col-sm-9">
                <div class="portlet lite">

                    <div class="tabbable-custom">
                        <ul class="nav nav-tabs ">
                            <li class="active">
                                <a href="#tab_5_1" data-toggle="tab">My Profile </a>
                            </li>
                            <%-- <li>
                                <a href="#tab_5_2" data-toggle="tab">My Contacts </a>
                            </li>--%>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane active" id="tab_5_1">
                                <div class="row">
                                    <div class="col-md-4 col-sm-4">
                                        <div class="pad-10">
                                            <div id="skillGroupData"></div>

                                        </div>
                                    </div>
                                    <div class="col-md-8 col-sm-8 text-right">
                                        <div class="pad-10">
                                            <div id="skillsData"></div>
                                        </div>
                                    </div>
                                </div>
                                <hr class="margin-top-10">

                                <div class="row f_13">
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Full Name</label>
                                            <label id="lblName"></label>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Mobile Number</label>
                                            <label id="lblMobile"></label>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Extension Number</label>
                                            <label id="lblExtensionNumber"></label>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Email Id</label>
                                            <label id="lblEmail"></label>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Designation</label>
                                            <label id="lblDesignation"></label>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Reporting Manager</label>
                                            <label id="lblReportingManagers"></label>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Device Type</label>
                                            <label id="lblPhoneType"></label>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label class="txt-lite-grey blocked">Profile Type</label>
                                            <div id="profileType"></div>
                                        </div>
                                    </div>
                                </div>

                                <hr>

                                <div class="row">
                                    <div class="col-sm-6">
                                        <label class="txt-lite-grey margin-top-5">Logged in Since: <span id="spnLoginHrs" class="bold"></span></label>
                                    </div>
                                    <%--<div class="col-sm-6 text-right">
                                        <div class="input-icon right">
                                            <i class="fa fa-calendar"></i>
                                            <%--<input type="text" class="form-control input-inline" placeholder="Select Date">
                                        </div>
                                    </div>--%>
                                </div>


                                <div class="margin-top-25">
                                    <ul class="chats" id="loginActivities">

                                        <li class="in">
                                            <img class="avatar" alt="" src="assets/img/user.jpg" />
                                            <div class="message">
                                                <span class="arrow"></span>
                                                <span href="#" class="name bold">Status Change </span>
                                                <span class="datetime">at 01/01/2017, 20:09 </span>
                                                <span class="body">Changed to : Available</span>
                                            </div>
                                        </li>

                                        <li class="in">
                                            <img class="avatar" alt="" src="assets/img/user.jpg" />
                                            <div class="message">
                                                <span class="arrow"></span>
                                                <span href="#" class="name bold">Status Change </span>
                                                <span class="datetime">at 01/01/2017, 20:09 </span>
                                                <span class="body">Changed to : Available</span>
                                            </div>
                                        </li>

                                        <li class="in">
                                            <img class="avatar" alt="" src="assets/img/user.jpg" />
                                            <div class="message">
                                                <span class="arrow"></span>
                                                <span href="#" class="name bold">Status Change </span>
                                                <span class="datetime">at 01/01/2017, 20:09 </span>
                                                <span class="body">Changed to : Available</span>
                                            </div>
                                        </li>
                                        <li class="in">
                                            <img class="avatar" alt="" src="assets/img/user.jpg" />
                                            <div class="message">
                                                <span class="arrow"></span>
                                                <span href="#" class="name bold">Status Change </span>
                                                <span class="datetime">at 01/01/2017, 20:09 </span>
                                                <span class="body">Changed to : Available</span>
                                            </div>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                            <div class="tab-pane pad-15" id="tab_5_2">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <label class="margin-top-10"><a class="font-green" id="newContact"><i class="fa fa-plus margin-right-5"></i>Create New Contact</a></label>
                                    </div>
                                    <div class="col-sm-6 f_13">
                                        <span class="txt-lite-grey">Contact List </span>
                                        <select class="form-control input-inline margin-left-10">
                                            <option>All Contacts</option>
                                            <option>Group 1</option>
                                            <option>Group 2</option>
                                        </select>

                                    </div>
                                </div>

                                <div class="table-responsive margin-top-15">
                                    <table class="table table-advance">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Number</th>
                                                <th>Alternate Number</th>
                                                <th>Email</th>
                                                <th>Notes</th>
                                                <th>Actions</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <label class="btn-call margin-right-5"><i class="fa fa-phone"></i></label>
                                                    Kamal Chidira..</td>
                                                <td>91-9848022338</td>
                                                <td>973-9445612302</td>
                                                <td>kamal@smscountry.com</td>
                                                <td>Field Agent - lorem impsum amt...</td>
                                                <td><a class="font-blue margin-right-10"><i class="icon-pencil"></i></a>
                                                    <a class="font-red"><i class="icon-trash"></i></a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label class="btn-call margin-right-5"><i class="fa fa-phone"></i></label>
                                                    Kamal Chidira..</td>
                                                <td>91-9848022338</td>
                                                <td>973-9445612302</td>
                                                <td>kamal@smscountry.com</td>
                                                <td>Field Agent - lorem impsum amt...</td>
                                                <td><a class="font-blue margin-right-10"><i class="icon-pencil"></i></a>
                                                    <a class="font-red"><i class="icon-trash"></i></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/jquery.rateyo.min.js"></script>
    <script src="scripts/custom/profile.js" type="text/javascript"></script>
</asp:Content>
