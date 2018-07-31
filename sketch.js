// Gradient
// source: https://p5js.org/examples/color-linear-gradient.html

// RanSeed for current session
var seed;

// Color settings
var c1, c2;
var r, g, b;

// Moon setting
var moonX, moonY, moonR;
// Star setting
var stars = [],
	numStars;

// Baseground
var basePos;

// Basic building setting
var buildingsStatic = [];
var buildingsMid = [];
var buildingsFore = [];
// Window
var winWidth = 8,
	winHeight = 16,
	win_xdist = winWidth + 5,
	win_ydist = winHeight + 8;
// Building
var buildEdge = 12,
	buildTop = 16,
	buildBot = 20;

// Car
var car, carImg;

function preload() {
	// Car image source: https://www.vecteezy.com/vector-art/140757-carros-icons-vector
	carImg = loadImage('assets/img/car.png');
}

function setup() {
	// Setup default canvas to fill up entire window & black
	createCanvas(window.innerWidth, window.innerHeight-10);
	
	// Set seed for current session
	// seed = random(1000);

	// Generate random color (base)
	r = frandom(20, 70);
	g = frandom(0, 25);
	b = frandom(30, 100);

	// Define low & high
	c1 = color(lowCap(r, 30), lowCap(g, 30), b-30);
	c2 = color(r+frandom(30, 70), g+frandom(10,30), b+frandom(30,70));
	
	// Star setting
	numStars = frandom(5, 30);

	for (let i = 0; i <= numStars; i++)
		stars[i] = new starObj();

	// Moon setting
	moonR = random(50, 150);
	moonX = frandom(moonR+100, width-moonR-100);
	moonY = frandom(moonR+100, 300);

	// Low ground
	basePos = height - 50;

	// building setting
	init_build(buildingsStatic, 1, 0, 0);
	init_build(buildingsMid, 2, 0, 0);
	init_build(buildingsFore, 3, 0, 0);

	// Car setting
	car = new carObj();
}

function draw() {
	// For each loop, background color should be consistent
	bgGrad(c1, c2);
	
	// Star
	for (let i = 0; i <= numStars; i++)
		stars[i].draw();
	// Moon
	moon();

	// Draw buildings
	// Back
	for (let i = 0; i < buildingsStatic.length; i++) {
		buildingsStatic[i].draw();
		if (!buildingsStatic[i].isVisible()) {
			buildingsStatic.splice(i, 1);
		}
	}
	if (buildingsFore[buildingsFore.length-1].spaceAvailable)	// Check is there an empty space to fill in
		append_build(buildingsStatic, 1);

	// Mid
	for (let i = 0; i < buildingsMid.length; i++) {
		buildingsMid[i].draw();
		if (!buildingsMid[i].isVisible()) {
			buildingsMid.splice(i, 1);
		}
	}
	if (buildingsFore[buildingsFore.length-1].spaceAvailable)
		append_build(buildingsMid, 2);
	
	// Fore
	for (let i = 0; i < buildingsFore.length; i++) {
		buildingsFore[i].draw();
		if (!buildingsFore[i].isVisible()) {
			buildingsFore.splice(i, 1);
		}
	}
	if (buildingsFore[buildingsFore.length-1].spaceAvailable)
		append_build(buildingsFore, 3);
	
	// Car
	car.draw();

	// Low ground
	fill(14,12,18);
	rect(0, basePos, width, 50);

	// Check user input
	if (keyIsDown(RIGHT_ARROW))
		car.moving = true;
	else
		car.moving = false;
}

function windowResized() {
	// When window is resized, resize the canvas & pass in the background color
	resizeCanvas(window.innerWidth, window.innerHeight-10);
	bgGrad(c1, c2);
}

// Turn on / off headlight when mouse is clicked
function mouseClicked() {
	car.headlight = !car.headlight;
}

function lowCap(num, sub) {
	let res = num - sub;
	if (res < 0)
		return 0;
	else
		return res;
}

function hiCap(num, add) {
	let res = num + add;
	if (res > 255)
		return 255;
	else
		return res;
}

function frandom(hi, low) {
	return floor(random(hi, low));
}

function bgGrad(top, low) {
	// Generate gradient
	for (let i = 0; i <= height; i++) {
		let amt = map(i, 0, height, 0, 1);
		let c = lerpColor(c1, c2, amt);
		stroke(c);
		line(0, i, width, i);
	}
}

function moon() {
	noStroke();

	// Glow around moon
	fill(hiCap(r, 180), hiCap(r, 180), hiCap(r, 180), 168);
	ellipse(moonX, moonY, moonR+3);
	fill(hiCap(r, 180), hiCap(r, 180), hiCap(r, 180), 48);
	ellipse(moonX, moonY, moonR+15);
	fill(hiCap(r, 180), hiCap(r, 180), hiCap(r, 180), 12);
	ellipse(moonX, moonY, moonR+30);
	fill(hiCap(r, 180), hiCap(r, 180), hiCap(r, 180), 6);
	ellipse(moonX, moonY, moonR+70);
	
	fill(hiCap(r, 180), hiCap(r, 180), hiCap(r, 180));
	ellipse(moonX, moonY, moonR);	// Draw moon
}

var starObj = function() {
	this.pX = random(0, width);
	this.pY = random(0, height-200);
	this.r = random(1, 6);
	this.blinkSin = random(0, PI);
}

starObj.prototype.draw = function() {
	fill(250, 250, 225, map(sin(this.blinkSin), -1, 1, 0, 255));
	ellipse(this.pX, this.pY, this.r);	// Draw star
	this.blinkSin += PI / 90;
}

