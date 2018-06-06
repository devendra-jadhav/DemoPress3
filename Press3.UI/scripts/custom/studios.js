var global_CallerIds = [];

getActiveCallerIds();
getStudios();

$(document).delegate(".selChangeNumber", "change", function () {
    var selStudioId = $(this).attr("StudioId");
    var selNumberId = $(this).val();
    var selAccountCallerId = $(this).attr("accountCallerId");
    $("#errordiv").html("");
    if (selNumberId == "deactivate") {
        $("#btnChangeNumber").attr("studioId", selStudioId).attr("studioStatus", 1).attr("accountCallerId", 0);
        $("#changeNumberBody").html("<p>If you deactive the number, no calls will be landed to this Studio.</p><p>Are you sure you want to deactive the number?</p>");
        $("#changeNumberModal").modal("show");
    } else {
        $("#btnChangeNumber").attr("studioId", selStudioId).attr("studioStatus", 0).attr("accountCallerId", selNumberId);
        $("#changeNumberBody").text("Are you sure you want to change the number for this Studio?");
        $("#changeNumberModal").modal("show");
    }
});

$(document).delegate("#btnChangeNumber", "click", function () {
    var studioId = $(this).attr("studioId");
    var status = $(this).attr("studioStatus");
    var studioAccountCallerId = $(this).attr("accountCallerId");

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        url: "Handlers/Studio.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: { type: 15, studioId: studioId, status: status, accountCallerId: studioAccountCallerId },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (res.Success == "True") {
                $("#changeNumberModal").modal("hide");
            } else {
                $("#errordiv").html(res.Message);
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
});

$(document).delegate(".deleteStudio", "click", function () {
    var thisStudioId = $(this).attr("studioId");
    $("#btnDelStudio").attr("studioId", thisStudioId);
    $("#delcnfmModal").modal("show");
});

$("#btnDelStudio").click(function () {
    var delStudioId = $(this).attr("studioId");
    if (delStudioId != "") {

        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
        $.ajax({
            url: "Handlers/Studio.ashx",
            type: "POST",
            async: false,
            dataType: "JSON",
            data: { type: 16, studioId: delStudioId },
            success: function (res) {
                $.unblockUI();
                var resHtml = "";
                if (res.Success == "True") {
                    getActiveCallerIds();
                    getStudios();
                    $("#delcnfmModal").modal("hide");
                } else {
                    console.log(res.Message);
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

function getActiveCallerIds() {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        url: "Handlers/Manager.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {type: 19},
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (res.Success == "True") {
                if (res.CallerIds.length > 0) {
                    for (var i = 0; i < res.CallerIds.length; i++) {
                        global_CallerIds.push({ "Id": res.CallerIds[i].AccountCallerId, "Number": res.CallerIds[i].Number });
                    } 
                }
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

function setCallerId(callerId, status) {
    var activeCallerIds = "";
    activeCallerIds += "<option value='0'>Select</option>";
    if (global_CallerIds.length > 0) {
        for (var i = 0; i < global_CallerIds.length; i++) {
            if (global_CallerIds[i].Id == callerId) {
                activeCallerIds += "<option value='"+ global_CallerIds[i].Id +"' selected='true'>"+ global_CallerIds[i].Number +"</option>";
            } else {
                activeCallerIds += "<option value='" + global_CallerIds[i].Id + "'>" + global_CallerIds[i].Number + "</option>";
            }
        }
        if (status == "4") {
            activeCallerIds += "<option value='deactivate' class='font-red' selected='true'>Deactivate</option>";
        } else {
            activeCallerIds += "<option value='deactivate' class='font-red'>Deactivate</option>";
        }
    } 
    return activeCallerIds;
}

function getStudios() {

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });

    $.ajax({
        url: "Handlers/Studio.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {type: 14},
        success: function (res) {
            $.unblockUI();
            var resHtml = "", resActiveStudiosHtml = "";
            if (res.Success == "True") {
                if (res.DraftStudios.length > 0) {
                    for (var i = 0; i < res.DraftStudios.length; i++) {
                        resHtml += "<div class='col-sm-3'><div class='ivr-draft-panel'><span class='close_top txt-grey pointer deleteStudio' studioId='" + res.DraftStudios[i].Id + "'><i class='fa fa-times'></i></span>";
                        resHtml += "<label class='draft-panel-left'><i class='fa fa-sitemap'></i></label>";
                        resHtml += "<label class='draft-panel-right pointer'><h5 class='txt-grey f_15 bold-6'><a href='/EditStudio.aspx?StudioId="+ res.DraftStudios[i].Id +"' target='_new'>" + res.DraftStudios[i].Name + "</a></h5>";
                        resHtml += "<span class='txt-lite-grey f_12'>" + res.DraftStudios[i].UpdatedTime + "</span></label></div></div>";
                    }
                    $("#divDraftStudios").html(resHtml);
                    $("#divPortletDraftStudios").show();
                } else {
                    $("#divDraftStudios").html("");
                    $("#divPortletDraftStudios").hide();
                }

                if (res.ActiveStudios.length > 0) {
                    for (var i = 0; i < res.ActiveStudios.length; i++) {
                        resActiveStudiosHtml += "<tr><td>"+ res.ActiveStudios[i].Name +"</td>";
                        resActiveStudiosHtml += "<td>"+ res.ActiveStudios[i].Purpose +"</td>";
                        resActiveStudiosHtml += "<td>"+ res.ActiveStudios[i].CreatedTime +"</td>";
                        resActiveStudiosHtml += "<td>"+ res.ActiveStudios[i].UpdatedTime +"</td>";
                        resActiveStudiosHtml += "<td>"+ res.ActiveStudios[i].StudioType +"</td>";
                        resActiveStudiosHtml += "<td><select class='input-basic selChangeNumber' studioId='"+ res.ActiveStudios[i].Id +"' accountCallerId='"+ res.ActiveStudios[i].AccountCallerId+"'>" + setCallerId(res.ActiveStudios[i].AccountCallerId, res.ActiveStudios[i].IsActive) + "</select></td>";
                        resActiveStudiosHtml += "<td><a class='font-blue margin-right-10' title='Edit' target='_new' href='/EditStudio.aspx?StudioId="+ res.ActiveStudios[i].Id +"'><i class='icon-pencil'></i></a>";
                        resActiveStudiosHtml += "<span class='font-red pointer deleteStudio' studioId='" + res.ActiveStudios[i].Id + "'><i class='icon-trash' title='Delete'></i></span></td></tr>";
                    }
                    $("#tblActiveStudios").html(resActiveStudiosHtml);
                } else {
                $("#tblActiveStudios").html("<tr><td colspan='7' class='text-center' style='color:red;'>No active studios</td></tr>");
                }

            } else {
                $("#divDraftStudios").html("");
                $("#divPortletDraftStudios").hide();
                $("#tblActiveStudios").html("<tr><td colspan='7' class='text-center' style='color:red;'>No active studios</td></tr>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#divDraftStudios").html("");
            $("#divPortletDraftStudios").hide();
            $("#tblActiveStudios").html("<tr><td colspan='7' class='text-center' style='color:red;'>No active studios</td></tr>");
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