"use strict";
var c;
var ctx;
var setup = true;
var placedRobots = false;
var placedPickup = false;
var retrieve = 0;
var distG = 0;
var dist = 0;
var greed = false;
var robot = [];
var g;
var d;
var bothG = false;

$(document).ready(function() {
var c = document.getElementById("roboAlg");
c.width = $("body").width();
c.height = $("body").height();
var ctx = c.getContext("2d");
ctx.moveTo(0,c.height/3);
ctx.lineTo(c.width,c.height/3);
ctx.moveTo(0,2*c.height/3);
ctx.lineTo(c.width,2*c.height/3);
ctx.stroke();

$("#both").click(function(e){
	if (placedRobots && setup){
		$("#bothb").html('Move!');
		$("#startButton").html("Greedy Moved: " + distG);
		$("#distR").html("DoubleCover Moved: " + dist);
		setup = false;
		greed = false;
		bothG = true;	
	}else if(placedPickup){
		reDraw();
		if (typeof g === 'undefined' || typeof d === 'undefined'){
		g = robot.slice();
		d = robot.slice();
		}
		g = drawGreed(g);
		d = drawDoubleCoverage(d);
		$("#startButton").html("Greedy Moved: " + distG);
		$("#distR").html("DoubleCover Moved: " + dist);
		placedPickup = false;
	}
});

$("canvas").click(function(e){
if (setup){
	ctx.beginPath();
	ctx.fillStyle = "#0000FF";
	ctx.arc(e.offsetX,c.height/3,10,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.fillStyle = "#009900";
	ctx.arc(e.offsetX,2*c.height/3,10,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();
	robot.push(e.offsetX);
	placedRobots = true;
}else if(!placedPickup){
	ctx.beginPath();
	ctx.fillStyle = "#FF0000";
	ctx.arc(e.offsetX,c.height/3,7,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(e.offsetX,2*c.height/3,7,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();
	retrieve = e.offsetX;
	placedPickup = true;
}
});

function drawGreed(robots){
	var rob = robots.slice()
	var best = 57;
	var bestdist = Math.abs(rob[0] - retrieve);
	for (var i = 0; i < robots.length; i++) {
		if (Math.abs(rob[i] - retrieve) <= bestdist){
			best = i;
			bestdist = Math.abs(rob[i]-retrieve);
		}
	}
	distG += bestdist
	robots[best] = retrieve
	for (var i = 0; i < robots.length; i++) {
		ctx.beginPath();
		ctx.fillStyle = "#009900";
		ctx.arc(robots[i],2*c.height/3,10,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
	}
	return robots;
}

function drawDoubleCoverage(robots){
	var notBiggest = false;
	var notSmallest = false;
	var biggestLess;
	var smallestMore;
	for (var i = 0; i < robots.length; i++) {
		if (robots[i] <= retrieve){
			if(typeof biggestLess === 'undefined' || robots[i] >= robots[biggestLess]){
				biggestLess = i;
			}
			notSmallest = true;
		}else{
			if(typeof smallestMore === 'undefined' || robots[i] <= robots[smallestMore]){
				smallestMore = i;
			}
			notBiggest = true;
		}
	}
	if(notBiggest && notSmallest){
		if(Math.abs(robots[smallestMore] - retrieve) == Math.abs(robots[biggestLess] - retrieve)){
			robots[smallestMore] = retrieve;
			robots[biggestLess] = retrieve;
			dist = dist + (2 * Math.abs(robots[smallestMore] - retrieve));
		}else if(Math.abs(robots[smallestMore] - retrieve) > Math.abs(robots[biggestLess] - retrieve)){
			robots[smallestMore] = robots[smallestMore] - Math.abs(robots[biggestLess] - retrieve);
			dist = dist + (2 * Math.abs(robots[biggestLess] - retrieve));
			robots[biggestLess] = retrieve;
		}else{
			robots[biggestLess] = robots[biggestLess] + Math.abs(robots[smallestMore] - retrieve);
			dist = dist + (2 * Math.abs(robots[smallestMore] - retrieve));
			robots[smallestMore] = retrieve;
		}
	}else{
		if (notBiggest){
			robots[smallestMore] = retrieve;
			dist = dist - Math.abs(robots[smallestMore] - retrieve);
		}else{
			robots[biggestLess] = retrieve;
			dist = dist - Math.abs(robots[biggestLess] - retrieve);
		}
	}
	for (var i = 0; i < robots.length; i++) {
			ctx.beginPath();
			ctx.fillStyle = "#0000FF";
			ctx.arc(robots[i],c.height/3,10,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
		}
	return robots;
}

function reDraw(){
	ctx.moveTo(0,0);
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.stroke();
	ctx.moveTo(0,c.height/3);
	ctx.lineTo(c.width,c.height/3);
	ctx.moveTo(0,2*c.height/3);
	ctx.lineTo(c.width,2*c.height/3);
	ctx.stroke();
}

$("#both").mousedown(function(e){
	$(this).css('border', '3px inset #666666');
	$(this).css('background-color', '#69E28E');
});

$("#both").mouseup(function(e){
	$(this).css('border', '3px outset #666666');
	$(this).css('background-color', '#75FB9E');
});

});