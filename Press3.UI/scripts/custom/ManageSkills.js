var skillChecks = "";
$(document).ready(function () {
    $('.timepicker-input').timepicker();
    $(".from, .to").attr("readonly", "readonly");
    $("#fixTable1").tableHeadFixer();
    $("#fixTable2").tableHeadFixer();
    getSkills();
    getSkillGroup();
    getAgents();
    getTimeSlots();
    $("#selectAccountStatus").change(function () {
       
        getAgents();
    });
    $("#selectAgentType").change(function () {
      
        getAgents();
    });

    $("#selectDeviceStatus").change(function () {

        getAgents();
    });

   
    $("#agentDetailsRedirect").click(function () {
        //window.location.href="/AgentDetails.aspx";
        window.open('/AgentDetails.aspx', '_target');
    });

});
$("input:text").keypress(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        return false;
    }
});
//$('.timepicker-input').timepicker().on('hide.timepicker', function (e) {
//    console.log($(this).val());
//    if ($(this).val() == "") {
//        $(this).val() = "";
//    }
//});
$("#btnSearch").click(function () {

    getAgents();

});

$('#txtSearch').on('keypress', function (e) {
    if (e.which === 13) {
        $("#btnSearch").click();
        e.preventDefault();

    }

}); 


$('#txt1').on('keypress', function (e) {
    if (e.which === 32) {
        e.preventDefault();

    }

});

$('#txt').on('keypress', function (e) {
    if (e.which === 32) {
        e.preventDefault();

    }

});

$('#txt2').on('keypress', function (e) {
    if (e.which === 32) {
        e.preventDefault();

    }

});

$('#txt3').on('keypress', function (e) {
    if (e.which === 32) {
        e.preventDefault();

    }

});


$('#txtSearch').on('keyup', function (e) {
    if (this.value == "") {
        $("#btnSearch").click();
        e.preventDefault();
    }
});
$('#txt1').on('keypress', function (e) {
    if (e.which === 13) {
        return false;
    }
});
$('#txt2').on('keypress', function (e) {
    if (e.which === 13) {
        return false;
    }
});

