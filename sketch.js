let canvas;
let worldsize = 1000;
let StepSize = 15;
let speed = 5;
let left = false;
let right = false;
let viewport;
let isStarted;

let foods = []

let WorldSize = 1000;
let foodcount = 50;
let player;

function setup() {
	canvas = createCanvas(worldsize, worldsize).position((windowWidth - width) / 2, (windowHeight - height) / 2);
	let density = displayDensity();
	pixelDensity(density);
	canvas.parent("canvas");
	isStarted = true;
	for (let i = 0; i < foodcount; i++) {
		foods.push(new food(random(-worldsize / 2, worldsize), random(-worldsize / 2, worldsize,), 20, color(random(255), random(255), random(255))));
	}
	player = new Player(0, 0, 5, "player1", "#ffd14e", 6, 50)
	player.init()
	viewport = new Viewport(player.HeadPosition.x, player.HeadPosition.y, player);
}
function draw() {
	// ------------------------ score text are on same position in canvas
	background(150)

	translate(-viewport.pos.x + width / 2, -viewport.pos.y + height / 2)


	// ------------------------ drawing foods in scene
	for (let food of foods) {
		food.drawfood()
	}
	// ------------------------ drawing player on scene F
	player.update();
	setrotation();
	if (frameCount % 3 == 0) {
		let dir_ = new Vector(Math.sin(player.angle), Math.cos(player.angle));
		player.dir = dir_;
	}
	if (isStarted) {
		if (frameCount % player.speed == 0) {
			player.movesnake()
			player.temppos = createVector(player.balls[0].posx, player.balls[0].posy)
		};
		checkFoodCollision()
		checkGrowth()
	}
	// ------------------------ MOVING VIEWPORT
	viewport.update()

	drawcenterIcon()
	drawborders()
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
	let newfood = new food(random(-worldsize / 2, worldsize), random(-worldsize / 2, worldsize), 20, color(random(255), random(255), random(255)))
	foods.push(newfood);
}
function drawcenterIcon() {
	fill(255, 255, 255)
	line(-150, 0, 150, 0)
	line(0, 150, 0, -150)
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
	fill(255, 255, 255)
	strokeWeight(10);

	line(-WorldSize / 2, -WorldSize / 2, WorldSize, -WorldSize / 2)
	line(WorldSize, -WorldSize / 2, WorldSize, WorldSize)
	line(WorldSize, WorldSize, -WorldSize / 2, WorldSize)
	line(-WorldSize / 2, WorldSize, -WorldSize / 2, -WorldSize / 2)
}

function keyPressed() {
	if (keyCode == 32)
		isStarted = !isStarted
}

function checkFoodCollision() {
	for (let food of foods) {
		if (distance(food, player.HeadNode) <= food.dia / 2 + player.HeadNode.dia / 2 + 50) {
			let headpos = createVector(player.HeadNode.posx, player.HeadNode.posy)
			food.pos = p5.Vector.lerp(food.pos, headpos, 0.08)
			if (distance(food, player.HeadNode) <= player.HeadNode.dia - food.dia / 2) {
				player.score++;
				player.foodcount++;
				removefromarray(foods.indexOf(food), foods)
				randomfood();
			}
		}
	}
}
function checkGrowth() {
	if (player.foodcount == 5) {
		player.eatfood();
		player.foodcount = 0;
	}
}

function removefromarray(i, array) {
	array.splice(i, 1)
}
function distance(a, b) {
	return Math.sqrt(((b.posx - a.pos.x) * (b.posx - a.pos.x)) + ((b.posy - a.pos.y) * (b.posy - a.pos.y)))
}