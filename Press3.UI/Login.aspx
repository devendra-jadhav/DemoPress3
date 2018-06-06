<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" ClientIDMode="Static" Inherits="Press3.UI.Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8" />
    <title>Press3 - Login</title>
    <link rel="icon" href="Images/favicon.ico" type="image/ico" />
    <link rel="stylesheet" type="text/css" href="assets/global/plugins/bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="assets/admin/layout/css/custom.css" />
    <link href="css/openSans.css" rel="stylesheet" type="text/css" />
    <link href="assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
        body {
            background: url(assets/img/background.png) no-repeat;
            background-size: cover;
            width: 100%;
        }

        .alert-grey {
            background: #e9e9e9;
        }

        .text-warning {
            color: #da9802;
            font-size: 20px;
        }

        #divError .alert-grey {
            background: #fafbff;
        }

        .userImg {
            margin-top: 50px;
            margin-bottom: 50px;
        }

        .login-left {
            padding: 15px 30px;
        }

        .login_panel input {
            background: #eff3ff;
            font-size: 13px !important;
            border: 1px solid #d6def6;
        }

        #btnLogin {
            position: relative;
            z-index: 9999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col-sm-2"></div>
            <div class="col-sm-8">
                <div class="login_panel">
                    <div class="row">
                        <div class="col-sm-6 login-left">
                            <div class="form-group">
                                <img src="assets/img/Press3_Black_Horizontal_1x.png" alt="logo" height="35" />
                            </div>
                            <div class="form-group userImg">
                                <img src="assets/img/USERIMAGE.png" alt="user" height="150" />
                            </div>
                            <div class="form-group">
                                <h4 class="text-dark-blue text-uppercase bold-6">Welcome</h4>
                                <span class="f_11 text-lite-blue">A simplified software solution that effectively replaces all multi-party call center applications</span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <br />
                            <br />
                            <h4 class="text-dark-blue text-uppercase bold-6">Login</h4>
                            <span class="f_11 text-lite-blue">Don't have an account? Create your account now.</span><br />
                            <div class="form-group margin-top-30">
                                <input type="text" class="form-control" id="txtName" placeholder="Email Id" />
                            </div>
                            <div class="form-group margin-top-30">
                                <input type="password" class="form-control" placeholder="Password" id="txtPassword" maxlength="20" />
                            </div>

                            <div class="form-group margin-top-30 text-center">
                                <button type="button" class="btn log_btn btn_full" id="btnLogin">Login</button>
                            </div>

                            <div class="form-group margin-top-30" id="divError" style="display: none;">
                                <div class="alert alert-grey text-center pad-5">
                                    <span class="text-danger f_13" id="spanError"></span>
                                </div>
                            </div>
                            <div class="form-group margin-top-30" id="divSuccess" style="display: none;">
                                <div class="alert alert-grey text-center pad-5">
                                    <span class="text-success f_13" id="spanSuccess"></span>
                                </div>
                            </div>
                            <div class="form-group margin-top-30" id="divLoader" style="display: none;">
                                <div class="alert alert-grey text-center pad-5">
                                    <span class="text-success f_13" id="spanLoader"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-2"></div>
        </div>



        <div class="modal fade" id="modalLogoutSession" role="dialog">
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">

                    <div class="modal-body">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <h4 class="modal-title bold text-warning text-center"><i class="fa fa-exclamation-circle margin-right-5"></i>Alert</h4>

                        <div style="color: #8c9fa8; padding: 15px; line-height: 22px;" class="text-center">
                            Looks like you are already logged in some where.<br />
                            Login time : <span id="spanLoginTime" class="label label-info"></span>
                        </div>
                        <div class="text-center margin-top-5">
                            <button type="button" id="btnOk" class="btn btn-success" data-dismiss="modal" email="" password="">Take control</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="modal fade" id="ModalLoginFail" role="dialog">
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">

                    <div class="modal-body">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <h4 class="modal-title bold text-warning text-center"><i class="fa fa-exclamation-circle margin-right-5"></i>Alert</h4>

                        <div style="color: #8c9fa8; padding: 15px; line-height: 22px;" class="text-center">
                            Looks like you are already logged in some where<br />
                            And On Active State
                        </div>
                        <div class="text-center margin-top-5">
                            <button type="button" id="btnOk_" class="btn btn-success" data-dismiss="modal">Try With Another Login ID</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>

    <div style="position: absolute; bottom: 0;">
        <img src="assets/img/Waves.png" alt="" class="img-responsive" /></div>
</body>
</html>
<script src="scripts/jquery-3.1.1.min.js" type="text/javascript"></script>
<script type="text/javascript" src="assets/global/plugins/jquery.blockui.min.js"></script>
<script src="scripts/custom/common-validations.js" type="text/javascript"></script>
<script src="assets/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="scripts/custom/login.js" type="text/javascript"></script>

