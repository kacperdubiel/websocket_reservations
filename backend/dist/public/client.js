const CLASS_PLACE = "place btn btn-success clickable";
const CLASS_TAKEN_PLACE = "place btn btn-secondary disabled";
const CLASS_CLIENT_PLACE = "place btn btn-danger clickable";

let pathArray = location.pathname.split('/');
let roomData = { eventId: pathArray[2], sectorId: pathArray[4] };

const socket = new io();

socket.emit('joinRoom', roomData);

socket.on("connect", () => {
    console.log("Connected! " + socket.id);
    loadPlaces();
});

socket.on("placeTaken", placeId => {
    document.getElementById(placeId).className = CLASS_TAKEN_PLACE;
});

socket.on("placeLeft", placeId => {
    document.getElementById(placeId).className = CLASS_PLACE;
});

document.querySelectorAll('div.place').forEach(item => {
    item.addEventListener('click', event => {
        if(item.className === CLASS_PLACE){
            takePlace(item);
        } else if (item.className === CLASS_CLIENT_PLACE) {
            leavePlace(item);
        }

    })
})

function takePlace(item){
    const clientId = document.getElementById("clientId").value;
    socket.emit('takePlace', item.id, clientId, roomData, (response) => {
        if(response.status === "ok") {
            console.log("Place set!")
            item.className = CLASS_CLIENT_PLACE;
        } else if (response.status === "error") {
            console.log("Error: " + response.message);
        }
    });
}

function leavePlace(item){
    const clientId = document.getElementById("clientId").value;
    socket.emit('leavePlace', item.id, clientId, roomData, (response) => {
        if(response.status === "ok") {
            console.log("Place left!")
            item.className = CLASS_PLACE;
        } else if (response.status === "error") {
            console.log("Error: " + response.message);
        }
    });
}

function loadPlaces() {
    resetPlaces();
    loadTakenPlaces();
    loadClientPlaces();
}

function resetPlaces(){
    document.querySelectorAll('div.place').forEach(item => {
        item.className = CLASS_PLACE;
    });
}

function loadTakenPlaces() {
    socket.emit('getTakenPlaces', roomData, (response) => {
        if(response.status === "ok" && response.payload.length > 0) {
            for(const place of response.payload){
                document.getElementById(place.placeId).className = CLASS_TAKEN_PLACE;
            }
        } else if (response.status === "error") {
            console.log("Error: " + response.message);
        }
    });
}

function loadClientPlaces() {
    const clientId = document.getElementById("clientId").value;
    socket.emit('getClientPlaces', clientId, roomData, (response) => {
        if(response.status === "ok" && response.payload.length > 0) {
            for(const place of response.payload){
                document.getElementById(place.placeId).className = CLASS_CLIENT_PLACE;
            }
        } else if (response.status === "error") {
            console.log("Error: " + response.message);
        }
    });
}