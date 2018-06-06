var global_CallId = $("#hdnCallId").val();
var global_AgentId = $("#hdnAgentId").val();
var global_PositiveCount = 0, global_NegativeCount = 0, global_NotApplicableCount = 0;

$("#scoreError, #scoreSuccess").html("");

if (global_CallId != "" && parseInt(global_CallId) > 0) {
    getSkillGroupScoreCards();
    getAgentScoreCards();
}

$(".rate").rateYo({
    "rating": 0.0,
    "readOnly": true,
    "spacing": "10px",
    "multiColor": { "startColor": "#f1c40f", "endColor": "#f1c40f" },
    "starWidth": "20px"
});
$("#selScoreCards").change(function () {
    var selSCoreCardId = $(this).val();
    global_PositiveCount = 0, global_NegativeCount = 0, global_NotApplicableCount = 0;
    $("#totalScore").text(0);
    $("#outofScore").text(0);
    $("#notapplicableScore").text(0);
    $("#positiveScore").text(0);
    $("#negativeScore").text(0);

    if (selSCoreCardId != "" && parseInt(selSCoreCardId) > 0) {
        getQuestions(selSCoreCardId);
    } else {
        $("#comments").html("");
        $("#commentToAgent").hide();
        $("#sectionQuestions").html("");
    }
});

$(document).delegate(".answers", "change", function () {
    global_PositiveCount = 0, global_NegativeCount = 0, global_NotApplicableCount = 0;

    var positiveArray = [], negativeArray = [], totalArray = [];
    $(".answers").each(function () {
        var selPoints = $(this).attr("totalPoints");
        totalArray.push($(this).attr("totalPoints"));
    });
    $(".answers").find("option:selected[value='2']").each(function () {
        var selPoints = $(this).attr("totalPoints");
        positiveArray.push($(this).attr("totalPoints"));
    });
    $(".answers").find("option:selected[value='3']").each(function () {
        var selPoints = $(this).attr("totalPoints");
        negativeArray.push($(this).attr("totalPoints"));
    });

    var negativeSum = negativeArray.reduce(add, 0);
    var positiveSum = positiveArray.reduce(add, 0);

   // if (parseInt(totalSum) >= parseInt(negativeSum)) {
        $("#totalScore").text((parseInt(negativeSum) + parseInt(positiveSum)) - parseInt(negativeSum));
    //} else {
    //    $("#totalScore").text(parseInt(negativeSum) - (parseInt(negativeSum) + parseInt(positiveSum)));
    //}
        $("#outofScore").text(parseInt(negativeSum) + parseInt(positiveSum));

    var totalSum = (parseInt(negativeSum) + parseInt(positiveSum)) - parseInt(negativeSum);
    var outOfSum = parseInt(negativeSum) + parseInt(positiveSum);
        
    var rating = (totalSum / outOfSum) * 5;
    rating = rating.toPrecision(2);
    $(".rate").rateYo("option", "rating", rating);
    $("#lblRating").text(rating);

    global_NotApplicableCount = $(".answers").find("option:selected[value='1']").length;
    global_PositiveCount = $(".answers").find("option:selected[value='2']").length;
    global_NegativeCount = $(".answers").find("option:selected[value='3']").length;

    $("#notapplicableScore").text(global_NotApplicableCount);
    $("#positiveScore").text(global_PositiveCount);
    $("#negativeScore").text(global_NegativeCount);

});


$("#btnCancelScores").click(function () {
    $("#scoreError, #scoreSuccess").html("");
    $("#sectionQuestions").html("");
    $("#comments").val("");
    $("#commentToAgent").hide();
   // $(".rate").rateYo("option", "rating", 0.0);
    $("#lblRating").text(0);
    $("#totalScore").text(0);
    $("#outofScore").text(0);
    $("#notapplicableScore").text(0);
    $("#positiveScore").text(0);
    $("#negativeScore").text(0);
    //getSkillGroupScoreCards();
    //getAgentScoreCards();
    window.location.href = '/AgentCallEvaluationReport.aspx';
});

