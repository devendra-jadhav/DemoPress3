var vertoHandle, callBacks, currentCall, vertoCallBacks;
//$.verto.init({}, initializeVerto);
vertoLogin();

$("#btn-make-call").click(function () { makeCall() });


vertoCallBacks = {
    onWSLogin: onWSLogin,
    onWSClose: onWSClose
};

function onWSLogin(verto, success) {
    console.log('onWSLogin', success);
};

function onWSClose(verto, success) {
    console.log('onWSClose', success);
};


var callBacks = {
    onDialogState:  function(d) {
        switch (d.state.name) {
            case "trying":
                console.log("---------Trying---------");
                break;
            case "answering":
                console.log("---------Answering---------");
                break;
            case "active":
                console.log("---------Active---------");
                break;
            case "hangup":
                console.log("---------Hangup---------");
                console.log("Call ended with cause: " + d.cause);
                break;
            case "destroy":
                console.log("---------Destroy---------");
                // Some kind of client side cleanup...
            break;
        }
    }
};

function vertoLogin() {
    var loginNumber = "", Password = "", ip = "", port = "", url = ""
    $.ajax({
        url: "Handlers/Agents.ashx",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            type: 1
        },
        success: function (res) {
            if (res.Success == "True") {
                $("#spanAgentStatus").html("Ready");
                loginNumber = res.GatewayDetails[0].UserName;
                if (res.GatewayDetails[0].OriginationUrl.indexOf("verto.rtc") >= 0) {
                    password = res.GatewayDetails[0].Password;
                    ip = res.GatewayDetails[0].Ip;
                    port = res.GatewayDetails[0].Port;
                    url = "wss://" + ip + ":8082";
                    initializeVerto(loginNumber, password, url, ip);
                }
                else {
                    glbHttpurl = res.GatewayDetails[0].HttpUrl;
                }
            }
            else {
                alert(res.Message);
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


function initializeVerto(login, passwd, socketUrl, hostName) {
    vertoHandle = new $.verto({
        login: login + "@" + hostName,
        passwd: passwd,
        socketUrl: socketUrl,
        tag: "webcam",
        ringFile: "sounds/bell_ring2.wav",
        audioParams: {
            googAutoGainControl: false,
            googNoiseSuppression: false,
            googHighpassFilter: false

        },
    }, vertoCallBacks);
}

function makeCall() {

    currentCall = vertoHandle.newCall({
        // Extension to dial.
        destination_number: '1010',
        caller_id_name: 'Test Guy',
        caller_id_number: '1010',
        outgoingBandwidth: 'default',
        incomingBandwidth: 'default',
        tag: "webcam",
        useStereo: true,
        dedEnc: false,
        //iceServers: [
        // {
        //     url: 'stun:stun.l.google.com:19302',
        // },
        //],
    }, callBacks);
};
