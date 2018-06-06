var global_name, global_password, global_logout = 0;
$(document).ready(function () {
    $('#txtName').focus();
    $('#txtName').keypress(function (e) {
        if (e.which == 0) {
            validateEmail();
        } 
    });
    $('#txtPassword').keypress(function (e) {
        if (e.which == 13) {
            login();
        }
    });
    $('#txtPassword').focus(function () {
        validateEmail();
    });
    $("#btnLogin").click(function () {
        login();
    });
    $("#btnOk").click(function () {
        global_logout = 1;
        login();
    });
    $("#btnOk_").click(function () {
        $("#ModalLoginFail").modal("hide");
    });
});
function validateEmail() {
    global_name = $("#txtName").val();
  
    if (global_name == "") {
        $("#txtName").css("border", "3px solid red");
        $("#txtPassword").css("border", "");
        $("#spanError").text("Enter email").parent().parent().fadeIn(1000);
        return false;
    }
    else if (!allowEmail.test(global_name)) {
        $("#txtName").css("border", "3px solid red");
        $("#txtPassword").css("border", "");
        $("#spanError").text("Enter valid email").parent().parent().fadeIn(1000);
        //alert("Enter valid email");
        return false;
    } else {
        $("#txtName").css("border", "");
        $("#txtPassword").css("border", "");
        $("#spanError").text("").parent().parent().fadeOut("slow");
    }
}

function login() {
    global_name = $("#txtName").val();
    global_name = jQuery.trim(global_name);
    global_password = $("#txtPassword").val();
    if (global_name == "") {
        $("#txtName").css("border", "3px solid red");
        $("#txtPassword").css("border", "");
        $("#spanError").text("Enter email").parent().parent().fadeIn(1000);
        return false;
    }
    else if (!allowEmail.test(global_name)) {
        $("#txtName").css("border", "3px solid red");
        $("#txtPassword").css("border", "");
        $("#spanError").text("Enter valid email").parent().parent().fadeIn(1000);
        //alert("Enter valid email");
        return false;
    } else {
        $("#txtName").css("border", "");
        $("#txtPassword").css("border", "");
        $("#spanError").text("").parent().parent().fadeOut("slow");
    }

    if (global_password == "") {
        $("#txtPassword").css("border", "3px solid red");
        $("#spanError").text("Enter password").parent().parent().fadeIn(1000);
        return false;
    } else if (global_password.length < 8 || global_password.length > 20) {
        $("#txtPassword").css("border", "3px solid red");
        $("#spanError").text("Password should be minimum 8 and maximum 20 characters").parent().parent().fadeIn(1000);
        return false;
    } else if (!passwordRegex.test(global_password)) {
        $("#txtPassword").css("border", "3px solid red");
        $("#spanError").text("Password should be combination of atleast 1 Uppercase, 1 Lowercase and 1 number").parent().parent().fadeIn(1000);
        return false;
    } else {
        $("#txtPassword").css("border", "");
        $("#spanError").text("").parent().parent().fadeOut("slow");
    }
    $("#spanLoader").html("<img src='/assets/img/ajax-loader.gif' />").parent().parent().show();

    $.blockUI({
        message: '<img src="/assets/img/Press3_Gif.gif" />',
        css: {
            border: 'none',
            backgroundColor: 'transparent',
        }
    });
    $.ajax({
        type: "GET",
        url: "Handlers/Login.ashx",
        dataType: "JSON",
        async: false,
        data: { type: 1, name: global_name, password: global_password, isLogout: global_logout },
        success: function (res, textStatus, errorThrown) {
            $.unblockUI();
            if (res.status == 999) {
                if (res.RoleId == 1) { window.location.href = "/Home.aspx"; }
                else if (res.RoleId == 2) { window.location.href = "/SupervisorDashboard.aspx"; }
                else if (res.RoleId == 3) { window.location.href = "/ManagerDashboard.aspx"; }
                else if (res.RoleId == 4) { window.location.href = "/TicketManagement.aspx"; }
                else { window.location.href = "/Login.aspx?message=Session expired"; }
            } else {
                if (res.Success == "True") {
                    if (res.AgentDetails.length > 0) {
                        $("#spanError").text(res.Message).parent().parent().hide();
                        $("#spanSuccess").text(res.Message).parent().parent().show();
                        $("#spanLoader").html("").parent().parent().hide();
                        // Agent
                        if (res.AgentDetails[0].RoleId == 1) {
                            window.location.href = "/AgentHome.aspx";
                        }
                            // Supervisor
                        else if (res.AgentDetails[0].RoleId == 2) {
                            window.location.href = "/SupervisorDashboard.aspx";
                        }
                            // Manager
                        else if (res.AgentDetails[0].RoleId == 3) {
                            window.location.href = "/ManagerDashboard.aspx";
                        }
                        else if (res.AgentDetails[0].RoleId == 4) {
                            window.location.href = "/TicketManagement.aspx";
                        }
                            // No role assigned
                        else {
                            console.log(res.Message);
                        }
                    }
                    else {
                        $("#spanLoader").html("").parent().parent().hide();
                        console.log(res.Message);
                    }
                } else {
                    $("#spanLoader").html("").parent().parent().hide();
                    $("#spanSuccess").text(res.Message).parent().parent().hide();
                    if (res.Message == "Already session exists") {
                        $("#spanLoginTime").text(res.LoginTime);
                        $("#modalLogoutSession").modal("show");
                    } 
                    else if (res.Message.indexOf('You') > -1)   
                    {
                        
                        $("#ModalLoginFail").modal("show");

                    }
                    else
                        {
                        $("#spanError").text(res.Message).parent().parent().fadeIn(1000);
                    }
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            console.log(errorThrown);
            $("#spanLoader").html("").parent().parent().hide();
            if (jqXHR.status == 999) {
                if (jqXHR.RoleId == 1) { window.location.href = "/AgentHome.aspx"; }
                else if (jqXHR.RoleId == 2) { window.location.href = "/SupervisorDashboard.aspx"; }
                else if (jqXHR.RoleId == 3) { window.location.href = "/ManagerDashboard.aspx"; }
                else if (jqXHR.RoleId == 4) { window.location.href = "/TicketManagement.aspx"; }
                else { window.location.href = "/Login.aspx?message=Session expired"; }
            } else {
                console.log(errorThrown);
                $("#divActiveCalls").html("");
                $("#divWaitingCalls").html("");
            }
        }
    });
}