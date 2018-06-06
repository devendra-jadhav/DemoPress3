var searchText = "";
var groupId = 0, labelId = 0;
var GroupId__ = 0;
var global_CallerDetails = [], global_ExcelFields = [];
var eresponse;
var xlfile_path = "";
var regx = "";
regx = "^[a-zA-Z0-9_. ]+$";
var domain = location.host
var host = (location.protocol === 'https:') ? 'wss://' : 'ws://';
var page = '/ConferenceWebSocket.sub?Channel_Name=';
var ws;
var agentId = 0;
var communicationTypeId = 0;
var roleId = 0;
var isEdit = 0;
var LableName = '';
var GroupName = '';
var colorcode = '';
var global_pageLength = 15, global_pageIndex = 1;



$(document).ready(function () {

    
    agentId = $("#hdnAgentId").val();
    roleId = $("#hdnRoleId").val();
    $("#excelUploadFile").val('');

    callersManagement(1);
    ManageCallerGroupsAndLabels(2, "","");
    ManageCallerGroupsAndLabels(4, "", "");
    AgentsManagement(2);
    $(".show-for-file").hide();
    $(".moreOption").hide();
    
       
    $("#btnSearch").click(function () {

        groupId = $(".callerGroups.active").attr("groupid");
        labelId = $(".callerLabels.active").attr("labelid");
         
        // groupId = 0;
        //labelId = 0;
        callersManagement(1);
       
    });
    $(document).on("click", ".createGroup", function () {
        isEdit = 0;
        $("#txtGroupName").val("");
        $("#createGroup").modal("show");
    });
    $(document).on("input", "#txtCallerMobile", function () {
        this.value = this.value.replace(/[^\d]/g, '');
    });
    $(document).on("input", ".Numeric", function () {
        this.value = this.value.replace(/[^\d\.\-]/g, '');
    });
    $(document).on("input", ".Alphabets", function () {
        this.value = this.value.replace(/[^a-zA-Z]/g, '');
    });
    $(document).on("input", ".AlphaNumerics", function () {
        this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
    });
    $('#txtSearch').on('keypress', function (e) {
        if (e.which === 13) {
            $("#btnSearch").click();
            e.preventDefault();          
        }        
    });
    $('#txtSearch').on('keyup', function (e) {
        if (this.value == "") {
            $("#btnSearch").click();
            e.preventDefault();          
        }
    });
  
    $("#eCreateGroup").click(function () {
        var groupName = $("#txtGroupName").val();
        var colorCode = $(".bfh-colorpicker[id='createGroupColorCode']").val();
        if (groupName == "" || groupName == "undefined")
        {
            alert("please enter group name");
            return false;
        }
      
        if (colorCode == "" || colorCode == "undefined") {
            alert("please enter color code ");
            return false;
        }
        ManageCallerGroupsAndLabels(1, groupName,colorCode);
    });

    $(document).on("click", ".createLabel", function () {
        isEdit = 0;
        $("#txtLabelName").val("");
        $("#createLabel").modal("show");
    });

    $("#btnCreateLabel").click(function () {
        var labelName = $("#txtLabelName").val();
        var labelColorCode = $(".bfh-colorpicker[id='createlabelColorCode']").val();
        if (labelName == "" || labelName == "undefined")
        {
            alert("please enter label name");
            return false;
        }
        labelName = labelName.trim();
        if (labelName == "") {
            alert("please enter label name");
            return false;
        }

        if (labelColorCode == "" || labelColorCode == "undefined") {
            alert("please enter color code ");
            return false;
        }
        if (isEdit == 1) {
            EditLableAndGroups(8,labelName, labelColorCode, labelId, 0);
        }
        else { ManageCallerGroupsAndLabels(3, labelName, labelColorCode); }
        $(".bfh-colorpicker[id='createlabelColorCode']").val("#FF0000");
    });

    $("#btnCloseLabel").click(function () {
        colorcode = $(".bfh-colorpicker[id='createlabelColorCode']").val();
        LableName = $("#txtLabelName").val();
        if (isEdit = 0) {
            $("#txtLabelName").html("");

            $(".bfh-colorpicker[id='createlabelColorCode']").val("#FF0000");
        }
        else 
       { $(".moreOption").show();
        $("#delGroup").hide();
        $("#EditGroup").hide();
        $("#delLabel").show();
        $("#EditLabel").show();
        $(".raiseOffTick").hide();
        
    }

    

    });
  
$("#btnCloseGroup").click(function () {
    colorcode = $(".bfh-colorpicker[id='createGroupColorCode']").val();
    GroupName = $("#txtGroupName").val();
    if (isEdit = 0) {
        $("#txtGroupName").html("");
        $(".bfh-colorpicker[id='createGroupColorCode']").val("#FF0000");
    }
    else 
    { $(".moreOption").show();
        $("#delGroup").show();
        $("#EditGroup").show();
        $("#delLabel").hide();
        $("#EditLabel").hide();
        $(".raiseOffTick").hide();
    }   
    });

    $(document).delegate("#delGroup", "click", function () {
        $("#btndeleteGroup").attr("groupid", $(this).attr("groupid"));
        $("#deleteGroup").modal("show");
        e.preventDefault();
    });
    $(document).delegate("#btndeleteGroup", "click", function () {

        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });

        $.ajax({
            type: "GET",
            url: "Handlers/Caller.ashx",
            dataType: "JSON",
            async: true,
            data: { type: 7, mode: 5, groupId: $(this).attr("groupid") },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {
                    $("#deleteGroup").modal("hide");
                    ManageCallerGroupsAndLabels(2, "", "");     // updation of group in the list
                    groupId = 0;                                // to resolve ambiguity for callersManagement with groupId
                    callersManagement(1);
                    $(".raiseOffTick").show();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.unblockUI();
                if (jqXHR.status == 401) {
                    window.location.href = "/Login.aspx?message=Session expired";
                } else {
                    console.log(errorThrown);
                }
            }
        });
    });


    $(document).delegate("#delContact", "click", function () {  
        
      
        $("#btndeleteCaller").attr("groupid", $(this).attr("groupid"));

        $("#btndeleteCaller").attr("callerids", $(this).attr("callerids"));
        $("#deleteCaller").modal("show");
        e.preventDefault();
    });
    $(document).delegate("#btndeleteCaller", "click", function () {
        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
        
            $.ajax({
                type: "GET",
                url: "Handlers/Caller.ashx",
                dataType: "JSON",
                async: false,
                data: { type: 9, mode: 7, groupId: groupId, callerIds: $(this).attr("callerids"),labelId: labelId},
                success: function (res) {
                    $.unblockUI();
                    if (res.Success == "True") {
                        $("#deleteCaller").modal("hide");
                        callersManagement(1);
                        editMoreOptions();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $.unblockUI();
                    if (jqXHR.status == 401) {
                        window.location.href = "/Login.aspx?message=Session expired";
                    } else {
                        console.log(errorThrown);
                    }
                }
            });
       
    });


    
    $(document).delegate("#btndeleteLabel", "click", function () {
        // alert($(this).attr("labelId"));

        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });

        $.ajax({
            type: "GET",
            url: "Handlers/Caller.ashx",
            dataType: "JSON",
            async: true,
            data: { type: 8, mode: 6, LabelId: labelId },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {
                    $("#deleteLabel").modal("hide");
                    ManageCallerGroupsAndLabels(4, "", "");
                    ManageCallerGroupsAndLabels(2, "", "");
                    labelId = 0;
                    callersManagement(1);
                    $(".raiseOffTick").show();

                
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.unblockUI();
                if (jqXHR.status == 401) {
                    window.location.href = "/Login.aspx?message=Session expired";
                } else {
                    console.log(errorThrown);
                }
            }
        });
    });
    $("#btnCreateGroup").click(function () {
       
      
        var groupName = $("#txtGroupName").val();
        var groupColorCode = $(".bfh-colorpicker[id='createGroupColorCode']").val();
        if (groupName == "" || groupName == "undefined") {
            alert("please enter group name");
            return false;
        }
        groupName = groupName.trim();
        if (groupName == "") {
            alert("please enter  group name");
            return false;
        }
        if (groupColorCode == "" || groupColorCode == "undefined") {
            alert("please enter color code ");
            return false;
        }
        if (isEdit == 1) {
         
            EditLableAndGroups(9, groupName, groupColorCode, 0, GroupId__);
        }
        else {

            ManageCallerGroupsAndLabels(1, groupName, groupColorCode);
        }
         $(".bfh-colorpicker[id='createGroupColorCode']").val("#FF0000");
    });

    $("#btnCloseGroup").click(function () {
        $("#txtGroupName").html("");
        $(".bfh-colorpicker[id='createGroupColorCode']").val("#FF0000");
    });

    $(document).on("click", ".moveGroup", function () {
        var checkedLength = $(".caller:checked").length;
        var callerIds = "";
        if (checkedLength == 0) {
            alert("please select callers");
            return false;
        }
        $(".caller:checked").each(function () {
            callerIds += $(this).attr("CallerId") + ",";
        })

        var sourcegroupId = $(".callerGroups.active").attr("groupid");
        
        addCallersToGroupsOrLabels(1, callerIds, $(this).attr("GroupId"), sourcegroupId);
    })
    $(document).on("click", ".moveLabel", function () {
        var checkedLength = $(".caller:checked").length;
        var callerIds = "";
        if (checkedLength == 0) {
            alert("please select callers");
            return false;
        }
        $(".caller:checked").each(function () {
            callerIds += $(this).attr("CallerId") + ",";
        })
        addCallersToGroupsOrLabels(2, callerIds, $(this).attr("LabelId"));
    })

    $(document).delegate(".callerGroups", "click", function () {        
        
        global_pageIndex = 1;
        groupId = $(this).attr("GroupId");
     
        labelId = $(".callerLabels.active").attr("labelid");
        GroupName = $(this).attr("GroupName");
        colorcode = $(this).attr("GroupColor");
        $("#delLabel").hide();
        $("#EditLabel").hide();
        $(".raiseOffTick").hide();

        if (labelId == 0)
        {
            $("#addContacts").show();
            $(".moreOption").show();
            $("#EditGroup").show();
            
        }
        else
        {   
            $("#addContacts").hide();
            $(".moreOption").hide();
            $(".raiseOffTick").show();
            
        }


        $("#lstMoveGroups li").show();
       // $("#lstMoveGroups li").attr('groupid') == groupId

        $("#lstMoveGroups").find("[groupid='" + groupId + "']").hide();
        var curSize = parseInt($('.callerGroups.active').css('font-size'));
        $(".callerGroups.active").css('font-size', curSize-2);
        $('.callerGroups').removeClass('active');
        $(this).addClass('active');
        $(this).css('font-size', curSize);        
       
        callersManagement(1);        
        
        if (groupId == 0)
        {
            $(".moreOption").hide();
            $("#addContacts").show();
            $(".raiseOffTick").show();
        }            
        else
        {
           
            $("#addContacts").hide();
        }
                
        $("#delGroup").show();
        $("#raiseTicket").hide();
        $("#delContact").hide();
        
        $("#delGroup").attr("groupid", $(this).attr("GroupId"));
        $("#delContact").attr("groupid", $(this).attr("GroupId"));
        //$("#raiseTicket").attr("groupid", $(this).attr("GroupId"));                    
    });

    

    $(document).on("click", ".callerLabels", function () {
        global_pageIndex = 1;
        labelId = $(this).attr("LabelId");
       
        groupId = $(".callerGroups.active").attr("groupid");
        LableName = $(this).attr("LabelName");
        colorcode = $(this).attr("LabelColor");
       

        $(".caller").each(function () {
            this.checked = false;
        });

        editMoreOptions();
        $(".raiseOffTick").hide();
        
        $("#EditGroup").hide();
        if (labelId == 0)
        {
            $(".moreOption").hide();
            $("#addContacts").show();
            $(".raiseOffTick").show();
        }
        else {
            $("#delGroup").hide();
        }
            
     

        if (groupId == 0) {
            $(".moreOption").show();
            $("#delLabel").show();
            $("#EditLabel").show();

        }
        else {
            $("#addContacts").hide();
            $(".moreOption").hide();
            $(".raiseOffTick").show();
        }

        if (groupId == 0 && labelId == 0) {
            $(".moreOption").hide();
        }
        

        var curSize = parseInt($('.callerLabels.active').css('font-size'));
        $(".callerLabels.active").css('font-size', curSize - 2);
        $('.callerLabels').removeClass('active');
        $(this).addClass('active');
        $(this).css('font-size', curSize);
        callersManagement(1);
    });

    $(document).delegate("#EditLabel", "click", function () {
        $("#txtLabelName").val(LableName);
        $(".bfh-colorpicker[id='createlabelColorCode']").val(colorcode);
        $("#createLabel").modal("show");
        isEdit = 1;
        
    });
    $(document).delegate("#EditGroup", "click", function () {

        $("#txtGroupName").val(GroupName);
        $(".bfh-colorpicker[id='createGroupColorCode']").val(colorcode);
        $("#createGroup").modal("show");
        isEdit = 1;
        GroupId__ = groupId;
       
        
    });
    $(document).delegate("#delLabel", "click", function () {
       
        $("#btndeleteLabel").attr("labelid", labelId);
         $("#deleteLabel").modal("show");
    });
    $(document).delegate("#raiseTicket", "click", function() {
        $("#btnOffRaiseTicket").trigger("click");
    });

    $('[name="radiog_head"]').on("keypress", function (e) {
        if (e.keyCode == 13) {

            return false; // prevent the button click from happening
        }
    });
    
    $('#txtGroupName').on("keypress", function (e) {
        if (e.keyCode == 13) {
            
            return false; // prevent the button click from happening
        }
    });

    $('#txtLabelName').on("keypress", function (e) {
        if (e.keyCode == 13) {

            return false; // prevent the button click from happening
        }
    });

  

   
    $("#addContacts").click(function () {

        $("#addCaller").find("input:text").val('');

        $("#ddlGender").val('Select');
        $(".ddlRequiredField").val('Select');

        $("#lblEditErrorMsg").html("");
        $("#sheet-err-txt").text("");
        $("#sheet-file-name").html("");
        $(".radio_head").prop("checked", false);
        $("#caller-msg").html("");
        $(".show-for-file").hide();
        $("#tblAddCallerDetails").addClass("active");
        $("#excel-caller-upload").removeClass("active");
        $(".uploadCallers").find("li").removeClass("active");
        $(".uploadCallers").find("li[id-value='0']").addClass("active");
        $("#addCaller").modal("show");
    });
    $('ul.uploadCallers li').click(function () {
        if ($(".uploadCallers").find("li.active").attr("id-value") == "0") {
            $("#lblEditErrorMsg").html("");
            $("#sheet-err-txt").text("");
            $("#sheet-file-name").html("");
            $(".radio_head").prop("checked", false);
            $("#caller-msg").text("");
            $(".show-for-file").hide();
            $("#tblAddCallerDetails").addClass("active");
            $("#excel-caller-upload").removeClass("active");
            $(".uploadCallers").find("li").removeClass("active");
            $(".uploadCallers").find("li[id-value='0']").addClass("active");
        
        } else {

            //   if ($('ul.uploadCallers li').find("li.active").attr("id-value") == "1") {
            $("#lblEditErrorMsg").html("");
            $("#sheet-err-txt").text("");
            $("#sheet-file-name").html("");
            $(".radio_head").prop("checked", false);
            $("#caller-msg").text("");
            $(".show-for-file").hide();
            $("#tblAddCallerDetails").removeClass("active");
            $("#excel-caller-upload").addClass("active");
            $(".uploadCallers").find("li").removeClass("active");
            $(".uploadCallers").find("li[id-value='1']").addClass("active");    
        }
    });


    $("#btnOffRaiseTicket").click(function () {

        var checkedLength = $(".caller:checked").length;
        var callernumber = "";
   

        if (checkedLength == 0) {
            alert("Please select the caller..!");
            return false;
        }
        else if (checkedLength != 1) {
            alert("Please select only 1 caller..!");
            return false;
        }
        else {

            callernumber = $(".caller:checked").attr("CallerNumber");

            window.location.href = "/CallerDetails.aspx?CallerNumber=" + callernumber + "&flagpopup="+1;                        
        }
        
    });

    $("#btnCreateCaller").click(function () {
        var isExcel = $(".uploadCallers").find("li.active").attr("id-value");
        if (isExcel == "0") {
        var detailsObj = {};
        $("#lblEditErrorMsg").html("");
        var isValid = 1;
        $(".metaData .txtRequired").each(function (index) {
            if ($(this).val() == "") {
                $("#lblEditErrorMsg").html($(this).attr("key") + " is Mandatory");
                isValid = 0;
                return false;
            }
        });
        $(".metaData .NoSpecialChars").each(function (index) {
            if ($(this).val() != "")
            {
                
                var re = /[$-/:-?{-~!@"^_`\[\]]/;
                if (re.test($(this).val())) {
                    $("#lblEditErrorMsg").html("Special Characters Not Allowed In " + $(this).attr("key"));
                isValid = 0;
                return false;
            }
            }
        });


        if (isValid == 0) {
            return false;
        }
        $(".metaData .ddlRequiredField").each(function (index) {
            if ($(this).val() == "Select") {
                $("#lblEditErrorMsg").html("Please select " + $(this).attr("key"))
                isValid = 0;
                return false;
            }
        });
        
        if (isValid == 0) {
            return false;
        }
        var callerName = $("#txtCallerName").val();
        var callerMobile = $("#txtCallerMobile").val();
        var callerEmail = $("#txtCallerEmail").val();

        callerName = callerName.trim();
        callerEmail = callerEmail.trim();
        callerMobile = callerMobile.trim();

        if (callerName == "") {
            $("#lblEditErrorMsg").html("Please Enter Name");
            return false;
        }
        var moblen = callerMobile.length;

        if (moblen > 15 || moblen < 7) {
            $("#lblEditErrorMsg").html("Mobile Number length should be Min 7 and Max 15");
            return false;
        }
       
        if (callerEmail != "" && !isEmail(callerEmail)) {
            $("#lblEditErrorMsg").html("Please Enter Valid Email");
            return false;
        }
        $(".metaData .field").each(function () {

            var Key = $(this).attr("Key");
                var fieldType = $(this).attr("FieldType");
                var value = $(this).val();
                if (value == "Select") {
                    value = "";
                }
            detailsObj[Key] = value;
        });

        var details = JSON.stringify(detailsObj);
        Caller_Id = "";
        CreateCaller(details, callerMobile, callerName, callerMobile, callerEmail, Caller_Id);
        } else if (isExcel == "1") {
            if ($("#sheet-file-name").html() == "") {
                $("#sheet-err-txt").html("Please upload excel file");
                return false;
            } else {
                creating();
            }
        }
    });
    $(".radio_head").click(function () {
        var item = "";
        item = $(this).attr("value");
        if (xlfile_path == '') {
            $('#sheet-err-txt').text("Please upload excel file");
            return false;
        }
        else {
            SetXlColumns(eresponse)
        }
    });
    $("#saveExcelContacts").click(function () {
    
        if ($('#ddlCountry').val() == 0) {
            $('#sheet-err-txt').text("Please select country from drop down list");
            return false;
        }
        else if ($('#sheet-file-name').html().length == 0) {
            $('#sheet-err-txt').text("Please upload excel file");
            return false;
        }
        $('#extgrp').hide();
        $("#xlinfo").show();
        creating();
});

    $('input[type="file"]').css('color', '');

    $("#excelUploadFile").fileupload({
        dataType: 'json',
        url: "Handlers/CallersUpload.ashx",
        autoUpload: 'false',
        acceptFileTypes: /(\.|\/)(xls|xlsx)$/i,
        maxFileSize: 5000000, // 5 MB
        start: function (e) {
            $("#headerselect").hide();
            $('#sheet-file-name').html('');
            $('input[type="file"]').css('color', 'transparent');
        },
        success: function (res) {
            if (res.Success) {
                $('#sheet-err-txt').text("");
                $("#headerselect").show();
                $(".show-for-file").show();
                eresponse = res;
                SetXlColumns(res);
                xlfile_path = res.FilePath;
                var fileName = res.FileName;
                $('#sheet-file-name').html(fileName);
                $("#caller-msg").html("");
            }
            else {
                if (res.StatusCode == 401) {
                    window.location.href = "/Login.aspx?message=Session expired";
                }
                else {
                    $('#sheet-err-txt').text(res.Message);
                    $('#sheet-file-name').html('');
                    $(".show-for-file").hide();
                    $("#caller-msg").html("");
                }
            }
        },
        error: function (e) { console.log(e); },
        done: function (e, data) {
            console.log(data);

            status = 0;
        },
        fail: function (e, data) {
            console.log(data);
            if (data.textStatus == 'error') {
                $("#err_xcel").attr("class", "alert alert-error");
                $("#err_xcel span").text("please upload files less than 5MB");
            }
        }
    });

});