$('.timepicker-input').on('keypress', function (e) {
    if (e.which === 13) {
        return false;
    }
});
$("#add-new-time-slot").click(function () {
    $("#txt-time-slot-name").val("");
    $(".chk").prop("checked", false);
    //$(".from").val("");
    //$(".to").val("");
    var presentTime = DisplayCurrentTime();
    $('.timepicker-input').timepicker('setTime', presentTime);
    $("#time-slot-err").html("");
    $("#time-slot-success").html("");
    $("#btn-save-time-slot").html('Save');
    $("#time-slot-popup").modal("show");
});
$("#sel-time-slots").change(function () {
    var selTimeSlotId = $(this).find("option:selected").val();
    var selTimeSlotName = $(this).find("option:selected").text();
    if (selTimeSlotId != "" && parseInt(selTimeSlotId) > 0) {
        getTimeSlotTimings(selTimeSlotId, selTimeSlotName, 1);
    }
});
$(document).delegate("#btn-edit-time-slot", "click", function () {
    var getTimeSlotId = $(this).attr("time-slot-id");
    var getTimeSlotName = $(this).attr("time-slot-name");
    if (getTimeSlotId != "" && parseInt(getTimeSlotId) > 0) {
        getTimeSlotTimings(getTimeSlotId, getTimeSlotName, 2);
    }
});
$(document).delegate("#btn-del-time-slot", "click", function () {

    var cnf = confirm("Do you really want to delete this time slot?")
    if (cnf == true)
    {

        var delTimeSlotId = $(this).attr("time-slot-id");
        if (delTimeSlotId != "" && parseInt(delTimeSlotId) > 0) {
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
                async: true,
                dataType: "JSON",
                data: {
                    type: 33, mode: 2, timeSlotId: delTimeSlotId, timeSlotTimings: JSON.stringify([])
                },
                success: function (res) {
                    $.unblockUI();
                    if (res.Success == "True") {
                        getTimeSlots();
                        $("#div-view-time-slot").html("");
                    }
                    else {
                        console.log(res.Message);
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


    }

});
//$('#txt-time-slot-name').on('keypress', function (e) {
  //  if (e.which == 13) {
       // e.preventDefault();

  //  }

//});
$("#btn-save-time-slot").click(function () {
    var timeSlotId = $(this).attr("time-slot-id");
    var timeSlotName = $("#txt-time-slot-name").val().trim();
    var dayLists = [];
    if (timeSlotName == "") {
        $("#time-slot-err").html("Enter name");
        return false;
    }
    if ($(".chk:checked").length == 0) {
        $("#time-slot-err").html("Select atleast one day");
        return false;
    }
    var isEmpty = 0;
    if ($(".head-chk").is(":checked")) {
        $(".chk").prop("checked", false);
        if ($(this).find("input.from").val() == "") {
            $("#time-slot-err").html("Enter from time");
            return false;
        } else if ($(this).find("input.to").val() == "") {
            $("#time-slot-err").html("Enter to time");
            return false;
        }
        dayLists.push({ "day": $(this).attr("name"), "fromtime": $(this).find("input.from").val(), "totime": $(this).find("input.to").val() });
    } else if ($(".chk").is(":checked")) {
        $(".chk:checked").each(function () {
            var chkFromTime = "", chkToTime = "", chkFromTimeArray = [], chkToTimeArray = [];
            if ($(this).closest('tr').find("input.from").val() == "") {
                $("#time-slot-err").html("Enter from time for " + $(this).attr("name"));
                isEmpty = 1;
                return false;
            } else if ($(this).closest('tr').find("input.to").val() == "") {
                $("#time-slot-err").html("Enter to time for " + $(this).attr("name"));
                isEmpty = 1;
                return false;
            }
            chkFromTime = $(this).closest('tr').find("input.from").val();
            chkFromTime = chkFromTime.replace(" ", "");
            chkFromTimeArray = chkFromTime.split(":");
            if (chkFromTimeArray.length > 0 && chkFromTimeArray[0].length == 1) {
                chkFromTime = "0" + chkFromTimeArray[0] + ":" + chkFromTimeArray[1];
            }
            chkToTime = $(this).closest('tr').find("input.to").val();
            chkToTime = chkToTime.replace(" ", "");
            chkToTimeArray = chkToTime.split(":");
            if (chkToTimeArray.length > 0 && chkToTimeArray[0].length == 1) {
                chkToTime = "0" + chkToTimeArray[0] + ":" + chkToTimeArray[1];
            }
            if (chkFromTime != "" && chkToTime != "" && (chkFromTime == chkToTime)) {
                $("#time-slot-err").html("From time and To time are same for " + $(this).attr("name"));
                isEmpty = 1;
                return false;
            }
            isEmpty = 0;
            dayLists.push({ "day": $(this).attr("name"), "fromtime": $(this).closest('tr').find("input.from").val(), "totime": $(this).closest('tr').find("input.to").val() });
        });
    }
    if (isEmpty == 1) {
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
        async: true,
        dataType: "JSON",
        data: {
            type: 33, mode: 1, timeSlotId: timeSlotId, timeSlotName: timeSlotName, timeSlotTimings: JSON.stringify(dayLists)
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                $("#time-slot-success").html(res.Message);
                getTimeSlots();
                $("#div-view-time-slot").html("");
                setTimeout(function () {
                    $("#time-slot-err").html("");
                    $("#time-slot-success").html("");
                    $("#time-slot-popup").modal("hide");
                }, 1000);
            }
            else {
                console.log(res.Message);
                $("#time-slot-err").html(res.Message);
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
$('.timepicker-input').click(function () {
    $(this).timepicker();
    //	                showInputs: false,
    //	                // modalBackdrop: true,
    //	                showMeridian: false
});
$("#Supervisor_list").change(function () {
    var SelectedSuper_id = $(this).find('option:selected').val();
    if (SelectedSuper_id != 0) {
        getAgentsLists(SelectedSuper_id);
    }
    else {
        $("#selectable").html("");
        $('#assigned_agents').html("");
        $('#feedback').html("");

    }
});

function getSkills() {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Skills.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 1 },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                var skillSet = "";

                if (res.SkillDetails.length > 0) {
                    for (var i = 0; i < res.SkillDetails.length; i++) {
                        skillSet += "<label id='lblskill_" + i + "' SkillId='" + res.SkillDetails[i].skillId + "' SkillName = '" + res.SkillDetails[i].skill + "' class='skill_label margin-right-10'>" + res.SkillDetails[i].skill + "<span>";
                        skillSet += "<a><i id = 'edit_" + i + "' rowid='" + i + "' skillid='" + res.SkillDetails[i].skillId + "' skillname = '" + res.SkillDetails[i].skill + "' description = '" + res.SkillDetails[i].Description + "' class='fa fa-pencil margin-right-5 edit'></a></i>";
                        skillSet += "<i style='display:none' id = 'update_" + i + "' rowid='" + i + "' skillid='" + res.SkillDetails[i].skillId + "' class='fa fa-pencil margin-right-5 update'></i><a>";
                        skillSet += "<i  id = 'delete_" + i + "' rowid='" + i + "' skillid='" + res.SkillDetails[i].skillId + "' skillname = '" + res.SkillDetails[i].skill + "'class='fa fa-times delete'></i></a>";
                        skillSet += "</span></label>";
                    }

                } else {
                    console.log(res.Message);
                }
            } else {
                console.log(res.Message);
                $("#skillsBody").text("No skills");
            }
            $("#skillsBody").html(skillSet);

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


$(document).delegate('.edit', 'click', function () {
    var skillId = $(this).attr("skillid");
    var skillName='';
    var description = '';
    $("#txt").val("");
    $("#txtarea").text("");
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Skills.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 5, Id: skillId },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.SkillDetails.length > 0) {
                     skillName = res.SkillDetails[0].Name;
                     description = res.SkillDetails[0].Description;
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
    
    var rowId = $(this).attr("rowid");
    $("#update").attr("skillid", skillId);
    $("#txt").val(skillName);
    $("#txtarea").val(description);
    $("#update").attr("rowid", rowId);
    $("#update-skill").modal("show");
    // setTimeout(function () { $("#txt").focus(); }, 1000);
});


$(document).delegate('#update', 'click', function () {
    var skillName = $("#txt").val().trim();
    if (skillName == "" || skillName == "undefined") {
        alert("Enter Skill Name");
        return false;
    }
    var skillDescription = $("#txtarea").val().trim();
    if (skillDescription == "" || skillDescription == "undefined") {
        alert("Enter Description");
        return false;

    }
    var ID = $(this).attr("rowid");
    var SkillId = $(this).attr("skillid");
    $("#update-skill").modal("hide");
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Skills.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 3, id: SkillId, name: skillName, Description: skillDescription },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                $("#lblskill_" + ID).show();
                $("#lblskill_" + ID).html(skillName);
                getSkills();
            }
            else {
                alert(res.Message);
                console.log(res);
            }
        },
        error: function (res) {
            $.unblockUI();
            console.log(res);
        }
    });
    getSkillGroup();
});

