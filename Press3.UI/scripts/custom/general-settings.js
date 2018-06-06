
var global_SenderIds = [];
var dailExtension = 0;


$(document).ready(function () {
    $("#txtSmsTemplateName").keydown(function () {
        var nameLength = $("#txtSmsTemplateName").val();
        if (nameLength.length >= 50) {
            $("#smsTemplateErr").html("Template name length should be less than 50");
        }
    })

    $("#txtEmailTemplateName").keydown(function () {
        var nameLength = $("#txtEmailTemplateName").val();
        if (nameLength.length >= 50) {
            $("#emailTemplateErr").html("Template name length should be less than 50");
        }
    })
})

$("#emailUpdateError, #smsUpdateError").html("");
$("#emailUpdateSuccess, #smsUpdateSuccess").html("");
$("#SLAError, #SLASuccess").html("");
$("#outBoundError, #outBoundSuccess").text("");
$("#voiceMailSuccess, #voiceMailError").text("");
$("#chkVoiceMails, #chkOutboundCalls, #chkOutboundSms, #chkOutboundEmail").bootstrapSwitch();

$("#txtEmailTemplateContent, #emailContent").redactor();

getGeneralSettings();
getTemplates(1, 0);
getTemplates(2, 0);

$("#txtSmsTemplateName, #txtEmailTemplateName, #txtEmailTemplateSubject").keydown(function (e) {
    if (e.keyCode == "13") {
        return false;
    }
});
$("#txtSmsTemplateContent").keyup(function () {
    var chars = this.value.length;
    var messages = Math.ceil(chars / 160);
    var remaining = messages * 160 - (chars % (messages * 160) || messages * 160);

    $("#remaining").text(remaining + ' characters remaining');
    $("#messages").text(messages + ' message(s)');
});
$("#smsContent").keyup(function () {
    var chars = this.value.length;
    var messages = Math.ceil(chars / 160);
    var remaining = messages * 160 - (chars % (messages * 160) || messages * 160);

    $("#remainingChars").text(remaining + ' characters remaining');
    $("#messagesCnt").text(messages + ' message(s)');
});

$("input:text").keypress(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        return false;
    }
  

});

