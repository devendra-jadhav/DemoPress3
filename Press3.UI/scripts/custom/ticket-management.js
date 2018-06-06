
var global_TicketIds = [], global_TotalTickets = 0, global_PageSize = 5, global_PageIndex = 1;
var global_TicketPriorities = "", global_TicketStatuses = "";
var global_closeTickets = [], global_TicketCategory = "0";

var global_RoleId = $("#hdnRoleId").val();

$(document).ready(function () {
    $(".chkStatus").prop("checked", false);
    $(".chkStarredStatus").prop("checked", false);
    $("#selTicketType, #selDues, #selDurationType").val("0");
    $("#txtDatefilter, #txtSearch").val('');

    getAgents();
    getTicketPriorities();
    getTicketsHistory();
   
   
    $("#txtDatefilter").daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });
    //$("#txtSearch").keypress(function (e) {
    //    if (e.which == 13) {
    //        e.preventDefault();
    //        getTicketsHistory();
    //    }
    //});
    $("#txtSearch").keydown(function (event) {
        // Allow only backspace and delete
        if (event.which == 13) {
                event.preventDefault();
                getTicketsHistory();
        }
        else if (event.keyCode == 46 || event.keyCode == 8) {
        // let it happen, don't do anything
        } else if (event.keyCode < 48 || event.keyCode > 57) {
                 event.preventDefault();

        }
    });
});

$("#btnSearchTicket").click(function () {
    global_PageIndex = 1;
    var ticketSearch = $("#txtSearch").val();
    //if (ticketSearch == "") {
    //    alert("Please enter search text");
    //    return false;
    //} else {
        getTicketsHistory();
    //}
});

$('#txtSearch').on('keypress', function (e) {
    if (e.which === 13) {
        $("#btnSearchTicket").click();
        e.preventDefault();

    }

});

$('#txtSearch').on('keyup', function (e) {
    if (this.value == "") {
        $("#btnSearchTicket").click();
        e.preventDefault();

    }

});
$(document).delegate(".categoryValue", "click", function () {
    $(".selectedCategory").text("");
    $(".selectedCategory").attr("categoryId", $(this).attr("categoryId"));
    $(".selectedCategory").text($(this).attr("category"));
    global_TicketCategory = $(this).attr("categoryId");
    
    getTicketsHistory();

});
$(document).delegate(".categoryValue", "click", function () {
    $(".selectedCategory").text("");
    $(".selectedCategory").attr("categoryId", $(this).attr("categoryId"));
    $(".selectedCategory").text($(this).attr("category"));

});

$(".chkStatus, .chkPriority, .chkStarredStatus").click(function () {
    global_PageIndex = 1;
    getTicketsHistory();
});
$(document).delegate(".chkPriority", "change", function () {
    global_PageIndex = 1;
    getTicketsHistory();
});
$("#selDues, #selTicketType, #selAgent").change(function () {
    global_PageIndex = 1;
    getTicketsHistory();
});
$("#selDurationType").change(function () {
    global_PageIndex = 1;
    if ($(this).val() == 5) {
        $("#txtDatefilter").val("");
        $("#divDatefilter").show();
    }
    else {
        $("#divDatefilter").hide();
        getTicketsHistory();
    }
});