$(document).delegate('.delete', 'click', function () {
    var skillId = $(this).attr("skillid");
    var rowId = $(this).attr("rowid");
    var skillName = $(this).attr("skillname");
    $("#delete").attr("skillid", skillId);
    $("#delete").attr("rowid", rowId);
    $("#delete").attr("skillname", skillName);
    $("#delete-skill").modal("show");
});

$(document).delegate('#delete', 'click', function () {
    var rowId = $(this).attr("rowid");
    var skillId = $(this).attr("skillid");
    var skillName = $(this).attr("skillname");
    $("#delete-skill").modal("hide");
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Skills.ashx",
        dataType: "JSON",
        async: true,
        data: { type: 4, id: skillId, name: skillName },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                alert(res.Message);
                getSkills();
                getSkillGroup();
            }
            else {
                console.log(res);

            }
        },
        error: function (res) {
            $.unblockUI();
            console.log(res);
        }
    });
});

$(document).delegate('.createskill', 'click', function () {
    $("#txt1").val("");
    $("#txtarea1").val("");
    $("#create-skill").modal("show");
});

//$(document).delegate('.creategroup', 'click', function () {
//    $("#txt2").val("");
//    $("#txtarea2").val("");
//    $("#create-skillgroup").modal("show");
//});

$(document).delegate('#create', 'click', function () {
    var skillName = $("#txt1").val();
    if (skillName == "") {
        alert("Enter Skill Name");
        return false;
    }
    var skillDescription = $("#txtarea1").val().trim();
    if (skillDescription == "") {
        alert("Enter Description");
        return false;
    }

    skillDescription.scrollTop = skillDescription.scrollHeight;
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Skills.ashx",
        dataType: "JSON",
        async: true,
        data: { type: 2, Name: skillName, Description: skillDescription },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                alert(res.Message);
                $("#txt1").val("");
                $("#txtarea1").val("");
                $("#create-skill").modal("hide");
                getSkills();

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

$(document).delegate('#create_cancel', 'click', function () {
    $("#txt1").val("");
    $("#txtarea1").val("");
});


$('.creategroup').click(function () {

    $("#txt2").val("");
    $("#txtarea2").val("");
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Skills.ashx",
        dataType: "JSON",
        async: true,
        data: { type: 1 },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                var skills = "";
                if (res.SkillDetails.length > 0) {
                    for (var i = 0; i < res.SkillDetails.length; i++) {
                        skills += "&nbsp&nbsp&nbsp<input type='checkbox'  class='skills'   skillids='" + res.SkillDetails[i].skillId + "' />&nbsp" + res.SkillDetails[i].skill;
                    }

                } else {
                    console.log(res.Message);
                }
            } else {
                console.log(res.Message);
            }
            $("#skills").html(skills);

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

  
    $("#create-skillgroup").modal("show");

});

$("#create-group").click(function () {

    var ids = "";
    var skillGroupName = $("#txt2").val().trim();
    if (skillGroupName == "") {
        alert("Please enter Group Name");
        return false;
    }
  
          
        

    $(".skills:checked").each(function () {
        ids = ids + $(this).attr("skillids") + ',';
    });

    if (ids == "") {
        alert("Please select skills");
        return false;
    }
    var skillIds = ids.substring(0, ids.length - 1);
    var skillGroupDescription = $("#txtarea2").val().trim();
    if (skillGroupDescription == "") {
        alert("Please enter Description");
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
        url: "Handlers/SkillGroup.ashx",
        dataType: "JSON",
        async: true,
        data: { type: 5, skillIds: skillIds, GroupName: skillGroupName, Description: skillGroupDescription },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                $("#create-skillgroup").modal("hide");
                getSkillGroup();
                $("#txt2").val("");
                $("#txtarea2").val("");
                alert(res.Message);
            }
            else {

                console.log(res);
            }
        },
        error: function (res) {
            $.unblockUI();
            console.log(res);
        }
    });

});