$(document).delegate("#selectall_chk1", "click", function () {

    if (this.checked) {
        $(".caller").each(function () {
            this.checked = true;
        })
    } else {
        $(".caller").each(function () {
            this.checked = false;
        })
    }
    editMoreOptions();
});

$(document).delegate(".caller", "click", function () {
    
    $('#selectall_chk1').prop('checked', false);  

    editMoreOptions();
});

function editMoreOptions()
{ 
    var callerIds = [];
    $(".caller:checkbox:checked").each(function () {
        callerIds.push($(this).attr("callerid"));
    })

    if ($(".caller:checkbox:checked").length == 0) {
        if (groupId == 0 && labelId == 0) {
            $(".moreOption").hide();

        }
        $("#raiseTicket").hide();
        $("#delContact").hide();
    }
    else if ($(".caller:checkbox:checked").length == 1) {
        if (groupId == 0 && labelId == 0) {
            $(".moreOption").hide();
        }
        $("#raiseTicket").show();
        $("#delContact").show();
    }
    else if ($(".caller:checkbox:checked").length > 1) {
        if (groupId == 0 && labelId == 0) {
            $(".moreOption").hide();
        }
        $("#raiseTicket").hide();
        $("#delContact").show();
    }

    $("#delContact").attr("callerids", callerIds);    
}

