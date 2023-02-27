let canvas;
let StepSize = 15;
let speed = 5;
let left = false;
let right = false;
let viewport;
let gridboxsize = 100;
let spawned = false;
let foods = []
let players = []

let WorldSize = 3000;
let foodcount = 300;
let player;

function setup() {
	canvas = createCanvas(900, 900).position((windowWidth - width) / 2, (windowHeight - height) / 2);
	let density = displayDensity();
	pixelDensity(density);
	canvas.parent("canvas");

	for (let i = 0; i < foodcount; i++) {
		foods.push(new food(random(-WorldSize / 2, WorldSize / 2),
			random(-WorldSize / 2, WorldSize / 2), 20,
			color(random(255), random(255), random(255))));
	}
	spawnplayer();
}
function draw() {
	background(0)
	translate(-viewport.pos.x + width / 2, -viewport.pos.y + height / 2)

	drawmap()


	let dir_ = new Vector(Math.sin(player.angle), Math.cos(player.angle));
	if (players.length != 0)
		players[0].dir = dir_;



	for (let food of foods) {
		food.drawfood()
	}
	setdirection();
	for (let player of players) {
		if (player.balls.length >= 10) player.cansprint = true;
		else player.cansprint = false
		if (player.isStarted && !player.finished) {
			if (keyIsDown(UP_ARROW)) {
				if (player.cansprint) {
					player.speed = lerp(player.speed, player.defaultspeed * 2, 0.05)
					player.sprint = true;
				}
				else {
					player.speed = lerp(player.speed, player.defaultspeed, 0.05)
					player.sprint = false;
				}
			}
			else {
				player.speed = lerp(player.speed, player.defaultspeed, 0.05)
				player.sprint = false;
			}

			player.move()
			checkFail()
			checkFoodCollision()
			
			
		}
		
	}
	player.draw();
	viewport.update()
}
function spawnplayer() {
	player = new Player(0, 0, 20, "player1", "#ffd14e", 0.2, 50)
	player.isStarted = true;
	player.finished = false;
	player.init()
	viewport = new Viewport(player.HeadPosition.x, player.HeadPosition.y, player);
	players.push(player)
	spawned = true;
}
function setdirection() {
	for (let player of players) {
		if (keyIsDown(LEFT_ARROW)) {
			player.angle += 0.05;
		}
		else if (keyIsDown(RIGHT_ARROW)) {
			player.angle -= 0.05;
		}
	}
}

function randomfood() {
	let newfood = new food(random(-WorldSize / 2, WorldSize / 2),
		random(-WorldSize / 2, WorldSize / 2), 20,
		color(random(255), random(255), random(255)))
	foods.push(newfood);
}
function windowResized() {
	canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}

function drawmap() {
	fill(255, 52)//color of 
	stroke(127)
	strokeWeight(10);
	rectMode(CENTER)
	rect(0, 0, WorldSize, WorldSize, 30, 30, 30, 30);
	//grid lines settings (color is same black)
	strokeWeight(1)
	for (let i = 1; i < WorldSize / gridboxsize; i++) {

		line((-WorldSize / 2) + gridboxsize * i, -WorldSize / 2,
			(-WorldSize / 2) + gridboxsize * i, WorldSize / 2)
	}
	for (let i = 1; i < WorldSize / gridboxsize; i++) {

		line(-WorldSize / 2, (-WorldSize / 2) + gridboxsize * i,
			WorldSize / 2, (-WorldSize / 2) + gridboxsize * i)
	}
}
function checkFoodCollision() {

	for (let player of players) {
		for (let food of foods) {
			if (distance(food, player.HeadNode) <= food.dia / 2 + player.HeadNode.dia / 2 + 50) {
				let headpos = createVector(player.HeadNode.pos.x, player.HeadNode.pos.y)
				food.pos = p5.Vector.lerp(food.pos, headpos, 0.18)
				if (distance(food, player.HeadNode) <= player.HeadNode.dia / 2 - food.dia / 2) {
					player.score++;
					player.foodcount++;
					if (player.foodcount > 5) {
						player.grow();
						player.foodcount = 0;
					}
					removefromarray(foods.indexOf(food), foods)
					randomfood();
				}
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
function checkFail() {
	for (let player of players) {
		if (player.HeadNode.pos.x - (player.HeadNode.dia / 2) <= (-WorldSize / 2) ||
			player.HeadNode.pos.x + (player.HeadNode.dia / 2) >= (WorldSize / 2) ||
			player.HeadNode.pos.y - (player.HeadNode.dia / 2) <= (-WorldSize / 2) ||
			player.HeadNode.pos.y + (player.HeadNode.dia / 2) >= (WorldSize / 2)) {
			player.isStarted = false;
			let interval = setInterval(doStuff, 200); // 2000 ms = start after 2sec 
			function doStuff() {
				if (player.balls.length == 0) {
					player.finished = true
					let index = players.indexOf(player)
					players.splice(index, 1);
					spawnplayer()
					clearInterval(interval);
				}
				else {
					let currentnode = player.balls[player.balls.length - 1]
					console.log("x: ", currentnode.pos.x, " y: ", currentnode.pos.y);
					for (let i = 0; i < 2; i++) {
						foods.push(new food(random(currentnode.pos.x - (currentnode.dia / 2), currentnode.pos.x + (currentnode.dia / 2)), random(currentnode.pos.y - (currentnode.dia / 2), currentnode.pos.y + (currentnode.dia / 2)), 20, color(random(255), random(255), random(255))));
					}
					player.balls.splice(player.balls.length - 1, 1);
				}
			}
		}
	}
}