$("#selSLAType").change(function () {
    var idSLAType = $(this).find("option:selected").val();
    if (idSLAType != "" && parseInt(idSLAType) > 0) {
        getSLATypes(2, parseInt(idSLAType));
    }else{
        $("#SLADescription").html("No Description");
    }
});
$("#selEmailTemplate").change(function () {
    var emailTemplateId = $(this).find("option:selected").val();
    if (emailTemplateId != "" && parseInt(emailTemplateId) > 0) {
        getTemplates(1, parseInt(emailTemplateId));
    } else {
        $("#selEmailTemplate").html("<option value='0'>No Template</option>");
        $("#emailSubject").val("");
        $("#emailContent").val("");
    }
});
$("#selSmsTemplate").change(function () {
    var smsTemplateId = $(this).find("option:selected").val();
    if (smsTemplateId != "" && parseInt(smsTemplateId) > 0) {
        getTemplates(2, parseInt(smsTemplateId));
    } else {
        $("#selSmsTemplate").html("<option value='0'>No Template</option>");
        $("#smsContent").val("");
    }
});
$("#lnkAddEmailTemplate").click(function () {
    $("#emailTemplateErr, #emailTemplateSuccess").html("");
    $("#txtEmailTemplateName").val("");
    $("#txtEmailTemplateSubject").val("");
    $("#txtEmailTemplateContent").val("");
    $("#txtEmailTemplateContent").parent().find(".redactor_editor").html("");
    $("#newEmailTemplateModal").modal("show");
});
$("#btnSaveEmailTemplate").click(function () {
    var emailTemplateName = $("#txtEmailTemplateName").val();
    if (emailTemplateName == "") {
        $("#emailTemplateErr").html("Enter Template name");
        return false;
    }
    if (emailTemplateName.length >= 50) {
        $("#smsTemplateErr").html("Template name length should be less than 50");
        return false;
    }
    var emailTemplateSubject = $("#txtEmailTemplateSubject").val();
    if (emailTemplateSubject == "") {
        $("#emailTemplateErr").html("Enter subject");
        return false;
    }
    var emailTemplateContent = $.trim($('#txtEmailTemplateContent').val());
    var content = '<span>' + emailTemplateContent + '</span>'
    var checkSpaces = $(content).text().trim();
    if (emailTemplateContent == "") {
        $("#emailTemplateErr").html("Enter content");
        return false;
    }
    if (content == "") {
        $("#emailTemplateErr").html("Enter content");
        return false;
    }
    if (checkSpaces == "") {
        $("#emailTemplateErr").html("Enter content");
        return false;
    }
    saveTemplate(1, 0, emailTemplateName, emailTemplateSubject, emailTemplateContent);
    $("#btnUpdateEmailTemplate").show();
    $("#btnDeleteEmailTemplate").show();
});
$("#lnkAddSmsTemplate").click(function () {
    $("#smsTemplateErr, #smsTemplateSuccess").html("");
    $("#txtSmsTemplateName").val("");
    $("#txtSmsTemplateSubject").val("");
    $("#txtSmsTemplateContent").val("");
    $("#remaining").text("160 characters remaining");
    $("#messages").text("1 message(s)");
    $("#newSmsTemplateModal").modal("show");
});
$("#btnSaveSmsTemplate").click(function () {
    var smsTemplateName = $("#txtSmsTemplateName").val();
    if (smsTemplateName == "") {
        $("#smsTemplateErr").html("Enter Template name");
        return false;
    }
    if (smsTemplateName.length >= 50) {
        $("#smsTemplateErr").html("Template name length should be less than 50");
        return false;
    }
    var smsTemplateContent = $("#txtSmsTemplateContent").val();
    if (smsTemplateContent == "") {
        $("#smsTemplateErr").html("Enter content");
        return false;
    }
    saveTemplate(2, 0, smsTemplateName, '', smsTemplateContent);
    $("#btnUpdateSmsTemplate").show();
    $("#btnDeleteSmsTemplate").show();
});
$("#btnUpdateEmailTemplate").click(function () {
    var selEmailTemplateId = $("#selEmailTemplate option:selected").val();
    if (selEmailTemplateId != "" && parseInt(selEmailTemplateId) > 0) {
        var selEmailTemplateSubject = $("#emailSubject").val();
        if (selEmailTemplateSubject == "") {
            $("#emailUpdateError").html("Enter subject");
            return false;
        }
        var selEmailTemplateContent = $("#emailContent").val();
        if (selEmailTemplateContent == "") {
            $("#emailUpdateError").html("Enter content");
            return false;
        }
        saveTemplate(1, selEmailTemplateId, '', selEmailTemplateSubject, selEmailTemplateContent);
    }
    else {
        $("#emailUpdateError").html("Select template");
        return false;
    }
});
$("#btnUpdateSmsTemplate").click(function () {
    var selSmsTemplateId = $("#selSmsTemplate option:selected").val();
    if (selSmsTemplateId != "" && parseInt(selSmsTemplateId) > 0) {
        var selSmsTemplateContent = $("#smsContent").val();
        if (selSmsTemplateContent == "") {
            $("#smsUpdateError").html("Enter content");
            return false;
        }
        saveTemplate(2, selSmsTemplateId, '', '', selSmsTemplateContent);
    }
    else {
        $("#smsUpdateError").html("Select template");
        return false;
    }
});
$("#btnCancelEmailTemplate").click(function () {
    $("#emailUpdateError").html("");
});
$("#btnCancelSmsTemplate").click(function () {
    $("#smsUpdateError").html("");
});
$("#SLAThresholdInSeconds, #SLATargetPercentage").keypress(function (e) {
    numericValidation(e);
});
$("#btnUpdateSLA").click(function () {
    var thresholdInSeconds = $("#SLAThresholdInSeconds").val();
    if (thresholdInSeconds == "") {
        $("#SLAError").html("Enter service level threshold value");
        return false;
    }
    var typeOfSLA = $("#selSLAType option:selected").val();
    if (typeOfSLA == "") {
        $("#SLAError").html("Select service level type");
        return false;
    }
    if (typeOfSLA != "" && parseInt(typeOfSLA) == 0) {
        $("#SLAError").html("Select service level type");
        return false;
    }
    var targetPercentage = $("#SLATargetPercentage").val();
    if (targetPercentage == ""){
        $("#SLAError").html("Select target service level percentage");
        return false;
    }
    if (targetPercentage != "" && (parseInt(targetPercentage) > 100 || parseInt(targetPercentage) == 0)) {
        $("#SLAError").html("Target service level percentage should be less than 100 and greater than 0");
        return false;
    }
    dailExtension = 0
    if ($('#DailExtension').is(":checked")) {
       dailExtension = 1
    }
    updateGeneralSettings(1, thresholdInSeconds, typeOfSLA, targetPercentage, 0);
});
$('#chkVoiceMails').on('switchChange.bootstrapSwitch', function (event, state) {
    if ($("#chkVoiceMails").is(':checked')) {
        updateGeneralSettings(2, 0, 0, 0, 1);
    } else {
        updateGeneralSettings(2, 0, 0, 0, 0);
    }
});
$("#btnCancelSmsTemplate").click(function () {
    getTemplates(2, 0);
});
$("#btnCancelEmailTemplate").click(function () {
    getTemplates(1, 0);
});
$("#btnDeleteSmsTemplate").click(function () {
    $("#smsUpdateError, #cnfmPopupError, #cnfmPopupSuccess").html("");
    var delSmsTemplateId = $("#selSmsTemplate").find("option:selected").val();
    if (delSmsTemplateId != "" && parseInt(delSmsTemplateId) > 0) {
        $("#btnCnfm").attr("templateId", delSmsTemplateId).attr("templateType", 2);
        $("#cnfmPopup").modal("show");
    } else {
        $("#smsUpdateError").html("Select template");
    }
});
$("#btnDeleteEmailTemplate").click(function () {
    $("#emailUpdateError, #cnfmPopupError, #cnfmPopupSuccess").html("");
    var delEmailTemplateId = $("#selEmailTemplate").find("option:selected").val();
    if (delEmailTemplateId != "" && parseInt(delEmailTemplateId) > 0) {
        $("#btnCnfm").attr("templateId", delEmailTemplateId).attr("templateType", 1);
        $("#cnfmPopup").modal("show");
    } else {
        $("#emailUpdateError").html("Select template");
    }
});
$("#btnCnfm").click(function () {
    var delTemplateId = $("#btnCnfm").attr("templateId");
    var delTemplateType = $("#btnCnfm").attr("templateType");
    if (delTemplateId != "" && parseInt(delTemplateId) > 0) {
        deleteTemplate(delTemplateId, delTemplateType);
    }
    //hiding update and delete buttons if there is no template in dropdown
    if($("#selEmailTemplate").find('option').length <= 1 )
    {
        $("#btnUpdateEmailTemplate").hide();
        $("#btnDeleteEmailTemplate").hide();
    } else {
        $("#btnUpdateEmailTemplate").show();
        $("#btnDeleteEmailTemplate").show();
    }
    if ($("#selSmsTemplate").find('option').length <= 1) {
        $("#btnUpdateSmsTemplate").hide();
        $("#btnDeleteSmsTemplate").hide();
    } else {
        $("#btnUpdateSmsTemplate").show();
        $("#btnDeleteSmsTemplate").show();
    }
});
$('#chkOutboundCalls').on('switchChange.bootstrapSwitch', function (event, state) {
    if (state) {
        $("#lblCallerId").text("").hide();
        $("#callerIdsView").show();
        getCallerIdNumbers(0);
    } else {
        $("#callerIdsView").hide();
        manageOutboundCommunicationSettings(1, 0, 0, 0, 0, 0, "", 0, "", "", "");
    }
});
$(document).delegate("#selCallerIds", "change", function () {
    var selCallerId = $(this).find("option:selected").val();
    if (selCallerId != "" && parseInt(selCallerId) > 0) {
        manageOutboundCommunicationSettings(1, 1, selCallerId, 0, 0, 0, "", 0, "", "", "");
        $("#lblCallerId").text($(this).find("option:selected").text()).show();
    } 
});
$("#manageSenderIds").click(function () {
    getSenderIds(2, 0);
    $("#senderIdError, #senderIdSuccess").text("");
    //$("#senderIdPopup").modal("show");
});
$(document).delegate("#addSenderId", "click", function () {
    var resHtml = "";
    var senderIdsCount = $(".divSenderIds").last().attr("senderId");
    var dynSenderIds = parseInt(senderIdsCount) + 1;
    resHtml += "<div class='col-sm-6 divSenderIds' id='divSenderId_" + dynSenderIds + "' senderId='" + dynSenderIds + "'><div class='well well-sm well-grey'>";
    resHtml += "<input type='text' class='form-control input-inline margin-right-10 txtSenderIds' id='txtSenderId_" + dynSenderIds + "' maxlength='15' minlength='6'/>";
    resHtml += "<span class='removeSenderIds pointer' senderId='" + dynSenderIds + "'><i class='icon-close font-red'></i></span></div></div>";
    $("#divSenderId_" + (senderIdsCount)).after(resHtml);
});
$(document).delegate(".removeSenderIds", "click", function () {
    var delSenderId = $(this).attr("senderId");
    $(".divSenderIds[id='divSenderId_" + delSenderId + "']").remove();
});
$(document).delegate(".txtSenderIds", "keypress", function (e) {
    alphanumericValidation(e);
});
$('#chkOutboundSms').on('switchChange.bootstrapSwitch', function (event, state) {
    if (state) {
        $("#senderIdsView").show();
        getSenderIds(1, 0);
    } else {
        $("#senderIdsView").hide();
        manageOutboundCommunicationSettings(2, 0, 0, 0, 0, 0, "", 0, "", "", "");
    }
});
$(document).delegate("#selSenderIds", "change", function () {
    var selSenderId = $(this).find("option:selected").val();
    if (selSenderId != "" && parseInt(selSenderId) > 0) {
        manageOutboundCommunicationSettings(2, 0, 0, 1, selSenderId, 0, "", 0, "", "", "");
    }
});

