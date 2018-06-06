<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="IVRPopups.aspx.cs" Inherits="Press3.UI.IVRPopups" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Press3 - IVRPopups</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <div class="page-content">
        <div class="portlet lite">
            <a id="ring">Ring User</a>
            <br />
            <a id="routeCalls">Time of the day</a>


        </div>
    </div>

    <div class="modal fade" id="ringUser" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title bold font-blue-soft">Ring - Skill Groups</h4>
                </div>
                <div class="modal-body f_13 ringUserDet">
                    <div class="form-group">
                        <label class="label-head">Wait Clip</label>
                        <input type="file" />
                    </div>

                    <div class="form-group">
                        <label class="label-head">Select Skill Group</label>
                    </div>

                    <div class="form-group">
                        <label class="label-head margin-bottom-15">Ring strategy</label>
                        <div class="row">
                            <div class="col-sm-1 col-xs-1">
                                <input type="checkbox" /></div>
                            <div class="col-sm-11 col-xs-11 pad-left-0">
                                <label>Linear Call Distribution</label>
                                <p class="f_12 txt-lite-grey">Calls will be distributed in order, starting at the beginning each time.</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-1 col-xs-1">
                                <input type="checkbox" /></div>
                            <div class="col-sm-11 col-xs-11 pad-left-0">
                                <label>Simultaneous Call Distribution</label>
                                <p class="f_12 txt-lite-grey">Calls will be presented to all available extensions simultaneously.</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-1 col-xs-1">
                                <input type="checkbox" /></div>
                            <div class="col-sm-11 col-xs-11 pad-left-0">
                                <label>Circular Call Distribution</label>
                                <p class="f_12 txt-lite-grey">
                                    Calls will be distributed evenly i.e. The first call goes to line 1. The second call goes to line 2, even
                                if line 1 is free. if line 2 is busy, the call will be routed to 3 before it is rounded to 1.
                                </p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-1 col-xs-1">
                                <input type="checkbox" /></div>
                            <div class="col-sm-11 col-xs-11 pad-left-0">
                                <label>Uniform Call Distribution</label>
                                <p class="f_12 txt-lite-grey">
                                    Calls will be distributed uniformly, starting with the agent who has handled the fewest calls
                                </p>
                            </div>
                        </div>

                    </div>

                    <div class="form-group">
                        <label class="label-head blocked">Queue Settings</label>
                        <input type="checkbox" class="margin-right-10" />
                        Play estimated wait time (EWT) clip
                        <div class="margin-left-30 margin-top-10">
                            <label>
                                <span class="margin-right-10">Select Voice Type</span>
                                <select class="form-control input-inline">
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </label>

                            <div class="row margin-top-10">
                                <div class="col-sm-1 col-xs-1">
                                    <input type="checkbox" /></div>
                                <div class="col-sm-11 col-xs-11 pad-left-0">
                                    <label>Take a call back request</label>
                                    <p class="f_12 txt-lite-grey">
                                        A call back request will be taken and added to the end of the que. At the time of the call back, 
                                a dial out call will be triggered to the caller.
                                    </p>
                                </div>
                            </div>

                            <label class="margin-top-10">If EWT is more than
                                <input type="text" class="input-circle form-control input-inline" style="width: 70px;" placeholder="00:00" />
                                minutes</label>

                            <label class="txt-lite-grey blocked margin-top-10">Message</label>
                            <div>
                                <label class="pull-left margin-right-20">
                                    <input type="radio" name="msg" class="margin-right-10" />
                                    Upload Clip</label>
                                <label class="pull-left">
                                    <input type="radio" name="msg" class="margin-right-10" />
                                    Text to Speech</label>
                                <div class="clearfix"></div>
                            </div>

                            <label class="txt-lite-grey blocked margin-top-10">Key Option</label>
                            <div class="row">
                                <label class="col-sm-3">
                                    <input type="text" class="form-control" placeholder="key" />
                                </label>
                                <label class="col-sm-9">
                                    <input type="text" class="form-control" placeholder="Description" />
                                </label>
                            </div>

                        </div>
                    </div>

                    <div class="form-group">
                        <label class="label-head blocked pull-left margin-right-20">Record Call :</label>
                        <label class="pull-left margin-right-20">
                            <input type="radio" name="cal_rec" class="margin-right-10" />
                            Yes</label>
                        <label class="pull-left">
                            <input type="radio" name="cal_rec" class="margin-right-10" />
                            No</label>
                        <div class="clearfix"></div>
                    </div>

                    <div class="form-group">
                        <label class="label-head blocked margin-bottom-10">Outbound Communications</label>
                        <div class="row">
                            <div class="col-sm-2 text-right">
                                <label class="txt-lite-grey margin-top-10">SMS :</label>
                            </div>
                            <div class="col-sm-10">
                                <div class="margin-bottom-10">
                                    <input type="checkbox" class="margin-right-10" />
                                    Country-1
                                <select class="form-control input-inline margin-left-10">
                                    <option>Sender Id</option>
                                </select>
                                </div>
                                <div class="margin-bottom-10">
                                    <input type="checkbox" class="margin-right-10" />
                                    Country-2
                                <select class="form-control input-inline margin-left-10">
                                    <option>Sender Id</option>
                                </select>
                                </div>
                                <div class="margin-bottom-10">
                                    <input type="checkbox" class="margin-right-10" />
                                    Country-3
                                <select class="form-control input-inline margin-left-10">
                                    <option>Sender Id</option>
                                </select>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-2 text-right">
                                <label class="txt-lite-grey margin-top-10">Calls :</label>
                            </div>
                            <div class="col-sm-10">
                                <div class="margin-bottom-10">
                                    <input type="checkbox" class="margin-right-10" />
                                    Country-1
                                <select class="form-control input-inline margin-left-10">
                                    <option>Caller Id</option>
                                </select>
                                </div>
                                <div class="margin-bottom-10">
                                    <input type="checkbox" class="margin-right-10" />
                                    Country-2
                                <select class="form-control input-inline margin-left-10">
                                    <option>Caller Id</option>
                                </select>
                                </div>
                                <div class="margin-bottom-10">
                                    <input type="checkbox" class="margin-right-10" />
                                    Country-3
                                <select class="form-control input-inline margin-left-10">
                                    <option>Caller Id</option>
                                </select>
                                </div>
                                <div class="margin-bottom-10">
                                    <input type="checkbox" class="margin-right-10" />
                                    Country-4
                                <select class="form-control input-inline margin-left-10">
                                    <option>Caller Id</option>
                                </select>
                                </div>
                            </div>
                        </div>

                        <div class="row margin-top-10">
                            <div class="col-sm-2 text-right">
                                <label class="txt-lite-grey">Email :</label>
                            </div>
                            <div class="col-sm-10">
                                Emails will be sent form - help@xyz.com
                            </div>
                        </div>

                    </div>

                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success btn-circle btn-sm" data-dismiss="modal">Save</button>
                    <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>

                </div>

            </div>

        </div>
    </div>

    <div class="modal fade" id="route_calls" role="dialog">
        <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title bold font-blue-soft">Route Calls according to the time of the day</h4>
                </div>
                <div class="modal-body f_13 ringUserDet">
                    <div class="form-group">
                        <label class="label-head blocked">Select Time Frame 1</label>
                        <select class="form-control input-inline">
                            <option>Shift 1 [Weekdays 06.00 - 14.00, Weekends 14.00 - 23.00]</option>
                        </select>
                        <a class="margin-left-5">View</a>
                    </div>

                    <div class="form-group">
                        <label class="label-head blocked">Select Time Frame 2</label>
                        <select class="form-control input-inline">
                            <option>Shift 1 [Weekdays 14.00 - 23.00, Weekends 06.00 - 14.00]</option>
                        </select>
                        <a class="margin-left-5">View</a>
                    </div>

                    <div class="form-group text-center">
                        <a class="font-green"><i class="fa fa-plus margin-right-5"></i>Add New Time Frame</a>
                    </div>

                    <div class="well well-sm well-grey brd pad-15">
                        <label><span class="label-head margin-right-10">Name :</span> Kamalam</label>
                        <hr style="border-color: #a5c4d0;" />
                        <div class="table-responsive">
                            <table class="table no-border">
                                <thead>
                                    <tr>
                                        <th class="bold-6">Day</th>
                                        <th class="bold-6">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Monday</td>
                                        <td>06.00 - 14.00</td>
                                    </tr>
                                    <tr>
                                        <td>Tuesday</td>
                                        <td>06.00 - 14.00</td>
                                    </tr>
                                    <tr>
                                        <td>Wednesday</td>
                                        <td>06.00 - 14.00</td>
                                    </tr>
                                    <tr>
                                        <td>Thursday</td>
                                        <td>06.00 - 14.00</td>
                                    </tr>
                                    <tr>
                                        <td>Friday</td>
                                        <td>14.00 - 23.00</td>
                                    </tr>
                                    <tr>
                                        <td>Saturday</td>
                                        <td>14.00 - 23.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success btn-circle btn-sm" data-dismiss="modal">Save</button>
                    <button type="button" class="btn btn-default btn-circle btn-sm" data-dismiss="modal">Close</button>

                </div>

            </div>

        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript">
        $(document).ready(function () {
            $("#ring").click(function () {
                $("#ringUser").modal("show");
            });
            $("#routeCalls").click(function () {
                $("#route_calls").modal("show");
            });
        });
    </script>
</asp:Content>
