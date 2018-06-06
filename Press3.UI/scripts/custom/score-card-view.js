var global_CallId = $("#hdnCallId").val();
var global_AgentId = $("#hdnAgentId").val();

viewAgentScoreCard();

function getQuestions(scoreCardId) {

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
        data: { type: 5, scorecardId: scoreCardId },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (res.Success == "True") {
                if (res.SectionDetails.length > 0 && res.QuestionDetails.length > 0) {
                    for (var i = 0; i < res.SectionDetails.length; i++) {
                        resHtml += "<h5>" + res.SectionDetails[i].Title + "</h5>";
                        resHtml += "<div class='well well-sm well-lite-grey'><div class='row'>";
                        for (var j = 0; j < res.QuestionDetails.length; j++) {
                            if (res.SectionDetails[i].SectionId == res.QuestionDetails[j].SectionId) {
                                resHtml += "<div class='col-sm-6'><div class='form-group'>";
                                resHtml += "<p>" + res.QuestionDetails[j].Title + "</p>";
                                resHtml += "<label class='lblAnswers label-round label' questionId='" + res.QuestionDetails[j].QuestionId + "'></label>";
                                //if (res.QuestionDetails[j].Answer == "2") {
                                //    resHtml += "<label class='label-round label label-success'>Yes</label>";
                                //} else if (res.QuestionDetails[j].Answer == "3") {
                                //    resHtml += "<label class='label-round label label-danger'>No</label>";
                                //} else if (res.QuestionDetails[j].Answer == "1") {
                                //    resHtml += "<label class='label-round label label-default'>Not Applicable</label>";
                                //}
                                resHtml += "</div></div>";
                            }
                        }
                        resHtml += "</div></div>";
                    }
                    $("#sectionQuestions").html(resHtml);

                } else {
                    $("#sectionQuestions").html("No questions");
                }
            } else {
                $("#sectionQuestions").html(res.Message);
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

function viewAgentScoreCard() {

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
        data: { type: 12, agentId: global_AgentId, callId: global_CallId },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                $("#btnDraftScores").hide();
                if (res.ScoreCard.length > 0) {
                    $("#selScoreCards").prop("disabled", true);
                    getQuestions(res.ScoreCard[0].ScoreCardId);
                    $("#scoreCard").text(" : " + res.ScoreCard[0].ScoreCard);
                    $("#totalScore").text(res.ScoreCard[0].TotalScore);
                    $("#outofScore").text(res.ScoreCard[0].OutOfScore);
                    $("#lblRating").text(res.ScoreCard[0].Rating);
                    $(".rate").rateYo({
                        "rating": res.ScoreCard[0].Rating,
                        "readOnly": true,
                        "spacing": "10px",
                        "multiColor": { "startColor": "#f1c40f", "endColor": "#f1c40f" },
                        "starWidth": "20px",
                        onChange: function (rating, rateYoInstance) {
                            $("#lblRating").text(rating);
                        }
                    });
                    $("#positiveScore").text(res.ScoreCard[0].PositiveCount);
                    $("#negativeScore").text(res.ScoreCard[0].NegativeCount);
                    $("#notapplicableScore").text(res.ScoreCard[0].NotApplicableCount);
                    $("#comments").text(res.ScoreCard[0].Comments);
                }
                if (res.Questions.length > 0) {
                    for (var i = 0; i < res.Questions.length; i++) {
                        if (res.Questions[i].Answer == "1") {
                            $(".lblAnswers[questionid='" + res.Questions[i].QuestionId + "']").text("Not Applicable").addClass("label-default");
                        } else if (res.Questions[i].Answer == "2") {
                            $(".lblAnswers[questionid='" + res.Questions[i].QuestionId + "']").text("Yes").addClass("label-success");
                        } else if (res.Questions[i].Answer == "3") {
                            $(".lblAnswers[questionid='" + res.Questions[i].QuestionId + "']").text("No").addClass("label-danger");
                        }
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