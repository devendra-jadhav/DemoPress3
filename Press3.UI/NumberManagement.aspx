<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="NumberManagement.aspx.cs" Inherits="Press3.UI.NumberManagement" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Press3 - Number Management</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <div class="page-content">
        <div class="graphs-panel margin-bottom-20">
            <div class="graphs-panel-head clearfix">
                <h4 class="bold-6 pull-left mb-0 mt-0">Available Gateways</h4>
                <label class="mb-0 pull-right">
                    <button type="button" class="btn btn-success" id="addGateway"><i class="fa fa-plus margin-right-5"></i>Add New Gateway</button></label>
            </div>
            <div class="graphs-panel-body">
                <div class="table-responsive">
       <table class="table table-advance">
       <thead>
       <tr>
       <th>Gateway Name</th>
       <th>Server IP</th>
       <th>Channels</th>
       <th>Actions</th>
       </tr>
       </thead>
       <tbody id="tbodyGateways">
       </tbody>
       </table>
       </div>
            </div>
        </div>
      
       <div class="graphs-panel">
            <div class="graphs-panel-head">
                <h4 class="bold-6">Available Numbers</h4>
            </div>
           <div class="graphs-panel-body">
                <div class="row">
       <div class="col-sm-4">
       <div class="form-group">
       <label>Search Number / Name</label>
       <div class="input-group">
       <div class="input-icon left">
       <i class="fa fa-search"></i>
       <input type="text" class="form-control input-circle-left" placeholder="search here" id="txtSearch" />
       </div>
       <span class="input-group-btn">
       <button type="button" class="btn btn-success btn-circle-right" id="btnSearchNumber">Search</button>
       </span>
       </div>
       </div>
       </div>
       <div class="col-sm-3">
       <div class="form-group">
       <label>Availability</label>
       <select class="form-control" id="selAvailableStatus">
       <option value="1">Yes</option>
       <option value="0">No</option>
       </select>
       </div>
       </div>
       <div class="col-sm-3">
       <div class="form-group">
       <label>Assigned</label>
        <select class="form-control" id="selAssignedStatus">
         <option value="0">No</option>
         <option value="1">Yes</option>
       </select>
       </div>
       </div>

       <div class="col-sm-2">
             <div class="form-group">
               
              
                            <input type="button" id="btnGetReports" class="btn btn-circle btn-success" value="Get Reports" style="margin-top: 25px;" />
               </div>
               
               
                       
       </div>
       </div>
       
       <div class="table-responsive margin-top-10">
       <table class="table table-advance numbersList table-bordered">
       <thead>
       <tr>
                                <th>
                                    <label class="margin-top-15">Number</label></th>
                                <th>
                                    <label class="margin-top-15">Gateway Name</label></th>
                                <th style="width: 25%" class="text-center">Status
       <div class="margin-top-5" style="border-top: 1px solid #ddd;">
       <label class="stat_label margin-top-5">Available</label>
       <label class="stat_label margin-top-5">Assigned</label>
       </div>
       </th>
                                <th>
                                    <label class="margin-top-15">IVR Name</label></th>
                                <th>
                                    <label class="margin-top-15">Actions</label></th>
       </tr>
       </thead>
       <tbody id="tblCallerIdNumbers">
       </tbody>
       </table>
       </div>
           </div>
       </div>
      
		</div>

            <div class="modal fade" id="cnfmPopup" role="dialog">
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header"></div>
                    <div class="modal-body" id="modalMessage">
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-success btn-circle btn-sm btn-100" id="btnCnfm" statusid="" callerid="">Yes</button>
                        <button type="button" class="btn btn-default btn-circle btn-sm btn-100" data-dismiss="modal">No</button>
                    </div>
                 </div>
            </div>
            </div>

        <div class="modal fade" id="createGateway" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                    <h4 class="modal-title bold font-blue-soft">Add New Gateway</h4>
                </div>
                <div class="modal-body">
               <table class="table no-border">
               <tr>
               <td class="txt-lite-grey col-sm-3">Gateway Name</td>
               <td>
               <input type="text" class="form-control" id="txtGatewayName" maxlength="20" />
               </td>
               </tr>
               <tr>
               <td class="txt-lite-grey col-sm-3">Server IP</td>
               <td>
               <input type="text" class="form-control" id="txtIp" maxlength="64" />
               </td>
               </tr>
               <tr>
               <td class="txt-lite-grey col-sm-3">Total Channels</td>
               <td>
               <input type="text" class="form-control" id="txtTotalChannels" maxlength="3" />
               </td>
               </tr>


               <tr>
               <td class="txt-lite-grey col-sm-3">Numbers</td>
                </tr>
               <tr id="Range_0">
               <td>
                                <label class="margin-right-10">
                                    <input type="checkbox" id="chkRange" />
                                    Numbers Range</label>
                                <label class="margin-left-20"><a class="font-green" id="addRange" style="display: none;"><i class="icon-plus margin-right-5"></i>Add</a></label>
               </td>
               </tr>
               <tr id="Number_0">
               <td>
                                <label>
                                    <input type="checkbox" id="chkNumber" />
                                    Individual Numbers</label>
                                <label class="margin-left-20"><a class="font-green" id="addNumber" style="display: none;"><i class="icon-plus margin-right-5"></i>Add</a></label>
               </td>
               </tr>
               </table>
                    <div id="divGatewayError" class="text-center" style="color: red;"></div>
                    <div id="divGatewaySuccess" class="text-center" style="color: green;"></div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success btn-circle btn-sm btn-100" id="btnSaveGateway" gatewayid="0">Save</button>
                    <button type="button" class="btn btn-default btn-circle btn-sm btn-100" data-dismiss="modal">Close</button>

                </div>

            </div>

        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
    <script type="text/javascript" src="scripts/custom/common-validations.js"></script>
    <script type="text/javascript" src="scripts/custom/number-management.js"></script>
</asp:Content>
