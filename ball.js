class ball {
    constructor(x, y, diameter, color) {
        this.pos = createVector(x, y)
        this.dia = diameter;
        this.color = color;
        this.isHead = false;
        this.isTail = false;
    }
    drawcircle() {
        fill(this.color);
        stroke(0);
        strokeWeight(2.5);
        circle(this.pos.x, this.pos.y, this.dia)
    }
}