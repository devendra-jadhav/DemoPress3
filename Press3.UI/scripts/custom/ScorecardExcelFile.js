
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
        $('#sheeterror').show();
        $('#sheettext').text("Please upload excel file");
        return false;

    }
    else {
        SetXlColumns(eresponse)
    }
});


$("#downloadScorecard").click(function () {
    var e = jQuery.Event("click");
    e.preventDefault();
    window.location.href = 'Excel file/sampleScorecard.xlsx';
});

$("#saveScorecardExcelfile").click(function () {

    if ($('#upscorecardmsg').html().length == 0) {
        $('#sheeterror').show();
        $('#sheettext').text("Please upload excel file").show();
        return false;
    }
    // alert(sheetsxl.sheetsInfo.length);
    $('#extgrp').hide();
    $("#exlinfo").show();
    creating(sheetsxl);
});




$('input[type="file"]').css('color', '');

var header = $("input[name=radiog_head]:checked").val();


$("#excelUploadScorecardFile").fileupload({

    dataType: 'json',
    url: "Handlers/ScoreCardExcelUpload.ashx?header=" + header,
    autoUpload: 'false',
    acceptFileTypes: /(\.|\/)(xls|xlsx)$/i,
    maxFileSize: 5000000, // 5 MB
    start: function (e) {
        $("#headerselect").hide();
        $('#upscorecardmsg').html('');
        $('input[type="file"]').css('color', 'transparent');

    },
    success: function (res) {
        if (res.Success) {
            $('#sheettext').text("");
            $("#headerselect").show();
            eresponse = res;
            SetXlColumns(res);
            xlfile_path = res.FilePath;
            var fileName = res.FileName;
            $('#upscorecardmsg').html(fileName);
        }
        else {
            if (res.StatusCode == 401) {
                window.location.href = "/Index.aspx?message=Session expired";
            }
            else {
                $('#sheeterror').show();
                $('#sheettext').text(res.Message);
                $('#upscorecardmsg').html('');
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
                $('#sheeterror').show();
                $('#sheettext').text(response.ExcelSheets[i].SheetName + " sheet contains special characters,please rename the sheet and reupload");
                xlfile_path = ''
                $(".radio_head").prop('checked', false);
                $(".radio_dept").prop('checked', false);
                $("#grpupload").show();
                $("#grpback").hide();
                return false;
            }
            else {
                $('#sheeterror').hide();
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
            sheetsInfo += ' <div  class="form-group"><label class="txt-grey">Question </span></label><div>'
            sheetsInfo += '<select name="select" id="ddlquestion_' + response.ExcelSheets[i].SheetName.replace(" ", "_") + '" class="form-control" aria-required="true" aria-invalid="false" aria-describedby="select-error">'
            sheetsInfo += "<option value='0'>Select</option>" + ddlOptions + "</select></div></div>"
            sheetsInfo += '</div>';

            sheetsInfo += '<div class="col-sm-4">';
            sheetsInfo += ' <div class="form-group"><label  class="txt-grey">Points For Yes</span></label><div>'
            sheetsInfo += '<select name="select" id="ddlpointsforyes_' + response.ExcelSheets[i].SheetName.replace(" ", "_") + '" class="form-control" aria-required="true" aria-invalid="false" aria-describedby="select-error">'
            sheetsInfo += "<option value='0'>Select</option>" + ddlOptions + "</select></div></div>"
            sheetsInfo += '</div>';

            sheetsInfo += '</div>';
            sheetsInfo += "</div>";


            options = "";
            $('#exlinfo').html(sheetsInfo);

        }
    }

}


function creating(sheetsxl) {
    var scorecardTitle = $("#txtscorecardTitle").val();
    var skillGroupId = $("#selSkillGroup").val();
    $('#sheeterror').hide();
    $('#sheettext').text("");
    $('#uploadSucessful').html("");
    var header = $("input[name=radiog_head]:checked").val();


    if (header == '1') {
    }
    else if (header == '2') {

    }
    else {
        $('#sheeterror').show();
        $('#sheettext').text("Please select header type");
        return false;
    }

    var sheetname = "", cnt = 0, section = "", question = "", finaldata = { "data": [] };
    var semidata = {}, deptfrom = "";
    // alert(sheetsxl.sheetsInfo.length);
    if (sheetsxl.sheetsInfo.length > 1) {

        var ErrorCount = sheetsxl.sheetsInfo.length;

        for (var x = 0; x < sheetsxl.sheetsInfo.length; x++) {
            sheetname = "", cnt = 0, section = "", question = "", group = "", pointsForYes = "";
            semidata = {};
            var length = sheetsxl.sheetsInfo.length;
            cnt = sheetsxl.sheetsInfo[x].columnscount;
            sheetname = sheetsxl.sheetsInfo[x].sheetname;
            section = $('#ddlsection_' + sheetname.replace(" ", "_")).val();
            question = $('#ddlquestion_' + sheetname.replace(" ", "_")).val();
            pointsForYes = $('#ddlpointsforyes_' + sheetname.replace(" ", "_")).val();

            if (section == "0" && question == "0" && pointsForYes == "0") {
                ErrorCount = ErrorCount - 1;
            }else if (section == question) {
                $('#sheeterror').show();
                $('#sheettext').text("please select section and question column for " + sheetname + " sheet").show();
                return false;
            }else if (question != "0" && pointsForYes != "0" && question == pointsForYes) {
                $('#sheeterror').show();
                $('#sheettext').text("question columns should not be duplicated for " + sheetname + " sheet");
                return false;
            } else if (section == "0" && question == "0" && pointsForYes == "0") {
                $('#sheeterror').show();
                $('#sheettext').text("please select columns for " + sheetname + " sheet");
                return false;
            } else if (section != "0" && question == "0" && pointsForYes == "0") {
                $('#sheeterror').show();
                $('#sheettext').text("please select question and pointsForYes column for " + sheetname + " sheet");
                return false;
            } else if (section != "0" && question != "0" && pointsForYes == "0") {
                $('#sheeterror').show();
                $('#sheettext').text("please select pointsForYes column for " + sheetname + " sheet");
                return false;
            } else if (section != "0" && question == "0" && pointsForYes != "0") {
                $('#sheeterror').show();
                $('#sheettext').text("please select question column for " + sheetname + " sheet");
                return false;
            } else if (section == "0" && question != "0" && pointsForYes != "0") {
                $('#sheeterror').show();
                $('#sheettext').text("please select section column for " + sheetname + " sheet");
                return false;
            } else if (section == "0" && question != "0" && pointsForYes == "0") {
                $('#sheeterror').show();
                $('#sheettext').text("please select section and pointsForYes column for " + sheetname + " sheet");
                return false;
            } else if (section == "0" && question == "0" && pointsForYes != "0") {
                $('#sheeterror').show();
                $('#sheettext').text("please select section and question column for " + sheetname + " sheet");
                return false;
            } else if (section == "1" && question == "1" && pointsForYes == "1") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for  " + sheetname + " sheet");
                return false;
            } else if (section == "1" && question == "2" && pointsForYes == "2") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for   " + sheetname + " sheet");
                return false;
            } else if (section == "1" && question == "1" && pointsForYes == "3") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for   " + sheetname + " sheet");
                return false;
            } else if (section == "2" && question == "2" && pointsForYes == "2") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for   " + sheetname + " sheet");
                return false;
            } else if (section == "3" && question == "3" && pointsForYes == "3") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for   " + sheetname + " sheet");
                return false;
            } else if (section == "3" && question == "2" && pointsForYes == "1") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for   " + sheetname + " sheet");
                return false;
            } else if (section == "3" && question == "3" && pointsForYes == "1") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for   " + sheetname + " sheet");
                return false;
            } else if (section == "2" && question == "2" && pointsForYes == "3") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for   " + sheetname + " sheet");
                return false;
            } else if (question != "0" && pointsForYes == "0" && question == "0") {
                $('#sheeterror').show();
                $('#sheettext').text("please select question and pointsForYes columns for " + sheetname + " sheet");
                return false;
            }
            else {
            }
            if (ErrorCount == 0) {
                $('#sheeterror').show();
                $('#sheettext').text("please select section, question and pointsForYes column for " + sheetname + " sheet");
                return false;
            }
            else {
                semidata.sheetname = sheetname;
                semidata.columnscount = cnt;
                semidata.section = section;
                semidata.question = question;
                semidata.pointsForYes = pointsForYes;
                finaldata.data.push(semidata);

            }


        }

    }

    if (sheetsxl.sheetsInfo.length == 1) {

        var ErrorCount = sheetsxl.sheetsInfo.length;

        for (var x = 0; x < sheetsxl.sheetsInfo.length; x++) {
            sheetname = "", cnt = 0, section = "", question = "", group = "", pointsForYes = "";
            semidata = {};
            var length = sheetsxl.sheetsInfo.length;
            cnt = sheetsxl.sheetsInfo[x].columnscount;
            sheetname = sheetsxl.sheetsInfo[x].sheetname;
            section = $('#ddlsection_' + sheetname.replace(" ", "_")).val();
            question = $('#ddlquestion_' + sheetname.replace(" ", "_")).val();
            pointsForYes = $('#ddlpointsforyes_' + sheetname.replace(" ", "_")).val();

            if (section == "0" && question == "0" && pointsForYes == "0") {
                ErrorCount = ErrorCount - 1;

            }
            else if (section == question) {

                $('#sheeterror').show();
                $('#sheettext').text("please select section and question column for " + sheetname + " sheet");
                return false;

            } else if ((question != "0" && pointsForYes != "0" && question == pointsForYes)) {
                $('#sheeterror').show();
                $('#sheettext').text("question columns should not be duplicated for " + sheetname + " sheet");
                return false;
            } else if (section == "0" && question == "0" && pointsForYes == "0") {
                $('#sheeterror').show();
                $('#sheettext').text("please select columns for " + sheetname + " sheet");
                return false;
            } else if (section != "0" && question != "0" && pointsForYes == "0") {
                $('#sheeterror').show();
                $('#sheettext').text("please select pointsForYes column for " + sheetname + " sheet");
                return false;

            } else if (section != "0" && question == "0" && pointsForYes != "0") {
                $('#sheeterror').show();
                $('#sheettext').text("please select question column for " + sheetname + " sheet");
                return false;

            } else if (section == "0" && question != "0" && pointsForYes != "0") {
                $('#sheeterror').show();
                $('#sheettext').text("please select section column for " + sheetname + " sheet");
                return false;
            } else if (section != "0" && question == "0" && pointsForYes == "0") {
                $('#sheeterror').show();
                $('#sheettext').text("please select question and pointsForYes column for " + sheetname + " sheet");
                return false;
            } else if (section == "0" && question != "0" && pointsForYes == "0") {
                $('#sheeterror').show();
                $('#sheettext').text("please select section and pointsForYes column for " + sheetname + " sheet");
                return false;
            } else if (section == "0" && question == "0" && pointsForYes != "0") {
                $('#sheeterror').show();
                $('#sheettxt').text("please select section and question column for " + sheetname + " sheet");
                return false;
            } else if (section == "1" && question == "1" && pointsForYes == "1") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for  " + sheetname + " sheet");
                return false;
            } else if (section == "1" && question == "2" && pointsForYes == "2") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for   " + sheetname + " sheet");
                return false;
            } else if (section == "1" && question == "1" && pointsForYes == "3") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for   " + sheetname + " sheet");
                return false;
            } else if (section == "2" && question == "2" && pointsForYes == "2") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for   " + sheetname + " sheet");
                return false;
            } else if (section == "3" && question == "3" && pointsForYes == "3") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for   " + sheetname + " sheet");
                return false;
            } else if (section == "3" && question == "2" && pointsForYes == "1") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for   " + sheetname + " sheet");
                return false;
            } else if (section == "3" && question == "3" && pointsForYes == "1") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for   " + sheetname + " sheet");
                return false;
            } else if (section == "2" && question == "2" && pointsForYes == "3") {
                $('#sheeterror').show();
                $('#sheettext').text("Please Select Proper colunms for   " + sheetname + " sheet");
                return false;
            }else{

            }

            if (ErrorCount == 0) {

                $('#sheeterror').show();
                $('#sheettext').text("please select section, question and pointsForYes column for " + sheetname + " sheet");

                return false;
            }
            else {
                semidata.sheetname = sheetname;
                semidata.columnscount = cnt;
                semidata.section = section;
                semidata.question = question;
                semidata.pointsForYes = pointsForYes;
                finaldata.data.push(semidata);

            }


        }
    }
    var header = $("input[name=radiog_head]:checked").val();
    console.log(finaldata);

    $.ajax({
        url: 'Handlers/scorecards.ashx',
        method: 'post',
        dataType: "json",
        data: { type: 7, path: '/' + xlfile_path, semidata: JSON.stringify(finaldata), header: header, scorecardTitle: scorecardTitle, skillGroupId: skillGroupId },
        success: function (AjaxResponse) {
            $('#sheettext').text("");
            alert(AjaxResponse.Message);
            location.reload();
            if (AjaxResponse.RetVal == 0) {

                $('#uploadSucessful').html('<p style="color:green;" align="left">Uploaded sucessfully in all Scorecards</p>');

                setTimeout(function () {
                    $('#myModal4').modal('hide');
                    $('#uploadSucessful').html("");
                    $('#sheettext').text("");
                    $('#ddlCountry').val("");
                    $('#headerselect').hide();
                    $('#exlinfo').html("");
                    $('#upscorecardmsg').html("");

                }, 1000);
                return false;

            }
            else if (AjaxResponse.RetVal == 5) {

                $('#uploadSucessful').html('<p style="color:red;" align="left">' + AjaxResponse.Messsage + '</p>');
                return false;


            }

            else if (AjaxResponse.RetVal == 2) {
                $('#uploadSucessful').html('<p style="color:red;" align="left">Uploaded excel file has empty columns.</p>');
                return false;


            }
            else {
                $('#uploadSucessful').html("");

            }
        },
        error: function (ex) {
            $('#uploadSucessful').html('<p style="color:red;">Something went wrong</p>');
            return false;
        }
    });
}

