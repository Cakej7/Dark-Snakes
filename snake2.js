// global variables
const scoreElem = document.getElementById('scoreElem')
const start_reset = document.getElementById('start_reset')
const gameEndScreenElem = document.getElementById('gameEndScreen')
const clickMeArrowElem = document.getElementById('clickMeArrow')
const snakeIconElem = document.getElementById('snakeIcon')
const youDiedElem = document.getElementById('youDiedImg')
const startTaunt = document.getElementById('startTaunt')
const board = [];
const gameBoardWidth = 20
const gameBoardHeight = 20;
let xCord;
let yCord;
let snakeDir;
let snakeLength;
let score = 0;
let ghostInterval;
let gameTimer;


//run startGame on button click
start_reset.addEventListener('click', startGame)
// start_reset.addEventListener('click', stopGhostTimer)


//create the board on startup
document.body.onload = function initialize () {
    const game_board = document.getElementById('game_board')

    for (let y=0; y < gameBoardHeight; ++y) {
        let row = [];
        for (let x=0; x < gameBoardWidth; ++x) {
            let eachSquare = {}
            eachSquare.element = document.createElement('div');
            game_board.appendChild(eachSquare.element)
            row.push(eachSquare)
        }
        board.push(row);
    }

    clearBoard()
    startTaunt.style.display = 'block'
    clickMeArrowElem.style.display = 'block'
    startTaunt.innerHTML = 'Click to begin. If you dare...'
}


// reset timers, default snake position, and setup the board
function startGame() {
    stopGameTimer()
    // stopGhostTimer()

    xCord = 0;
    yCord = 9;
    snakeLength = 6;
    snakeDir = 'Right';
    score = 0

    clearBoard()
    randomEnemy();
    gameLoop()
};


// clear the board
function clearBoard () {
    scoreElem.innerHTML = `Soul's Collected: ${score}`
    gameEndScreenElem.style.display = 'none'
    clickMeArrowElem.style.display = 'none'
    snakeIconElem.style.display = 'none'
    youDiedElem.style.display = 'none'
    startTaunt.style.display = 'none'
    
    for (let y = 0; y < gameBoardHeight; ++y) {
        for (let x = 0; x < gameBoardWidth; ++x) {
            board[y][x].snake = 0
            board[y][x].enemy = 0
            board[y][x].ghost = 0
        }
    }
}


//win state
function winState () {
    clearTimeout(gameLoop)
    snakeLength = 0
    gameEndScreenElem.style.display = 'block'
    clickMeArrowElem.style.display = 'none'
    gameEndScreenElem.innerHTML = "You Win!"
    snakeIconElem.style.display = 'block'
    youDiedElem.style.display = 'none'
}

//lose state
function loseState () {
    // tail collision
    if (board[yCord][xCord].snake > 0) {
        snakeLength = 0
        gameEndScreenElem.style.display = 'block'
        clickMeArrowElem.style.display = 'block'
        youDiedElem.style.display = 'block'
        gameEndScreenElem.innerHTML = 'Try, try, and try again.'    
        // stopGhostTimer ()
    }
}


//movement keys
document.onkeydown = function keyPress(event) {
    if ((event.key === 'ArrowUp' || event.key === 'w') && snakeDir !== 'Down') {
        snakeDir = 'Up'
    } else if ((event.key === 'ArrowDown' || event.key === 's') && snakeDir !== 'Up') {
        snakeDir = 'Down'
    } else if ((event.key === 'ArrowLeft' || event.key === 'a') && snakeDir !== 'Right') {
        snakeDir = 'Left'
    } else if ((event.key === 'ArrowRight' || event.key === 'd') && snakeDir !== 'Left') {
        snakeDir = 'Right'
    } else if (event.key === 'Enter') {
        startGame ()
    } 

    event.preventDefault()
};

function movement () {
    //movement
    if (snakeDir === 'Up') {
        yCord--
    } else if (snakeDir === 'Down') {
        yCord++
    } else if (snakeDir === 'Left') {
        xCord--
    } else if (snakeDir === 'Right') {
        xCord++
    }
}

function wallPassThrough () {
    // wall pass through
    if (xCord < 0) {
        xCord = gameBoardWidth-1
    } else if (yCord < 0) {
        yCord = gameBoardHeight-1
    } else if (xCord >= gameBoardWidth) {
        xCord = 0
    } else if (yCord >= gameBoardHeight) {
        yCord = 0
    }
}

function enemyCollision () {
    // enemy collision
    if (board[yCord][xCord].enemy === 1) {
        snakeLength += 2
        console.log(score)
        board[yCord][xCord].enemy = 0
        randomEnemy()
        ghostTimer()
    }
}

function ghostCollision () {
    // ghost collision. keeps the player from going to a snakelength of 0.
    if (board[yCord][xCord].ghost === 1 && snakeLength >= 5) {
        snakeLength -= 1
        score++
        scoreElem.innerHTML = `Soul's Collected: ${score}`
        board[yCord][xCord].ghost = 0
    } else {board[yCord][xCord].ghost = 0}
}

// randomize and place enemies
function randomEnemy () {
    let enemyYcord = Math.floor(Math.random() * gameBoardHeight)
    let enemyXcord = Math.floor(Math.random() * gameBoardWidth)
        board[enemyYcord][enemyXcord].enemy = 1
}


// randomize and place ghost, setting ghost timers
function ghostTimer () {
    setTimeout(function randomGhost () {
        let ghostYcord = Math.floor(Math.random() * gameBoardHeight)
        let ghostXcord = Math.floor(Math.random() * gameBoardWidth)
            board[ghostYcord][ghostXcord].ghost = 1
            // stopGhostTimer ()
            ghostInterval = setTimeout(() => {
                    board[ghostYcord][ghostXcord].ghost = 0
                }, 2500);
    }, 5000)
    stopGhostTimer()
}

//(not working as intended)
function stopGhostTimer () {
    clearTimeout(ghostInterval)
}   

//game loop timer
function gameLoopTimer () {
    gameTimer = setTimeout(gameLoop, 1000/snakeLength)
}

// stop game loop timer
function stopGameTimer () {
    clearTimeout(gameTimer)
}


//main game loop
function gameLoop() {
    movement ()
    wallPassThrough ()
    loseState ()
    enemyCollision ()
    ghostCollision ()

    // Update the board snake position
    board[yCord][xCord].snake = snakeLength;

    
    // assign css classes
    for (let y = 0; y < gameBoardHeight; ++y) {
        for (let x = 0; x < gameBoardWidth; ++x) {
            let squares = board[y][x];

            if (squares.snake > 0) {
                squares.element.className = 'snake'
                squares.snake -= 1
            } 
            else if (squares.enemy === 1 && snakeLength > 0) {
                squares.element.className = 'enemy'
            } 
            else if (squares.ghost === 1 && snakeLength > 0) {
                squares.element.className = 'ghost'
            }
            else {
                squares.element.className = ''
            }
        }
    }


    //run setTimout on game loop
    gameLoopTimer()


    // winner winner
    if (score === 10) {
        winState()
    }
};


//BUGS TO FIX:

// when clicking start/reset, the ghosts will spawn from the timer of the game before. Some issue with clearTimeout.


//FUN FEATURES TO ADD:
// change the game end text to rotate between a few different results. 

// style the start/reset button to be more interesting