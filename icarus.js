/*
* PROJECT ICARUS
*
* An Easter egg found on onestop.byu.edu
*/

/*
* VARIABLES
*/
//Game Settings
var FPS = 60;

//Canvas Vars
var c = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;

//Controller Vars
var gameLoop;
var difficultyLoop;
var score = 0;
var highScore = 0;
var canvasMinX;
var canvasMinY;
var canvasMaxX;
var canvasMaxY;
var collidable = false;

//Menu Vars
var startButton = {x: centerX-125, y: centerY+200, w: 250, h: 100};
var scoreBox = {x: 5, y: 5, w: 125, h: 50};

//Player Vars
var playerX = centerX;
var playerY = centerY;
var playerR = 8;
var playerC = '#FFE303';

//Power Up Vars
var powerUps = [];
var powerUp;
var powerUpCollected = 0;

//Circle Vars
var startX = Math.floor((Math.random() * (width + width)) + 1);
var startY =0;
var circleX = startX;
var circleY = startY;
var radius = 8;
var dx = -4;
var dy = 2;
var maxCircles = 150;
var circles = [];
var xPos;
var yPos;
var distance;

/*
* Controls
*/
//Mouse Controls
function init_mouse() {
	canvasMinX = jQuery("#canvas").offset().left;
	canvasMaxX = canvasMinX + width;
	canvasMinY = jQuery("#canvas").offset().top;
	canvasMaxY = canvasMinY + height;
}
function onMouseMove(evt) {
	if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
		playerX = evt.pageX - canvasMinX;
	}
	if (evt.pageY > canvasMinY && evt.pageY < canvasMaxY) {
		playerY = evt.pageY - canvasMinY;
	}
}
jQuery(document).mousemove(onMouseMove);

/*
* CANVAS DRAWINGS
*/
//Clear Canvas
function clear(){
	ctx.clearRect(0,0,width,height);
}

//Draw Splash
function drawSplash() {
	//Description Text
	ctx.lineWidth=2;
	ctx.fillStyle="#96B01C";
	ctx.font = "30px sans-serif";
	ctx.fillText("Avoid the red dots.",centerX - 125,centerY);
	//Draw Start Button
	ctx.lineWidth=6;
	ctx.strokeStyle="#96B01C";
	ctx.fillRect(startButton.x, startButton.y, startButton.w, startButton.h);
	//Draw Start Text
	ctx.lineWidth=2;
	ctx.fillStyle="#FFF";
	ctx.font = "30px sans-serif";
	ctx.fillText("START",centerX-50,centerY+260);
	//Draw Legend
		//Draw Invincibility 
		ctx.beginPath();
		ctx.arc(centerX-100, 16, radius, 0, 2* Math.PI, true);
		ctx.closePath();
		ctx.fillStyle = '#FFE303';
		ctx.fill();
		//Draw Invincibility Text
		ctx.lineWidth=2;
		ctx.fillStyle="#96B01C";
		ctx.font = "20px sans-serif";
		ctx.fillText("Invincibility", centerX-90, 23);
		//Draw Shrink
		ctx.beginPath();
		ctx.arc(centerX+30, 16, radius, 0, 2* Math.PI, true);
		ctx.closePath();
		ctx.fillStyle = '#132054';
		ctx.fill();
		//Draw Shrink Text
		ctx.lineWidth=2;
		ctx.fillStyle="#96B01C";
		ctx.font = "20px sans-serif";
		ctx.fillText("Shrink", centerX+40, 23);
}

//Draw Hud 
function drawHud() {
	//Draw Score
	ctx.lineWidth=2;
	ctx.fillStyle="#545643";
	ctx.font = "30px sans-serif";
	ctx.fillText("Score: " + score, scoreBox.x + 5, scoreBox.y+ 20);
	//Draw HIGH Score
	ctx.lineWidth=2;
	ctx.fillStyle="#545643";
	ctx.font = "30px sans-serif";
	ctx.fillText("High Score: " + highScore, scoreBox.x + width - scoreBox.w*2.5, scoreBox.y+ 20);
}

//Draw Replay Button
function drawReplay() {
		//Draw Start Text
	ctx.lineWidth=2;
	ctx.fillStyle="#FFF";
	ctx.font = "30px sans-serif";
	ctx.fillText("Restart",centerX-50,centerY+260);
	ctx.globalCompositeOperation='destination-over';
	//Draw Start Button
	ctx.fillStyle="#CF3601";
	ctx.lineWidth=6;
	ctx.strokeStyle="#96B01C";
	ctx.fillRect(startButton.x, startButton.y, startButton.w, startButton.h);
	

}

//Start Game
canvas.addEventListener('click', startGame, false);
function startGame(e) {
	if (playerX>= startButton.x && playerX <= startButton.x + startButton.w && playerY >= startButton.y && playerY <= startButton.y + startButton.h) {
		go = true;
		//Starts the game 
		if (go === true) {
			score = 0;
			startButton = {}; //Clears click-able region 
			jQuery('#canvas').css('cursor', 'none');
			difficulty();
			abilityController();
			gameLoop = setInterval(function(){draw();}, 1000/FPS);
			setTimeout(function(){collidable=true;playerC = '#87BFFA';}, 1000);
		} 
	}
}

//Game Over
function gameover() {
	jQuery('#canvas').css('cursor', 'initial');
	clearInterval(gameLoop);
	clearInterval(difficultyLoop);
	clearInterval(abilityLoop);
	dx = -4;
	dy = 2;
	collidable = false;
	playerC = '#FFE303';
	startButton = {x: centerX-125, y: centerY+200, w: 250, h: 100};
	drawReplay();
}

//Create  Player
function player(x, y, r, c) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2* Math.PI, true);
	ctx.closePath();
	ctx.fillStyle = c;
	ctx.fill();
}

