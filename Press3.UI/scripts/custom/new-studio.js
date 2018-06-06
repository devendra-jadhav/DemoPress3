var regk = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var regm = /^((\+){0,1}91(\s){0,1}(\-){0,1}(\s){0,1}){0,1}[9|8|7][0-9](\s){0,1}(\-){0,1}(\s){0,1}[0-9]{1}[0-9]{7,}$/;
var diagram, nodeid = 0, sx = 450, sy = 30, y_dist = 100, adj = 6, color = '#96acbb', cur_nid = 1, ivrid = "", draggable_container;
//var end_nodes = ['hang up', 'sms', 'email', 'fax', 'ring group'];
var end_nodes = ['fax', 'ring group'];
var no_next_nodes = ['goto', 'sms to caller', 'sms to user', 'send email'];
var end_flow_nodes = ['end flow'];
var res_xml = {}, next_node_msg = "drop a control", del_sel_nid = 0, auto_save = 0;
var res_msg = {};
var day_name = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var time = [];
var distincttime = [];
var desc = "";
var flag = 0;
var pt_id;
var noco;
var select = 0;
var Is_File_Play = "", Is_File_Greetng = "", Is_File_InvldKey = ""; Is_File_thanks = "";
var Is_File_InvalidExt = "", Is_File_NoAns = "";
var vid, eid, langid;
var transliterationControl;
var tts_clip;
var language;
var transliterationControl;
var callback = $("#hdnactionUrl").val();
var ivr_type = "";
var hdn_ivrclipsurl = $("#hdn_ivrclipsurl").val();
var all_invalid_nodes = '';
var invalid_nodeid = '';
var dial_ext_all_invalid_nodes = '';
google.load("elements", "1", { packages: "transliteration" });
var a = {
    sourceLanguage: "en",
    //destinationLanguage: ["te", "hi", "kn", "ml", "ta", "ar", "ur", "ti", "sr", "si", "ru", "sa", "pa", "fa", "or", "ne", "mr", "gu", "el", "zh", "bn", "am"],
    destinationLanguage: ["hi", "te"],
    transliterationEnabled: false,
    shortcutKey: "ctrl+g"
};
google.setOnLoadCallback(onLoad);


var global_TimeSlots = "", global_Studio_Id = 0, global_isDraft = 0;
var delete_nodes = "";
var errchk = 0;

