var hdnAgentId = $("#hdnAgentId").val();
var hdnRoleId = $("#hdnRoleId").val();
var mode = 1;//MODE 1 FOR CREATING CONTACT AND MODE 2 FOR EDITING CONTACT
var existingGroup="";
var OldContact = "";
getAgentProfile();
getProfileDetails();
$(document).ready(function () {
    var d = new Date();
    var Date_ = d.toLocaleString()
    Date_ = Date_.split(' ')[0];
    Date_ = Date_.slice(0, -1);
    $("#statusChangeOn").datepicker();
    $("#statusChangeOn").val(Date_);
    $("#BtnGet").click(function () {
        getStatusChangeDateWise();
    });
    if (hdnRoleId != 3) {
        $("#div-reporting-manager").show();
    } else {
        $("#div-reporting-manager").hide();
    }

    if (hdnRoleId != 1) {

        $(".profile_rate").hide();
    }
    else {

        $(".profile_rate").show();
    }

});
function getAgentProfile() {
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
        data: { type: 10, agentId: hdnAgentId },
        success: function (res) {
            $.unblockUI();
            var resHtml = "";
            if (res.Success == "True") {
                if (res.AgentBasicDetails.length > 0) {
                    if (res.AgentBasicDetails[0].ProfilePic != "") {
                        $("#imgProfilePic").attr('src', res.AgentBasicDetails[0].ProfilePic);
                    }
                    $("#divProfileName").text(res.AgentBasicDetails[0].Name);
                    $("#lblProfileLocation").text(res.AgentBasicDetails[0].Country);
                    if(typeof(res.AgentBasicDetails[0].Rating) != 'undefined'){
                        $(".rate").rateYo({
                            "rating": Number(res.AgentBasicDetails[0].Rating),
                            "readOnly": true,
                            "spacing": "10px",
                            "multiColor": { "startColor": "#35aa47", "endColor": "#35aa47" },
                            "starWidth": "20px"
                        });
                    }
                    $("#lblRating").text("(" + res.AgentBasicDetails[0].Rating + ")");
                    if (res.AgentBasicDetails[0].LoggedInHrs != "") {
                        $("#spnLoggedHrs").text(res.AgentBasicDetails[0].LoggedInHrs);
                    }
                    if (res.AgentBasicDetails[0].SkillGroups != "") {
                        var skillGroups = [], skillGroupLabels = "";
                        skillGroups = res.AgentBasicDetails[0].SkillGroups.split(",");
                        for (var i = 0; i < skillGroups.length; i++) {
                            skillGroupLabels += "<label class='label_round f_13'>"+ skillGroups[i] +"</label>";
                        }
                        $("#lblSkillGroups").after(skillGroupLabels);
                    } else {
                        $("#lblSkillGroups").after("No Skillgroups");
                    }
                    if (res.AgentBasicDetails[0].Skills != "") {
                        var skills = [], skillLabels = "";
                        skills = res.AgentBasicDetails[0].Skills.split(",");
                        for (var i = 0; i < skills.length; i++) {
                            skillLabels += "<label class='label_round f_13'>" + skills[i] + "</label>";
                        }
                        $("#lblSkills").after(skillLabels);
                    } else {
                        $("#lblSkills").after("No Skills");
                    }
                }
                else {
                    $("#lblSkillGroups").after("No Skillgroups");
                    $("#lblSkills").after("No Skills");
                }

                if (res.AgentCallStatistics.length > 0) {
                    $("#lblAvailableTime").text(res.AgentCallStatistics[0].AvailableTimePercent);
                    $("#lblOnCallTime").text(res.AgentCallStatistics[0].OnCallTimePercent);
                    $("#lblAWATime").text(res.AgentCallStatistics[0].OWATimePercent);
                    $("#lblInBreakTime").text(res.AgentCallStatistics[0].InBreakTimePercent);
                }

                var resHtml = "";
                if (res.AgentStatusChanges.length > 0) {
                    for (var i = 0; i < res.AgentStatusChanges.length; i++) {
                        resHtml += "<li class='in'><img class='avatar' alt='' src='assets/img/user.jpg'/>";
                        resHtml += "<div class='message'><span class='arrow'></span>";
                        resHtml += "<span href='#' class='name bold'>Status Change </span>";
                        resHtml += "<span class='datetime'>at " + res.AgentStatusChanges[i].ChangedTime + "</span>";
                        resHtml += "<span class='body'>Changed to : " + res.AgentStatusChanges[i].Status + "</span></div></li>";
                    }
                } else {
                    resHtml += "<li class='in'>No Status Changes</li>";
                }
                $("#ulStatusChanges").html(resHtml);
            }
            else {
                $("#ulStatusChanges").html("<li class='in'>No Status Changes</li>");
                $("#lblSkillGroups").after("No Skillgroups");
                $("#lblSkills").after("No Skills");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            $("#ulStatusChanges").html("<li class='in'>No Status Changes</li>");
            $("#lblSkillGroups").after("No Skillgroups");
            $("#lblSkills").after("No Skills");
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
function getStatusChangeDateWise() {
    var date = $("#statusChangeOn").val();

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        url: "Handlers/Agents.ashx",
        type: "GET",
        async: false,
        dataType: "JSON",
        data: {
            type: 15, date: date
        },
        success: function (res) {
            $.unblockUI();

            if (res.Success == "True") {

                var resHtml = "";
                if (res.AgentStatusChanges.length > 0) {
                    for (var i = 0; i < res.AgentStatusChanges.length; i++) {
                        resHtml += "<li class='in'><img class='avatar' alt='' src='assets/img/user.jpg'/>";
                        resHtml += "<div class='message'><span class='arrow'></span>";
                        resHtml += "<span href='#' class='name bold'>Status Change </span>";
                        resHtml += "<span class='datetime'>at " + res.AgentStatusChanges[i].ChangedTime + "</span>";
                        resHtml += "<span class='body'>Changed to : " + res.AgentStatusChanges[i].Status + "</span></div></li>";
                    }
                } else {
                    resHtml += "<li class='in'>No Status Changes</li>";
                }
                $("#ulStatusChanges").html(resHtml);

            }
            else {
                // alert(res.Message);
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

};


function getProfileDetails() {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Agents.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 12, agentid: hdnAgentId },
        success: function (res) {
            $.unblockUI();
            var name = res.Table[0].Name;
            if (name != "") {

                if (name.length > 10)
                {
                    $('#full_name').text(name.slice(0, 10) + "...");
                
                    $('#full_name').hover(function () {

                        $('#full_name').attr('data-original-title', name).tooltip('show');
                    });
                }
                else {
                    $('#full_name').text(name);
                }
            }
            if (res.Table[0].mobile != "") {
                $('#mobile').text(res.Table[0].mobile);
            }
            if (res.Table[0].Email != "") {
                $('#email').text(res.Table[0].Email);
            }
            if (res.Table[0].Designation != "") {
                $('#designation').text(res.Table[0].Designation);
            }
            if (res.Table[0].ReportingManager != "") {
                $('#reportingManager').text(res.Table[0].ReportingManager);
            }
            if (res.Table[0].ProfileType=="Active") {
                $('#profileType').text(res.Table[0].ProfileType);
            }
            else {
                $('#profileType').removeClass("font-green-soft");
                $('#profileType').addClass("font-red");
                if (res.Table[0].ProfileType != "")
                    $('#profileType').text(res.Table[0].ProfileType);

            }
            if (res.Table[0].ExtensionNumber != "") {
                $('#extensionNum').text(res.Table[0].ExtensionNumber);
            }
            if (res.Table[0].DeviceType != "") {
                if (res.Table[0].DeviceType == "External Sip Account" && res.Table[0].IP != "")
                {
                    $('#deviceType').text(res.Table[0].DeviceType + " (" + res.Table[0].IP + " :" + res.Table[0].Port+")");
                }
                else
                {
                    $('#deviceType').text(res.Table[0].DeviceType);
                }
                
            }
            if (res.Table[0].DeviceType == "PSTN") {
                $("#sipAccountUserNameHide").hide();
            } 
            
        },
        error: function (jqXHR, exception) {
            $.unblockUI();
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.log(msg);
        }
        
    });
}
        
$(document).ready(function () {
  $("#sel_val").change(function () {
        var option = $(this).find('option:selected').val();
        $('#sel_txt').text(option);
 });
 
   $("#grp_val").change(function () {
      var option = $(this).find('option:selected').val();
     $('#grp_txt').text(option);
   });
   $(document).on("input", "#txtMobile", function () {
       this.value = this.value.replace(/[^\d]/g, '');
   });
   $(document).on("input", "#txtAlternateMobile", function () {
       this.value = this.value.replace(/[^\d]/g, '');
   });


    ContactManagement();
    GetGroup();

    $("input:text").keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    $("#contactId").change(function () {
        Group = $(this).find('option:selected').text();
        if (Group != "All contacts")
        { GetGroupWiseTable(Group); }
        else { ContactManagement(); }
    });
   

    $("#newContact").click(function () {
        OldContact = "";
        existingGroup = "";
        $("#txtContactName").val('');
        $("#txtMobile").val('');
        $("#txtAlternateMobile").val('');
        $("#txtContactEmail").val('');
        $("#txtNote").val('');
        $("#txtNewGroup").val('');
        $("#lblEditErrorMsg").html('');
        $("#createContact").modal("show");
        $("#txtNewGroup").show();
        GetSearchInformation("");
        mode = 1;
    });


    $("#ddlContactGroups").change(function () {
        $("#txtNewGroup").hide();
  
        existingGroup = $(this).find('option:selected').text();

        $("#txtNewGroup").val("");
        if(existingGroup == "Select")
        {   
            $("#txtNewGroup").show();
            existingGroup = "";
            
        }

    });
  
    $("#btnNewContact").click(function () 
    {
       
        var contactName = "";
        var contactName = $("#txtContactName").val();
        var contactsMobile = $("#txtMobile").val();
        var alternateMobile = $("#txtAlternateMobile").val();
        var contactEmail = $("#txtContactEmail").val();
        var notes = $("#txtNote").val();
        var groupName = $("#txtNewGroup").val();
        contactName = contactName.trim();
        contactEmail = contactEmail.trim();
        contactsMobile = contactsMobile.trim();
       
         

        if (contactName == "") {
            $("#lblEditErrorMsg").html("Name Required");
           
            return false;
        }
        if (contactsMobile == "")
        {
            $("#lblEditErrorMsg").html("mobile number Required");

            return false;
        }
     
        var moblen = contactsMobile.length;

        if (moblen > 15 || moblen < 7) {
            $("#lblEditErrorMsg").html("Mobile Number length should be Min 7 and Max 15");
            return false;
        }
      
        if (alternateMobile != "")
        {    var moblen1 = alternateMobile.length;

            if (moblen1 > 15 || moblen1 < 7) {
                $("#lblEditErrorMsg").html(" Alternate Mobile Number length should be Min 7 and Max 15");
                return false;
            }}
        if (contactEmail != "") {
            if (!isEmail(contactEmail)) {
                $("#lblEditErrorMsg").html("Please Enter Valid Email");
                return false;
            }
        }
        if (groupName != "")
        {
            existingGroup = "";
            GetSearchInformation("");

        }

        if (existingGroup=="" && groupName=="") 
            {
                $("#lblEditErrorMsg").html("you must enter any group");
                return false;
        }
        

        CreatAgentContacts(mode, contactName, contactsMobile, alternateMobile, contactEmail, notes, groupName, existingGroup,OldContact);
        existingGroup = "";
        OldContact = "";
    });
});

$(document).delegate('.editContact', 'click', function () {
    var GroupName = $(this).attr("GroupName");
    var ContactName = $(this).attr("name");
    existingGroup = GroupName;

    $("#createContact").modal("show");
    $("#txtContactName").val(ContactName);
   $("#txtMobile").val( $(this).attr("contactNumber"));
   $("#txtAlternateMobile").val($(this).attr("AltNumber"));
   $("#txtContactEmail").val($(this).attr("email"));
   $("#txtNote").val($(this).attr("Notes"));
   $("#lblEditErrorMsg").html('');
   $("#txtNewGroup").show();
   $("#txtNewGroup").val("");
   GetSearchInformation(GroupName);
   mode = 2;
   OldContact = $(this).attr("contactNumber");
      
});
$(document).delegate('.deleteContact', 'click', function () {
    var ContactNumber = $(this).attr("contactNumber");
    $('#btnDeleteContact').attr('ContactId_',ContactNumber );
    $("#deletContact").modal("show");
 
});

$(document).delegate('#btnDeleteContact', 'click', function () {
    ContactNumber = $(this).attr('ContactId_');
    $("#deletContact").modal("hide");
    DeleteContact(ContactNumber);

});

function isEmail(email) {
    // var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var regex = /^([\w\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return regex.test(email);
}




function CreatAgentContacts(mode, contactName, contactsMobile, alternateMobile, contactEmail, notes, groupName, existingGroup, OldContact) {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        url: "Handlers/AgentContact.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 1, mode: mode, ContactName: contactName, ContactsMobile: contactsMobile, AlternateMobile: alternateMobile, ContactEmail: contactEmail, Notes: notes, GroupName: groupName, ExistingGroup: existingGroup, OldContact: OldContact
        },
        success: function (res) {
            $.unblockUI();
           

            if (res.Success == "True") {
                ContactManagement();
                GetGroup();
                alert("Contact Saved");
                $("#createContact").modal("Hide");
               
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

function GetSearchInformation(GroupName) {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });

    $.ajax({
        url: "Handlers/AgentContact.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2, 
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
             
                    
                var groupss = "<option value='0'>Select</option>";
                    
                if (res.Groups.length > 0)
                {
                    for (i = 0; i < res.Groups.length; i++) {

                        if (res.Groups[i].Name == GroupName)
                        {
                            groupss += "<option value='" + res.Groups[i].Id + "' selected>" + res.Groups[i].Name + "</option>";
                        }
                        else {
                        groupss += "<option value='" + res.Groups[i].Id + "'>" + res.Groups[i].Name + "</option>"
                    } 
                      
                    }
                    
                  
                    $("#ddlContactGroups").html(groupss);
                }
                  
              

            }
            else {
               // alert(res.Message);
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
};
function ContactManagement() {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        url: "Handlers/AgentContact.ashx",
        type: "GET",
        async: false,
        dataType: "JSON",
        data: {
            type: 3, 
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                var table = "<thead>" + "<tr>" + "<th>" + "Name" + "</th>" + "<th>" + "Number" + "</th>" + "<th>" + "Alternate Number" + "</th>" + "<th>" + "Email" + "</th>" + "<th>" + "Notes" + "</th>" + "<th>" + "Actions" + "</th>" + "</tr>" + " </thead>";
                if (res.ContactTable.length > 0) {
                    for (i = 0; i < res.ContactTable.length; i++) {
                        table += "<tr><td><label class='btn-call margin-right-5'><i class='fa fa-phone'></i></label>" + res.ContactTable[i].Name + "</td>";
                        table += "<td style='padding-top:13px;'>" + res.ContactTable[i].Number + "</td>";
                        table += "<td style='padding-top:13px;'>" + res.ContactTable[i].AlterNateNumber + "</td>";
                        table += "<td style='padding-top:13px;'>" + res.ContactTable[i].Email + "</td>";
                        table += "<td style='padding-top:13px;'>" + res.ContactTable[i].Notes + "</td>";
                        table += "<td style='padding-top:13px;'>" + "<a  class='font-blue margin-right-10 '><i class='icon-pencil editContact' contactid='" + res.ContactTable[i].Id + "'contactNumber='" + res.ContactTable[i].Number + "'AltNumber='" + res.ContactTable[i].AlterNateNumber + "'name='" + res.ContactTable[i].Name + "'email='" + res.ContactTable[i].Email + "'GroupName='" + res.ContactTable[i].GroupName + "'Notes='" + res.ContactTable[i].Notes + "'></i></a><a class='font-red'><i class='icon-trash deleteContact'contactNumber='" + res.ContactTable[i].Number + "'></i></a></td>" + "</tr>" + "<hr/>";;

                    }
                }
            }
            else {
                var table = "<thead><tr><th>Name</th><th>Number</th><th>Alternate Number</th><th>Email</th><th>Notes</th><th>Actions</th></tr></thead>";
                table +=  "<tr><td> No data present</td></tr>";
            }

            $("#contatsTable").html(table);
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

};
function DeleteContact(ContactNumber) {

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        url: "Handlers/AgentContact.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 4, ContactNumber: ContactNumber
        },
        success: function (res)
        {
            $.unblockUI();
            if (res.Success == "True")
               {
                ContactManagement();
                GetGroup();
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
};
function GetGroup() {

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });

    $.ajax({
        url: "Handlers/AgentContact.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 2,
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {


                var groupss = "<option value='0'>All contacts</option>";

                if (res.Groups.length > 0) {
                    for (i = 0; i < res.Groups.length; i++) {
                        groupss += "<option value='" + res.Groups[i].Id + "'>" + res.Groups[i].Name + "</option>"


                    }

                    $("#contactId").html(groupss);
                   
                }



            }
            else {
                //alert(res.Message);
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
};

function GetGroupWiseTable(Group) {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });

    $.ajax({
        url: "Handlers/AgentContact.ashx",
        type: "GET",
        async: false,
        dataType: "JSON",
        data: {
            type: 5, GroupName: Group
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                var table = "<thead>" + "<tr>" + "<th>" + "Name" + "</th>" + "<th>" + "Number" + "</th>" + "<th>" + "Alternate Number" + "</th>" + "<th>" + "Email" + "</th>" + "<th>" + "Notes" + "</th>" + "<th>" + "Actions" + "</th>" + "</tr>" + " </thead>";
                if (res.ContactTable.length > 0) {
                    for (i = 0; i < res.ContactTable.length; i++) {
                        table += "<tr><td><label class='btn-call margin-right-5'><i class='fa fa-phone'></i></label>" + res.ContactTable[i].Name + "</td>";
                        table += "<td>" + res.ContactTable[i].Number + "</td>";
                        table += "<td>" + res.ContactTable[i].AlterNateNumber + "</td>";
                        table += "<td>" + res.ContactTable[i].Email + "</td>";
                        table += "<td>" + res.ContactTable[i].Notes + "</td>";
                        table += "<td>" + "<a  class='font-blue margin-right-10 '><i class='icon-pencil editContact' contactid='" + res.ContactTable[i].Id + "'contactNumber='" + res.ContactTable[i].Number + "'AltNumber='" + res.ContactTable[i].AlterNateNumber + "'name='" + res.ContactTable[i].Name + "'email='" + res.ContactTable[i].Email + "'GroupName='" + res.ContactTable[i].GroupName + "'Notes='" + res.ContactTable[i].Notes + "'></i></a><a class='font-red'><i class='icon-trash deleteContact'contactNumber='" + res.ContactTable[i].Number + "'></i></a></td>" + "</tr>" + "<hr/>";;

                    }


                }
            }
            else {
                alert(res.Message);
            }

            $("#contatsTable").html(table);
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
};