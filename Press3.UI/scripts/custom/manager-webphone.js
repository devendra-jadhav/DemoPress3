var callId = 0;
var callNumber = "";
var currentCall = null;
var glbCallEvent = "";
var glbIsVertoLogin = false;


function Initlogin(login, passwd, socketUrl, hostName) {
    verto = new $.verto({
        login: login + "@" + hostName,
        passwd: passwd,
        socketUrl: socketUrl,
        tag: "webcam",
        ringFile: "sounds/bell_ring2.wav",
        videoParams: {
            "minWidth": "1280",
            "minHeight": "720",
            "minFrameRate": 30
        },
        audioParams: {
            googAutoGainControl: false,
            googNoiseSuppression: false,
            googHighpassFilter: false
        },

    }, callBacks);
}

var callBacks = {
    onDialogState: function (d) {
        currentCall = d;
        if (d.state == $.verto.enum.state.ringing) {
            ringing = true;
            if (glbCallEvent == "Listen Start" || glbCallEvent == "Whisper Start" || glbCallEvent == "Join Start")
            {
                var result = AnswerCall();
            }
        } else {
            ringing = false;
        }
        switch (d.state) {
            case $.verto.enum.state.ringing:
                callId = d.params.caller_id_name;
                callNumber = d.params.caller_id_number;
                break;
            case $.verto.enum.state.trying:
                alert("trying");
                break;
            case $.verto.enum.state.early:
                alert("early");
            case $.verto.enum.state.active:
                break;
            case $.verto.enum.state.hangup:
                isCall = 0;
            case $.verto.enum.state.destroy:
                currentCall = null;
                break;
            case $.verto.enum.state.held:
                break;
            case $.verto.enum.state.recovering:
                break;
            default:
                break;
        }
    },
    onWSLogin: function (v, success) {
        console.log("Login Success");
        glbIsVertoLogin = true;
        currentCall = null;
        changeVertoRegistrationStatus(1)
    },
    onWSClose: function (v, success) {
        glbIsVertoLogin = false;
        changeVertoRegistrationStatus(0)
    },
    onEvent: function (v, e) {
        console.debug("GOT EVENT", e);
    },
};

function AnswerCall() {
    if (currentCall == null) {
        return 0;
    }
    currentCall.answer();
    return 1;
}


