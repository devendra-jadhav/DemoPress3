
var eresponse;
var xlfile_path = "";
var regx = "";
regx = "^[a-zA-Z0-9_. ]+$";

var options = ""; sheetsCount = 0, sheetsInfo = "", ddlOptions = "", sheetsInfo1 = "";
var sheetscnt = {}, sheethead = {};
var sheetsxl = { "sheetsInfo": [] };

$(".radio_head").click(function () {
    var item = "";
    item = $(this).attr("value");
    if (xlfile_path == '') {
        $('#sheeterr').show();
        $('#sheettxt').text("Please upload excel file");
        return false;

    }
    else {
        SetXlColumns(eresponse)
    }
});


$("#download").click(function () {
    var e = jQuery.Event("click");
    e.preventDefault();
    window.location.href = 'Excel file/sample.xlsx';
});
$("#fileCancel").click(function () {
    $('#sheettxt').text("");

});

$("#saveExcelfile").click(function () {

  if ($('#upmsg').html().length == 0) {
        $('#sheeterr').show();
        $('#sheettxt').text("Please upload excel file");
        return false;
  }
 // alert(sheetsxl.sheetsInfo.length);
    $('#extgrp').hide();
    $("#xlinfo").show();
    creating(sheetsxl);
});




$('input[type="file"]').css('color', '');

var header = $("input[name=radiog_head]:checked").val();