$(document).delegate(".btn-outbound-call", "click", function () {
    $(".btn-outbound-call").attr("disabled", true);
    var customerId = $(this).attr("caller-id");
    var customerMobile = $(this).attr("caller-mobile");
    var cbrId = $(this).attr("cbr-id");
    $(".btn-outbound-call[caller-id='" + customerId + "']").hide();
    $(".loader-gif[caller-id='" + customerId + "']").show();
    var randomUUID = createUUID();

    if (communicationTypeId != "" && parseInt(communicationTypeId) > 0) {
        if (communicationTypeId == "1") {
            window.location.href = "/AgentHome.aspx?CustomerId=" + customerId + "&CustomerMobile=" + customerMobile + "&CommunicationTypeId=" + communicationTypeId;
        }
        else {
            var hostTotal = host + domain + page + "Agent_o_" + randomUUID;
            ws = new WebSocket(hostTotal);
            ws.onopen = function (evt) {
                console.log("WebSocket Connection Open");
                console.log(hostTotal);
            };
            ws.onmessage = function (evt) {
                console.log("WebSocket Connection data ");
                console.log(evt);
                var websocketResult = "";
                if (evt != "") {
                    websocketResult = jQuery.parseJSON(evt.data);
                    if (websocketResult.Event == "hangup") {
                        alert("Unable to connect to your device. Please check the connectivity. Cause: (" + websocketResult.Message.replace(/_/g, " ") + ")");
                    } else if (websocketResult.Event == "newcall") {
                        window.location.href = "/AgentHome.aspx?CallId=" + websocketResult.CallId + "&CbrId=" + cbrId + "&CustomerId=" + customerId + "&CustomerMobile=" + customerMobile + "&CallUUID=" + randomUUID + "&CommunicationTypeId=" + communicationTypeId;
                    }
                    $(".loader-gif[caller-id='" + customerId + "']").hide();
                    $(".btn-outbound-call[caller-id='" + customerId + "']").show();
                    $(".btn-outbound-call").attr("disabled", false);
                } else {
                    $(".loader-gif[caller-id='" + customerId + "']").hide();
                    $(".btn-outbound-call[caller-id='" + customerId + "']").show();
                    $(".btn-outbound-call").attr("disabled", false);
                }
            };


            $.blockUI({
                message: '<img src="/assets/img/Press3_Gif.gif" />',
                css: {
                    border: 'none',
                    backgroundColor: 'transparent',
                }
            });
            $.ajax({
                type: "GET",
                url: "Handlers/Calls.ashx",
                dataType: "JSON",
                async: false,
                data: { type: 13, customerId: customerId, callUUID: randomUUID, cbrId: cbrId },
                success: function (res) {
                    $.unblockUI();
                    if (res.Success.toString().toLowerCase() == "true") {

                    } else {
                        $(".loader-gif[caller-id='" + customerId + "']").hide();
                        $(".btn-outbound-call[caller-id='" + customerId + "']").show();
                        $(".btn-outbound-call").attr("disabled", false);
                        alert(res.Message);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $.unblockUI();
                    $(".loader-gif[caller-id='" + customerId + "']").hide();
                    $(".btn-outbound-call[caller-id='" + customerId + "']").show();
                    $(".btn-outbound-call").attr("disabled", false);
                    if (jqXHR.status == 401) {
                        window.location.href = "/Login.aspx?message=Session expired";
                    } else if (jqXHR.status == 406) {
                        $("#modalPreviousSession").modal("show");
                    } else {
                        console.log(errorThrown);
                    }
                }
            });
        }
    }
});

function SetXlColumns(response) {
    var options = ""; sheetsCount = 0, sheetsInfo = "", ddlOptions = "", sheetsInfo1 = "";
    var sheetscnt = {}, sheethead = {};
    sheetsCount = response.ExcelSheets.length;

    sheetsxl = { "sheetsInfo": [] };
    var headerletters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"]
    var header = $("input[name=radiog_head]:checked").val();
    if (header === undefined) {
        header = 1;
    }
    sheetsCount = 1;

    if (sheetsCount > 0) {
        for (i = 0; i < sheetsCount; i++) {
            if (!(response.ExcelSheets[i].SheetName.match(regx))) {
                $('#sheet-err-txt').text(response.ExcelSheets[i].SheetName + " sheet contains special characters,please rename the sheet and reupload");
                xlfile_path = ''
                $(".radio_head").prop('checked', false);
                $(".radio_dept").prop('checked', false);
                $("#grpupload").show();
                $("#grpback").hide();
                return false;
            }
            else {
                $('#sheet-err-txt').text("");
            }
            var sheetName = response.ExcelSheets[i].SheetName;

            sheetscnt.sheetname = response.ExcelSheets[i].SheetName;
            sheetscnt.columnscount = response.ExcelSheets[i].ColumnsCount;
            sheetsxl.sheetsInfo.push(sheetscnt);
            sheetscnt = {};
            ddlOptions = "";

            if (header == 1) {
                for (var k = 0; k < response.ExcelSheets[i].ColumnsCount; k++) {
                    ddlOptions += "<option value='" + parseInt(k + 1) + "'>" + response.ExcelSheets[i].Header[k].header + "</option>";
                }
            }
            else {
                for (k = 0; k < response.ExcelSheets[i].ColumnsCount; k++) {
                    ddlOptions += "<option value='" + parseInt(k + 1) + "'>Column " + headerletters[k] + "</option>";
                }
            }
            sheetsInfo += '<div class="text-center margin-bottom-15 bold">' + response.ExcelSheets[i].SheetName + ' has ' + response.ExcelSheets[i].ColumnsCount + ' columns </div>'

            $.each(global_ExcelFields, function (key, value) {
                var fields = global_ExcelFields[key];
                sheetsInfo += '<div class="col-sm-4"><label class="txt-grey">' + fields.Label;
                if (fields.Mandatory == "Yes") {
                    sheetsInfo += '<span style="color:red;"> *</span>';
                }
                sheetsInfo += "</label>";
                sheetsInfo += '<select class="field form-control" style="padding:1px" id="ddl_' + fields.Label.replace(/ /g, "_").replace(/'/g, "_").replace(/-/g, "_") + '_' + response.ExcelSheets[i].SheetName.replace(/ /g, "_") + '"><option value="0">Select</option>' + ddlOptions + '</select>';
                sheetsInfo += '</div>';
            });

            options = "";
            $('#xlinfo').html(sheetsInfo);
            $('#grp_select').hide();


            if ($("#tree_4 li .jstree-wholerow").length == 1) {
                $("#radio1").hide()
                $("#radio1").next().hide()
            }
            else {
                $("#radio1").show()
                $("#radio1").next().show()
                $(".radio_dept").prop('checked', false);
            }
        }
    }

}

function creating() {
    $('#sheet-err-txt').text("");
    $('#uploadSucess').html("");
    var header = $("input[name=radiog_head]:checked").val();

    if (header != "1" && header != "2") {
        $('#sheet-err-txt').text("Please select header type");
        return false;
    }

    var sheetname = "", cnt = 0, name = "", mobile = "", finaldata = { "data": [] };
    var semidata = {}, deptfrom = "";

    if (sheetsxl.sheetsInfo.length == 1) {
        for (var x = 0; x < sheetsxl.sheetsInfo.length; x++) {
            sheetname = "", cnt = 0, name = "", mobile = "", group = "";
            semidata = {};
            cnt = sheetsxl.sheetsInfo[x].columnscount;
            sheetname = sheetsxl.sheetsInfo[x].sheetname;
            sheetname = sheetname
            var nameErrorCount = 0;
            var mobileErrorCount = 0;
            var selectedColumns = [];

            $.each(global_ExcelFields, function (key, value) {
                var fields = global_ExcelFields[key];
                selectedColumns.push({ "Label": fields.Label, "Column": $("#ddl_" + fields.Label.replace(/ /g, "_").replace(/'/g, "_").replace(/-/g, "_") + "_" + sheetname.replace(/ /g, "_")).val(), "Mandatory": fields.Mandatory, "Type": fields.FieldType, "MaxChars": fields.MaxChars });
            });


            semidata.sheetname = sheetname;
            semidata.columnscount = cnt;
            semidata.columns = selectedColumns
            finaldata.data.push(semidata);
        }

    }
    var header = $("input[name=radiog_head]:checked").val();
    if (header == "1") {
        header = "Yes";
    } else {
        header = "No";
    }
    //console.log(finaldata);
    //return false;


    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });

    $.ajax({
        url: '/Handlers/Caller.ashx',
        method: 'post',
        dataType: "json",
        data: { type: 6, filePath: '/' + xlfile_path, excelData: JSON.stringify(finaldata), isHeader: header },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                $("#caller-msg").html("<span style='color:green;'>" + res.Message + "</span>");
                $('#sheet-err-txt').text("");
                callersManagement(1);
                setTimeout(function () {
                    $("#caller-msg").html("");
                    $("#addCaller").modal("hide");
                }, 1000);
            } else {
                $("#caller-msg").html("<span style='color:red;'>" + res.Message + "</span>");
                $('#sheet-err-txt').text("");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $('#sheet-err-txt').text("");
            $("#caller-msg").html("");
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else if (jqXHR.status == 406) {
                $("#modalPreviousSession").modal("show");
            } else {
                console.log(errorThrown);
            }
        }
    });
}

function addCallersToGroupsOrLabels(mode,callerIds,id,sourcegroupId)
{
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        url: "Handlers/Caller.ashx",
        type: "GET",
        async: false,
        dataType: "JSON",
        data: {
            type: 5, mode: mode, callerIds: callerIds, id: id, sourcegroupId: sourcegroupId
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                
                //$('.caller').prop('checked', false);
                location.reload();
                
            }
            else {
                alert(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else if (jqXHR.status == 406) {
                $("#modalPreviousSession").modal("show");
            } else {
                console.log(errorThrown);
            }
        }
    });
}
//function ManageCallerGroupsAndLabels(mode, Name,colorCode)
//{
    
    
//    $.ajax({
//        url: "Handlers/Caller.ashx",
//        type: "GET",
//        async: false,
//        dataType: "JSON",
//        data: {
//            type: 4, mode: mode, Name: Name, colorCode: colorCode
//        },
//        success: function (res) {
//            if (res.Success == "True") {
//                if(mode == 1)
//                {
//                    $("#createGroup").modal("hide");
//                    ManageCallerGroupsAndLabels(2, "","");
//                }
//                else if(mode == 2)
//                {
                   
                    
//                    var groupsData = "<li class='callerGroups active' style=font-size:"+curSize+" GroupId=0 ><a >All</a></li>";
//                    var moveGroupsData = "";
//                    for(var i=0;i< res.CallerGroupsDetails.length;i++)
//                    {
//                        groupsData += "<li class='callerGroups' GroupId=" + res.CallerGroupsDetails[i].Id + "><a style=color:" + res.CallerGroupsDetails[i].ColorCode + ">" + res.CallerGroupsDetails[i].Name + "</a></li>"
//                        moveGroupsData += "<li class='moveGroup' GroupId=" + res.CallerGroupsDetails[i].Id +"><a href='#'><i class='icon-users'></i>" + res.CallerGroupsDetails[i].Name + "</a></li>"
//                    }
//                    moveGroupsData += "<li class='createGroup'><a href='#'><i class='icon-plus'></i>Create Group </a></li>";
//                    $("#lstGroups").html(groupsData);
//                    $("#lstMoveGroups").html(moveGroupsData);

//                    var curSize = parseInt($('.callerGroups').css('font-size')) + 2;
//                    $(".callerGroups.active").css('font-size', curSize);
                                    
//                }
//                else if (mode == 3) {
//                    $("#createLabel").modal("hide");
//                    ManageCallerGroupsAndLabels(4, "","");
//                }
//                else if (mode == 4) {
//                    var labelsData = "<li class='callerLabels active' style=font-size:" + curSize + " LabelId = 0><a >All</a></li>";
//                    var moveLabelsData = "";
//                    for (var i = 0; i < res.CallerGroupsDetails.length; i++) {
//                        labelsData += "<li class='callerLabels' LabelId=" + res.CallerGroupsDetails[i].Id + "><a style=color:" + res.CallerGroupsDetails[i].ColorCode + ">" + res.CallerGroupsDetails[i].Name + "</a></li>"
//                        moveLabelsData += "<li class='moveLabel' LabelId=" + res.CallerGroupsDetails[i].Id + "><a href='#'><i class='icon-tag'></i>" + res.CallerGroupsDetails[i].Name + " </a></li>"
//                    }
//                    moveLabelsData += "<li class='createLabel'><a href='#'><i class='icon-plus'></i>Create Label </a></li>";
//                    $("#lstLabels").html(labelsData);
//                    $("#lstMoveLabels").html(moveLabelsData)

//                    var curSize = parseInt($('.callerLabels').css('font-size')) + 2;
//                    $(".callerLabels.active").css('font-size', curSize);

//                }
//            }
//            else {
//                alert(res.Message);
//            }
//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//            if (jqXHR.status == 401) {
//                window.location.href = "/Login.aspx?message=Session expired";
//            } else if (jqXHR.status == 406) {
//                $("#modalPreviousSession").modal("show");
//            } else {
//                console.log(errorThrown);
//            }
//        }
//    });
//}


function ManageCallerGroupsAndLabels(mode, Name, colorCode) {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });

    $.ajax({
        url: "Handlers/Caller.ashx",
        type: "GET",
        async: false,
        dataType: "JSON",
        data: {
            type: 4, mode: mode, Name: Name, colorCode: colorCode
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (mode == 1) {
                    $(".moreOption").hide();
                    $("#createGroup").modal("hide");
                    ManageCallerGroupsAndLabels(2, "", "");
                }
                else if (mode == 2) {

                    $(".moreOption").hide();
                    var groupsData = "<li class='callerGroups active' style=font-size:" + curSize + " GroupId=0  id='Alldata'><a>All</a></li>";
                    var moveGroupsData = "";
                    for (var i = 0; i < res.CallerGroupsDetails.length; i++) {
                        groupsData += "<li ><a class='callerGroups' GroupId='" + res.CallerGroupsDetails[i].Id + "' GroupName='" + res.CallerGroupsDetails[i].Name + "' GroupColor='" + res.CallerGroupsDetails[i].ColorCode + " 'style=color:" + res.CallerGroupsDetails[i].ColorCode + ">" + res.CallerGroupsDetails[i].Name + " </a></li>"
                        moveGroupsData += "<li class='moveGroup' GroupId=" + res.CallerGroupsDetails[i].Id + "><a href='#'><i class='icon-users'></i>" + res.CallerGroupsDetails[i].Name + "</a></li>"
                    }
                    moveGroupsData += "<li class='createGroup'><a href='#'><i class='icon-plus'></i>Create Group </a></li>";
                    $("#lstGroups").html(groupsData);
                    $("#lstMoveGroups").html(moveGroupsData);

                    var curSize = parseInt($('.callerGroups').css('font-size')) + 2;
                    $(".callerGroups.active").css('font-size', curSize);

                }
                else if (mode == 3) {
                    $("#createLabel").modal("hide");
                    ManageCallerGroupsAndLabels(4, "", "");
                }
                else if (mode == 4) {
                    var labelsData = "<li class='callerLabels active' style=font-size:" + curSize + " LabelId = 0 id='Alldata2'><a >All</a></li>";
                    var moveLabelsData = "";
                    for (var i = 0; i < res.CallerGroupsDetails.length; i++) {
                        labelsData += "<li ><a class='callerLabels' LabelId='" + res.CallerGroupsDetails[i].Id + "' LabelName='" + res.CallerGroupsDetails[i].Name + "' LabelColor='" + res.CallerGroupsDetails[i].ColorCode + "'  style=color:" + res.CallerGroupsDetails[i].ColorCode + ">" + res.CallerGroupsDetails[i].Name + "</a> <a class='pull-right labelDelete' style='margin-top:-27px' LabelId=" + res.CallerGroupsDetails[i].Id + "></i></a></li>"
                        moveLabelsData += "<li class='moveLabel' LabelId=" + res.CallerGroupsDetails[i].Id + "><a href='#'><i class='icon-tag'></i>" + res.CallerGroupsDetails[i].Name + " </a></li>"
                    }
                    moveLabelsData += "<li class='createLabel'><a href='#'><i class='icon-plus'></i>Create Label </a></li>";
                    $("#lstLabels").html(labelsData);
                    $("#lstMoveLabels").html(moveLabelsData)

                    var curSize = parseInt($('.callerLabels').css('font-size')) + 2;
                    $(".callerLabels.active").css('font-size', curSize);

                }
            }
            else {
                alert(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else if (jqXHR.status == 406) {
                $("#modalPreviousSession").modal("show");
            } else {
                console.log(errorThrown);
            }
        }
    });
}
function callersManagement(mode)
{
   
   
    searchText = $("#txtSearch").val();
    var callersData = "";
    var tableHeadData = "";

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });

   
    $.ajax({
        url: "Handlers/Caller.ashx",
        type: "GET",
        async: true,
        dataType: "JSON",
        data: {
            type: 3, mode: mode, searchText: searchText, groupId: groupId, labelId: labelId, PageLength: global_pageLength,PageIndex:global_pageIndex
        },
        success: function (res) {
            $.unblockUI();
         
            
            if (res.Success == "True") {
               
                    tableHeadData += "<thead><tr><th><input type='checkbox' id='selectall_chk1'></i></th>";
                    //<input type="checkbox" name="vehicle" value="Car" checked>
                    tableHeadData += "<th>Name</th><th>Mobile</th><th>Email</th><th>Alternate Numbers</th>";
                    global_CallerDetails = [], global_ExcelFields = [];
                    global_ExcelFields.push({ "Label": "Name", "Mandatory": "Yes", "FieldType": "AlphaNumeric", "MaxChars": "50" });
                    global_ExcelFields.push({ "Label": "Mobile", "Mandatory": "Yes", "FieldType": "Numeric", "MaxChars": "12" });
                    global_ExcelFields.push({ "Label": "Email", "Mandatory": "No", "FieldType": "AlphaNumeric", "MaxChars": "150" });

                    if (res.SettingsData != "") {
                        var settingsArray = JSON.parse(res.SettingsData);
                        global_CallerDetails = settingsArray;
                        $.each(global_CallerDetails, function (key, value) {
                            var attributesObj = settingsArray[key];
                            if (attributesObj.FieldType.toLowerCase() == "textbox") {
                                $.each(value, function (subkey, subvalue) {
                                    if (subkey == "FieldName") {
                                        global_ExcelFields.push({ "Label": subvalue, "Mandatory": attributesObj.Mandatory, "FieldType": attributesObj.PlaceHolder, "MaxChars": attributesObj.MaxChars });
                                    }
                                });
                            }
                        });
                        //global_ExcelFields.push({ "Label": "PAN Card", "Mandatory": "No", "FieldType": "AlphaNumeric", "MaxChars": "30" });
                        //global_ExcelFields.push({ "Label": "Aadhaar Card", "Mandatory": "Yes", "FieldType": "AlphaNumeric", "MaxChars": "30" });
                        console.log(JSON.stringify(global_ExcelFields));
                    }

                    var editCallerDetailsData = "<div class='row metaData f_13'><label class='text-danger text-center col-sm-12' id='lblEditErrorMsg'></label>"
                    editCallerDetailsData += "<div class='col-sm-6'><div class='form-group'><label class='txt-grey'>Name<span class='text-danger'>*</span></label><input Key='Name' id='txtCallerName' class='form-control txtRequired field ' value = ''  maxlength='20'/></div></div>"
                    editCallerDetailsData += "<div class='col-sm-6'><div class='form-group'><label class='txt-grey'>Mobile<span class='text-danger'>*</span></label><input Key='Mobile' id='txtCallerMobile' class='form-control txtRequired field' value = '' /></div></div>"
                    editCallerDetailsData += "<div class='col-sm-6'><div class='form-group'><label class='txt-grey'>Email</label><input Key='Email' id='txtCallerEmail' class='form-control field' value = '' maxlength='65' /></div></div>"

                    if (res.SettingsData != "") {
                        $.each(settingsArray, function (key, value) {
                            tableHeadData += "<th>" + value.FieldName + "</th>";

                            var callerAttributesObj = settingsArray[key];

                            editCallerDetailsData += "<div class='col-sm-6'><div class='form-group'><label class='txt-grey'>" + value.FieldName;
                            if (callerAttributesObj.Mandatory == "Yes") {
                                editCallerDetailsData += "<span class='text-danger'>*</span>";
                            }
                            editCallerDetailsData += "</label>"
                            if (callerAttributesObj.FieldType == "TextBox") {
                                editCallerDetailsData += "<input type='text' FieldType='" + callerAttributesObj.FieldType + "' Key='" + callerAttributesObj.FieldName + "' maxlength='" + callerAttributesObj.MaxChars + "' class='field form-control " + callerAttributesObj.PlaceHolder;
                                if (callerAttributesObj.Mandatory == "Yes") {
                                    editCallerDetailsData += " txtRequired "
                                }
                                if (callerAttributesObj.AllowSpecialChars == "No") {
                                    editCallerDetailsData += " NoSpecialChars"
                                }
                                editCallerDetailsData += "' />"
                            }
                            if (callerAttributesObj.FieldType == "DropDown") {
                                editCallerDetailsData += "<select FieldType='" + callerAttributesObj.FieldType + "' Key='" + callerAttributesObj.FieldName + "' id='ddl" + callerAttributesObj.FieldName + "' class='field form-control";

                                if (callerAttributesObj.Mandatory == "Yes") {
                                    editCallerDetailsData += " ddlRequiredField"
                                }
                                editCallerDetailsData += "'>";
                                editCallerDetailsData += "<option value='Select'> Select </option>"
                                var ddlOptions = callerAttributesObj.Options.split(",");
                                $.each(ddlOptions, function (k, v) {
                                    editCallerDetailsData += "<option value='" + v + "'>" + v + "</option>";
                                });
                                editCallerDetailsData += "</select>"
                            }

                            if (callerAttributesObj.FieldType == "TextArea") {
                                editCallerDetailsData += "<textarea row='4' cols='20' FieldType='" + callerAttributesObj.FieldType + "' key='" + callerAttributesObj.FieldName + "' maxlength='" + callerAttributesObj.MaxChars + "'  class='" + callerAttributesObj.PlaceHolder;
                                if (callerAttributesObj.Mandatory == "Yes") {
                                    editCallerDetailsData += " txtRequired "
                                }
                                editCallerDetailsData += " form-control field' ></textarea>"
                            }


                            editCallerDetailsData += "</div></div>"
                        });
                    }
                    tableHeadData += "</tr></thead>";
                    editCallerDetailsData += "</div>";
                    $("#tblAddCallerDetails").html(editCallerDetailsData);
                    if (res.Total > 0) {
                        $("#page-selection").show();
                        $("#recordscount").show();
                        pagination(res.Total, global_pageLength)
                        for (var i = 0; i < res.CallerDetails.length; i++) {
                            var labelsData = "";
                            if (res.CallerDetails[i].Labels != "") {
                                var labels = [], labelColorCodes = [];

                                labels = res.CallerDetails[i].Labels.split(",");
                                labelColorCodes = res.CallerDetails[i].LabelColorCode.split(",");
                                $.each(labels, function (k, v) {
                                    labelsData += "<label style='color:#fff;background-color:" + labelColorCodes[k] + "' class='label label-sm margin-right-5'>" + v + "</label>";
                                });
                            }



                            callersData += "<tr><td><input class='caller' CallerNumber = " + res.CallerDetails[i].Mobile + " CallerId = " + res.CallerDetails[i].Id + " type='checkbox'></td>";
                            //if (roleId == "1") {
                                callersData += "<td><span><a class='callerDetails margin-right-5' href='/CallerDetails.aspx?CallerNumber=" + res.CallerDetails[i].Mobile + "'  CallerId = " + res.CallerDetails[i].Id + " >" + res.CallerDetails[i].Name + "</a> " + labelsData + "</span><button type='button' class='btn btn-xs btn-success f_11 btn-outbound-call pull-right' caller-id='" + res.CallerDetails[i].Id + "' caller-mobile='" + res.CallerDetails[i].Mobile + "' cbr-id='0'><i class='fa fa-phone margin-right-5'></i>Call</button><img src='/assets/img/ajax-loader.gif' style='display:none;width: 20px;height:20px;margin-left:12px;' class='loader-gif pull-right' caller-id='" + res.CallerDetails[i].Id + "' /></td>";
                            //}
                            //else {
                            //    callersData += "<td><a class='callerDetails margin-right-5' href='/CallerDetails.aspx?CallerNumber=" + res.CallerDetails[i].Mobile + "'  CallerId = " + res.CallerDetails[i].Id + " >" + res.CallerDetails[i].Name + "</a> " + labelsData + "</td>";
                            //}

                            callersData += "<td>" + res.CallerDetails[i].Mobile + "</td>";
                            callersData += "<td>" + res.CallerDetails[i].Email + "</td>";
                           
                            if (res.CallerDetails[i].AlternateMobile != "") {
                                var numbers = []
                                callersData += "<td>"
                                numbers = res.CallerDetails[i].AlternateMobile.split(",");

                                $.each(numbers, function (k, v) {
                                    callersData += v + "</br>";
                                });
                                callersData = callersData.slice(0, -5);
                            }
                            else {
                                callersData += "<td>-</td>";
                            }
                           
                            if (res.CallerDetails[i].MetaData == "") {
                                $.each(settingsArray, function (index, value) {
                                    callersData += "<td></td>";
                                });
                            }
                            else {
                                var callerDataObj = JSON.parse(res.CallerDetails[i].MetaData);
                                var fieldValue = "";
                                $.each(settingsArray, function (key, value) {
                                    var isValue = false;
                                    $.each(callerDataObj, function (k, v) {
                                        if (value.FieldName == k) {
                                            isValue = true;
                                            callersData += "<td>" + v + "</td>";
                                        }
                                    });
                                    if (!isValue) {
                                        callersData += "<td></td>";
                                    }

                                })

                            }
                            callersData += "</tr>";
                        }

                    }
                    $("#callersDetails").html(tableHeadData + callersData);
                    if (res.IsInCall.toString().toLowerCase() == "true") {
                        $(".btn-outbound-call").attr("disabled", true);
                    }
                 if (res.Total == 0) {
                     $("#page-selection").hide();
                     $("#recordscount").hide();
                   }
                 if (res.Total >= global_pageLength) {
                     var fromnumber = (global_pageIndex > 1 ? ((global_pageIndex - 1) * global_pageLength) + 1 : 1);
                     var tonumber = (global_pageIndex * global_pageLength >= res.Total ? res.Total : global_pageIndex * global_pageLength);

                     var total = res.Total;
                     $("#fromnumber").html(fromnumber);
                     $("#tonumber").html(tonumber);
                     $("#totalnumber").html(total);

                 }
                 else {
                     $("#fromnumber").html("1");
                     $("#tonumber").html(res.Total);
                     $("#totalnumber").html(res.Total);

                 }
               
            }
            else {
                alert(res.Message);

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else if (jqXHR.status == 406) {
                $("#modalPreviousSession").modal("show");
            } else {
                console.log(errorThrown);
            }
        }
    });
}