$("#btnSaveSenderId").click(function () {
    var isSenderIdValid = 0; global_SenderIds = [], prevSenderId = 0;
    prevSenderId = $("#selSenderIds option:selected").val();
    $(".txtSenderIds").each(function () {
        var senderId = $(this).val();
        if (senderId == "") {
            $("#senderIdError").html("Enter SenderId");
            isSenderIdValid = 1;
            return false;
        } else if (senderId != "" && (senderId.length > 15 || senderId.length < 6)) {
            $("#senderIdError").html("SenderId should be minimum 6 and maximum 15 characters");
            isSenderIdValid = 1;
            return false;
        } else {
            isSenderIdValid = 0;
            global_SenderIds.push({"senderId": senderId});
        }
    });
    
    if (isSenderIdValid == 1) {
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
        url: "Handlers/Manager.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: { type: 27, senderIds: JSON.stringify(global_SenderIds) },
        success: function (res) {
            $.unblockUI();
            $("#senderIdError").html("");
            if (res.Success == "True") {
                $("#senderIdSuccess").html(res.Message);
                getSenderIds(1, prevSenderId);
                setTimeout(function () {
                    $("#senderIdSuccess").html("");
                    $("#senderIdPopup").modal("hide");
                }, 1000);
            } else {
                $("#senderIdSuccess").html("");
                $("#senderIdError").html(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#senderIdPopup").modal("hide");
            $("#senderIdError, #senderIdSuccess").text("");
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

$("#manageEmail").click(function () {
    //$("[name='mail_type']").prop("checked", false);
    //$("#txtAWSKey, #txtAWSSecret, #txtAWSEmail").val("");
    //$("#txtIpPort, #txtFromEmail").val("");
    //$("#divSmtp, #divAmazonSES").hide();
    $("#emailConfigureError, #emailConfigureSuccess").text("");
    $("#emailConfigurePopup").modal("show");
});
$("[name='mail_type']").click(function () {
    $("#emailConfigureError").text("");
    var emailType = $("[name='mail_type']:checked").val();
    if (emailType != "" && parseInt(emailType) == 1) {
        $("#txtIp, #txtPort, #txtFromEmail").val("");
        $("#divSmtp").show();
        $("#divAmazonSES").hide();
    } else if (emailType != "" && parseInt(emailType) == 2) {
        $("#txtAWSKey, #txtAWSSecret, #txtAWSEmail").val("");
        $("#divSmtp").hide();
        $("#divAmazonSES").show();
    }
});
$("#txtIp").keypress(function (e) {
    ipAddressValidation(e);
});
$("#txtPort").keypress(function (e) {
    numericValidation(e);
});
$("#txtAWSKey, #txtAWSSecret").keypress(function (e) {
    alphanumericValidation(e);
});
$("#txtFromEmail, #txtAWSEmail").keypress(function (e) {
    if (e.which == 13) { e.preventDefault(); $("#btnConfigureEmail").trigger("click"); }
});

$("#btnConfigureEmail").click(function () {

    var selEmailType = 0, ip = "", port = 0, keyAWS = "", secretAWS = "", fromEmail = "";

    if ($("[name='mail_type']").is(":checked")) {
        selEmailType = $("[name='mail_type']:checked").val();
    } else {
        $("#emailConfigureError").text("Select Email type");
        return false;
    }

    if (selEmailType != "" && parseInt(selEmailType) == 1) {
        ip = $("#txtIp").val();
        if (ip == "") {
            $("#emailConfigureError").text("Enter Ip address");
            return false;
        }
        if (ip.length < 9 || ip.length > 20) {
            $("#emailConfigureError").text("Enter Ip address length between 9 and 16");
            return false;
        }
        port = $("#txtPort").val();
        if (port == "") {
            $("#emailConfigureError").text("Enter Port");
            return false;
        }
        fromEmail = $("#txtFromEmail").val();
        if (fromEmail == "") {
            $("#emailConfigureError").text("Enter From email address");
            return false;
        } else if (!allowEmail.test(fromEmail)) {
            $("#emailConfigureError").text("Enter valid From email address");
            return false;
        }

    } else if (selEmailType != "" && parseInt(selEmailType) == 2) {
        keyAWS = $("#txtAWSKey").val();
        if (keyAWS == "") {
            $("#emailConfigureError").text("Enter AWS Key");
            return false;
        }
        secretAWS = $("#txtAWSSecret").val();
        if (secretAWS == "") {
            $("#emailConfigureError").text("Enter AWS Secret");
            return false;
        }
        fromEmail = $("#txtAWSEmail").val();
        if (fromEmail == "") {
            $("#emailConfigureError").text("Enter From email address");
            return false;
        } else if (!allowEmail.test(fromEmail)) {
            $("#emailConfigureError").text("Enter valid From email address");
            return false;
        }
    }

    manageOutboundCommunicationSettings(3, 0, 0, 0, 0,
                            selEmailType, ip, port, keyAWS, secretAWS, fromEmail);

});

$('#chkOutboundEmail').on('switchChange.bootstrapSwitch', function (event, state) {
    if (state) {
        $("[name='mail_type']").prop("checked", false);
        $("#txtAWSKey, #txtAWSSecret, #txtAWSEmail").val("");
        $("#txtIpPort, #txtFromEmail").val("");
        $("#divSmtp, #divAmazonSES").hide();
        $("#emailConfigureError, #emailConfigureSuccess").text("");
        $("#emailConfigurePopup").modal("show");
    } else {
        $("#emailConfigurePopup").modal("hide");
        manageOutboundCommunicationSettings(3, 0, 0, 0, 0, 0, "", 0, "", "", "");
    }
});

function getSenderIds(modeType, senderId) {
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
        data: { type: 28 },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (modeType == 1) {
                if (res.Success == "True") {
                    if (res.SenderIds.length > 0) {
                        resHtml += "<option value='0'>Select SenderIds</option>";
                        for (var i = 0; i < res.SenderIds.length; i++) {
                            if (senderId == res.SenderIds[i].Id) {
                                resHtml += "<option value='" + res.SenderIds[i].Id + "' selected='true'>" + res.SenderIds[i].SenderId + "</option>";
                            } else {
                                resHtml += "<option value='" + res.SenderIds[i].Id + "'>" + res.SenderIds[i].SenderId + "</option>";
                            }
                            }
                        } else {
                            resHtml += "<option value='0'>No SenderIds</option>";
                        }
                } else {
                    resHtml += "<option value='0'>No SenderIds</option>";
                }
                $("#selSenderIds").html(resHtml);
            }
            else if (modeType == 2) {
                if (res.Success == "True") {
                    if (res.SenderIds.length > 0) {
                        for (var i = 0; i < res.SenderIds.length; i++) {
                            if (i == 0) {
                                resHtml += "<div class='col-sm-6 divSenderIds' id='divSenderId_0' senderId='0'><div class='well well-sm well-grey'>";
                                resHtml += "<input type='text' class='form-control input-inline margin-right-10 txtSenderIds' id='txtSenderid_0' maxlength='15' value='" + res.SenderIds[i].SenderId + "' />";
                                resHtml += "<span id='addSenderId' class='pointer' title='Add SenderId'><i class='icon-plus font-green'></i></span></div></div>";
                            } else {
                                resHtml += "<div class='col-sm-6 divSenderIds' id='divSenderId_" + i + "' senderId='" + i + "'><div class='well well-sm well-grey'>";
                                resHtml += "<input type='text' class='form-control input-inline margin-right-10 txtSenderIds' id='txtSenderId_" + i + "' maxlength='15' value='" + res.SenderIds[i].SenderId + "'/>";
                                resHtml += "<span class='removeSenderIds pointer' senderId='" + i + "'><i class='icon-close font-red'></i></span></div></div>";
                            }
                        }
                    } else {
                        resHtml += "<div class='col-sm-6 divSenderIds' id='divSenderId_0' senderId='0'><div class='well well-sm well-grey'>";
                        resHtml += "<input type='text' class='form-control input-inline margin-right-10 txtSenderIds' id='txtSenderid_0' maxlength='15' minlength='6' />";
                        resHtml += "<span id='addSenderId' class='pointer' title='Add SenderId'><i class='icon-plus font-green'></i></span></div></div>";
                    }
                } else {
                    resHtml += "<div class='col-sm-6 divSenderIds' id='divSenderId_0' senderId='0'><div class='well well-sm well-grey'>";
                    resHtml += "<input type='text' class='form-control input-inline margin-right-10 txtSenderIds' id='txtSenderid_0' maxlength='15' minlength='6' />";
                    resHtml += "<span id='addSenderId' class='pointer' title='Add SenderId'><i class='icon-plus font-green'></i></span></div></div>";
                }
                $("#senderIdRow").html(resHtml);
                $("#senderIdPopup").modal("show");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            console.log(res.Message);
            $("#outBoundError, #outBoundSuccess").text("");
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

function manageOutboundCommunicationSettings(modeType, isCall, callerId, isSenderId, senderId,
                            emailType, ip, port, keyAWS, secretAWS, fromEmail) {
    $("#emailConfigureError, #emailConfigureSuccess").text("");

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
        data: {
            type: 26, callerId: callerId, mode: modeType, senderId: senderId,
            isCall: isCall, isSenderId: isSenderId, emailType: emailType,
            ip: ip, port: port, keyAWS: keyAWS, secretAWS: secretAWS,
            fromEmailAddress: fromEmail
        },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (modeType == 3) {
                if (res.Success == "True") {
                    $("#emailConfigureSuccess").text(res.Message);
                    if (parseInt(emailType) == 0) {
                        $("#manageEmail").hide();
                    } else {
                        $("#manageEmail").show();
                    }
                    setTimeout(function () {
                        $("#emailConfigureSuccess").text("");
                        $("#emailConfigurePopup").modal("hide");
                    }, 1000);
                } else {
                    $("#emailConfigureError").text(res.Message);
                }
            }
            else {
                if (res.Success == "True") {
                    $("#outBoundSuccess").text(res.Message);
                    setTimeout(function () {
                        $("#outBoundSuccess").text("");
                    }, 1000);
                } else {
                    $("#outBoundError").text(res.Message);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#outBoundError, #outBoundSuccess, #emailConfigureError").text("");
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

function getCallerIdNumbers(callerId) {
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
        data: {
            type: 17, availableStatus: 1, assignedStatus: 0
        },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (res.Success == "True") {
                if (res.CallerIds.length > 0) {
                    resHtml += "<option value='0'>Select CallerId</option>";
                    for (var i = 0; i < res.CallerIds.length; i++) {
                        if (callerId == res.CallerIds[i].CallerId) {
                            resHtml += "<option value='" + res.CallerIds[i].CallerId + "' selected='true'>" + res.CallerIds[i].CallerIdNumber + "</option>";
                        } else {
                            resHtml += "<option value='" + res.CallerIds[i].CallerId + "'>" + res.CallerIds[i].CallerIdNumber + "</option>";
                        }
                    }
                    $("#selCallerIds").html(resHtml);
                } else {
                    $("#selCallerIds").html("<option value='0'>No CallerIds</option>");
                }
            } else {
                $("#selCallerIds").html("<option value='0'>No CallerIds</option>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#selCallerIds").html("<option value='0'>No CallerIds</option>");
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

function deleteTemplate(templateId, templateType) {
    $("#smsUpdateError, #emailUpdateError").html("");
    $("#smsUpdateSuccess, #emailUpdateSuccess").html("");
    $("#cnfmPopupError, #cnfmPopupSuccess").html("");
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
        data: {
            type: 24, mode: 2, templateId: templateId,
            templateType: templateType
        },
        success: function (res) {
            $.unblockUI();
            $("#remainingChars").text("");
            $("#messagesCnt").text("");
            if (templateType == 1) {
                if (res.Success == "True") {
                    $("#cnfmPopupSuccess").html("Deleted successfully");
                    setTimeout(function () {
                        $("#cnfmPopupSuccess").html("");
                        $("#cnfmPopup").modal("hide");
                        getTemplates(1, 0);
                    }, 1000);
                } else {
                    $("#cnfmPopupError").html(res.Message);
                }
            } else if (templateType == 2) {
                if (res.Success == "True") {
                    $("#cnfmPopupSuccess").html("Deleted successfully");
                    setTimeout(function () {
                        $("#cnfmPopupSuccess").html("");
                        $("#cnfmPopup").modal("hide");
                        getTemplates(2, 0);
                    }, 1000);
                } else {
                    $("#cnfmPopupError").html(res.Message);
                }
            } else {
                $("#cnfmPopupError").html(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
             $.unblockUI();
            $("#smsUpdateError, #emailUpdateError").html("");
            $("#smsUpdateSuccess, #emailUpdateSuccess").html("");
            $("#cnfmPopupError, #cnfmPopupSuccess").html("");
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

function updateGeneralSettings(modeType, thresholdInSeconds, typeOfSLA, targetPercentage, isVoiceMail) {
    $("#SLAError, #SLASuccess").html("");
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
        data: {
            type: 25, mode: modeType, typeofSLA: typeOfSLA, thresholdInSeconds: thresholdInSeconds,
            targetPercentage: targetPercentage, isVoiceMail: isVoiceMail, dailExtension: dailExtension
        },
        success: function (res) {
            $.unblockUI();
            if (modeType == 1) {
                if (res.Success == "True") {
                    $("#SLAError").html("");
                    $("#SLASuccess").html(res.Message);
                    setTimeout(function () {
                        $("#SLASuccess").html("");
                    }, 1000);
                } else {
                    $("#SLAError").html(res.Message);
                    $("#SLASuccess").html("");
                    setTimeout(function () {
                        $("#SLAError").html("");
                    }, 1000);
                }
            } else if (modeType == 2) {
                if (res.Success == "True") {
                    $("#voiceMailError").html("");
                    $("#voiceMailSuccess").html(res.Message);
                    setTimeout(function () {
                        $("#voiceMailSuccess").html("");
                    }, 1000);
                } else {
                    $("#voiceMailError").html(res.Message);
                    $("#voiceMailSuccess").html("");
                    setTimeout(function () {
                        $("#voiceMailError").html("");
                    }, 1000);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#SLAError, #SLASuccess").html("");
            $("#voiceMailError, #voiceMailSuccess").html("");
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

function saveTemplate(templateType, templateId, templateName, templateSubject, templateContent) {
   

    $("#emailTemplateErr, #emailTemplateSuccess").html("");
    $("#smsTemplateErr, #smsTemplateSuccess").html("");
    $("#emailUpdateError, #smsUpdateError").html("");
    $("#emailUpdateSuccess, #smsUpdateSuccess").html("");

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
        data: {
            type: 24, mode: 1, templateType: templateType, templateId: templateId,
            templateName: templateName, templateSubject: templateSubject,
            templateContent: templateContent
        },
        success: function (res) {
            $.unblockUI();
            $("#remainingChars").text("");
            $("#messagesCnt").text("");
            if (parseInt(templateType) == 1) {
                if (res.Success == "True") {
                    if (parseInt(templateId) > 0) {
                        $("#emailUpdateSuccess").html(res.Message);
                        setTimeout(function () {
                            $("#emailUpdateSuccess").html("");
                        }, 1000);
                    }
                    else {
                        $("#emailTemplateSuccess").html(res.Message);
                        getTemplates(1, 0);
                        setTimeout(function () {
                            $("#newEmailTemplateModal").modal("hide");
                        }, 1000);
                    }
                } else {
                    if ($('#newEmailTemplateModal').is(':visible')) {
                        $("#emailTemplateErr").html(res.Message);
                    } else {
                        $("#emailUpdateError").html(res.Message);
                    }
                }
            } 
            else if (parseInt(templateType) == 2) {
                if (res.Success == "True") {
                    if (parseInt(templateId) > 0) {
                        $("#smsUpdateSuccess").html(res.Message);
                        setTimeout(function () {
                            $("#smsUpdateSuccess").html("");
                        }, 1000);
                    } else {
                        $("#smsTemplateSuccess").html(res.Message);
                        getTemplates(2, 0);
                        setTimeout(function () {
                            $("#newSmsTemplateModal").modal("hide");
                        }, 1000);
                    }
                } else {
                    if ($('#newSmsTemplateModal').is(':visible')) {
                        $("#smsTemplateErr").html(res.Message);
                    } else {
                        $("#smsUpdateError").html(res.Message);
                    }
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#emailTemplateErr, #emailTemplateSuccess").html("");
            $("#smsTemplateErr, #smsTemplateSuccess").html("");
            $("#emailUpdateError, #smsUpdateError").html("");
            $("#emailUpdateSuccess, #smsUpdateSuccess").html("");
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

function getGeneralSettings() {
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
        data: { type: 23},
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.Settings.length > 0){
                    if (res.Settings[0].SLAThresholdInSeconds != "" && parseInt(res.Settings[0].SLAThresholdInSeconds) > 0) {
                        $("#SLAThresholdInSeconds").val(res.Settings[0].SLAThresholdInSeconds);
                    }
                    if (res.Settings[0].SLATargetPercentage != "" && parseInt(res.Settings[0].SLATargetPercentage) > 0) {
                        $("#SLATargetPercentage").val(res.Settings[0].SLATargetPercentage);
                    }
                    //if (res.Settings[0].SLATypeId != "" && parseInt(res.Settings[0].SLATypeId) > 0) {
                        getSLATypes(1, parseInt(res.Settings[0].SLATypeId));
                    //}
                    if (res.Settings[0].IsVoiceMail != "") {
                        if (res.Settings[0].IsVoiceMail == "True") {
                            $("[name='chkVoiceMails']").bootstrapSwitch('state', true);
                        }
                        else if (res.Settings[0].IsVoiceMail == "False") {
                            $("[name='chkVoiceMails']").bootstrapSwitch('state', false);
                        }
                    }
                    if (res.Settings[0].IncludeDailExtension == "1") {
                        $('#DailExtension').prop('checked', true);
                    }
                    if (res.Settings[0].OutboundCallerId != "" && parseInt(res.Settings[0].OutboundCallerId) > 0) {
                        getCallerIdNumbers(res.Settings[0].OutboundCallerId);
                        $("#callerIdsView").show();
                        $("[name='chkOutboundCalls']").bootstrapSwitch('state', true);
                    } else {
                        $("#callerIdsView").hide();
                        $("[name='chkOutboundCalls']").bootstrapSwitch('state', false);
                    }
                    if (res.Settings[0].OutboundSenderId != "" && parseInt(res.Settings[0].OutboundSenderId) > 0) {
                        getSenderIds(1, res.Settings[0].OutboundSenderId);
                        $("#senderIdsView").show();
                        $("[name='chkOutboundSms']").bootstrapSwitch('state', true);
                    } else {
                        $("#senderIdsView").hide();
                        $("[name='chkOutboundSms']").bootstrapSwitch('state', false);
                    }
                    if (res.Settings[0].OutboundEmailType != "" && parseInt(res.Settings[0].OutboundEmailType) > 0) {
                        $("#manageEmail").show();
                        $("[name='chkOutboundEmail']").bootstrapSwitch('state', true);
                       
                        if (parseInt(res.Settings[0].OutboundEmailType) == 1) {
                            $("[name='mail_type'][value='1']").prop("checked", true);
                            $("[name='mail_type'][value='2']").prop("checked", false);
                            $("#divSmtp").show();
                            $("#divAmazonSES").hide();
                            if (res.Settings[0].Port != "" && parseInt(res.Settings[0].Port) > 0) {
                                $("#txtPort").val(res.Settings[0].Port);
                            }
                            if (res.Settings[0].Ip != "") {
                                $("#txtIp").val(res.Settings[0].Ip);
                            }
                            if (res.Settings[0].FromEmailAddress != "") {
                                $("#txtFromEmail").val(res.Settings[0].FromEmailAddress);
                            }
                        } else if (parseInt(res.Settings[0].OutboundEmailType) == 2) {
                            $("[name='mail_type'][value='1']").prop("checked", false);
                            $("[name='mail_type'][value='2']").prop("checked", true);
                            $("#divSmtp").hide();
                            $("#divAmazonSES").show();
                            if (res.Settings[0].AWSKey != "") {
                                $("#txtAWSKey").val(res.Settings[0].AWSKey);
                            }
                            if (res.Settings[0].AWSSecret != "") {
                                $("#txtAWSSecret").val(res.Settings[0].AWSSecret);
                            }
                            if (res.Settings[0].FromEmailAddress != "") {
                                $("#txtAWSEmail").val(res.Settings[0].FromEmailAddress);
                            }
                        }
                    } else {
                        $("#txtIp").val("");
                        $("#txtPort").val("");
                        $("#txtFromEmail").val("");
                        $("#txtAWSKey").val("");
                        $("#txtAWSSecret").val("");
                        $("#txtAWSEmail").val("");
                        $("#manageEmail").hide();
                        $("[name='chkOutboundEmail']").bootstrapSwitch('state', false);
                    }
                } else {
                    console.log(res.Message);
                }
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

function getSLATypes(mode, typeId) {
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
        data: { type: 22, mode: mode, idSLAType: typeId },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (res.Success == "True") {
                if (mode == 1) {
                    resHtml += "<option value='0'>Select SLA Type</option>";
                    if (res.SLATypes.length > 0) {
                        for (var i = 0; i < res.SLATypes.length; i++) {
                            if (typeId == parseInt(res.SLATypes[i].Id)) {
                                resHtml += "<option value='" + res.SLATypes[i].Id + "' selected='true' >" + res.SLATypes[i].SLAType + "</option>";
                            } else {
                                resHtml += "<option value='" + res.SLATypes[i].Id + "' >" + res.SLATypes[i].SLAType + "</option>";
                            }
                        }
                        $("#selSLAType").html(resHtml);
                        if (typeId > 0) {
                            getSLATypes(2, typeId);
                        }
                    } else {
                        $("#selSLAType").html("<option value='0'>No SLA Types</option>");
                    }
                } 
                else if (mode == 2) {
                    if (res.SLATypes[0].Description != "") {
                        var resParagraphs = "";
                        resParagraphs += "<p class='f_13'>" + res.SLATypes[0].Description + "</p>";
                        resParagraphs += "<p><strong>Formula used to determine service level: </strong>" + res.SLATypes[0].Formula + "</p>";
                        $("#SLADescription").html(resParagraphs);
                    } else {
                        $("#SLADescription").html("No Description");
                    }
                } else {
                    $("#selSLAType").html("<option value='0'>No SLA Types</option>");
                    $("#SLADescription").html("No Description");
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#selSLAType").html("<option value='0'>No SLA Types</option>");
            $("#SLADescription").html("No Description");
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

function getTemplates(modeType, templateId) {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Studio.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 6, mode: modeType, templateId: templateId },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (parseInt(modeType) == 1) {
                if (res.Success == "True") {
                    if (res.Templates.length > 0) {
                        resHtml = "";
                        var latestEmailTemplateId = 0;
                        if (parseInt(templateId) > 0) {
                            $("#emailSubject").val(res.Templates[0].TemplateSubject);
                            $("#emailContent").val(res.Templates[0].TemplateContent);
                            $("#emailContent").parent().find(".redactor_editor").html(res.Templates[0].TemplateContent);
                            $("#selEmailTemplate").val(res.Templates[0].Id);
                        } else {
                            for (var i = 0; i < res.Templates.length; i++) {
                                resHtml += "<option value='" + res.Templates[i].Id + "'>" + res.Templates[i].TemplateName + "</option>";
                                if (parseInt(templateId) == 0) {
                                    if (i == (res.Templates.length - 1)) {
                                        latestEmailTemplateId = parseInt(res.Templates[i].Id);
                                    }
                                }
                            }
                            $("#selEmailTemplate").html(resHtml);
                            if (parseInt(latestEmailTemplateId) > 0) {
                                getTemplates(1, latestEmailTemplateId);
                            }
                        }
                    }
                    else {
                        $("#selEmailTemplate").html("<option value='0'>No Template</option>");
                        $("#emailSubject").val("");
                        $("#emailContent").val("");
                        $("#emailContent").parent().find(".redactor_editor").html("");
                    }
                    $("#btnUpdateEmailTemplate").show();
                    $("#btnDeleteEmailTemplate").show();
                }else {
                    $("#selEmailTemplate").html("<option value='0'>No Template</option>");
                    $("#emailSubject").val("");
                    $("#emailContent").val("");
                    $("#emailContent").parent().find(".redactor_editor").html("");
                    $("#btnUpdateEmailTemplate").hide();
                    $("#btnDeleteEmailTemplate").hide();
                }
            }
            else if (parseInt(modeType) == 2) {
                $("#remainingChars").text("");
                $("#messagesCnt").text("");
                if (res.Success == "True") {
                    if (res.Templates.length > 0) {
                        resHtml = "";
                        var latestSmsTemplateId = 0;
                        if (parseInt(templateId) > 0) {
                            $("#smsContent").val(res.Templates[0].TemplateContent);
                            $("#selSmsTemplate").val(res.Templates[0].Id);
                        } else {
                            for (var i = 0; i < res.Templates.length; i++) {
                                resHtml += "<option value='" + res.Templates[i].Id + "'>" + res.Templates[i].TemplateName + "</option>";
                                if (parseInt(templateId) == 0) {
                                    if (i == (res.Templates.length - 1)) {
                                        latestSmsTemplateId = parseInt(res.Templates[i].Id);
                                    }
                                }
                            }
                            $("#selSmsTemplate").html(resHtml);
                            if (parseInt(latestSmsTemplateId) > 0) {
                                getTemplates(2, latestSmsTemplateId);
                            }
                        }
                    } else {
                        $("#selSmsTemplate").html("<option value='0'>No Template</option>");
                        $("#smsContent").val("");
                    }
                    $("#btnUpdateSmsTemplate").show();
                    $("#btnDeleteSmsTemplate").show();
                }else {
                    $("#selSmsTemplate").html("<option value='0'>No Template</option>");
                    $("#smsContent").val("");
                    $("#btnUpdateSmsTemplate").hide();
                    $("#btnDeleteSmsTemplate").hide();
                }
                
            } else {
                $("#selSmsTemplate").html("<option value='0'>No Template</option>");
                $("#selEmailTemplate").html("<option value='0'>No Template</option>");
                $("#emailSubject").val("");
                $("#emailContent").val("");
                $("#smsContent").val("");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#selSmsTemplate").html("<option value='0'>No Template</option>");
            $("#selEmailTemplate").html("<option value='0'>No Template</option>");
            $("#emailSubject").val("");
            $("#emailContent").val("");
            $("#smsContent").val("");
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