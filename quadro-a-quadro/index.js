// Board initial schema
const whiteBoard = [
    "W", "W", "W", "W","W",
    "W", "W", "W", "W", "W",
    "W", "W", "W", "W", "W",
    "W", "W", "W", "W", "W",
    "W", "W", "W", "W", "W"
];

const colorfulBoard = [
    "G", "G", "G", "G", "B",
    "B", "B", "B", "Y", "Y",
    "Y", "Y", "R", "R", "R",
    "R", "O", "O", "O", "O",
    "W", "W", "W", "W", "BLK"
];

var myBoard = null, enemyBoard = null, gameAnswer = null;

// canvas properties
const gameMapH = 5, gameMapW = 5;
const answerMapH = 3, answerapW = 3;
const tileW = 80, tileH = 80;

// context variables
var gameCtx = null, anwserCtx = null, enemyCtx = null;

var players = 1;
var span = null;

window.onload = function() {

    // loading initial values
    myBoard = colorfulBoard;
    enemyBoard = whiteBoard;
    gameAnswer = whiteBoard;

    // Load my canvas context
    const canvas = document.getElementById("game");
    gameCtx = canvas.getContext("2d");

    canvas.addEventListener('mousedown', function(e) {
        const clickAt = getCursorPosition(canvas, e)
        handleClick(clickAt)
    });

    requestAnimationFrame(drawGame);

    // load enemy canvas context
    enemyCtx = document.getElementById("enemy").getContext('2d');
    requestAnimationFrame(drawEnemyGame);

    // load answer canvas context
    answerCtx = document.getElementById("gameAnswer").getContext("2d");
    requestAnimationFrame(drawAnswer);

    //span
    span = document.getElementById('showUsername');
}

function drawAnswer() {
    if (answerCtx === null) {
        return;
    }

    for (var y = 0; y < answerMapH; y++) {
        for (var x = 0; x < answerapW; x++) {
            switch (gameAnswer[(y * answerMapH) + x]){
                case "G":
                    answerCtx.fillStyle = "#00FF00";
                    break;
                case "B":
                    answerCtx.fillStyle = "#0000FF";
                    break;
                case "Y":
                    answerCtx.fillStyle = "#FFFF00";
                    break;
                case "R":
                    answerCtx.fillStyle = "#ff0000";
                    break;
                case "O":
                    answerCtx.fillStyle = "#FFA500";
                    break;
                case "W":
                    answerCtx.fillStyle = "#FFFFFF";
                    break;
                default:
                    answerCtx.fillStyle = "#000000";
            }
            answerCtx.beginPath();
            answerCtx.roundRect(x * tileW, y * tileH, tileW, tileH,[10]);
            answerCtx.fill();
            answerCtx.stroke();
            answerCtx.lineWidth = 3
        }
    }

}

function drawGame() {
    if (gameCtx === null) {
        return;
    }

    for (var y = 0; y < gameMapH; y++) {
        for (var x = 0; x < gameMapW; x++) {
            switch (myBoard[(y * gameMapW) + x]){
                case "G":
                    gameCtx.fillStyle = "#00FF00";
                    break;
                case "B":
                    gameCtx.fillStyle = "#0000FF";
                    break;
                case "Y":
                    gameCtx.fillStyle = "#FFFF00";
                    break;
                case "R":
                    gameCtx.fillStyle = "#ff0000";
                    break;
                case "O":
                    gameCtx.fillStyle = "#FFA500";
                    break;
                case "W":
                    gameCtx.fillStyle = "#FFFFFF";
                    break;
                default:
                    gameCtx.fillStyle = "#000000";
            }
            gameCtx.beginPath();
            gameCtx.roundRect(x * tileW, y * tileH, tileW, tileH,[10]);
            gameCtx.fill();
            gameCtx.stroke();
            gameCtx.lineWidth = 3
        }
    }

    requestAnimationFrame(drawGame);
}