$(document).delegate('#create_group_cancel', 'click', function () {
    $("#txt2").val("");
    $("#txtarea2").val("");
});

function getSkillGroup() {

  //  $("#skillGroup").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");
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
        async: false,
        data: { type: 1 },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                var skillSetGroup = "";
                var ss = "";
                if (res.SkillGroupDetails.length > 0) {
                    for (var i = 0; i < res.SkillGroupDetails.length; i++) {
                        skillSetGroup += "<tr><td><label id='lblskill_Group" + i + "'>" + res.SkillGroupDetails[i].Name + "</label></td><td> ";
                        var SkillIds = res.SkillGroupDetails[i].SkillIds;
                        var SkillNames = res.SkillGroupDetails[i].SkillNames;
                        var SkillNamesArray = SkillNames.split(",");
                        var SkillIdsArray = SkillIds.split(",");
                        for (var j = 0; j < SkillNamesArray.length; j++) {
                            skillSetGroup += "<label class='label_round_sm margin-right-5'>" + SkillNamesArray[j] + "</label>";
                        }
                        skillSetGroup += "</td><td>" + res.SkillGroupDetails[i].Description + "</td><td><a><i class='fa fa-edit margin-right-10 editSkillGroup' SkillNames='" + SkillNames + "' id = '" + res.SkillGroupDetails[i].Id + "' groupName='" + res.SkillGroupDetails[i].Name + "' description='" + res.SkillGroupDetails[i].Description + "'></i></a>";
                        skillSetGroup += "<a><i class='fa fa-trash-o deleteSkillGroup' id = '" + res.SkillGroupDetails[i].Id + "'></i></a></td>" + skillChecks + "</tr>";
                    }

                } else {
                    console.log(res.Message);
                }
            } else {
                console.log(res.Message);
            }
            $("#skillGroup").html(skillSetGroup);
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