$(document).delegate(".applyBtn", "click", function () {
    getTicketsHistory();
});
$(document).delegate(".cancelBtn", "click", function () {
    $("#txtDatefilter").val("");
    getTicketsHistory();
});
$(document).delegate(".chkTicketIds", "click", function () {
    global_TicketIds = [];
    global_closeTickets = [];
    $(".chkTicketIds:checked").each(function () {
        global_TicketIds.push($(this).attr("ticketId"));
        if ($(this).attr("status") == "Close") {
            global_closeTickets.push($(this).attr("ticketId"));
        }
    });
    if ($(".chkTicketIds:checked").length > 0) {
        if ($(this).attr("status") == "Close") {
            $("#closeTicket").addClass("btn-default").addClass("btn-disable");
        } else {
            $("#closeTicket").addClass("btn-default").removeClass("btn-disable");
        }
       
    } else {
        $("#closeTicket").removeClass("btn-default").addClass("btn-disable");
    }
    if ($(".chkTicketIds:checked").length > 1) {
        $("#merge").addClass("btn-default").removeClass("btn-disable");
    } else {
        $("#merge").removeClass("btn-default").addClass("btn-disable");
    }
    if (global_closeTickets.length > 0) {
        $("#closeTicket").addClass("btn-default").addClass("btn-disable");
    } else {
        $("#closeTicket").addClass("btn-default").removeClass("btn-disable");
    }
});
$("#merge").click(function () {
    if ($(this).attr("class").indexOf("btn-disable") == -1) {
        getTicketsToMerge();
    }
});
$("#closeTicket").click(function () {
    if ($(this).attr("class").indexOf("btn-disable") == -1) {
        $("#txtClosure").val("");
        $("#closeTicketModal").modal("show");
    }
});
$(document).delegate("#btnMerge", "click", function () {
    if ($("input[name='primaryTicket']").is(":checked")){
        var primaryTicketId = $("input[name='primaryTicket']:checked").attr("ticketId");
        mergeTickets(primaryTicketId);
    } else {
        alert("Please select Primary Ticket");
        return false;
    }
});
$(document).delegate("#btnClosure", "click", function () {
    var closureText = $("#txtClosure").val();
    if (closureText == "") {
        alert("Please enter closure text");
        return false;
    }

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Tickets.ashx",
        dataType: "JSON",
        async: true,
        data: { type: 7, ticketIds: global_TicketIds.join(), closureText: closureText },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                alert("submitted successfully");
                $("#closeTicketModal").modal("hide");
            } else {
                $("#closeTicketModal").modal("hide");
            }
            getTicketsHistory();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#closeTicketModal").modal("hide");
            if (jqXHR.status == 401) {
                window.location.href = "/Login.aspx?message=Session expired";
            } else if (jqXHR.status == 406) {
                $("#modalPreviousSession").modal("show");
            } else {
                console.log(errorThrown);
            }
        }
    });
});
$(document).delegate(".starTickets", "click", function () {
    var starTicketId = $(this).attr("ticketId");
    var isStar = $(this).attr("isStar");
    if (starTicketId != "") {
        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
        $.ajax({
            type: "GET",
            url: "Handlers/Tickets.ashx",
            dataType: "JSON",
            async: true,
            data: { type: 8, ticketId: starTicketId, isStar: isStar },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {
                    if (isStar == 0) {
                        $(".starTickets[ticketId='" + starTicketId + "']").html("<i class='fa fa-star-o txt-grey fa-x'></i>").attr("isstar", 1);
                    }else if (isStar == 1){
                        $(".starTickets[ticketId='" + starTicketId + "']").html("<i class='fa fa-star font-yellow-gold fa-x'></i>").attr("isstar", 0);
                    }
                } else {
                    console.log(res);
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
});
$(".pageToArrow").click(function () {
    var pageFrom = $("#pageFrom").text();
    var pageTo = $("#pageTo").text();
    if (parseInt(pageFrom) < parseInt(pageTo) && parseInt(pageFrom) > 0) {
        global_PageIndex = parseInt(pageFrom) + 1;
        getTicketsHistory();
    }
});
$(".pageFromArrow").click(function () {
    var pageFrom = $("#pageFrom").text();
    var pageTo = $("#pageTo").text();
    if (parseInt(pageFrom) <= parseInt(pageTo) && parseInt(pageFrom) > 1) {
        global_PageIndex = parseInt(pageFrom) - 1;
        getTicketsHistory();
    }
});
$(document).on("click", ".ticketDetails", function () {
    var ticket = $(this).attr("TicketId");
    var statusId = $(this).attr("StatusId");
    if (ticket == "0" || ticket == "undefined") {
        alert("failed");
        return false;
    }
    GetTicketDetails(ticket, statusId);
});
$(document).delegate(".BacktoTicketHistory", "click", function () {
    $("#tokenCalllog").val("");
    $("#ddlTokenStatus").val($("#ddlTokenStatus option:first").val());
    $("#ddlTokenPriority").val($("#ddlTokenPriority option:first").val());
    getTicketsHistory();
});
$("#cancelViewToken").click(function () {
    $(".BacktoTicketHistory").trigger("click");
    //$(".token_view").hide();
    //$("#viewToken").html("");
    //if ($("#btnCallHistory").hasClass("tab-btn-select")) {
    //    $("#callHistory").show();
    //}
    //else {
    //    $("#tokens").show();
    //}

    //$("#callsPanel").show();
});
$("#updateViewToken").click(function () {
    var replyDescription = "";
    replyDescription = $("#tokenCalllog").val();
    if (replyDescription == "") {
        alert("Please enter call description");
        return false;
    }
    addReplyToTicket($(this).attr("TicketId"), $("#ddlTokenStatus").val(), $("#ddlTokenPriority").val(), replyDescription);
   // $(".BacktoTicketHistory").trigger("click");
});
function GetTicketDetails(ticket, statusId) {
    var ticketDetails = "";
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });

    $.ajax({
        url: "Handlers/Tickets.ashx",
        type: "POST",
        async: true,
        dataType: "JSON",
        data: {
            type: 9, ticketId: ticket
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.TicketDetails.length > 0) {
                    statusId = res.TicketDetails[0].CurrentTicketStatusId;
                    ticketDetails += "<div class='row'><div class='col-sm-4'><h4 class='text-uppercase font-yellow-gold bold-6 margin-top-5'>";
                    if (res.TicketDetails[0].Number == '') {
                        ticketDetails += "Ticket - " + ticket;
                    } else {
                        ticketDetails += "Ticket - " + res.TicketDetails[0].Number;
                    }
                    ticketDetails += "<label class='BacktoTicketHistory margin-left-15 font-grey-gallery pointer'> <i class='fa fa-reply'></i> </label></h4></div>";
                    for (var i = 0; i < res.TicketDetails.length; i++) {
                        if (res.TicketDetails[i].TicketHistoryId == 0) {
                            if (res.TicketDetails[i].Categories != "") {
                                ticketDetails += "<div class='col-sm-8 text-right'>";
                                var catArray = res.TicketDetails[i].Categories.split(",");
                                var catColorsArray = res.TicketDetails[i].CategoryColorCodes.split(",");
                                for (var j = 0; j < catArray.length; j++) {
                                    if (catArray[j] != "") {
                                        if (catColorsArray[j] == "ebf1f6") { resHtml += "<label class='label_round_blue f_11 margin-right-10' style='background-color:#" + catColorsArray[j] + ";font-size:12px !important;'>" + catArray[j] + "</label>"; }
                                        else { ticketDetails += "<label class='label_round_blue f_11 margin-right-10' style='background-color:" + catColorsArray[j] + ";color:white;font-size:12px !important;'>" + catArray[j] + "</label>"; }
                                    }
                                }
                                ticketDetails += "</div>";
                            }
                        }
                    }
                    ticketDetails += "</div>";
                    ticketDetails += "<ul class='token_his'>";
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
                $("#divTickets").html(ticketDetails);
                //if (global_RoleId == "4" || global_RoleId == "3") {
                    if (statusId != 2) {
                        $(".token_view").show();
                    } else {
                        $(".token_view").hide();
                    }
              //  } else {
                  //  $(".token_view").hide();
               // }
                $("#updateViewToken").attr("TicketId", ticket);
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
function mergeTickets(primaryTicketId) {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Tickets.ashx",
        dataType: "JSON",
        async: true,
        data: { type: 6, ticketIds: global_TicketIds.join(), primaryTicketId: primaryTicketId },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                alert("Merged successfully");
                $("#mergeTicket").modal("hide");
            } else {
                $("#mergeTicket").modal("hide");
            }
            getTicketsHistory();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#mergeTicket").modal("hide");
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

function getTicketsToMerge() {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Tickets.ashx",
        dataType: "JSON",
        async: true,
        data: { type: 5, ticketIds: global_TicketIds.join() },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (res.Success == "True") {
                if (res.TicketDetails.length > 0) {
                    $("#spnMergeTicketsCount").text(res.TicketDetails.length);
                    for (var i = 0; i < res.TicketDetails.length; i++) {
                        resHtml += "<div class='margin-bottom-10'>";
                        resHtml += "<div class='pull-left' style='width:5%;'><label style='margin-top:50px;'><input type='radio' name='primaryTicket' ticketId='"+ res.TicketDetails[i].Id +"'></label></div>";
                        resHtml += "<div class='tokenHistory pull-left' style='width:95%'>";
                        resHtml += "<div class='pad-10'><div class='margin-bottom-10'>";
                        if (res.TicketDetails[i].Number != '') {
                            resHtml += "<label class='margin-right-15 pull-left'><a class='text-uppercase font-yellow-gold bold-6 margin-left-5'>#" + res.TicketDetails[i].Number + "</a> ";
                        } else {
                            resHtml += "<label class='margin-right-15 pull-left'><a class='text-uppercase font-yellow-gold bold-6 margin-left-5'>#" + res.TicketDetails[i].Id + "</a> ";
                        }
                        resHtml += "<span class='f_13 txt-grey margin-left-5'>Created on "+ res.TicketDetails[i].CreatedTime +"</span> </label>"
                        resHtml += "<div class='clearfix'></div></div>";
                        resHtml += "<p class='txt-lite-grey'>" + res.TicketDetails[i].Body +"</p>";
                        resHtml += "<div class='text-right'><label class='label label-sm label-success margin-right-10'>"+ res.TicketDetails[i].Status +"</label>";
                        resHtml += " <label class='txt-lite-grey bold-6 f_13'>- "+ res.TicketDetails[i].Priority +"</label>";
                        resHtml += " </div></div></div> <div class='clearfix'></div></div>";
                    }
                    $("#divMergeTickets").html(resHtml);
                    $("#mergeTicket").modal("show");
                } else {
                    $("#divMergeTickets").html("");
                    $("#spnMergeTicketsCount").text(0);
                }
            } else {
                $("#divMergeTickets").html("");
                $("#spnMergeTicketsCount").text(0);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#divMergeTickets").html("");
            $("#spnMergeTicketsCount").text(0);
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

function getTicketPriorities() {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Tickets.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 4 },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            var categoriesOptions = "<li><a class='categoryValue' categoryId =0 category=Select >Select</a></li>";;
            if (res.Success == "True") {
                if (res.TicketCategoryNodes.length > 0) {
                   
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
                    for (var i = 0; i < res.TicketPriorities.length; i++) {
                        resHtml += "<label class='blocked margin-bottom-10'><input type='checkbox' class='margin-right-10 chkPriority' value='" + res.TicketPriorities[i].Id + "'> " + res.TicketPriorities[i].Priority + "</label>";
                        global_TicketPriorities += "<option value='" + res.TicketPriorities[i].Id + "'>" + res.TicketPriorities[i].Priority + "</option>";
                    }
                    $("#divPriorities").html(resHtml);
                    $("#divTicketPriorities").show();
                    $("#ddlTokenPriority").html(global_TicketPriorities);
                } else {
                    $("#divPriorities").html("");
                    $("#divTicketPriorities").hide();
                    $("#ddlTokenPriority").html("");
                }
                if (res.TicketStatuses.length > 0) {
                    for (var i = 0; i < res.TicketStatuses.length; i++) {
                        global_TicketStatuses += "<option value='" + res.TicketStatuses[i].Id + "'>" + res.TicketStatuses[i].Status + "</option>";
                    }
                    $("#ddlTokenStatus").html(global_TicketStatuses);
                } else {
                    $("#ddlTokenStatus").html("");
                }
            } else {
                $("#divPriorities").html("");
                $("#divTicketPriorities").hide();
                $("#ddlTokenStatus").html("");
                $("#ddlTokenPriority").html("");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#divPriorities").html("");
            $("#divTicketPriorities").hide();
            $("#ddlTokenStatus").html("");
            $("#ddlTokenPriority").html("");
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
function getTicketsHistory() {

    $(".token_view").hide();
    $("#viewToken").html("");
    $("#closeTicket").removeClass("btn-default").addClass("btn-disable");
    $("#merge").removeClass("btn-default").addClass("btn-disable");
    var ticketSearch = $("#txtSearch").val();
    var ticketId = 0;
    var ticketSubject = "";
    if ($.isNumeric(ticketSearch)) {
        ticketId = ticketSearch;
    } else {
        ticketSubject = ticketSearch;
    }

    var chkStatusIds = "";
    if ($(".chkStatus:checked").length > 0) {
        $(".chkStatus:checked").each(function () {
            chkStatusIds +=  ","  + $(this).val();
        });
    }

    var chkPriorityIds = "";
    if ($(".chkPriority:checked").length > 0) {
        $(".chkPriority:checked").each(function () {
            chkPriorityIds = chkPriorityIds + "," + $(this).val();
        });
    }

    var ticketType = $("#selTicketType option:selected").val();
    var dueType = $("#selDues option:selected").val();
    var durationType = $("#selDurationType").val();
    var isStarred = 0;
    if ($(".chkStarredStatus").is(":checked")) {
        isStarred = 1;
    }

    var dateFilter = $("#txtDatefilter").val();
    var fromDate = "";
    var toDate = "";
    var selecteddate = "";
    if (durationType == 5) {
        if (dateFilter != "") {
            selecteddate = dateFilter.split("-");
            fromDate = selecteddate[0].trim();
            toDate = selecteddate[1].trim();
        }
    }
 
  
    var agentId = 0;
    if (global_RoleId == "1") { agentId = 0;}
    else { agentId = $("#selAgent option:selected").val(); }

    $("#hdnTicketId").val(ticketId);
    $("#hdnTicketSubject").val(ticketSubject);
    $("#hdnTicketStatuses").val(chkStatusIds);
    $("#hdnTicketPriorities").val(chkPriorityIds);
    $("#hdnTicketType").val(ticketType);
    $("#hdnDueType").val(dueType);
    $("#hdnDurationType").val(durationType);
    $("#hdnIsStarred").val(isStarred);
    $("#hdnFromDate").val(fromDate);
    $("#hdnToDate").val(toDate);
    $("#hdnAgentId").val(agentId);
    $("#hdnCategoryId").val(global_TicketCategory);
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });

    $.ajax({
        type: "GET",
        url: "Handlers/Tickets.ashx",
        dataType: "JSON",
        async: true,
        data: {
            type: 3, pageIndex: global_PageIndex, ticketId: ticketId, subject: ticketSubject, statusIds: chkStatusIds,
            priorityIds: chkPriorityIds, ticketType: ticketType, overDueType: dueType, durationType: durationType,
            isStarred: isStarred, fromDate: fromDate, toDate: toDate, pageSize: global_PageSize, agentId: agentId, CategoryId: global_TicketCategory
        },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (res.Success == "True") {
                $("#lblOverDueCount").text(res.Tickets[0].OverDueCount);
                $("#lblTodayDueCount").text(res.Tickets[0].TodayDueCount);
                $("#lblTicketsOpenCount").text(res.Tickets[0].TicketsOpenCount);
                $("#pageFrom").text(global_PageIndex);
                //if (res.TotalTickets != "" && parseInt(res.TotalTickets) < 5) {
                //    $("#pageFrom").text(res.TotalTickets);
                //} else {
                //    $("#pageFrom").text("5");
                //}
                global_TotalTickets = res.Tickets[0].TotalTickets;
                if (res.Tickets[0].TotalTickets > global_PageSize) {
                    $("#pageTo").text(Math.ceil((parseInt(res.Tickets[0].TotalTickets) / parseInt(global_PageSize))));
                } else {
                    $("#pageTo").text(1);
                }
                if (res.TicketDetails.length > 0) {
                    $("#DownloadTicketExcelReports").show();
                    for (var i = 0; i < res.TicketDetails.length; i++) {
                        resHtml += "<div class='clearfix'>";
                        if (global_RoleId == "4") {
                            resHtml += "<div class='pull-left' style='width:3%;'>";

                            resHtml += "<label style='margin-top:50px;'><input type='checkbox' class='chkTicketIds' ticketId='" + res.TicketDetails[i].TicketId + "' status='"+res.TicketDetails[i].Status+"'></label></div>";
                        }
                        resHtml += "<div class='tokenHistory pull-left' style='width:97%'>";
                        if (res.TicketDetails[i].IsStarred == "True") {
                            resHtml += "<a class='close_top starTickets' ticketId='" + res.TicketDetails[i].TicketId + "' isStar='0'><i class='fa fa-star font-yellow-gold fa-x' ></i></a>";
                        } else {
                            resHtml += "<a class='close_top starTickets' ticketId='" + res.TicketDetails[i].TicketId + "' isStar='1'><i class='fa fa-star-o txt-grey fa-x' ></i></a>";
                        }
                        resHtml += "<div class='row'>";
                        resHtml += "<div class='col-sm-8' style='border-right:1px solid #ddd;'>";
                        resHtml += "<div class='pad-10'>";
                        resHtml += "<div class='margin-bottom-10'>";
                        resHtml += "<label class='margin-right-15 pull-left'>";
                        resHtml += "<a TicketId='" + res.TicketDetails[i].TicketId + "' StatusId='"+ res.TicketDetails[i].StatusId +"' class='text-uppercase font-yellow-gold bold-6 margin-left-5 ticketDetails'>";
                        if (res.TicketDetails[i].Number == '') {
                            resHtml += "#" + res.TicketDetails[i].TicketId;
                        } else {
                            resHtml += "#" + res.TicketDetails[i].Number;
                        }
                        resHtml += "</a>";
                        resHtml += "<span class='f_13 txt-grey margin-left-5'>Opened on " + res.TicketDetails[i].CreatedDate + " by " + res.TicketDetails[i].CreatedAgentName + "</span>";
                        if (res.TicketDetails[i].IsOffline == "True") {
                            resHtml += "<span class='margin-left-15 txt-lite-grey f_11'>(Offline)</span>";
                        }
                        resHtml += "</label>";
                        resHtml += "<label class='pull-right text-danger f_12'>"+ res.TicketDetails[i].DueStatus +"</label>";
                        resHtml += "<div class='clearfix'></div></div>";
                        resHtml += "<p class='txt-lite-grey'>" + res.TicketDetails[i].Body + "</p>";
                        if (res.TicketDetails[i].MergedTickets != "") {
                            var mergedTicketsArray = res.TicketDetails[i].MergedTickets.split(",");
                            var mergedTicketNumbersArray = res.TicketDetails[i].MergedTicketNumbers.split(",");
                            resHtml += "<p>Merged Tickets: ";
                            for (var j = 0; j < mergedTicketsArray.length; j++) {
                                if (mergedTicketNumbersArray[j] == "") {
                                    if (j == 0) {
                                        resHtml += "<a TicketId='" + mergedTicketsArray[j] + "' class='ticketDetails'>#" + mergedTicketsArray[j] + "</a>";
                                    } else {
                                        resHtml += ", <a TicketId='" + mergedTicketsArray[j] + "' class='ticketDetails'>#" + mergedTicketsArray[j] + "</a>";
                                    }
                                } else {
                                    if (j == 0) {
                                        resHtml += "<a TicketId='" + mergedTicketsArray[j] + "' class='ticketDetails'>#" + mergedTicketNumbersArray[j] + "</a>";
                                    } else {
                                        resHtml += ", <a TicketId='" + mergedTicketsArray[j] + "' class='ticketDetails'>#" + mergedTicketNumbersArray[j] + "</a>";
                                    }
                                }
                            }
                            resHtml += "</p>";
                        }
                        resHtml += "<div class='text-right f_12'><a href='/CallerDetails.aspx?CallerNumber=" + res.TicketDetails[i].Mobile + "' target='_new'>";
                        resHtml += res.TicketDetails[i].Name + " - " + res.TicketDetails[i].Mobile + "</a>";
                        resHtml += "</div></div></div>";
                        resHtml += "<div class='col-sm-4'><div class='pad-10'>";
                        if (res.TicketDetails[i].Status == "Close") {
                            resHtml += "<label class='label label-sm' style='background-color:" + res.TicketDetails[i].StatusColorCode + ";color:white;'>Closed</label> <span class='f_13 txt-grey margin-left-5'>by " + res.TicketDetails[i].ClosingAgentName + " on " + res.TicketDetails[i].closedDate + "</span>";
                        }
                        else if (res.TicketDetails[i].Status == "Open") {
                            if (res.TicketDetails[i].UpdatedTime == "" || res.TicketDetails[i].UpdatedTime == "null")
                                resHtml += "<label class='label label-sm' style='background-color:" + res.TicketDetails[i].StatusColorCode + ";color:white;'>Open</label> ";
                            else {
                                resHtml += "<label class='label label-sm' style='background-color:" + res.TicketDetails[i].StatusColorCode + ";color:white;'>Open</label><span class='f_13 txt-grey margin-left-5'> by " + res.TicketDetails[i].UpdatedAgentName + " on " + res.TicketDetails[i].UpdatedTime + "</span>";

                            }
                        }
                        else if (res.TicketDetails[i].Status == "Work In Progress") {
                            resHtml += "<label class='label label-sm' style='background-color:" + res.TicketDetails[i].StatusColorCode + ";color:white;'>Work In Progress</label><span class='f_13 txt-grey margin-left-5'> by " + res.TicketDetails[i].UpdatedAgentName + " on " + res.TicketDetails[i].UpdatedTime + "</span>";
                        }
                        else {
                            resHtml += "<label class='label label-sm' style='background-color:" + res.TicketDetails[i].StatusColorCode + ";color:white;'>" + res.TicketDetails[i].Status + "</label><span class='f_13 txt-grey margin-left-5'> by " + res.TicketDetails[i].UpdatedAgentName + " on " + res.TicketDetails[i].UpdatedTime + "</span>";
                        }
                        if (res.TicketDetails[i].Priority != ""){
                            resHtml += "<label class='blocked text-primary margin-top-10 margin-bottom-10 f_13'>";
                            resHtml += "<strong style='color:" + res.TicketDetails[i].PriorityColorCode + "'>" + res.TicketDetails[i].Priority + "-</strong> <span class='f_11'>(priority)</span>";
                        }
                        if (res.TicketDetails[i].DueDate != "") {
                           
                            resHtml += "<span class='f_13 txt-grey margin-left-5'>Due Date :" + res.TicketDetails[i].DueDate + "</span></label>";
                        }
                        resHtml += "<div class='margin-bottom-10'>";
                        if (res.TicketDetails[i].Category != ""){
                            var catArray = res.TicketDetails[i].Category.split(",");
                            var catColorsArray = res.TicketDetails[i].CategoryColorCodes.split(",");
                            for (var j = 0; j < catArray.length; j++) {
                                if (catArray[j] != "") {
                                    if (catColorsArray[j] == "ebf1f6") { resHtml += "<label class='label_round_blue f_11 margin-right-10' style='background-color:#" + catColorsArray[j] + ";font-size:12px !important;'>" + catArray[j] + "</label>" + ">&nbsp&nbsp";; }
                                    else { resHtml += "<label class='label_round_blue f_11 margin-right-10' style='background-color:" + catColorsArray[j] + ";color:white;font-size:12px !important;'>" + catArray[j] + "</label>" + ">&nbsp&nbsp";; }
                                }
                            }
                        }
                        resHtml = resHtml.slice(0, -11);
                        resHtml += "</div></div></div></div></div><div class='clearfix'></div></div>";
                    }
                    $("#divTickets").html(resHtml);
                } else {
                    $("#pageFrom, #pageTo").text(1);
                    $("#divTickets").html("No tickets");
                    $("#DownloadTicketExcelReports").hide();
                }
            } else {
                $("#pageFrom, #pageTo").text(1);
                $("#divTickets").html("No tickets");
                $("#DownloadTicketExcelReports").hide();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#pageFrom, #pageTo").text(1);
            $("#divTickets").html("No tickets");
            $("#DownloadTicketExcelReports").hide();
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
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        url: "Handlers/Tickets.ashx",
        type: "POST",
        async: true,
        dataType: "JSON",
        data: {
            type: 2, ticketId: ticketId, StatusId: status, PriorityId: priority, Description: description, Mode: 2
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                GetTicketDetails(ticketId);
                isRaiseTicket = true;
                $("#tokenCalllog").val("");
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
function getAgents() {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Manager.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 7 },
        success: function (res) {
            $.unblockUI();
            var agentsList = "";
            agentsList += "<option value='0'>Select</option>";
            if (res.Success == "True") {
                if (res.AgentDetails.length > 0) {
                    for (var i = 0; i < res.AgentDetails.length; i++) {
                        agentsList += "<option value='" + res.AgentDetails[i].Id + "'>" + res.AgentDetails[i].Name + "</option>";
                    }
                } else {
                    console.log(res.Message);
                }
            } else {
                console.log(res.Message);
            }
            $("#selAgent").html(agentsList);
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