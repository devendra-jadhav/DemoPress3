var scripts = "";
var editScript = "";
var script = {};
var sections = [];
var topics = [];
var flag = 0;
var flag1 = 0;


//var scrolled = 0;

$(document).ready(function () {
    getScripts();

    getSkillGroups();

    $(document).delegate('.view', 'click', function () {
        $("#uploadfileclose").hide();
        $("#scriptHeader").hide();
        var scriptId = $(this).attr("scriptId");
        var skillGroupId = $(this).attr("groupId");
        $(".add_script").hide();
        var viewScript = "";
        editScript = "";
        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
        $.ajax({
            type: "GET",
            url: "Handlers/Scripts.ashx",
            dataType: "JSON",
            data: { type: 5, scriptId: scriptId },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {
                    if (res.ScriptDetails.length > 0) {
                        viewScript += "<div class='portlet lite pad-15 view1'>";
                        viewScript += "<div class='compose_view'>";
                        viewScript += "<div class='compose_panel'>";
                        viewScript += "<div class='row'>";
                        viewScript += "<div class='col-sm-4'>";
                        viewScript += "<label class='label-head blocked'>Script Title</label>";
                        viewScript += "<label class='font-grey-gallery' id = 'scriptName_'" + scriptId + "'  >" + res.ScriptDetails[0].Title + "</label>";
                        viewScript += "</div>"
                        viewScript += "<div class='col-sm-7'>";
                        viewScript += "<label class='label-head blocked'>Attach Skills</label>";
                        viewScript += "<div>";


                        var SkillNames = res.ScriptDetails[0].SkillNames;
                        var SkillNamesArray = SkillNames.split(",");
                        for (var i = 0; i < SkillNamesArray.length; i++) {
                            viewScript += "<label class='label_round_sm margin-right-10'>" + SkillNamesArray[i] + "</label>";

                        }


                        viewScript += " </div>";
                        viewScript += "</div>";
                        viewScript += "<div class='col-sm-1'>";
                        viewScript += "<label class='btn-edit' ><a style='color:#fff;'><i class='fa fa-edit edit' scriptId =" + scriptId + " scriptName=" + res.ScriptDetails[0].Title + " groupId =" + skillGroupId + "></i></a></label>";
                        viewScript += "</div>";
                        viewScript += "</div>";
                        viewScript += "<hr style='border-color:#ccc;'>";


                        for (var j = 0 ; j < res.SectionDetails.length ; j++) {
                            viewScript += "<div class='form-group' scetionId = 'sectionId_" + res.SectionDetails[j].SectionId + "'>";
                            viewScript += "<label class='label-head margin-right-10'>Section :</label>";
                            viewScript += " <label class='font-grey-gallery'>" + res.SectionDetails[j].Section + "</label>";
                            viewScript += "</div>";

                            for (var k = 0 ; k < res.TopicDetails.length; k++) {
                                if (res.SectionDetails[j].SectionId == res.TopicDetails[k].SectionId) {
                                    viewScript += "  <div class='lite' topicId = 'topicId_" + res.TopicDetails[k].TopicId + "'>";
                                    viewScript += "  <div class='form-group'>";
                                    viewScript += "<label class='label-head blocked'>Topic</label>";
                                    viewScript += "<label class='font-grey-gallery'>" + res.TopicDetails[k].Topic + "</label>";
                                    viewScript += " <div>";
                                    viewScript += " <div class='form-group'>";
                                    viewScript += "<label class='label-head blocked'>Description</label>";
                                    viewScript += "<p>" + res.TopicDetails[k].Description + "</p>";
                                    viewScript += "</div>";
                                    viewScript += "</div></div></div><br>";
                                }

                            }

                        }
                        $("#viewScripts").html(viewScript);
                        $("#viewScripts").show();


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


    $(document).delegate('.edit', 'click', function () {
        $("#scriptHeader").hide();
        $(".uploadfile").hide();
        var scriptId = $(this).attr("scriptId");
        var scriptName = $(this).attr("scriptName");
        var skillGroupId = $(this).attr("groupId");
        $(".add_script").hide();
        var count = 0;
        // $("#viewScripts").hide();
        //alert(scriptId + " " + scriptName + "" + skillGroupId);
        var editScript = "";
        var check = "";
        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
        $.ajax({
            type: "GET",
            url: "Handlers/Scripts.ashx",
            dataType: "JSON",
            async: false,
            data: { type: 5, scriptId: scriptId },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {
                    if (res.ScriptDetails.length > 0) {
                        //count = res.SectionDetails.length;
                        editScript += "<div class='portlet lite pad-15 editScript'>";
                        editScript += "<div class='compose_view'>";
                        editScript += "<div class='editAddSection' >";
                        editScript += "<div class='row'>";
                        editScript += "<div class='col-sm-4'>";
                        editScript += "<label class='label-head blocked'>Script Title</label>";
                        editScript += "<input type='text' class='input-circle form-control scriptTitle' scriptId = '" + res.ScriptDetails[0].Id + "' value='" + res.ScriptDetails[0].Title + "' maxlength='400'>";
                        editScript += "</div>"
                        editScript += "<div class='col-sm-7'>";
                        editScript += "<label class='label-head blocked'>Attached SkillGroup</label>";
                        editScript += " <div><div id='skillGroup' class='pull-left'>";
                        editScript += skillGroup(skillGroupId);
                        editScript += "</div>";
                        editScript += "<div class='pull-left'>"
                        check = res.ScriptDetails[0].IsDefault;
                        if (check == "True") {
                            editScript += "<label class='f_13 txt-grey'><input type='checkbox' class='margin-right-10 checkExist' checked>Make this script default for this skill</label>";
                        } else {
                            editScript += "<label class='f_13 txt-grey'><input type='checkbox' class='margin-right-10 checkExist'>Make this script default for this skill</label>";
                        }
                        
                        editScript += "</div><div class='clearfix'></div></div>";

                        editScript += "</div>";
                        editScript += "</div>";
                        editScript += "<hr style='border-color:#ccc;'>";

                        editScript += "<div class='margin-top-10 text-center '><a id='editAddSection' class='font-green-soft' section='" + count + "'>";
                        editScript += "<i class='fa fa-plus margin-right-5 '></i> Add New Section</a></div>";
                        editScript += " <div class='text-danger' id = 'sectionError'></div>";

                        for (var j = 0 ; j < res.SectionDetails.length ; j++) {
                            editScript += "<div class='compose_panel editSections' SectionId='" + res.SectionDetails[j].SectionId + "'  >";
                            editScript += "<span class='close_top' style='cursor:pointer;'><img src='assets/img/close.png' sectionId='" + res.SectionDetails[j].SectionId + "' class='closeSectionExist' alt='close' width='18' ></span>";
                            editScript += "<div class='form-group'>";
                            editScript += "<label class='bold-6'>Section</label>";
                            editScript += "<input type='text' class='form-control input-circle sectionName ' value='" + res.SectionDetails[j].Section + "' maxlength='400'>";
                            editScript += "</div>";

                            for (var k = 0 ; k < res.TopicDetails.length; k++) {
                                if (res.SectionDetails[j].SectionId == res.TopicDetails[k].SectionId) {
                                    editScript += "<div class='lite margin-top-15 newTopics topic_" + res.TopicDetails[k].TopicId + "' TopicId ='" + res.TopicDetails[k].TopicId + "'>";
                                    editScript += "<span class='close_top' style='cursor:pointer;'><img src='assets/img/close.png' alt='close' width='18' topicId='" + res.TopicDetails[k].TopicId + "' sectionId='" + res.SectionDetails[j].SectionId + "' class='closeTopicExist'></span>";
                                    editScript += "<div class='form-group'>";
                                    editScript += "<label>Topic</label>";
                                    editScript += "<input type='text' class='form-control input-circle topicName' value='" + res.TopicDetails[k].Topic + "'>";
                                    editScript += "</div>";
                                    editScript += "<div class='form-group'>";
                                    editScript += "<label>Description</label>";
                                    editScript += "<textarea class='form-control brd topicDesc' rows='3' >" + res.TopicDetails[k].Description + "</textarea>";
                                    editScript += "</div><br>";
                                    editScript += "</div><br>";
                                }
                            }
                            editScript += "<div class='text-right margin-top-10 newTopic'>";
                            editScript += " <div><a class='font-blue'><i class='fa fa-plus margin-right-5 ' sectionId = '" + res.SectionDetails[j].SectionId + "' topicId = '" + res.TopicDetails.length + "'> Add New Topic</i></a></div>";
                            editScript += "</div></div>";
                        }
                        editScript += "</div>";
                        editScript += "<div align='center' id='btnUpdateCancel'> <button type='button' class='btn btn-sm green btn-100 btn-circle margin-right-10' id='updateScript'>Update</button>";
                        editScript += "<button type='button' class='btn btn-sm btn-default btn-100 btn-circle' id = 'updateCancel'>Cancel</button></div>";
                        $("#viewScripts").html(editScript);
                        $("#viewScripts").show();

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

    $(document).delegate('#addSection', 'click', function () {
        var sectionHtml = "";
        sectionHtml += "<div class='compose_panel newSection' >";
        sectionHtml += "<span class='close_top' style='cursor:pointer;'><img src='assets/img/close.png' class='newSectionClose' alt='close' width='18' ></span>";
        sectionHtml += "<div class=''><label class='bold-6'>Section</label>";
        sectionHtml += "<input type='text' class='form-control input-circle sectionName' maxlength='400'>";
        sectionHtml += "</div>";
        sectionHtml += "<div class='lite margin-top-15 newTopics'>";
        sectionHtml += "<div class='form-group'><label>Topic</label>";
        sectionHtml += "<input type='text' class='form-control input-circle topicName' maxlength='400'>";
        sectionHtml += "</div>";
        sectionHtml += "<div class='form-group'>";
        sectionHtml += "<label>Description</label>";
        sectionHtml += "<textarea class='form-control brd topicDesc' rows='3'></textarea>";
        sectionHtml += "</div>";
        sectionHtml += "</div>";
        sectionHtml += "<div class='text-right margin-top-10 newTopic'>";
        sectionHtml += "<a class='font-blue'><i class='fa fa-plus margin-right-5'></i> Add New Topic</a>";
        sectionHtml += "</div>";
        sectionHtml += "</div>";
        $("#createScriptDiv").show();
        $("#sections").append(sectionHtml);
        
        $('body,html').animate({ scrollTop: $('body').height() }, 800);
    });

    $(document).delegate('#editAddSection', 'click', function () {
        var sectionHtml = "";
        sectionHtml += "<div class='compose_panel editNewSection' >";
        sectionHtml += "<span class='close_top' style='cursor:pointer;'><img src='assets/img/close.png' class='newSectionClose' alt='close' width='18' ></span>";
        sectionHtml += "<div class=''><label class='bold-6'>Section</label>";
        sectionHtml += "<input type='text' class='form-control input-circle sectionName' maxlength='400'>";
        sectionHtml += "</div>";
        sectionHtml += "<div class='lite margin-top-15 newTopics'>";
        sectionHtml += "<div class='form-group'><label>Topic</label>";
        sectionHtml += "<input type='text' class='form-control input-circle topicName'maxlength='400'>";
        sectionHtml += "</div>";
        sectionHtml += "<div class='form-group'>";
        sectionHtml += "<label>Description</label>";
        sectionHtml += "<textarea class='form-control brd topicDesc' rows='3'></textarea>";
        sectionHtml += "</div>";
        sectionHtml += "</div>";
        sectionHtml += "<div class='text-right margin-top-10 newTopic'>";
        sectionHtml += "<a class='font-blue'><i class='fa fa-plus margin-right-5'></i> Add New Topic</a>";
        sectionHtml += "</div>";
        sectionHtml += "</div>";
        $("#btnUpdateCancel").show();
        $(".editAddSection").append(sectionHtml);
        $('body,html').animate({ scrollTop: $('body').height() }, 800);
    });

    $(document).delegate('.newTopic', 'click', function () {
        var topicHtml = "";
        topicHtml += " <div class='lite margin-top-15 newTopics' TopicId ='0' >";
        topicHtml += "<span class='close_top' style='cursor:pointer;'><img src='assets/img/close.png' alt='close' width='18' class='closeTopicNew'></span>";
        topicHtml += " <div class='form-group'>";
        topicHtml += " <label>Topic</label>";
        topicHtml += " <input type='text' class='form-control input-circle topicName' maxlength='400'>";
        topicHtml += " </div>";
        topicHtml += " <div class='form-group'>";
        topicHtml += " <label>Description</label>";
        topicHtml += " <textarea class='form-control brd topicDesc' rows='3'></textarea>";
        topicHtml += " </div>";
        topicHtml += " </div>";
        topicHtml += "<div class='text-right margin-top-10 newTopic'>";
        topicHtml += "<a class='font-blue'><i class='fa fa-plus margin-right-5'></i> Add New Topic</a>";
        topicHtml += "</div>";
        $(this).after(topicHtml);
        $(this).remove();

    });

    $(document).delegate("#updateCancel", "click", function () {
        $("#viewScripts").hide();
    });

    $('#txtscriptTitle').on('keypress', function (e) {
        if (e.which === 13) {
            $("#btnSearch").click();
            e.preventDefault();

        }

    });
    $(document).delegate('#createScript', 'click', function () {
        $("#txtscriptTitle").val("");
        $('#selSkillGroup').val("0");
        $("#defaultscript").prop("checked", false);
        $("#scriptHeader").show();
        $(".editScript").hide();
        $(".view1").hide();
        $("#addSectionDiv").hide();
        $("#sections").hide();
        $("#createScriptDiv").hide();
        $("#scriptErr").hide();
        $("#sectionErr").hide();
    });

    $(document).delegate("#scriptCancel", "click", function () {
        $("#addSectionDiv").hide();
        $("#sections").hide();
        $("#createScriptDiv").hide();
        $("#sectionErr").hide();

    });

    $(document).delegate('#composeScript', 'click', function () {
        $("#addSectionDiv").hide();
        $("#editView").hide();
        $("#scriptErr").html("");
        var scriptTitle = $("#txtscriptTitle").val();
        scriptTitle = scriptTitle.trim();
        var SkillGroupId = $("#selSkillGroup").find("option:selected").val();
        if (scriptTitle == "") {
            $("#scriptErr").html("Please Enter Script Title ").show();
            $("#sections").hide();
            $("#createScriptDiv").hide();
            $("#addSectionDiv").hide();
            var temp = $("#scriptErr").text();
            if (temp != "") {
                $(".add_section").hide();
               
            }
            return false;
        } else if (SkillGroupId == "0") {
            $("#scriptErr").html("Please Select Attach SkillGroup ").show();
            $("#sections").hide();
            $("#createScriptDiv").hide();
            $("#addSectionDiv").hide();
            var temp1 = $("#scriptErr").text();
            if (temp1 != "") {
                $(".add_section").hide();
            
            }
            return false;
        }
        else {
            $("#scriptErr").html("");
            $.blockUI({
                message: '<img src="/assets/img/Press3_Gif.gif" />',
                css: {
                    border: 'none',
                    backgroundColor: 'transparent',
                }
            });
            $.ajax({
                type: "GET",
                url: "Handlers/Scripts.ashx",
                dataType: "JSON",
                //async: false,
                data: { type: 3, scriptTitle: scriptTitle },
                success: function (res) {
                    $.unblockUI();
                    if (res.Success == "True") {
                        $("#sections").hide();
                        $("#createScriptDiv").hide();
                        $(".uploadfile").hide();
                        $("#scriptErr").html("The Script Title with " + scriptTitle + " already exist").show();
                       
                    }
                    else {
                        console.log(res.Message);
                        var sectionHtml = "";
                        sectionHtml += "<div class='compose_panel newSection' >";
                        sectionHtml += "<span class='close_top' style='cursor:pointer;'><img src='assets/img/close.png' class='newSectionClose' alt='close' width='18' ></span>";
                        sectionHtml += "<div class=''><label class='bold-6'>Section</label>";
                        sectionHtml += "<input type='text' class='form-control input-circle sectionName' maxlength='400'>";
                        sectionHtml += "</div>";
                        sectionHtml += "<div class='lite margin-top-15 newTopics'>";
                        sectionHtml += "<div class='form-group'><label>Topic</label>";
                        sectionHtml += "<input type='text' class='form-control input-circle topicName'  maxlength='400'>";
                        sectionHtml += "</div>";
                        sectionHtml += "<div class='form-group'>";
                        sectionHtml += "<label>Description</label>";
                        sectionHtml += "<textarea class='form-control brd topicDesc' rows='3'></textarea>";
                        sectionHtml += "</div>";
                        sectionHtml += "</div>";
                        sectionHtml += "<div class='text-right margin-top-10 newTopic'>";
                        sectionHtml += "<a class='font-blue'><i class='fa fa-plus margin-right-5'></i> Add New Topic</a>";
                        sectionHtml += "</div>";
                        sectionHtml += "</div>";
                        $("#sections").html(sectionHtml);
                        $(".uploadfile").hide();
                        $("#sections").show();
                        $("#addSectionDiv,#createScriptDiv").show();
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

    $(document).delegate(".newSectionClose", "click", function () {
        $(this).parent().parent().remove();
        $("#sectionErr").hide();
         var count = $("#sections").find(".newSection").length;
         var countExist = $(".editSections").length;
         if (count == 0 && countExist == 0) {
             $("#createScriptDiv").hide();
             $("#addSectionDiv").hide();
             $("#btnUpdateCancel").hide();
         }
    });

    $(document).delegate(".closeTopicNew", "click", function () {
        $(this).parent().parent().remove();


    });

    $(document).delegate(".closeSectionExist", "click", function () {
        $(this).parent().parent().remove();
        var count = $(".editSections").length;
            if(count == 0){
                $("#btnUpdateCancel").hide();    
        }
        var sectionId = $(this).parent().parent().attr("sectionId");
        var scriptId = $(".scriptTitle").attr("scriptId");
        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
         $.ajax({
            type: "GET",
            url: "Handlers/Scripts.ashx",
            dataType: "JSON",
            async: true,
            data: { type: 8,scriptId :scriptId, sectionId :sectionId },
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

    $(document).delegate(".closeTopicExist", "click", function () {
        $(this).parent().parent().remove();
        var sectionId = $(this).attr("sectionId");
        //console.log($(this).parent().parent().html());
        var topicId = $(this).parent().parent().attr("topicId");
        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
        $.ajax({
            type: "GET",
            url: "Handlers/Scripts.ashx",
            dataType: "JSON",
            async: true,
            data: { type: 9,sectionId :sectionId,topicId:topicId },
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


    $(document).delegate("#saveScript", "click", function () {
        var sections = [];
        var result = true;
        
        var scriptTitle = $("#txtscriptTitle").val();
        scriptTitle = scriptTitle.trim();
        $("#scriptErr").html("");
        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
        $.ajax({
            type: "GET",
            url: "Handlers/Scripts.ashx",
            dataType: "JSON",
            //async: false,
            data: { type: 3, scriptTitle: scriptTitle },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {
                    $("#scriptErr").html("The Script Title with " + scriptTitle + " already exist").show();
                    $("#sections").hide();
                    $("#createScriptDiv").hide();
                    $(".uploadfile").hide();
                    result = false;
                    return false;
                } else {
                    var SkillGroupId = $("#selSkillGroup").find("option:selected").val();
                    if (SkillGroupId == "0") {
                        $("#scriptErr").html("Please Select Attach SkillGroup").show();
                        $("#sections").hide();
                        $("#createScriptDiv").hide();
                        $(".uploadfile").hide();
                        result = false;
                        return false;

                    }
        $("#sections .newSection").each(function () {
            var sectionTitle = $(this).find(".sectionName").val();
            sectionTitle = sectionTitle.trim();
            if (sectionTitle == "" || sectionTitle == "undefined") {
                $("#sectionErr").html("Please Enter Section Name").show();
                result = false;
                $('html, body').animate({
                    scrollTop: ($('#sectionErr').first().offset().top)
                }, 500);
                return false;
                
            }
            $(this).find(".newTopics").each(function () {                
                var Topic = $(this).find(".topicName").val();
                Topic = Topic.trim();
                if (Topic == "" || Topic == "undefined") {
                    $("#sectionErr").html("Please Enter Topic Name of "+sectionTitle ).show();
                    result = false;
                    $('html, body').animate({
                        scrollTop: ($('#sectionErr').first().offset().top)
                    }, 500);
                    return false;

                }
                var Description = $(this).find(".topicDesc").val();
                Description = Description.trim();
                if (Description == "" || Description == "undefined") {
                    $("#sectionErr").html("Please Enter Description of " + Topic).show();
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
            var TopicArray = [];
            var TopicObj = {};
            var ScriptTitle = $("#txtscriptTitle").val();
            ScriptTitle = ScriptTitle.trim();
            if (ScriptTitle == "") {
                return false;
            }
            allObj['ScriptTitle'] = ScriptTitle;
            var SkillGroupId = $("#selSkillGroup").find("option:selected").val();
            allObj['SkillGroupId'] = SkillGroupId;
            var check = "";
            if ($(".check").prop("checked") == true) {
                check = 1;
            } else {
                check = 0;
            }
            allObj['check'] = check;
            $("#sections .newSection").each(function () {
                section = {};
                TopicArray = [];
                var sectionTitle = $(this).find(".sectionName").val();

                sectionTitle = sectionTitle.trim();
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
                $(this).find(".newTopics").each(function () {
                    TopicObj = {};
                    var Topic = $(this).find(".topicName").val();

                    TopicObj['Title'] = Topic;
                    var Description = $(this).find(".topicDesc").val();
                    TopicObj['Description'] = Description;
                    TopicArray.push(TopicObj);
                });
                section['Topics'] = TopicArray;
                sectionObj.push(section);
                allObj['Sections'] = sectionObj;
            });
            if (flag == 0) {
                $.blockUI({
                    message: '<img src="/assets/img/Press3_Gif.gif" />',
                    css: {
                        border: 'none',
                        backgroundColor: 'transparent',
                    }
                });
                $.ajax({
                    type: "GET",
                    url: "Handlers/Scripts.ashx",
                    dataType: "JSON",
                    data: { type: 2, data: JSON.stringify(allObj) },
                    success: function (res) {
                        $.unblockUI();
                        if (res.Success == "True") {
                            alert(res.Message);
                            location.reload();
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

    $(document).delegate("#upload", "click", function () {
        $("#sectionErr").hide();
        $("#xlinfo").html("");
        $("#upmsg").html("");
        $("#editView").hide();
        $("#scriptErr").html("");
        var scriptTitle = $("#txtscriptTitle").val();
        scriptTitle = scriptTitle.trim();
        var SkillGroupId = $("#selSkillGroup").find("option:selected").val();
        if (scriptTitle == "") {
            $("#scriptErr").html("Please Enter Script Title ").show();
            $("#uploadfileclose").hide();
            var temp = $("#scriptErr").text();
            if (temp != "") {
                $(".add_section").hide();
            }
            return false;
        } else if (SkillGroupId == "0") {
            $("#scriptErr").html("Please Select Attach SkillGroup ").show();
            $("#uploadfileclose").hide();
            var temp1 = $("#scriptErr").text();
            if (temp1 != "") {
                $(".add_section").hide();
            }
            return false;
        }
        else {
            $("#scriptErr").html("");
            $.blockUI({
                message: '<img src="/assets/img/Press3_Gif.gif" />',
                css: {
                    border: 'none',
                    backgroundColor: 'transparent',
                }
            });
            $.ajax({
                type: "GET",
                url: "Handlers/Scripts.ashx",
                dataType: "JSON",
                //async: false,
                data: { type: 3, scriptTitle: scriptTitle },
                success: function (res) {
                    $.unblockUI();
                    if (res.Success == "True") {
                        $("#uploadfileclose").hide();
                        $("#sections").hide();
                        $("#createScriptDiv").hide();
                        $("#scriptErr").html("The Script Title with " + scriptTitle + " already exist");
                      
                    } else {
                        $("#addSectionDiv").hide();
                        $("#sections").hide();
                        $("#createScriptDiv").hide();
                        $('#search').val('');
                        $('#ddlsection').val(0);
                        $('#ddltopic').val(0);
                        $('#ddldescription').val(0);
                        $(".uploadfile").show();
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

    $(document).delegate("#fileCancel", "click", function () {
        $(".uploadfile").hide();

    });

    $(document).delegate("#updateScript", "click", function () {
        var sections = [];
        var result = true;

        $(".editNewSection").each(function () {
            var sectionTitle = $(this).find(".sectionName").val();
            sectionTitle = sectionTitle.trim();
            if (sectionTitle == "" || sectionTitle == "undefined") {
                $("#sectionError").html("Please Enter Section Name").show();
                result = false;
                $('html, body').animate({
                    scrollTop: ($('#sectionError').first().offset().top)
                }, 500);
                return false;
            }
            $(this).find(".newTopics").each(function () {
                var Topic = $(this).find(".topicName").val();
                Topic = Topic.trim();
                if (Topic == "" || Topic == "undefined") {
                    $("#sectionError").html("Please Enter topic name of " + sectionTitle).show();
                    result = false;
                    $('html, body').animate({
                        scrollTop: ($('#sectionError').first().offset().top)
                    }, 500);
                    return false;
                }
                var Description = $(this).find(".topicDesc").val();
                Description = Description.trim();
                if (Description == "" || Description == "undefined") {
                    $("#sectionError").html("Please Enter Description of " + Topic).show();
                    result = false;
                    $('html, body').animate({
                        scrollTop: ($('#sectionError').first().offset().top)
                    }, 500);
                    return false;
                }
            });
        });
        $(".editSections").each(function () {
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
            $(this).find(".newTopics").each(function () {
                var Topic = $(this).find(".topicName").val();
                Topic = Topic.trim();
                if(Topic == "" || Topic == "undefined") {
                    $("#sectionError").html("Please Enter topic name of " + sectionTitle).show();
                    result = false;
                    $('html, body').animate({
                        scrollTop: ($('#sectionError').first().offset().top)
                    }, 500);
                    return false;
                }
                var Description = $(this).find(".topicDesc").val();
                Description = Description.trim();
                if (Description == "" || Description == "undefined") {
                    $("#sectionError").html("Please Enter Description of " + Topic).show();
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
            var TopicArray = [];
            var TopicObj = {};
            var ScriptTitle = $(".scriptTitle").val();
            ScriptTitle = ScriptTitle.trim();
            var ScriptId = $(".scriptTitle").attr("scriptId");
            if (ScriptTitle == "") {
                return false;
            }
            allObj['ScriptId'] = ScriptId;
            allObj['ScriptTitle'] = ScriptTitle;
            var SkillGroupId = $("#selSkillGroupId").find("option:selected").val();
            allObj['SkillGroupId'] = SkillGroupId;
            var check = "";
            if ($(".checkExist").prop("checked") == true) {
                check = 1;
            } else {
                check = 0;
            }
            allObj['check'] = check;

            sectionObj = [];
            $(".editNewSection").each(function () {

                section = {};
                TopicArray = [];
                var sectionTitle = $(this).find(".sectionName").val();
                sectionTitle = sectionTitle.trim();
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
                $(this).find(".newTopics").each(function () {
                    TopicObj = {};
                    var TopicId = $(this).attr("TopicId");
                    var Topic = $(this).find(".topicName").val();
                    TopicObj['Title'] = Topic;
                    var Description = $(this).find(".topicDesc").val();
                    TopicObj['Description'] = Description;
                    TopicArray.push(TopicObj);
                });
                section['Topics'] = TopicArray;
                sectionObj.push(section);

                allObj['Sections'] = sectionObj;
            });
            if (jQuery.isEmptyObject(sectionObj)) {
                allObj['Sections'] = [];
            }
            sectionObj = [];
            $(".editSections").each(function () {
                section = {};
                TopicArray = [];
                var sectionTitle = $(this).find(".sectionName").val();

                sectionTitle = sectionTitle.trim();
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
                var sectionId = $(this).attr("SectionId");
                section['sectionTitle'] = sectionTitle;
                section['sectionId'] = sectionId;
                $(this).find(".newTopics").each(function () {
                    TopicObj = {};
                    var TopicId = $(this).attr("TopicId");
                    // alert(TopicId);
                    var Topic = $(this).find(".topicName").val();
                    if (Topic == "") {
                        $("#sectionErr").html("Please Enter topic name");
                        return false;
                    }
                    TopicObj['TopicId'] = TopicId;
                    TopicObj['Title'] = Topic;
                    var Description = $(this).find(".topicDesc").val();
                    TopicObj['Description'] = Description;
                    TopicArray.push(TopicObj);
                });
                section['Topics'] = TopicArray;
                sectionObj.push(section);
                allObj['ExistingSections'] = sectionObj;
            });
            if (jQuery.isEmptyObject(sectionObj)) {
                allObj['ExistingSections'] = [];
            }
            if (flag == 0 && flag1 == 0) {

                $.blockUI({
                    message: '<img src="/assets/img/Press3_Gif.gif" />',
                    css: {
                        border: 'none',
                        backgroundColor: 'transparent',
                    }
                });
                $.ajax({
                    type: "POST",
                    url: "Handlers/Scripts.ashx",
                    dataType: "JSON",
                    data: { type: 6, data: JSON.stringify(allObj) },
                    success: function (res) {
                        $.unblockUI();
                        if (res.Success == "True") {
                            alert(res.Message);
                            location.reload();
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
            }
        }
        else {
            return false;
        }
      //  alert(JSON.stringify(allObj));

    });


    $(document).delegate('.delete', 'click', function () {
        var scriptId = $(this).attr("scriptId");
        $("#delete").attr("scriptid", scriptId);
        $("#delete-script").modal("show");
        $("#viewScripts").hide();
        $("#scriptHeader").hide();
        $(".uploadfile").hide();
    });

    $(document).delegate('#delete', 'click', function () {

        var scriptId = $("#delete").attr("scriptid");
        $("#delete-script").modal("hide");
        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
        $.ajax({
            type: "GET",
            url: "Handlers/Scripts.ashx",
            dataType: "JSON",
            data: { type: 4, scriptId: scriptId },
            success: function (res) {
                $.unblockUI();
                if (res.Success == "True") {
                    $("#row" + scriptId).remove();
                    var rowsCount = $(".scriptRows").length;
                    if (rowsCount == 0) {
                        $("#scripts").html("<tr><td colspan='7' align='center'> No Scripts Found</td></tr>");
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

});

function getScripts() {
    //  $("#scripts").html("<p style='text-align:center;margin-top:10px;'><img src='/assets/img/ajax-loader.gif'></p>");
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Scripts.ashx",
        dataType: "JSON",
        data: { type: 1 },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.ScriptsDetails.length > 0) {
                    for (var i = res.ScriptsDetails.length-1; i >=0 ; i--) {
                        scripts += "<tr class='scriptRows' id='row" + res.ScriptsDetails[i].Id + "'><td >" + res.ScriptsDetails[i].Title + " </td><td >" + res.ScriptsDetails[i].CreatedTime + "</td><td >" + res.ScriptsDetails[i].UpdatedTime + "</td><td>";
                        var Skills = res.ScriptsDetails[i].Skills;
                        var SkillsArray = Skills.split(",");
                        for (var j = 0; j < SkillsArray.length; j++) {
                            scripts += "<label class='label_round_sm margin-right-5'>" + SkillsArray[j] + "</label> ";
                        }

                        scripts += "</td><td >" + res.ScriptsDetails[i].TotalSections + "</td><td >" + res.ScriptsDetails[i].TotalTopics + "</td>";
                        scripts += "<td> <label class='icn_round_sm margin-right-5'><a><i class='icon-eye font-blue-soft view' scriptId='" + res.ScriptsDetails[i].Id + "'  scriptName =" + res.ScriptsDetails[i].Title + " groupId =" + res.ScriptsDetails[i].SkillGroupId + " title='View'></i></a></label>";
                        scripts += "<label class='icn_round_sm margin-right-5'><a><i class='icon-pencil font-yellow-gold edit' scriptId='" + res.ScriptsDetails[i].Id + "'  scriptName =" + res.ScriptsDetails[i].Title + " groupId =" + res.ScriptsDetails[i].SkillGroupId + " title='Edit'></i></a></label>";
                        scripts += "<label class='icn_round_sm'><a><i class='icon-trash font-red delete' scriptId='" + res.ScriptsDetails[i].Id + "' title='Delete'></i></a></label></td></tr>";
                    }

                } else {
                    scripts += "<tr><td colspan='7' align='center'> No Scripts Found</td></tr>"
                    console.log(res.Message);
                }

            } else {
                scripts += "<tr><td colspan='7' align='center'> No Scripts Found </td></tr>"
                console.log(res.Message);
            }
            $("#scripts").html(scripts);


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
            $("#skillGroups").html(skillGroups);
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
        async: true,
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


