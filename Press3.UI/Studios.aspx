<%@ Page Title="" Language="C#" MasterPageFile="~/PostLogin.Master" AutoEventWireup="true" CodeBehind="Studios.aspx.cs" Inherits="Press3.UI.Studios" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8" />
    <title>Press3 - Studios</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <style type="text/css">
        .graphs-panel {
            margin-bottom: 20px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageContent" runat="server">
    <div class="page-content">
        <div class="graphs-panel" id="divPortletDraftStudios">
            <div class="graphs-panel-head">
                <h4 class="bold-6 mt-0 mb-0">Draft IVR-Studios</h4>
            </div>
            <div class="graphs-panel-body">
                 <div class="row margin-bottom-10" id="divDraftStudios">
        </div>
            </div>
        </div>

      
        <div class="graphs-panel">
            <div class="graphs-panel-head clearfix">
                 <h4 class="bold-6 pull-left mb-0 margin-top-5">Saved IVR-Studios</h4>
        <label class="pull-right mb-0">
                    <a class="btn btn-success" href="/NewStudio.aspx" target="_blank"><i class="icon-plus margin-right-5"></i>Create New IVR</a>
        </label>
            </div>
            <div class="graphs-panel-body">
                <div class="table-responsive">
        <table class="table table-advance table-bordered">
        <thead>
        <tr>
        <th>IVR Name</th>
        <th>Purpose</th>
        <th>Created</th>
        <th>Last Modified</th>
        <th>Type</th>
        <th>Number</th>
        <th>Actions</th>
        </tr>
        </thead>
        <tbody id="tblActiveStudios">
        </tbody>
        </table>
        </div>
            </div>
        </div>
      
        
		</div>

    <div class="modal fade" role="dialog" id="changeNumberModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">Alert!</div>
                <div class="modal-body">
                    <div id="changeNumberBody">Are you sure you want to change the number for this Studio?</div>
                    <div id="errordiv" style="color: red;" class="margin-top-10 text-center"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success btn-circle btn-sm btn-100" id="btnChangeNumber" studioid="0" studiostatus="0" accountcallerid="0">Yes</button>
                    <button type="button" class="btn btn-default btn-circle btn-sm btn-100" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

     <div class="modal fade" role="dialog" id="delcnfmModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    Delete confirmation
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this Studio?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success btn-circle btn-sm btn-100" id="btnDelStudio" studioid="0">Yes</button>
                    <button type="button" class="btn btn-default btn-circle btn-sm btn-100" data-dismiss="modal">No</button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="Scripts" runat="server">
     <script type="text/javascript" src="scripts/custom/studios.js"></script>
</asp:Content>
