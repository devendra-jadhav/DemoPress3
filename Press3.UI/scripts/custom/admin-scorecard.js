var scorecard = "";
var editScript = "";
var sections = [];
var questions = [];
var flag = 0;
var flag1 = 0;

$(document).ready(function () {
    getScoreCards();
    getSkillGroups();

    $(document).delegate("#createScoreCard", "click", function () {
        $("#viewScorecards").hide();
        $("#editViewScorecards").hide();
        $("#txtscorecardTitle").val("");
        $('#selSkillGroup').val("0");
        $("#addScorecardSectionDiv").hide();
        $("#scorecardSections").hide();
        $("#createScorecardDiv").hide();
        $("#uploadscorecardfileclose").hide();
        $("#scorecard").show();
        $("#scorecardErr").hide();
    });
    $("input:text").keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    $(document).delegate('#composeScorecard', 'click', function () {
        $("#uploadscorecardfileclose").hide();
        var scorecardTitle = $("#txtscorecardTitle").val();
        scorecardTitle = scorecardTitle.trim();
        var SkillGroupId = $("#selSkillGroup").find("option:selected").val();
        if (scorecardTitle == "") {
            $("#scorecardErr").html("Please Enter ScoreCard Title ").show();
            $("#addScorecardSectionDiv").hide();
            $("#scorecardSections").hide();
            $("#createScorecardDiv").hide();
                var temp = $("#scorecardErr").text();
            if (temp != "") {
                $(".add_section").hide();

            }
            return false;
        } else if (SkillGroupId == "0") {
            $("#scorecardErr").html("Please Select Attach SkillGroup ").show();
            $("#addScorecardSectionDiv").hide();
            $("#scorecardSections").hide();
            $("#createScorecardDiv").hide();
            var temp1 = $("#scorecardErr").text();
            if (temp1 != "") {
                $(".add_section").hide();

            }
            return false;
        }
        else {
            $("#scorecardErr").html("");

            $.blockUI({
                message: '<img src="/assets/img/Press3_Gif.gif" />',
                css: {
                    border: 'none',
                    backgroundColor: 'transparent',
                }
            });
            $.ajax({
                type: "GET",
                url: "Handlers/Scorecards.ashx",
                dataType: "JSON",
                //async: false,
                data: { type: 3, scorecardTitle: scorecardTitle },
                success: function (res) {
                    $.unblockUI();
                    if (res.Success == "True") {
                     
                        $("#scorecardErr").html("The ScoreCard Title with " + scorecardTitle + " already exist").show();

                    }
                    else {
                    
                        var sectionHtml = "";
                        sectionHtml += "<div class='compose_panel newScoreCardSection' >";
                        sectionHtml += "<span class='close_top' style='cursor:pointer;'><img src='assets/img/close.png' class='newScoreCardSectionClose' alt='close' width='18' ></span>";
                        sectionHtml += "<div class=''><label class='bold-6'>Section</label>";
                        sectionHtml += "<input type='text' class='form-control input-circle ScoreCardSectionName' maxlength='400'>";
                        sectionHtml += "</div>";

                        sectionHtml += "<div class='lite margin-top-15 newQuestions'>";
                        sectionHtml += " <div class='row'><div class='col-sm-10'><div class='form-group f_13'><label>Question</label>";
                        sectionHtml += "<input type='text' class='form-control input-circle question' maxlength='1000'>";
                        sectionHtml += "</div></div>";

                        sectionHtml += "<div class='col-sm-2'><div class='form-group f_13' ><label>Points For Yes</label>";
                        sectionHtml += " <input type='text' class='form-control input-circle pointsForYes' id ='yes' maxlength='20'><span class='f_11 text-danger'>Points For No :(<span id='pointsForNo' class='pointsforno'></span>)</span></div></div></div></div>";
		  
                        sectionHtml += "<div class='text-right margin-top-10 newQuestion'>";
                        sectionHtml += "<a class='font-blue'><i class='fa fa-plus margin-right-5'></i> Add New Question</a>";
                        sectionHtml += "</div>";
                        sectionHtml += "</div>";
                        $("#addScorecardSectionDiv").show();
                        $("#scorecardSections").html(sectionHtml).show();
                        $("#createScorecardDiv").show();
                       
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
        }
    });

    $(document).delegate('#addScoreCardSection', 'click', function () {
        var sectionHtml = "";
        sectionHtml += "<div class='compose_panel newScoreCardSection' >";
        sectionHtml += "<span class='close_top' style='cursor:pointer;'><img src='assets/img/close.png' class='newScoreCardSectionClose' alt='close' width='18' ></span>";
        sectionHtml += "<div class=''><label class='bold-6'>Section</label>";
        sectionHtml += "<input type='text' class='form-control input-circle ScoreCardSectionName' maxlength='400'>";
        sectionHtml += "</div>";

        sectionHtml += "<div class='lite margin-top-15 newQuestions'>";
        sectionHtml += " <div class='row'><div class='col-sm-10'><div class='form-group f_13'><label>Question</label>";
        sectionHtml += "<input type='text' class='form-control input-circle question' maxlength='1000'>";
        sectionHtml += "</div></div>";

        sectionHtml += "<div class='col-sm-2'><div class='form-group f_13'><label>Points For Yes</label>";
        sectionHtml += " <input type='text' class='form-control input-circle pointsForYes' id='yes' maxlength='20'><span class='f_11 text-danger'>Points For No :(<span id = 'pointsForNo'></span>)</span></div></div></div></div>";

        sectionHtml += "<div class='text-right margin-top-10 newQuestion'>";
        sectionHtml += "<a class='font-blue' ><i class='fa fa-plus margin-right-5'></i> Add New Question</a>";
        sectionHtml += "</div>";
        sectionHtml += "</div>";
        $("#scorecardSections").append(sectionHtml);
        $('body,html').animate({ scrollTop: $('body').height() }, 800);

    });

    $(document).delegate('.newQuestion', 'click', function () {
        var topicHtml = "";
        topicHtml += "<div class='lite margin-top-15 newQuestions' QuestionId ='0' >";
        topicHtml += "<span class='close_top' style='cursor:pointer;'><img src='assets/img/close.png' alt='close' width='18' class='closeQuestionNew'></span>";
        topicHtml += " <div class='row'><div class='col-sm-10'><div class='form-group f_13'><label>Question</label>";
        topicHtml += "<input type='text' class='form-control input-circle question' maxlength='1000'>";
        topicHtml += "</div></div>";
        topicHtml += "<div class='col-sm-2'><div class='form-group f_13'><label>Points For Yes</label>";
        topicHtml += " <input type='text' class='form-control input-circle pointsForYes'  maxlength='20'><span class='f_11 text-danger'>Points For No :()</span></div></div></div></div>";
        topicHtml += "<div class='text-right margin-top-10 newQuestion'>";
        topicHtml += "<a class='font-blue'><i class='fa fa-plus margin-right-5'></i> Add New Question</a>";
        topicHtml += "</div>";
        $(this).after(topicHtml);
        $(this).remove();
    });

    $(document).delegate(".newScoreCardSectionClose", "click", function () {
        $(this).parent().parent().remove();
        $("#sectionErr").hide();
        var count = $("#scorecardSections").find(".newScoreCardSection").length;
        var countExist = $(".editScorecardSections").length;
        if(count == 0 && countExist == 0) {
           
             $("#createScorecardDiv").hide();
             $("#addScorecardSectionDiv").hide();
             $("#btnUpdateCancel").hide();
        }
    });

    $(document).delegate(".pointsForYes", "keypress", function (e) {
        numericValidation(e);
    });

    $(document).delegate(".pointsForYes", "keyup", function (e) {
        if ($(this).val() == "") {
            $(this).next().text("Points For No :(-0)");
        } else {
            $(this).next().text("Points For No :( -" + $(this).val() + ")");
        }
    });

    $(document).delegate(".closeQuestionNew", "click", function () {
        $(this).parent().parent().remove();
    });

    $(document).delegate(".viewScorecard", "click", function () {
        $("#editViewScorecards").hide();
        $("#uploadscorecardfileclose").hide();
        $("#scorecard").hide();
            var scorecardId = $(this).attr("scorecardId");
            var skillGroupId = $(this).attr("groupId");
            var viewScorecard = "";

            $.blockUI({
                message: '<img src="/assets/img/Press3_Gif.gif" />',
                css: {
                    border: 'none',
                    backgroundColor: 'transparent',
                }
            });
            $.ajax({
                type: "GET",
                url: "Handlers/Scorecards.ashx",
                dataType: "JSON",
                data: { type: 5, scorecardId: scorecardId },
                success: function (res) {
                    $.unblockUI();
                    if (res.Success == "True") {
                        if (res.ScorecardDetails.length > 0) {

                            viewScorecard += "<div class='portlet lite pad-15 view2'>";
                            viewScorecard += "<div class='compose_view'>";
                            viewScorecard += "<div class='compose_panel'>";
                            viewScorecard += "<div class='row'>";
                            viewScorecard += "<div class='col-sm-6'>";
                            viewScorecard += "<label class='label-head blocked'>Score Card Title</label>";
                            viewScorecard += "<label class='font-grey-gallery' id = 'scorecardName_'" + scorecardId + "'  >" + res.ScorecardDetails[0].Title + "</label>";
                            viewScorecard += "</div>"
                            viewScorecard += "<div class='col-sm-5'>";
                            viewScorecard += "<label class='label-head blocked'>Attach Skills</label>";
                            viewScorecard += "<div>";


                            var SkillNames = res.ScorecardDetails[0].SkillNames;
                            var SkillNamesArray = SkillNames.split(",");
                            for (var i = 0; i < SkillNamesArray.length; i++) {
                                viewScorecard += "<label class='label_round_sm margin-right-10'>" + SkillNamesArray[i] + "</label>";
                            }
                            viewScorecard += " </div>";
                            viewScorecard += "</div>";
                            viewScorecard += "<div class='col-sm-1'>";
                            viewScorecard += "<label class='btn-edit' ><a style='color:#fff;'><i class='fa fa-edit editScorecard' scorecardId =" + scorecardId + " scorecardName=" + res.ScorecardDetails[0].Title + " groupId =" + skillGroupId + "></i></a></label>";
                            viewScorecard += "</div>";
                            viewScorecard += "</div>";
                            viewScorecard += "<hr style='border-color:#ccc;'>";

                            for (var j = 0 ; j < res.SectionDetails.length ; j++) {
                                viewScorecard += "<div class='form-group' scetionId = 'sectionId_" + res.SectionDetails[j].SectionId + "'>";
                                viewScorecard += "<label class='label-head margin-right-10'>Section :</label>";
                                viewScorecard += " <label class='font-grey-gallery'>" + res.SectionDetails[j].Title + "</label>";
                                viewScorecard += "</div>";

                                for (var k = 0 ; k < res.QuestionDetails.length; k++) {
                                    if (res.SectionDetails[j].SectionId == res.QuestionDetails[k].SectionId) {
                                        viewScorecard += "  <div class='lite' questionId = 'questionId_" + res.QuestionDetails[k].QuestionId + "'>";
                                        viewScorecard += "<div class='row'><div class='col-sm-9'><div class='form-group'>";
                                        viewScorecard += "<label class='label-head blocked'>Question</label>";
                                        viewScorecard += "<label class='font-grey-gallery'>" + res.QuestionDetails[k].Title + "</label>";
                                        viewScorecard += "</div></div>";
                                        viewScorecard += "<div class='col-sm-3'>";
                                        viewScorecard += "<div class='form-group'>";
                                        viewScorecard += "<label class='label-head blocked'>Points For Yes</label>";
                                        viewScorecard += "<label class='txt-lite-grey'> " + res.QuestionDetails[k].PointsForYes + " <span class='f_11 text-danger margin-left-10'>Points for No : " + -Math.abs(res.QuestionDetails[k].PointsForYes) + "</span></label>";

                                        viewScorecard += "</div>";
                                        viewScorecard += "</div></div></div><br/>";
                                    }

                                }

                            }
                            $("#viewScorecards").html(viewScorecard).show();


                        }
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

    $(document).delegate("#saveScorecard", "click", function () {
        var sections = [];
        var result = true;
        var scorecardTitle = $("#txtscorecardTitle").val();
        scorecardTitle = scorecardTitle.trim();
        $("#scriptErr").html("");
        if (scorecardTitle == "") {
            $("#scorecardErr").html("Please Enter ScoreCard Title").show();
            result = false;
            $("#addScorecardSectionDiv").hide();
            $("#sectionErr").hide();
            $("#scorecardSections").hide();
            $("#createScorecardDiv").hide();
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
            url: "Handlers/Scorecards.ashx",
            dataType: "JSON",
            data: { type: 3, scorecardTitle: scorecardTitle },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {
                    $("#scorecardErr").html("The ScoreCard Title with " + scorecardTitle + " already exist").show();
                    result = false;
                    $("#addScorecardSectionDiv").hide();
                    $("#sectionErr").hide();
                    $("#scorecardSections").hide();
                    $("#createScorecardDiv").hide();
                    return false;
                } else {
                    var SkillGroupId = $("#selSkillGroup").find("option:selected").val();
                    if (SkillGroupId == "0") {
                        $("#scorecardErr").html("Please Select Attach SkillGroup").show();
                        result = false;
                        $("#addScorecardSectionDiv").hide();
                        $("#sectionErr").hide();
                        $("#scorecardSections").hide();
                        $("#createScorecardDiv").hide();
                        return false;
                    }
                    $("#scorecardSections .newScoreCardSection").each(function () {
                        var sectionTitle = $(this).find(".ScoreCardSectionName").val();
                        sectionTitle = sectionTitle.trim();
                        if (sectionTitle == "" || sectionTitle == "undefined") {
                            $("#sectionErr").html("Please Enter Section Name").show();
                            result = false;
                            $('html, body').animate({
                                scrollTop: ($('#sectionErr').first().offset().top)
                            }, 500);
                            return false;

                        }
                        $(this).find(".newQuestions").each(function () {
                            var Question = $(this).find(".question").val();
                            Question = Question.trim();
                            if (Question == "" || Question == "undefined") {
                                $("#sectionErr").html("Please Enter Question Name of " + sectionTitle);
                                result = false;
                                $('html, body').animate({
                                    scrollTop: ($('#sectionErr').first().offset().top)
                                }, 500);
                                return false;

                            }
                            var PointsForYes = $(this).find(".pointsForYes").val();
                            PointsForYes = PointsForYes.trim();
                            if (PointsForYes == "" || PointsForYes == "undefined") {
                                $("#sectionErr").html("Please Enter Points For Yes of " + Question);
                                result = false;
                                $('html, body').animate({
                                    scrollTop: ($('#sectionErr').first().offset().top)
                                }, 500);
                                return false;

                            }
                        });

                    });

                    if (result) {
                        var allObj = {};
                        var section = {};
                        var sectionObj = [];
                        var questionArray = [];
                        var questionObj = {};
                        var scorecardTitle = $("#txtscorecardTitle").val();
                        scorecardTitle = scorecardTitle.trim();
                        if (scorecardTitle == "") {
                            return false;
                        }
                        allObj['ScorecardTitle'] = scorecardTitle;
                        var SkillGroupId = $("#selSkillGroup").find("option:selected").val();
                        allObj['SkillGroupId'] = SkillGroupId;
                        $("#scorecardSections .newScoreCardSection").each(function () {
                            section = {};
                            questionArray = [];
                            var sectionTitle = $(this).find(".ScoreCardSectionName").val();
                           
                            if (allObj['Sections']) {

                                for (var i = 0; i < allObj.Sections.length; i++) {
                                    if (allObj.Sections[i].sectionTitle == sectionTitle) {
                                        alert("Duplicate Sections Name ");

                                        result = false;
                                        flag = 1;
                                        return false;
                                    } else {
                                        flag = 0;
                                    }
                                }
                            }
                            section['sectionTitle'] = sectionTitle;
                            $(this).find(".newQuestions").each(function () {
                                questionObj = {};
                                var Question = $(this).find(".question").val();

                                questionObj['Question'] = Question;
                                var PointsForYes = $(this).find(".pointsForYes").val();
                                questionObj['PointsForYes'] = PointsForYes;
                                questionArray.push(questionObj);
                            });
                            section['Questions'] = questionArray;
                            sectionObj.push(section);
                            allObj['Sections'] = sectionObj;
                        });
                        if (flag == 0) {
                            $.ajax({
                                type: "GET",
                                url: "Handlers/Scorecards.ashx",
                                dataType: "JSON",
                                data: { type: 2, data: JSON.stringify(allObj) },
                                success: function (res) {
                                    if (res.Success == "True") {
                                        alert(res.Message);
                                        location.reload();
                                    } else {
                                        console.log(res.Message);
                                    }
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    if (jqXHR.status == 401) {
                                        window.location.href = "/Login.aspx?message=Session expired";
                                    } else {
                                        console.log(errorThrown);
                                    }
                                }
                            });
                        }
                    }
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

    $(document).delegate(".delete", "click", function () {
        $("#viewScorecards").hide();
        $("#editViewScorecards").hide();
        $("#scorecard").hide();
        $("#uploadscorecardfileclose").hide();
        var ScorecardId = $(this).attr("ScorecardId");
        $("#delete").attr("scorecardid", ScorecardId);
        $("#delete-scorecard").modal("show");
    });

    $(document).delegate("#delete", "click", function () {

        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
        var scorecardid = $("#delete").attr("scorecardid");
        $("#delete-scorecard").modal("hide");
        $.ajax({
            type: "GET",
            url: "Handlers/Scorecards.ashx",
            dataType: "JSON",
            data: { type: 4, scorecardid: scorecardid },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {
                    $("#row" + scorecardid).remove();
                    var rowsCount = $(".ScorecardRows").length;
                    if (rowsCount == 0) {
                        $("#ScoreCards").html("<tr><td colspan='8' align='center'> No Score Cards Found</td></tr>");
                    }

                } else {
                    console.log(res.Message);
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

    $(document).delegate('.editScorecard', 'click', function () {
        $("#scorecard").hide();
        $("#uploadscorecardfileclose").hide();
        var scorecardId = $(this).attr("scorecardId");
        var scorecardTitle = $("#txtscorecardTitle").val();
        var skillGroupId = $(this).attr("groupId");
        scorecardTitle = scorecardTitle.trim();
        var count = 0;
        $("#viewScorecards").hide();
        var editScorecard = "";

        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
        $.ajax({
            type: "GET",
            url: "Handlers/Scorecards.ashx",
            dataType: "JSON",
            async: false,
            data: { type: 5, scorecardId: scorecardId },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {
                    if (res.ScorecardDetails.length > 0) {
                        editScorecard += "<div class='portlet lite pad-15 editScorecard'>";
                        editScorecard += "<div class='compose_view'>";
                        editScorecard += "<div class='editAddSection' >";
                        editScorecard += "<div class='row'>";
                        editScorecard += "<div class='col-sm-4'>";
                        editScorecard += "<label class='label-head blocked'>Score Card Title</label>";
                        editScorecard += "<input type='text' class='input-circle form-control scorecardTitle' ScorecardId = '" + res.ScorecardDetails[0].Id + "' value='" + res.ScorecardDetails[0].Title + "'>";
                        editScorecard += "</div>"
                        editScorecard += "<div class='col-sm-7'>";
                        editScorecard += "<label class='label-head blocked'>Attached SkillGroup</label>";
                        editScorecard += " <div><div id='skillGroup' class='pull-left'>";
                        editScorecard += skillGroup(skillGroupId);
                        editScorecard += "</div>";
                        editScorecard += "</div>";

                        editScorecard += "</div>";
                        editScorecard += "</div>";
                        editScorecard += "<hr style='border-color:#ccc;'>";

                        editScorecard += "<div class='margin-top-10 text-center '><a id='editScoreCardSection' class='font-green-soft' section='" + count + "'>";
                        editScorecard += "<i class='fa fa-plus margin-right-5 '></i> Add New Section</a></div>";
                        editScorecard += " <div class='text-danger' id = 'sectionError'></div>";

                        for (var j = 0 ; j < res.SectionDetails.length ; j++) {
                            editScorecard += "<div class='compose_panel editScorecardSections' SectionId='" + res.SectionDetails[j].SectionId + "'  >";
                            editScorecard += "<span class='close_top' style='cursor:pointer;'><img src='assets/img/close.png' sectionId='" + res.SectionDetails[j].SectionId + "' class='closeScorecardSectionExist' alt='close' width='18' ></span>";
                            editScorecard += "<div class='form-group'>";
                            editScorecard += "<label class='bold-6'>Section</label>";
                            editScorecard += "<input type='text' class='form-control input-circle sectionName ' value='" + res.SectionDetails[j].Title + "' maxlength='400'>";
                            editScorecard += "</div>";

                            for (var k = 0 ; k < res.QuestionDetails.length; k++) {
                                if (res.SectionDetails[j].SectionId == res.QuestionDetails[k].SectionId) {
                                    editScorecard += "<div class='lite margin-top-15 newQuestions question_" + res.QuestionDetails[k].QuestionId + "' QuestionId ='" + res.QuestionDetails[k].QuestionId + "'>";
                                    editScorecard += "<span class='close_top' style='cursor:pointer;'><img src='assets/img/close.png' alt='close' width='18' questionId='" + res.QuestionDetails[k].QuestionId + "' sectionId='" + res.SectionDetails[j].SectionId + "' class='closeQuestionExist'></span>";
                                    editScorecard += "<div class='row'><div class='col-sm-10'><div class='form-group f_13'><label>Question</label>";

                                    editScorecard += "<input type='text' class='form-control input-circle question' value='" + res.QuestionDetails[k].Title + "' maxlength='1000'>";
                                    editScorecard += "</div></div>";
                                    editScorecard += "<div class='form-group'>";
                                    editScorecard += "<div class='col-sm-2'><div class='form-group f_13'><label>Points For Yes</label>";
                                    editScorecard += "<input type='text' class='form-control input-circle pointsForYes' value='" + res.QuestionDetails[k].PointsForYes + "'  maxlength='20'><span class='f_11 text-danger'>Points For No :( " + -Math.abs(res.QuestionDetails[k].PointsForYes) + ")</span></div></div></div></div>";
                                    editScorecard += "</div><br>";


                                }
                            }
                            editScorecard += "<div class='text-right margin-top-10 newQuestion'>";
                            editScorecard += " <div><a class='font-blue'><i class='fa fa-plus margin-right-5 ' sectionId = '" + res.SectionDetails[j].SectionId + "' questionId = '" + res.QuestionDetails.length + "'> Add New Question</i></a></div>";
                            editScorecard += "</div></div>";
                        }
                        editScorecard += "</div>";
                        editScorecard += "<div align='center' id='btnUpdateCancel'> <button type='button' class='btn btn-sm green btn-100 btn-circle margin-right-10' id='updateScorecard'>Update</button>";
                        editScorecard += "<button type='button' class='btn btn-sm btn-default btn-100 btn-circle' id = 'updateScorecardCancel'>Cancel</button></div>";
                        $("#editViewScorecards").html(editScorecard);
                        $("#editViewScorecards").show();

                    }
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

    $(document).delegate('#editScoreCardSection', 'click', function () {
        var sectionHtml = "";
        sectionHtml += "<div class='compose_panel editNewScoreCardSection' >";
        sectionHtml += "<span class='close_top' style='cursor:pointer;'><img src='assets/img/close.png' class='newScoreCardSectionClose' alt='close' width='18' ></span>";
        sectionHtml += "<div class=''><label class='bold-6'>Section</label>";
        sectionHtml += "<input type='text' class='form-control input-circle ScoreCardSectionName'maxlength='400'>";
        sectionHtml += "</div>";
        sectionHtml += "<div class='lite margin-top-15 newQuestions'>";
        sectionHtml += "<div class='row'><div class='col-sm-10'><div class='form-group f_13'><label>Question</label>";
        sectionHtml += "<input type='text' class='form-control input-circle question' maxlength='1000'>";
        sectionHtml += "</div></div>";
        sectionHtml += "<div class='col-sm-2'><div class='form-group f_13'><label>Points For Yes</label>";
        sectionHtml += " <input type='text' class='form-control input-circle pointsForYes'  maxlength='20'><span class='f_11 text-danger'>Points For No :()</span></div></div></div></div>";
        sectionHtml += "<div class='text-right margin-top-10 newQuestion'>";
        sectionHtml += "<a class='font-blue'><i class='fa fa-plus margin-right-5'></i>  Add New Question</a>";
        sectionHtml += "</div>";
        sectionHtml += "</div>";
        $("#btnUpdateCancel").show();
        $(".editAddSection").append(sectionHtml);
        $('body,html').animate({ scrollTop: $('body').height() }, 800);
    });

    $(document).delegate("#updateScorecard", "click", function () {
         var sections = [];
         var result = true;
         $(".editNewScoreCardSection").each(function () {
             var sectionTitle = $(this).find(".ScoreCardSectionName").val();
             sectionTitle = sectionTitle.trim();
             if (sectionTitle == "" || sectionTitle == "undefined") {
                 $("#sectionError").html("Please Enter Section Name").show();
                 result = false;
                 $('html, body').animate({
                     scrollTop: ($('#sectionError').first().offset().top)
                 }, 500);
                 return false;
             }
             $(this).find(".newQuestions").each(function () {
                 var Question = $(this).find(".question").val();
                 Question = Question.trim();
                 if (Question == "" || Question == "undefined") {
                     $("#sectionError").html("Please Enter Question name of " + sectionTitle).show();
                     result = false;
                     $('html, body').animate({
                         scrollTop: ($('#sectionError').first().offset().top)
                     }, 500);
                     return false;
                 }
                 var PointsForYes = $(this).find(".pointsForYes").val();
                 PointsForYes = PointsForYes.trim();
                 if (PointsForYes == "" || PointsForYes == "undefined") {
                     $("#sectionError").html("Please Enter PointsForYes of " + Question).show();
                     result = false;
                     $('html, body').animate({
                         scrollTop: ($('#sectionError').first().offset().top)
                     }, 500);
                     return false;
                 }
             });
         });


         $(".editScorecardSections").each(function () {
             section = {};
             QuestionArray = [];
             var sectionTitle = $(this).find(".sectionName").val();
             sectionTitle = sectionTitle.trim();
             if (sectionTitle == "" || sectionTitle == "undefined") {
                 $("#sectionError").html("Please Enter Section Name ").show();
                 result = false;
                 $('html, body').animate({
                     scrollTop: ($('#sectionError').first().offset().top)
                 }, 500);
                 return false;
             }
             $(this).find(".newQuestions").each(function () {
                 var Question = $(this).find(".question").val();
                 Question = Question.trim();
                 if (Question == "" || Question == "undefined") {
                     $("#sectionError").html("Please Enter Question name of " + sectionTitle).show();
                     result = false;
                     $('html, body').animate({
                         scrollTop: ($('#sectionError').first().offset().top)
                     }, 500);
                     return false;
                 }
                
                 var PointsForYes = $(this).find(".pointsForYes").val();
                 if (PointsForYes == "" || PointsForYes == "undefined") {
                     $("#sectionError").html("Please Enter PointsForYes of " + Question).show();
                     result = false;
                     $('html, body').animate({
                         scrollTop: ($('#sectionError').first().offset().top)
                     }, 500);
                     return false;
                 }
             });
         
         });

 
         if (result) {
             var allObj = {};
             var section = {};
             var sectionObj = [];
             var QuestionArray = [];
             var QuestionObj = {};
             var ScorecardTitle = $(".scorecardTitle").val();
             var ScorecardId = $(".scorecardTitle").attr("ScorecardId");
             if (ScorecardTitle == "") {
                 return false;
             }
             allObj['ScorecardId'] = ScorecardId;
             allObj['ScorecardTitle'] = ScorecardTitle;
             var SkillGroupId = $("#selSkillGroupId").find("option:selected").val();
             allObj['SkillGroupId'] = SkillGroupId;
           
             sectionObj = [];
             $(".editNewScoreCardSection").each(function () {

                 section = {};
                 QuestionArray = [];
                 var sectionTitle = $(this).find(".ScoreCardSectionName").val();
                 if (allObj['Sections']) {

                     for (var i = 0; i < allObj.Sections.length; i++) {
                         if (allObj.Sections[i].sectionTitle == sectionTitle) {
                             alert("Duplicate Sections Name");

                             result = false;
                             flag = 1;
                             return false;
                         } else {
                             flag = 0;
                         }
                     }
                 }
                 section['sectionTitle'] = sectionTitle;
                 $(this).find(".newQuestions").each(function () {
                     QuestionObj = {};
                     var QuestionId = $(this).attr("QuestionId");
                     var Question = $(this).find(".question").val();
                     QuestionObj['Title'] = Question;
                     var PointsForYes = $(this).find(".pointsForYes").val();
                     QuestionObj['PointsForYes'] = PointsForYes;
                     QuestionArray.push(QuestionObj);
                 });
                 section['Questions'] = QuestionArray;
                 sectionObj.push(section);

                 allObj['Sections'] = sectionObj;
             });
             if (jQuery.isEmptyObject(sectionObj)) {
                 allObj['Sections'] = [];
             }
             sectionObj = [];
             $(".editScorecardSections").each(function () {
                 section = {};
                 QuestionArray = [];
                 var sectionTitle = $(this).find(".sectionName").val();
                 var sectionId = $(this).attr("SectionId");
                 
                 if (allObj['Sections']) {

                     for (var i = 0; i < allObj.Sections.length; i++) {
                         if (allObj.Sections[i].sectionTitle == sectionTitle) {
                             alert("Duplicate Sections Name");

                             result = false;
                             flag1 = 1;
                             return false;
                         } else {
                             flag1 = 0;
                         }
                     }
                 }
                 section['sectionTitle'] = sectionTitle;
                 section['sectionId'] = sectionId;
                 $(this).find(".newQuestions").each(function () {
                     QuestionObj = {};
                     var questionid = $(this).attr("questionid");
                   
                     var Question = $(this).find(".question").val();
                     if (Question == "") {
                         $("#sectionErr").html("Please Enter Question name");
                         return false;
                     }
                     QuestionObj['QuestionId'] = questionid;
                     QuestionObj['Title'] = Question;
                     var PointsForYes = $(this).find(".pointsForYes").val();
                     QuestionObj['PointsForYes'] = PointsForYes;
                     QuestionArray.push(QuestionObj);
                 });
                 section['Questions'] = QuestionArray;
                 sectionObj.push(section);
                 allObj['ExistingSections'] = sectionObj;
             });
             if (jQuery.isEmptyObject(sectionObj)) {
                 allObj['ExistingSections'] = [];
             }
             if (flag == 0 && flag1 == 0) {
                 $.ajax({
                     type: "GET",
                     url: "Handlers/Scorecards.ashx",
                     dataType: "JSON",
                     data: { type: 6, data: JSON.stringify(allObj) },
                     success: function (res) {
                         if (res.Success == "True") {
                             alert(res.Message);
                             location.reload();
                         } else {
                             console.log(res.Message);
                         }
                     },
                     error: function (jqXHR, textStatus, errorThrown) {
                         if (jqXHR.status == 401) {
                             window.location.href = "/Login.aspx?message=Session expired";
                         } else {
                             console.log(errorThrown);
                         }
                     }
                 });
             }
         }
         else {
             return false;
         }
     });
	
    $(document).delegate("#uploadScorecards", "click", function () {
            $("#sectionErr").hide();
            $("#exlinfo").html("");
            $("#upscorecardmsg").html("");
            $("#editViewScorecards").hide();
            $("#scorecardErr").html("");
            $("#addScorecardSectionDiv").hide();
    

         var scorecardTitle = $("#txtscorecardTitle").val();
         var SkillGroupId = $("#selSkillGroup").find("option:selected").val();
         if (scorecardTitle == "") {
             $("#scorecardErr").html("Please Enter ScoreCard Title ").show();
             $("#uploadscorecardfileclose").hide();
             var temp = $("#scorecardErr").text();
             if (temp != "") {
                 $(".add_section").hide();

             }
             return false;
         } else if (SkillGroupId == "0") {
             $("#scorecardErr").html("Please Select Attach SkillGroup ").show();
             $("#uploadscorecardfileclose").hide();
             var temp1 = $("#scorecardErr").text();
             if (temp1 != "") {
                 $(".add_section").hide();

             }
             return false;
         }
         else {
             $("#scorecardErr").html("");

             $.blockUI({
                 message: '<img src="/assets/img/Press3_Gif.gif" />',
                 css: {
                     border: 'none',
                     backgroundColor: 'transparent',
                 }
             });
             $.ajax({
                 type: "GET",
                 url: "Handlers/Scorecards.ashx",
                 dataType: "JSON",
                 //async: false,
                 data: { type: 3, scorecardTitle: scorecardTitle },
                 success: function (res) {
                     $.unblockUI();
                     if (res.Success == "True") {

                         $("#scorecardErr").html("The ScoreCard Title with " + scorecardTitle + " already exist").show();

                     } else {
                         $("#addScoreCardSectionDiv").hide();
                         $("#scorecardSections").hide();
                         $("#createScorecardDiv").hide();
                         $('#search').val('');
                         $('#ddlsection').val(0);
                         $('#ddltopic').val(0);
                         $('#ddldescription').val(0);
                         $(".uploadscorecardfile").show();
                         //   $('#fileChoose').hide();
                         $('#headerselect').hide();
                         //  $('#xlinfo').html('');
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
         }

     });
	
    $(document).delegate(".closeScorecardSectionExist", "click", function () {
         
        $(this).parent().parent().remove();
        var count = $(".editScorecardSections").length;
            if(count == 0){
                $("#btnUpdateCancel").hide();    
        }
        var sectionId = $(this).parent().parent().attr("sectionId");
        var scorecardId = $(".scorecardTitle").attr("scorecardId");

        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
         $.ajax({
            type: "GET",
            url: "Handlers/Scorecards.ashx",
            dataType: "JSON",
            async: false,
            data: { type: 8,scorecardId :scorecardId, sectionId :sectionId },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {
                    alert(res.Message);
                }
                },
            error: function (res) {
                $.unblockUI();
                console.log(res);
            }
        });
         
    });

    $(document).delegate(".closeQuestionExist", "click", function () {
      
        $(this).parent().parent().remove();
        var sectionId = $(this).attr("sectionId");
        //console.log($(this).parent().parent().html());
        var questionId = $(this).parent().parent().attr("questionId");


        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
       
        $.ajax({
            type: "GET",
            url: "Handlers/Scorecards.ashx",
            dataType: "JSON",
            async: false,
            data: { type: 9,sectionId :sectionId,questionId:questionId },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {
                    alert(res.Message);
                }
            },
            error: function (res) {
                $.unblockUI();
                console.log(res);
            }
        });


    });

    $(document).delegate("#updateScorecardCancel", "click", function () {
         $("#editViewScorecards").hide();
     });

    $(document).delegate("#scorecardCancel", "click", function () {
         $("#sectionErr").hide();
         $("#addScorecardSectionDiv").hide();
         $("#scorecardSections").hide();
         $("#createScorecardDiv").hide();
         
     });

    $(document).delegate("#scorecardFileCancel", "click", function () {
        $("#sheettext").hide();
         $(".uploadscorecardfile").hide();
     });
});

function getScoreCards() {

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });

    $.ajax({
        type: "GET",
        url: "Handlers/Scorecards.ashx",
        dataType: "JSON",
        data: { type: 1 },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.ScorecardDetails.length > 0) {
                    for (var i = res.ScorecardDetails.length-1; i >= 0; i--) {
                        scorecard += "<tr class='ScorecardRows' id='row" + res.ScorecardDetails[i].Id + "'><td >" + res.ScorecardDetails[i].Title + " </td><td >" + res.ScorecardDetails[i].CreatedTime + "</td><td >" + res.ScorecardDetails[i].UpdatedTime + "</td><td>";
                        var Skills = res.ScorecardDetails[i].Skills;
                        var SkillsArray = Skills.split(",");
                        for (var j = 0; j < SkillsArray.length; j++) {
                            scorecard += "<label class='label_round_sm margin-right-5'>" + SkillsArray[j] + "</label> ";
                        }

                        scorecard += "</td><td >" + res.ScorecardDetails[i].TotalSections + "</td><td >" + res.ScorecardDetails[i].TotalQuestions + "</td><td>" + res.ScorecardDetails[i].TotalPoints + "</td>";
                        scorecard += "<td> <label class='icn_round_sm margin-right-5'><a><i class='icon-eye font-blue-soft viewScorecard' scorecardId='" + res.ScorecardDetails[i].Id + "'  scorecardName =" + res.ScorecardDetails[i].Title + " groupId =" + res.ScorecardDetails[i].SkillGroupId + " title='View'></i></a></label>";
                        scorecard += "<label class='icn_round_sm margin-right-5'><a><i class='icon-pencil font-yellow-gold editScorecard' ScorecardId='" + res.ScorecardDetails[i].Id + "'  ScorecardName =" + res.ScorecardDetails[i].Title + " groupId =" + res.ScorecardDetails[i].SkillGroupId + " title='Edit'></i></a></label>";
                        scorecard += "<label class='icn_round_sm'><a><i class='icon-trash font-red delete' ScorecardId='" + res.ScorecardDetails[i].Id + "' title='Delete'></i></a></label></td></tr>";
                    }

                } else {
                    scorecard += "<tr><td colspan='8' align='center'> No scorecards Found</td></tr>"
                    console.log(res.Message);
                }

            } else {
                scorecard += "<tr><td colspan='8' align='center'> No scorecard Found </td></tr>"
                console.log(res.Message);
            }
            $("#ScoreCards").html(scorecard);


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
}

function getSkillGroups() {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/SkillGroup.ashx",
        dataType: "JSON",
        data: { type: 6 },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                var skillGroups = "";
                skillGroups += "<select class='form-control input-inline margin-right-10 margin-bottom-10' id='selSkillGroup'>";
                skillGroups += "<option value='0'>Select Skillgroup</option>";
                if (res.SkillGroups.length > 0) {
                    for (var i = 0; i < res.SkillGroups.length; i++) {
                        skillGroups += "<option value='" + res.SkillGroups[i].Id + "'>" + res.SkillGroups[i].Name + "</option>";
                    }
                } else {
                    console.log(res.Message);
                }
                skillGroups += "</select>";
            } else {
                console.log(res.Message);
            }
            $("#skillGrps").html(skillGroups);
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
}

function skillGroup(skillGroupId) {
    var skillGroup = "";
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/SkillGroup.ashx",
        async: false,
        dataType: "JSON",
        data: { type: 6 },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {

                skillGroup += "<select class='form-control input-inline margin-right-10 margin-bottom-10' id='selSkillGroupId'>";

                if (res.SkillGroups.length > 0) {
                    for (var i = 0; i < res.SkillGroups.length; i++) {
                        if (res.SkillGroups[i].Id == skillGroupId) {
                            skillGroup += "<option value='" + res.SkillGroups[i].Id + "' selected>" + res.SkillGroups[i].Name + "</option>";
                        } else {
                            skillGroup += "<option value='" + res.SkillGroups[i].Id + "'>" + res.SkillGroups[i].Name + "</option>";
                        }
                    }
                } else {
                    console.log(res.Message);
                }
                skillGroup += "</select>";

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
    return skillGroup;

}

function numericValidation(e) {
    var regex = new RegExp("^[0-9\b\0]*$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    e.preventDefault();
    return false;
}


