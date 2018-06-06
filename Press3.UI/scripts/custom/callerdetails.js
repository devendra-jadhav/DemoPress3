var callerNumber = $("#hdnCallerNumber").val();
var callerName = "";
var details = "";
var isAutoSubject = $("#hdnIsAutoSubject").val();
var isAlsagr = $("#hdnIsAlsagr").val();
var callId = $("#hdnCallId").val();
var flagpopup = $("#hdnFlagpopup").val();
var ticketId = 0, ticketStatus = "", ticketPriority = "", callerId = 0;
var callerEmail = "";

$(document).ready(function () {

    $('.dropdown-toggle').dropdown();

    $('.dropdown-submenu a.test').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });
    $('#txtName').keypress(function (e) {
        if (e.keyCode == 13) {  
            return false;
        }
    });

    $('#txtEmail').keypress(function (e) {
        if (e.keyCode == 13) {
            return false;
        }
    });

   

    $("#txtDueDate").datepicker({
        startDate: new Date()
    });

    GetCallerInformation(callerNumber);
    GetCallHistory(callerNumber, 100, 1, 0);
    GetCallerTicketHistory();
    GetTicketCategries(5, 0, "");

    if (flagpopup == 1)
    {
        ShowPopUpOfflineTicket();
    }

    $("#editCaller").click(function () {
        $("#viewCallerDetails").hide();
        $("#editCallerDetails").show();
    });
    $("#cancelUpdate").click(function () {
        $("#viewCallerDetails").show();
        $("#editCallerDetails").hide();
        GetCallerInformation(callerNumber);
    });
    $(document).on("input", ".Numeric", function () {
        this.value = this.value.replace(/[^\d\.\-]/g, '');
    });
    $(document).on("input", ".Alphabets", function () {
        this.value = this.value.replace(/[^a-zA-Z]/g,'');
    });
    $(document).on("input", ".AlphaNumerics", function () {
        this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
    });

    $("#btnOfflineTicket").click(function () {
        $(".selectedCategory").attr("categoryId", "0");
        $(".selectedCategory").text("Select");
        ShowPopUpOfflineTicket();
    });

    function ShowPopUpOfflineTicket()
    {
        $("#divCategories").each(function () {
            $(this).find(".subCategories").remove();
        });
        $("#ddlRootCategories,#ddlPriority").val("-1");
        $("#txtDueDate").val("");
        $("#txtSubject").val("");
        $("#txtDescription").val("");
        if (callerId == "" || callerId == "0" || callerId == 0) {
            alert("Please update customer details");
            return false;
        } else {
            $("#tokenCreate").modal("show");
        }

    }

    //$(document).on("change", ".categories", function () {
    //    $(this).parent().nextAll().remove();
    //    var parentId = $(this).find("option:selected").val();
    //    var parentCategory = $(this).find("option:selected").text();
    //    GetTicketCategries(5, parentId, parentCategory);
    //});

 
    $("#btnCreateTicket").click(function () {

        if ($(".selectedCategory").attr("categoryId") == "0") {
            alert("Category  Is Mandatory");
            return false;
        }
        var ticketvalidationResult = true
        $(".ddlRequired").each(function () {
            if ($(this).val() == "-1") {
                alert($(this).prev().html() + " Is Mandatory");
                ticketvalidationResult = false;
                return false;
            }
        });
        if (ticketvalidationResult == false) {
            return false;
        }
        $(".required").each(function () {
            if (isAutoSubject == "1") {
                if ($(this).attr("id") != "txtSubject") {
                    if ($.trim($(this).val()) == "") {
                        alert($(this).prev().html() + " Is Mandatory");
                        ticketvalidationResult = false;
                        return false;
                    }
                }
            } else {
                if ($.trim($(this).val()) == "") {
                    alert($(this).prev().html() + " Is Mandatory");
                    ticketvalidationResult = false;
                    return false;
                }
            }
        });
        if (ticketvalidationResult == false) {
            return false;
        }
        var categoryId = 0;
        var priorityid = 0;
        var dueDate = "";
        var description = "";
        var topic = "";

        //categoryId = $(".categories").last().val();
        categoryId = $(".selectedCategory").attr("categoryId");
        priorityid = $("#ddlPriority").val();
        dueDate = $("#txtDueDate").val();
        description = $("#txtDescription").val();


        if (isAlsagr == "0") {
            topic = $("#txtSubject").val();
            topic = topic.trim();
            if (topic == "") {
                alert("subject is mandatory");
                ticketvalidationResult = false;
                return false;
            }
        }


        if (isAutoSubject == "1") {
            if (topic == "") {
                var dt = new Date();
                topic = dt.getDate() + '/' + (dt.getMonth() + 1) + '/' + dt.getFullYear() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
            }
        }

        var date_regex = /^\d{2}\/\d{2}\/\d{4}$/;
        var validdate = date_regex.test(dueDate);
        if (validdate == false) {
            alert("Select date properly..!!")
            return false;
        }

        if (callerId == "" || callerId == "0" || callerId == 0) {
            alert("Please update customer details");
            return false;
        } else {
            TokenManagement(1, categoryId, priorityid, dueDate, description, topic, callerId, callId);
          //  GetCallerTicketHistory();
           // alert("Success...!!");
        }

    });


    $("#editBasicDetails").click(function () {
        $(this).hide();
        $("#viewOptions").show();
        $("#viewCallerBasicDetails").hide();
        $("#editCallerBasicDetails").show();
    });
    $("#cancelBasicDetails").click(function () {
        $("#viewOptions").hide();
        $("#editBasicDetails").show();
        $("#viewCallerBasicDetails").show();
        $("#editCallerBasicDetails").hide();
        GetCallerInformation(callerNumber);
    });
    $(document).on("input", "#txtMobile", function () {
        this.value = this.value.replace(/[^\d\.\-]/g, '');
    });
    $("#updateCallerDetails").click(function () {
        var name = $("#txtName").val();
        if (name == "")
        {
            alert("please enter name");
            return false;
        }
        var email = $("#txtEmail").val();
        if (email != "") {
            var emailResult = isEmail(email);

            if (!emailResult) {
                alert("Please enter valid emailid");
                return false;
            }
        }
        UpdateCallerInformation(details, callerNumber, name, callerNumber, email);
    });
    $("#updateBasicDetails").click(function () {
        var detailsObj = {};
        $("#lblEditErrorMsg").html("");
        var isValid = 1;
        $("#editCallerBasicDetails .txtRequired").each(function (index) {
            if ($(this).val() == "") {
                $("#lblEditErrorMsg").html($(this).attr("key") + " is Mandatory")
                isValid = 0;
                return false;
            }
        });
        $("#editCallerBasicDetails .ddlRequiredField").each(function (index) {
            if ($(this).val() == "Select") {
                $("#lblEditErrorMsg").html("Please select " + $(this).attr("key"))
                isValid = 0;
                return false;
            }
        });
        if (isValid == 0) {
            return false;
        }
        $("#editCallerBasicDetails .field").each(function (index) {
            var fieldType = $(this).attr("FieldType");
            var Key = $(this).attr("key");
            var value = $(this).val();
            detailsObj[Key] = value;
        });
        var details = JSON.stringify(detailsObj);
        UpdateCallerInformation(details, callerNumber, callerName, callerNumber, callerEmail);
    });
    $(document).on("click", ".ticketDetails", function () {
        var ticket = $(this).attr("TicketId");
        if (ticket == "0" || ticket == "undefined") {
            alert("failed");
            return false;
        }
        GetTicketDetails(ticket);
        $(".ticketTab").trigger("click");

    });
    $("#cancelViewToken").click(function () {
        $(".token_view").hide();
        $("#viewToken").html("");
        $("#callerTokenHistory").show();
        //if ($("#btnCallHistory").hasClass("tab-btn-select")) {
        //    $("#callHistory").show();
        //}
        //else {
        //    $("#tokens").show();
        //}

        //$("#callsPanel").show();
        GetCallerTicketHistory();
    });
    $("#updateViewToken").click(function () {
        var replyDescription = "";
        replyDescription = $("#tokenCalllog").val();
        if (replyDescription == "") {
            alert("Please enter call description");
            return false;
        }
        addReplyToTicket($(this).attr("TicketId"), $("#ddlTokenStatus").val(), $("#ddlTokenPriority").val(), replyDescription)
    });

});

