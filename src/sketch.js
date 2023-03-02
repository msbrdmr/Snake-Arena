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

let WorldSize = 5000
	;
let foodcount = 750;
let player;
let input;
let inputval;


function setup() {
	canvas = createCanvas(1500, 880).position((windowWidth - width) / 2, (windowHeight - height) / 2);
	let density = displayDensity();
	pixelDensity(density);
	canvas.parent("canvas");

	for (let i = 0; i < foodcount; i++) {
		foods.push(new food(random(-WorldSize / 2, WorldSize / 2),
			random(-WorldSize / 2, WorldSize / 2), 20,
			color(random(255), random(255), random(255))));
	}
	strokeWeight(1)
	createinputElement();
}
function createinputElement() {
	input = createInput();
	input.position((windowWidth - width) / 2 + 380 + 120, (windowHeight - height) / 2 + 423);
	input.size(430, 30)
	input.input(() => {
		inputval = input.value();
	})
}
function draw() {
	background(15)

	if (players.length != 0) {
		//check if the playeer that we are going to control is us !!
		translate(-viewport.pos.x + width / 2, -viewport.pos.y + height / 2)
		drawmap()
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
			player.draw();
			viewport.update()
		}
	}
	else {
		drawmap()
		drawForm()
		translate(width / 2, height / 2)
	}



}
function drawForm() {
	rectMode(CENTER);
	stroke(0)
	strokeWeight(2)

	fill("#ffffff")
	rect(width / 2 - 150 + 120, height / 2, 500, 50, 30, 30, 30, 30)
	if (mouseX > width / 2 + 150 + 120 - 40 && mouseX < width / 2 + 150 + 120 + 40 && mouseY > height / 2 - 25 && mouseY < height / 2 + 25) {
		fill("#00a755")
		cursor(HAND)
	}

	else {
		fill("#3ae972")
		cursor(ARROW)
	}
	noStroke()
	rect(width / 2 + 150 + 120, height / 2, 80, 50, 30, 30, 30, 30)
	fill("#141417")
	textStyle(BOLD)
	textSize(30)
	strokeWeight(2)
	text("Go", width / 2 + 150 + 100, height / 2 + 10)

}
function spawnplayer(name) {
	player = new Player(0, 0, 15, name, "#ffd14e", 0.2, 50)
	player.isStarted = true;
	player.finished = false;
	player.init()
	viewport = new Viewport(player.HeadPosition.x, player.HeadPosition.y, player);
	players.push(player)
	spawned = true;
}

function mouseClicked() {
	if (players.length == 0) {
		if (mouseX > width / 2 + 150 + 120 - 40 && mouseX < width / 2 + 150 + 120 + 40 && mouseY > height / 2 - 25 && mouseY < height / 2 + 25) {
			console.log(inputval);
			spawnplayer(inputval)
			input.remove()
			cursor(ARROW)
		}
	}
}
function setdirection() {
	let dir_ = new Vector(Math.sin(player.angle), Math.cos(player.angle));
	players[0].dir = dir_

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
	input.position((windowWidth - width) / 2 + 380 + 120, (windowHeight - height) / 2 + 423);


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
	for (let food of foods) {
		food.drawfood()
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
					removefromarray(food, foods)
					randomfood();
				}
			}
		}
	}
}
function removefromarray(element, array) {
	array.splice(array.indexOf(element), 1)
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
			let interval = setInterval(doStuff, 450 / player.nodecount); // 2000 ms = start after 2sec 
			console.log(450 / player.nodecount);
			function doStuff() {
				if (player.balls.length == 0) {
					player.finished = true
					removefromarray(player, players)
					createinputElement()
					clearInterval(interval);
				}
				else {
					let currentnode = player.balls[player.balls.length - 1]
					for (let i = 0; i < 2; i++) {
						foods.push(new food(random(currentnode.pos.x - (currentnode.dia / 2), currentnode.pos.x + (currentnode.dia / 2)), random(currentnode.pos.y - (currentnode.dia / 2), currentnode.pos.y + (currentnode.dia / 2)), 20, color(random(255), random(255), random(255))));
					}
					player.balls.splice(player.balls.length - 1, 1);
				}
			}
		}
	}
}



function removeallplayers() {
	for (let i = 0; i < players.length; i++) {
		players.pop()

	}
}