$("#btnDraftScores").click(function () {
    var scoreCardId = 0, scores = [], comments = "", rating = 0, totalScores = 0, outofScores = 0;
    scoreCardId = $("#selScoreCards option:selected").val();

    if (scoreCardId == "") {
        $("#scoreError").html("Select score card");
        return false;
    } else if (scoreCardId != "" && parseInt(scoreCardId) == 0) {
        $("#scoreError").html("Select score card");
        return false;
    }

    $(".answers").each(function () {
        var questionId = $(this).attr("questionId");
        var answerValue = $(this).find("option:selected").val();
        scores.push({ "QuestionId": questionId, "Answer": answerValue });
    });

    if (scores.length == 0) {
        $("#scoreError").html("Select answers for questions");
        return false;
    }
    comments = $("#comments").val();
    if (comments == "") {
        $("#scoreError").html("Enter comments");
        return false;
    }

    rating = $("#lblRating").text();
    if (rating != "" && parseFloat(rating) == 0) {
        $("#scoreError").html("Give rating");
        return false;
    }

    totalScores = $("#totalScore").text();
    outofScores = $("#outofScore").text();

    submitScores(scoreCardId, totalScores, outofScores, rating, comments, scores, 1);
});

$("#btnSubmitScores").click(function () {

    var scoreCardId = 0, scores = [], comments = "", rating = 0, totalScores = 0, outofScores = 0;
    scoreCardId = $("#selScoreCards option:selected").val();

    if (scoreCardId == "") {
        $("#scoreError").html("Select score card");
        return false;
    } else if (scoreCardId != "" && parseInt(scoreCardId) == 0) {
        $("#scoreError").html("Select score card");
        return false;
    }

    $(".answers").each(function () {
        var questionId = $(this).attr("questionId");
        var answerValue = $(this).find("option:selected").val();
        scores.push({ "QuestionId": questionId, "Answer": answerValue });
    });

    if (scores.length == 0) {
        $("#scoreError").html("Select answers for questions");
        return false;
    }

    comments = $("#comments").val();
    if (comments == "") {
        $("#scoreError").html("Enter comments");
        return false;
    }

    rating = $("#lblRating").text();
    //if (rating != "" && parseFloat(rating) == 0) {
    //    $("#scoreError").html("Give rating");
    //    return false;
    //}

    totalScores = $("#totalScore").text();
    outofScores = $("#outofScore").text();

    if (totalScores == 0 && outofScores == 0) {
        $("#scoreError").html("Give rating");
        return false;
    }

    submitScores(scoreCardId, totalScores, outofScores, rating, comments, scores, 0);
   
});