$(document).delegate(".BacktoTicketHistory", "click", function () {
    $("#cancelViewToken").trigger("click");

});

$(document).delegate(".categoryValue", "click", function () {
    $(".selectedCategory").text("");
    $(".selectedCategory").attr("categoryId", $(this).attr("categoryId"));
    $(".selectedCategory").text($(this).attr("category"));

});
function GetTicketCategries(mode, parentId, parentCategory) {
    debugger;
    $.ajax({
        type: "GET",
        url: "Handlers/Tickets.ashx",
        dataType: "JSON",
        async: false,
        data: {
            type: 1, Mode: mode, Category: "", ParentId: parentId, ColorCode: ""
        },
        success: function (res) {
            var categoriesOptions = "";
            var ticketPriorities = "";
            var ticketStatuses = "";
            //var ticketPriorities = "<option value='-1'>Select</option>";
            if (res.Success == "True") {
                if (res.TicketCategoryNodes.length > 0) {
                    //if (parentId == 0) {
                    //    categoriesOptions += "<option value='-1'>Select</option>"
                    //    for (var i = 0; i < res.TicketCategoryNodes.length; i++) {
                    //        categoriesOptions += "<option value=" + res.TicketCategoryNodes[i].Id + ">" + res.TicketCategoryNodes[i].Category + "</option>";
                    //    }
                    //    $("#ddlRootCategories").html(categoriesOptions);

                    //}
                    //else {
                    //    categoriesOptions += "<div class='form-group subCategories'><label class='label-head'>" + parentCategory + " Sub-Category</label>";
                    //    categoriesOptions += "<select class='form-control ddlRequired'><option value='-1'>Select</option>";
                    //    for (var i = 0; i < res.TicketCategoryNodes.length; i++) {
                    //        categoriesOptions += "<option value=" + res.TicketCategoryNodes[i].Id + ">" + res.TicketCategoryNodes[i].Category + "</option>";
                    //    }
                    //    categoriesOptions += "</select></div>";
                    //    $("#divCategories").append(categoriesOptions);
                    //}


                    for (var i = 0; i < res.TicketCategoryNodes.length; i++) {
                        if (res.TicketCategoryNodes[i].Level == 1 && res.TicketCategoryNodes[i].childId == 0) {
                            categoriesOptions += "<li><a class='categoryValue' categoryId = '" + res.TicketCategoryNodes[i].Id + "' category='" + res.TicketCategoryNodes[i].Category + "'>" + res.TicketCategoryNodes[i].Category + "</a></li>";
                        } else if (res.TicketCategoryNodes[i].Level == 1 && res.TicketCategoryNodes[i].childId != 0) {
                            categoriesOptions += "<li class='dropdown-submenu'>";
                            categoriesOptions += "<a class='test categoryValue' categoryId = '" + res.TicketCategoryNodes[i].Id + "' category='" + res.TicketCategoryNodes[i].Category + "' >" + res.TicketCategoryNodes[i].Category + "</a>";
                            categoriesOptions += "<ul class='dropdown-menu' parentId = '" + res.TicketCategoryNodes[i].Id + "'>";
                            parentId = 0;
                            parentId = res.TicketCategoryNodes[i].Id;
                            for (var j = 0; j < res.TicketCategoryNodes.length; j++) {
                                if (res.TicketCategoryNodes[j].ParentId == parentId && res.TicketCategoryNodes[j].Level == 2 && res.TicketCategoryNodes[j].childId == 0) {
                                    categoriesOptions += "<li> <a class='categoryValue' categoryId = '" + res.TicketCategoryNodes[j].Id + "' category='" + res.TicketCategoryNodes[j].Category + "'>" + res.TicketCategoryNodes[j].Category + "</a></li>";
                                } else if (res.TicketCategoryNodes[j].ParentId == parentId && res.TicketCategoryNodes[j].Level == 2 && res.TicketCategoryNodes[j].childId != 0) {
                                    categoriesOptions += "<li class='dropdown-submenu'>";
                                    categoriesOptions += "<a class='test categoryValue' categoryId = '" + res.TicketCategoryNodes[j].Id + "' category='" + res.TicketCategoryNodes[j].Category + "' >" + res.TicketCategoryNodes[j].Category + "</a>";
                                    categoriesOptions += "<ul class='dropdown-menu' parentId = '" + res.TicketCategoryNodes[j].Id + "'>";
                                    for (var k = 0; k < res.TicketCategoryNodes.length; k++) {
                                        if (res.TicketCategoryNodes[k].ParentId == res.TicketCategoryNodes[j].Id && res.TicketCategoryNodes[k].Level == 3 && res.TicketCategoryNodes[k].childId == 0) {
                                            categoriesOptions += "<li> <a class='categoryValue' categoryId = '" + res.TicketCategoryNodes[k].Id + "' category='" + res.TicketCategoryNodes[k].Category + "'>" + res.TicketCategoryNodes[k].Category + "</a></li>";
                                        } else if (res.TicketCategoryNodes[k].ParentId == res.TicketCategoryNodes[j].Id && res.TicketCategoryNodes[k].Level == 3 && res.TicketCategoryNodes[k].childId != 0) {
                                            categoriesOptions += "<li class='dropdown-submenu'>";
                                            categoriesOptions += "<a class='test categoryValue' categoryId = '" + res.TicketCategoryNodes[k].Id + "' category='" + res.TicketCategoryNodes[k].Category + "' >" + res.TicketCategoryNodes[k].Category + "</a>";
                                            categoriesOptions += "<ul class='dropdown-menu' parentId = '" + res.TicketCategoryNodes[k].Id + "'>";
                                            for (var m = 0; m < res.TicketCategoryNodes.length; m++) {
                                                if (res.TicketCategoryNodes[m].ParentId == res.TicketCategoryNodes[k].Id && res.TicketCategoryNodes[m].Level == 4 && res.TicketCategoryNodes[m].childId == 0) {
                                                    categoriesOptions += "<li> <a class='categoryValue' categoryId = '" + res.TicketCategoryNodes[m].Id + "' category='" + res.TicketCategoryNodes[m].Category + "'>" + res.TicketCategoryNodes[m].Category + "</a></li>";
                                                } else if (res.TicketCategoryNodes[m].ParentId == res.TicketCategoryNodes[k].Id && res.TicketCategoryNodes[m].Level == 4 && res.TicketCategoryNodes[m].childId != 0) {
                                                    categoriesOptions += "<li class='dropdown-submenu'>";
                                                    categoriesOptions += "<a class='test categoryValue' categoryId = '" + res.TicketCategoryNodes[m].Id + "' category='" + res.TicketCategoryNodes[m].Category + "' >" + res.TicketCategoryNodes[m].Category + "</a>";
                                                    categoriesOptions += "<ul class='dropdown-menu' parentId = '" + res.TicketCategoryNodes[m].Id + "'>";
                                                    for (var z = 0 ; z < res.TicketCategoryNodes.length; z++) {
                                                        if (res.TicketCategoryNodes[z].ParentId == res.TicketCategoryNodes[m].Id && res.TicketCategoryNodes[z].Level == 5) {
                                                            categoriesOptions += "<li> <a class='categoryValue' categoryId = '" + res.TicketCategoryNodes[z].Id + "' category='" + res.TicketCategoryNodes[z].Category + "'>" + res.TicketCategoryNodes[z].Category + "</a></li>";
                                                        }
                                                    }
                                                    categoriesOptions += "</ul>";
                                                    categoriesOptions += "</li>";
                                                }
                                            }
                                            categoriesOptions += "</ul>";
                                            categoriesOptions += "</li>";
                                        }
                                    }
                                    categoriesOptions += "</ul>";
                                    categoriesOptions += "</li>";
                                }
                            }
                            categoriesOptions += "</ul>";
                            categoriesOptions += "</li>";
                        }

                    }
                    $("#ddlRootCategories").html(categoriesOptions);

                }

                if (res.TicketPriorities.length > 0) {
                    for (var i = 0 ; i < res.TicketPriorities.length ; i++) {
                        ticketPriorities += "<option value=" + res.TicketPriorities[i].Id + ">" + res.TicketPriorities[i].Priority + "</option>"
                    }
                    $("#ddlPriorities,#ddlTokenPriority").html(ticketPriorities);
                    $("#ddlPriority").html("<option value='-1'>Select</option>" + ticketPriorities);

                }
                if (res.TicketStatus.length > 0) {
                    for (var i = 0 ; i < res.TicketStatus.length ; i++) {
                        ticketStatuses += "<option value=" + res.TicketStatus[i].Id + ">" + res.TicketStatus[i].Status + "</option>"
                    }
                    $("#ddlTicketStatus,#ddlTokenStatus").html(ticketStatuses);
                    $("#ddlTicketStatus").val("1");
                }

            }
            else {
                alert(res.Message);
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
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


function TokenManagement(mode, categoryId, priorityId, dueDate, description, topic, customerId, callId) {
    $.ajax({
        url: "Handlers/Tickets.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, Mode: mode, CategoryId: categoryId, PriorityId: priorityId, DueDate: dueDate, Description: description,
            Topic: topic, CustomerId: customerId, CallId: callId, IsOffline: 1
        },
        success: function (res) {
            console.log(res);
            if (res.Success == "True") {
                isRaiseTicket = true;
                $("#ticketSuccessMsg").html("Ticket raised successfully");
                setTimeout(function () {
                    $("#tokenCreate").modal("hide");
                    $("#ticketSuccessMsg").html("");
                }, 2500);
            }
            else {
                alert(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
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


function addReplyToTicket(ticketId, status, priority, description) {
    $.ajax({
        url: "Handlers/Tickets.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, ticketId: ticketId, StatusId: status, PriorityId: priority, Description: description, Mode: 2
        },
        success: function (res) {
            if (res.Success == "True") {
                isRaiseTicket = true;
                $("#tokenCalllog").val("");
                // $("#cancelViewToken").click();
                GetTicketDetails(ticketId)

            }
            else {
                alert(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function GetTicketDetails(ticket) {
    var ticketDetails = "";
    $.ajax({
        url: "Handlers/Tickets.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 9, ticketId: ticket
        },
        success: function (res) {
            if (res.Success == "True") {
                $("#tokens").hide();
                $("#callHistory").hide();

                if (res.TicketDetails.length > 0) {
                    ticketDetails += "<div class='row'><div class='col-sm-4'><h4 class='text-uppercase font-yellow-gold bold-6 margin-top-5'>ticket - ";
                    if (res.TicketDetails[0].Number == "") {
                        ticketDetails += ticket;

                    } else {
                        ticketDetails += res.TicketDetails[0].Number;

                    }

                    ticketDetails += " <label class='BacktoTicketHistory margin-left-15 font-grey-gallery pointer'> <i class='fa fa-reply'></i> </label></h4></div>";
                    for (var i = 0; i < res.TicketDetails.length; i++) {
                        if (res.TicketDetails[i].TicketHistoryId == 0) {
                            if (res.TicketDetails[i].Categories != "") {
                                ticketDetails += "<div class='col-sm-8 text-right'>";
                                var catArray = res.TicketDetails[i].Categories.split(",");
                                var catColorsArray = res.TicketDetails[i].CategoryColorCodes.split(",");
                                for (var j = 0; j < catArray.length; j++) {
                                    if (catArray[j] != "") {
                                        if (catColorsArray[j] == "ebf1f6") { resHtml += "<label class='label_round_blue f_11 margin-right-10' style='background-color:" + catColorsArray[j] + ";font-size:12px !important;'>" + catArray[j] + "</label>"; }
                                        else { ticketDetails += "<label class='label_round_blue f_11 margin-right-10' style='background-color:" + catColorsArray[j] + ";color:white;font-size:12px !important;'>" + catArray[j] + "</label>"; }
                                    }
                                }
                                ticketDetails += "</div>";
                            }
                        }
                    }
                    ticketDetails += "</div>";
                    //ticketDetails += "<div class='col-sm-8 text-right'><label class='label_round_blue f_11 margin-right-10'>Complaint</label><label class='label_round_blue f_11 margin-right-10'>Press3</label></div></div>";
                    ticketDetails += "<ul class='token_his'>";
                    //for (var i = 0; i < res.TicketDetails.length; i++) {
                    //    ticketDetails += "<li><div><label><span style='color:#fff;background-color:" + res.TicketDetails[i].StatusColorCode + "' class='label margin-right-5'>" + res.TicketDetails[i].Status;
                    //    ticketDetails += "</span>on <span class='f_12 margin-right-5 brd' style='color:#fff;padding:1px 5px;background-color:" + res.TicketDetails[i].PriorityColorCode + "'>" + res.TicketDetails[i].Priority + " </span>  priority by <strong>" + res.TicketDetails[i].AgentName + "</strong>";
                    //    ticketDetails += " on " + res.TicketDetails[i].CreatedTime + "</label>";
                    //    ticketDetails += "<label class='margin-left-30 f_12 bold-6'>Inbound Call - " + res.TicketDetails[i].CreatedTime + "</label></div>";
                    //    ticketDetails += "<p> " + res.TicketDetails[i].Body + "</p></li>";
                    //}

                    for (var i = 0; i < res.TicketDetails.length; i++) {
                        ticketDetails += "<li><div><label>";
                        //<span style='color:#fff;background-color:" + res.TicketDetails[i].StatusColorCode + "' class='label margin-right-5'>";
                        if (res.TicketDetails[i].TicketHistoryId == "0" && res.TicketDetails[i].IsConv == "1") {
                            ticketDetails += "<span style='color:#fff;background-color:" + res.TicketDetails[i].OpenColorCode + "' class='label margin-right-5'>Opened";
                        } else if (res.TicketDetails[i].Status.toLowerCase() == "close" && res.TicketDetails[i].IsConv == "1" && res.TicketDetails[i].TicketHistoryId == "1") {
                            ticketDetails += "<span style='color:#fff;background-color:" + res.TicketDetails[i].OpenColorCode + "' class='label margin-right-5'>Opened";
                        } else if (res.TicketDetails[i].Status.toLowerCase() == "close" && res.TicketDetails[i].IsConv == "0") {
                            ticketDetails += "<span style='color:#fff;background-color:" + res.TicketDetails[i].StatusColorCode + "' class='label margin-right-5'>Closed";
                        } else if (res.TicketDetails[i].Status.toLowerCase() == "open") {
                            ticketDetails += "<span style='color:#fff;background-color:" + res.TicketDetails[i].StatusColorCode + "' class='label margin-right-5'>Opened";
                        } else if (res.TicketDetails[i].Status.toLowerCase() == "work in progress") {
                            ticketDetails += "<span style='color:#fff;background-color:" + res.TicketDetails[i].StatusColorCode + "' class='label margin-right-5'>Work In Progress";
                        } else {
                            ticketDetails += "<span style='color:#fff;background-color:" + res.TicketDetails[i].StatusColorCode + "' class='label margin-right-5'>" + res.TicketDetails[i].Status;
                        }
                        ticketDetails += "</span>on <span class='f_12 margin-right-5 brd' style='color:#fff;padding:1px 5px;background-color:" + res.TicketDetails[i].PriorityColorCode + "'>" + res.TicketDetails[i].Priority + " </span>  priority by <strong>" + res.TicketDetails[i].AgentName + "</strong>";

                        if (res.TicketDetails[i].Status.toLowerCase() == "close" && res.TicketDetails[i].IsConv == "0") {
                            ticketDetails += " on " + res.TicketDetails[i].ClosedDate + "</label>";
                        }
                        else { ticketDetails += " on " + res.TicketDetails[i].CreatedTime + "</label>"; }
                        if (i == 0) {
                            //if (res.TicketDetails[0].CallTime == "") {
                            //    ticketDetails += "<label class='margin-left-30 f_12 bold-6'>Inbound Call - " + res.TicketDetails[0].CreatedTime + "</label>";
                            //} else {
                            if (res.TicketDetails[0].CallTime != "") {
                                ticketDetails += "<label class='margin-left-30 f_12 bold-6'>Inbound Call - " + res.TicketDetails[0].CallTime + "</label>";
                            } else {

                                ticketDetails += "<label class='margin-left-30 f_12 bold-6'>No Call</label>";
                            }
                            //}
                        }
                        if (res.TicketDetails[i].CalledTime != "") {
                            ticketDetails += "<label class='margin-left-30 f_12 bold-6'>Inbound Call - " + res.TicketDetails[i].CalledTime + "</label>";
                        } else {
                            if (i == 0) {
                                ticketDetails += "<label class='margin-left-30 f_12 bold-6'></label>";
                            } else {
                                ticketDetails += "<label class='margin-left-30 f_12 bold-6'>No Call</label>";
                            }
                        }
                        ticketDetails += "</div>";
                        ticketDetails += "<p> " + res.TicketDetails[i].Body + "</p></li>";
                    }

                    ticketDetails += "</ul>";

                }
                else {
                    alert(res.Message);
                }
                $("#viewToken").html(ticketDetails);
                if (res.TicketDetails[res.TicketDetails.length - 1].StatusId == "2") {
                    $(".manageTickets").hide();
                    $(".manageAction").hide();
                } else {
                    $(".manageTickets").show();
                    $(".manageAction").show();
                }
                $(".token_view").show();
                $("#updateViewToken").attr("TicketId", ticket);
                $("#callerTokenHistory").hide();
            }
            else {
                alert(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
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
function UpdateCallerInformation(callerDetails, fromNumber, callerName, callerMobile, callerEmail) {
    $.ajax({
        url: "Handlers/Caller.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, DetailsObj: callerDetails, Mode: 2, FromNumber: fromNumber, CallerName: callerName, CallerMobile: callerMobile, CallerEmail: callerEmail,Caller_Id:callerId
        },
        success: function (res) {

            if (res.Success == "True") {
                GetCallerInformation(fromNumber);
                callerName = callerName;
                callerEmail = callerEmail;
                $("#viewOptions").hide();
                $("#editBasicDetails").show();
            }
            else {
                alert("Not Successful..!" + res.Message);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
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
function GetCallerInformation(fromNumber) {

    $.ajax({
        url: "Handlers/Caller.ashx",
        type: "GET",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, FromNumber: fromNumber, DetailsObj: "", Mode: 1, CallerName: "", CallerMobile: "", CallerEmail: "", Caller_Id: ""
        },
        success: function (res) {
            if (res.Success == "True") {
                if (res.CallerDetails.length > 0) {

                    callerId = res.CallerDetails[0].Id;
                    var callerDetailsData = "", editCallerDetailsData = "";
                    $("#editCallerDetails").hide();
                    $("#viewCallerDetails").show();
                    $("#viewCallerBasicDetails").show();
                    $("#editCallerBasicDetails").hide();
                    $("#callerName").html(res.CallerDetails[0].Name);
                    $("#callerMobile").html(res.CallerDetails[0].Mobile);
                    $("#callerAlternatemobile").html(res.CallerDetails[0].AlternativeMobile);
                    $("#callerEmail").html(res.CallerDetails[0].Email);

                    $("#txtName").val(res.CallerDetails[0].Name);
                    $("#txtMobile").val(res.CallerDetails[0].Mobile);
                    $("#txtEmail").val(res.CallerDetails[0].Email);
                    details = res.CallerDetails[0].MetaData;
                    callerName = res.CallerDetails[0].Name;
                    callerEmail = res.CallerDetails[0].Email;
                    if (res.CallerDetails[0].CallerAttributesMetadata == "") {
                        $("#viewCallerBasicDetails").hide();
                        $("#editCallerBasicDetails").hide();
                    }
                    else {

                        var callerAttributesArray = jQuery.parseJSON(res.CallerDetails[0].CallerAttributesMetadata);
                        if (res.CallerDetails[0].MetaData == "") {
                            $.each(callerAttributesArray, function (key, value) {
                                var callerAttributesObj = callerAttributesArray[key];
                                callerDetailsData += "<div class='col-sm-4 col-md-3'><label class='txt-lite-grey'>" + callerAttributesObj.FieldName + "</label>";
                                callerDetailsData += "<label class='txt-grey bold-6 blocked'>-----</label></div>";

                                editCallerDetailsData += "<div class='col-sm-4 col-md-3'><label class='txt-lite-grey'>" + callerAttributesObj.FieldName + "</label>";
                                if (callerAttributesObj.FieldType == "TextBox") {
                                    editCallerDetailsData += "<input FieldType=" + callerAttributesObj.FieldType + " key=" + callerAttributesObj.FieldName + "  type='text' maxlength='" + callerAttributesObj.MaxChars + "' class='" + callerAttributesObj.PlaceHolder;
                                    if (callerAttributesObj.Mandatory == "Yes") {
                                        editCallerDetailsData += " txtRequired "
                                    }
                                    editCallerDetailsData += " form-control field' />"
                                }
                                if (callerAttributesObj.FieldType == "DropDown") {
                                    editCallerDetailsData += "<div class='select-style'><select style='padding:2px 4px;' FieldType=" + callerAttributesObj.FieldType + " key=" + callerAttributesObj.FieldName + " id='ddl" + callerAttributesObj.FieldName + "' class='";

                                    if (callerAttributesObj.Mandatory == "Yes") {
                                        editCallerDetailsData += " ddlRequiredField field"
                                    }
                                    editCallerDetailsData += "'>";
                                    editCallerDetailsData += "<option value='Select'> Select </option>"
                                    var ddlOptions = callerAttributesObj.Options.split(",");
                                    $.each(ddlOptions, function (k, v) {
                                        editCallerDetailsData += "<option value='" + v + "'>" + v + "</option>";
                                    });
                                    editCallerDetailsData += "</select></div>"
                                }

                                editCallerDetailsData += "</div>";

                            });


                        }
                        else {
                            var callerDetailsObj = jQuery.parseJSON(res.CallerDetails[0].MetaData);
                            var callerAttributesArray = jQuery.parseJSON(res.CallerDetails[0].CallerAttributesMetadata);
                            $.each(callerAttributesArray, function (key, value) {
                                var callerAttributesObj = callerAttributesArray[key];
                                callerDetailsData += "<div class='col-sm-4 col-md-3'><label class='txt-lite-grey'>" + callerAttributesObj.FieldName + "</label>";
                                callerDetailsData += "<label class='txt-grey bold-6 blocked'>";
                                if (callerDetailsObj[callerAttributesObj.FieldName] == "undefined" || callerDetailsObj[callerAttributesObj.FieldName] == "") {
                                    callerDetailsData += "-----"
                                }
                                else {
                                    callerDetailsData += (typeof callerDetailsObj[callerAttributesObj.FieldName] == "undefined" ? "-----" : callerDetailsObj[callerAttributesObj.FieldName]);
                                }
                                callerDetailsData += "</label></div>";
                                editCallerDetailsData += "<div class='col-sm-4 col-md-3'><label class='txt-lite-grey'>" + callerAttributesObj.FieldName + "</label>";
                                if (callerAttributesObj.FieldType == "TextBox") {
                                    editCallerDetailsData += "<input FieldType='" + callerAttributesObj.FieldType + "' key='" + callerAttributesObj.FieldName + "' type='text' maxlength='" + callerAttributesObj.MaxChars + "' value='" + (typeof callerDetailsObj[callerAttributesObj.FieldName] == "undefined" ? "" : callerDetailsObj[callerAttributesObj.FieldName]) + "' class='" + callerAttributesObj.PlaceHolder;
                                    if (callerAttributesObj.Mandatory == "Yes") {
                                        editCallerDetailsData += " txtRequired "
                                    }
                                    editCallerDetailsData += " form-control field' />"
                                }
                                if (callerAttributesObj.FieldType == "TextArea") {
                                    editCallerDetailsData += "<textarea row='4' cols='18' FieldType='" + callerAttributesObj.FieldType + "' key='" + callerAttributesObj.FieldName + "' maxlength='" + callerAttributesObj.MaxChars + "' value='" + (typeof callerDetailsObj[callerAttributesObj.FieldName] == "undefined" ? "" : callerDetailsObj[callerAttributesObj.FieldName]) + "' class='" + callerAttributesObj.PlaceHolder;
                                    if (callerAttributesObj.Mandatory == "Yes") {
                                        editCallerDetailsData += " txtRequired "
                                    }
                                    editCallerDetailsData += " form-control field' style='height:auto' >";
                                    if (callerDetailsObj[callerAttributesObj.FieldName] == "undefined") {
                                        editCallerDetailsData += "";
                                    } else {
                                        editCallerDetailsData += callerDetailsObj[callerAttributesObj.FieldName];
                                    }
                                    editCallerDetailsData +=  "</textarea>";
                                }
                                if (callerAttributesObj.FieldType == "DropDown") {
                                    editCallerDetailsData += "<div class='select-style'><select style='padding:2px 4px;' FieldType='" + callerAttributesObj.FieldType + "' key='" + callerAttributesObj.FieldName + "' id='ddl" + callerAttributesObj.FieldName + "' class='";

                                    if (callerAttributesObj.Mandatory == "Yes") {
                                        editCallerDetailsData += " ddlRequiredField field"
                                    } else {
                                        editCallerDetailsData += " field"
                                    }
                                    editCallerDetailsData += "'>";
                                    editCallerDetailsData += "<option value='Select'> Select </option>"
                                    var ddlOptions = callerAttributesObj.Options.split(",");
                                    $.each(ddlOptions, function (k, v) {
                                        if (v == callerDetailsObj[callerAttributesObj.FieldName]) {
                                            editCallerDetailsData += "<option selected='true' value='" + v + "'>" + v + "</option>";
                                        }
                                        else {
                                            editCallerDetailsData += "<option value='" + v + "'>" + v + "</option>";
                                        }
                                    });
                                    editCallerDetailsData += "</select></div>"
                                }
                                editCallerDetailsData += "</div>";
                            });
                        }

                        $("#viewCallerBasicDetails").html(callerDetailsData);
                        $("#editCallerBasicDetails").html(editCallerDetailsData);
                    }
                }
            }
            else {
                alert(res.Message);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function GetCallHistory(fromNumber, pageSize, pageNumber, callId) {
    var callHistoryContent = "";
    $.ajax({
        url: "Handlers/Caller.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 1, FromNumber: fromNumber, CallId: callId, PageSize: pageSize, PageNumber: pageNumber
        },
        success: function (res) {
            if (res.Success == "True") {
                var inbound = 0, outbound = 0;
                if (res.CallHistory.length > 0)
                {
                    
                    for (var i = 0; i < res.CallHistory.length ; i++) {

                        callHistoryContent += "<div class='call_history'><div class='row'><div class='col-sm-9 pad-10' style='border-right: 1px solid #ddd;'>";
                        if (res.CallHistory[i].Direction == "Inbound") {
                            inbound += 1;
                            callHistoryContent += "<label class='img_icn margin-left-20'><img src='assets/img/inbound.png' class='margin-right-5' height='18' alt='inbound'></label>"
                            callHistoryContent += "<div class='col-sm-11'><label class='txt-grey margin-bottom-10'><strong>";
                            callHistoryContent += res.CallHistory[i].Direction + " Call </strong>";
                        }
                        else if (res.CallHistory[i].Direction == "Outbound") {
                            outbound += 1;
                            callHistoryContent += "<label class='img_icn margin-left-20'><img src='/assets/img/outbound.png' class='margin-right-5' alt='outbound' height='18'></label>"
                            callHistoryContent += "<div class='col-sm-11'><label class='font-green-soft margin-bottom-10'><strong>";
                            callHistoryContent += res.CallHistory[i].Direction + " Call </strong>";
                        }
                        else {
                            callHistoryContent += "<label class='img_icn margin-left-20'><img src='assets/img/abandoned.png' class='margin-right-5' alt='inbound' height='18'></label>"
                            callHistoryContent += "<div class='col-sm-11'><label class='font-red margin-bottom-10'><strong>";
                            callHistoryContent += res.CallHistory[i].Direction + " Call </strong>";
                        }

                        callHistoryContent += "<span class='margin-left-5 txt-lite-grey'>" + res.CallHistory[i].CallTime + "</span></label>"
                        for (var j = 0; j < res.CallHistory[i].Tickets.length ; j++) {
                            callHistoryContent += "<div class='margin-bottom-5'><label class='margin-right-15'>Regarding ";
                            callHistoryContent += "<a TicketId = " + res.CallHistory[i].Tickets[j].Id + " class='text-uppercase font-yellow-gold bold-6 margin-left-5 ticketDetails'>ticket - "
                            if (res.CallHistory[i].Tickets[j].Number == "") {
                                callHistoryContent += res.CallHistory[i].Tickets[j].Id;

                            } else {
                                callHistoryContent += res.CallHistory[i].Tickets[j].Number;
                            }
                            callHistoryContent += "</a></label>";
                            var categories = [];
                            var categorieColorCodes = [];
                            categories = res.CallHistory[i].Tickets[j].Categories.substring(0, res.CallHistory[i].Tickets[j].Categories.length - 1).split(",");
                            categorieColorCodes = res.CallHistory[i].Tickets[j].ColorCodes.substring(0, res.CallHistory[i].Tickets[j].ColorCodes.length - 1).split(",");
                            $.each(categories, function (index, value) {
                                //callHistoryContent += "<label style='color:#fff;background-color:" + categorieColorCodes[index] + "' class='f_11 margin-right-10'>" + value + "</label>";
                                callHistoryContent += "<label class='label_round_blue f_11 margin-right-10' style='color:'" + categorieColorCodes[index] + ">" + value + "</label>";
                            });
                            callHistoryContent += "</div><p class='txt-lite-grey'>" + res.CallHistory[i].Tickets[j].Body + "</p>";
                            if (j != res.CallHistory[i].Tickets.length - 1) {
                                callHistoryContent += "<hr>"
                            }

                        }

                        callHistoryContent += "</div></div><div class='col-sm-3 pad-10'><div class='margin-bottom-10'><label class='label_round_sm margin-right-5'>" + res.CallHistory[i].SkillGroupName + "</label></div>";
                        callHistoryContent += "<h5 class='margin-bottom-5'>" + res.CallHistory[i].AgentName + "</h5>";
                        callHistoryContent += "<span class='f_12 txt-lite-grey'>(Agent)</span></div>";
                        callHistoryContent += "</div><div class='clearfix'></div></div>";
                    }
                }
                else
                {
                    callHistoryContent +="<div class='text-center'> No Call History Found </div>"
                }
                $("#callsCount").html(res.CallHistory.length);
                $("#inboundCount").html(inbound + " Inbound")
                $("#outboundCount").html(outbound + " Outbound")
                $("#callerCallHistory").html(callHistoryContent);
            }
            else {
                alert(res.Message);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
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

function GetCallerTicketHistory() {
    var ticketHistory = ""
    $.ajax({
        url: "Handlers/Tickets.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 3, ticketId: ticketId, statusIds: ticketStatus, priorityIds: ticketPriority, customerId: callerId, pageSize: 100, pageIndex: 1, ticketId: ticketId
        },
        success: function (res) {
            if (res.Success == "True") {
                if (res.TicketDetails.length > 0) {
                    $("#spnTicketsCount").html(res.Tickets[0].TotalTickets)
                    $("#spnOpenTicketsCount").html(res.Tickets[0].TicketsOpenCount)
                    $("#spnWIPTicketsCount").html(res.Tickets[0].TicketsWorkInProgressCount);
                    $("#spnClosedTicketsCount").html(res.Tickets[0].TicketsClosedCount);
                    
                    for (var i = 0; i < res.TicketDetails.length; i++) {

                        ticketHistory += "<div class='tokenHistory'><div class='row'><div class='col-sm-8'>";
                        ticketHistory += "<div class='pad-10'><div class='margin-bottom-10'><label class='margin-right-15 pull-left'>";
                        ticketHistory += "<a TicketId='" + res.TicketDetails[i].TicketId + "' IsOffline='" + res.TicketDetails[i].IsOffine + "' class='text-uppercase font-yellow-gold bold-6 margin-left-5 ticketDetails'># ";
                        if (res.TicketDetails[i].Number == "") {
                            ticketHistory += res.TicketDetails[i].TicketId;
                        } else {
                            ticketHistory += res.TicketDetails[i].Number;
                        }
                        ticketHistory += "</a>";
                        ticketHistory += "<span class='f_13 txt-grey margin-left-5'>Opened on " + res.TicketDetails[i].CreatedDate + " by " + res.TicketDetails[i].CreatedAgentName + "</span>";
                        if (res.TicketDetails[i].IsOffline == "True") {
                            ticketHistory += "<span class='margin-left-15 txt-lite-grey f_11'>(Offline)</span>";
                        }
                        ticketHistory += "</label>";
                        ticketHistory += "<label class='pull-right text-danger f_12'>" + res.TicketDetails[i].DueStatus + "</label><div class='clearfix'></div></div>";
                        ticketHistory += "<p class='txt-lite-grey'>" + res.TicketDetails[i].Body + "</p></div></div>";
                        if (res.TicketDetails[i].Status == "Close") {
                            ticketHistory += "<label class='label label-sm' style='background-color:" + res.TicketDetails[i].StatusColorCode + ";color:white;'>Closed</label> <span class='f_13 txt-grey margin-left-5'>by " + res.TicketDetails[i].ClosingAgentName + " on " + res.TicketDetails[i].closedDate + "</span>";
                        }
                        else if (res.TicketDetails[i].Status == "Open") {
                            ticketHistory += "<label class='label label-sm' style='background-color:" + res.TicketDetails[i].StatusColorCode + ";color:white;'>Open</label> <span class='f_13 txt-grey margin-left-5'> ";
                        }
                        else {
                            ticketHistory  += "<label class='label label-sm' style='background-color:" + res.TicketDetails[i].StatusColorCode + ";color:white;'>" + res.TicketDetails[i].Status + "</label><span class='f_13 txt-grey margin-left-5'> by " + res.TicketDetails[i].UpdatedAgentName + "on" + res.TicketDetails[i].UpdatedTime + "</span>";
                         

                        }
                     
                        ticketHistory += "</br><label class='blocked f_13 margin-top-5' style='color:" + res.TicketDetails[i].PriorityColorCode + ";' margin-top-10 margin-bottom-10 f_13'><strong>" + res.TicketDetails[i].Priority + " -</strong> <span class='f_11'>(priority)</span></label>";

                        ticketHistory += "<div>";

                        if (res.TicketDetails[i].Category.substring(0, res.TicketDetails[i].Category.length - 1).split(",").length > 1) {
                            var categories = []
                            var categoryColorCode = []
                            categories = res.TicketDetails[i].Category.substring(0, res.TicketDetails[i].Category.length - 1).split(",")
                            categoryColorCode = res.TicketDetails[i].CategoryColorCodes.substring(0, res.TicketDetails[i].CategoryColorCodes.length - 1).split(",")

                            $.each(categories, function (itemIndex, value) {
                                ticketHistory += "<label style='color:#fff;background-color:" + categoryColorCode[itemIndex] + ";' class='label_round_blue f_11 margin-right-10'>" + value + "</label>";
                                //ticketHistory += "<label class='label_round_blue f_11 margin-right-10' >" + value + "</label>";
                                
                            });
                        }
                        else {
                            ticketHistory += "<label style='color:#fff;background-color:" + res.TicketDetails[i].CategoryColorCodes + ";' class='label_round_blue f_11 margin-right-10'>" + res.TicketDetails[i].Category + "</label>";
                            //ticketHistory += "<label class='label_round_blue f_11 margin-right-10'>" + res.TicketDetails[i].Category + "</label>";
                            
                        }


                        ticketHistory += "</div></div></div></div>";
                    }
                    $("#callerTokenHistory").html(ticketHistory);
                }
            }
            else {
                $("#callerTokenHistory").html(res.Message);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
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
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
//function GetTicketCategries(mode, parentId, parentCategory) {

//    $.ajax({
//        type: "GET",
//        url: "Handlers/Tickets.ashx",
//        dataType: "JSON",
//        async: false,
//        data: {
//            type: 1, Mode: mode, Category: "", ParentId: parentId, ColorCode: ""
//        },
//        success: function (res) {
//            var categoriesOptions = "";
//            var ticketPriorities = "";
//            var ticketStatuses = "";
//            //var ticketPriorities = "<option value='-1'>Select</option>";
//            if (res.Success == "True") {
//                if (res.TicketCategoryNodes.length > 0) {
//                    if (parentId == 0) {
//                        categoriesOptions += "<option value='-1'>Select</option>"
//                        for (var i = 0; i < res.TicketCategoryNodes.length; i++) {
//                            categoriesOptions += "<option value=" + res.TicketCategoryNodes[i].Id + ">" + res.TicketCategoryNodes[i].Category + "</option>";
//                        }
//                        $("#ddlRootCategories").html(categoriesOptions);

//                    }
//                    else {
//                        categoriesOptions += "<div class='form-group subCategories'><label class='label-head'>" + parentCategory + " Sub-Category</label>";
//                        categoriesOptions += "<select class='form-control ddlRequired'><option value='-1'>Select</option>";
//                        for (var i = 0; i < res.TicketCategoryNodes.length; i++) {
//                            categoriesOptions += "<option value=" + res.TicketCategoryNodes[i].Id + ">" + res.TicketCategoryNodes[i].Category + "</option>";
//                        }
//                        categoriesOptions += "</select></div>";
//                        $("#divCategories").append(categoriesOptions);
//                    }


//                }

//                if (res.TicketPriorities.length > 0) {
//                    for (var i = 0 ; i < res.TicketPriorities.length ; i++) {
//                        ticketPriorities += "<option value=" + res.TicketPriorities[i].Id + ">" + res.TicketPriorities[i].Priority + "</option>"
//                    }
//                    $("#ddlPriorities,#ddlTokenPriority").html(ticketPriorities);
//                    $("#ddlPriority").html("<option value='-1'>Select</option>" + ticketPriorities);

//                }
//                if (res.TicketStatus.length > 0) {
//                    for (var i = 0 ; i < res.TicketStatus.length ; i++) {
//                        ticketStatuses += "<option value=" + res.TicketStatus[i].Id + ">" + res.TicketStatus[i].Status + "</option>"
//                    }
//                    $("#ddlTicketStatus,#ddlTokenStatus").html(ticketStatuses);
//                    $("#ddlTicketStatus").val("1");
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