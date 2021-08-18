var element = document.getElementById("p5");
let dims = [window.innerWidth, window.innerHeight]
let pointCount = dims[0] * dims[1] / 5000;
let speedDiff = 5;
let circleRadius = 75;
let cursorRadius = 125;

let points = []

window.addEventListener('resize', function(event) { //Reinitialize everything size dependent on viewport size change
    dims = [window.innerWidth, window.innerHeight];
    pointCount = dims[0] * dims[1] / 8000;
    resizeCanvas(dims[0], dims[1]);
    points = [];
    initPoints();
}, true);

function setup() {
  var canvas = createCanvas(dims[0], dims[1]);
  canvas.style("z-index", "-1");
  canvas.position(0,0);
  canvas.parent("p5");
  stroke(255);
  frameRate(40);
  initPoints(); //Fill points array with random positions
}

function draw() {
  background(7, 7, 50);
  
  //Apply "gravity" and respawn dots
  gravity();
  
  //Draw dots
  for(var x in points){
    stroke(15, 115, 150);
    circle(points[x][0], points[x][1], 3); //Draw dots
  }
  
  //Draw lines to cursor
  strokeWeight(2);
  let distances = getDotDistances([mouseX, mouseY]); //Calculate distance of all dots relative to cursor
  let cursorScalar = 255 / cursorRadius; //Scalar for length dependent color
  for(var x in points) {
    if(distances[x] < cursorRadius) {
      stroke(15, 115, 150, 255 - distances[x] * cursorScalar);
      line(points[x][0], points[x][1], mouseX, mouseY);
    }
  }
  
  //Connect all dots together
  strokeWeight(1);
  let distanceScalar = 255 / circleRadius; //Scalar for length dependent color
  for(var x in points) {
    let dist = getDotDistances(points[x]); //Calculate distance of all dots relative to dot "x"
    for(var y in points) {
      if(dist[y] < circleRadius) {
        stroke(35, 150, 200, 255 - dist[y] * distanceScalar);
        line(points[x][0], points[x][1], points[y][0], points[y][1]); //Draw line from current dot to all other dots within reach
      }
    }
  }
}

//Fill points array with random positions
function initPoints() {
  for(var i = 0; i < pointCount; i++) {
    points.push([cRand(0, dims[0]), cRand(0, dims[1])]);
  }
}

//Move dots down and spawn new ones
//Speed of dots is determined by the modulo of their X position
function gravity() {
  for(var x in points) {
    //Delete point if it reached the bottom of the canvas and spawn new one at the top
    if(points[x][1] >= dims[1]) {
      points.splice(x, 1);
      points.push([cRand(0, dims[0]), 0]);
    }
    else {
      points[x][1] += points[x][0] % speedDiff + 1; //Move dot downwards based on X modulo
    }
  }
}

function getDotDistances(ref) {
  let distances = [];
  for(var x in points) {
    distances[x] = distance(points[x], ref);
  }
  return distances;
}

function distance(c1, c2) {
  let deltaX = abs(c1[0] - c2[0]);
  let deltaY = abs(c1[1] - c2[1]);
  return sqrt(deltaX**2 + deltaY**2);
}


function cRand(min, max) {
    return int(Math.random() * (max - min) + min);
}