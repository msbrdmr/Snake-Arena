class ball {
    constructor(posx, posy, diameter, color) {
        this.posx = posx
        this.posy = posy
        this.dia = diameter;
        this.color = color;
        this.isHead = false;
        this.isTail = false;
    }
    drawcircle() {
        fill(this.color);
        stroke(0);
        strokeWeight(2.5);
        circle(this.posx, this.posy, this.dia)
    }
}