$(document).delegate('.editSkillGroup', 'click', function () {

    $("#txt3").val('');
    $("#txtarea3").val('');
    $(".groupSkills").html('');
    var groupName = $(this).attr("groupName");
    $("#txt3").val(groupName);
    var description = $(this).attr("description");
    $("#txtarea3").val(description);
    var skillGroupId = $(this).attr("id");
    $('#updateGroupSkills').attr('skillgroupid', skillGroupId);
    var skillCheck = "";
    skillCheck += "<lable>Skills</lable><br/><div id='Checkbox_" + skillGroupId + "'>"
    var skillNamesData = $(this).attr("SkillNames");
    var skillNamesDataArray = {};
    skillNamesDataArray = skillNamesData.split(",");
    $(".skill_label").each(function () {
        if ($.inArray($(this).attr("SkillName"), skillNamesDataArray) != -1) {
            skillCheck += "<input type='checkbox' checked = 'true' class='checkedSkills' id='checkedSkills_" + skillGroupId + "' skillids='" + $(this).attr("SkillId") + "' />&nbsp" + $(this).attr("SkillName")
        }
        else {
            skillCheck += "<input type='checkbox' class='checkedSkills' id='checkedSkills_" + skillGroupId + "' skillids='" + $(this).attr("SkillId") + "' />&nbsp" + $(this).attr("SkillName")
        }

    });
    $(".groupSkills").html(skillCheck);

    $("#update-skillGroup").modal("show");

});

$(document).delegate('#updateGroupSkills', 'click', function () {

    var ids = "";
  
    skillGroupId = $(this).attr("skillgroupid");
    var groupName = $("#txt3").val().trim();
    var groupDescription = $("#txtarea3").val().trim();


    $("#Checkbox_" + skillGroupId + " #checkedSkills_" + skillGroupId + ":checked").each(function () {
        ids = ids + $(this).attr("skillids") + ',';
    });



    if (groupName == "") {
        alert("Please enter Group Name");
        return false;
    }

    if (groupDescription == "") {
        alert("Please enter Description");
        return false;
    }

    if (ids == "") {
        alert("Please select skills");
        return false;
    }



    var skillIds = ids.substring(0, ids.length - 1);
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
        async: false,
        data: { type: 2, id: skillGroupId, skillIds: skillIds, groupName: groupName, Description: groupDescription },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                $("#txt3").val("");
                $("#txtarea3").val("");
                $("#update-skillGroup").modal("hide");
                getSkillGroup();
                alert(res.Message);
            }
            else {
                console.log(res);
            }
        },
        error: function (res) {
            $.unblockUI();
            console.log(res);
        }
    });


});

$(document).delegate('.deleteSkillGroup', 'click', function () {
    var skillGroupId = $(this).attr("id");
    $('#deleteGroupSkills').attr('skillgroupid_', skillGroupId);
    $("#delete-skillGroup").modal("show");

});

$(document).delegate('#deleteGroupSkills', 'click', function () {
    skillGroupId = $(this).attr('skillgroupid_');
    $("#delete-skillGroup").modal("hide");
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
        async: true,
        data: { type: 4, groupId: skillGroupId },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                alert(res.Message);
                getSkillGroup();
            }
            else {
                alert("You Cannot delete the skill Group");
            }
        },
        error: function (res) {
            $.unblockUI();
            console.log(res);
        }
    });
});

$(document).delegate('.redirectpage', 'click', function () {
    window.location.href = '/AgentProfileSettings.aspx';
    return false;

});



