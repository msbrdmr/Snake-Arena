class food {

    constructor(x, y, R, color) {
        this.pos = createVector(x, y);
        this.dia = R
        this.color = color;
    }
    drawfood() {
        fill(this.color);
        noStroke()
        circle(this.pos.x, this.pos.y, this.dia)
    }
}