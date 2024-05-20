const numOfFloor = 20;
const Eleavtor = 3;
// to know if Eleavtor is available
const Eleavtor1 = false;
const Eleavtor2 = false;
const Eleavtor3 = false;
// var screenHeight = window.innerHeight; // Get the height of the screen
// var divHeight = screenHeight / numOfFloor;

class ElevatorObj {
  constructor(elElementStr, elevatorNum) {
    this.isTaken = false;
    this.currentFloorNum = 1;
    this.elElementStr = elElementStr;
    this.elevatorNum = elevatorNum;
  }

  gotToFloor(floorNumber) {
    this.htmlElement = document.getElementById(this.elElementStr);

    const duration = Math.abs(this.currentFloorNum - floorNumber) * 0.5;
    this.htmlElement.style.position = "relative";
    this.htmlElement.style.transitionDuration = duration + "s";

    
    this.htmlElement.style.bottom = (floorNumber - 1) * 110 + "px";

    this.isTaken = true;

    setTimeout(() => {
      this.isTaken = false;
      this.currentFloorNum = floorNumber;
      //document.getElementById("myAudio");
      const audio = new Audio("ding.mp3");
      audio.play();
    }, duration * 1000 + 2000);
  }
}

const el1 = new ElevatorObj("img1", 1);
const el2 = new ElevatorObj("img2", 2);
const el3 = new ElevatorObj("img3", 3);

createFloors();
createEleavtor();

const sourceElement = document.getElementById("div1");
const targetElement = document.getElementById("mahalit-id");

moveElementToPosition(sourceElement, targetElement);

function createFloors() {
  for (let i = numOfFloor; i >= 1; i--) {
    // Create a new div element
    var div = document.createElement("div");

    // Set unique ID for each div
    div.id = "div" + i;
    // Add some content to the div
    // div.innerHTML = "Div " + i;

    // Add a class to each div
    div.classList.add("floor");
    // div.style.height = divHeight + "px";

    // add button
    var button = document.createElement("button");
    button.innerHTML = i;
    button.classList.add("metal", "linear");

    // Add an event listener to the button
    button.addEventListener("click", function () {
      //   goToFloor(i); // Call a function to handle going to this floor
      const floor = i;

      const arr = [];

      if (!el1.isTaken) {
        arr.push(el1);
      }
      if (!el2.isTaken) {
        arr.push(el2);
      }
      if (!el3.isTaken) {
        arr.push(el3);
      }

      arr.sort(
        (a, b) =>
          Math.abs(a.currentFloorNum - floor) -
          Math.abs(b.currentFloorNum - floor)
      );
      if (arr.length > 0) {
        arr[0].gotToFloor(floor);
      }

      // goToSelectedFloor(i);
    });

    // Append the button to the div representing the floor
    div.appendChild(button);

    // Append the div to the body element
    // document.createElement("body");
    // const body = document.getElementsByTagName("body")[0];
    // console.log(body);
    document.body.appendChild(div);
  }
}

function createEleavtor() {
  var Mahalit = document.createElement("div");
  Mahalit.id = "mahalit-id";
  // Set the flex direction to row
  Mahalit.style.display = "flex";

  document.body.appendChild(Mahalit);

  for (let i = 1; i <= Eleavtor; i++) {
    // Create an image element
    // Create an image element
    var img = document.createElement("img");
    img.id = "img" + i;

    // Set the source (src) attribute to the path of the PNG image
    img.src = "elv.png";
    img.style.maxWidth = "100px"; // Set maximum width
    img.style.height = "auto"; // Maintain aspect ratio

    // var subDiv = document.createElement("Eleavtor" + i);
    // subDiv.className = "Mahalit";
    // subDiv.innerHTML = "Mahalit" + i;
    // subDiv.classList.add("Mahalit-size");

    const element = document.getElementById("div1");
    const height = element.offsetHeight;
    Mahalit.style.bottom = height; // Maintain aspect ratio

    Mahalit.classList.add("position");
    Mahalit.appendChild(img);
  }
}

function moveElementToPosition(sourceElement, targetElement) {
  const sourceRect = sourceElement.getBoundingClientRect();

  targetElement.style.position = "absolute"; // Ensure absolute positioning
  const bottomPage = document.body.offsetHeight - 100;
  targetElement.style.top = bottomPage + "px";
  targetElement.style.left = sourceRect.left + "px";
  targetElement.style.width = sourceRect.width + "px";
  targetElement.style.height = sourceRect.height + "px";
}

// Function to slide the image up
function slideImageUp(image) {
  image.style.bottom = "110px"; // Slide up by 100px
}