function getAgents() {

   // $("#agentSkills").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");
     
    var accStatusId =  $('[Id="selectAccountStatus"] option:selected').val();

    var agentTypeId = $('[Id="selectAgentType"] option:selected').val();

    var deviceStatusId = $('[Id="selectDeviceStatus"] option:selected').val();

    searchText = $("#txtSearch").val();

    var agentSkills = "";
    var agents = "";
    var supervisorslist = "<option value='0'>Select</option>";
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        url: "Handlers/Agents.ashx",
        type: "POST",
        async: true,
        dataType: "JSON",
        data: {
            type: 11, searchText: searchText, accStatusId: accStatusId, agentTypeId: agentTypeId, deviceStatusId: deviceStatusId
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {

                $("#h2NoOfRecords").html(res.AgentSkills.length);

                if (res.AgentSkills.length > 0) {

                    for (var i = 0; i < res.AgentSkills.length; i++) {
                        agentSkills += "<tr><td><a class='btn-link view' title=AgentId=" + res.AgentSkills[i].Id + " agentId='" + res.AgentSkills[i].Id + "'>" + res.AgentSkills[i].Name + "</a></td><td>" + res.AgentSkills[i].Designation + "</td><td>";
                        //agents += '<li class="ui-widget-content" value="' + res.AgentSkills[i].Id + '">' + res.AgentSkills[i].Name + '</li>';
                       
                        var SkillNames = res.AgentSkills[i].SkillNames;
                        if (SkillNames == "")
                        {
                            SkillNames = "--";
                        }
                        var SkillNamesArray = SkillNames.split(",");
                       
                        for (var j = 0 ; j < SkillNamesArray.length ; j++) {
                            if (SkillNamesArray[j] != "")
                                agentSkills += "<label class='label_round_sm margin-right-5'>" + SkillNamesArray[j] + "</label>";

                        }
                        //if (res.AgentSkills[i].AccountStatus == "Blocked") {
                        //    agentSkills += "<i class='pull-right fa fa-ban text-danger'>" + res.AgentSkills[i].AccountStatusStatus + "</i>";
                        //}




                        if (res.AgentSkills[i].LoginType == "") {
                            res.AgentSkills[i].LoginType = "--";
                        }

                        if (res.AgentSkills[i].DeviceType == "") {
                            res.AgentSkills[i].DeviceType = "--";
                        }

                        if (res.AgentSkills[i].UserName == "") {
                            res.AgentSkills[i].UserName = "--";
                        }

                        if (res.AgentSkills[i].Password == "") {
                            res.AgentSkills[i].Password = "--";
                        }

                        if (res.AgentSkills[i].OBAccessType == "") {
                            res.AgentSkills[i].OBAccessType = "--";
                        }

                        if (res.AgentSkills[i].AccountStatus == "") {
                            res.AgentSkills[i].AccountStatus = "--";
                        }


                        if (res.AgentSkills[i].IPAddress == "") {
                            res.AgentSkills[i].IPAddress = "--";
                        }

                        if (res.AgentSkills[i].Port == "") {
                            res.AgentSkills[i].Port = "--";
                        }

                        if (res.AgentSkills[i].Gateway == "") {
                            res.AgentSkills[i].Gateway = "--";
                        }

                        if (res.AgentSkills[i].DeviceStatus == "") {
                            res.AgentSkills[i].DeviceStatus = "--";
                        }
                            

                        if (res.AgentSkills[i].LastSignalReceived == "") {
                            res.AgentSkills[i].LastSignalReceived = "--";
                        }


                        if (res.AgentSkills[i].LoggedInFromWeb == "") {
                            res.AgentSkills[i].LoggedInFromWeb = "--";
                        }


                        agentSkills += "</td><td>" + res.AgentSkills[i].LoginType + "</td><td>" + res.AgentSkills[i].DeviceType + "</td><td>" + res.AgentSkills[i].UserName + "</td><td>" + res.AgentSkills[i].Password + "</td><td>" + res.AgentSkills[i].IPAddress + "</td><td>" + res.AgentSkills[i].Port + "</td><td>" + res.AgentSkills[i].Gateway + "</td><td>" + res.AgentSkills[i].DeviceStatus + "</td><td>" + res.AgentSkills[i].AccountStatus + "</td><td>" + res.AgentSkills[i].OBAccessType + "</td><td>" + res.AgentSkills[i].LastSignalReceived + "</td><td>" + res.AgentSkills[i].LoggedInFromWeb + "</td></tr>";

                    }
                    $("#agentSkills").html(agentSkills);
                    //$("#selectable").html(agents);



                    
                } else {
                    $("#agentSkills").html("<tr><td colspan='15' style='text-align:center;'>No Agents</td></tr>");

                   // alert("No Agents");
                  
                    console.log(res.Message);
                }

                if (res.Supervisors.length > 0) {

                    for (var j = 0; j < res.Supervisors.length; j++) {

                      
                        supervisorslist += '<option value =' + res.Supervisors[j].SupIdNo + '>' + res.Supervisors[j].SupervisorName + '</option>';
                    }
                    
                }
                else {
                    console.log(res.Message);
                }
                $("#Supervisor_list").html(supervisorslist);



            } else {
                Console.log(res.Message);
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




function TeamManagement(supervisor_id, agent) {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        url: "Handlers/Supervisor.ashx",
        type: "POST",
        async: true,
        dataType: "JSON",
        data: {
            type: 15, SupervisorId: supervisor_id, AgentToAssign: agent, mode: 1
        },
        success: function (res) {
            if (res.Success == "False") {
                $('#feedback').text(res.Message);
            }
            if (res.Success == "True") {
                $('#feedback').text(res.Message);

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

function getAgentsLists(SelectedSuper_id) {
    var assigned_list = "";
    var Unassigned_list = "";
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        url: "Handlers/Supervisor.ashx",
        type: "POST",
        async: true,
        dataType: "JSON",
        data: {
            type: 15, SupervisorId: SelectedSuper_id, mode: 2
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.Agents_Assigned.length > 0) {
                    for (var i = 0; i < res.Agents_Assigned.length; i++) {
                        var name = res.Agents_Assigned[i].Name;
                        if (name.length > 20) {
                            name = '<span data-toggle="tooltip" data-original-title="' + res.Agents_Assigned[i].Name + '">' + name.slice(0, 17) + '...</span>';
                        }
                        assigned_list += '<li class="ui-widget-content well" value ="' + res.Agents_Assigned[i].Id + '">' + name + '<i class="fa fa-minus-square pull-right" title="Release" aria-hidden="true"></i></li>';
                    }
                    $('#feedback').text("");
                } else {
                    $('#feedback').text("There are no agents assigned to selected supervisor").css("color", "red");
                }

                if (res.Unassigned_Agents.length > 0) {
                    for (var i = 0; i < res.Unassigned_Agents.length; i++) {
                        var name = res.Unassigned_Agents[i].Name;
                        if (name.length > 20) {
                            name = '<span data-toggle="tooltip" data-original-title="' + res.Unassigned_Agents[i].Name + '">' + name.slice(0, 17) + '...</span>';
                        }
                        Unassigned_list += '<li class="ui-widget-content well" value ="' + res.Unassigned_Agents[i].Id + '"><i class="fa fa-plus-square" title="Assign" aria-hidden="true"></i>' + name + '</li>';
                    }
                }
                $("#selectable").html(Unassigned_list);
                $('#assigned_agents').html(assigned_list);
                $('[data-toggle="tooltip"]').tooltip();
            }
            else {
                $('#feedback').text(res.Message).css("color", "red");
                $('#assigned_agents').html(assigned_list);
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


function ReleaseAgents(supervisor_id, assignedAgent) {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        url: "Handlers/Supervisor.ashx",
        type: "POST",
        async: true,
        dataType: "JSON",
        data: {
            type: 15, SupervisorId: supervisor_id, AgentToRelease: assignedAgent, mode: 3
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "False") {
                $('#feedback').text(res.Message);
            }
            if (res.Success == "True") {
                $('#feedback').text(res.Message);
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

var selectedAgents = "";
var assignedAgents = "";
var agentNames = "";
var assigning = false;
var releasing = false;
//$('selector').bind("mousedown", function (e) {
//    e.metaKey = true;
//}).selectable();

//$(function () {
//    $("#selectable").selectable({
//        stop: function () {
//            selectedAgents = "";
//            agentNames = "";
//            $(".ui-selected", this).each(function () {
//                var index = $(this).val();
//                var name = $(this).text();
//                agentNames += name + ",";
//                selectedAgents += index + ",";
//            });
//        }
//    });
//});
$('#selectable').delegate('.fa-plus-square', 'click', function () {
    var selectedAgent_id = $(this).parent("li").val();
    var name = $(this).parent("li").text();
   // alert($(this).parent("li").attr('data-original-title'));
    $(this).parent("li").remove();
    $('#assigned_agents').append('<li class="ui-widget-content well" value ="' + selectedAgent_id + '">' + name + '<i class="fa fa-minus-square pull-right" title="Release" aria-hidden="true"></i></li>');
    var supervisor_id = $("#Supervisor_list option:selected").val();
    TeamManagement(supervisor_id, selectedAgent_id);
});

$('#assigned_agents').delegate('.fa-minus-square', 'click', function () {
    var assignedAgent_id = $(this).parent("li").val();
    var name = $(this).parent("li").text();
    $(this).parent("li").remove();
    $('#selectable').append('<li class="ui-widget-content well" value ="' + assignedAgent_id + '"><i class="fa fa-plus-square" title="Assign" aria-hidden="true"></i>' + name + '</li>');
    var supervisor_id = $("#Supervisor_list option:selected").val();

    ReleaseAgents(supervisor_id, assignedAgent_id);
});

$(document).delegate('.view', 'click', function () {
    var agentId = $(this).attr("agentId");
    window.location.href = '/AgentProfileSettings.aspx?AgentId=' + agentId;
    return false;
});

function getTimeSlots() {
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
        async: true,
        data: { type: 8 },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (res.Success == "True") {
                resHtml += "<option value='0'>Select TimeSlot</option>";
                if (res.TimeSlots.length > 0) {
                    for (var i = 0; i < res.TimeSlots.length; i++) {
                        resHtml += "<option value='"+ res.TimeSlots[i].Id +"'>"+ res.TimeSlots[i].Name +"</option>";
                    }
                }
                $("#sel-time-slots").html(resHtml);
            } else {
                $("#sel-time-slots").html("<option value='0'>No TimeSlots</option>");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#sel-time-slots").html("<option value='0'>No TimeSlots</option>");
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
function getTimeSlotTimings(selectedTimeSlotId, selTimeSlotName, mode) {
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
        async: true,
        data: { type: 7, timeSlotId: selectedTimeSlotId },
        success: function (res) {
            $.unblockUI();
            if (mode == 1) {
                var resHtml = "";
                if (res.Success == "True") {
                    resHtml += "<div class='well well-sm well-grey brd pad-15' style='width:50%'>";
                    resHtml += "<label><span class='label-head margin-right-10'>Name: " + selTimeSlotName + "</span></label>";
                    resHtml += "<hr style='border-color:#a5c4d0;'><div class='table-responsive'><table class='table no-border'>";
                    resHtml += "<thead><tr><th class='bold-6'>Day</th><th class='bold-6'>Time</th></tr></thead><tbody>";
                    if (res.Timings.length > 0) {
                        for (var i = 0; i < res.Timings.length; i++) {
                            resHtml += "<tr><td>" + res.Timings[i].Day + "</td>";
                            resHtml += "<td>" + res.Timings[i].FromTime + " - " + res.Timings[i].ToTime + "</td>";
                            resHtml += "</tr>";
                        }
                        resHtml += "</tbody></table></div></div>";
                        resHtml += "<div><input type='button' class='btn btn-success' id='btn-edit-time-slot' style='margin-left:150px;' value='Edit Timeslot' time-slot-id='" + selectedTimeSlotId + "' time-slot-name='" + selTimeSlotName + "' />";
                        resHtml += "<input type='button' class='btn btn-success' id='btn-del-time-slot' style='margin-left:20px;' value='Delete Timeslot' time-slot-id='" + selectedTimeSlotId + "' /></div>"
                        $("#div-view-time-slot").html(resHtml);
                    } else {
                        $("#div-view-time-slot").html("No Timings");
                    }
                } else {
                    $("#div-view-time-slot").html("No Timings");
                }
            } else if (mode == 2) {
                $("#time-slot-err").html("");
                $("#time-slot-success").html("");
                if (res.Success == "True") {
                    $("#txt-time-slot-name").val(selTimeSlotName);
                    if (res.Timings.length > 0) {
                        for (var i = 0; i < res.Timings.length; i++) {
                                $(".chk[name='" + res.Timings[i].Day.toLowerCase() + "']").prop("checked", true);
                                var chktr = $(".chk[name='" + res.Timings[i].Day.toLowerCase() + "']").closest("tr");
                                $(chktr).find(".from").val(res.Timings[i].FromTime);
                                $(chktr).find(".to").val(res.Timings[i].ToTime);
                        }
                    }
                    $("#btn-save-time-slot").attr("time-slot-id", selectedTimeSlotId);

                    
                    $("#time-slot-popup").modal("show");
                    $("#btn-save-time-slot").html('Update');
                   // $("#btn-save-time-slot").value = "Update";

                   
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#div-view-time-slot").html("No Timings");
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
function DisplayCurrentTime() {
    var date = new Date();
    var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? "PM" : "AM";
    hours = hours < 10 ? "0" + hours : hours;
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    time = hours + ":" + minutes + " " + am_pm;
    return time;
};