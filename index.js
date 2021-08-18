var element = document.getElementById("p5");
let dims = [window.innerWidth, window.innerHeight]
let pointCount = dims[0] * dims[1] / isMobile() ? 6000 : 3000;
let speedDiff = 5;
let circleRadius = 100;
let cursorRadius = 100;

let points = []

window.addEventListener('resize', function(event) { //Reinitialize everything size dependent on viewport size change
    dims = [window.innerWidth, window.innerHeight];
    pointCount = dims[0] * dims[1] / isMobile() ? 6000 : 3000;
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

function isMobile() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
