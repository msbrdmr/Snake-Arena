let canvas;
let StepSize = 15;
let speed = 5;
let left = false;
let right = false;
let viewport;
let gridboxsize = 100;
let isStarted;

let foods = []

let WorldSize = 2000;
let foodcount = 150;
let player;

function setup() {
	canvas = createCanvas(1000, 1000).position((windowWidth - width) / 2, (windowHeight - height) / 2);
	let density = displayDensity();
	pixelDensity(density);
	canvas.parent("canvas");
	isStarted = true;
	for (let i = 0; i < foodcount; i++) {
		foods.push(new food(random(-WorldSize / 2, WorldSize / 2), random(-WorldSize / 2, WorldSize / 2), 20, color(random(255), random(255), random(255))));
	}
	player = new Player(0, 0, 5, "player1", "#ffd14e", 6, 50)
	player.init()
	viewport = new Viewport(player.HeadPosition.x, player.HeadPosition.y, player);
}
function draw() {
	background(150)

	translate(-viewport.pos.x + width / 2, -viewport.pos.y + height / 2)
	viewport.update()
	drawborders()
	for (let food of foods) {
		food.drawfood()
	}
	player.update();
	console.log(player.foodcount);
	setrotation();
	if (frameCount % 3 == 0) {
		let dir_ = new Vector(Math.sin(player.angle), Math.cos(player.angle));
		player.dir = dir_;
	}
	if (isStarted) {
		if (frameCount % player.speed == 0) {
			player.movesnake()
			player.temppos = createVector(player.balls[0].pos.x, player.balls[0].pos.y)
		};
		checkFoodCollision()
	}
}
function setrotation() {
	if (isStarted) {
		if (keyIsDown(LEFT_ARROW)) {
			player.angle += 0.05;
		}
		else if (keyIsDown(RIGHT_ARROW)) {
			player.angle -= 0.05;
		}
	}
}

function randomfood() {
	let newfood = new food(random(-WorldSize / 2, WorldSize / 2), random(-WorldSize / 2, WorldSize / 2), 20, color(random(255), random(255), random(255)))
	foods.push(newfood);
}
function drawgrids() {

}
function windowResized() {
	canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}

function mousePressed() {
	player.speed = player.defaultspeed / 2;
}
function mouseReleased() {
	player.speed = player.defaultspeed;
}
function drawborders() {
	fill(255, 0)
	strokeWeight(10);

	rectMode(CENTER)
	rect(0, 0, WorldSize, WorldSize, 30, 30, 30, 30);

	strokeWeight(1)
	for (let i = 1; i < WorldSize / gridboxsize; i++) {

		line((-WorldSize / 2) + gridboxsize * i, -WorldSize / 2, (-WorldSize / 2) + gridboxsize * i, WorldSize / 2)
	}
	for (let i = 1; i < WorldSize / gridboxsize; i++) {

		line(-WorldSize / 2, (-WorldSize / 2) + gridboxsize * i, WorldSize / 2, (-WorldSize / 2) + gridboxsize * i)
	}
}

function keyPressed() {
	if (keyCode == 32)
		isStarted = !isStarted
}

function checkFoodCollision() {
	for (let food of foods) {
		if (distance(food, player.HeadNode) <= food.dia / 2 + player.HeadNode.dia / 2 + 50) {
			let headpos = createVector(player.HeadNode.pos.x, player.HeadNode.pos.y)
			food.pos = p5.Vector.lerp(food.pos, headpos, 0.08)
			if (distance(food, player.HeadNode) <= player.HeadNode.dia - food.dia / 2) {
				player.score++;
				player.foodcount++;
				if (player.foodcount > 5) {
					player.eatfood();
					player.foodcount = 0;
				}
				removefromarray(foods.indexOf(food), foods)
				randomfood();
			}
		}
	}
}
function removefromarray(i, array) {
	array.splice(i, 1)
}
function distance(a, b) {
	return Math.sqrt(((b.pos.x - a.pos.x) * (b.pos.x - a.pos.x)) + ((b.pos.y - a.pos.y) * (b.pos.y - a.pos.y)))
}