//Create a Circle
function drawCircle(x, y, r) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2* Math.PI, true);
	ctx.closePath();
	ctx.fillStyle = '#CF3601';
	ctx.fill();
}

//Create all circles
function init_circles(){
	for (i=0; i < maxCircles; i++) {
		var circle = {};
		circle.x = Math.floor((Math.random() * (width + width)) + 1);
		circle.y = Math.floor((Math.random() * (height * 1)) +1);
		circle.r = radius;
		circles.push(circle);
	}
}

//Draw PowerUps
function drawPowerUp(x, y, c) {
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, 2* Math.PI, true);
	ctx.closePath();
	ctx.fillStyle = c;
	ctx.fill();
}

/*
* POWER UPS
*/
//Create a PowerUp
function createPowerUp(a, c){
	var powerUp = {};
	powerUp.a = a;
	powerUp.c = c;
	powerUp.x = Math.floor((Math.random() * (width + width)) + 1);
	powerUp.y = Math.floor((Math.random() * (height * 1)) +1);
	powerUps.push(powerUp);
}

//Ability Controller
function abilityController(){
	abilityLoop = setInterval(function(){
		var a = Math.floor((Math.random() * 2) + 1);
		switch(a) {
			case 1:
				createPowerUp(1, '#FFE303');
				return;
			case 2:
				console.log("Bubble created!")
				createPowerUp(2, '#132054');
				return;
		}
	}, 5000);
}	
//Ability Checker
function abilityChecker(){
	switch(powerUpCollected) {
		case 1:
			invincible();
			return;
		case 2:
			bubble();
			return;
	}
}

//Invincibility Controller
function invincible() {
	if (powerUpCollected = 1){
		//apply bonus
		collidable = false;
		playerC = '#FFE303';
		//reset bonus after 5s
		setTimeout(function () {
			powerUpCollected = 0;
			collidable = true;
			playerC = '#87BFFA';
		}, 5000);
	} 
}

function bubble() {
	if (powerUpCollected = 2){
		//apply bonus
		playerC = '#132054';
		radius = 3;
		//reset bonus after 5s
		setTimeout(function () {
			powerUpCollected = 0;
			playerC = '#87BFFA';
			radius = 8;
		}, 5000);
	} 
}

//Checks for powerUp collection
function collisionsPowerUp(circlex, circley) {
	if (collidable == true) {
		if (circlex + radius + playerR > playerX && circlex < playerX + radius + playerR && circley + radius + playerR > playerY && circley < playerY + radius + playerR) {
			distance = Math.sqrt(((circlex - playerX) * (circlex - playerX)) + ((circley - playerY) * (circley - playerY)));
			if (distance < radius + playerR){
				collisionPointX = ((circlex * radius) + (playerX * radius)) / (radius + radius);
				collisionPointY = ((circley * radius) + (playerY * radius)) / (radius + radius);
				return true;
			}
		}
	}
}

/*
* GAME LOGIC
*/
//Make the balls faster after time
function difficulty() {
	difficultyLoop = setInterval(function(){
		dx -= 1;
		dy += .5;
	}, 15000);
}

//Collisions with walls and balls
function collisions(circlex, circley) {
	if (collidable == true) {
		if (circlex + radius + radius > playerX && circlex < playerX + radius + radius && circley + radius + radius > playerY && circley < playerY + radius + radius) {
			distance = Math.sqrt(((circlex - playerX) * (circlex - playerX)) + ((circley - playerY) * (circley - playerY)));
			if (distance < radius + radius){
				collisionPointX = ((circlex * radius) + (playerX * radius)) / (radius + radius);
				collisionPointY = ((circley * radius) + (playerY * radius)) / (radius + radius);
				gameover();
			}
		}
		if (playerX + radius > width || playerX - radius < 0 || playerY + radius > height || playerY - radius < 0){
			gameover();
		}
	}
}

//Draw a circle
function draw() {
	clear();//Clear last drawing
	drawHud();//Draw Hud over everything else
	player(playerX, playerY, playerR, playerC);//Draw Player
	//Draw Circles
	for (var ind in circles) {
		circle = circles[ind];
		//Change position of circle
		circle.x += dx;
		circle.y += dy;
		drawCircle(circle.x, circle.y, radius);
		//Randomly Reposition Circles
		if (circle.x + dx < 0) {
			circle.x = Math.floor((Math.random() * (width + width)) + 1);
			circle.y = Math.floor((Math.random() * (height * -1)) +1);
			score += 10;
		}
		if (circle.y + dy > height){
			circle.x = Math.floor((Math.random() * (width + width)) + 1);
			circle.y = Math.floor((Math.random() * (height * -1)) +1);
			score += 10;
		}
		collisions(circle.x, circle.y);
	}	
	for (var ind in powerUps) {
		powerUp = powerUps[ind];
		//Change position of circle
		powerUp.x += dx;
		powerUp.y += dy;
		drawPowerUp(powerUp.x, powerUp.y, powerUp.c);
		//Remove as they leave canvas
		if (powerUp.x + dx < 0) {
			powerUps.splice(ind,1);
		}
		if (powerUp.y + dy > height){
			powerUps.splice(ind,1);
		}
		//Checks for pick up
		if (collisionsPowerUp(powerUp.x, powerUp.y)){
			powerUps.splice(ind,1);
			powerUpCollected = powerUp.a;
			abilityChecker();
		}
	}
	
		
	//Live Update Highscore
	if (score > highScore) {
		highScore = score;
	}
}

/*
* GAME LOOP
*/
function init() {
	init_mouse();
	init_circles();
	drawSplash();
	console.log("initialized")
}

init(); //Initialize Game

