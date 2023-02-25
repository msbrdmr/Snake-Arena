

class Player {
    constructor(x, y, ballcount, name, color, speed, size) {
        this.startpos = createVector(x, y)
        this.ballcount = ballcount // length of snake
        this.name = name;
        this.color = color
        this.balls = [];
        this.ballsize = 50;
        this.score = 0
        this.temppos;
        this.foodcount = 0;
        this.HeadPosition;
        this.HeadNode;
        this.dir;
        this.size = size
        this.angle;
        this.speed = speed;
        this.defaultspeed = speed;
    }
    init() {
        for (let i = 0; i < this.ballcount; i++) {
            this.balls.push(new ball(this.startpos.x, this.startpos.y - i * StepSize, this.size, this.color));
            if (i == 0) {
                this.balls[i].isTail = true
                this.temppos = createVector(this.startpos.x, this.startpos.y - (i - (this.ballcount - 1)) * StepSize)
            }
            if (i == this.ballcount - 1) {
                this.balls[i].isHead = true;
            };
        }

        let firstball = this.gethead();
        this.HeadPosition = createVector(firstball.pos.x, firstball.pos.y);
        this.HeadNode = new ball(this.HeadPosition.x, this.HeadPosition.y, this.size, color(200, 35, 25))
        this.dir = new Vector(0, -1);
        this.angle = (Math.acos(this.dir.y) * 180) / Math.PI;
    }
    update() {
        this.balls.forEach(each => {

            each.drawcircle();
        })
        this.HeadNode.drawcircle()
    }
    pushStart(tailnode) // will be used when new node is eaten
    {
        this.balls.splice(0, 0, tailnode);//ADD NODE TO 0 INDEX
    }
    pushEnd(HeadNode) {
        if (this.balls.length != 0) {
            this.balls.push(HeadNode);
            this.balls[this.balls.length - 2].isHead = false;
            this.balls[this.balls.length - 1].isHead = true;
            this.balls[this.balls.length - 1].isTail = false;
        }
    }
    gettail(mode) {

        if (mode == 0) {
            if (this.balls.length != 0) return this.balls[0];
            else return null;
        }
        else if (mode == 1) {
            if (this.balls.length != 0) return this.balls[1];
            else return null;
        }
        else return null;
    }
    gethead() {
        if (this.balls.length != 0) return this.balls[this.balls.length - 1];
        else return null;
    }
    movestack() {
        if (this.balls.length != 0) {
            let tempnode = this.balls[0];
            this.balls.splice(0, 1)// removes index 0
            this.balls[0].isTail = true;
            this.pushEnd(tempnode);
        }
    }
    movesnake() {
        let tailnode = this.gettail(0);

        let pos = new Vector(this.HeadPosition.x + StepSize * this.dir.x, this.HeadPosition.y + StepSize * this.dir.y);
        tailnode.pos.x = pos.x;
        tailnode.pos.y = pos.y;

        this.HeadPosition = new Vector(tailnode.pos.x, tailnode.pos.y);

        this.HeadNode.pos.x = this.HeadPosition.x
        this.HeadNode.pos.y = this.HeadPosition.y
        this.movestack();
    }

    eatfood() {
        console.log("eat");
        let newnode = new ball(0, 0, this.size, this.color);
        newnode.isTail = true;
        this.gettail(0).isTail = false;
        this.pushStart(newnode)
        newnode.pos.x = this.temppos.x
        newnode.pos.y = this.temppos.y

        this.ballcount++
    }


    fail() {



    }
}