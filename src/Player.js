class Player {
    constructor(x, y, ballcount, name, color, speed, size) {
        this.startpos = createVector(x, y)
        this.nodecount = ballcount // length of snake
        this.name = name;
        this.color = color
        this.balls = [];
        this.ballsize = 50;
        this.score = 15 * this.nodecount
        this.temppos;
        this.sprint = false;
        this.cansprint = true;
        this.finished = false;
        this.stepcount = 0;
        this.isStarted;
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
        for (let i = 0; i < this.nodecount; i++) {
            this.balls.push(new ball(this.startpos.x, this.startpos.y + i * StepSize, this.size, this.color))
        }
        this.HeadPosition = createVector(this.balls[0].pos.x, this.balls[0].pos.y);
        this.HeadNode = this.balls[0]
        this.HeadNode.color = color("red")
        this.dir = new Vector(1, 0);
        this.angle = (Math.acos(this.dir.y) * 180) / Math.PI;
    }
    draw() {
        for (let i = this.balls.length - 1; i >= 0; i--) {
            this.balls[i].drawcircle();
        }
    }
    move() {
        for (let i = 0; i < this.balls.length; i++) {
            if (i == 0) //Headnode
            {
                this.balls[i].prevpos = this.balls[i].pos
                let newpos = createVector(this.balls[i].prevpos.x + StepSize * this.dir.x, this.balls[i].prevpos.y + StepSize * this.dir.y);
                this.balls[i].pos = p5.Vector.lerp(this.balls[i].pos, newpos, this.speed)
            }
            else {
                this.balls[i].prevpos = this.balls[i].pos
                let newpos = this.balls[i - 1].prevpos;
                this.balls[i].pos = p5.Vector.lerp(this.balls[i].pos, newpos, this.speed)
                if (i == this.balls.length - 1) {
                    this.temppos = this.balls[i].prevpos
                }
            }
        }

        if (this.sprint) { 
            if (this.stepcount % 50 == 0) {

                this.balls.pop()
                this.stepcount = 0;
            }
            else if (this.stepcount % 10 == 0) {
                this.poop(this.balls[this.balls.length - 1], 1)
            }
            this.stepcount++;
        }
    }
    poop(node, number) {
        for (let i = 0; i < number; i++) {
            foods.push(new food(random(node.pos.x - node.dia / 2, node.pos.x + node.dia / 2),
                random(node.pos.y - node.dia / 2, node.pos.y + node.dia / 2), 20,
                color(random(255), random(255), random(255))));
            this.score--
        }
    }
    grow() {
        this.balls.push(new ball(players[0].temppos.x, players[0].temppos.y, players[0].size, players[0].color))
        this.nodecount++
    }
}