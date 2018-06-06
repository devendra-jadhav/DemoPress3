var optioncount = 1;
var priority = 0;
var isTreeConstructed = false;
var unitsData = "";

$(document).ready(function () {
    manageAccountSettings(2, "");
    mmanageCategoryNodes(2, "", "", 0, "");
    AccountSettingsManagement(2, "", 0, 0, "False", 0, "");
    manageTicketStatuses(1, "", 0, 0, "");
    $(".priorityColorCode").colorpicker();
    $("#btnAddField").click(function () {
        optioncount = 1;
        $(".textareaFields").hide();
        $("#txtFieldName").val("");
        $("#ddlFieldType").val("0");
        $(".textboxFields").hide();
        $("#txtMaxchars").val("");
        $("#ddlMandatory").val("1");
        $("#ddlSpecialchars").val("1");
        $("#ddlInputType").val("0");
        $("#optionsData").html("");
        $("#dropdownFields").hide();
        $("#txtareaMaxchars").html("");
        $("#createFields").modal("show");
    });
    $("input:text").keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
    $('.number').keypress(function (event) {
        if ((event.which < 48 || event.which > 57) && event.which != 8) {
            event.preventDefault();
        }

    });
    $(document).on("input", ".number", function () {
        this.value = this.value.replace(/[^\d]/g, '');
    });



    $("#ddlFieldType").change(function () {
        optioncount = 1;
        if ($(this).val() == "1") {
            $(".textboxFields").show();
            $(".dropdownFields").hide();
            $(".textareaFields").hide();
        }
        else if ($(this).val() == "2") {
            $(".textboxFields").hide();
            $(".dropdownFields").show();
            $("#optionsData").html("<div class='margin-bottom-5'><label class='txt-grey margin-right-10'>Option 1</label><input type='text' maxlength='100'class='options form-control input-inline' /><button type='button' id='addOption' class='btn btn-success margin-left-5'><i class='fa fa-plus margin-right-5'></i>Add Option</button></div>")
            $(".textareaFields").hide();
        } else if ($(this).val() == "3") {
            $("#txtareaMaxchars").val("");
            $(".textboxFields").hide();
            $(".dropdownFields").hide();
            $(".textareaFields").show();
        }
    });
    $("#btnSaveField").click(function () {
        priority = 0;
        var fieldName = "";
        var fieldType = 0;
        var maxChars = "";
        var allowSpecialChars = "";
        var inputType = 0;
        var fieldData = ""
        var mandatary = 0;
        var optionsInfo = "";
        fieldName = $("#txtFieldName").val();
        fieldName = fieldName.trim();


        fieldName = $("#txtFieldName").val().trim();

        if (fieldName == "") {
            alert("Field Name Is Mandatary");
            return false;
        }
        var validateFieldNameResponse = validateFieldName(fieldName);
        if (!validateFieldNameResponse) {
            alert("Field Name already Exists");
            return false;
        }
        fieldType = $("#ddlFieldType").val();
        if (fieldType == "0") {
            alert("Please Select Field Type");
            return false;
        }
        else if (fieldType == "1") {
            maxChars = $("#txtMaxchars").val().trim();
            allowSpecialChars = $("#ddlSpecialchars").val();
            if (allowSpecialChars == 0) {
                alert("Please Choose Special Characters option");
            }

            if (maxChars == "") {
                alert("Please enter max characters");
                return false;
            }
            if (Number(maxChars) > 50) {
                alert("Invalid length");
                return false;
            }
            inputType = $("#ddlInputType").val();
            if (inputType == "0") {
                alert("Please Select input type");
                return false;
            }
        }
        else if (fieldType == "2") {
            var flag = 1;
            $(".options").each(function () {

                if ($(this).val().trim() == '' || $(this).val().trim() == 'undefined') {
                    alert("Please enter text in option " + flag);
                    flag = 0;
                    return false;
                }
                else {
                    optionsInfo += $(this).val() + ",";
                    flag++;
                }
            });
            
            if (flag != 0)
            { optionsInfo = optionsInfo.substring(0, optionsInfo.length - 1); }
            else
                return false;
        }
        else if (fieldType == "3") {
            //alert($("#txtareaMaxchars").val());
            maxChars = $("#txtareaMaxchars").val();

            if (maxChars == "") {
                alert("Please enter max characters");
                return false;
            }
            //if (Number(maxChars) > 300) {
            //    alert("Invalid length");
            //    return false;
            //}

        }
        mandatary = $("#ddlMandatory").val();
        if (mandatary == "0") {
            alert("Please Select Mandatary field");
            return false;
        }

        fieldData += "<div class='settingFields field_panel " + fieldName + "'><label class='fieldName txt-grey blocked f_15 margin-bottom-10'>" + fieldName + "</label>";
        //fieldData += "<span class='close_top' style='cursor:pointer;'><i class='fa fa-caret-up txt-grey'></i> <i class='fa fa-caret-down blocked txt-grey'></i></span>"
        fieldData += "<div class='row viewRow'>";
        if (fieldType == "1") {
            fieldData += "<label class='col-sm-2 col-md-2 field'><input type='text' FieldType = 'TextBox' maxlength='200'class='fieldType form-control input-inline' placeholder='" + fieldName + "'/></label>";
            fieldData += "<div class='col-sm-10 col-md-10'><ul class='chats'><li class='in'><div class='message'><span class='arrow'></span>";
            fieldData += "<label class='margin-right-20'>Input Type :  <span  class='inputType font-grey-gallery bold-6'>" + $("#ddlInputType option:selected").text() + "</span></label>";
            fieldData += "<label class='margin-right-20'>Max char Limit : <span class='maxChars font-grey-gallery bold-6'>" + maxChars + "</span></label>";
            fieldData += "<label class='margin-right-20'>Allow Special Char's : <span class= 'allowSpecialChars font-grey-gallery bold-6'>" + $("#ddlMandatory option:selected").text() + "</span></label>";

        }
        else if (fieldType == "2") {
            fieldData += "<label class='col-sm-2 col-md-2 field'><select FieldType = 'DropDown' class='fieldType form-control'>";
            $(".options").each(function () {
                fieldData += "<option class='viewOptions' value='" + $(this).val() + "'>" + $(this).val() + "</option>"
            });
            fieldData += "</select></label>"
            fieldData += "<div class='col-sm-10 col-md-10'><ul class='chats'><li class='in'><div class='message'><span class='arrow'></span>";
        }
        else if (fieldType == "3") {
            fieldData += "<label class='col-sm-2 col-md-2 field'><textarea FieldType = 'TextArea' rows='3' cols='15' maxlength='" + maxChars + "' class='fieldType form-control input-inline' placeholder='" + fieldName + "'></textarea></label>";
            fieldData += "<div class='col-sm-10 col-md-10'><ul class='chats'><li class='in'><div class='message'><span class='arrow'></span>";
            fieldData += "<label class='margin-right-20'>Max char Limit : <span class='maxChars font-grey-gallery bold-6'>" + maxChars + "</span></label>";

        }
        fieldData += "<label class='margin-right-10'>Mandatory Field : <span class='mandatoryField font-grey-gallery bold-6'>" + $("#ddlMandatory option:selected").text() + "</span></label>";
        fieldData += "</div></li></ul></div></div>"

        fieldData += "<div class='row editRow' style='display:none;'>";
        if (fieldType == "1") {
            fieldData += "<label class='col-sm-2 col-md-2 field'><input type='text' FieldType='TextBox' class='editFieldType form-control input-inline margin-top-10' placeholder='Name'/></label>";
            fieldData += "<div class='col-sm-10 col-md-10'><ul class='chats'><li class='in'><div class='message'><span class='arrow'></span>";
            fieldData += "<label class='margin-right-20'>Input Type : <select class='form-control ddlInputType'><option value='Select'>Select</option><option value='Alphabets'>Alphabets</option><option value='Numeric'>Numeric</option><option value='Alphanumeric'>Alphanumeric</option><option value='Unicode'>Unicode</option></select></label>";
            fieldData += "<label class='margin-right-20'>Max char Limit : <input type='text' class='form-control txtMaxCharLimit' maxlength='50'></label>";
            fieldData += "<label class='margin-right-10'>Allow Special Char's: <select class='form-control ddlSpecialChars'><option value='Yes'>Yes</option><option value='No'>No</option></select></label>";

        }
        else if (fieldType == "2") {
            fieldData += "<label class='col-sm-2 col-md-2 field'><select FieldType='DropDown' class='margin-top-10  form-control editFieldType'>";
            $(".options").each(function () {
                fieldData += "<option class='editOptions' value=" + $(this).val() + ">" + $(this).val() + "</option>"
            });
            fieldData += "</select></label>";
            fieldData += "<div class='col-sm-10 col-md-10'><ul class='chats'><li class='in'><div class='message'><span class='arrow'></span>";
        } else if (fieldType == "3") {
            fieldData += "<label class='col-sm-2 col-md-2 field'><textarea FieldType = 'TextArea' rows='3' cols='15' maxlength='" + maxChars + "' class='fieldType form-control input-inline' placeholder='" + fieldName + "'></textarea></label>";
            fieldData += "<div class='col-sm-10 col-md-10'><ul class='chats'><li class='in'><div class='message'><span class='arrow'></span>";
            fieldData += "<label class='margin-right-20'>Max char Limit : <input type='text' class='form-control txtMaxCharLimit'  maxlength='50'></label>";


            //fieldData += "<label class='col-sm-2 col-md-2 field'><textarea FieldType='TextArea'  rows='3' cols='15' class='editFieldType form-control input-inline margin-top-10' placeholder=''></textarea></label>";
            //fieldData += "<div class='col-sm-10 col-md-10'><ul class='chats'><li class='in'><div class='message'><span class='arrow'></span>";
            //fieldData += "<label class='margin-right-20'>Max char Limit : <input type='text' class='form-control txtMaxCharLimit'></label>";

        }

        fieldData += "<label class='margin-right-10'>Mandatory Field : <select class='form-control ddlMandatory'><option value='Yes'>Yes</option><option value='No'>No</option></select></label>";
        fieldData += "<label class='btn-del pull-right'><i FieldName = " + fieldName + " class='removeField icon-trash '></i></label></div></li></ul></div></div>"
        fieldData += "</div>"
        $("#divSecondaryFields").append(fieldData);
        $("#btnAddFields").show();
    });

    $("#btnAddFields").click(function () {
        priority = 0;
        var fieldsData = "[";
        $(".settingFields").each(function () {
            priority = priority + 1;
            fieldsData += '{"FieldName":"' + $(this).find(".fieldName").html() + '",';
            fieldsData += '"FieldType":"' + $(this).find(".fieldType").attr("FieldType") + '",';
            fieldsData += '"Priority":"' + priority + '",';
            if ($(this).find(".fieldType").attr("FieldType") == "TextBox") {
                fieldsData += '"PlaceHolder":"' + $(this).find(".inputType").html() + '",';
                fieldsData += '"MaxChars":"' + $(this).find(".maxChars").html() + '",';
                fieldsData += '"AllowSpecialChars":"' + $(this).find(".allowSpecialChars").html() + '",';
            }
            else if ($(this).find(".fieldType").attr("FieldType") == "DropDown") {
                var optionsArray = "";
                $(this).find(".viewOptions").each(function () {
                    optionsArray += $(this).val() + ","
                });
                optionsArray = optionsArray.substring(0, optionsArray.length - 1);


                fieldsData += '"Options":"' + optionsArray + '",';
            } else if ($(this).find(".fieldType").attr("FieldType") == "TextArea") {
                fieldsData += '"PlaceHolder":"' + $(this).find(".inputType").text() + '",';
                fieldsData += '"MaxChars":"' + $(this).find(".maxChars").html() + '",';

            }

            fieldsData += '"Mandatory":"' + $(this).find(".mandatoryField").html() + '"},'
        });
        fieldsData = fieldsData.substring(0, fieldsData.length - 1);
        if (fieldsData != "") { fieldsData += "]" }

        manageAccountSettings(1, fieldsData)

    });

    $("#btnUpdateFields").click(function () {
        priority = 0;
        var fieldsData = "[";
        $(".settingFields").each(function () {
            priority = priority + 1
            fieldsData += '{"FieldName":"' + $(this).find(".fieldName").html() + '",';
            if ($(this).find(".fieldType").attr("FieldType") == "TextArea") {
                fieldsData += '"FieldType":"' + $(this).find(".fieldType").attr("FieldType") + '",'
            } else {
                fieldsData += '"FieldType":"' + $(this).find(".editFieldType").attr("FieldType") + '",'
            }
            fieldsData += '"Prority":"' + priority + '",'
            if ($(this).find(".editFieldType").attr("FieldType") == "TextBox") {
                fieldsData += '"PlaceHolder":"' + $(this).find(".ddlInputType").val() + '",';
                fieldsData += '"MaxChars":"' + $(this).find(".txtMaxCharLimit").val() + '",';
                fieldsData += '"AllowSpecialChars":"' + $(this).find(".ddlSpecialChars").val() + '",';
            }
            else if ($(this).find(".editFieldType").attr("FieldType") == "DropDown") {
                var optionsArray = "";
                $(this).find(".editOptions").each(function () {
                    optionsArray += $(this).val() + ","
                });
                optionsArray = optionsArray.substring(0, optionsArray.length - 1);
                fieldsData += '"Options":"' + optionsArray + '",';
            } else if ($(this).find(".fieldType").attr("FieldType") == "TextArea") {
                fieldsData += '"PlaceHolder":"' + $(this).find(".inputType").text() + '",';
                fieldsData += '"MaxChars":"' + $(this).find(".txtMaxCharLimit").val() + '",';

            }
            fieldsData += '"Mandatory":"' + $(this).find(".ddlMandatory").val() + '"},'
        });
        fieldsData = fieldsData.substring(0, fieldsData.length - 1);
        if (fieldsData != "") { fieldsData += "]" }

        manageAccountSettings(1, fieldsData)
        $("#btnAddField").show();
    });

    $("#btnEditField").click(function () {
        $(".settingFields").each(function () {
            //alert($(this).find(".inputType").html() + " " + $(this).find(".maxChars").html());
            if ($(this).find(".fieldType").attr("fieldtype") == "TextArea") {
                //  $(this).find(".ddlInputType").val($(this).find(".fieldType").attr("fieldtype"));
            } else {
                $(this).find(".ddlInputType").val($(this).find(".inputType").html());
            }

            $(this).find(".txtMaxCharLimit").val($(this).find(".maxChars").html());
            $(this).find(".ddlSpecialChars").val($(this).find(".allowSpecialChars").html());
            $(this).find(".ddlMandatory").val($(this).find(".mandatoryField").html());
        });
        $("#btnAddFields").hide();
        $("#btnUpdateFields").show();
        $(".viewRow").hide();
        $(".editRow").show();
        $("#btnAddField").hide();
        $(".drag").show();
    });
    $(document).on("click", ".removeField", function () {
        var fName = $(this).attr("FieldName")
        $("." + fName).remove();
    });
    $(document).on("click", "#addOption", function () {
        optioncount = optioncount + 1;
        $("#removeOption").remove();
        $("#optionsData").append("<div class='margin-bottom-5'><label class='txt-grey margin-right-10'>Option " + optioncount + "</label><input type='text' maxlength='100' class='options form-control input-inline' /></div>")
    });

    $("#divSecondaryFields").sortable({
        connectWith: ".connectedSortable"
    }).disableSelection();



    $("#btnCreateRoot").click(function () {
        $("#btnSaveRoot").show();
        $("#btnSaveNode").hide();
        $("#txtNodeName").val("");
        $("#txtNodeName").val("");
        $(".priorityColorCode").show();
        $("#addCategory").modal("show");
    });

    $("#btnCreateNode").click(function () {
        $("#btnSaveRoot").hide();
        $("#btnSaveNode").show();
        $("#txtNodeName").val("");
        $("#txtNodeName").val("");
        $(".priorityColorCode").show();
        $("#addCategory").modal("show");

    });

    // $('#txtNodeName').on('keypress', function (e) {
    //   if (e.which === 13)
    //   e.preventDefault();

    // });


    $("#btnSaveRoot").click(function () {
        var category = "";
        var colorCode = "";
        category = $("#txtNodeName").val();
        category = category.trim();
        if (category == "") {
            alert("please enter node name");
            return false;
        }
        colorCode = $("#priorityColorPicker").val();
        mmanageCategoryNodes(1, "Root", category, 0, colorCode);
    });

    $("#btnSaveNode").click(function () {
        var category = "";
        var colorCode = "";
        var parentId = $("#jsTree").find(".jstree-clicked").parent().attr("id");
        if (parentId == "undefined") {
            alert("please create root first");
            return false;
        }
        category = $("#txtNodeName").val();
        category = category.trim();
        if (category == "") {
            alert("please enter node name");
            return false;
        }
        colorCode = $("#priorityColorPicker").val();
        mmanageCategoryNodes(1, "Node", category, parentId, colorCode);
    });

    $("#btnRemoveNode").click(function () {
        var parentId = $("#jsTree").find(".jstree-clicked").parent().attr("id");
        if (parentId == "undefined") {
            alert("please select node");
            return false;
        }
        mmanageCategoryNodes(4, 'Node', "", parentId, "");


    });

    $("#createPriority").click(function () {
        $("#lblPriorityErrorMsg").html("");
        $("#updatePriority").attr("Action", "Create");
        $("#cancelPriority").attr("Action", "Create");
        var createPriorityData = "";
        createPriorityData += "<div class='form-group newPriority'><div class='row'><div class='col-sm-6'><label style='width: 100%;' class='txt-grey bold-6'>";
        createPriorityData += "<input type='radio' name='priorities' class='margin-right-10'>"; 
        createPriorityData += "<input type='text' id='txtPriorityName'maxlength='150' class='form-control margin-right-5' style='width: 89%; display: inline;border-radius:4px !important' /></label></div>";
        createPriorityData += "<div class='col-sm-6'><label>Target Closing<input id='txtClosingValue' type='text' maxlength='10'class='form-control margin-right-5 margin-left-5 number' style='width: 70px; display: inline;    border-radius: 4px !important;' />";
        createPriorityData += "<select id='ddlTargetUnit' class='form-control input-inline' style='width:70px;  margin-top:-5px;  border-radius: 4px !important;'>" + unitsData + "</select></label></div><div class='col-sm-6 col-sm-offset-1' style='margin-left:24px;margin-top:10px;'><label class='priorityColorCode input-group colorpicker-component wid89'><input style='border-radius:4px 0px 0px 4px !important;' id='txtColorCode' type='text' value='#FF0000' class='form-control' /><span class='input-group-addon' ><i></i></span></label></div></div></div>";
        $("#accountPriorities").append(createPriorityData); 
        $(".colorpicker").addClass("bfh-colorpicker").attr("data-name", "colorpicker2").attr("data-color", "#FF0000");
        $("#lblEdit").hide();
        $("#lblUpdate").show();
        $('.priorityColorCode').colorpicker();
    });
    $("#editPriority").click(function () {
        $("#lblPriorityErrorMsg").html("");


        var isDefault = $('input[name=priorities]:checked').attr("IsDefault");
        var priorityId = $('input[name=priorities]:checked').attr("PriorityId");
        var colorCode = $('input[name=priorities]:checked').attr("ColorCode");
        $(".priorityColorCode" + priorityId).show();
        $(".priorityColorCode" + priorityId).colorpicker("setValue", colorCode);
        //$(".priorityColorCode" + priorityId).setColor(colorCode);
        
        if (typeof (priorityId) == "undefined") {
            alert("please select priority");
            return false;
        }
       
        else if (isDefault == "True") {
            $("#spnClosingValue" + priorityId).hide();
            $("#txtClosingValue" + priorityId).css("display", "inline").val($("#spnClosingValue" + priorityId).html().trim()).focus();
            $("#spnUnits" + priorityId).hide();
            $("#units" + priorityId).show();
            $("#ddlUnits" + priorityId).val($("#spnUnits" + priorityId).attr("UnitId"));
           
        }
        else {
            $("#spnClosingValue" + priorityId).hide();
            $("#txtClosingValue" + priorityId).css("display", "inline").val($('input[name=priorities]:checked').attr("closingvalue")).focus();
            $("#spnUnits" + priorityId).hide();
            $("#units" + priorityId).show();
        }
        $("#updatePriority").attr("Action", "Update");
        $("#cancelPriority").attr("Action", "Update");
        $("#lblEdit").hide();
        $("#lblUpdate").show();
    });
    $("#cancelPriority").click(function () {
        $("#lblPriorityErrorMsg").html("");
        var action = $(this).attr("Action");
        if (action == "Create") {
            $(".newPriority").remove();
        }
        else {
            var isDefault = $('input[name=priorities]:checked').attr("IsDefault");
            var priorityId = $('input[name=priorities]:checked').attr("PriorityId");
            $("#spnClosingValue" + priorityId).show();
            $("#txtClosingValue" + priorityId).css("display", "none");
            $(".priorityColorCode" + priorityId).css("display", "none");
            $("#spnUnits" + priorityId).show();
            $("#units" + priorityId).hide();
            if (isDefault == "False") {

            }
        }
        $("#lblEdit").show();
        $("#lblUpdate").hide();



    })
    $(document).delegate("input[name=priorities]", "change", function () {
        var isDefault = $('input[name=priorities]:checked').attr("IsDefault");
        if (isDefault == "True") {
            document.getElementById('deletePriority').style.pointerEvents = 'none';
        }
        else {
            document.getElementById('deletePriority').style.pointerEvents = 'auto';
        }
    });
    $("#deletePriority").click(function () {
        var priorityId = $('input[name=priorities]:checked').attr("PriorityId");

        if (priorityId == undefined) {

            $("#lblPriorityErrorMsg").html("Please select Priority ");
            return false;
        }
        AccountSettingsManagement(4, "", 0, 0, "False", priorityId, "")
    });
    $("#updatePriority").click(function () {
        $("#lblPriorityErrorMsg").html("");
        var action = $(this).attr("Action");

        var priorityName = "";
        var priorityUnitId = 0;
        var priorityValue = 0;
        var colorCode = "";
        if (action == "Create") {
            priorityName = $("#txtPriorityName").val().trim();

            priorityValue = $("#txtClosingValue").val();
            colorCode = $("#txtColorCode").val();
            if (priorityName == "") {
                $("#lblPriorityErrorMsg").html("Please Enter Priority Name");
                return false;
            }
            if (priorityValue == "") {
                $("#lblPriorityErrorMsg").html("Please Enter Target Closing Value");
                return false;
            }
            priorityUnitId = $("#ddlTargetUnit").val();
            AccountSettingsManagement(1, priorityName, priorityUnitId, priorityValue, "False", 0, colorCode)
        }
        else {
            var priorityId = $('input[name=priorities]:checked').attr("PriorityId");
            var isDefault = $('input[name=priorities]:checked').attr("IsDefault");
            priorityName = "";
            priorityValue = $("#txtClosingValue" + priorityId).val();
            if (priorityValue == "") {
                $("#lblPriorityErrorMsg").html("Please Enter Target Closing Value");
                return false;
            }
            priorityUnitId = $("#ddlUnits" + priorityId).val();
            colorCode = $("#txtColorCode" + priorityId).val();
            if (isDefault != "True") {

            }
            AccountSettingsManagement(3, priorityName, priorityUnitId, priorityValue, isDefault, priorityId, colorCode)
        }


    });
   
    $('.bfh-colorpicker').colorpicker();

});