$("#excelUploadFile").fileupload({
  
    dataType: 'json',
    url: "Handlers/ExcelUpload.ashx?header="+header,
    autoUpload: 'false',
    acceptFileTypes: /(\.|\/)(xls|xlsx)$/i,
    maxFileSize: 5000000, // 5 MB
    start: function (e) {
        $("#headerselect").hide();
        $('#upmsg').html('');
        $('input[type="file"]').css('color', 'transparent');

    },
    success: function (res) {
        if (res.Success) {
            $('#sheettxt').text("");
            $("#headerselect").show();
            eresponse = res;
            SetXlColumns(res);
            xlfile_path = res.FilePath;
            var fileName = res.FileName;
            $('#upmsg').html(fileName);
        }
        else {
            if (res.StatusCode == 401) {
                window.location.href = "/Index.aspx?message=Session expired";
            }
            else {
                $('#sheeterr').show();
                $('#sheettxt').text(res.Message);
                $('#upmsg').html('');
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

function SetXlColumns(response) {
  
    sheetsCount = response.ExcelSheets.length;
    sheetsInfo = "";
    sheetsxl.sheetsInfo = [];

  
    var headerletters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"]
    var header = $("input[name=radiog_head]:checked").val();
    if (header === undefined) {
        header = 1;
    }
    if (sheetsCount > 0) {
        for (i = 0; i < sheetsCount; i++) {
            if (!(response.ExcelSheets[i].SheetName.match(regx))) {
                $('#sheeterr').show();
                $('#sheettxt').text(response.ExcelSheets[i].SheetName + " sheet contains special characters,please rename the sheet and reupload");
                xlfile_path = ''
                $(".radio_head").prop('checked', false);
                $(".radio_dept").prop('checked', false);
                $("#grpupload").show();
                $("#grpback").hide();
                return false;
            }
            else {
                $('#sheeterr').hide();
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
            } else {
                for (k = 0; k < response.ExcelSheets[i].ColumnsCount; k++) {
                    ddlOptions += "<option value='" + parseInt(k + 1) + "'>Column " + headerletters[k] + "</option>";
                }
            }

            sheetsInfo += '<div class="form-group">';
            sheetsInfo += '<label class="label-head">Choose the columns from the file</label>';
            sheetsInfo += '<div class="row">';

            sheetsInfo += '<div class="col-sm-4">';
            sheetsInfo += '<div  class="form-group"><label class="txt-grey">Section </span></label><div>'
            sheetsInfo += '<select name="select" id="ddlsection_' + response.ExcelSheets[i].SheetName.replace(" ", "_") + '" class="form-control" aria-required="true" aria-invalid="false" aria-describedby="select-error">'
            sheetsInfo += "<option value='0'>Select</option>" + ddlOptions + "</select></div></div>"
            sheetsInfo += '</div>';

            sheetsInfo += '<div class="col-sm-4">';
            sheetsInfo += ' <div  class="form-group"><label class="txt-grey">Topic </span></label><div>'
            sheetsInfo += '<select name="select" id="ddltopic_' + response.ExcelSheets[i].SheetName.replace(" ", "_") + '" class="form-control" aria-required="true" aria-invalid="false" aria-describedby="select-error">'
            sheetsInfo += "<option value='0'>Select</option>" + ddlOptions + "</select></div></div>"
            sheetsInfo += '</div>';

            sheetsInfo += '<div class="col-sm-4">';
            sheetsInfo += ' <div class="form-group"><label  class="txt-grey">Description</span></label><div>'
            sheetsInfo += '<select name="select" id="ddldescription_' + response.ExcelSheets[i].SheetName.replace(" ", "_") + '" class="form-control" aria-required="true" aria-invalid="false" aria-describedby="select-error">'
            sheetsInfo += "<option value='0'>Select</option>" + ddlOptions + "</select></div></div>"
            sheetsInfo += '</div>';
         
            sheetsInfo += '</div>';
            sheetsInfo += "</div>";


            options = "";
            $('#xlinfo').html(sheetsInfo);
         
        }
    }

}


function creating(sheetsxl) {
    var scriptTitle = $("#txtscriptTitle").val();
    var skillGroupId = $("#selSkillGroup").val();
    var check = "";
    if ($(".check").prop("checked") == true) {
        check = 1;
    } else {
        check = 0;
    }
    $('#sheeterr').hide();
    $('#sheettxt').text("");
    $('#uploadSucess').html("");
    var header = $("input[name=radiog_head]:checked").val();


    if (header == '1') {
    }
    else if (header == '2') {

    }
    else {
        $('#sheeterr').show();
        $('#sheettxt').text("Please select header type");
        return false;
    }

    var sheetname = "", cnt = 0, section = "", topic = "", finaldata = { "data": [] };
    var semidata = {}, deptfrom = "";
   // alert(sheetsxl.sheetsInfo.length);
    if (sheetsxl.sheetsInfo.length > 1) {

        var ErrorCount = sheetsxl.sheetsInfo.length;

        for (var x = 0; x < sheetsxl.sheetsInfo.length; x++) {
            sheetname = "", cnt = 0, section = "", topic = "", group = "", description = "";
            semidata = {};
            var length = sheetsxl.sheetsInfo.length;
            cnt = sheetsxl.sheetsInfo[x].columnscount;
            sheetname = sheetsxl.sheetsInfo[x].sheetname;
            section = $('#ddlsection_' + sheetname.replace(" ", "_")).val();
            topic = $('#ddltopic_' + sheetname.replace(" ", "_")).val();
            description = $('#ddldescription_' + sheetname.replace(" ", "_")).val();

            if (section == "0" && topic == "0" && description == "0") {
                ErrorCount = ErrorCount - 1;

            }

            else if (section == topic) {

                $('#sheeterr').show();
                $('#sheettxt').text("please select section and topic column for " + sheetname + " sheet");
                return false;

            } else if ((topic != "0" && description != "0" && topic == description) ) {
                $('#sheeterr').show();
                $('#sheettxt').text("topic columns should not be duplicated for " + sheetname + " sheet");
                return false;
            }
            else if ((section != "0" && description != "0" && description == section )) {
                $('#sheeterr').show();
                $('#sheettxt').text("description columns should not be duplicated for " + sheetname + " sheet");
                return false;
            }
            else if (section == "0" && topic == "0" && description == "0") {
                $('#sheeterr').show();
                $('#sheettxt').text("please select columns for " + sheetname + " sheet");
                return false;            
            }else if(section != "0" && topic != "0" && description == "0"){
                $('#sheeterr').show();
                $('#sheettxt').text("please select description column for " + sheetname + " sheet");
                return false;
            
            } else if (section != "0" && topic == "0" && description != "0") {
                $('#sheeterr').show();
                $('#sheettxt').text("please select topic column for " + sheetname + " sheet");
                return false;

            } else if (section == "0" && topic != "0" && description != "0") {
                $('#sheeterr').show();
                $('#sheettxt').text("please select section column for " + sheetname + " sheet");
                return false;
            } else if (section != "0" && topic == "0" && description == "0") {
                $('#sheeterr').show();
                $('#sheettxt').text("please select topic and description column for " + sheetname + " sheet");
                return false;
            } else if (section == "0" && topic != "0" && description == "0") {
                $('#sheeterr').show();
                $('#sheettxt').text("please select section and description column for " + sheetname + " sheet");
                return false;
            } else if (section == "0" && topic == "0" && description != "0") {
                $('#sheeterr').show();
                $('#sheettxt').text("please select section and topic column for " + sheetname + " sheet");
                return false;
            } else if (section == "1" && topic == "1" && description == "1") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for  " + sheetname + " sheet");
                return false;
            } else if (section == "1" && topic == "2" && description == "2") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for   " + sheetname + " sheet");
                return false;
            } else if (section == "1" && topic == "1" && description == "3") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for   " + sheetname + " sheet");
                return false;
            } else if (section == "2" && topic == "2" && description == "2") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for   " + sheetname + " sheet");
                return false;
            } else if (section == "3" && topic == "3" && description == "3") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for   " + sheetname + " sheet");
                return false;
            } else if (section == "3" && topic == "2" && description == "1") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for   " + sheetname + " sheet");
                return false;
            } else if (section == "3" && topic == "3" && description == "1") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for   " + sheetname + " sheet");
                return false;
            } else if (section == "2" && topic == "2" && description == "3") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for   " + sheetname + " sheet");
                return false;
            }

            else {

            }
            if (ErrorCount == 0) {

                $('#sheeterr').show();
                $('#sheettxt').text("please select section, topic and description column for "+sheetname+" sheet");

                return false;
            }
            else {
                semidata.sheetname = sheetname;
                semidata.columnscount = cnt;
                semidata.section = section;
                semidata.topic = topic;
                semidata.description = description;
                finaldata.data.push(semidata);

            }


        }
        
    }

    if (sheetsxl.sheetsInfo.length == 1) {

        var ErrorCount = sheetsxl.sheetsInfo.length;

        for (var x = 0; x < sheetsxl.sheetsInfo.length; x++) {
            sheetname = "", cnt = 0, section = "", topic = "", group = "", description = "";
            semidata = {};
            var length = sheetsxl.sheetsInfo.length;
            cnt = sheetsxl.sheetsInfo[x].columnscount;
            sheetname = sheetsxl.sheetsInfo[x].sheetname;
            section = $('#ddlsection_' + sheetname.replace(" ", "_")).val();
            topic = $('#ddltopic_' + sheetname.replace(" ", "_")).val();
            description = $('#ddldescription_' + sheetname.replace(" ", "_")).val();

            if (section == "0" && topic == "0" && description == "0") {
                ErrorCount = ErrorCount - 1;

            }
            else if (section == topic) {

                $('#sheeterr').show();
                $('#sheettxt').text("please select section and topic column for " + sheetname + " sheet");
                return false;

            } else if ((topic != "0" && description != "0" && topic == description)) {
                $('#sheeterr').show();
                $('#sheettxt').text("topic columns should not be duplicated for " + sheetname + " sheet");
                return false;
            }
            else if ((section != "0" && description != "0" && description == section)) {
                $('#sheeterr').show();
                $('#sheettxt').text("description columns should not be duplicated for " + sheetname + " sheet");
                return false;
            }
            else if (section == "0" && topic == "0" && description == "0") {
                $('#sheeterr').show();
                $('#sheettxt').text("please select columns for " + sheetname + " sheet");
                return false;
            } else if (section != "0" && topic != "0" && description == "0") {
                $('#sheeterr').show();
                $('#sheettxt').text("please select description column for " + sheetname + " sheet");
                return false;

            } else if (section != "0" && topic == "0" && description != "0") {
                $('#sheeterr').show();
                $('#sheettxt').text("please select topic column for " + sheetname + " sheet");
                return false;

            } else if (section == "0" && topic != "0" && description != "0") {
                $('#sheeterr').show();
                $('#sheettxt').text("please select section column for " + sheetname + " sheet");
                return false;
            } else if (section != "0" && topic == "0" && description == "0") {
                $('#sheeterr').show();
                $('#sheettxt').text("please select topic and description column for " + sheetname + " sheet");
                return false;
            } else if (section == "0" && topic != "0" && description == "0") {
                $('#sheeterr').show();
                $('#sheettxt').text("please select section and description column for " + sheetname + " sheet");
                return false;
            } else if (section == "0" && topic == "0" && description != "0") {
                $('#sheeterr').show();
                $('#sheettxt').text("please select section and topic column for " + sheetname + " sheet");
                return false;
            } else if (section == "1" && topic == "1" && description == "1") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for  " + sheetname + " sheet");
                return false;
            } else if (section == "1" && topic == "2" && description == "2") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for   " + sheetname + " sheet");
                return false;
            } else if (section == "1" && topic == "1" && description == "3") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for   " + sheetname + " sheet");
                return false;
            } else if (section == "2" && topic == "2" && description == "2") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for   " + sheetname + " sheet");
                return false;
            } else if (section == "3" && topic == "3" && description == "3") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for   " + sheetname + " sheet");
                return false;
            } else if (section == "3" && topic == "2" && description == "1") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for   " + sheetname + " sheet");
                return false;
            } else if (section == "3" && topic == "3" && description == "1") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for   " + sheetname + " sheet");
                return false;
            } else if (section == "2" && topic == "2" && description == "3") {
                $('#sheeterr').show();
                $('#sheettxt').text("Please Select Proper columns for   " + sheetname + " sheet");
                return false;
            }

            else {

            }
            if (ErrorCount == 0) {

                $('#sheeterr').show();
                $('#sheettxt').text("please select section, topic and description column for "+sheetname+" sheet");

                return false;
            }
            else {
                semidata.sheetname = sheetname;
                semidata.columnscount = cnt;
                semidata.section = section;
                semidata.topic = topic;
                semidata.description = description;
                finaldata.data.push(semidata);

            }


        }
    }
    var header = $("input[name=radiog_head]:checked").val();

   // alert(finaldata);
        console.log(finaldata);

        $.ajax({
            url: 'Handlers/Scripts.ashx',
            method: 'post',
            dataType: "json",
            data: { type: 10, path: '/' + xlfile_path, semidata: JSON.stringify(finaldata), header: header,scriptTitle:scriptTitle,skillGroupId : skillGroupId,check :check },
            success: function (AjaxResponse) {
                $('#sheettxt').text("");
                alert(AjaxResponse.Message);
                location.reload();
                if (AjaxResponse.RetVal == 0) {

                    $('#uploadSucess').html('<p style="color:green;" align="left">Uploaded sucessfully in all contacts</p>');
              
                    setTimeout(function () {
                        $('#myModal4').modal('hide');
                        $('#uploadSucess').html("");
                        $('#sheettxt').text("");
                        $('#ddlCountry').val("");
                        $('#headerselect').hide();
                        $('#xlinfo').html("");
                        $('#upmsg').html("");

                    }, 1000);
                    return false;

                }
                else if (AjaxResponse.RetVal == 5) {

                    $('#uploadSucess').html('<p style="color:red;" align="left">' + AjaxResponse.Messsage + '</p>');
                    return false;


                }

                else if (AjaxResponse.RetVal == 2) {
                    $('#uploadSucess').html('<p style="color:red;" align="left">Uploaded excel file has empty columns.</p>');
                    return false;
                        

                }
                else {
                    $('#uploadSucess').html("");

                }
            },
            error: function (ex) {
                $('#uploadSucess').html('<p style="color:red;">Something went wrong</p>');
                return false;
            }
        });
    }