function submitScores(scoreCardId, totalScores, outofScores, rating, comments, scores, isDraft) {
    $.ajax({
        url: "Handlers/ScoreCards.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 11, agentScoreCardId: 0, agentId: global_AgentId, callId: global_CallId,
            scoreCardId: scoreCardId, totalScore: totalScores, outOfScore: outofScores,
            rating: rating, comments: comments, scores: JSON.stringify(scores),
            isDraft: isDraft
        },
        success: function (res) {
            $("#btnSubmitScores").show();
            if (res.Success == "True") {
                $("#scoreError").html("");
                $("#scoreSuccess").html(res.Message);
                window.location.href = "/AgentCallEvaluationReport.aspx";
            } else {
                $("#scoreSuccess").html("");
                $("#scoreError").html(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#btnSubmitScores").show();
            $("#scoreError, #scoreSuccess").html("");
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

function add(a, b) {
    return parseInt(a) + parseInt(b);
}

function getQuestions(scoreCardId) {
    $.ajax({
        type: "GET",
        url: "Handlers/Scorecards.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 5, scorecardId: scoreCardId },
        success: function (res) {
            var resHtml = "";
            if (res.Success == "True") {
                if (res.SectionDetails.length > 0 && res.QuestionDetails.length > 0) {
                    for (var i = 0; i < res.SectionDetails.length; i++) {
                        resHtml += "<h5>" + res.SectionDetails[i].Title + "</h5>";
                        resHtml += "<div class='well well-sm well-lite-grey'><div class='row'>";
                        for (var j = 0; j < res.QuestionDetails.length; j++) {
                            if (res.SectionDetails[i].SectionId == res.QuestionDetails[j].SectionId) {
                                resHtml += "<div class='col-sm-6'><div class='form-group'>";
                                resHtml += "<p>"+ res.QuestionDetails[j].Title+"</p>";
                                resHtml += "<select class='form-control input-inline answers' totalPoints='" + res.QuestionDetails[j].PointsForYes + "' questionId='" + res.QuestionDetails[j].QuestionId + "'>";
                                resHtml += "<option value='1' totalPoints='" + res.QuestionDetails[j].PointsForYes + "'>Not Applicable</option>";
                                resHtml += "<option value='2' totalPoints='" + res.QuestionDetails[j].PointsForYes + "'>Yes</option>";
                                resHtml += "<option value='3' totalPoints='" + res.QuestionDetails[j].PointsForYes + "'>No</option>";
                                resHtml += "</select></div></div>";
                            }
                        }
                        resHtml += "</div></div>";
                    }
                    $("#notapplicableScore").text(res.QuestionDetails.length);
                    $("#comments").html("");
                    $("#commentToAgent").show();
                    $("#sectionQuestions").html(resHtml);

                } else {
                    $("#commentToAgent").hide();
                    $("#sectionQuestions").html("No questions");
                }
            } else {
                $("#sectionQuestions").html(res.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#selScoreCards").html("<option value='0'> Select ScoreCard </option>");
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

function getSkillGroupScoreCards() {
    $.ajax({
        type: "GET",
        url: "Handlers/Scorecards.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 10, callId: global_CallId },
        success: function (res) {
            var resHtml = "";
            if (res.Success == "True") {
                resHtml += "<option value='0'> Select ScoreCard </option>";
                if (res.ScoreCards.length > 0) {
                    for (var i = 0; i < res.ScoreCards.length; i++) {
                        resHtml += "<option value='" + res.ScoreCards[i].Id + "'>" + res.ScoreCards[i].Title + "</option>";
                    }
                } else {
                    resHtml += "<option value='0'> No ScoreCards </option>";
                }
            } else {
                resHtml += "<option value='0'> No ScoreCards </option>";
            }
            $("#selScoreCards").html(resHtml);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#selScoreCards").html("<option value='0'> Select ScoreCard </option>");
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

function getAgentScoreCards() {
    $.ajax({
        type: "GET",
        url: "Handlers/Scorecards.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 12, agentId: global_AgentId, callId: global_CallId },
        success: function (res) {
            if (res.Success == "True") {
                $("#btnDraftScores").hide();
                if (res.ScoreCard.length > 0) {
                    $("#selScoreCards").prop("disabled", true);
                    getQuestions(res.ScoreCard[0].ScoreCardId);
                    $("#selScoreCards").val(res.ScoreCard[0].ScoreCardId);
                    $("#totalScore").text(res.ScoreCard[0].TotalScore);
                    $("#outofScore").text(res.ScoreCard[0].OutOfScore);
                    $("#lblRating").text(res.ScoreCard[0].Rating);
                    $(".rate").rateYo({
                        "rating": res.ScoreCard[0].Rating,
                        "readOnly": true,
                        "spacing": "10px",
                        "multiColor": { "startColor": "#f1c40f", "endColor": "#f1c40f" },
                        "starWidth": "20px"
                    });
                    $("#positiveScore").text(res.ScoreCard[0].PositiveCount);
                    $("#negativeScore").text(res.ScoreCard[0].NegativeCount);
                    $("#notapplicableScore").text(res.ScoreCard[0].NotApplicableCount);
                    $("#comments").val(res.ScoreCard[0].Comments);
                }
                if (res.Questions.length > 0) {
                    for (var i = 0; i < res.Questions.length; i++) {
                        $(".answers[questionid='" + res.Questions[i].QuestionId + "']").val(res.Questions[i].Answer);
                    }
                }
            } else {
                $(".rate").rateYo({
                    "rating": 0,
                    "readOnly": true,
                    "spacing": "10px",
                    "multiColor": { "startColor": "#f1c40f", "endColor": "#f1c40f" },
                    "starWidth": "20px"
                });
                $(".rate").rateYo("option", "rating", 0.0);
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