function numericValidation(e) {
    var regex = new RegExp("^[0-9\b\0]*$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    e.preventDefault();
    return false;
}

$(document).delegate("#txtClosingValue", "click", function () {
    $("#txtClosingValue").keydown(function (e) {
        numericValidation(e)
    });
});


$("#createStatus").click(function () {
    $("#lblStatusErrorMsg").html("");
    $("#updateStatus").attr("Action", "Create");
    $("#cancelStatus").attr("Action", "Create");
    var createStatusData = "";
    createStatusData += "<div class='form-group newStatus'><div class='row'><div class='col-sm-6'><label class='txt-grey bold-6 wid100'>";
    createStatusData += "<input type='radio' name='statuses' class='margin-right-10'>";
    createStatusData += "<input type='text' id='txtStatusName'  maxlength='150'class='form-control margin-right-5' style='width: 89%; display: inline;border-radius:4px !important;' /></label></div>";
    createStatusData += "<div class='col-sm-6'><label class='statusColorCode input-group colorpicker-component'><input style='border-radius: 4px 0px 0px 4px !important;' id='txtStatusColorCode' type='text' value='#FF0000' class='form-control' /><span class='input-group-addon' ><i></i></span></label></label></div></div></div>";
    $("#accountStatuses").append(createStatusData);
    $("#lblStatusEdit").hide();
    $("#lblStatusUpdate").show();
    $('.statusColorCode').colorpicker();
});
$("#editStatus").click(function () {
    $("#lblStatusErrorMsg").html("");
    var isDefault = $('input[name=statuses]:checked').attr("IsDefault");
    var statusId = $('input[name=statuses]:checked').attr("StatusId");
    var colorCode = $('input[name=statuses]:checked').attr("ColorCode");
    $(".statusColorCode" + statusId).show();
    $(".statusColorCode" + statusId).colorpicker("setValue", colorCode);
    //$(".priorityColorCode" + priorityId).setColor(colorCode);
    if (typeof (statusId) == "undefined") {
        alert("please select status");
        return false;
    }
    $("#updateStatus").attr("Action", "Update");
    $("#cancelStatus").attr("Action", "Update");
    $("#lblStatusEdit").hide();
    $("#lblStatusUpdate").show();
});
$("#cancelStatus").click(function () {
    $("#lblStatusErrorMsg").html("");
    
    var action = $(this).attr("Action");
    if (action == "Create") {
        $(".newStatus").remove();
        $("#lblStatusEdit").show();
        $("#lblStatusUpdate").hide();
    }
    else {
        $("#lblStatusUpdate").hide();
        $("#lblStatusEdit").show();
        manageTicketStatuses(1, "", "");
    }
})
$(document).delegate("input[name=statuses]", "change", function () {
    var isDefault = $('input[name=statuses]:checked').attr("IsDefault");
    if (isDefault == "True") {
        document.getElementById('deleteStatus').style.pointerEvents = 'none';
    }
    else {
        document.getElementById('deleteStatus').style.pointerEvents = 'auto';
    }
});
$("#deleteStatus").click(function () {
    var statusId = $('input[name=statuses]:checked').attr("StatusId");
    if (statusId == undefined) {

        $("#lblStatusErrorMsg").html("Please select Status ");
        return false;
    }
    manageTicketStatuses(3, "", statusId, "");
});
$("#updateStatus").click(function () {
    $("#lblStatusErrorMsg").html("");
    var action = $(this).attr("Action");

    var statusName = "";
    var colorCode = "";
    if (action == "Create") {
        statusName = $("#txtStatusName").val().trim();
        if (statusName == "") {
            $("#lblStatusErrorMsg").html("Please Enter Status Name");
            return false;
        }
        colorCode = $("#txtStatusColorCode").val();
        manageTicketStatuses(2, statusName, 0, colorCode);
    }
    else {
        var statusId = $('input[name=statuses]:checked').attr("StatusId");
        var isDefault = $('input[name=statuses]:checked').attr("IsDefault");
        priorityName = "";
        colorCode = $("#txtStatusColorCode" + statusId).val();

        manageTicketStatuses(2, "", statusId, colorCode)
    }
});

$(document).delegate(".tktStatuses", "change", function () {
    var changeStatusId = $(this).attr("statusId");
    $(".colorpicker-component").hide();
    $("#lblStatusUpdate").hide();
    $("#lblStatusEdit").show();
});

function AccountSettingsManagement(mode, priorityName, priorityUnitId, priorityValue, isDefault, priorityId, colorCode) {
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
            type: 20, mode: mode, PriorityName: priorityName, PriorityUnitId: priorityUnitId,
            PriorityValue: priorityValue, IsDefault: isDefault, PriorityId: priorityId, ColorCode: colorCode
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                var prioritiesData = "", unitsData="";
                if (mode == 2) {
                    if (res.TicketUnits.length > 0) {
                        for (var i = 0; i < res.TicketUnits.length; i++) {
                            unitsData += "<option value='" + res.TicketUnits[i].Id + "'> " + res.TicketUnits[i].Unit + " </option>"
                        }
                        for (var i = 0; i < res.TicketPriorities.length; i++) {
                            prioritiesData += "<div class='form-group'><label style='color:" + res.TicketPriorities[i].ColorCode + "' class='txt-grey bold-6 margin-right-20'>";
                            prioritiesData += "<input class='tktPriorities' name='priorities' type='radio' ColorCode='" + res.TicketPriorities[i].ColorCode + "'  PriorityId='" + res.TicketPriorities[i].PriorityId + "' closingvalue='" + res.TicketPriorities[i].Value + "' IsDefault='" + res.TicketPriorities[i].IsDefault + "' class='margin-right-5'/> ";
                            prioritiesData += res.TicketPriorities[i].Priority + "</label>";
                            prioritiesData += "<label>Target Closing " + "<span id='spnClosingValue" + res.TicketPriorities[i].PriorityId + "' > " + res.TicketPriorities[i].Value + " </span>"
                            prioritiesData += "<input id='txtClosingValue" + res.TicketPriorities[i].PriorityId + "' type='text' maxlenght='10'class='form-control margin-right-5 number' style='width: 80px;display:none;' />";
                            prioritiesData += "<span UnitId='" + res.TicketPriorities[i].TicketTargetClosingUnitId + "' id='spnUnits" + res.TicketPriorities[i].PriorityId + "'> " + res.TicketPriorities[i].Unit + "</span><span id='units" + res.TicketPriorities[i].PriorityId + "' style='display:none;'><select id='ddlUnits" + res.TicketPriorities[i].PriorityId + "' class='form-control input-inline'>" + unitsData + "</select></span></label></div>";
                            prioritiesData += "<label style='display:none;' class='priorityColorCode" + res.TicketPriorities[i].PriorityId + " input-group colorpicker-component'><input  id='txtColorCode" + res.TicketPriorities[i].PriorityId + "' type='text' value='" + res.TicketPriorities[i].ColorCode + "' class='form-control' /><span class='input-group-addon' ><i></i></span></label></label>";
                        }
                    }
                    $("#accountPriorities").html(prioritiesData);
                }
                else {
                    AccountSettingsManagement(2, "", 0, 0, "False", 0, "");
                    $("#lblUpdate").hide();
                    $("#lblEdit").show();
                }
            }
            else {
                $("#lblPriorityErrorMsg").html(res.Message);
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

function manageTicketStatuses(mode, statusName, statusId, colorCode) {

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
            type: 21, mode: mode, status: statusName, statusId: statusId,
            colorCode: colorCode
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                var statusesData = "";
                if (mode == 1) {
                    if (res.TicketStatuses.length > 0) {
                        for (var i = 0; i < res.TicketStatuses.length; i++) {
                            statusesData += "<div class='form-group'><div class='row'><div class='col-sm-6'><label style='color:" + res.TicketStatuses[i].ColorCode + "' class='txt-grey bold-6 margin-right-20'>";
                            statusesData += "<input class='tktStatuses margin-right-5' name='statuses' type='radio' ColorCode='" + res.TicketStatuses[i].ColorCode + "'  StatusId='" + res.TicketStatuses[i].Id + "'  IsDefault='" + res.TicketStatuses[i].IsDefault + "'/> ";
                            statusesData += res.TicketStatuses[i].Status + "</label></div>";
                            statusesData += "<div class='col-sm-6' style='padding-left:0px;'><label style='display:none;' class='statusColorCode" + res.TicketStatuses[i].Id + " input-group colorpicker-component'><input  id='txtStatusColorCode" + res.TicketStatuses[i].Id + "' type='text' value='" + res.TicketStatuses[i].ColorCode + "' class='form-control' /><span class='input-group-addon' ><i></i></span></label></label></div></div></div>";
                        }
                    }
                    $("#accountStatuses").html(statusesData);
                }
                else {
                    manageTicketStatuses(1, "", 0, 0, "");
                    $("#lblStatusUpdate").hide();
                    $("#lblStatusEdit").show();
                }
            }
            else {
                
                $("#lblStatusErrorMsg").html(res.Message);
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

function RefreshJsTree(treeData) {
    $('#jsTree').jstree({
        'plugins': ["", "state"],
        'core': {
            'data': treeData,
            'check_callback': true
        }
    });
}

function mmanageCategoryNodes(mode, type, category, parentId, colorCode) {

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
        data: {
            type: 1, Mode: mode, Category: category, ParentId: parentId, ColorCode: colorCode
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (mode == 1) {
                    if (type == "Root") {
                        if (!isTreeConstructed) {
                            isTreeConstructed = true;
                            var data = [];
                            var data2 = [];
                            data2 = { opened: true };
                            var obj = { id: res.CategoryId, text: category + "<i class='fa fa-square' style='color:" + colorCode + "'></i>", state: data2 };
                            data.push(obj);
                            RefreshJsTree(data);
                        }
                        else {
                            createNode("#jsTree", res.CategoryId, category + "<i class='fa fa-square' style='color:" + colorCode + "'></i>", "last");
                        }

                    }
                    else if (type == "Node") {
                        createNode("#" + parentId, res.CategoryId, category + "<i class='fa fa-square' style='color:" + colorCode + "'></i>", "last");
                    }
                    else {

                    }
                }
                else if (mode == 2) {
                    var rootArray = [];
                    if (res.TicketCategoryNodes.length > 0) {
                        for (var i = 0; i < res.TicketCategoryNodes.length; i++) {
                            if (res.TicketCategoryNodes[i].ParentId == 0) {
                                var data2 = [];
                                data2 = { opened: true };
                                var rootObj = { id: res.TicketCategoryNodes[i].Id, text: res.TicketCategoryNodes[i].Category + "<i class='fa fa-square' style='color:" + res.TicketCategoryNodes[i].ColorCode + "' ></i>", state: data2 };
                                rootArray.push(rootObj);
                            }
                        }
                        RefreshJsTree(rootArray);
                        setTimeout(function () {
                            for (var j = 0; j < res.TicketCategoryNodes.length; j++) {
                                if (res.TicketCategoryNodes[j].ParentId != 0) {
                                    createNode("#" + res.TicketCategoryNodes[j].ParentId, res.TicketCategoryNodes[j].Id, res.TicketCategoryNodes[j].Category + "<i class='fa fa-square' style='color:" + res.TicketCategoryNodes[j].ColorCode + "' ></i>", "");
                                }
                            }
                        }, 500);
                        isTreeConstructed = true;
                        $("#jsTree").jstree("close_all", -1);
                    }
                    else {
                        isTreeConstructed = false;
                    }

                }
                else if (mode == 4) {
                    $('#jsTree').jstree().delete_node($('#' + parentId));
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

function createNode(parent_node, new_node_id, new_node_text, position) {
    $('#jsTree').jstree('create_node', $(parent_node), { "text": new_node_text, "id": new_node_id, state: { opened: true } }, position, false, false);
}

function manageAccountSettings(mode, metaData) {
    var accountsMetadata = [];
    accountFields = "";
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "POST",
        url: "Handlers/Manager.ashx",
        dataType: "JSON",
        async: false,
        data: {
            type: 12, Mode: mode, MetaData: metaData
        },
        success: function (res) {
            $.unblockUI();
            if (mode == 2) {
                if (res.Success == "True") {
                    if (res.AccountSettings.length > 0) {
                        accountsMetadata = JSON.parse(res.AccountSettings[0].Metadata);
                        console.log(accountsMetadata);
                        for (var i = 0; i < accountsMetadata.length; i++) {


                            accountFields += "<div class='settingFields field_panel " + accountsMetadata[i].FieldName + "'><label class='fieldName txt-grey blocked f_15 margin-bottom-10'>" + accountsMetadata[i].FieldName + "</label>";
                            accountFields += "<span class='drag' style='display:none;' class='close_top' style='cursor:pointer;'><i class='fa fa-sort txt-grey'></i></span>"
                            accountFields += "<div class='row viewRow'>";
                            if (accountsMetadata[i].FieldType == "TextBox") {
                                accountFields += "<label class='col-sm-2 col-md-2 field'><input type='text' FieldType='" + accountsMetadata[i].FieldType + "' class='fieldType form-control input-inline' placeholder='" + accountsMetadata[i].FieldName + "'/></label>";
                                accountFields += "<div class='col-sm-10 col-md-10'><ul class='chats'><li class='in'><div class='message'><span class='arrow'></span>";
                                accountFields += "<label class='margin-right-20'>Input Type :  <span  class='inputType font-grey-gallery bold-6'>" + accountsMetadata[i].PlaceHolder + "</span></label>";
                                accountFields += "<label class='margin-right-20'>Max char Limit : <span class='maxChars font-grey-gallery bold-6'>" + accountsMetadata[i].MaxChars + "</span></label>";
                                accountFields += "<label class='margin-right-20'>Allow Special Char's : <span class= 'allowSpecialChars font-grey-gallery bold-6'>" + accountsMetadata[i].AllowSpecialChars + "</span></label>";
                            }
                            else if (accountsMetadata[i].FieldType == "DropDown") {
                                var optdata = [], optOptions = "";
                                optdata = accountsMetadata[i].Options.split(",");
                                accountFields += "<label class='col-sm-2 col-md-2 field'><select  FieldType='" + accountsMetadata[i].FieldType + "' class='fieldType form-control'>";

                                for (var j = 0; j < optdata.length; j++) {
                                    accountFields += "<option class='viewOptions' value=" + optdata[j] + ">" + optdata[j] + "</option>"
                                }
                                accountFields += "</select></label>";
                                accountFields += "<div class='col-sm-10 col-md-10'><ul class='chats'><li class='in'><div class='message'><span class='arrow'></span>";

                            } else if (accountsMetadata[i].FieldType == "TextArea") {
                                accountFields += "<label class='col-sm-2 col-md-2 field'><textarea  rows='3' cols='15' maxlength='" + accountsMetadata[i].MaxChars + "' FieldType='" + accountsMetadata[i].FieldType + "' class='fieldType form-control input-inline' placeholder='" + accountsMetadata[i].FieldName + "'></textarea></label>";
                                accountFields += "<div class='col-sm-10 col-md-10'><ul class='chats'><li class='in'><div class='message'><span class='arrow'></span>";
                                accountFields += "<label class='margin-right-20'>Max char Limit : <span class='maxChars font-grey-gallery bold-6'>" + accountsMetadata[i].MaxChars + "</span></label>";
                            }
                            accountFields += "<label class='margin-right-10'>Mandatory Field : <span class='mandatoryField font-grey-gallery bold-6'>" + accountsMetadata[i].Mandatory + "</span></label>";
                            accountFields += "</div></li></ul></div></div>"
                            accountFields += "<div style='display:none' class='row editRow'>";
                            if (accountsMetadata[i].FieldType == "TextBox") {
                                accountFields += "<label class='col-sm-2 col-md-2 field'><input FieldType='" + accountsMetadata[i].FieldType + "' type='text' class='editFieldType form-control input-inline margin-top-10' placeholder='PAN Number'/></label>";
                                accountFields += "<div class='col-sm-10 col-md-10'><ul class='chats'><li class='in'><div class='message'><span class='arrow'></span>";
                                accountFields += "<label class='margin-right-20'>Input Type : <select class='form-control ddlInputType'><option value='Select' >Select</option><option value='Alphabets'>Alphabets</option><option value='Numeric'>Numeric</option><option value='Alphanumeric'>Alphanumeric</option><option value='Unicode'>Unicode</option></select></label>";
                                accountFields += "<label class='margin-right-20'>Max char Limit : <input type='text' class='form-control txtMaxCharLimit'></label>";
                                accountFields += "<label class='margin-right-10'>Allow Special Char's: <select class='form-control ddlSpecialChars'><option value='Yes'>Yes</option><option value='No'>No</option></select></label>";
                            }
                            else if (accountsMetadata[i].FieldType == "DropDown") {
                                var optdata = [], optOptions = "";
                                optdata = accountsMetadata[i].Options.split(",");
                                accountFields += "<label class='col-sm-2 col-md-2 field'><select  FieldType='" + accountsMetadata[i].FieldType + "' class='editFieldType form-control margin-top-10'>";

                                for (var j = 0; j < optdata.length; j++) {
                                    accountFields += "<option class='editOptions' value=" + optdata[j] + ">" + optdata[j] + "</option>"
                                }
                                accountFields += " </select></label>";
                                accountFields += "<div class='col-sm-10 col-md-10'><ul class='chats'><li class='in'><div class='message'><span class='arrow'></span>";
                            } else if (accountsMetadata[i].FieldType == "TextArea") {
                                accountFields += "<label class='col-sm-2 col-md-2 field'><textarea  rows='3' cols='15' maxlength='" + accountsMetadata[i].MaxChars + "' FieldType='" + accountsMetadata[i].FieldType + "' class='editFieldType form-control input-inline' placeholder='" + accountsMetadata[i].FieldName + "'></textarea></label>";
                                accountFields += "<div class='col-sm-10 col-md-10'><ul class='chats'><li class='in'><div class='message'><span class='arrow'></span>";
                                accountFields += "<label class='margin-right-20'>Max char Limit :<input type='text' class='form-control txtMaxCharLimit'> </label>";
                            }
                            accountFields += "<label class='margin-right-10'>Mandatory Field : <select class='form-control ddlMandatory'><option value='Yes'>Yes</option><option value='No'>No</option></select></label>";
                            accountFields += "<label class='btn-del pull-right'><i FieldName = " + accountsMetadata[i].FieldName + " class='removeField icon-trash'></i></label></div></li></ul></div></div>"
                            accountFields += '</div>'
                        }

                        $("#divSecondaryFields").append(accountFields);
                    }
                }
                else {
                    alert(res.Message);
                }

            }
            else if (mode == 1) {
                location.reload();
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

function validateFieldName(fName) {
    var res = true
    $(".settingFields").each(function () {
        if ($(this).find(".fieldName").html() == fName) {
            res = false;
            return;
        }
    });
    return res;
}