function isEmail(email) {
   // var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var regex = /^([\w\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return regex.test(email);
}

function CreateCaller(callerDetails, fromNumber, callerName, callerMobile, callerEmail, Caller_Id) {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });

    $.ajax({
        url: "Handlers/Caller.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, DetailsObj: callerDetails, Mode: 3, FromNumber: fromNumber, CallerName: callerName, CallerMobile: callerMobile, CallerEmail: callerEmail, Caller_Id: Caller_Id
        },
        success: function (res) {
            $.unblockUI();

            if (res.Success == "True") {
                $("#addCaller").modal("hide");
                callersManagement(1);
            }
            else {
                alert(res.Message);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else if (jqXHR.status == 406) {
                $("#modalPreviousSession").modal("show");
            } else {
                console.log(errorThrown);
            }
        }
    });
};
function createUUID() {
    var s = []; var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++)
    { s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1); }
    s[14] = "4";
    // bits 12-15 of the time_hi_and_version field to 0010 
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    // bits 6-7 of the clock_seq_hi_and_reserved to 01 
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}
function AgentsManagement(mode) {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "POST",
        url: "Handlers/Agents.ashx",
        dataType: "JSON",
        async: false,
        data: {
            type: 8, Mode: mode, AgentId: agentId
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.AgentInformation.length > 0) {
                    communicationTypeId = res.AgentInformation[0].CommunicationTypeId;
                }
            } else {
                alert(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else if (jqXHR.status == 406) {
                $("#modalPreviousSession").modal("show");
            } else {
                console.log(errorThrown);
            }
        }
    });
}

