
const canvas = document.getElementById("canvas");

// getContext is used with thte HTML canvas tag,
// it tells the browser how you want to draw on the canvas (2d, webg1 webg12)

const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animation");
const ghostFrames = document.getElementById("ghosts")




let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}




let blockSize = 20;
let fps = 30;
let wallSpaceWidth = blockSize/ 1.5;
let wallOffset = (blockSize - wallSpaceWidth)/2;

let food_offset = blockSize / 4;

let wallColor = "red";
let InnerWallCollor = "black";
let foodColor = "orange";
let score = 0;


let ghostCount = 4;
let ghosts = []
let lives = 3
let foodCount = 0;







let pacman;






let RIGHT = 4;
let LEFT = 2;
let UP = 3;
let DOWN = 1;




let ghostLocation = [
    {x:0,   y:0},
    {x:176, y:0},
    {x:0,   y:121},
    {x:176, y:121}
]





let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

for (let i = 0; i < map.length; i++){
    for (let j = 0; j <  map[0].length; j++){
        if(map[i][j] == 2){
            foodCount++;
        }
    }
}

let randomTargetForghosts = [
    {x: 1*blockSize,                        y: 1 * blockSize},
    {x: 1*blockSize,                        y: (map.length - 2) * blockSize},
    {x: (map[0].length - 2) * blockSize,    y: blockSize},
    {x: (map[0].length - 2) * blockSize,    y: (map.length - 2) * blockSize},
]

let gameLoop = () =>{
    draw();
    update();
    
}

let update = () =>{
    pacman.moveProcess();
    pacman.eat();
    for(let i = 0; i < ghosts.length; i++){
        ghosts[i].moveProcess();
    }

    if(pacman.checkGhostCollision()){
        console.log("touched");
        restartGame()
    }

    if (score >= foodCount){
        drawWin();
        clearInterval(gameInterval)
    }
}

let restartGame = () => {
    createNewPacman();
    createGhosts();
    lives--;

    if(lives == 0){
        gameOver();
    }
};

let gameOver = ()=>{
    
    drawGameOver();
    clearInterval(gameInterval);
}

let drawGameOver= () => {

    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "GAME OVER!",
        150,
        200
    );
    
}

let drawWin= () => {

    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "YOU WIN!",
        150,
        200
    );
    
}


let drawLives = () =>{

    let livesDrawingCoordinateX = blockSize * 7
    let livesDrawingCoordinateY = blockSize * (map.length + 1)

    canvasContext.font = "20px ARIAl";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "LIVES: ",
        livesDrawingCoordinateX,
        livesDrawingCoordinateY
    );

    for (let i = 0 ; i < lives; i++){
        canvasContext.drawImage(
            pacmanFrames,
            2 * blockSize,
            0,
            blockSize,
            blockSize,
            livesDrawingCoordinateX + 70 + ((blockSize*1.3) * i),
            livesDrawingCoordinateY - 17,
            blockSize,
            blockSize
        );
    }

}






let drawFood = () => {

    for (let i = 0; i < map.length; i++){

        for (let j = 0; j < map[0].length; j++){

            if (map[i][j] == 2){
                createRect(
                    j * blockSize + food_offset*1.5, 
                    i * blockSize + food_offset*1.5, 
                    food_offset, 
                    food_offset, 
                    foodColor
                );
            }
        }
    }
}

let drawScore = () => {

    canvasContext.font = "20px ARIAl";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "SCORE: " + score,
        0,
        blockSize * (map.length + 1)
    )
}


let draw = () => {

    // we make the canvas background black
    createRect (0, 0, canvas.width, canvas.height, "black");

    drawWalls();
    drawFood();
    pacman.draw();
    drawScore();
    drawGhosts();
    drawLives();
}

let gameInterval = setInterval(gameLoop, 1000 /fps);

let drawGhosts = () => {
    for (let i = 0; i < ghosts.length ; i++){
        ghosts[i].draw();
    }
}

let drawWalls = () => {
    for (let i = 0; i < map.length; i++){
        for (let j = 0; j <map[0].length ; j++){

            // if it's a wall
            if (map[i][j] == 1){
                createRect(
                    j * blockSize, 
                    i * blockSize, 
                    blockSize, 
                    blockSize, 
                    wallColor
                );
            }


            if (j > 0 && map[i][j-1] == 1 ){
                createRect(
                    j * blockSize , 
                    i * blockSize + wallOffset, 
                    wallSpaceWidth + wallOffset, 
                    wallSpaceWidth, 
                    InnerWallCollor
                );
            }


            if (j < map[0].length -1 && map[i][j+1] == 1 ){
                createRect(
                    j * blockSize + wallOffset, 
                    i * blockSize + wallOffset, 
                    wallSpaceWidth + wallOffset, 
                    wallSpaceWidth, 
                    InnerWallCollor
                );
            }


            if (i > 0 && map[i-1][j] == 1 ){
                createRect(
                    j * blockSize + wallOffset, 
                    i * blockSize, 
                    wallSpaceWidth , 
                    wallSpaceWidth + wallOffset, 
                    InnerWallCollor
                );
            }


            if (i < map.length - 1 && map[i + 1][j] == 1){
                createRect(
                    j * blockSize + wallOffset, 
                    i * blockSize + wallOffset, 
                    wallSpaceWidth , 
                    wallSpaceWidth + wallOffset, 
                    InnerWallCollor
                );
            }
        }
    }
}





let createNewPacman = () => {
    pacman = new Pacman(
        blockSize,
        blockSize,
        blockSize,
        blockSize,
        blockSize/5,
    );
};


let createGhosts = () =>{
    ghosts = []
    for (let i = 0; i < ghostCount; i++){
        let newGhost = new Ghost (
            9*blockSize + (i%2 == 0? 0 :1) * blockSize,
            10*blockSize + (i%2 == 0? 0 :1) * blockSize,
            blockSize,
            blockSize, 
            pacman.speed/2,
            ghostLocation[i % 4].x,
            ghostLocation[i % 4].y,
            124, 
            116, 
            6 + i
        )

        ghosts.push(newGhost);
    }


}


createNewPacman();
gameLoop();
createGhosts();



window.addEventListener("keydown", (event) => {

    let k = event.keyCode;

    if (k == 37 || k == 65){
        // left arrow or a
        pacman.nextDirection = LEFT;
    } else if (k == 38 || k == 87){
        // up arrow or a
        pacman.nextDirection = UP;
    } else if (k == 39 || k == 68){
        // up arrow or a
        pacman.nextDirection = RIGHT;
    } else if (k == 40 || k == 83){
        // up arrow or a
        pacman.nextDirection = DOWN;
    }
})