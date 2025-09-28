class Pacman{
    constructor(x,y,width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.heigth = height;
        this.speed = speed;
        this.currentDirection = RIGHT;
        this.nextDirection =  this.currentDirection;
        this.frameCount = 7;
        
        // this.nextDirection = DOWN
        
        this.currentFrame = 1;

        setInterval(()=>{
            this.changeAnimation();
        }, 100)
    }


    moveProcess(){

        this.changeDirectionIfPossible();
        this.moveForwards();

        if(this.checkCollision()){
            this.moveBackwards();
            return;
        }

        // this.currentDirection = this.nextDirection
    }

    eat(){

        // console.log("eating")

        for (let i = 0; i < map.length; i++){
            for (let j = 0; j < map[0].length; j++){
                if (map[i][j] == 2 && this.getMapX() == j && this.getMapY() == i){
                    
                    // console.log(map[i][j])
                    map[i][j] = 3;
                    // console.log(map[i][j])



                    score++;
                    // console.log(map[i][j])
                }
            }
        }
        // if ( this.x && this.y ){

        // }
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

        // for every ghost
        for (let i = 0; i < ghosts.length; i++){

            let ghost = ghosts[i]

            // if the ghpst and paccman have the same coordinate
            if (ghost.getMapX() == this.getMapX() && ghost.getMapY() == this.getMapY()){
                return true;
            }
        }
        return false;
    }

    changeDirectionIfPossible(){

        if (this.direction == this.nextDirection) return 

        let tempDirection = this.currentDirection;
        this.currentDirection = this.nextDirection;
        this.moveForwards();

        if (this.checkCollision()){
            this.moveBackwards();
            this.currentDirection = tempDirection;
        }
        else{
            this.moveBackwards();
        }


        // console.log("this is the current direction: " + this.currentDirection)
        // console.log("this is the next direction: " + this.nextDirection)
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

        canvasContext.save();

        canvasContext.translate(
            this.x + blockSize /2,
            this.y + blockSize /2
        )

        canvasContext.rotate((this.currentDirection * 90 * Math.PI) / 180);

        canvasContext.translate(
            -this.x - blockSize / 2,
            -this.y - blockSize / 2
        )

        // the drawImage function allows us to draw on an image or parts of it on a canvas
        canvasContext.drawImage(
            pacmanFrames,
            (this.currentFrame - 1) * blockSize,
            0,
            blockSize,
            blockSize,
            this.x,
            this.y,
            this.width,
            this.heigth
        );

        canvasContext.restore();
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