class Ghost{
    constructor(x,y,width, height, speed, imageX, imageY, imageWidth, imageHeigth, range) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.heigth = height;
        this.speed = speed;
        this.currentDirection = RIGHT

        
        this.currentFrame = 1;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageWidth = imageWidth;
        this.imageHeigth = imageHeigth;
        this.range = range;
        this.randomTargetIndex = parseInt(
            Math.random() * randomTargetForghosts.length
        );

        // this.target = randomTargetsForGhosts[this.randomTargetIndex];

        setInterval(() => {
            this.changeRandomDirection();
        }, 10000);
    }

    changeRandomDirection(){
        this.randomTargetIndex += 1;
        this.randomTargetIndex = this.randomTargetIndex % 4;

    }


    // move process for the ghosts 
    moveProcess(){

        // if pacman is in range it's the target for our ghost
        if (this.isInRangeOfPacman()){
            this.target = pacman
        }

        // else we pick a random target
        else {
            this.target = randomTargetForghosts[this.randomTargetIndex];
        }

        this.changeDirectionIfPossible();
        this.moveForwards();

        if(this.checkCollision()){
            this.moveBackwards();
            return;
        }

        // this.currentDirection = this.nextDirection
    }


    moveBackwards(){

        switch(this.currentDirection){
            case RIGHT:
                this.x -= this.speed;
                break;
            case LEFT:
                this.x += this.speed;
                break;
            case UP:
                this.y += this.speed;
                break;
            case DOWN:
                this.y -= this.speed;
                break;
        }

    }

    moveForwards(){

        switch(this.currentDirection){
            case RIGHT:
                this.x += this.speed;
                break;
            case LEFT:
                this.x -= this.speed;
                break;
            case UP:
                this.y -= this.speed;
                break;
            case DOWN:
                this.y += this.speed;
                break;
        }

    }

    checkCollision(){

        // chech if the x and y of pacman correspond to a block on the map that's 1
        if(  
            map[this.getMapY()][this.getMapX()] == 1 ||
            map[this.getMapYRightSide()][this.getMapX()] == 1 ||
            map[this.getMapY()][this.getMapXRightSide()] == 1 ||
            map[this.getMapYRightSide()][this.getMapXRightSide()] == 1 
            ){

            return true;
        }

        return false;
    }

    checkGhostCollision(){

    }

    isInRangeOfPacman(){
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());

        if (Math.sqrt(xDistance * xDistance + yDistance * yDistance)  <= this.range){return true;}
        return false;
    }



    changeDirectionIfPossible(){

        let tempDirection = this.currentDirection;

        // console.log("before calculation ", this.currentDirection)

        this.currentDirection = this.calculateNewDirection(
            map,
            parseInt(this.target.x / blockSize),
            parseInt(this.target.y / blockSize)
        )

        // console.log("after calculation ", this.currentDirection)
        // console.log(tempDirection)

        if (typeof this.currentDirection == "undefined"){
            this.currentDirection = tempDirection;
            return;
        }



        this.moveForwards();

        if (this.checkCollision()){
            this.moveBackwards();
            this.currentDirection = tempDirection;
        }
        else{
            this.moveBackwards();
        }

    }

    calculateNewDirection(map, destX, destY){

        let mp = [];
        for (let i= 0; i <map.length ; i++){
            mp[i] = map[i].slice();
        }

        let queue = [{
            x: this.getMapX(),
            y: this.getMapY(),
            moves: []
        },]

        console.log(queue.length)


        while(queue.length > 0){
            let poped = queue.shift();
            if(poped.x == destX && poped.y == destY){
                // console.log(poped.moves[0])
                return poped.moves[0]
            }else{
                mp[poped.y][poped.x] = 1;
                let neighborList = this.addNeighbors(poped, mp)
                for (let i = 0; i < neighborList.length; i++){
                    queue.push(neighborList[i]);
                }

                // console.log(queue)
            }
        }

        // console.log("gets to here")
        return UP; // default
    }


    addNeighbors(poped, mp){
        let queue = []
        let numOfRows = mp.length
        let numOfColumns = mp[0].length

        if(
            poped.x -1 >= 0 &&
            poped.x - 1 < numOfRows &&
            mp[poped.y][poped.x -1] != 1
        ){
            let tempMoves = poped.moves.slice();
            tempMoves.push(LEFT);
            queue.push({x: poped.x -1, y: poped.y, moves: tempMoves });
        }

        if(
            poped.x + 1 >= 0 &&
            poped.x + 1 < numOfRows &&
            mp[poped.y][poped.x + 1] != 1
        ){
            let tempMoves = poped.moves.slice();
            tempMoves.push(RIGHT);
            queue.push({x: poped.x  + 1, y: poped.y, moves: tempMoves });
        }

        if(
            poped.y -1 >= 0 &&
            poped.y - 1 < numOfRows &&
            mp[poped.y - 1][poped.x] != 1
        ){
            let tempMoves = poped.moves.slice();
            tempMoves.push(UP);
            queue.push({x: poped.x, y: poped.y -1, moves: tempMoves });
        }

        if(
            poped.y + 1 >= 0 &&
            poped.y + 1 < numOfRows &&
            mp[poped.y + 1][poped.x] != 1
        ){
            let tempMoves = poped.moves.slice();
            tempMoves.push(DOWN);
            queue.push({x: poped.x, y: poped.y + 1, moves: tempMoves});
        }

        return queue;
    }



    changeAnimation(){
        // we update the frame to the next one or the first
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame+1
        // this.update();
        // this.currentDirection = this.nextDirection;


        // console.log("this is the current direction: " + this.currentDirection)
        // console.log("this is the next direction: " + this.nextDirection)
        // draw();
    }

    update(){
        // console.log("this is the current direction: " + this.currentDirection)
    }

    // drawing Pacman on screen
    draw(){

      

        // the drawImage function allows us to draw on an image or parts of it on a canvas
        canvasContext.drawImage(
            ghostFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeigth,
            this.x,
            this.y,
            this.width,
            this.heigth
        );

        canvasContext.restore();

        canvasContext.beginPath();
        canvasContext.strokeStyle = "red";
        canvasContext.arc(
            this.x + blockSize / 2,
            this.y + blockSize / 2,
            this.range * blockSize,
            0,
            2 * Math.PI
        );
        canvasContext.stroke();
    }



    getMapX(){
        return parseInt(this.x / blockSize);
    }

    getMapY(){
        return parseInt(this.y / blockSize);
    }

    getMapXRightSide(){
        return parseInt( (this.x + 0.999999 * blockSize) / blockSize);
    }

    getMapYRightSide(){
        return parseInt( (this.y + 0.999999 * blockSize) / blockSize);
    }

}