$(document).ready(function () {
   // $("#showPopup").modal("show");
    $("#ivr-toolbar li").on("mouseenter", function () {
        $('.drag_arrow').css("margin-left", $(this).position().left + "px");
        $(this).animate({ top: '5px' }, 5, function () { $('.drag_arrow span').fadeTo("slow", 1); });
    }).on("mouseleave", function () {
        $(this).animate({ top: '0px' }, 5, function () { $('.drag_arrow span').fadeTo("slow", 0); });
    });

    $(document).delegate(".RecordClipTime", "keypress", function(e){
        numericValidation(e);
    });

    $(document).delegate(".opt", "keypress", function (e) {
        numericValidation(e);
    });

    $(document).delegate("#draft-btn, #save-btn", "click", function () {
        $("#saveStudioSuccess, #saveStudioErr").html("");
        getAccountStudioPurposes();
        if ($('#ivr-flowchart .next-step').length > 0) {
                    $('#ivr-flowchart .next-step').addClass("invalid-node");
            //$('.alert-error').show().find('span').html("Please complete the flow");
                    alert("Please complete the flow");
                    $('html,body').animate({ scrollTop: $(".page-content").offset() }, 'slow');
                    return false;
                }
        var global_isDraft = $(this).attr("isdraft");
        if (global_isDraft == 0) {
            getAccountCallerIds();
            $("#trStudioPurpose").hide();
            $("#saveStudioSuccess, #saveStudioErr").html("");
            $("#saveStudioPopup").modal("show");
        } else {
            alert("Studio saved as draft successfully");
            window.location.href = "/NewStudio.aspx";
        }
    });
    $("#selStudioPurpose").change(function () {
        if ($(this).val() == "000") {
            $("#txtStudioPurpose").val("");
            $("#trStudioPurpose").show();
        } else {
            $("#txtStudioPurpose").val("");
            $("#trStudioPurpose").hide();
        }
    });
    //$("[name='radioCallType']").click(function () {
    //    if ($(this).is(":checked")) {
    //        var radioCheckedVal = $(this).val();
    //        if (radioCheckedVal == "0") {
    //            $("#trCallerIdNumbers").show();
    //        } else {
    //            $("#trCallerIdNumbers").hide();
    //        }
    //    } else {
    //        $("#trCallerIdNumbers").hide();
    //    }
    //});
    $("#btnSaveStudioDetails").click(function () {
        var studioName = $("#txtStudioName").val();
        if (studioName == "") {
            $("#saveStudioErr").html("Please enter name");
            return false;
        }
        var studioId = global_Studio_Id;
        var studioPurposeId = $("#selStudioPurpose option:selected").val();
        var studioPurpose = "";
        if (studioPurposeId == "0") {
            $("#saveStudioErr").html("Please select purpose");
            return false;
        }
        else if (studioPurposeId == "000"){
        studioPurpose =$("#txtStudioPurpose").val();
        if (studioPurpose == "") {
                $("#saveStudioErr").html("Please enter purpose");
                return false;
            }
        }
        if ($("[name='radioCallType']:checked").length > 0) {
            var isOutbound = $("[name='radioCallType']:checked").val();
        } else {
            $("#saveStudioErr").html("Please select studio type");
            return false;
        }
        var callerId = 0;
        callerId = $("#selCallerIdNumbers option:selected").val();
        if (isOutbound == "0") {
            if (callerId == "0") {
                $("#saveStudioErr").html("Please select callerId number");
                return false;
            }
        }

        var isActive = 0;
        if (global_isDraft == 0) {
            isActive = 1;
        } else {
            isActive = 2;
        }

        $.ajax({
            type: "GET",
            url: "Handlers/Studio.ashx",
            dataType: "JSON",
            async: false,
            data: {
                type: 12, callerId: callerId, isOutbound: isOutbound, isActive: isActive,
                studioId: global_Studio_Id, studioName: studioName, studioPurposeId: studioPurposeId,
                studioPurpose: studioPurpose
            },
            success: function (res) {
                $("#saveStudioErr").html("");
                if (res.Success == "True") {
                    $("#saveStudioSuccess").html("Studio created successfully");
                    window.location.href = "/Studios.aspx";
                } else {
                    $("#saveStudioErr").html(res.Message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#saveStudioErr").html("");
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

    //------------Voice mail starts-----------------------------------
    $(document).delegate(".sms-chk", "click", function () {
        var smsChkNodeId = $(this).attr("nodeId");
        if ($(this).is(":checked")) {
            $(".voiceSmsTemplate[nodeId='" + smsChkNodeId + "'").show();
        } else {
            $(".voiceSmsTemplate[nodeId='" + smsChkNodeId + "'").hide();
        }
    });
    $(document).delegate(".email-chk", "click", function () {
        var emailChkNodeId = $(this).attr("nodeId");
        if ($(this).is(":checked")) {
            $(".voiceEmailTemplate[nodeId='" + emailChkNodeId + "'").show();
        } else {
            $(".voiceEmailTemplate[nodeId='" + emailChkNodeId + "'").hide();
        }
    });
    //------------Voice mail ends-------------------------------------


    //------------Ring skill groups starts-----------------------------------
    $(document).delegate(".ringstrategy", "change", function () {
        var sklGrpNodeId = $(this).attr("nodeId");
        var sklGrpTxt = $(this).find("option:selected").attr("name");
        $("#selRingText_" + sklGrpNodeId).text(sklGrpTxt);
    });
    //------------Ring skill groups ends-------------------------------------

    //-----------Time of the day starts--------------------------------------
    $(document).delegate(".addTimeSlots", "click", function () {
        var timeSlotNodeId = $(this).attr("nodeId");
        var timeSlotNo = $("#ringUserDet_" + timeSlotNodeId).find('div.TimeSlotCounts').length;
        var nextSlotNo = parseInt(timeSlotNo) + 1;
        getTimeSlots();
        var resTimeSlotHtml = "";
        resTimeSlotHtml += "<div class='form-group TimeSlotCounts' id='timeSlotCount_" + timeSlotNodeId + "_" + nextSlotNo + "'><label class='label-head blocked'>Select Time Frame " + nextSlotNo + "</label>";
        resTimeSlotHtml += "<select class='form-control input-inline selTimeSlots' timeSlotNo='" + nextSlotNo + "' nodeId='" + timeSlotNodeId + "' id='selTimeSlot_" + timeSlotNodeId + "_" + nextSlotNo + "'>" + global_TimeSlots + "</select>";
        resTimeSlotHtml += "<a class='margin-left-5 viewTimeSlots' style='display:none;' timeSlotNo='" + nextSlotNo + "' nodeId='" + timeSlotNodeId + "' id='viewTimeSlot_" + timeSlotNodeId + "_" + nextSlotNo + "'>View</a>";
        //resTimeSlotHtml += "<a class='margin-left-5 delTimeSlots' timeSlotNo='" + nextSlotNo + "' nodeId='" + timeSlotNodeId + "' id='delTimeSlot_" + timeSlotNodeId + "_" + nextSlotNo + "'>Delete</a>";
        resTimeSlotHtml += "</div>";
        $("#TimeSlotCount_" + timeSlotNodeId).append(resTimeSlotHtml);
    });
    $(document).delegate(".selTimeSlots", "change", function () {
        var slotNo = $(this).attr("timeSlotNo");
        var nodeNo = $(this).attr("nodeId");
        var timeSlotId = $("#selTimeSlot_" + nodeNo + "_" + slotNo).find("option:selected").val();
        var timeSlotName = $("#selTimeSlot_" + nodeNo + "_" + slotNo).find("option:selected").text();
        if (parseInt(timeSlotId) > 0) {
            $("#viewTimeSlot_" + nodeNo + "_" + slotNo).show();
            //$("#delTimeSlot_" + nodeNo + "_" + slotNo).show();
        } else {
            $("#viewTimeSlot_" + nodeNo + "_" + slotNo).hide();
           // $("#delTimeSlot_" + nodeNo + "_" + slotNo).hide();
        }
        $("#showTimings_" + nodeNo).html("");
        $("#viewTiming_" + nodeNo).hide();
    });
    $(document).delegate(".viewTimeSlots", "click", function () {
        var slotNoView = $(this).attr("timeSlotNo");
        var nodeNoView = $(this).attr("nodeId");
        var timeSlotIdView = $("#selTimeSlot_" + nodeNoView + "_" + slotNoView).find("option:selected").val();
        var timeSlotNameView = $("#selTimeSlot_" + nodeNoView + "_" + slotNoView).find("option:selected").text();
        if (parseInt(timeSlotIdView) > 0) {
            getTimeSlotTimings(nodeNoView, timeSlotNameView, timeSlotIdView);
        } else {
            $("#showTimings_" + nodeNoView).html("");
            $("#viewTiming_" + nodeNoView).hide();
        }
    });
    $(document).delegate(".delTimeSlots", "click", function () {
        var slotNoDel = $(this).attr("timeSlotNo");
        var nodeNoDel = $(this).attr("nodeId");
         $("#timeSlotCount_" + nodeNoDel + "_" + slotNoDel).remove();
    });
    //-----------Time of the day ends--------------------------------------

    //-----------Email starts----------------------------------------------
    $(document).delegate(".selEmailTo", "change", function () {
        var dynNodeId = $(this).attr("nodeId");
        var emailToOption = $(this).val();
        if (emailToOption == "Other") {
            $("#txtEmailToOther_"+ dynNodeId).val("").show();
        } else {
            $("#txtEmailToOther" + dynNodeId).val("").hide();
        }
    });
    $(document).delegate(".selEmailCc", "change", function () {
        var emailCcDynNodeId = $(this).attr("nodeId");
        var emailToOption = $(this).val();
        if (emailToOption == "Other") {
            $("#txtEmailCcOther_"+ emailCcDynNodeId).val("").show();
        } else {
            $("#txtEmailCcOther_"+ emailCcDynNodeId).val("").hide();
        }
    });
    $(document).delegate(".selEmailTemplate", "change", function () {
        var templateId = $(this).val();
        var templateDynNodeId = $(this).attr("nodeId");
        if (templateId != "") {
            $.ajax({
                type: "GET",
                url: "Handlers/Studio.ashx",
                dataType: "JSON",
                async: false,
                data: { type: 6, mode: 1, templateId: templateId },
                success: function (res) {
                    if (res.Success == "True") {
                        if (res.Templates.length > 0) {
                            $("#txtAreaEmailContent_" + templateDynNodeId).text(res.Templates[0].TemplateContent).show();
                        } else {
                            $("#txtAreaEmailContent_" + templateDynNodeId).text("").hide();
                        }
                    }
                    else { $("#txtAreaEmailContent_" + templateDynNodeId).text("").hide(); }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#txtAreaEmailContent_" + templateDynNodeId).text("").hide();
                    if (jqXHR.status == 401) {
                        window.location.href = "/Login.aspx?message=Session expired";
                    } else if (jqXHR.status == 406) {
                        $("#modalPreviousSession").modal("show");
                    } else {
                        console.log(errorThrown);
                    }
                }
                });
        } else {
            $("#txtAreaEmailContent_" + templateDynNodeId).text("").hide();
        }
    });
    //-----------Email ends----------------------------------------------

    //-----------Sms starts----------------------------------------------
    $(document).delegate(".selSmsTo", "change", function () {
        var dynNodeId = $(this).attr("nodeId");
        var SmsToOption = $(this).val();
        if (SmsToOption == "Other") {
            $("#txtSmsToOther_" + dynNodeId).val("").show();
        } else {
            $("#txtSmsToOther" + dynNodeId).val("").hide();
        }
    });
    $(document).delegate(".selSmsCc", "change", function () {
        var SmsCcDynNodeId = $(this).attr("nodeId");
        var SmsToOption = $(this).val();
        if (SmsToOption == "Other") {
            $("#txtSmsCcOther_" + SmsCcDynNodeId).val("").show();
        } else {
            $("#txtSmsCcOther_" + SmsCcDynNodeId).val("").hide();
        }
    });
    $(document).delegate(".selSmsTemplate", "change", function () {
        var templateId = $(this).val();
        var templateDynNodeId = $(this).attr("nodeId");
        if (templateId != "") {
            $.ajax({
                type: "GET",
                url: "Handlers/Studio.ashx",
                dataType: "JSON",
                async: false,
                data: { type: 6, mode: 2, templateId: templateId },
                success: function (res) {
                    if (res.Success == "True") {
                        if (res.Templates.length > 0) {
                            $("#txtAreaSmsContent_" + templateDynNodeId).text(res.Templates[0].TemplateContent).show();
                        } else {
                            $("#txtAreaSmsContent_" + templateDynNodeId).text("").hide();
                        }
                    }
                    else { $("#txtAreaSmsContent_" + templateDynNodeId).text("").hide(); }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#txtAreaSmsContent_" + templateDynNodeId).text("").hide();
                    if (jqXHR.status == 401) {
                        window.location.href = "/Login.aspx?message=Session expired";
                    } else if (jqXHR.status == 406) {
                        $("#modalPreviousSession").modal("show");
                    } else {
                        console.log(errorThrown);
                    }
                }
            });
        } else {
            $("#txtAreaSmsContent_" + templateDynNodeId).text("").hide();
        }
    });
    //-----------Sms ends----------------------------------------------

    //$('#modalEmail').modal('show');
    //$('#btn_sel_type').click(function () {
    //    if ($('input[name=check_type]').is(':checked') == false) {
    //        $('#err_select_type').removeClass('hide').html("<span>Please select any radio button</span>");
    //        return false;
    //    }
    //    ivr_type = $('input[name=check_type]:checked').val();
    //    if (ivr_type == 'outbound') {
    //        $('#1_content .nodename').text("Outgoing Call");
    //        $('#time').hide();
    //        $('#ring').hide();
    //        //  $('#voice').hide();
    //        $('#email').hide();
    //        $('#sms').hide();
    //        $('#goto').hide();
    //        $('#menu').show();
    //        //$('#pl_msg_opt').show();
    //        //$('#conf').show();
    //        callback = $('#hdn_obd_callback').val();
    //    } else {
            //$('#1_content .nodename').text("Incoming Call");
            //$('#menu').show();
            //$('#time').show();
            //$('#ring').show();
            //$('#voice').show();
            //$('#email').show();
            //$('#sms').show();
            //$('#goto').show();
            //$('#pl_msg_opt').hide();
            //$('#conf').hide();
            //            $('#play_options').hide();
           // callback = $("#hdn_inbnd_callback").val();
        //}
       // $('#select_type').modal('hide');
   // });

    draggable_container = $("#ivr-toolbar li span");
    diagram = new Diagram({
        'xPosition': 20,
        'yPosition': 30,
        'imagesPath': '/assets/img/',
        'connectionColor': '#96acbb',
        'noToolbar': true,
        'containerid': 'ivr-flowchart',
        onSave: function (data) {
            if (auto_save == 0) {
                $('#ivr_name_box').modal('hide');
                $('#camp_name_popup').modal('hide');
                $.blockUI({ message: "<h4>saving...</h4>" });
                saveivr(data, auto_save);
                $.unblockUI();
            } else {
                saveivr(data, auto_save);
                auto_save = 0;
            }

        },
        onBeforeDelete: function (id, prev_id) {
            var x = parseInt($("#" + prev_id).css("left").replace('px', ''));
            var y = parseInt($("#" + prev_id).css("top").replace('px', ''));
            var prev_content = $('#' + prev_id).find('.nodename').html().toLowerCase();
            prt_id = $('#' + id).attr("p_id");
            if ((prev_content != 'menu')) {
                addnode(next_node_msg, x + adj, (y + y_dist), '', '', 'next-step', prt_id);
                diagram.addConnection(new Connection(prev_id, 's', nodeid, 'n', color, 3, ''));
            }
        },
        onDelete: function (id) {
            $('#module_' + id).remove();
            delete_nodes = delete_nodes + id + ",";
            if (res_xml[id]) { delete res_xml[id]; }
            arrangesteps();
        },
        onSelect: function (id) {
            select = 1;
            $('.module').hide();
            pt_id = $('#' + id).attr("p_id");
            noco = $('#' + pt_id).find('.nodename').html().toLowerCase();
            if (($('#' + id).attr("parentid")) != "") {
                var pid = $('#' + id).attr("parentid");
                $('#module_' + pid).modal('show');
                draggable_container.draggable("disable");
            }
            else if ($('#module_' + id).length > 0) {
                $('#module_' + id).modal('show');
                draggable_container.draggable("disable");
            }
            if ($(".nodecontent.selected").length > 0) {
                $('#ivr-flowchart').addClass("low");
                $('.controls_row').addClass("high");
            }
            else {
                $('#ivr-flowchart').removeClass("low");
                $('.controls_row').removeClass("high");
            }
        },
        onNodeDelete: function (id) {
            del_sel_nid = id;
            $('#del_cnfm_control').modal('show');
        }
    });

    addnode('Call', sx, sy, '', '', 'default-nodes', '');
    addnode(next_node_msg, sx + adj, (sy + y_dist), '', '', 'next-step', nodeid);
    diagram.addConnection(new Connection(1, 's', 2, 'n', color, 3, ''));

    draggable_container.draggable({
        appendTo: "body",
        helper: "clone",
        cursor: "move"
    });


    $('#del_ok').click(function () {
        var prev_id = 0;
        diagram.setNodeAffectedConnections(del_sel_nid);
        var node = diagram.getNodeById(del_sel_nid);
        if (node.affectedConnections.length > 0) { prev_id = node.affectedConnections[0].nodeFrom }
        if (diagram.onBeforeDelete != null) { diagram.onBeforeDelete(del_sel_nid, prev_id); }
        diagram.deleteNode(del_sel_nid);
        $('#del_cnfm_control').modal('hide');
        auto_save_db();
    });

    $("#del_cnfm_control").on('hidden.bs.modal', function () { del_sel_nid = 0; });
    $("#addnew-agent").on('hidden.bs.modal', function () { $("#module_" + cur_nid).show(); });
    $("#addnew-agent").on('shown.bs.modal', function () {
        $('#addnew-agent input[type=text]').val('');
        $('#add_agent_err_div').addClass('hide');
    });
    $('#btn_agent_save').click(function () { add_new_agent(); });
    $('#ivr_popups').delegate(".add_new_agent", "click", function () {
        cur_nid = $(this).attr('nodeid');
        $('#module_' + cur_nid).hide();
        $('#addnew-agent').modal('show');
    });
    //$('#save-btn').click(function () {
    //    if ($('#ivr-flowchart .next-step').length > 0) {
    //        $('#ivr-flowchart .next-step').addClass("invalid-node");
    //        $('.alert-error').show().find('span').html("Please complete the flow");
    //        $('html,body').animate({ scrollTop: $(".page-content").offset() }, 'slow');
    //        return false;
    //    }
    //    if (ivr_type == 'inbound') {
    //        get_ivr_stock_numbers();
    //        $('#ivr_name_box').modal('show');
    //    } else {
    //        $('#camp_name_popup').modal('show');
    //    }
    //});
    $('#pop_save_btn').click(function () {
        var n = $('#ivr_name').val();
        if (n == "") { alert("Please enter name for this IVR"); return false; }
        if (n.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
            alert("Name contains invalid characters."); return false;
        }
        if ($('input.rbt_no_list:checked').length == 0) {
            alert("please select any number");
            return false;
        }
        diagram.toXML();
    });

    $('#obd_save').click(function () {
        if ($('#obd_name').val() == '') {
            $('#err_upld_contct').removeClass("hide").html("<span class='alert-error'>please give name for IVR</span>");
            return false;
        } else {
            if ($('#obd_name').val().match(/([\<])([^\>]{1,})*([\>])/i) != null) {
                alert("Name contains invalid characters."); return false;
            }
        }
        if ($('#txtivrsummary').val() == '') {
            $('#err_upld_contct').removeClass("hide").html("<span class='alert-error'>please enter summary regarding IVR</span>");
            return false;
        } else {
            if ($('#txtivrsummary').val().match(/([\<])([^\>]{1,})*([\>])/i) != null) {
                $('#err_upld_contct').removeClass("hide").html("<span class='alert-error'>Conference Summary contains invalid characters</span>");
                return false;
            }
        }
        if ($('#ddlcategory').val() == 0) {
            $('#err_upld_contct').removeClass("hide").html("<span class='alert-error'>please select category of IVR</span>");
            return false;
        }
        if ($('#txtschname').val() == '') {
            $('#err_upld_contct').removeClass("hide").html("<span class='alert-error'>please enter scheme name</span>");
            return false;
        }

        diagram.toXML();
    });

    $('#pop_cancel_btn').click(function () {
        $('#ivr_name_box').modal('hide');
    });
    //-----------------------------------------------------------------///
    //    $('#ivr_popups').delegate(".sel_lang_cls", "change", function () {
    //        var div_num = $(this).attr("nodeid");
    //        var lid = $("#lang_" + div_num + " option:selected").attr("lid");
    //        var t = $(this).val();
    //        if ((t == 1) || (t == 32)) {
    //            var sid = $("#lang_" + div_num + " option:selected").attr("sid");
    //            transliterationControl.setLanguagePair(google.elements.transliteration.LanguageCode.ENGLISH, 'te')
    //            transliterationControl.disableTransliteration();
    //        }
    //        else if (t == 0) {
    //            transliterationControl.disableTransliteration();
    //        }
    //        else {
    //            /*var txtArr_crt = ["txtArea_" + div_num + ""];
    //            $('#div_que' + div_num + ' .txtAnsCls').each(function () {
    //            txtArr_crt.push($(this).attr("id"));
    //            })*/
    //            var txtArr_crt = $('#ivr_popups .textmessage textarea');

    //            transliterationControl.makeTransliteratable(txtArr_crt);
    //            transliterationControl.enableTransliteration();
    //            transliterationControl.setLanguagePair(google.elements.transliteration.LanguageCode.ENGLISH, t)
    //        }
    //        // ttsagentload(lid, div_num);
    //    });


    //-----------------------------------------------------------------///    
    $('#ivr_popups').delegate("input[type=checkbox].sms-to-caller,input[type=checkbox].sms-to-user,input[type=checkbox].send-email,input[type=checkbox].sms,input[type=checkbox].voicemail", "click", function () {
        $(this).parent().parent().find(".list-content").toggle('slideDown');
    });
    $('#ivr_popups').delegate("select.sms-to-user", "change", function () {
        var e = $(this).find('option:selected').attr("email");
        var m = $(this).parent().parent().parent().find('textarea.mails');
        if ($.trim(m.val()) == "") { m.val(e); }
        var from = $(this).find('option:selected').attr("from");
        var time = $(this).find('option:selected').attr("time");
        var keys = $(this).find('option:selected').attr("digits");
        var f = $(this).parent().parent().find('textarea.sms-to-user');
        f.val()
    });

    $('#ivr_popups').delegate("select.select-box", "change", function () {
        var e = $(this).find('option:selected').attr("email");
        var m = $(this).parent().parent().find('textarea.mails');
        if ($.trim(m.val()) == "") { m.val(e); }

    });

    $('#ivr_popups').delegate(".minimize", "click", function () {
        id = $(this).attr("moduleid");
        if ($('#module_' + id).find('.module-update').length > 0) {
            $('#module_' + id).modal('hide');
            draggable_container.draggable("enable");
        }
    });

    $('#ivr_popups').delegate('.module-save', 'click', function () {
        var module = $(this).attr("module");
        var nid = $(this).attr("nodeid");
        savemodule(nid, module);
    });

    $('#ivr_popups').delegate('.module-update', 'click', function () {
        var module = $(this).attr("module");
        var nid = $(this).attr("nodeid");
        updatemodule(nid, module);
    });

    $('#ivr_popups').delegate('.module-cancel', 'click', function () {
        var nid = $(this).attr("nodeid");
        $('#module_' + nid).modal('hide');
    });

    $('#ivr_popups').delegate('.menu-option-head button.addmore', 'click', function () {
        $(this).parent().parent().append("<div class='menu-option'><input type='text' class='opt form-control'/><input type='text' class='opt_val form-control'/></div><div class='remove-menu-options'>&nbsp&nbsp<i class='fa fa-times'></i></div><div class='clear'></div>");
    });
    $("#ivr_popups").delegate(".remove-menu-options", "click", function () {
        $(this).prev().remove();
        $(this).remove();
    });

    $('#ivr_popups').delegate('.addnew', 'click', function () {
        var nid = $(this).attr("nodeid");
        var module = $(this).attr("module");
        $('#module_' + nid).find('.addnew-form').show();
        showaddnewform(nid, module);
    });
    $('#ivr_popups').delegate('.addnew-cancel', 'click', function () {
        var nid = $(this).attr("nodeid");
        $('#addnew_form_' + nid).hide();
        $('#module_' + nid).show().modal("show");
    });
    $('#ivr_popups').delegate('.addnew-save', 'click', function () {
        var nid = $(this).attr("nodeid");
        var module = $(this).attr("module");
        saveaddnew(nid, module);
    });
    //    $('#ivr_popups').delegate('.addnew-update', 'click', function () {
    //        alert('hii');
    //        var nid = $(this).attr("nodeid");
    //        var module = $(this).attr("module");
    //        updateaddnew(nid, module);

    //        $('#addnew_form_' + nid).hide();
    //        $('#module_' + nid).show().modal("show");

    //    });
    $('#ivr_popups').delegate('.chk,.bootstrap-timepicker,.head-chk', 'click', function () {
        flag = 1;
    });
    $('#ivr_popups').delegate('.addnew-update', 'click', function () {
        var nid = $(this).attr("nodeid");
        var module = $(this).attr("module");
        if (flag == 1) {
            var chk = confirm("You are already using this time of the day in another IVR. If you update these changes , it will effect other IVR's. Do you want to continue ?");
            if (chk == true) {
                updateaddnew(nid, module);
            } else {
                var nid = $(this).attr("nodeid");
                $('#addnew_form_' + nid).hide();
                $('#module_' + nid).show().modal("show");
            }
            flag = 0;
        } else {
            updateaddnew(nid, module);
        }
    });
    $('#ivr_popups').delegate('.customize-btn', 'click', function () {
        var nid = $(this).attr("nodeid");
        var m = $('#addnew_form_' + nid);
        m.find('tr.week').toggle();
        m.find('tr.week-days').toggle();
        m.find('.week-days input.from').val(m.find('input.head-from').val());
        m.find('.week-days input.to').val(m.find('input.head-to').val());
    });
    $('#ivr_popups').delegate('.addnew-form input.head-from,.addnew-form input.from,.menu-option .opt', 'keypress',
			function (e) {
			    var code = (e.keyCode ? e.keyCode : e.which);
			    if ((code > 64) && (code < 123)) {
			        e.preventDefault();
			    }
			});
    $('#ivr_popups').delegate('input.greeting_rd,input.invalid_rd,input.thanks_rd,input.NoAns_rd,input.InvalidExt_rd', 'click', function (e) {
        var n = $(this).attr("nodeid");
        var m = $('#module_' + n);
        if (this.value == 'text') {
            m.find($('.' + $(this).attr("parent")).find('.uploadfile')).hide();
            m.find($('.' + $(this).attr("parent")).find('.textmessage')).show();
            m.find($('.' + $(this).attr("parent")).find('.textmessage')).show();
        }
        else if (this.value == 'file') {
            m.find($('.' + $(this).attr("parent")).find('.uploadfile')).show();
            m.find($('.' + $(this).attr("parent")).find('.textmessage')).hide();
            m.find($('.' + $(this).attr("parent")).find('.ddl_lang')).show();

        }
    });

    $('#ivr_popups').delegate('.audio_player .uploadnew', 'click', function (e) {
        m = $(this).parent().hide().parent().find('input[type=file]').show();
        $(this).parent().hide().parent().find('input.file-cancel').show();
        $('.btn file-cancel').show();
        m.find('input[type=file]').val('');
        var specificID = $(this).parent().parent().parent().attr('id');
        var specificUploadID = $(this).parent().parent();
        $('#' + specificID + ' .uploadfile[nodeid="' + $(this).attr("nodeid") + '"]').attr('path', '');
        specificUploadID.attr('path', '');
        //m.find('.btn file-cancel').show();
    });
    $('#ivr_popups').delegate('.file-cancel', 'click', function (e) {
        //$(this).parent().hide().parent().find('.audio_player').show();	
        //        alert('hii');
        //      
        $('.audio_player').show();
        //        $('.uploadnew').show();
        //        alert('123');
        //        //var m = $(this).parent().hide().parent().find('input[type=file]').hide();
        //        alert('777777');

        //$(this).parent().hide().parent().find('.audio_player').show();


    });

    $("#ivr-toolbar li").click(function () {
        if (noco == "call") {
            if ($(this).find('span').html().toLowerCase() == "end flow" || $(this).find('span').html().toLowerCase() == "goto" || $(this).find('span').html().toLowerCase() == "hang up") {
                    alert("Invalid Control");
                    return false;
            }
        }

        if (noco == 'ring user(s)') {
            n_name = $(this).find('span').html();
            clk = ["Hang Up", "Email", "SMS", "End flow"];
           // if ($.inArray(n_name, clk) >= 0) {

                if ($(".nodecontent.selected").length > 0) {
                    var nid = $(".nodecontent.selected").attr("id").replace("_content", "");
                    m = $('#' + nid);
                    var nname = '';
                    cur_nid = nid;
                    nname = $(this).find('span').html();
                    $.blockUI({ message: "<h4>Loading...</h4>" });
                    var x = parseInt(m.css("left").replace('px', ''));
                    var y = parseInt(m.css("top").replace('px', ''));
                    diagram.updateNodeContent(cur_nid, nname);
                    m.find('.nodecontent .nodename').html(nname);
                    if ($.inArray(nname.toLowerCase(), end_nodes) >= 0) {
                        addnode('End call', x + adj, (y + y_dist), '', '', 'default-nodes', cur_nid);
                        diagram.addConnection(new Connection(parseInt(m.attr("id")), 's', nodeid, 'n', color, 3, ''));
                    }
                    else if ($.inArray(nname.toLowerCase(), no_next_nodes) >= 0) { }
                    else if ($.inArray(nname.toLowerCase(), end_flow_nodes) >= 0) { }
                    else {
                        addnode(next_node_msg, x + adj, (y + y_dist), '', '', 'next-step', cur_nid);
                        diagram.addConnection(new Connection(parseInt(m.attr("id")), 's', nodeid, 'n', color, 3, ''));
                    }
                    m.removeClass("next-step").removeClass("invalid-node").droppable("destroy");
                    m.find('.selected').removeClass("selected");
                    $('#ivr-flowchart').removeClass("low");
                    $('.controls_row').removeClass("high");
                    diagram.updateClassName(cur_nid, "");
                    cur_nid = nid;
                    if (nname.toLowerCase() == "end flow" || nname.toLowerCase() == "hang up") {
                        savemodule(cur_nid, nname.toLowerCase());
                        $.unblockUI();
                    }
                    else {
                        $.ajax({
                            url: "Handlers/Studio.ashx",
                            data: { type: 1, nodeOption: nname, nodeId: cur_nid },
                            dataType: "json",
                            type: "POST",
                            success: function (data) {
                                $.unblockUI();
                                if (data.Status == 1) {
                                    generatepopup(data.Data, nname);
                                } else if (data.Status == 401) {
                                    redirect_to_login_page();
                                } else if (data.Status == 2) {
                                   // if (nname.toLowerCase() == "email") {
                                        generatepopup(data.Data, nname);
                                   // } else if (nname.toLowerCase() == "sms") {
                                      //  generatepopup(data.Data, nname);
                                   // } else {
                                      //  alert(data.ErrorReason);
                                   // }
                                } else {
                                    alert(data.ErrorReason);
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
                    // SelectPop(nname, cur_nid);
                }
            //} else {
            //    alert("Invalid Control");
            //}
        } else {
            if ($(".nodecontent.selected").length > 0) {
                var nid = $(".nodecontent.selected").attr("id").replace("_content", "");
                m = $('#' + nid);
                var nname = '';
                cur_nid = nid;
                nname = $(this).find('span').html();
                $.blockUI({ message: "<h4>Loading...</h4>" });
                var x = parseInt(m.css("left").replace('px', ''));
                var y = parseInt(m.css("top").replace('px', ''));
                diagram.updateNodeContent(cur_nid, nname);
                m.find('.nodecontent .nodename').html(nname);
                if ($.inArray(nname.toLowerCase(), end_nodes) >= 0) {
                    addnode('End call', x + adj, (y + y_dist), '', '', 'default-nodes', cur_nid);
                    diagram.addConnection(new Connection(parseInt(m.attr("id")), 's', nodeid, 'n', color, 3, ''));
                }
                else if ($.inArray(nname.toLowerCase(), no_next_nodes) >= 0) { }
                else if ($.inArray(nname.toLowerCase(), end_flow_nodes) >= 0) { }
                else {
                    addnode(next_node_msg, x + adj, (y + y_dist), '', '', 'next-step', cur_nid);
                    diagram.addConnection(new Connection(parseInt(m.attr("id")), 's', nodeid, 'n', color, 3, ''));
                }
                m.removeClass("next-step").removeClass("invalid-node").droppable("destroy");
                m.find('.selected').removeClass("selected");
                $('#ivr-flowchart').removeClass("low");
                $('.controls_row').removeClass("high");
                diagram.updateClassName(cur_nid, "");
                cur_nid = nid;
                if (nname.toLowerCase() == "end flow" || nname.toLowerCase() == "hang up") {
                    savemodule(cur_nid, nname.toLowerCase());
                    $.unblockUI();
                }
                else {
                    $.ajax({
                        url: "Handlers/Studio.ashx",
                        data: { type: 1, nodeOption: nname, nodeId: cur_nid },
                        dataType: "JSON",
                        type: "POST",
                        success: function (data) {
                            $.unblockUI();
                            if (data.Status == 1) {
                                generatepopup(data.Data, nname);
                            } else if (data.Status == 401) {
                                redirect_to_login_page();
                            } else if (data.Status == 2) {
                               // if (nname.toLowerCase() == "email") {
                                    generatepopup(data.Data, nname);
                               // } else if (nname.toLowerCase() == "sms") {
                               //     generatepopup(data.Data, nname);
                               // } else {
                               //     alert(data.ErrorReason);
                               // }
                            } else {
                                alert(data.ErrorReason);
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
                //SelectPop(nname, cur_nid);
            }

        }
    });
    $('#ivr_popups').delegate('.time-edit', 'click', function (e) {
        // $('.addnew-update').hide()
        var nid = $(this).attr("nodeid");
        var m = $('#addnew_form_' + nid);
        m.find(".header").removeClass("header").addClass("header").html("<h3>Edit new time of the day</h3>");
        m.find('tr.week').hide();
        m.find('tr.week-days').show();
        // m.find('tr.week').hide();
        // $('#module_' + nid).hide();
        m.show();
        m.find(".addnew-save").removeClass("addnew-save").addClass("addnew-update").html("Update");
        var tid = $('#module_' + nid).find('.time-dropdown').val();
        m.find("input.name").val($('#module_' + nid).find('.time-dropdown option:selected').attr('name'));
        m.find("input.head-from").val(m.find("input.from").val());
        m.find("input.head-to").val(m.find("input.to").val());
        m.find("input.chk").prop({ checked: false });
        $.ajax({
            url: "get_time_of_the_day.aspx",
            dataType: "json",
            data: { tid: tid, type: 1 },
            type: "POST",
            success: function (data) {
                if (data.Status == 1) {
                    var l = data.items.length;
                    for (var i = 0; i < l; i++) {
                        var mm = m.find("tr[name='" + data.items[i].day + "']");
                        mm.find("input.from").val(data.items[i].from_time);
                        mm.find("input.to").val(data.items[i].to_time);
                        mm.find("input.chk").prop({ checked: true })
                    }
                } else if (data.Status == 401) {
                    redirect_to_login_page();
                } else {
                    alert(data.ErrorReason);
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

    });

    $('#ivr_popups').delegate('.agents-list li:not(.selected)', 'click', function (e) {
        var m = $(this);
        var nid = m.parent().attr("nodeid");
        var con = "";
        con = '<li class="ui-state-default" aid="' + m.attr("aid") + '" id="selagent_' + nid + '_' + m.attr("aid") + '" ><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' + m.attr("name") + '<span class="remove">X</span></li>';
        $('#module_' + nid).find('ul.sortable-list').append(con);
        m.addClass("selected");
       // showhide_r_str(nid);
    });

    $('#ivr_popups').delegate('.sortable-list li .remove', 'click', function (e) {
        var m = $(this).parent();
        var nid = m.parent().attr("nodeid");
        $('#agent_' + nid + '_' + m.attr("aid")).removeClass("selected");
        m.remove();
        $(".agents-list li[aid='" + m.attr("aid") + "']").removeClass("selected");
       // showhide_r_str(nid);
    });

    $('#ivr_popups').delegate('.chk,.bootstrap-timepicker,.head-chk', 'click', function () {
        $('.addnew-update').show();
    });

});


function addnode(name, x, y, ntxt, parentid, nclass, p_id) {
    nodeid = nodeid + 1;
    var w = '150', h = '65';
    //if(name==next_node_msg){w='180';}
    diagram.addNode(new Node({
        'nodeId': nodeid,
        'nodeText': ntxt,
        'nodeType': 'NODE',
        'nodeContent': name,
        'parentid': parentid,
        'xPosition': x,
        'yPosition': y,
        'width': w,
        'height': h,
        'bgColor': '#FFFFFF',
        'borderColor': '#AAAAAA',
        'borderWidth': '1',
        'fontColor': '#000000',
        'fontSize': '',
        'fontType': '',
        'minHeight': 50,
        'maxHeight': 200,
        'minWidth': 100,
        'maxWidth': 200,
        'nPort': true,
        'ePort': true,
        'sPort': true,
        'wPort': true,
        'image': '',
        'draggable': true,
        'resizable': false,
        'editable': true,
        'selectable': true,
        'deletable': true,
        'nPortMakeConnection': true,
        'ePortMakeConnection': true,
        'sPortMakeConnection': true,
        'wPortMakeConnection': true,
        'nPortAcceptConnection': true,
        'ePortAcceptConnection': true,
        'sPortAcceptConnection': true,
        'wPortAcceptConnection': true,
        'className': nclass,
        'childNodes': '',
        'p_id': p_id
    }));

    if (name == next_node_msg) { setdroppable(nodeid); }
    arrangesteps();
}

function saveivr(xml_data, autosaveval) {
    var n = '', ivrsumm = "", category = 0, scheme = "";
    var no_id = $('input.rbt_no_list:checked').val();
    if (ivr_type == 'outbound') {
        n = $('#obd_name').val();
    } else {
        n = $('#ivr_name').val();
    }
    if (autosaveval == "1") {
        if (cur_nid <= 1) { return false };
       
        //var now = new Date(Date.now());
        //var formatted = now.getMonth() + "_" + now.getDate() + "_" + now.getFullYear() + "_" + now.getHours() + "_" + now.getMinutes() + "_" + now.getSeconds();
        n = "studio_" + my_date_format(new Date());
    }
    //ivrsumm = $('#txtivrsummary').val();
    //category = $('#ddlcategory').val();
    //scheme = $('#txtschname').val();
    $.ajax({
        url: "Handlers/Studio.ashx",
        type: "post",
        async: false,
        data: {
            type: 2, studioXml: xml_data, studioData: JSON.stringify(res_xml), studioId: ivrid, studioName: n, autosaveval: autosaveval,
            isActive: 2, deleteNodes: delete_nodes
        },
        dataType: "json",
        success: function (s) {
            if (s.Success == "True") {
                ivrid = s.RetStudioId;
                global_Studio_Id = s.RetStudioId;
            } else {
                console.log(s.Message);
            }
            //if (autosaveval == 0) {
            //    window.location = '/ivr_studio.aspx';
            //}
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

var generatepopup = function (popup_content, nodeName) {
    $(".errordiv[nodeId='" + cur_nid + "']").html("");
    if ($.trim(popup_content) != "") {
        //$('#ivr_popups').append("<div id='module_" + cur_nid + "' role='dialog' class='modal fade' nodeid='" + cur_nid + "' data-focus-on='input:first'><div class='modal-dialog'>" + popup_content + "</div></div>");
        $('#ivr_popups').append("<div id='module_" + cur_nid + "' nodeid='" + cur_nid + "' role='dialog' class='modal fade' data-focus-on='input:first'><div class='modal-dialog'><div class='modal-content'>" + popup_content + "</div></div></div></div>");
        $('#module_' + cur_nid).find('.module-save,.module-cancel,.addnew,.addnew-cancel,.addnew-save,.head-chk,.ringgroup,#add_con_to_grp,.btn_add_con_to_grp,.a_add_user,.a_add_new_user,.groupsave,.add_new_agent,.customize-btn,.time-edit,.sortable-list,.agents-list').attr("nodeid", cur_nid);
        draggable_container.draggable("disable");
        steps_con = '';

        var child_txt = '', c_nodes, s_child_txt;
        var con = "";//m.find('.time-dropdown').val();
        c_nodes = diagram.getNodes();
       
        console.log(c_nodes);


        //if ($('.step-no').length == 0 && nodeName == "Menu") {
        //    steps_con += "<option value='" + cur_nid + "' >1</option>";
        //} else {
            $('.step-no').each(function () {
                if (nodeName == "goto" && $(this).attr('nodeid') == cur_nid) { }
                else {
                    steps_con += "<option value='" + $(this).attr('nodeid') + "' >" + $(this).html() + "</option>";
                    if ($(this).attr('step') == cur_nid) { return false; }
                }
            });
       // }
        steps_con = "<select class='form-control input-inline' style='float:none;'>" + steps_con + "</select>";

        $('#module_' + cur_nid).find('.steps-options').html(steps_con);
        //$('#module_' + cur_nid).find('.steps-options select').val(cur_nid);
        if ($('#module_' + cur_nid).find('.addnew-form').length > 0) {
            $("#module_" + cur_nid + " .addnew-form").appendTo("#ivr_popups");
        }
    }

    $("#module_" + cur_nid).modal("show");
    $("#module_" + cur_nid).on('hidden.bs.modal', function () {
        var nid = $(this).attr("nodeid");
        if ($('#module_' + nid).find('.module-update').length > 0) {
            $('#module_' + nid).modal('hide');
            draggable_container.draggable("enable");
        } else {
            var fnid = $('#' + nid).attr("fromnode");
            var x = parseInt($("#" + fnid).css("left").replace('px', ''));
            var y = parseInt($("#" + fnid).css("top").replace('px', ''));
            diagram.deleteNode(nid);
            addnode(next_node_msg, x + adj, (y + y_dist), '', '', 'next-step', fnid);
            diagram.addConnection(new Connection(fnid, 's', nodeid, 'n', color, 3, ''));
            draggable_container.draggable("enable");
        }
    });
    /*if ($("#module_" + cur_nid).find('.module-save').attr("module") == "ring user(s)") {
    $("#module_" + cur_nid).css("position", "absolute");
    //ring_type_settings();
    $('#module_' + cur_nid).find('.sortable-list').sortable({ placeholder: "ui-state-highlight" });
    }
    else */
    //if ($("#module_" + cur_nid).find('.module-save').attr("module") == "menu") { $("#module_" + cur_nid).css("position", "absolute"); }
    //else if ($("#module_" + cur_nid).find('.module-save').attr("module") == "play_with_options") { $("#module_" + cur_nid).css("position", "absolute"); }
    //else if ($("#module_" + cur_nid).find('.module-save').attr("module") == "hang up") { $("#module_" + cur_nid).css("position", "absolute"); }
    //else if ($("#module_" + cur_nid).find('.module-save').attr("module") == "ring user(s)") { $("#module_" + cur_nid).css("position", "absolute"); }
    //else if ($("#module_" + cur_nid).find('.module-save').attr("module") == "time of the day") { $("#module_" + cur_nid).css("position", "absolute"); }
    //else if ($("#module_" + cur_nid).find('.module-save').attr("module") == "play message") { $("#module_" + cur_nid).css("position", "absolute"); }
    //else if ($("#module_" + cur_nid).find('.module-save').attr("module") == "voice mail") { $("#module_" + cur_nid).css("position", "absolute"); }

   // $("#module_" + cur_nid).show().modal("show");
    //ttsagentload(1, cur_nid);
    FilesUps("flUpload_11");
    FilesUps("flUpload_GttMsg");
    FilesUps("flUpload_thksMsg");
    FilesUps("flUpload_InvalidKey");
    FilesUps("flUpload_InvalidExt");
    FilesUps("flUpload_NoAns");
}
function ring_type_settings() {
    $('#module_' + cur_nid + ' select[class="agents"]').multiselect({
        buttonWidth: '160px',
        maxHeight: 120,
        onChange: function (element, checked) {
            showhide_r_str(cur_nid);
        }
    });
    $('#module_' + cur_nid + ' select[class="ringstrategy"]').multiselect({ buttonWidth: '160px', maxHeight: 120 });
    $('#module_' + cur_nid + ' .dropdown-toggle').dropdown();
}
function showhide_r_str(nid) {
    var selected_agents = '';
    $('#module_' + nid).find('.sortable-list li').each(function () {
        selected_agents += $(this).attr('value') + ', ';
    });
    if (selected_agents != "") {
        selected_agents = selected_agents.substr(0, selected_agents.length - 2)
    }
    if (selected_agents.indexOf(',') > 0) {
        $("#module_" + cur_nid).find('.modal-body .div_ringstragery select').removeClass("disabled").prop({ disabled: false });
    } else {
        $("#module_" + cur_nid).find('.modal-body .div_ringstragery select').addClass("disabled").prop({ disabled: true });
    }
}
function setdroppable(id) {

    $("#" + id).droppable({

        accept: '#ivr-toolbar li span',
        drop: function (event, ui) {

           

            cur_nid = this.id;
            pr_id = $('#' + cur_nid).attr("p_id");
            no_con = $('#' + pr_id).find(".nodename").html();
            drg = ["Hang Up", "Email", "SMS", "End flow"];

            if (no_con == "Call") {
                if (ui.draggable.html().toLowerCase() == "end flow" || ui.draggable.html().toLowerCase() == "goto" || ui.draggable.html().toLowerCase() == "hang up") {
                    alert("Invalid Control");
                    return false;
                }
            }

            if (no_con == 'Ring user(s)') {
               // if ($.inArray(ui.draggable.html(), drg) >= 0) {
                    $.blockUI({ message: "<h4>Loading...</h4>" });
                    var x = parseInt($(this).css("left").replace('px', ''));
                    var y = parseInt($(this).css("top").replace('px', ''));
                    diagram.updateNodeContent(cur_nid, ui.draggable.html());
                    $(this).find('.nodecontent .nodename').html(ui.draggable.html());
                    if ($.inArray(ui.draggable.html().toLowerCase(), end_nodes) >= 0) {
                        addnode('End call', x + adj, (y + y_dist), '', '', 'default-nodes', cur_nid);
                        diagram.addConnection(new Connection(this.id, 's', nodeid, 'n', color, 3, ''));
                    }
                    else if ($.inArray(ui.draggable.html().toLowerCase(), no_next_nodes) >= 0) { }
                    else if ($.inArray(ui.draggable.html().toLowerCase(), end_flow_nodes) >= 0) { }
                    else {
                        addnode(next_node_msg, x + adj, (y + y_dist), '', '', 'next-step', cur_nid);
                        diagram.addConnection(new Connection(this.id, 's', nodeid, 'n', color, 3, ''));
                    }
                    $(this).removeClass("next-step").removeClass("invalid-node").droppable("destroy");
                    $(this).find('.selected').removeClass("selected");
                    $('#ivr-flowchart').removeClass("low");
                    $('.controls_row').removeClass("high");
                    diagram.updateClassName(cur_nid, "");
                    cur_nid = id;
                    if (ui.draggable.html().toLowerCase() == "end flow" || ui.draggable.html().toLowerCase() == "hang up") {
                        savemodule(cur_nid, ui.draggable.html().toLowerCase());
                        $.unblockUI();
                    }
                    else {
                        $.ajax({
                            url: "Handlers/Studio.ashx",
                            data: { type: 1, nodeOption: ui.draggable.html(), nodeId: id },
                            type: "POST",
                            dataType: "JSON",
                            success: function (data) {
                                $.unblockUI();
                                if (data.Status == 1) {
                                    generatepopup(data.Data, ui.draggable.html());
                                } else if (data.Status == 401) {
                                    redirect_to_login_page();
                                } else if (data.Status == 2) {
                                    if (ui.draggable.html().toLowerCase() == "email") {
                                        generatepopup(data.Data, ui.draggable.html());
                                    } else if (ui.draggable.html().toLowerCase() == "sms") {
                                        generatepopup(data.Data, ui.draggable.html());
                                    } else {
                                        alert(data.ErrorReason);
                                    }
                                } else {
                                    alert(data.ErrorReason);
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

                    //SelectPop(ui.draggable.html(),id); 

                //}
                //else {
                //    alert("Invalid Control");
                //}
            } else {
                $.blockUI({ message: "<h4>Loading...</h4>" });
                var x = parseInt($(this).css("left").replace('px', ''));
                var y = parseInt($(this).css("top").replace('px', ''));
                diagram.updateNodeContent(cur_nid, ui.draggable.html());
                $(this).find('.nodecontent .nodename').html(ui.draggable.html());
                if ($.inArray(ui.draggable.html().toLowerCase(), end_nodes) >= 0) {
                    addnode('End call', x + adj, (y + y_dist), '', '', 'default-nodes', cur_nid);
                    diagram.addConnection(new Connection(this.id, 's', nodeid, 'n', color, 3, ''));
                }
                else if ($.inArray(ui.draggable.html().toLowerCase(), no_next_nodes) >= 0) { }
                else if ($.inArray(ui.draggable.html().toLowerCase(), end_flow_nodes) >= 0) { }
                else {
                    addnode(next_node_msg, x + adj, (y + y_dist), '', '', 'next-step', cur_nid);
                    diagram.addConnection(new Connection(this.id, 's', nodeid, 'n', color, 3, ''));
                }
                $(this).removeClass("next-step").removeClass("invalid-node").droppable("destroy");
                $(this).find('.selected').removeClass("selected");
                $('#ivr-flowchart').removeClass("low");
                $('.controls_row').removeClass("high");
                diagram.updateClassName(cur_nid, "");
                cur_nid = id;
                if (ui.draggable.html().toLowerCase() == "end flow" || ui.draggable.html().toLowerCase() == "hang up") {
                    savemodule(cur_nid, ui.draggable.html().toLowerCase());
                    $.unblockUI();
                }
                else {
                    $.ajax({
                        url: "Handlers/Studio.ashx",
                        data: { type: 1, nodeOption: ui.draggable.html(), nodeId: id },
                        dataType: "JSON",
                        type: "POST",
                        success: function (data) {
                            $.unblockUI();
                            if (data.Status == 401) {
                                redirect_to_login_page()
                            } else if (data.Status == 1) {
                                generatepopup(data.Data, ui.draggable.html());
                            } else if (data.Status == 2) {
                                if (ui.draggable.html().toLowerCase() == "email") {
                                    generatepopup(data.Data, ui.draggable.html());
                                } else if (ui.draggable.html().toLowerCase() == "sms") {
                                    generatepopup(data.Data, ui.draggable.html());
                                } else {
                                    alert(data.ErrorReason);
                                }
                            } else {
                                alert(data.ErrorReason);
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

                //SelectPop(ui.draggable.html(),id); 
            }
        }
    });
}

$(document).delegate('.RecordMessages', 'click', function () {
    var module = $(this).attr("module");
    var nid = $(this).attr("nodeid");
    savemodule(nid, module);
});

function savemodule(id, module) {
    var m = $('#module_' + id);
    m.find('.field_with_errors').removeClass('field_with_errors');
    m.find('.module-error').html("");
    var err = 0;
    var msg = "<table>";
    switch (module) {
        case 'end flow':
            var obj = {}; obj.type = "end flow"; obj.data = "<endflow></endflow>";
            res_xml[id] = obj;
            res_msg[id] = msg;
            break;
        case 'menu':
            var opt_arr = [], child_txt = "", con = "", validkeys = "", con1 = "", con_text = "", inv_language = "";
            var val = m.find("input[name=greeting_play_option_" + id + "]:checked").val();
            if (val == 'file') {
                if (m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path') != undefined) {
                    con = m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path').split("\\").pop();
                } else { con = "" }
                if (con == "") {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please upload file for greeting message");
                    return false;
                }
                var constr = (con.length > 15) ? con.substr(0, 15) + "..." : con;
                msg += "<tr><td>Greeting File Name:</td><td>" + constr + "</td></tr>";
                con = "<play>" + con + "</play>";
            }
            else if (val == 'text') {
                var conv_clip;
                conv_clip = m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .textmessage span').text();
                con = m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .textmessage textarea').val();
                language = m.find('.ddl_lang').val();
                tts_clip = m.find('#div_vclips span').text();
                //if (con.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
                //  alert("Text message contains invalid characters."); return false;
                //}

                if (language == '1') {
                    if (con == "") {
                        m.find(".errordiv[nodeId='" + id + "']").html("Please enter text for greeting message");
                        return false;
                    }
                    var constr = (con.length > 15) ? con.substr(0, 15) + "..." : con;
                    msg += "<tr><td>Greeting Text:</td><td>" + constr + "</td><td>";
                    con = "<speak>" + con + "</speak>";
                } else {
                    if (con == "") {
                        m.find(".errordiv[nodeId='" + id + "']").html("Please enter text for greeting message and convert it as clip");
                        return false;
                    }
                    ms = (con.length > 20) ? con.substr(0, 20) + "..." : con;
                    msg += "<tr><td><b>Greeting file: </b></td><td>" + tts_clip + "</td></tr></table>";
                    if (tts_clip.indexOf('http') > -1) {
                        con = "<play>" + tts_clip + "</play>";
                    } else {
                        con = "<play>" + hdn_ivrclipsurl + tts_clip + "</play>";
                    }
                }
            }
            //msg+="<tr><td colspan='2'>menu options</td>";
            m.find('.menu-option').each(function () {
                var opt = '', opt_val = '';
                opt = $(this).find('.opt').val();
                opt_val = $(this).find('.opt_val').val();
                if ((opt != "") && (opt_val != "")) {
                    var obj = {}; obj.id = opt; obj.name = opt_val;
                    //msg+="<tr><td>"+obj.id+"</td><td>"+obj.name+"</td></tr>";
                    opt_arr.push(obj);
                }
            });

            if (opt_arr.length == 0) {
                err = 1;
                m.find(".errordiv[nodeId='" + id + "']").html("Please fill the key options");
                return false;
            }
            m.find('.menu-option').each(function () {
                var opt = '', opt_val = '';
                opt = $(this).find('.opt').val();
                opt_val = $(this).find('.opt_val').val();
                if ((opt == "") && (opt_val == "")) { $(this).remove(); }
            });

            val = m.find("input[name=invalid_play_option_" + id + "]:checked").val();
            if (val == 'file') {
                if (m.find('.' + m.find("input[name=invalid_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path') != undefined) {
                    con1 = m.find('.' + m.find("input[name=invalid_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path').split("\\").pop();
                } else { con1 = "" }
                //con1 = Is_File_InvldKey;
                if (con1 == "") {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please upload file for invalid key");
                    return false;
                }
                var con1str = (con1.length > 15) ? con1.substr(0, 15) + "..." : con1str;
                msg += "<tr><td>invalid key play file:</td><td>" + con1str + "</td></tr>";
                con_text = hdn_ivrclipsurl + con1
                con1 = "<play>" + con1 + "</play>";
                console.log(hdn_ivrclipsurl)
                console.log(con1)
            }

            else if (val == 'text') {
                con1 = m.find('.' + m.find("input[name=invalid_play_option_" + id + "]:checked").attr("parent") + ' .textmessage textarea').val();
                inv_language = m.find('.ddl_lang1').val();
                //  if (con1.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
                //      alert("Text message contains invalid characters."); return false;
                //  }

                if (inv_language == '1') {
                    if (con1 == "") {
                        m.find(".errordiv[nodeId='" + id + "']").html("Please enter text for invalid key");
                        return false;
                    }
                    var con1str = (con1.length > 15) ? con1.substr(0, 15) + "..." : con1;
                    msg += "<tr><td>invalid key Text:</td><td>" + con1str + "</td><td>";
                    con_text = con1;
                    con1 = "<speak>" + con1 + "</speak>";
                } else {
                    if (con1 == "") {
                        m.find(".errordiv[nodeId='" + id + "']").html("Please enter text for invalid key and convert it as clip.");
                        return false;
                    }
                    //ms = (tts_clip.length > 20) ? tts_clip.substr(0, 20) + "..." : tts_clip;
                    msg += "<tr><td><b>Greeting file: </b></td><td>" + tts_clip + "</td></tr></table>";
                    con_text = hdn_ivrclipsurl + tts_clip + "";
                    if (tts_clip.indexOf('http') > -1) {
                        con1 = "<play>" + tts_clip + "</play>";
                    } else {
                        con1 = "<play>" + hdn_ivrclipsurl + tts_clip + "</play>";
                    }
                }

            }

            

            diagram.deleteNode(nodeid);

            console.log(diagram.getNodes);

            var r = getpositions(id, (opt_arr.length + 1));

            for (i = 0; i < opt_arr.length; i++) {
                addnode(opt_arr[i].name, r[i].x, r[i].y, opt_arr[i].id, id, 'text-nodes', id);
                diagram.addConnection(new Connection(id, 's', nodeid, 'n', color, 3, ''));
                child_txt += '"' + opt_arr[i].id + '":"' + nodeid + '",';
                m.find('div.menu-option:eq(' + i + ')').attr("nodeid", nodeid);
                addnode(next_node_msg, r[i].x + adj, (r[i].y + y_dist), '', '', 'next-step', nodeid);
                diagram.addConnection(new Connection((nodeid - 1), 's', nodeid, 'n', color, 3, ''));
                validkeys += opt_arr[i].id.toString();
            }
            addnode('Play message', r[i].x, r[i].y, 'Invalid key', id, 'menu-invalid-nodes', id);
            child_txt += '"invalid":"' + nodeid + '"';
            var obj1 = {}; obj1.type = "invalid"; obj1.data = con1;
            res_xml[nodeid] = obj1;

            diagram.addConnection(new Connection(id, 's', nodeid, 'n', color, 3, ''));
            diagram.addConnection(new Connection(nodeid, 'e', m.find('.steps-options select').val(), 'e', color, 3, ''));
            diagram.updateChildNodes(id, child_txt);

            


            //if (errchk == 1) {
            //    //var prev_id = 0;
            //    //diagram.setNodeAffectedConnections(nodeid);
            //    //var node = diagram.getNodeById(nodeid);
            //    //if (node.affectedConnections.length > 0) { prev_id = node.affectedConnections[0].nodeFrom }
            //    //if (diagram.onBeforeDelete != null) { diagram.onBeforeDelete(nodeid, prev_id); }
            //    //diagram.deleteNode(nodeid);
            //    //auto_save_db();
            //    return false;
            //}

            var invalid_type = m.find("input[name=invalid_play_option_" + id + "]:checked").val();

            if (invalid_type == 'text' && inv_language == '1') {
                con = "<getkeys validkeys='" + validkeys + "' tkey='#' action='" + callback + "' max='1' method='get' timeout='10'>" + con + "<timeout type='speak' count='2' >" + con1 + "</timeout></getkeys>";
            } else {
                con = "<getkeys validkeys='" + validkeys + "' tkey='#' action='" + callback + "' max='1' method='get' timeout='10'>" + con + "<timeout type='play' count='2' >" + con1 + "</timeout></getkeys>";
            }

            console.log(con)
            var obj = {}; obj.type = "menu"; obj.data = con;
            res_xml[id] = obj;
            res_msg[id] = msg;
            m.find('.menu-option-head .addmore').hide();
            m.find('.opt').attr('disabled', true);
            m.find('.opt_val').attr('disabled', true);
            m.find('.remove-menu-options').remove();
            all_invalid_nodes = all_invalid_nodes + ',"' + id + '":"' + nodeid + '"'
            break;
        case 'goto':
            diagram.deleteConnection(id);
            diagram.addConnection(new Connection(id, 'e', m.find('.steps-options select').val(), 'e', color, 3, ''));
            step = m.find('.steps-options select option:selected').text();
            var con = "<goto><step>" + m.find('.steps-options select').val() + "</step></goto>";
            var obj = {}; obj.type = "goto"; obj.data = con;
            res_msg[id] = "<p>going to step " + step + "</p>";
            res_xml[id] = obj;
            break;
        case 'hang up':
            var xml_con = "";
            xml_con = "<hangup></hangup>";
            var obj = {}; obj.type = "hangup"; obj.data = xml_con;
           // msg = (msg == "<table>") ? msg += "<tr><td> no option is selected</td></tr></table>" : msg += "</table>";
            res_msg[id] = msg;
            res_xml[id] = obj;
            break;
        case 'play message':
            var con = "";
            var val = m.find("input[type=radio]:checked").val();

            if (val == 'file') {
                //con=m.find('.uploadfile').attr("path");
                // con = Is_File_Play;
                if (m.find(".uploadfile[nodeid='" + id + "']").attr("path") != undefined) {
                    con = m.find(".uploadfile[nodeid='" + id + "']").attr("path");
                } else { con = "" }
                if (con == "") {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please upload file");
                    return false;
                }
                ms = (con.length > 20) ? con.substr(0, 20) + "..." : con;
                msg += "<tr><td><b>Play File: </b>/td><td>" + ms + "</td></tr></table>";
                //con = "/IVRWeb/Voice_Clips/" + con
                if (con.indexOf('http') > -1) {
                    con = "<play>"+ con + "</play>";
                } else {
                    con = "<play>" + hdn_ivrclipsurl + con + "</play>";
                }
                Is_File_Play = '';
            }
            else if (val == 'text') {
                con = m.find('.textmessage textarea').val();
                language = m.find('.ddl_lang').val();
                tts_clip = m.find('#div_vclips span').text();
                if (con.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
                    m.find(".errordiv[nodeId='" + id + "']").html("Text message contains invalid characters");
                    return false;
                }
                if (language == '1') {
                    if (con == "") {
                        m.find(".errordiv[nodeId='" + id + "']").html("Please enter text");
                        return false;
                    }
                    ms = (con.length > 20) ? con.substr(0, 20) + "..." : con;
                    msg += "<tr><td><b>Play file: </b></td><td>" + con + "</td></tr></table>";
                    con = "<speak>" + con + "</speak>";
                }

                else {
                    if (con == "") {
                        m.find(".errordiv[nodeId='" + id + "']").html("Please enter text and convert it as clip");
                        return false;
                    }
                    ms = (con.length > 20) ? con.substr(0, 20) + "..." : con;
                    msg += "<tr><td><b>Play file: </b></td><td>" + tts_clip + "</td></tr></table>";
                    if (con.indexOf('http') > -1) {
                        con = "<play>"+ tts_clip + "</play>";
                    } else {
                        con = "<play>" + hdn_ivrclipsurl + tts_clip + "</play>";
                    }
                }
            }
            var obj = {};
            obj.type = "play";
            obj.data = con;
            res_msg[id] = msg;
            res_xml[id] = obj;
            break;
        case 'sms':
            con = '';
            var smsToselect = m.find(".selSmsTo[nodeId='" + id + "'] option:selected").text();
            var smsTo = ""; var smsArray = null;
            if (smsToselect == "Other") {
                smsTo = m.find("#txtSmsToOther_" + id).val();
                if (smsTo == "") {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please enter mobile numbers");
                    return false;
                }
                else {
                    smsArray = smsTo.split(","); var smsValid = 1;
                    if (smsArray.length > 0) {
                        for (var i = 0; i < smsArray.length; i++) {
                            if (!smsArray[i].match("^[0-9]+(,[0-9]+)*$")) {
                                smsValid = 0;
                                i = smsArray.length;
                            }
                        }
                        if (smsValid == 0) {
                            smsValid = 1;
                            m.find(".errordiv[nodeId='" + id + "']").html("To address contains invalid characters");
                            return false;
                        }
                    }
                }
            } else {
                smsTo = "";
            }
            con += "<to role='" + smsToselect + "'>" + smsTo + "</to>";
            msg += "<tr><td>smsToRole: </td><td>" + smsToselect + "</td><td>smsTo: </td><td>" + smsTo + "</td></tr>"

            var smsCcselect = m.find(".selSmsCc[nodeId='" + id + "'] option:selected").text();
            var smsCc = ""; var smsCcArray = null;
            if (smsCcselect == "Other") {
                smsCc = m.find("#txtSmsCcOther_" + id).val();
                if (smsCc == "") {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please enter mobile numbers");
                    return false;
                }
                else {
                    smsCcArray = smsCc.split(","); var smsCcValid = 1;
                    if (smsCcArray.length > 0) {
                        for (var i = 0; i < smsCcArray.length; i++) {
                            if (!smsCcArray[i].match("^[0-9]+(,[0-9]+)*$")) {
                                smsCcValid = 0;
                                i = smsCcArray.length;
                            }
                        }
                        if (smsCcValid == 0) {
                            smsCcValid = 1;
                            m.find(".errordiv[nodeId='" + id + "']").html("CC address contains invalid characters");
                            return false;
                        }
                    }
                }
            } else {
                smsCc = "";
            }
            con += "<cc role='" + smsCcselect + "'>" + smsCc + "</cc>";
            msg += "<tr><td>smsCcRole: </td><td>" + smsCcselect + "</td><td>smsCc: </td><td>" + smsCc + "</td></tr>";

            var smsTemplateId = m.find(".selSmsTemplate[nodeId='" + id + "'] option:selected").val();
            if (smsTemplateId == "") {
                m.find(".errordiv[nodeId='" + id + "']").html("Please select template");
                return false;
            }

            con += "<template>" + smsTemplateId + "</template>";
            msg += "<tr><td>TemplateId: </td><td>" + smsTemplateId + "</td></tr>";

            con = "<sms>" + con + "</sms>";

            var obj = {};
            obj.type = "sms";
            obj.data = con;
            res_msg[id] = msg + "</table>";
            res_xml[id] = obj;
            break;
        case 'email':
            con = '';
            var emailToselect = m.find(".selEmailTo[nodeId='"+ id +"'] option:selected").text();
            var emailTo = ""; var emailArray = null;
            if (emailToselect == "Other") {
                emailTo = m.find("#txtEmailToOther_"+ id).val();
                if (emailTo == "") {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please enter email address");
                    return false;
                }
                else {
                    emailArray = emailTo.split(","); var emailValid = 1;
                    if (emailArray.length > 0) {
                        for (var i = 0; i < emailArray.length; i++) {
                            if (!emailArray[i].match(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
                                emailValid = 0;
                                i = emailArray.length;
                            }
                        }
                        if (emailValid == 0) {
                            emailValid = 1;
                            m.find(".errordiv[nodeId='" + id + "']").html("To address contains invalid characters");
                            return false;
                        }
                    }
                }
            } else {
                emailTo = "";
            }
            con += "<to role='" + emailToselect + "'>" + emailTo + "</to>";
            msg += "<tr><td>EmailToRole: </td><td>" + emailToselect + "</td><td>EmailTo: </td><td>" + emailTo + "</td></tr>"

            var emailCcselect = m.find(".selEmailCc[nodeId='" + id + "'] option:selected").text();
            var emailCc = ""; var emailCcArray = null;
            if (emailCcselect == "Other") {
                emailCc = m.find("#txtEmailCcOther_"+ id).val();
                if (emailCc == "") {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please enter email address");
                    return false;
                }
                else {
                    emailCcArray = emailCc.split(","); var emailCcValid = 1;
                    if (emailCcArray.length > 0) {
                        for (var i = 0; i < emailCcArray.length; i++) {
                            if (!emailCcArray[i].match(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
                                emailCcValid = 0;
                                i = emailCcArray.length;
                            }
                        }
                        if (emailCcValid == 0) {
                            emailCcValid = 1;
                            m.find(".errordiv[nodeId='" + id + "']").html("CC address contains invalid characters");
                            return false;
                        }
                    }
                }
            } else {
                emailCc = "";
            }
            con += "<cc role='" + emailCcselect + "'>" + emailCc + "</cc>";
            msg += "<tr><td>EmailCcRole: </td><td>"+ emailCcselect +"</td><td>EmailCc: </td><td>"+ emailCc +"</td></tr>";

            var emailTemplateId = m.find(".selEmailTemplate[nodeId='" + id + "'] option:selected").val();

            if (emailTemplateId == "") {
                m.find(".errordiv[nodeId='" + id + "']").html("Please select template");
                return false;
            }

            con += "<template>" + emailTemplateId + "</template>";
            msg += "<tr><td>TemplateId: </td><td>"+ emailTemplateId +"</td></tr>";
             
            con = "<email>" + con + "</email>";
            
            var obj = {};
            obj.type = "email";
            obj.data = con;
            res_msg[id] = msg + "</table>";
            res_xml[id] = obj;
            break;
        case 'time of the day':
            console.log(m);
            var child_txt = '', c_nodes, s_child_txt;
            var con = "";//m.find('.time-dropdown').val();
            c_nodes = diagram.getNodeById(id).childNodes;
            c_nodes = $.parseJSON('{' + c_nodes + '}');
           

            var timeSlotCount = 0; var validTimeSlot = 0;
            var noOfSlots = m.find(".selTimeSlots[nodeId='" + id + "']").length;
            var r = getpositions(id, parseInt(noOfSlots) + 1);

            m.find(".selTimeSlots[nodeId='"+ id +"']").each(function () {
                var selTimeSlotValue = $(this).find("option:selected").val();
                var selTimeSlotText = $(this).find("option:selected").text();
                if (selTimeSlotValue != "" && parseInt(selTimeSlotValue) == 0) {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please select any value");
                    validTimeSlot = 1;
                    return false;
                } else {
                    if ($.isEmptyObject(c_nodes)) {
                        if (timeSlotCount == 0)
                        {
                            diagram.deleteNode(nodeid);
                        }
                       
                        addnode(selTimeSlotText, r[timeSlotCount].x, r[timeSlotCount].y, '', id, 'text-nodes', id);
                        child_txt += '"' + selTimeSlotValue + '":"' + nodeid + '",';
                        diagram.addConnection(new Connection(id, 's', nodeid, 'n', color, 3, ''));
                        addnode(next_node_msg, r[timeSlotCount].x + adj, r[timeSlotCount].y + y_dist, '', '', 'next-step', nodeid);
                        diagram.addConnection(new Connection((nodeid - 1), 's', nodeid, 'n', color, 3, ''));
                        con += "<slot>" + selTimeSlotValue + "</slot>";
                        msg += "<tr><td>" + selTimeSlotValue + "</td></tr>"
                    }
                    //else {
                    //    child_txt = "";
                    //    $.each(c_nodes, function (key, element) {
                    //        if (child_txt != "") { child_txt += ','; }
                    //        if (isNaN(key)) { child_txt += '"' + key + '":"' + element + '"'; }
                    //        else { child_txt += '"' + selTimeSlotValue + '":"' + element + '"'; diagram.updateNodeContent(element, selTimeSlotText); }
                    //    });
                    //}
                }
                timeSlotCount = timeSlotCount + 1;
            });
            if (validTimeSlot == 1) {
                return false;
            }
            //var r = getpositions(id, noOfSlots);
            if ($.isEmptyObject(c_nodes)) {
                addnode('Remaining time', r[timeSlotCount].x, r[timeSlotCount].y, '', id, 'text-nodes', id);
                child_txt += '"else":"' + nodeid + '"';
                diagram.addConnection(new Connection(id, 's', nodeid, 'n', color, 3, ''));
                addnode(next_node_msg, r[timeSlotCount].x + adj, r[timeSlotCount].y + y_dist, '', '', 'next-step', nodeid);
                diagram.addConnection(new Connection((nodeid - 1), 's', nodeid, 'n', color, 3, ''));
            }

            //s_child_txt = $.parseJSON('{' + child_txt + '}');
            //$('#' + s_child_txt[con]).find('.nodename').html(m.find('.time-dropdown option:selected').attr('name'));

            con = "<time>"+ con +"</time>";
            var obj = {};
            obj.type = "time of the day";
            obj.data = con;
            //name = $.trim(constr.split('(')[0]);
            //msg += "<tr><td colspan='2'><b>Time of then Day</b></td></tr><tr><td><b>Name : </b></td><td>" + name + "</td></tr>";
            //time = constr.split('(')[1].replace(')', '');
            //times = time.split(']')
            //for (var i = 0; i < times.length; i++) {
            //    msg += "<tr><td colspan='2'>" + times[i].replace('[', '') + "</td></tr>";
            //}
            res_msg[id] = msg + "</table>";
            res_xml[id] = obj;
            diagram.updateChildNodes(id, child_txt);
            break;
        case 'ring user(s)':
            m.find('.modal-body .alert').addClass('hide');
            var ring_strategy = "", selected_agents = '', ring_user = '', agent_login = '';
            ring_strategy = m.find('.modal-body select.ringstrategy[nodeid="' + id + '"] option:selected').val();
            agent_login = m.find("input[name=template]:checked").val();
            // alert(agent_login);
           // var ring_no = $.trim(m.find('.ringno').val());
            var sms_message = $.trim(m.find('.list-content textarea.sms-msg').val());
            var sms_check = 0, voice_mail = 0, recordcall = 0, voice_emails = "";
            //m.find('.modal-body select[class="agents"] option:selected').each(function () {
            //selected_agents += $(this).attr('value') + ',';
            //});
            msg += "<tr><td colspan='2'><b>Selected Agents List(name-number)</b></td></tr>";

            var selectedSkillGroup = m.find('.modal-body select.skillGroupclass[nodeid="' + id + '"] option:selected').val();
            if (selectedSkillGroup == "" || selectedSkillGroup == "0") {
                m.find(".errordiv[nodeId='" + id + "']").html("Please select any Skill Group");
                return false;
            }

            //m.find('.modal-body .sortable-list li').each(function () {
            //    selected_agents += $(this).attr('aid') + ',';
            //});;
            //if (selected_agents != "") {
            //    selected_agents = selected_agents.substr(0, selected_agents.length - 1)
            //    selected_agents_list = selected_agents.split(',');
            //    for (var i = 0; i < selected_agents_list.length; i++) {
            //        //alert($('#agent_'+id+'_'+selected_agents_list[i]).html());
            //        msg += "<tr><td>" + (i + 1).toString() + "</td><td>" + $('#agent_' + id + '_' + selected_agents_list[i]).html() + "</td></tr>";
            //    }
            //}
            //if (selected_agents == "") {
            //    m.find(".errordiv[nodeId='" + id + "']").html("Please select any ring group");
            //    return false;
            //}
            //if (ring_no == "") {
            //    m.find('.modal-body .alert span').html("please enter ring no of times");
            //    m.find('.modal-body .alert').removeClass('hide');
            //    return false;
            //}
            //if (m.find('.modal-body input[type="checkbox"].sms').prop('checked')) {
            //    sms_check = 1;
            //    if (sms_message == "") {
            //        m.find('.modal-body .alert span').html("please enter sms message");
            //        m.find('.modal-body .alert').removeClass('hide');
            //        return false;
            //    }
            //}
            //if (m.find('.modal-body input[type="checkbox"].voicemail').prop('checked')) {
            //    voice_mail = 1;
            //    voice_emails = $.trim(m.find('.list-content textarea.mails').val());
            //    if (voice_emails == "") {
            //        m.find('.modal-body .alert span').html("please enter Emailids ");
            //        m.find('.modal-body .alert').removeClass('hide');
            //        return false;
            //    }
            //}
            ring_user += "<skillgroupids>" + selectedSkillGroup + "</skillgroupids>";
           // ring_user += "<agentlogin>" + agent_login + "</agentlogin>";
           // if (selected_agents.indexOf(',') > 0) {
                ring_user += "<ringstrategy>" + ring_strategy + "</ringstrategy>";
                // ring_user += "<agentlogin>" + agent_login + "</agentlogin>";
                //ring_strategy = (ring_strategy == "simultaneous") ? "All at Once" : "One by One";
                msg += "<tr><td><b>Ring Strategy</b></td><td>" + ring_strategy + "</td></tr>";
           // }
            //msg += "<tr><td colspan='2'><b> notify user by</b></td></tr>";
            //ring_user += "<times>" + ring_no + "</times>";
            //if (sms_check == 1) {
            //    ring_user += "<sms type='caller'><message>" + sms_message + "</message></sms>";
            //    msg += "<tr><td> SMS </td><td> Yes </td></tr>";
            //}
            //else { msg += "<tr><td> SMS </td><td> No </td></tr>"; }
            //if (voice_mail == 1) {
            //    ring_user += "<voicemail><email>" + voice_emails + "</email></voicemail>";
            //    msg += "<tr><td> VoiceMail </td><td> Yes </td>";
            //}
            //else { msg += "<tr><td> VoiceMail </td><td> No </td>"; }

            //var onholdclip = "";
            //onholdclip = m.find(".uploadfile").attr("path");
            //if (typeof onholdclip !== 'undefined' && onholdclip !== false) {
            //    onholdclip = "<holdclip>" + onholdclip + "</holdclip>";
            //    msg += "<tr><td><b>Waiting Clip</b></td><td>" + onholdclip + "</td></tr>";
            //}
            //else { onholdclip = ""; }

            var waitClip = "";
            waitClip = m.find(".uploadfile[nodeid='" + id + "']").attr("path");
            if (waitClip == "") {
                m.find(".errordiv[nodeId='" + id + "']").html("Please upload wait clip");
                return false;
            }
            if (waitClip != "") {
                waitClip = "<waitclip>"+ waitClip +"</waitclip>";
            } else {
                waitClip = "";
            }

            ring_user = "<ringuser>" + waitClip + "" + ring_user + "</ringuser>";
            var obj = {};
            obj.type = "ring user";
            obj.data = ring_user;
            res_msg[id] = msg + "</table>";
            res_xml[id] = obj;
            break;
        case 'voice mail':

            var con = "";
            var val = m.find("input[name=greeting_play_option_" + id + "]:checked").val();
            if (val == 'file') {
                if (m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path') != undefined) {
                    con = m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path').split("\\").pop();
                } else { con = "" }

                if (!(con) || (con == "")) {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please upload file for Greeting Message");
                    return false;
                }
                var constr = (con.length > 15) ? con.substr(0, 15) + "..." : con;
                msg += "<tr><td><b>Greeting Play File:</b></td><td>" + constr + "</td></tr>";
                con = "<greeting><play>" +  con + "</play></greeting>";
            }
            else if (val == 'text') {
                con = m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .textmessage textarea').val();
                if (con == "") { m.find(".errordiv[nodeId='" + id + "']").html("Please enter text"); return false; }
                if (con.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
                    m.find(".errordiv[nodeId='" + id + "']").html("Text message contains invalid characters");
                    return false;
                }
                var constr = (con.length > 15) ? con.substr(0, 15) + "..." : con;
                msg += "<tr><td><b>Greeting Play Text:</b></td><td>" + constr + "</td></tr>";
                con = "<greeting><speak>" + con + "</speak></greeting>";
            }
            var conc = "";
            var valu = m.find("input[name=thanks_play_option_" + id + "]:checked").val();
            if (valu == 'file') {
                if (m.find('.' + m.find("input[name=thanks_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path') != undefined) {
                    conc = m.find('.' + m.find("input[name=thanks_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path').split("\\").pop();
                } else { conc = "" }

                if (!(conc) || (conc == "")) {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please upload file for Thanks Message");
                    return false;
                }
                var constr = (conc.length > 15) ? conc.substr(0, 15) + "..." : conc;
                msg += "<tr><td><b>Thanks Play File:</b></td><td>" + constr + "</td></tr>";
                con += "<thanks><tplay>" + conc + "</tplay></thanks>";
            }
            else if (valu == 'text') {

                conc = m.find('.' + m.find("input[name=thanks_play_option_" + id + "]:checked").attr("parent") + ' .textmessage textarea').val();
                if (conc == "") { m.find(".errordiv[nodeId='" + id + "']").html("Please enter text"); return false; }
                if (conc.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
                    m.find(".errordiv[nodeId='" + id + "']").html("Text message contains invalid characters");
                    return false;
                }
                var constr = (conc.length > 15) ? conc.substr(0, 15) + "..." : conc;
                msg += "<tr><td><b>Thanks Play Text:</b></td><td>" + constr + "</td></tr>";
                con += "<thanks><tspeak>" + conc + "</tspeak></thanks>";
            }

            var recordClip = m.find("input[name='RecordBeep'][nodeId='" + id + "']:checked").attr("chkId");
            con += "<beepSound>" + recordClip + "</beepSound>";
            var finishOnKey = m.find("input.FinishOnKey[nodeId='" + id + "']").val();
            if (finishOnKey == "") {
                m.find(".errordiv[nodeId='" + id + "']").html("Please enter finish key value");
                return false;
            } else {
                con += "<finishOnKey>" + finishOnKey+ "</finishOnKey>";
            }
            var recordTimeOut = m.find(".RecordClipTime[nodeId='" + id + "']").val();
            if (recordTimeOut == "") {
                m.find(".errordiv[nodeId='" + id + "']").html("Please enter max recording time limit");
                return false;
            } else {
                con += "<timeout>" + recordTimeOut + "</timeout>";
            }

            var notifiedMembers = "";

            var notificationsToCount = m.find(".sendNotificationsTo[nodeId='" + id + "']:checked").length;
            if (notificationsToCount == 0) {
                m.find(".errordiv[nodeId='" + id + "']").html("Please select members to send notifications");
                return false;
            } else {
                var membersCnt = 0;
                m.find(".sendNotificationsTo[nodeId='" + id + "']:checked").each(function () {
                    if (membersCnt == 0) {
                        notifiedMembers = notifiedMembers + $(this).attr("chkName")
                    }
                    else {
                        notifiedMembers = notifiedMembers +  "," +$(this).attr("chkName");
                    }
                    membersCnt = membersCnt + 1;
                });
            }

            con += "<sendTo>" + notifiedMembers + "</sendTo>";

            if (m.find(".sms-chk[nodeId='" + id + "']:checked").length == 0 && m.find(".email-chk[nodeId='" + id + "']:checked").length == 0)
            {
                m.find(".errordiv[nodeId='" + id + "']").html("Please select notifications type");
                return false;
            }

            if (m.find(".sms-chk[nodeId='" + id + "']").is(":checked")) {
                var smsTemplate = m.find(".voiceSmsTemplate[nodeId='"+ id +"']").find("option:selected").val();
                if (smsTemplate != "" && parseInt(smsTemplate) > 0) {
                    con += "<smsTemplate>" + smsTemplate + "</smsTemplate>";
                } else {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please select sms template");
                    return false;
                }
            }

            if (m.find(".email-chk[nodeId='" + id + "']").is(":checked")) {
                var emailTemplate = m.find(".voiceEmailTemplate[nodeId='" + id + "']").find("option:selected").val();
                if (emailTemplate != "" && parseInt(emailTemplate) > 0) {
                    con += "<emailTemplate>" + emailTemplate + "</emailTemplate>";
                } else {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please select email template");
                    return false;
                }
            }

            //var cid = m.find('.select-box').val();
            //var cidname = m.find('.select-box option:selected').text();
            //var eobj = m.find('.module-error');
            //if (cid == 0) { eobj.html("Please select user").show(); err = 1; return false; }
            //if ((m.find("input[type=checkbox].sms-chk").is(":not(:checked)")) && (m.find("input[type=checkbox].email-chk").is(":not(:checked)"))) { eobj.html("Please select any option").show(); err = 1; return false; }
            //msg += "<tr><td><b>User name - number:</b></td><td>" + cidname + "</td></tr>";
            //msg += "<tr><td><b> Notify user by:</b></td><td>";
            //if (m.find("input[type=checkbox].sms-chk").is(":checked")) {
            //    con += "<sms><message></message></sms>";
            //    msg += " sms & ";
            //}
            //if (m.find("input[type=checkbox].email-chk").is(":checked")) {
            //    var ids = "";
            //    ids = m.find("textarea.mails").val();
            //    if (ids == "") { m.find("textarea.mails").addClass("field_with_errors"); eobj.html("Please Enter email address").show(); err = 1; return false; }
            //    if (conc.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
            //        alert("Email id contains invalid characters."); return false;
            //    }
            //    con += "<email><ids>" + ids + "</ids></email>";
            //    ids = (ids.length > 15) ? ids.substr(0, 15) + "..." : ids;
            //    msg += "email to " + ids;
            //}
            con = "<voicemail>" + con + "</voicemail>";
            var obj = {};
            obj.type = "voicemail";
            obj.data = con;
            res_msg[id] = msg + "</td></tr></table>";
            res_xml[id] = obj;
            break;
        case 'dial extension':
            var extTermination = $(".ExtTerminationKey[nodeId='" + id + "']").val();
            if (extTermination == "1") {
                extTermination = '*';
            } else {
                extTermination = '#';
            }
            
            var con = "";
            var val = m.find("input[name=greeting_play_option_" + id + "]:checked").val();
            if (val == 'file') {
                if (m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path') != undefined) {
                    con = m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path').split("\\").pop();
                } else { con = "" }

                if (!(con) || (con == "")) {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please upload file for Greeting Message");
                    return false;
                }
                var constr = (con.length > 15) ? con.substr(0, 15) + "..." : con;
                msg += "<tr><td><b>Greeting Play File:</b></td><td>" + constr + "</td></tr>";
                con = "<greeting key='" + extTermination + "'><play>" + con + "</play></greeting>";
            }
            else if (val == 'text') {
                con = m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .textmessage textarea').val();
                if (con == "") { m.find(".errordiv[nodeId='" + id + "']").html("Please enter text"); return false; }
                if (con.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
                    m.find(".errordiv[nodeId='" + id + "']").html("Text message contains invalid characters");
                    return false;
                }
                var constr = (con.length > 15) ? con.substr(0, 15) + "..." : con;
                msg += "<tr><td><b>Greeting Play Text:</b></td><td>" + constr + "</td></tr>";
                con = "<greeting key='" + extTermination + "'><speak>" + con + "</speak></greeting>";
            }

            var conc = "", msgcon = "";
            var valu = m.find("input[name=InvalidExt_play_option_" + id + "]:checked").val();
            if (valu == 'file') {
                if (m.find('.' + m.find("input[name=InvalidExt_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path') != undefined) {
                    conc = m.find('.' + m.find("input[name=InvalidExt_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path').split("\\").pop();
                } else { conc = "" }

                if (!(conc) || (conc == "")) {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please upload file for Invalid Extension");
                    return false;
                }
                var constr = (conc.length > 15) ? conc.substr(0, 15) + "..." : conc;
                msg += "<tr><td><b>Invalid Extension Play File:</b></td><td>" + constr + "</td></tr>";
                con += "<invalidext><play>" + conc + "</play></invalidext>";
                msgcon = "<play>" + conc + "</play>";
            }
            else if (valu == 'text') {

                conc = m.find('.' + m.find("input[name=InvalidExt_play_option_" + id + "]:checked").attr("parent") + ' .textmessage textarea').val();
                if (conc == "") { m.find(".errordiv[nodeId='" + id + "']").html("Please enter text"); return false; }
                if (conc.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
                    m.find(".errordiv[nodeId='" + id + "']").html("Text message contains invalid characters");
                    return false;
                }
                var constr = (conc.length > 15) ? conc.substr(0, 15) + "..." : conc;
                msg += "<tr><td><b>Invalid Extension Play Text:</b></td><td>" + constr + "</td></tr>";
                con += "<invalidext><speak>" + conc + "</speak></invalidext>";
                msgcon = "<speak>" + conc + "</speak>";
            }

            //var con2 = "";
            //var valu = m.find("input[name=NoAns_play_option_" + id + "]:checked").val();
            //if (valu == 'file') {
            //    if (m.find('.' + m.find("input[name=NoAns_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path') != undefined) {
            //        con2 = m.find('.' + m.find("input[name=NoAns_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path').split("\\").pop();
            //    } else { con2 = "" }

            //    if (!(con2) || (con2 == "")) {
            //        m.find(".errordiv[nodeId='" + id + "']").html("Please upload file for No Answer");
            //        return false;
            //    }
            //    var constr = (con2.length > 15) ? con2.substr(0, 15) + "..." : con2;
            //    msg += "<tr><td><b>No Answer Play File:</b></td><td>" + constr + "</td></tr>";
            //    con += "<noanswer><play>" + con2 + "</play></noanswer>";
            //}
            //else if (valu == 'text') {

            //    con2 = m.find('.' + m.find("input[name=NoAns_play_option_" + id + "]:checked").attr("parent") + ' .textmessage textarea').val();
            //    if (con2 == "") { m.find(".errordiv[nodeId='" + id + "']").html("Please enter text"); return false; }
            //    if (con2.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
            //        m.find(".errordiv[nodeId='" + id + "']").html("Text message contains invalid characters");
            //        return false;
            //    }
            //    var constr = (con2.length > 15) ? con2.substr(0, 15) + "..." : con2;
            //    msg += "<tr><td><b>No Answer Play Text:</b></td><td>" + constr + "</td></tr>";
            //    con += "<noanswer><speak>" + con2 + "</speak></noanswer>";
            //}

            var dial_ext_nodes = "";
            diagram.deleteNode(nodeid);
            var child_txt = "";
            var r = getpositions(id, 3);
            //addnode('No Answer', r[0].x, r[0].y, 1, id, 'text-nodes', id);
            //diagram.addConnection(new Connection(id, 's', nodeid, 'n', color, 3, ''));
            //child_txt += '"noanswer":"' + nodeid + '",';
            //dial_ext_nodes += "<span nodeId='"+ nodeid +"' id='"+ id +"' name='No_Answer' nodeText='noanswer'></span>";
            //addnode(next_node_msg, r[0].x + adj, (r[0].y + y_dist), '', '', 'next-step', nodeid);
            //diagram.addConnection(new Connection((nodeid - 1), 's', nodeid, 'n', color, 3, ''));
            addnode('Answer', r[0].x, r[0].y, 1, id, 'text-nodes', id);
            diagram.addConnection(new Connection(id, 's', nodeid, 'n', color, 3, ''));
            child_txt += '"answer":"' + nodeid + '",';
            dial_ext_nodes += "<span nodeId='" + nodeid + "' id='" + id + "' name='Answer' nodeText='answer'></span>";
            addnode(next_node_msg, r[0].x + adj, (r[0].y + y_dist), '', '', 'next-step', nodeid);
            diagram.addConnection(new Connection((nodeid - 1), 's', nodeid, 'n', color, 3, ''));
            //addnode('Invalid Extension', r[1].x, r[1].y, 2, id, 'text-nodes', id);
            addnode('Play message', r[1].x, r[1].y, 'Invalid key', id, 'menu-invalid-nodes', id);
            diagram.addConnection(new Connection(id, 's', nodeid, 'n', color, 3, ''));
            diagram.addConnection(new Connection(nodeid, 'e', m.find('.steps-options select').val(), 'e', color, 3, ''));
            child_txt += '"invalid":"' + nodeid + '"';
            var obj1 = {}; obj1.type = "invalid"; obj1.data = msgcon;
            res_xml[nodeid] = obj1;
            dial_ext_nodes += "<span nodeId='" + nodeid + "' id='" + id + "' name='Invalid_Extension' nodeText='invalid'></span>";
            diagram.updateChildNodes(id, child_txt);

         
            $(".dial_ext_nodes[nodeId='" + id + "']").html(dial_ext_nodes);
            con = "<dialextension>" + con + "</dialextension>";
            var obj = {};
            obj.type = "dial extension";
            obj.data = con;
            res_msg[id] = msg + "</td></tr></table>";
            res_xml[id] = obj;
            dial_ext_all_invalid_nodes = dial_ext_all_invalid_nodes + ',"' + id + '":"' + nodeid + '"'
            break;
    }
    if (err == 0) {
        m.find('.module-save').removeClass('module-save').addClass('module-update').val('Update').html("update");
        m.find('.module-error').hide();
        draggable_container.draggable("enable");
        m.modal('hide');
        m.find(".errordiv[nodeId='" + id + "']").html("");
        auto_save_db();

    }
}

function updatemodule(id, module) {
    var m = $('#module_' + id);
    m.find('.field_with_errors').removeClass('field_with_errors');
    var err = 0;
    m.find('.module-error').html("");
    var msg = "<table>";
    switch (module) {
        case 'menu':
            var opt_arr = [], child_txt = "", con = "", validkeys = "", con1 = "", con_text = "", inv_language = "";
            var val = m.find("input[name=greeting_play_option_" + id + "]:checked").val();
            if (val == 'file') {
                if (m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path') != undefined) {
                    con = m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path').split("\\").pop();
                } else { con = "" }
                if (con == "") {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please upload file for greeting message");
                    return false;
                }
                var constr = (con.length > 15) ? con.substr(0, 15) + "..." : con;
                msg += "<tr><td>Greeting File Name:</td><td>" + constr + "</td></tr>";
                con = "<play>" + con + "</play>";
            }
            else if (val == 'text') {
                var conv_clip;
                conv_clip = m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .textmessage span').text();
                con = m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .textmessage textarea').val();
                language = m.find('.ddl_lang').val();
                tts_clip = m.find('#div_vclips span').text();
                if (language == '1') {
                    if (con == "") {
                        m.find(".errordiv[nodeId='" + id + "']").html("Please enter text for greeting message");
                        return false;
                    }
                    var constr = (con.length > 15) ? con.substr(0, 15) + "..." : con;
                    msg += "<tr><td>Greeting Text:</td><td>" + constr + "</td><td>";
                    con = "<speak>" + con + "</speak>";
                } else {
                    if (con == "") {
                        m.find(".errordiv[nodeId='" + id + "']").html("Please enter text for greeting message and convert it as clip");
                        return false;
                    }
                    ms = (con.length > 20) ? con.substr(0, 20) + "..." : con;
                    msg += "<tr><td><b>Greeting file: </b></td><td>" + tts_clip + "</td></tr></table>";
                    con = "<play>" + tts_clip + "</play>";

                }
            }
            //msg+="<tr><td colspan='2'>menu options</td>";
            m.find('.menu-option').each(function () {
                var opt = '', opt_val = '';
                opt = $(this).find('.opt').val();
                opt_val = $(this).find('.opt_val').val();
                if ((opt != "") && (opt_val != "")) {
                    var obj = {}; obj.id = opt; obj.name = opt_val; obj.nodeid = $(this).attr("nodeid");
                    //msg+="<tr><td>"+obj.id+"</td><td>"+obj.name+"</td></tr>";
                    opt_arr.push(obj);
                }
            });
            if (opt_arr.length == 0) { err = 1; m.find(".errordiv[nodeId='" + id + "']").html("Please fill the key options"); return false; }
            for (i = 0; i < opt_arr.length; i++) {
                child_txt += '"' + opt_arr[i].id + '":"' + opt_arr[i].nodeid + '",';
                validkeys += opt_arr[i].id.toString();
                var nid = opt_arr[i].nodeid, nname = opt_arr[i].name, ntext = opt_arr[i].id;
                diagram.updateNodeContent(nid, nname);
                diagram.updateNodeText(nid, ntext);
                $("#" + nid).find('.nodecontent .nodename').html(nname);
                $("#" + nid).find('.nodetext').html(ntext);
            }

            var inv_obj = $.parseJSON("{" + all_invalid_nodes.substring(1, all_invalid_nodes.length).replace(/'/g, '"') + "}");
            $.each(inv_obj, function (key, value) {
                if (key == id) {
                    invalid_nodeid = value;
                }
            });

            val = "";

            val = m.find("input[name=invalid_play_option_" + id + "]:checked").val();
            if (val == 'file') {
                if (m.find('.' + m.find("input[name=invalid_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path') != undefined) {
                    con1 = m.find('.' + m.find("input[name=invalid_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path').split("\\").pop();
                } else { con1 = "" }
                if (!(con1) || (con1 == "")) {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please upload file for invalid key");
                    return false;
                }
                con_text = hdn_ivrclipsurl + con1;
                con1 = "<play>" + con1 + "</play>";
                msg += "<tr><td>invalid key play file:</td><td>" + con1 + "</td></tr>";
                Is_File_InvldKey = '';
            }
            else if (val == 'text') {
                con1 = m.find('.' + m.find("input[name=invalid_play_option_" + id + "]:checked").attr("parent") + ' .textmessage textarea').val();
                inv_language = m.find('.ddl_lang1').val();
                tts_clip = m.find('#div_vclips1 span').text();
                if (inv_language == '1') {
                    if (con1 == "") { m.find(".errordiv[nodeId='" + id + "']").html("Please enter text for invalid key"); return false; }
                    if (con1.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
                        m.find(".errordiv[nodeId='" + id + "']").html("Text message contains invalid characters.");
                        return false;
                    }
                    var con1str = (con1.length > 15) ? con1.substr(0, 15) + "..." : con1;
                    msg += "<tr><td>invalid key Text:</td><td>" + con1str + "</td><td>";
                    con_text = con1;
                    con1 = "<speak>" + con1 + "</speak>";
                } else {
                    if (con1 == "") {  m.find(".errordiv[nodeId='" + id + "']").html("Please enter text for invalid key and convert it as clip."); return false; }
                    //ms = (tts_clip.length > 20) ? tts_clip.substr(0, 20) + "..." : tts_clip;
                    msg += "<tr><td><b>Greeting file: </b></td><td>" + tts_clip + "</td></tr></table>";
                    con_text = hdn_ivrclipsurl + tts_clip + "";
                    con1 = "<play>" + hdn_ivrclipsurl + tts_clip + "</play>";
                }

            }
            

            child_txt += '"invalid":"' + invalid_nodeid + '"';
            var obj1 = {}; obj1.type = "invalid"; obj1.data = con1;
            res_xml[invalid_nodeid] = obj1;
            diagram.updateChildNodes(id, child_txt);
            var invalid_type = m.find("input[name=invalid_play_option_" + id + "]:checked").val();

            diagram.deleteConnection(invalid_nodeid);
            diagram.addConnection(new Connection(invalid_nodeid, 'e', m.find('.steps-options select').val(), 'e', color, 3, ''));
            diagram.updateChildNodes(id, child_txt);

            if (invalid_type == 'text' && inv_language == '1') {
                con = "<getkeys validkeys='" + validkeys + "' tkey='#' action='" + callback + "' max='1' method='get' timeout='30'>" + con + "<timeout type='speak' count='2' >" + con_text + "</timeout></getkeys>";
            } else {
                con = "<getkeys validkeys='" + validkeys + "' tkey='#' action='" + callback + "' max='1' method='get' timeout='30'>" + con + "<timeout type='play' count='2' >" + con_text + "</timeout></getkeys>";
            }
            var obj = {}; obj.type = "menu"; obj.data = con;
            res_xml[id] = obj;
            res_msg[id] = msg;
            invalid_nodeid = '';
            break;
        case 'dial extension':
            var extTermination = $(".ExtTerminationKey[nodeId='" + id + "']").val();
            if (extTermination == "1") {
                extTermination = '*';
            } else {
                extTermination = '#';
            }
            
            var con = "";
            var val = m.find("input[name=greeting_play_option_" + id + "]:checked").val();
            if (val == 'file') {
                if (m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path') != undefined) {
                    con = m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path').split("\\").pop();
                } else { con = "" }

                if (!(con) || (con == "")) {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please upload file for Greeting Message");
                    return false;
                }
                var constr = (con.length > 15) ? con.substr(0, 15) + "..." : con;
                msg += "<tr><td><b>Greeting Play File:</b></td><td>" + constr + "</td></tr>";
                con = "<greeting key='" + extTermination + "'><play>" + con + "</play></greeting>";
            }
            else if (val == 'text') {
                con = m.find('.' + m.find("input[name=greeting_play_option_" + id + "]:checked").attr("parent") + ' .textmessage textarea').val();
                if (con == "") { m.find(".errordiv[nodeId='" + id + "']").html("Please enter text"); return false; }
                if (con.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
                    m.find(".errordiv[nodeId='" + id + "']").html("Text message contains invalid characters");
                    return false;
                }
                var constr = (con.length > 15) ? con.substr(0, 15) + "..." : con;
                msg += "<tr><td><b>Greeting Play Text:</b></td><td>" + constr + "</td></tr>";
                con = "<greeting key='" + extTermination + "'><speak>" + con + "</speak></greeting>";
            }

            var conc = "", msgcon = "";
            var valu = m.find("input[name=InvalidExt_play_option_" + id + "]:checked").val();
            if (valu == 'file') {
                if (m.find('.' + m.find("input[name=InvalidExt_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path') != undefined) {
                    conc = m.find('.' + m.find("input[name=InvalidExt_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path').split("\\").pop();
                } else { conc = "" }

                if (!(conc) || (conc == "")) {
                    m.find(".errordiv[nodeId='" + id + "']").html("Please upload file for Invalid Extension");
                    return false;
                }
                var constr = (conc.length > 15) ? conc.substr(0, 15) + "..." : conc;
                msg += "<tr><td><b>Invalid Extension Play File:</b></td><td>" + constr + "</td></tr>";
                con += "<invalidext><play>" + conc + "</play></invalidext>";
                msgcon = "<play>" + conc + "</play>";
            }
            else if (valu == 'text') {

                conc = m.find('.' + m.find("input[name=InvalidExt_play_option_" + id + "]:checked").attr("parent") + ' .textmessage textarea').val();
                if (conc == "") { m.find(".errordiv[nodeId='" + id + "']").html("Please enter text"); return false; }
                if (conc.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
                    m.find(".errordiv[nodeId='" + id + "']").html("Text message contains invalid characters");
                    return false;
                }
                var constr = (conc.length > 15) ? conc.substr(0, 15) + "..." : conc;
                msg += "<tr><td><b>Invalid Extension Play Text:</b></td><td>" + constr + "</td></tr>";
                con += "<invalidext><speak>" + conc + "</speak></invalidext>";
                msgcon = "<speak>" + conc + "</speak>";
            }

            //var con2 = "";
            //var valu = m.find("input[name=NoAns_play_option_" + id + "]:checked").val();
            //if (valu == 'file') {
            //    if (m.find('.' + m.find("input[name=NoAns_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path') != undefined) {
            //        con2 = m.find('.' + m.find("input[name=NoAns_play_option_" + id + "]:checked").attr("parent") + ' .uploadfile').attr('path').split("\\").pop();
            //    } else { con2 = "" }

            //    if (!(con2) || (con2 == "")) {
            //        m.find(".errordiv[nodeId='" + id + "']").html("Please upload file for No Answer");
            //        return false;
            //    }
            //    var constr = (con2.length > 15) ? con2.substr(0, 15) + "..." : con2;
            //    msg += "<tr><td><b>No Answer Play File:</b></td><td>" + constr + "</td></tr>";
            //    con += "<noanswer><play>" + con2 + "</play></noanswer>";
            //}
            //else if (valu == 'text') {

            //    con2 = m.find('.' + m.find("input[name=NoAns_play_option_" + id + "]:checked").attr("parent") + ' .textmessage textarea').val();
            //    if (con2 == "") { m.find(".errordiv[nodeId='" + id + "']").html("Please enter text"); return false; }
            //    if (con2.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
            //        m.find(".errordiv[nodeId='" + id + "']").html("Text message contains invalid characters");
            //        return false;
            //    }
            //    var constr = (con2.length > 15) ? con2.substr(0, 15) + "..." : con2;
            //    msg += "<tr><td><b>No Answer Play Text:</b></td><td>" + constr + "</td></tr>";
            //    con += "<noanswer><speak>" + con2 + "</speak></noanswer>";
            //}

           
            var dial_ext_nodes = "";
            var child_txt = "";
            var opt_arr = [];

            var invalid_nodeid = "";
            var inv_obj = $.parseJSON("{" + dial_ext_all_invalid_nodes.substring(1, dial_ext_all_invalid_nodes.length).replace(/'/g, '"') + "}");
            $.each(inv_obj, function (key, value) {
                if (key == id) {
                    invalid_nodeid = value;
                }
            });

            $(".dial_ext_nodes[nodeid='" + id + "'] span").each(function () {
                var obj = {}; obj.id = $(this).attr("id"); obj.name = $(this).attr("name"); obj.nodeid = $(this).attr("nodeId"); obj.nodetext = $(this).attr("nodeText");
                opt_arr.push(obj);
            });
          
            for (i = 0; i < opt_arr.length; i++) {
                if (i == 2) {
                    child_txt += '"invalid":"' + invalid_nodeid + '"';
                    var obj1 = {}; obj1.type = "invalid"; obj1.data = con1;
                    res_xml[invalid_nodeid] = obj1;
                }
                else {
                    child_txt += '"' + opt_arr[i].nodetext + '":"' + opt_arr[i].nodeid + '",';
                    validkeys += opt_arr[i].id.toString();
                    var nid = opt_arr[i].nodeid, nname = opt_arr[i].name.replace("_", " "), ntext = (i + 1);
                    diagram.updateNodeContent(nid, nname);
                    diagram.updateNodeText(nid, ntext);
                }
            }

            //console.log(opt_arr);
           // child_txt += '"invalid":"' + invalid_nodeid + '"';
            diagram.updateChildNodes(id, child_txt);
            //console.log(invalid_nodeid);

            con = "<dialextension>" + con + "</dialextension>";
            var obj = {};
            obj.type = "dial extension";
            obj.data = con;
            res_msg[id] = msg + "</td></tr></table>";
            res_xml[id] = obj;
           // invalid_nodeid = '';
            break;
        default:
            savemodule(id, module);
            break;
    }
    if (err == 0) {
        if (module == "menu" || "dial extension") {
            auto_save_db();
            m.modal('hide');
            draggable_container.draggable("enable");
        }
    }
}

function arrangesteps() {
    var i = 1;
    $('.step-no').each(function () {
        $(this).attr('step', i).html(i);
        i++;
    });
}

function saveaddnew(id, module) {
    var m = $('#addnew_form_' + id);
    m.find('.addnew-error').html("");
    var err = 0;
    switch (module) {
        case 'time of the day':
            var name = m.find('input[type=text].name').val();
            if (name == "") { m.find('input[type=text].name').addClass("field_with_errors"); alert("Please enter name"); return false; }
            if (name.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
                alert("Name contains invalid characters."); return false;
            }
            // m.find('.week-days input.from').val(m.find('input.x').val());
            //                         m.find('.week-days input.to').val(m.find('input.head-to').val());
            var t_arr = [];
            time = [];

            m.find('table input[type=checkbox]:checked').not('input[name=all]').each(function () {
                var f, t;
                var ms = m.find('table tr[name=' + this.name + ']');
                f = ms.find('input.from').val();
                t = ms.find('input.to').val();
                if ((f != "") && (t != "")) {
                    var obj = {}; obj.day = this.name; obj.from = f; obj.to = t;
                    //  t_arr[]=obj;
                    t_arr.push(obj);
                    time.push(f + "-" + t)
                }
                else { err = 1; }
            });
            if ((err == 1) || (t_arr.length == 0)) { return false; }
            $.ajax({
                url: "/get_time_of_the_day.aspx",
                type: "post",
                dataType: "json",
                data: { type: 2, name: name, data: JSON.stringify(t_arr) },
                success: function (a) {
                    if (a.Status == 401) {
                        redirect_to_login_page();
                    } else if (a.Status == 1) {
                        var desc = time_desc();
                        main_m = $('#module_' + id);
                        main_m.find('.time-dropdown').append("<option name = '" + a.items[0].name + "' value='" + a.items[0].id + "'>" + a.items[0].name + "&nbsp(" + desc + ")" + "</option>");
                        main_m.find('.time-dropdown').val(a.items[0].id);
                        m.hide();
                        $('#module_' + id).show().modal("show");
                    } else {
                        alert(a.ErrorReason);
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
            break;
    }
}
function updateaddnew(id, module) {
    var m = $('#addnew_form_' + id);
    m.find('.addnew-error').html("");
    var err = 0;
    switch (module) {
        case 'time of the day':
            var name = m.find('input[type=text].name').val();
            if (name == "") { m.find('input[type=text].name').addClass("field_with_errors"); alert("Please enter name"); return false; }
            var t_arr = [];
            time = [];

            m.find('table input[type=checkbox]:checked').not('input[name=all]').each(function () {
                var f, t;
                var ms = m.find('table tr[name=' + this.name + ']');
                f = ms.find('input.from').val();
                t = ms.find('input.to').val();
                if ((f != "") && (t != "")) {
                    var obj = {}; obj.day = this.name; obj.from = f; obj.to = t;
                    t_arr.push(obj);
                    time.push(f + "-" + t)
                }
                else { err = 1; }
            });
            if ((err == 1) || (t_arr.length == 0)) { return false; }
            var tid = $('#module_' + id).find('.time-dropdown').val();
            $.ajax({
                url: "get_time_of_the_day.aspx",
                type: "post",
                dataType: "json",
                data: { type: 2, name: name, data: JSON.stringify(t_arr), tid: tid },
                // data: { type: 2, name: name, data: t_arr, tid: tid },
                success: function (a) {
                    if (a.Status == 401) {
                        redirect_to_login_page();
                    } else if (a.Status == 1) {
                        var desc = time_desc();
                        main_m = $('#module_' + id);
                        main_m.find('.time-dropdown option[value="' + tid + '"]').html(a.items[0].name + "&nbsp(" + desc + ")");
                        main_m.find('.time-dropdown option[name="' + a.items[0].name + '"]')
                        m.hide();
                        $('#module_' + id).show().modal("show");
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
            break;
    }
}


function showaddnewform(id, module) {
    var m = $('#addnew_form_' + id);
    m.find('.module-error').html("");
    var err = 0;
    switch (module) {
        case 'time of the day':
            m.find('input.name').val('');
            m.find('.module-list-time input.from,.module-list-time input.head-from').val('09:00');
            m.find('.module-list-time input.to,.module-list-time input.head-to').val('15:00');
            m.find('.module-list-time .head-chk,.module-list-time .chk').prop({ checked: true });
            m.find('.module-list-time .week-days').hide();
            m.find(".addnew-update").removeClass("addnew-update").addClass("addnew-save").html("save");
            break;
    }
}

function getpositions(id, cnt) {
    var res = [];
    var x = parseInt($('#' + id).css("left").replace('px', ''));
    var y = parseInt($('#' + id).css("top").replace('px', ''));
    var k = (x * 2) / (cnt + 1);
    var s = x / (cnt) + 100;
    for (i = 0; i < cnt; i++) {
        j = (i * s) + k;
        var obj = {}; obj.x = j; obj.y = (y + y_dist);
        res.push(obj);
    }
    return res;
}

function afterupload(path, file_element) {
    var clip_html = '', audio_type = '', ext = 'audio/mpeg';
    ext = /^.+\.([^.]+)$/.exec(path);
    ext = (ext == null) ? "" : ext[1];
    if (ext == 'wav') { audio_type = "audio/wave"; }
    clip_html = "<audio controls><source src='" + path + "'>Your browser does not support the audio element.</audio>";
    if (select == 1) {

        var id = $(this).attr('id');
        var node_name = $('#' + id).find('.nodename').html().toLowerCase();
        var parent_id = $('#' + id).attr("p_id");
        var par_nodename = $('#' + parent_id).find('.nodename').html().toLowerCase();
        if ((node_name == 'play message') && (par_nodename == 'menu')) {
            var cust_nid = parent_id;
        } else {
            var cust_nid = id;
        }
        select = 0;
    } else {
        cust_nid = cur_nid;
    }
    $('#module_' + cust_nid).find('form.' + file_element).parent().attr("path", path);
    $('#module_' + cust_nid).find('form.' + file_element).hide().parent().find('.audio_player').show().find('.player').html(clip_html);
}
function add_agent(email, mobile, firstname, lastname) {
    var resp;
    $('#btn_agent_save').prop({ disabled: true });

    $.ajax({
        url: "get_time_of_the_day.aspx",
        type: "post",
        data: {
            fname: firstname, lname: lastname, mobile: mobile, email: email, type: 3
            //            new_agent: { "first_name": firstname, "last_name": lastname,
            //                "email": email, "mobile_number": mobile
            // }
        },
        dataType: "json",
        async: false,
        success: function (a) {
            if (a.Status == 401) {
                redirect_to_login_page()
            } else if (a.Status == 1) {
                if (a.Message.toString().replace(" ", "").toUpperCase() == "OK") {
                    $('#add_agent_info_div').removeClass('hide');
                    $('#add_agent_success').html(firstname + " Added Successfully");
                    $.unblockUI();
                    resp = a;
                } else {
                    $('#add_agent_err_div').removeClass('hide');
                    $('#add_agent_msg').html("this user already in agents list,please check");
                    $.unblockUI();
                    resp = "false";
                }
            } else {
                $('#add_agent_err_div').removeClass('hide');
                $('#add_agent_msg').html(a.ErrorReason);
                $.unblockUI();
                resp = "false";
            }
            $('#btn_agent_save').prop({ disabled: false });
        },
        error: function (a) {
            $.unblockUI();
            resp = "error";
            $('#btn_agent_save').prop({ disabled: false });
        }
    });
    return resp;
}


function get_ivr_stock_numbers() {
    $.ajax({
        url: "GeneratePopup.aspx",
        type: "post",
        data: { type: 3 },
        dataType: 'json',
        success: function (a) {
            if (a.Status == 401) {
                redirect_to_login_page();
            } else if (a.Status == 1) {
                var rbt_no_list = "";
                var div_india = "<div>"
                var div_uae = "<div>";
                var j = 1, k = 1;
                for (i = 0; i < a.items.length; i++) {
                    if (a.items[i].country_name == "India") {
                        div_india += "<div class='inumber'><input class='rbt_no_list' name='rbt_no_list' type='radio' value='" + a.items[i].id + "' /><span>" + a.items[i].number + "</span></div>"
                        if ((k) % 4 == 0) { rbt_no_list += "<br />" }
                        k++;
                    }
                    else {
                        div_uae += "<div class='inumber'><input class='rbt_no_list' name='rbt_no_list' type='radio' value='" + a.items[i].id + "' /><span>" + a.items[i].number + "</span></div>"
                        if ((j) % 4 == 0) { rbt_no_list += "<br />" }
                        j++;
                    }

                }
                $('#ivr_name_box .no_list').html(div_india + "</div>");
                $('#ivr_name_box .uae_list').html(div_uae + "</div>")
            } else {
                alert(a.ErrorReason);
            }
        },
        error: function (a) { alert(a); }
    });
}
function add_new_agent() {
    $('#add_agent_err_div').addClass('hide');
    $('#add_agent_info_div').addClass('hide');
    var email, mobile, name, m;
    firstname = $.trim($('#agent_fname').val());
    lastname = $.trim($('#agent_lname').val());
    mobile = $.trim($('#agent_mobile').val());
    email = $.trim($('#agent_email').val());
    if (firstname == "") {
        $('#add_agent_err_div').removeClass('hide');
        $('#add_agent_msg').html("please enter first name of the agent");
        return false;
    } else {
        if (firstname.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
            $('#add_agent_err_div').removeClass('hide');
            $('#add_agent_msg').html("First name contains invalid characters.");
            return false;

        }
    }
    if (lastname == "") {
        $('#add_agent_err_div').removeClass('hide');
        $('#add_agent_msg').html("please enter last name of the agent");
        return false;
    }
    else {
        if (lastname.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
            $('#add_agent_err_div').removeClass('hide');
            $('#add_agent_msg').html("Last name contains invalid characters.");
            return false;

        }
    }
    if (mobile == "") {
        $('#add_agent_err_div').removeClass('hide');
        $('#add_agent_msg').html("please enter mobile number of the agent");
        return false;
    }
    else {
        if (mobile.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
            $('#add_agent_err_div').removeClass('hide');
            $('#add_agent_msg').html("mobile contains invalid characters.");
            return false;

        }
    }
    if (!mobile.match(regm)) {
        $('#add_agent_err_div').removeClass('hide');
        $('#add_agent_msg').html("Invalid mobile number");
        return false;
    }
    if (email == "") {
        $('#add_agent_msg').html("please enter email ID");
    } else {
        if (email.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
            $('#add_agent_err_div').removeClass('hide');
            $('#add_agent_msg').html("email contains invalid characters.");
            return false;

        }

        if (!email.match(regk)) {
            $('#add_agent_err_div').removeClass('hide');
            $('#add_agent_msg').html("Invalid email address");
            return false;
        }
    }
    $.blockUI({ message: "<h4>saving...</h4>" });
    setTimeout(function () {
        var resp = add_agent(email, mobile, firstname, lastname);
        //if (resp!= "false" && resp != "error") {

        if (resp.Message == 'ok') {

            $('#add_agent_info_div').addClass('hide');
            $('#add_agent_success').html("");
            $('#addnew-agent').modal('hide');
            m = $('#module_' + cur_nid);
            var module = m.find('.module-save').attr("module");
            switch (module) {
                case 'ring user(s)':
                    var a_con = "";
                    var s_con = "";
                    a_con = '<li id="agent_' + cur_nid + '_' + resp.items[0].id + '" class="selected" mobile="' + resp.items[0].mobile + '" email="' + resp.items[0].email + '" name="' + resp.items[0].first_name + ' ' + resp.items[0].last_name + '" aid="' + resp.items[0].id + '">' + resp.items[0].first_name + ' - ' + resp.items[0].mobile + '</li>';
                    s_con = '<li id="selagent_' + cur_nid + '_' + resp.items[0].id + '" class="ui-state-default" aid="' + resp.items[0].id + '"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' + resp.items[0].first_name + ' ' + resp.items[0].last_name + '<span class="remove">X</span></li>';
                    m.find('ul.agents-list').prepend(a_con);
                    m.find('ul.sortable-list').prepend(s_con);
                    showhide_r_str(cur_nid);
                    break;
                case 'voice mail':
                    m.find('.modal-body select.select-box').append
			 ("<option selected value='" + resp.items[0].id + "'>" + resp.items[0].first_name + " - " + resp.items[0].mobile + "</option>")
                    break;
            }
        } else {
            return false;
        }

    }, 100);
}
function auto_save_db() {
    $('#auto_save_msg').show();
    auto_save = 1;
    diagram.toXML();
    setTimeout(function () { $('#auto_save_msg').hide(); }, 2000);
}
function time_desc() {
    distincttime = [];
    desc = "";
    var distincttime = time.filter(function (itm, i, time) {
        return i == time.indexOf(itm);
    });
    for (i = 0; i < distincttime.length; i++) {
        d_t = "";
        index = 0;
        for (j = 0; j < time.length; j++) {
            if (distincttime[i] == time[j]) {
                if (d_t == "") {
                    d_t = day_name[j]
                }
                else {
                    d_t = d_t + "," + day_name[j]
                }
            }
        };

        if (d_t.indexOf("Mon") >= 0 && d_t.indexOf("Tue") >= 0 && d_t.indexOf("Wed") >= 0 && d_t.indexOf("Thu") >= 0 && d_t.indexOf("Fri") >= 0 && d_t.indexOf("Sat") >= 0 && d_t.indexOf("Sun") >= 0) {
            d_t = "All Days"
        } else if (d_t.indexOf("Mon") >= 0 && d_t.indexOf("Tue") >= 0 && d_t.indexOf("Wed") >= 0 && d_t.indexOf("Thu") >= 0 && d_t.indexOf("Fri") >= 0 && d_t.indexOf("Sat") < 0 && d_t.indexOf("Sun") < 0) {
            d_t = "Week Days"
        } else if (d_t.indexOf("Mon") < 0 && d_t.indexOf("Tue") < 0 && d_t.indexOf("Wed") < 0 && d_t.indexOf("Thu") < 0 && d_t.indexOf("Fri") > 0 && d_t.indexOf("Sat") > 0 && d_t.indexOf("Sun") > 0) {
            d_t = "week ends"
        }
        else {
            d_t = d_t
        }
        desc = desc + "[" + d_t + ":" + distincttime[i] + "]"
    };
    return desc;
}



function quetionConvert(id, txtVal) {
    var user_id = $('#user_id').val();
    $('#loaddiv').show();
    var language_name = $("#lang_" + id + " option:selected").text();
    langid = $("#lang_" + id + " option:selected").attr("lid");
    vid = $("#ttschars_" + id + " option:selected").attr("vid");
    eid = $("#ttschars_" + id + " option:selected").attr("eid");
    var converttxt = txtVal;
    if ($.trim(converttxt) == "") {
        alert("Please Enter The Text to Convert");
        return 0;
    }
    else {
        $('#div_que' + id + ' .div_que_error').html("");
    }
    var filename = '';
    $.ajax({
        url: "Vocalware_v1.aspx",
        type: 'post',
        data: { voiceid: vid, engid: eid, ttstxt: converttxt, lid: langid, user_id: user_id, language_name: language_name },
        async: false,
        success: function (response) {
            if (response == "File Not Converted") {
                filename = 2;
            }
            else {
                $('#div_que_error').show().html('');
                filename = response;
            }
        },
        error: function (response) {
        }
    });
    return filename;
}

//function ttsagentload(lid, cnt) {
//    langid = ($("#ttschars_" + cnt + " option:selected").attr("value"));
//    var language_name = $("#lang_" + cnt + " option:selected").text();
//    /*if (lid == 0) {
//    $('#dyn-selbox').fadeOut(800);
//    $('#convertmsg').hide();
//    if (language_name == "Telugu" || language_name == "Hindi" || language_name == "Kannada") {
//    $('#convertmsg').show();
//    }
//    }
//    else {
//    $('#dyn-selbox').fadeIn(800);
//    $('#convertmsg').show();
//    }*/
//    $.ajax({
//        url: "update_voice_clipname.aspx",
//        data: { value: 8, req: lid },
//        type: "post",
//        dataType: "json",
//        success: function (response) {
//            var divcon = '', i = 0, l = response.length;
//            for (i = 0; i < l; i++) {
//                if (i == 0) {
//                    divcon = '<option value="2" vid="' + response[i].vid + '" eid="' + response[i].eid + '" selected>' + res.clip + '</option>';
//                }
//                else {
//                    divcon = divcon + '<option value="2" vid="' + response[i].vid + '" eid="' + response[i].eid + '">' + res.clip + '</option>';
//                }
//            }
//            if (cnt == 1) {
//                $('#ttschars_' + cnt + '').html(divcon);
//                // $('#ttschars_100').html(divcon);
//            }
//            else {
//                $('#ttschars_' + cnt + '').html(divcon);
//            }

//            //divcon = "<select id='ttschars' style='float:left; margin-left:10px;'>" + divcon + "</select>";
//            //$('#dyn-selbox').html(divcon);
//        },
//        error: function (response) {
//        }
//    });
//    return false;
//}

function FilesUps(ids) {
    var alertDiv_Id;
    if (ids == "flUpload_11")
        alertDiv_Id = "fileupload_div";
    else if (ids == "flUpload_GttMsg")
        alertDiv_Id = "fileupload_div_GttMsg";
    else if (ids == "flUpload_thksMsg")
        alertDiv_Id = "fileupload_div_thnksMsg";
    else if (ids == "flUpload_InvalidKey")
        alertDiv_Id = "fileupload_div_InvalidKey";
    else if (ids == "flUpload_InvalidExt")
        alertDiv_Id = "fileupload_div_InvalidExt";
    else if (ids == "flUpload_NoAns")
        alertDiv_Id = "fileupload_div_NoAns";
    $("." + ids + "").fileupload({
        dataType: 'json',
        url: 'Handlers/IvrStudioAudioFileUpload.ashx',
        autoUpload: false,
        acceptFileTypes: /(\.|\/)(mp3|wav)$/i,
        maxFileSize: 5000000, // 5 MB
        start: function () { $.blockUI({ message: "<h4>Please wait.. Your clip is Loading...</h4>" }); },
        add: function (e, data) {
            var uploadErrors = [];

            if (data.originalFiles[0]['size'].length && data.originalFiles[0]['size'] > 5000000) {
                uploadErrors.push('Filesize is too big');
                return false;
            }
            if (uploadErrors.length > 0) {
               // alert(uploadErrors.join("\n"));
                $(".errordiv[nodeId='" + cur_nid + "']").html(uploadErrors.join("\n"));
                return false;
            } else {
                data.submit();
            }
        },
        done: function (e, data) {
            $.unblockUI();
            $(".errordiv[nodeId='" + cur_nid + "']").html("");
            try {
                if (data.result.Status == 401) {
                    redirect_to_login_page();
                }
                else if (data.result.Status == 1) {
                    $("." + alertDiv_Id).hide();
                    console.log(cur_nid);
                    
                    if (ids == "flUpload_11") {
                        Is_File_Play = data.result.Clip;
                        var pathh = hdn_ivrclipsurl + data.result.Clip + "";
                        $('#fileupload_div .uploadfile[nodeid="' + cur_nid + '"]').attr('path', pathh);
                        clip_html = "<audio controls><source src='" + pathh + "'>Your browser does not support the audio element.</audio>";
                        $('#fileupload_div .audio_player[nodeid="' + cur_nid + '"]').show().find('.player').html(clip_html);
                        $('#fileupload_div .flUpload_11[nodeid="' + cur_nid + '"]').hide();
                        $('#fileupload_div .audio_player[nodeid="' + cur_nid + '"] ').find('.uploadnew').show();
                    }
                    else if (ids == "flUpload_11_busy") {
                        Is_File_Play = data.result.Clip;
                        var pathh = hdn_ivrclipsurl + data.result.Clip + "";
                        $('#fileupload_div_busy .uploadfile_busy[nodeid="' + cur_nid + '"]').attr('path', pathh);
                        clip_html = "<audio controls><source src='" + pathh + "'>Your browser does not support the audio element.</audio>";
                        $('#fileupload_div_busy .audio_player_busy[nodeid="' + cur_nid + '"]').show().find('.player_busy').html(clip_html);
                        $('#fileupload_div_busy .flUpload_11_busy[nodeid="' + cur_nid + '"]').hide();
                        $('#fileupload_div_busy .audio_player[nodeid="' + cur_nid + '"] ').find('.uploadnew').show();
                    }
                    else if (ids == "flUpload_GttMsg") {
                        Is_File_Greetng = data.result.Clip;
                        var pathh = hdn_ivrclipsurl + data.result.Clip + "";
                        $('#fileupload_div_GttMsg .uploadfile[nodeid="' + cur_nid + '"]').attr('path', pathh);
                        clip_html = "<audio controls><source src='" + pathh + "'>Your browser does not support the audio element.</audio>";
                        $('#fileupload_div_GttMsg .audio_player[nodeid="' + cur_nid + '"]').show().find('.player').html(clip_html);
                        $('#fileupload_div_GttMsg .flUpload_GttMsg[nodeid="' + cur_nid + '"]').hide();
                        $('#fileupload_div_GttMsg .audio_player[nodeid="' + cur_nid + '"] ').find('.uploadnew').show();
                    }
                    else if (ids == "flUpload_thksMsg") {
                        Is_File_thanks = data.result.Clip;
                        var pathh = hdn_ivrclipsurl + data.result.Clip + "";
                        $('#fileupload_div_thnksMsg .uploadfile[nodeid="' + cur_nid + '"]').attr('path', pathh);
                        clip_html = "<audio controls><source src='" + pathh + "'>Your browser does not support the audio element.</audio>";
                        $('#fileupload_div_thnksMsg .audio_player[nodeid="' + cur_nid + '"]').show().find('.player').html(clip_html);
                        $('#fileupload_div_thnksMsg .flUpload_thksMsg[nodeid="' + cur_nid + '"]').hide();
                        $('#fileupload_div_thnksMsg .audio_player[nodeid="' + cur_nid + '"] ').find('.uploadnew').show();
                    }
                    else if (ids == "flUpload_InvalidKey") {
                        Is_File_InvldKey = data.result.Clip;
                        var pathh = hdn_ivrclipsurl + data.result.Clip + "";
                        $('#fileupload_div_InvalidKey .uploadfile[nodeid="' + cur_nid + '"]').attr('path', pathh);
                        clip_html = "<audio controls><source src='" + pathh + "'>Your browser does not support the audio element.</audio>";
                        $('#fileupload_div_InvalidKey .audio_player[nodeid="' + cur_nid + '"]').show().find('.player').html(clip_html);
                        $('#fileupload_div_InvalidKey .flUpload_InvalidKey[nodeid="' + cur_nid + '"]').hide();
                        $('#fileupload_div_InvalidKey .audio_player[nodeid="' + cur_nid + '"] ').find('.uploadnew').show();
                    }
                    else if (ids == "flUpload_InvalidExt") {
                        Is_File_InvalidExt = data.result.Clip;
                        var pathh = hdn_ivrclipsurl + data.result.Clip + "";
                        $('#fileupload_div_InvalidExt .uploadfile[nodeid="' + cur_nid + '"]').attr('path', pathh);
                        clip_html = "<audio controls><source src='" + pathh + "'>Your browser does not support the audio element.</audio>";
                        $('#fileupload_div_InvalidExt .audio_player[nodeid="' + cur_nid + '"]').show().find('.player').html(clip_html);
                        $('#fileupload_div_InvalidExt .flUpload_InvalidExt[nodeid="' + cur_nid + '"]').hide();
                        $('#fileupload_div_InvalidExt .audio_player[nodeid="' + cur_nid + '"] ').find('.uploadnew').show();
                    }
                    else if (ids == "flUpload_NoAns") {
                        Is_File_NoAns = data.result.Clip;
                        var pathh = hdn_ivrclipsurl + data.result.Clip + "";
                        $('#fileupload_div_NoAns .uploadfile[nodeid="' + cur_nid + '"]').attr('path', pathh);
                        clip_html = "<audio controls><source src='" + pathh + "'>Your browser does not support the audio element.</audio>";
                        $('#fileupload_div_NoAns .audio_player[nodeid="' + cur_nid + '"]').show().find('.player').html(clip_html);
                        $('#fileupload_div_NoAns .flUpload_NoAns[nodeid="' + cur_nid + '"]').hide();
                        $('#fileupload_div_NoAns .audio_player[nodeid="' + cur_nid + '"] ').find('.uploadnew').show();
                    }

                }
                else {
                    if (ids == "flUpload_11") {
                        Is_File_Play = "";
                        $('.flUpload_11').show();
                    }
                    else if (ids == "flUpload_GttMsg") {
                        $('.flUpload_11').show();
                        Is_File_Greetng = "";
                    }
                    else if (ids == "flUpload_thksMsg") {
                        $('.flUpload_11').show();
                        Is_File_thanks = "";
                    } else if (ids == "flUpload_InvalidExt") {
                        $('.flUpload_11').show();
                        Is_File_InvalidExt = "";
                    } else if (ids == "flUpload_NoAns") {
                        $('.flUpload_11').show();
                        Is_File_NoAns = "";
                    }
                    else if (ids == "flUpload_InvalidKey")
                        Is_File_InvldKey = "";
                    //$("." + alertDiv_Id + "").removeClass("hide");
                    //$("." + alertDiv_Id + "").removeClass("success");
                   // $("." + alertDiv_Id + "").show();
                    $(".errordiv[nodeId='" + cur_nid + "']").html(data.result.ErrorReason);
                    //alert(s.ErrorReason);
                   // $("." + alertDiv_Id + " span").text(data.result.ErrorReason);

                    //$("." + alertDiv_Id + " span").text("Please Upload Valid .Mp3 or .Wav File");
                }

            }
            catch (e) {
                $(".errordiv[nodeId='" + cur_nid + "']").html("Please Upload Valid .Mp3 or .Wav File");
               // $("#" + alertDiv_Id + "").html('<span class="alert-error">Please Upload Valid .Mp3 or .Wav File</span>');

               // $("#" + alertDiv_Id + "").append("<span class='alert-error' > Error:" + e + "</span>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $(".errordiv[nodeId='" + cur_nid + "']").html("Failed: " + errorThrown);
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

//----------------------------------------------------new script-------------------------------------------------
$('#ivr_popups').delegate('.timepicker-input', 'click', function () {
    $(this).timepicker();

    //	                showInputs: false,
    //	                // modalBackdrop: true,
    //	                showMeridian: false
});
$('.timepicker-input').timepicker().on('show.timepicker', function (e) {
    var nodid = $(this).attr('no_id');
    $('#addnew_form_' + nodid + ' .body').addClass("adjust-timepicker");
});
$('.timepicker-input').timepicker().on('hide.timepicker', function (e) {
    var nodid = $(this).attr('no_id');
    $('#addnew_form_' + nodid + ' .body').removeClass("adjust-timepicker");
});

$('#ivr_popups').delegate('.addnew_link', 'click', function () {
    var no_id = $(this).attr('id').replace('addnew_', '');
    $("#hh").addClass("header").html("<h3>Add new time of the day</h3>");
    $('#addnew_form_' + no_id + '').show();
    $('.week').show();
    showaddnewform(no_id, 'time of the day');
});
$('#ivr_popups').delegate('#text_radio', 'click', function () {
    $(".ddl_lang").show();
    //    $('.btn_convert').show();
    //    $('#btn_allclips').show();
});







$(document).delegate('.btn_convert', 'click', function () {
    $.blockUI({ message: "<h4>converting...</h4>" });
    var name_id = $(this).attr('name');
    var language_name = '';
    var lag = '';
    if (name_id == 'invalid_msg') {
        var txt_msg = $('#txt_msg1').val();
        if (txt_msg.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
            $('#err_msg').text('Text message contains invalid characters.');
            $('.alert alert-error').show();
            return false;
        }
        else {
            $('.alert alert-error').hide();
        }
        language_name = $("#" + name_id + " > .ddl_lang1 option:selected").text();
        lag = $('.ddl_lang1').val();
    } else {
        var txt_msg = $('#txt_msg').val();
        language_name = $("#" + name_id + " > .ddl_lang option:selected").text();
        lag = $('.ddl_lang').val();
    }
    $.ajax({
        url: "Handlers/Studio.ashx",
        type: "post",
        dataType: "json",
        data: { type: 4, message: txt_msg, language: language_name },
        success: function (s) {
            //            $('#div_vclips').html('');
            //            $('#div_vclips1').html('');
            if (s.Status == 1) {
                var clip_name = s.clip;
                var clip_html = "";
                clip_html = clip_html + "<div style='margin-top:40px;padding-left:6px'><div class='sco8' style='float:left;'>";
                //                clip_html = clip_html + "<input type='radio' name='rad' id='rd" + s.clip.replace(".", "") + "' value='" + s.clip + "' class='radcls' onclick='return userclip(this.value);'/>";
                clip_html = clip_html + "<span class='sco80 padding_top3 blue'  id='lb" + s.clip + "'>" + s.clip + "</span></div>";

                clip_html = clip_html + "<div class='sco12' style='margin-left:367px;'><div class='ui360' style='width:50px;float:left;margin-top:-15px;' ><a href='" + hdn_ivrclipsurl + clip_name + "'></a></div></div><div style='margin: -34px;'>";
                clip_html = clip_html + "<a href='javascript:void(0);' style='margin:0px 16px 0px -1px;'><img id=" + s.clip + " src='images/edit_icon.png' alt='edit clip' title='edit clip' onclick='return edit_clip(this.id);'/></a>";
                clip_html = clip_html + "<a href='javascript:void(0);'><img id=" + s.clip + " src='images/delete_bin_icon.png' alt='Delete Clip' title='Delete Clip' onclick='return display1(this.id);'/></a>";
                clip_html = clip_html + "<a href='javascript:void(0);'><img id=" + s.clip + " src='images/download.png' alt='Download Clip' title='Download Clip' onclick='return download(this.id);' style='margin-left:17px;'/></a></div><div style='clear:both;'>";
                clip_html = clip_html + "</div></div><div style='clear:both;'></div></div>";
                $.unblockUI();
                if (name_id == 'invalid_msg') {
                    $('#div_vclips1').html(clip_html);
                } else {
                    $('#div_vclips').html(clip_html);
                }
            }
            else if (s.Status == 401) {
                redirect_to_login_page();
            } else {
                alert(s.ErrorReason);
            }
            $.unblockUI();
        },
        Error: function (res) {
            alert('error');
        }

    });

});


//function translate(txt_id,t) {
//    if (t == 1) {
//        transliterationControl.disableTransliteration();
//        transliterationControl.setLanguagePair(google.elements.transliteration.LanguageCode.ENGLISH, "te");
//    }
//    else {
//        transliterationControl.enableTransliteration();
//        console.log("other : " + t);
//        transliterationControl.setLanguagePair(google.elements.transliteration.LanguageCode.ENGLISH, t);
//        console.log(transliterationControl.isTransliterationEnabled());
//        $('.btn_convert').show();
//        $('#btn_allclips').show();
//    }
//}

$(document).delegate('.btn_allclips', 'click', function () {
    var name = $(this).attr();
    $.ajax({
        url: "get_time_of_the_day.aspx",
        type: "post",
        dataType: "json",
        data: { type: 9 },
        success: function (res) {
            if (re.Status == 1) {
                var len = res.data.length;
                var clip_html = "";
                if (len > 0) {
                    clip_html = clip_html + "<div  style='margin-top:30px;border:2px solid black;padding-left:5px;overflow-y: scroll; overflow-x: hidden; height: 150px;'>";
                    for (var i = 0; i < len; i++) {
                        clip_html = clip_html + "<div class='sco8' style='float:left;'>";
                        clip_html = clip_html + "<input type='radio' name='rad' id='rd" + res.data[i].file_name.replace(".", "") + "' value='" + res.data[i].file_name + "' class='radcls' onclick='return userclip(this.value);'/>";
                        clip_html = clip_html + "<span class='sco80 padding_top3 blue'  id='lb" + res.data[i].file_name.replace(".", "") + "'>" + res.data[i].file_name + "</span></div>";

                        //clip_html = clip_html + "<div class='sco12' style=margin-left:362px;'><div class='ui360' style='width:50px;float:left;margin-top:-15px;' ><a href='http://conference.smscountry.com/voice_clips/" + res.data[i].file_name + "'></a></div></div><div style='margin: 1px 0 0;'>";
                        clip_html = clip_html + "<div style='margin-left:337px' class='sco12'><div style='width: 50px; float: left; margin-top: -15px; background-image: none;' class='ui360'>";
                        clip_html = clip_html + "<div class='sm2-360ui'><canvas height='50' width='50' class='sm2-canvas'></canvas> <span class='sm2-360btn sm2-360btn-default'></span> <div class='sm2-timing'>0</div>";
                        clip_html = clip_html + "<div class='sm2-cover'></div></div><a href='" + hdn_ivrclipsurl + res.data[i].file_name + "' class='sm2_link'></a></div></div>";


                        clip_html = clip_html + "<a href='javascript:void(0);' style='margin:0px 18px 0px -1px;'><img id=" + res.data[i].file_name.replace(".", "") + " src='images/edit_icon.png' alt='edit clip' title='edit clip' onclick='return edit(this.id,2);'/></a>";
                        clip_html = clip_html + "<a href='javascript:void(0);'><img id=" + res.data[i].file_name + " src='images/delete_bin_icon.png' alt='Delete Clip' title='Delete Clip' onclick='return delete_clip(this.id);'/></a>";
                        clip_html = clip_html + "<a href='javascript:void(0);'><img id=" + res.data[i].file_name + " src='images/download.png' alt='Download Clip' title='Download Clip' onclick='return download(this.id,0);' style='margin-left:17px;'/></a><div style='clear:both;'></div>";
                        //clip_html = clip_html + "</div><div style='clear:both;'></div>";
                    }
                    clip_html = clip_html + "</div>";
                    $('#div_vclips').html(clip_html);
                }
            }
            else if (res.Status == 401) {
                redirect_to_login_page();
            } else {
                alert(res.ErrorReason);
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
});

function onLoad() {
    transliterationControl = new google.elements.transliteration.TransliterationControl(a);
    transliterationControl.addEventListener(google.elements.transliteration.TransliterationControl.EventType.SERVER_UNREACHABLE, serverUnreachableHandler);
    transliterationControl.addEventListener(google.elements.transliteration.TransliterationControl.EventType.SERVER_REACHABLE, serverReachableHandler)
}
function serverUnreachableHandler(a) { document.getElementById("errorDiv").innerHTML = "Transliteration Server unreachable"; }
function serverReachableHandler(a) { document.getElementById("errorDiv").innerHTML = ""; }


$(document).delegate('.ddl_lang,.ddl_lang1', 'change', function () {

    var t = $(this).val();
    var n = $(this).attr("nodeid");
    var m = $('#module_' + n);

    var type1 = $(this).attr('parent1');
    if (type1 == 'greet_conv') {
        transliterationControl.makeTransliteratable(["txt_msg"]);
    }
    else if (type1 == 'invalid_conv') {
        // m.find($('.' + $(this).attr("parent1"))).show();
        transliterationControl.makeTransliteratable(["txt_msg1"]);
    }
    else {
        transliterationControl.makeTransliteratable(["txt_msg"]);
        //m.find($('.' + $(this).attr("parent1")).show();
        //m.find($('.' + $(this).attr("parent1"))).show();
    }
    transliterationControl.disableTransliteration();
    if ((t == 1) || (t == 32)) {
        m.find($('.' + $(this).attr("parent1"))).hide();
        console.log("eng -" + t);
        transliterationControl.disableTransliteration();
        transliterationControl.setLanguagePair(google.elements.transliteration.LanguageCode.ENGLISH, "te")
    }
    else if (t == 0) { transliterationControl.disableTransliteration(); }
    else {
        m.find($('.' + $(this).attr("parent1"))).show();
        console.log("other -" + t);
        transliterationControl.enableTransliteration();
        transliterationControl.setLanguagePair(google.elements.transliteration.LanguageCode.ENGLISH, t)
    }

});

//function edit_clip(id) {
//    $("#clip_name").attr("value", id);
//    $("#edit_clip_box").modal('show');
//    $("#update_clip").click(function () {
//        var new_clip = $("#clip_name").val();
//        $.ajax({
//            url: 'get_time_of_the_day.aspx',
//            method: 'POST',
//            data: { type: 10, old_clip: id, new_clip: new_clip },
//            success: function () {
//                $("#edit_clip_box").modal('hide');
//                console.log($('#lb' + id));
//                $('#lb' + id).text(new_clip);
//            },
//            error: function () { }
//        });

//    });
//}

//function delete_clip(id) {
//    $.ajax({
//        url: 'get_time_of_the_day.aspx',
//        method: 'POST',
//        data: { type: 11, clip: id },

//        success: function (s) {
//            if (s == 'success') {
//                $('#lb' + id).parent().remove();
//            }
//        },
//        error: function () { }
//    });
//}

function redirect_to_login_page() {
    window.location.href = "/login_page.aspx?msg=Your session expired, please login";
}
function getTimeSlots() {
    $.ajax({
        type: "GET",
        url: "Handlers/Studio.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 8 },
        success: function (res) {
            var resHtml = "";
            if (res.Success == "True") {
                if (res.TimeSlots.length > 0) {
                    resHtml = "<option value='0'>Select Timeslot</option>";
                    for (var i = 0; i < res.TimeSlots.length; i++) {
                        resHtml += "<option value='" + res.TimeSlots[i].Id + "'>" + res.TimeSlots[i].Name + "</option>";
                    }
                    global_TimeSlots = resHtml;
                } else {
                    global_TimeSlots = "<option value='0'>No Time slots</option>";
                }
            } else { global_TimeSlots = "<option value='0'>No Time slots</option>"; }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            global_TimeSlots = "<option value='0'>No Time slots</option>";
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
function getTimeSlotTimings(selectedNodeId, selectedSlotName, selectedTimeSlotId) {
    $.ajax({
        type: "GET",
        url: "Handlers/Studio.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 7, timeSlotId: selectedTimeSlotId },
        success: function (res) {
            var resHtml = "";
            if (res.Success == "True") {
                if (res.Timings.length > 0) {
                    for (var i = 0; i < res.Timings.length; i++) {
                        resHtml += "<tr><td>" + res.Timings[i].Day + "</td>";
                        resHtml += "<td>"+ res.Timings[i].FromTime +" - "+ res.Timings[i].ToTime +"</td>";
                        resHtml += "</tr>";
                    }
                    $("#slotName_" + selectedNodeId).html("Name: " + selectedSlotName);
                    $("#showTimings_" + selectedNodeId).html(resHtml);
                    $("#viewTiming_" + selectedNodeId).show();
                } else {
                    resHtml += "";
                    $("#slotName_" + selectedNodeId).html(resHtml);
                    $("#showTimings_" + selectedNodeId).html(resHtml);
                    $("#viewTiming_" + selectedNodeId).hide();
                }
            } else {
                resHtml += "";
                $("#slotName_" + selectedNodeId).html(resHtml);
                $("#showTimings_" + selectedNodeId).html(resHtml);
                $("#viewTiming_" + selectedNodeId).hide();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#slotName_" + selectedNodeId).html("");
            $("#showTimings_" + selectedNodeId).html("");
            $("#viewTiming_" + selectedNodeId).hide();
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

function getAccountCallerIds() {
    $.ajax({
        type: "GET",
        url: "Handlers/Studio.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 10},
        success: function (res) {
            var resHtml = "";
            if (res.Success == "True") {
                resHtml += "<option value='0'>Select </option>";
                if (res.CallerIdDetails.length > 0) {
                    for (var i = 0; i < res.CallerIdDetails.length; i++) {
                        resHtml += "<option value='"+ res.CallerIdDetails[i].Id +"'>"+ res.CallerIdDetails[i].CallerId +"</option>";
                    }
                    $("#selCallerIdNumbers").html(resHtml);
                } else {
                    $("#selCallerIdNumbers").html("<option value='0'>No callerId numbers</option>");
                }
            } else {
                $("#selCallerIdNumbers").html("<option value='0'>No callerId numbers</option>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#selCallerIdNumbers").html("<option value='0'>No callerId numbers</option>");
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
function getAccountStudioPurposes() {
    $.ajax({
        type: "GET",
        url: "Handlers/Studio.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 11},
        success: function (res) {
            var resHtml = "";
            if (res.Success == "True") {
                resHtml += "<option value='0'>Select </option>";
                if (res.StudioPurposes.length > 0) {
                    for (var i = 0; i < res.StudioPurposes.length; i++) {
                        resHtml += "<option value='"+ res.StudioPurposes[i].Id +"'>"+ res.StudioPurposes[i].Purpose +"</option>";
                    }
                    resHtml += "<option value='000'>Others</option>";
                    $("#selStudioPurpose").html(resHtml);
                } else {
                    $("#selStudioPurpose").html("<option value='0'>No purposes available</option><option value='000'>Others</option>");
                }
            } else {
                $("#selStudioPurpose").html("<option value='0'>No purposes available</option><option value='000'>Others</option>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#selStudioPurpose").html("<option value='0'>No purposes available</option>");
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

var my_date_format = function (d) {
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var date = d.getDate() + " " + month[d.getMonth()] + ", " + d.getFullYear();
    var time = d.toLocaleTimeString().toLowerCase().replace(/([\d]+:[\d]+):[\d]+(\s\w+)/g, "$1$2");
    return (date + " " + time);
};