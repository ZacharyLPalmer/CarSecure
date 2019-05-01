var port = "37629";
var usessl = true;
var id = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
var username = '';
var password = '';
var message, client;
var connected = false;

$(document).ready(function () {
    setTimeout(function(){
        $('#action').attr('src','media/motion.png');
    }, 30000);
});


function motionAlert() {
    setTimeout(function(){ //trigger motion alert for 30 seconds
        $('#action').attr('src','media/motion.png');
    }, 30000);
}

function moistureAlert() {
    setTimeout(function(){ //trigger moisture alert for 30 seconds
        $('#water').attr('src','media/motion.png');
    }, 30000);
}

function connectMQTT() {
    client = new Paho.MQTT.Client(ip, Number(port), id);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
        userName: username,
        password: password,
        useSSL: usessl,
        onSuccess: onConnect,
        onFailure: onFailure,
        reconnect: true
    });
}


function onConnect() {
    console.log("Connected to server");
    resetUsernamePassword();

    //each key is a datastream which is subscribed
    Object.keys(widgetRepository).forEach(function(datastream,index) {
        client.subscribe(datastream, {
            qos: 0
        });
    });
}



function onMessageArrived(message) {
    try {
        console.log("Recieved Message from server");
        var value = message.payloadString;
        var datastream = message.destinationName;
        console.log("datastream: " + datastream + ", value: " + value);

        var widget = widgetRepository[datastream];
        switch (widget.type) {
            case "moisture":
                moistureAlert();
                break;
            case "movement":
                motionAlert();
                break;
            default:
                console.log("The widget type, " + widget.type + ", for the datastream, " + datastream + ", did not match with the any of the standard widget typed in OnMessageArrived function");
                break;
        }
    } catch (e) {
        console.log("exception in onMessageArrived: " + e);
        return false;
    }
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}