class Viewport {
    constructor(x, y, target) {
        this.pos = createVector(x, y)
        this.target = target;//target is headnode
    }
    update() {

        let targetpos = createVector(this.target.HeadNode.pos.x, this.target.HeadNode.pos.y);

        // if (targetpos.x < (-WorldSize / 2) + (width / 2) || targetpos.x > (WorldSize / 2) - (width / 2) || targetpos.y < (-WorldSize / 2) + (height / 2) || targetpos.y > (WorldSize / 2) - (height / 2)) {

        //     // this.pos = p5.Vector.lerp(this.pos, targetpos, 0.0)
        //     console.log("LOL");
        // }

        let finalposx = constrain(targetpos.x, (-WorldSize / 2) + (width / 2)-50, (WorldSize / 2) - (width / 2)+50)
        let finalposy = constrain(targetpos.y, (-WorldSize / 2) + (height / 2)-50, (WorldSize / 2) - (height / 2)+50)
        let newtarger = createVector(finalposx, finalposy)
        this.pos = p5.Vector.lerp(this.pos, newtarger, 0.01)

        fill(0, 255, 0)
        ellipse(this.pos.x, this.pos.y, 5)

        textSize(32);
        fill(255, 0, 0);
        stroke(0)
        strokeWeight(5)
        text("Score: " + this.target.score, this.pos.x - width / 2 + 20, this.pos.y - height / 2 + 50);

    }

}