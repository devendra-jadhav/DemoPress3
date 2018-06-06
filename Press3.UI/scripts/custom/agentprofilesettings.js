var fullName = "", firstName = "", lastName = "", mobile = "", email = "", password = "";
var roleId = 0, skills = "", deviceType = 0, phoneType = 0, reportingManagers = "", reportingSupervisors = "";
var skillids = "", selectedSkills = "", pstnNumber = "", type = 0, profileStatus = 0, agentId = 0;
var tempImage = "", profileImageData = "";
var profileImagePath;
var outBoundAccess = 0;
var loginType = 1;
var gateways = "", update = false;
var softPhone = "", devtypeFlag = 0;
var externalSip = "", sipUserName = "", sipPwd = "", externalSipPortNum = "", gatewayId = 0;
var deviceTypeOption = "";
var passwordRegex = new RegExp("(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}");
var sipRegex = new RegExp("(?=.*?[A-Za-z]).{4,}");
var extsipexistcheck = false;


$(document).ready(function () {
    

    $('#txtFullName').on('keypress', function (e) {
        if (e.which === 13) {
            return false;
        }
    });

    $('#txtFirstName').on('keypress', function (e) {
        if (e.which === 13) {
            return false;
        }
    });

    $('#txtLastName').on('keypress', function (e) {
        if (e.which === 13) {
            return false;
        }
    });

    $('#txtMobile').on('keypress', function (e) {
        if (e.which === 13) {
            return false;
        }
    });

    $('#txtAgentEmail').on('keypress', function (e) {
        if (e.which === 13) {
            return false;
        }
    });

    $('#txtAgentPassword').on('keypress', function (e) {
        if (e.which === 13) {
            return false;
        }
    });

    $("#ddlDeviceType").change(function () {
        deviceTypeOption = $(this).find('option:selected').val();
        if (deviceTypeOption == 1) {


            $("#deviceTypeModal").modal("show");

        }
        if (deviceTypeOption == 3) {
            if (agentId == 0) {
                $("#ExternalSipUserName").val("");
                $("#ExternalSipPwd").val("");
                $(".showPwd").attr("checked", false);
                $("#ExternalSipPortNum").val("");
            }
            $("#ExternaldeviceTypeModal").modal("show");

        }
        if (deviceTypeOption == 2) {
            $("#divPstn").show();
        }
        else {
            $("#divPstn").hide();
        }
    });


    getSkills();
    GetAgentCreationRelatedData();
    type = $("#hdnType").val();
    if (type == "1") {
        agentId = $("#hdnAgentId").val();
        getAgentInformation(agentId);
    }
    $('#ddlReportingManagers').multiselect({
        includeSelectAllOption: true,
        buttonWidth: '100%'
    });
    $('#ddlReportingSupervisors').multiselect({
        includeSelectAllOption: true,
        buttonWidth: '100%'
    });

    $("#ddlDesignation").change(function () {
        var option = $(this).find('option:selected').text();
        $('#spnDesignation').text(option);
        if (option == "Manager") {
            $("#divReportingMangers").hide();
            $("#divReportingSupervisors").hide();
        }
        else if (option == "Supervisor") {
            $("#divReportingMangers").show();
            $("#divReportingSupervisors").hide();
        }
        else {
            $("#divReportingMangers").show();
            $("#divReportingSupervisors").show();
        }
    });
    $("#ddlDeviceType").change(function () {
        var option = $(this).find('option:selected').text();
        $('#spnDeviceType').text(option);
        var id = $(this).find('option:selected').val();
        if (id == 3) {
           
        } else {
            $("#hdnlogin").hide();
        }
    });
    $("#ddlProfileStatus").change(function () {
        var option = $(this).find('option:selected').text();
        $('#spnProfileStatus').text(option);
    });
    $("#spnSkills").click(function () {
        var flag = 0;
 
          $("#divSkills .skills").each(function () {
              if ($(this).is(':checked')) {

                var isActive = "";
                isActive = $(this).attr("Active");
                if (isActive != "1") {
                    $(this).prop('checked', false);
           
                }
              }

          });



          $("#divSelectedSkills .selectedSkills").each(function () {
              var skillId = "";
              skillId = $(this).attr("skillId");
              $("#divSkills .skills").each(function () {
                  if ($(this).attr("skillId") == skillId) {
                      $(this).prop('checked', true);
                      flag = 1;
                  }
              });
          });


          if (flag == 0) {
              $("#btnSaveSkills").prop('disabled', true);
          }
          else {
              $("#btnSaveSkills").prop('disabled', false);
          }

        $("#skillsModel").modal("show");
    });
    $("#ddlLoginType").change(function () {
        var option = $(this).find('option:selected').text();
        $('#loginTypeId').text(option);
    });
    $("#ddloutBoundType").change(function () {
        var option = $(this).find('option:selected').text();
        $('#outBoundType').text(option);
    });
    $(document).on("input", "#txtMobile", function () {
        this.value = this.value.replace(/[^\d\.\-]/g, '');
    });



    $(".skills").change(function () {
        var flag = 0;
        $("#divSkills .skills").each(function () {
            if ($(this).is(':checked')) {
                flag = 1;
            }

            if (flag == 0) {
                $("#btnSaveSkills").prop('disabled', true);
            }
            else {
                $("#btnSaveSkills").prop('disabled', false);
            }
        });
    });





    $("#btnSaveSkills").click(function () {
        selectedSkills = "";
        $(".skills").each(function () {
            if ($(this).is(':checked')) {
                selectedSkills += "<label class='label-sm label-grey margin-right-5 margin-bottom-5 selectedSkills' skillId='"+$(this).attr("skillId")+"'>" + $(this).attr("SkillName") + "</label>";
            }
        });
        updateSkills();
        $("#divSelectedSkills").html(selectedSkills);
        $("#skillsModel").modal("hide");
    });
    $("#btnSave").click(function (e) {
        var result = false;
        result = validation()
        updateSkills();
        if (!result) {
            return;
        }
        result = parseParameters();
        if (!result) {
            return;
        }
        AgentsManagement(1);
        e.preventDefault();

    });
    $("#btnUpdate").click(function (e) {
        var result = false;
        updateSkills();
        var d = $("#ddlDeviceType").val();
        if (!updateDevicedetails(d)) {
            return;
        }
        //$('#ExternalDeviceSaveDetails').trigger('click');
        result = validation()
        if (!result) {
            return;
        }
        result = parseParameters();
        if (!result) {
            return;
        }
        AgentsManagement(3);
        e.preventDefault();

    });


    $(document).on("input", ".Numeric", function () {
        this.value = this.value.replace(/[^\d\.\-]/g, '');
    });

    $(document).on("input", ".AlphaNumerics", function () {
        this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
    });

    $('#profileUpload').fileupload({
        url: '/Handlers/SaveImage.ashx?pic=small',
        add: function (e, data) {
            var uploadErrors = [];
            var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;
            if (data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
                uploadErrors.push('Not an accepted file type');
            }

            if (uploadErrors.length > 0) {
                alert(uploadErrors.join("\n"));
            } else {
                data.submit();
            }
        },
        done: function (e, data) {

            G_img_name = data.result;
            loadCropImage("/Images/TempImages/" + G_img_name);

        },
        error: function (e, data) {
            alert(data);
        }


    });

    $("#btnSaveImage").click(function () {
        profileImageData = "";
        size = 'viewport';
        basic.croppie('result', {
            type: 'base64',
            size: size,
        }).then(function (resp) {
            $("#result").attr("src", resp);
            if (type == "0") {
                profileImageData = resp;
                $("#agentProfilePic").attr("src", profileImageData);

                $("#updateProfilePic").hide();
                $("#profileImage").show();
            }
            else {
                profileImageData = "";
                uploadProfileImage(agentId, resp)
            }

        });
    });
    $('#chkReset').change(function () {
        if ($(this).is(':checked')) {
            $("#txtResetPassword").show().val("");
        }
        else {
            $("#txtResetPassword").hide().val("");
        }
    });
    $("#btnCancelSkills").click(function () {
        $("#divSkills .skills").each(function () {
            //if ($(this).is(':checked')) {
            //    var isActive = "";
            //    isActive = $(this).attr("Active");
            //    if (isActive != "1") {
            //        $(this).prop('checked', false);
            //    }
            //}
        });
    });
    $('#btnSaveDeviceDetails').click(function () {

        if (deviceTypeOption == 1) {
            devtypeFlag = deviceTypeOption;
            var name = $('#SoftPhoneUserName').val();
            var pwd = $('#SoftPhonePwd').val();
            var error = "";
            if (name == "") {
                error = "Name ";
            }
            if (pwd == "") {
                error += "Password ";
            } else {
                if (!sipRegex.test(pwd) && error == '') {
                    error += "Password must contain one alphabet and Password should be atleast 4 characters ";
                    $('#lblErrorMsg').text(error);
                    return;
                }
            }

            SipExistanceCheck(name, 2);

            if (error == "") {

                if (extsipexistcheck == true) {
                    alert("SipUsername already Exist and Active..!!");
                    return;
                }
                else {


                    sipUserName = name;
                    sipPwd = pwd;
                    gatewayId = $("#SoftPhoneGateWay  option:selected").val();
                    $('#deviceTypeModal').modal('hide');
                    $('#deviceTypeDetailsAttached').text("View");

                }
            } else {
                $('#lblErrorMsg').text(error + "field(s) are mandatory");
            }

        }
    });

    
    $('#btnCancel').click(function () {

        //getAgentInformation(agentId);
    });


    $('#ExternalDeviceSaveDetails').click(function () {
        var result = false;
        if (deviceTypeOption == 3) {

      

            devtypeFlag = deviceTypeOption;


            var name = $('#ExternalSipUserName').val();
            //(!($.isNumeric(name)))
            //{
            //    alert("Ext.Sip User Id should be numeric only.");
            //    return;
            //}

            var pwd = $('#ExternalSipPwd').val();
            var port = $('#ExternalSipPortNum').val();
            var error = "";
            if (name == "") {
                error = "Name ";
            }
            if (port == "") {
                error += "PortNumber ";

            }
            if (pwd == "") {
                error += "Password ";
            } else {
                if (!sipRegex.test(pwd) && error == '') {
                    error += "Password must contain atleast one alphabet and Password must be atleast 4 characters ";
                    $('#ExternallblErrorMsg').text(error);
                    return;
                }
            }


          SipExistanceCheck(name,1);

           if (error == "") {

               if (extsipexistcheck == true) {
                   alert("ExternalSipUsername already Exist and Active..!!");
                   return;
               }
               else
               {
                       sipUserName = name;
                       sipPwd = pwd;
                       externalSipPortNum = port;
                       gatewayId = $("#ExternalSipGateWay  option:selected").val();
                       $('#ExternaldeviceTypeModal').modal('hide');
                       $('#deviceTypeDetailsAttached').text("View");
                       $("#hdnlogin").show();
               }
            } else {
                $('#ExternallblErrorMsg').text(error + "field(s) are mandatory");
                alert(error + "field(s) are mandatory");
                return
            }

        }
    });


    $('#ExternalbtnCancel').click(function () {
        if (agentId != 0) {
            getAgentInformation(agentId);
        } else {
            devtypeFlag = 0
            $("#ddlDeviceType").val(0);
            $('#spnDeviceType').text($("#ddlDeviceType").find('option:selected').text());
        }
    });



    function SipExistanceCheck(SipUname, mode) {
        $.blockUI({
            message: '<img src="/assets/img/Press3_Gif.gif" />',
            css: {
                border: 'none',
                backgroundColor: 'transparent',
            }
        });
        $.ajax({
            type: "POST",
            url: "Handlers/Agents.ashx",
            dataType: "JSON",
            async: false,
            data: {
                type: 13, SipUname: SipUname, AgentId: agentId, Mode: mode
            },
            success: function (res) {
                $.unblockUI();
                if(res.Success=="True")
                {
                    extsipexistcheck = true;  
                }
                else
                {
                    extsipexistcheck= false;
                }
            },
            error:
                function (jqXHR, textStatus, errorThrown) {
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





    $('#deviceTypeModal').on('hidden.bs.modal', function () {
        $("#ddlDeviceType").val(devtypeFlag);
        $('#spnDeviceType').text($("#ddlDeviceType").find('option:selected').text());
      //  alert(devtypeFlag + " " + $("#ddlDeviceType").find('option:selected').text());
        var sipAccount = $("#ddlDeviceType").find('option:selected').val();
        if (sipAccount == 3) {
            $("#hdnlogin").show();
        } else {
            $("#hdnlogin").hide();
        }
      
    })
    $('#ExternaldeviceTypeModal').on('hidden.bs.modal', function () {
        $("#ddlDeviceType").val(devtypeFlag);
        $('#spnDeviceType').text($("#ddlDeviceType").find('option:selected').text());
    })

});



function updateDevicedetails(deviceTypeOption) {

    if (deviceTypeOption == 1) {
        devtypeFlag = deviceTypeOption;
        var name = $('#SoftPhoneUserName').val();
        var pwd = $('#SoftPhonePwd').val();
        var error = "";
        if (name == "") {
            error = "Name ";
        }
        if (pwd == "") {
            error += "Password ";
        } else {
            if (!sipRegex.test(pwd) && error == '') {
                error += "Password should be atleast 4 characters ";
                $('#lblErrorMsg').text(error);
                alert("In Device type " + error);
                return false;
            }
        }

        if (error == "") {
            sipUserName = name;
            sipPwd = pwd;
            gatewayId = $("#SoftPhoneGateWay  option:selected").val();
            $('#deviceTypeModal').modal('hide');
            $('#deviceTypeDetailsAttached').text("View");
            return true;
        } else {
            $('#lblErrorMsg').text(error + "field(s) are mandatory");
            alert("In Device type " + error + "field(s) are mandatory");
            return false;
        }

    }
    if (deviceTypeOption == 3) {
        devtypeFlag = deviceTypeOption;
        var name = $('#ExternalSipUserName').val();
        var pwd = $('#ExternalSipPwd').val();
        var port = $('#ExternalSipPortNum').val();
        var error = "";
        if (name == "") {
            error = "Name ";
        }
        if (port == "") {
            error += "PortNumber ";

        }
        if (pwd == "") {
            error += "Password ";
        } else {
            if (!sipRegex.test(pwd) && error == '') {
                error += "Password should be atleast 4 characters ";
                $('#ExternallblErrorMsg').text(error);
                alert("In Device type " + error);
                return false;
            }
        }

        if (error == "") {
            sipUserName = name;
            sipPwd = pwd;
            externalSipPortNum = port;
            gatewayId = $("#ExternalSipGateWay  option:selected").val();
            $('#ExternaldeviceTypeModal').modal('hide');
            $('#deviceTypeDetailsAttached').text("View");
            return true;
        } else {
            $('#ExternallblErrorMsg').text(error + "field(s) are mandatory");
            alert("In Device type " + error + "field(s) are mandatory");
            return false;
        }

    }


    if (deviceTypeOption == 2) {

        return true;

    }
}


function updateSkills() {
    skillids = "";
    $(".skills").each(function () {
        if ($(this).is(':checked')) {
            skillids += $(this).attr("SkillId") + ",";
        }
    })
}

function uploadProfileImage(agentId, profImage) {
    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "POST",
        url: "Handlers/Agents.ashx",
        dataType: "JSON",
        async: false,
        data: {
            type: 9, ProfileImage: profImage, AgentId: agentId
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                $("#updateProfilePic").hide();
                $("#profileImage").show();
                $("#agentProfilePic").attr("src", profImage);
            }
            else {

            }

        }, error: function (jqXHR, textStatus, errorThrown) {
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

function loadCropImage(image) {
    var i = image;
    $("#profileImage").hide();
    $("#updateProfilePic").show();
    $("#demo-basic").html("");
    basic = $('#demo-basic').croppie({
        viewport: {
            width: 160,
            height: 160,
            type: 'circle'
        },
        boundary: {
            height: 180
        }
        //,
        //enableZoom:false
    });
    basic.croppie('bind', {
        url: i
        //,
        //points: [50, 50, 50, 50],
        //setZoom:1


    });


}
$("input:text").keypress(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        return false;
    }
});
$("input:password").keypress(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        return false;
    }
});
function parseParameters() {
    fullName = $("#txtFullName").val();
    firstName = $("#txtFirstName").val();
    lastName = $("#txtLastName").val();
    mobile = $("#txtMobile").val();
    email = $("#txtAgentEmail").val();
    
    roleId = $("#ddlDesignation").val();
    pstnNumber = $("#txtPstn").val();


    if (type == 0) {
        password = $("#txtAgentPassword").val();
        if (password.length < 8 || password.length > 20) {
            alert("Password should be minimum 8 and maximum 20 characters");
            return false;
        } else if (!passwordRegex.test(password)) {
            alert("Password should be combination of atleast 1 Uppercase, 1 Lowercase and 1 number");
            return false;
        }
    }
    else {
        if ($("#chkReset").is(':checked')) {
            password = $("#txtResetPassword").val();
            if (password == "") {
                alert("Please enter password");
                return false;
            }
            else if (password.length < 8 || password.length > 20) {
                alert("Password should be minimum 8 and maximum 20 characters");
                return false;
            } else if (!passwordRegex.test(password)) {
                alert("Password should be combination of atleast 1 Uppercase, 1 Lowercase and 1 number");
                return false;
            }
        }

    }

    if (mobile.length < 7 || mobile.length > 15)
    {
        alert("Mobile Number should between 7 to 15 characters");
        return false;
    }


    if (email != "") {
        email = email.trim();
    }
    var emailResult = isEmail(email);
    if (!emailResult) {
        alert("Please Enter Valid EmailId");
        return false;
    }
    if (roleId == 0) {
        alert("Please Select Designation");
        return false;
    }
    if (skillids == "") {
        alert("Please Select Skills");
        return false;
    }
    reportingManagers = "";
    $("#ddlReportingManagers option:selected").each(function () {
        reportingManagers += $(this).val() + ",";
    });
    reportingSupervisors = "";
    $("#ddlReportingSupervisors option:selected").each(function () {
        reportingSupervisors += $(this).val() + ",";
    });
    if (roleId == 1) {
        if (reportingManagers == "") {
            alert("Please Select Reporting Managers");
            return false;
        }
        if (reportingSupervisors == "") {
            alert("Please Select Reporting Supervisors");
            return false;
        }
    }
    else if (roleId == 2) {
        reportingSupervisors = "";
        if (reportingManagers == "") {
            alert("Please Select Reporting Managers");
            return false;
        }
    }
    else if (roleId == 3) {
        reportingManagers = "";
        reportingSupervisors = "";
    }


    deviceType = $("#ddlDeviceType").val();
    if (deviceType == 0) {
        alert("Please Select Device Type");
        return false;
    }
    else if (deviceType == 2) {
        //if (pstnNumber.trim() == "") {
        //    alert("Please Enter Pstn Number");
        //    return false;
        //}
    }
    if (deviceType == 3) {
        loginType = $("#ddlLoginType").val();
        if (loginType == 0) {
            alert("Please Select Login Type");
            return false;
        }
    }
    outBoundAccess = $("#ddloutBoundType").val();
    if (outBoundAccess == "" || outBoundAccess == 0) {
        alert("Please Select Out Bound Access");
        return false;
    }
    profileStatus = $("#ddlProfileStatus").val();
    if (profileStatus == 0) {
        alert("Please Select Profile Status");
        return false;
    }
    return true;
}

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
                        skillSet += "<label class='label_round_sm margin-right-5'><input type='checkbox' class='skills' SkillName='" + res.SkillDetails[i].skill + "' SkillId = '" + res.SkillDetails[i].skillId + "' id='skill" + res.SkillDetails[i].skillId + "' /> <span> " + res.SkillDetails[i].skill + "</span></label>"
                    }
                    $("#divSkills").html(skillSet);

                } else {
                    console.log(res.Message);
                }
            } else {
                console.log(res.Message);
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

function AgentsManagement(mode) {

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        
        type: "POST",
        url: "Handlers/Agents.ashx",
        dataType: "JSON",
        async: false,
        data: {
            type: 8, Mode: mode, FullName: fullName, FirstName: firstName, LastName: lastName, Mobile: mobile, Email: email,
            Password: password, Role: roleId, PhoneType: deviceType, ReportingManagers: reportingManagers, ReportingSupervisors: reportingSupervisors,
            Skill: skillids, ProfileStatus: profileStatus, AgentId: agentId, ProfileImage: profileImageData,
            SipUserName: sipUserName, SipUserPassword: sipPwd, gatewayID: gatewayId, PortNumber: externalSipPortNum, LoginType: loginType,
            OutBoundAccessType : outBoundAccess
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (mode == 1) {
                    alert(res.Message);
                    window.location.href = "/ManageSkills.aspx"
                }
                else if (mode == 3) {
                    alert(res.Message);
                    window.location.href = "/ManageSkills.aspx"
                }
            } else {
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
$(document).delegate('.cancel', 'click', function () {
    window.location.href = '/ManageSkills.aspx';
    return false;
});

function GetAgentCreationRelatedData() {
    var rolesData = "<option value='0' >Select</option>";
    var managersData = "";
    var supervisorsData = "";
    var profileStatusData = "";
    var loginType = "<option value='0' >Select</option>";
    var outBoundType = "<option value='0' >Select</option>";
    var communicationTypesData = "<option value='0' >Select</option>";

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
        data: { type: 7 },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.Roles.length > 0) {
                    for (var i = 0; i < res.Roles.length; i++) {
                        rolesData += "<option value = '" + res.Roles[i].Id + "'>" + res.Roles[i].Role + "</option>"
                    }
                }
                else {

                }
                if (res.Managers.length > 0) {
                    for (var j = 0; j < res.Managers.length; j++) {
                        if (res.Managers[j].RoleId == 3) {
                            managersData += "<option id='" + res.Managers[j].Id + "' value = '" + res.Managers[j].Id + "'>" + res.Managers[j].Name + "</option>"
                        }
                        else if (res.Managers[j].RoleId == 2) {
                            supervisorsData += "<option value = '" + res.Managers[j].Id + "'>" + res.Managers[j].Name + "</option>"
                        }
                    }
                }
                else {

                }
                if (res.CommunicationTypes.length > 0) {
                    for (var k = 0; k < res.CommunicationTypes.length; k++) {
                        communicationTypesData += "<option value = '" + res.CommunicationTypes[k].Id + "'>" + res.CommunicationTypes[k].Type + "</option>"
                    }
                }
                else {

                }

                if (res.AgentAccountStatus.length > 0) {
                    for (var l = 0; l < res.AgentAccountStatus.length; l++) {
                        var select = "";
                        if (res.AgentAccountStatus[l].Id == '2')
                            select = "selected='selected'";
                        profileStatusData += "<option value = '" + res.AgentAccountStatus[l].Id + "'" + select + ">" + res.AgentAccountStatus[l].Status + "</option>"
                    }
                }

                if (res.LoginType.length > 0) {
                    for (var r = 0; r < res.LoginType.length; r++) {
                                        
                        loginType += "<option value = '" + res.LoginType[r].Id +  "'>" + res.LoginType[r].LoginType + "</option>"

                    }

                }
                if (res.OutBoundType.length > 0) {
                    for (var y = 0; y < res.OutBoundType.length; y++) {
                        
                        outBoundType += "<option value = '" + res.OutBoundType[y].Id + "'>" + res.OutBoundType[y].AccessType + "</option>"

                    }

                }



                if (res.GatewayNames.length > 0) {
                    for (var i = 0; i < res.GatewayNames.length; i++) {
                        gateways += "<option value = '" + res.GatewayNames[i].Id + "'>" + res.GatewayNames[i].Name + "</option>"
                    }
                }
                else {

                }
            } else {
                alert(res.Message);
            }

            $("#ddlDesignation").html(rolesData);
            $("#ddlReportingManagers").html(managersData);
            $("#ddlReportingSupervisors").html(supervisorsData);
            $("#ddlDeviceType").html(communicationTypesData);
            $("#ddlProfileStatus").html(profileStatusData);
            $('#SoftPhoneGateWay').html(gateways);
            $('#ExternalSipGateWay').html(gateways);
            $('#ddlLoginType').html(loginType);
            $('#ddloutBoundType').html(outBoundType);
            var option = $("#ddlProfileStatus").find('option:selected').text();
            $('#spnProfileStatus').text(option);


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


function validation() {
    var res = true;
    $(".required").each(function () {
       
        if ($(this).val().trim() == "") {
            alert($(this).attr("ControlName") + " is Mandatory");
            res = false;
            return false;
        }
    });
    //if ($('#deviceTypeDetailsAttached').text() == '') {
    //    alert("Enter device type details");
    //    res = false;
    //}
    return res;
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email.trim());
}

function getAgentInformation(agentId) {
    devtypeFlag = 0;
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
        data: {
            type: 8, AgentId: agentId, Mode: 2
        },
        success: function (res) {
            $.unblockUI();
            if (res.Success == "True") {
                if (res.AgentInformation.length > 0) {
                    $("#txtFullName").val(res.AgentInformation[0].Name);
                    $("#txtFirstName").val(res.AgentInformation[0].FirstName);
                    $("#txtLastName").val(res.AgentInformation[0].LastName);
                    $("#txtMobile").val(res.AgentInformation[0].Mobile);
                    $("#txtAgentEmail").val(res.AgentInformation[0].Email);
                    $("#ddlDesignation").val(res.AgentInformation[0].RoleId);
                    $('#spnDesignation').text($("#ddlDesignation").find('option:selected').text());
                    if (res.AgentInformation[0].CommunicationTypeId == "") {
                        $("#ddlDeviceType").val(0);
                        $('#spnDeviceType').text($("#ddlDeviceType").find('option:selected').text());
                    }
                    else {
                        $("#ddlDeviceType").val(res.AgentInformation[0].CommunicationTypeId);
                        $('#spnDeviceType').text($("#ddlDeviceType").find('option:selected').text());
                    }
                    //alert(res.AgentInformation[0].AccessOutBoundId);
                    $("#ddloutBoundType").val(res.AgentInformation[0].AccessOutBoundId);
                    $('#outBoundType').text($("#ddloutBoundType").find('option:selected').text());
                    $("#ddlProfileStatus").val(res.AgentInformation[0].AccountStatusId);
                    $('#spnProfileStatus').text($("#ddlProfileStatus").find('option:selected').text());

                    //if (res.AgentDeviceInformation != null && res.AgentDeviceInformation!=undefined)

                    if (res.hasOwnProperty('AgentDeviceInformation') && res.AgentDeviceInformation.length > 0) {

                        $('#deviceTypeDetailsAttached').text("View");
                        if (res.AgentInformation[0].CommunicationTypeId == 1) {
                            //res.AgentDeviceInformation[0].UserName
                            devtypeFlag = 1;
                            $('#SoftPhoneUserName').val(res.AgentDeviceInformation[0].UserName);
                            $('#SoftPhonePwd').val(res.AgentDeviceInformation[0].Password);
                            $('#SoftPhoneGateWay').val(res.AgentDeviceInformation[0].GateWayId);
                            //$('#SoftPhoneGateWay').text($('#SoftPhoneGateWay').find('option:selected').text());
                        }
                        if (res.AgentInformation[0].CommunicationTypeId == 3) {
                            devtypeFlag = 3;
                            $('#ExternalSipUserName').val(res.AgentDeviceInformation[0].UserName);
                            $('#ExternalSipPortNum').val(res.AgentDeviceInformation[0].Port);
                            $('#ExternalSipGateWay').val(res.AgentDeviceInformation[0].GateWayId);
                            $('#ExternalSipPwd').val(res.AgentDeviceInformation[0].Password);
                            $('#ddlLoginType').val(res.AgentDeviceInformation[0].AgentLoginTypeId);
                            $('#loginTypeId').text($("#ddlLoginType").find('option:selected').text());
                            $("#hdnlogin").show();

                        }
                    }
                    if (res.AgentInformation[0].ProfileImagePath != "") {
                        $("#agentProfilePic").attr("src", res.AgentInformation[0].ProfileImagePath);
                    }
                    else {
                        $("#agentProfilePic").attr("src", "/assets/img/user.jpg");
                    }
                    if (res.AgentInformation[0].RoleId == "2") {
                        $("#divReportingSupervisors").hide();
                    }
                    else if (res.AgentInformation[0].RoleId == "3") {
                        $("#divReportingMangers").hide();
                        $("#divReportingSupervisors").hide();
                    }
                    var skillIds = res.AgentInformation[0].SkillIds.split(",");
                    var skillNames = res.AgentInformation[0].SkillNames.split(",");
                    var reportingManagerids = res.AgentInformation[0].ReportingManagers.split(",");
                    var reportingSupervisorids = res.AgentInformation[0].ReportingSupervisors.split(",");
                    selectedSkills = "";
                    $.each(skillNames, function (index, value) {
                        selectedSkills += "<label class='label-sm label-grey margin-right-5 margin-bottom-5'>" + value + "</label>";
                    });
                    $("#divSelectedSkills").html(selectedSkills);
                    $(".skills").each(function () {
                        if ($.inArray($(this).attr("SkillId"), skillIds) != -1) {
                            $(this).attr("checked", true);
                            $(this).attr("Active", "1");
                        }
                    });
                    $.each(skillIds, function (index, value) {
                        selectedSkills += "<label class='label-sm label-grey margin-right-5 margin-bottom-5'>" + value + "</label>";
                    });
                    $("#ddlReportingManagers option").each(function () {
                        if ($.inArray($(this).val(), reportingManagerids) != -1) {
                            $(this).attr("selected", "selected");
                        }
                    });
                    $("#ddlReportingSupervisors option").each(function () {
                        if ($.inArray($(this).val(), reportingSupervisorids) != -1) {
                            $(this).attr("selected", "selected");
                        }
                    });
                    $("#txtAgentEmail").attr("readonly", "readonly");
                    //$("#txtMobile").attr("readonly", "readonly");

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




$("#deviceTypeDetailsAttached").mouseover(function () {
}).click(function () {

    if (devtypeFlag == 1) {
        deviceTypeOption = devtypeFlag;
        $("#deviceTypeModal").modal("show");
    } else if (devtypeFlag == 3) {
        deviceTypeOption = devtypeFlag;
        $("#ExternaldeviceTypeModal").modal("show");
    }

});






$('.showPwd').change(function () {
    if ($(this).is(":checked")) {
        $('#ExternalSipPwd').attr('type', 'text');
        $('#SoftPhonePwd').attr('type', 'text');
        $('.showHide').text("Hide password");
    }
    else {
        $('#ExternalSipPwd').attr('type', 'password');
        $('#SoftPhonePwd').attr('type', 'password');
        $('.showHide').text("Show password");
    }
});