function drawEnemyGame() {
    if (enemyCtx === null) {
        return;
    }

    for (var y = 0; y < gameMapH; y++) {
        for (var x = 0; x < gameMapW; x++) {
            switch (enemyBoard[(y * gameMapW) + x]){
                case "G":
                    enemyCtx.fillStyle = "#00FF00";
                    break;
                case "B":
                    enemyCtx.fillStyle = "#0000FF";
                    break;
                case "Y":
                    enemyCtx.fillStyle = "#FFFF00";
                    break;
                case "R":
                    enemyCtx.fillStyle = "#ff0000";
                    break;
                case "O":
                    enemyCtx.fillStyle = "#FFA500";
                    break;
                case "W":
                    enemyCtx.fillStyle = "#FFFFFF";
                    break;
                default:
                    enemyCtx.fillStyle = "#000000";
            }
            enemyCtx.beginPath();
            enemyCtx.roundRect(x * tileW, y * tileH, tileW, tileH,[10]);
            enemyCtx.fill();
            enemyCtx.stroke();
            enemyCtx.lineWidth = 3
        }
    }

    requestAnimationFrame(drawEnemyGame);
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const tileX = Math.floor(x / 80)
    const tileY = Math.floor(y / 80)

    return (tileY * 5) + tileX
}

function handleClick(tile) {
    if (running) {
        socket.emit('server_room:movement', {
            roomId: roomId,
            tile: tile
        })
    }
}

// Socket Connection
const url = 'http://localhost:3000'
const socket = io(url);

var username = null;
var owner = false;
var roomId = null;
var running = false;

function createRoom() {
    socket.emit('server_room:create', {});
    owner = true;
}

function showJoinGameForm() {
    document.getElementById('lobbyDiv').style.display = 'none';
    document.getElementById('joinForm').style.display = 'flex';
}

function joinGame() {
    roomId = document.getElementById('roomId').value;
    socket.emit('server_room:join', {
        roomId: roomId
    });
}

function backToLobby() {
    document.getElementById('lobbyDiv').style.display = 'flex';
    document.getElementById('joinForm').style.display = 'none';
    document.getElementById('gameDiv').style.display = 'none';
    document.getElementById('inviteSpan').style.display = 'none';
}

function copyInvite() {
    navigator.clipboard.writeText(roomId);
    document.getElementById('inviteSpan').style.display = 'inline';
    
}

socket.on('client_error', data => {
    console.log(data);
})

socket.on("my_board", data => {
    myBoard = data;
    requestAnimationFrame(drawGame);
})

socket.on("enemy_board", data => {
    enemyBoard = data;
    requestAnimationFrame(drawEnemyGame);
})

socket.on("start", data => {
    gameAnswer = data.answer
    running = true;
    drawAnswer();
})

socket.on("end", data => {
    running = false;
    if (data.winner === socket.id) {
        document.getElementById('waitDiv').style.display = 'flex'
        document.getElementById('waitDiv').innerHTML = 'Você venceu!'
    } else {
        document.getElementById('waitDiv').style.display = 'flex'
        document.getElementById('waitDiv').innerHTML = 'Você perdeu!'
    }

    showStartButton();
})

function createGame() {
    socket.emit('server_room:create', {username: document.getElementById('username').value})
}

function start() {
    socket.emit('server_room:start', {roomId: roomId});
}

socket.on('client_room', data => {
    roomId = data.roomId;
    document.getElementById('lobbyDiv').style.display = 'none';
    document.getElementById('joinForm').style.display = 'none';
    players = data.players.length > 1;

    showStartButton()

    if (!owner) {
        document.getElementById('waitDiv').style.display = 'flex';
        document.getElementById('waitDiv').innerHTML = 'Esperando o jogo começar...';
    }

    if (players) {
        enemyBoard = colorfulBoard;
        requestAnimationFrame(drawEnemyGame);
    }
});

socket.on('timer-countdown', data => {
    document.getElementById('startDiv').style.display = 'none';
    document.getElementById('waitDiv').style.display = 'none';
    document.getElementById('countdownDiv').style.display = 'flex';
    document.getElementById('countdownDiv').innerHTML = data;

    if (data === 1) {
        document.getElementById('countdownDiv').style.display = 'none';
    }
})

function showStartButton() {
    if (owner) {
        document.getElementById('gameDiv').style.display = 'flex';
    }

    if (owner && players) {
        document.getElementById('gameDiv').style.display = 'none';
        document.getElementById('startDiv').style.display = 'flex';
    }
}