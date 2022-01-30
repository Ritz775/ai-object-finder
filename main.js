status = "";

objects = [];

object_name=""

function setup() {
  canvas = createCanvas(380, 380);
  canvas.center();
  video = createCapture(VIDEO);
  video.size(380, 380);
  video.hide();
}

function modelLoaded() {
  console.log("modelLoaded");
  status = true;
}

function start() {
  object_detector = ml5.objectDetector("Cocossd", modelLoaded);
  document.getElementById("status").innerHTML = "Status: Detecting Objects";
  object_name = document.getElementById("object_name").value; 
}

function gotResult(error, results) {
  if (error) {
    console.log(error);
  }
  console.log(results);
  objects = results;
}

function draw() {
  image(video, 0, 0, 380, 380);
  if (status != "") {
    object_detector.detect(video, gotResult);
    for (let i = 0; i < objects.length; i++) {
      document.getElementById("status").innerHTML = "Status: Object Detected";
      fill("red");
      percent = floor(100 * objects[i].confidence);
      text(
        objects[i].label + " " + percent + " %",
        objects[i].x + 15,
        objects[i].y + 15
      );
      noFill();
      stroke("red");
      rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
      if (objects[i].label == object_name) {
        object_detector.detect(gotResult);
        document.getElementById("object_status").innerHTML = object_name + " found"; 
        synth = window.speechSynthesis;
        utterThis = new SpeechSynthesisUtterance(object_name + " found");
        synth.speak(utterThis)
      } else {
        document.getElementById("object_status").innerHTML =
          object_name + " not found";
      }
    }
  }
}