function EditLableAndGroups(mode, Name, colorCode, LableId, GroupId)
{
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
    url: "Handlers/Caller.ashx",
    type: "GET",
    async: false,
    dataType: "JSON",
    data: {
        type: 10, mode: mode, Name: Name, colorCode: colorCode, LabelId: LableId, groupId: GroupId
    },
    success: function (res) {
        $.unblockUI();
        if (res.Success == "True")
        {
            groupid = 0;
            labelId = 0;
            $("#createLabel").modal("hide");
            $("#createGroup").modal("hide");
            alert(res.Message);
            isEdit = 0;
           
            ManageCallerGroupsAndLabels(2, "", "");
            ManageCallerGroupsAndLabels(4, "", "");
            $(".moreOption").hide();
            $(".raiseOffTick").show();
            callersManagement(1);
        }
        
        else {
            alert(res.Message);
        }
        },
    error: function (jqXHR, textStatus, errorThrown) {
        $.unblockUI();
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else if (jqXHR.status == 406) {
                $("#modalPreviousSession").modal("show");
            } else {
                console.log(errorThrown);
            }
        }
    });
}
function pagination(rowCount, global_pageLength) {
    $('#page-selection').bootpag({
        total: Math.ceil(rowCount / global_pageLength),
        next: "Next",
        prev: "Prev",
        maxVisible: 8
    }).on("page", function (event, num) {
        if (global_pageIndex != num) {
            global_pageIndex = num;
            callersManagement(1);

        }
    });
    if (global_pageIndex == "1") {
        $(".pagination").find("li").removeClass('active');
        $(".pagination").find("li[data-lp='1']").addClass('active');
    }
}