var winObj = function(x, y, alignNum) {
	this.pX = x;
	this.pY = y;

	this.alignNum = alignNum;
	
	this.lightOn = frandom(0, 3);	// 0: false, else is true
	if (this.lightOn > 0) {
		this.isFlicker = frandom(0, 4);	// 0, 1: doesn't flick, 2: gentle flick, 3: random flick
		if (this.isFlicker == 2) 
			this.flickSin = PI;
		else if (this.isFlicker == 3) 
			this.flickSin = random(0, PI);
	}
}

winObj.prototype.draw = function() {
	if (this.lightOn > 0) {
		if (this.alignNum == 1)
			var opact = 50;
		if (this.alignNum == 2)
			var opact = 120;
		if (this.alignNum == 3)
			var opact = 200;
		if (this.isFlicker == 2) {
			fill(225, 210, 250, map(sin(this.flickSin), -1, 1, lowCap(opact, opact-155), opact));
			this.flickSin += PI / 60;
		}
		else if (this.isFlicker == 3) {
			fill(225, 210, 250, map(sin(this.flickSin), -1, 1, lowCap(opact, opact-55), opact));
			this.flickSin = randomGaussian(this.flickSin, PI/3);
		}
		else
			fill(255, 210, 250, opact);
		rect(this.pX, this.pY, winWidth, winHeight);
	}
}

winObj.prototype.isVisible = function() {
	return this.pX + winWidth * 5 > 0;
}

function init_build(arr, align, xPos, init) {
	let temp = xPos;
	let idx = init;
	while (temp < (width + 512)) {
		arr[idx] = new buildObj(temp, align);
		temp += arr[idx].width;
		if (frandom(0, 100) % 4 == 0)
			temp += frandom(3, 16);
		idx++;
	}
}

function append_build(arr, align) {
	let temp = arr[arr.length-1].pX + arr[arr.length-1].width;
	if (frandom(0, 100) % 2 == 0)
		temp += frandom(3, 16);
	init_build(arr, align, temp, arr.length);
}

// alignNum:
// 1: lowsest ordering. almost static BG.
// 2: midground
// 3: foreground
var buildObj = function(x, alignNum) {
	this.width = buildEdge * 2 + (winWidth + win_xdist) * frandom(3, 11) - win_xdist;
	this.height = buildTop + ceil((winHeight + win_ydist) * frandom(5, 16) / alignNum) + buildBot;
	this.pX = x;
	this.pY = basePos - this.height;

	this.alignNum = alignNum;
	this.windows = [];
	this.createWin();
}

buildObj.prototype.createWin = function() {
	// Set bounds
	let endX = this.pX + this.width - buildEdge;
	let endY = this.pY + this.height - buildBot;

	let tempY = this.pY + buildTop;
	let idx = 0;

	while (tempY < endY) {
		let tempX = this.pX + buildEdge;
		while (tempX < endX) {
			this.windows[idx] = new winObj(tempX, tempY, this.alignNum);
			tempX += winWidth + win_xdist;
			idx++;
		}
		tempY += winHeight + win_ydist;
	}
}

buildObj.prototype.draw = function() {
	if (this.alignNum == 1)
		fill(21+r, 21+g, 25+b);
	if (this.alignNum == 2)
		fill(21+r/2, 21+g/2, 25+b/2);
	if (this.alignNum == 3)
		fill(21, 21, 25);
	rect(this.pX, this.pY, this.width, this.height);
	if (car.moving) {
		if (this.alignNum == 1)
			this.pX -= 0.1;
		if (this.alignNum == 2)
			this.pX --;
		if (this.alignNum == 3)
			this.pX -= 3;
	}

	for (let i = 0; i < this.windows.length; i++) {
		this.windows[i].draw();
		if (car.moving) {
			if (this.alignNum == 1)
				this.windows[i].pX -= 0.1;
			if (this.alignNum == 2)
				this.windows[i].pX--;
			if (this.alignNum == 3)
				this.windows[i].pX -= 3;
			// Only need to check visibility when its moving
			if (!this.windows[i].isVisible())
				this.windows.splice(i, 1);
		}
	}
}

buildObj.prototype.isVisible = function() {
	return this.pX + this.width * 3 > 0;
}

buildObj.prototype.spaceAvailable = function() {
	return this.pX + this.width - 10 < width;
}

var carObj = function() {
	this.pX = 100;
	this.pY = basePos - 31;
	this.ySin = 0;

	this.headlight = true;
	this.moving = false;
}

carObj.prototype.draw = function (x, y) {
	image(carImg, this.pX, this.pY);
	fill(250, 220, 250, 200);
	rect(183, this.pY+16, 2, 3);
	
	// Headlight on
	if (this.headlight) {
		fill(250, 220, 250, 170);
		quad(183, this.pY+16, 192, this.pY+13, 192, this.pY+20, 186, this.pY+19);
		fill(250, 220, 250, 120);
		quad(192, this.pY+13, 205, this.pY+9, 205, this.pY+23, 192, this.pY+20);
		fill(250, 220, 250, 90);
		quad(205, this.pY+9, 220, this.pY+4, 220, this.pY+27, 205, this.pY+23);
		fill(250, 220, 250, 20);
		quad(220, this.pY+4, 270, this.pY-10, 270, this.pY+36, 220, this.pY+27);
	}
	
	if (this.moving) {
		// Shaky shaky
		this.pY = map(sin(this.ySin), -1, 1, basePos - 30, basePos - 32);
		this.ySin += PI/2;
	}
	else {
		fill(250, 20, 20, 200);
		rect(102, this.pY+16, 2, 3);
		this.pY = basePos - 31;
	}
}