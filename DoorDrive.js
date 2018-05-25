async = require("async");

var gpio = require('rpi-gpio');
var stdin = process.openStdin();


var fs = require('fs');


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req,res){
    res.sendFile(__dirname + '/web/Garage.html');
})



http.listen(3000, function(){
    console.log("Express listening on 3000");
});

io.on('connection', function(client){
    
    console.log("Endpoint Connected!");
    client.emit('stateUpdate', doorConfig);
    
    client.on('stateRequest', function(data){
        client.emit('stateUpdate', doorConfig);
    });

    client.on('operateDoor', function(data){
        doorToggle(0);
    });

    client.on('disconnect', function(){
        console.log("dc'd!");
    });
});

gpio.setMode(gpio.MODE_BCM);


var doorConfig = {
    "doors": [
      {
        "readPin": 17,
        "writePin": 23,
        "doorName": "Truck",
        "status": 0,
        "lastChange": 0
      },
      {
        "readPin": 27,
        "writePin": 24,
        "doorName": "Car",
        "status": 0,
        "lastChange": 0
      },
      {
        "readPin": 22,
        "writePin":25,
        "doorName": "Extra",
        "status": 0,
        "lastChange": 0
      }
    ]
  };

console.log("Door Config Items: " + doorConfig.doors.length);


async.each(doorConfig.doors, function(door, callback){
        //Set pin details.
        //Write pin for relay
        console.log(door);
        gpio.setup(door.writePin, gpio.DIR_HIGH);
        console.log("Configured pin for write: " + door.writePin);

        //read pin for reed switch
        var readPin = door.readPin;

        gpio.setup(readPin, gpio.DIR_IN, gpio.EDGE_BOTH, function(){
            console.log("Reading current value...");
            door.lastChange = Date.now();
            gpio.read(readPin, function(err, value){
                door.status = value;
                console.log("Configured pin for read: " + readPin);
                console.log("Set up complete for " + door.doorName);
                callback();
            });
        });
}, function(err){
    initComplete();
});

function initComplete(){
    console.log("Init Complete");
    //io.sockets.emit('stateUpdate', doorConfig);


    //Wait 5S and send to client.
    setTimeout(function() {
        //io.sockets.emit('stateUpdate', doorConfig);
    }, 5000)
}




//Wire event.
gpio.on('change', function(channel, value){
    console.log("Calling pin change on " + channel+ " pin.");
    event_pinChanged(channel, value);

});

//Keyboard listener
stdin.addListener("data", function(d){
    var input = d.toString().trim();
    switch(input){
        case "d":
            console.log(JSON.stringify(doorConfig));
            break;
        default:
        console.log("Echo: " + input);
    };
});




function getDoorStatus(){
    console.log(doorConfig.toString());
}

function doorToggle(doorIndex){
    //Set pin to low to activate relay
    //wait half second, set back to high.

    var doorPin = doorConfig.doors[doorIndex].writePin;
    console.log("Toggling " + doorConfig.doors[doorIndex].doorName);
    writePin(doorPin, false);

    setTimeout(function(){
        writePin(doorPin, true);
    },500);
}

function objectHelper(changedPin){
    for(var door in doorConfig.doors){
        if(doorConfig.doors[door].readPin == changedPin){
            return door;
        }
    }

    return -1;
}

function event_pinChanged(channel,value){
    var doorIndex = objectHelper(channel);
    
    if(doorIndex != -1){
        var eventDoor = doorConfig.doors[doorIndex];
        console.log(eventDoor.doorName + " " + value);
        eventDoor.status = value;
        eventDoor.lastChange = Date.now();

        //update client
        io.sockets.emit('stateUpdate', doorConfig);
    
        //Write tester
        //writePin(eventDoor.writePin, !value);

        //Toggle Tester
        //doorToggle(doorIndex);
    }
}


function writePin(pin, value){
    gpio.write(pin, value, function(err){
        if(err) throw err;
        console.log('Wrote to pin ' + pin);
    });

}

function closePins(){
    gpio.destroy(function(){
        console.log('Pins Destroyed');
    });
}