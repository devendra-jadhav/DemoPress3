var allowAlpha = /^[a-zA-Z\s]+$/;
var allowNumeric = /^[0-9]*$/;
var allowAlphaNumeric = /^[A-Za-z0-9 _.-]+$/;
var allowEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,20}$/;

function numericValidation(e) {
    var regex = new RegExp("^[0-9\b\0]*$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    e.preventDefault();
    return false;
}
function alphanumericValidation(e) {
    var regex = new RegExp("^[A-Za-z0-9\b]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    e.preventDefault();
    return false;
}
function ipAddressValidation(e) {
    var regex = new RegExp("^[0-9\b\0\.]*$");
    //var regex = new RegExp("\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    e.preventDefault();
    return false;
}