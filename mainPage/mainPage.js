/*
 *  javascript file for my website
 */

let position = 0;
const images = [
  "../images/mainPage/person/front.png",
  "../images/mainPage/person/left.png",
  "../images/mainPage/person/back.png",
  "../images/mainPage/person/right.png",
];

function turnLeft() {
    position = (position + 1) % 4;
    showImage();
    console.log(position);
}

function turnRight() {
    if (position === 0) { 
        position = 3;
    } else {
        position -= 1;
    }
    showImage();
    console.log(position);
}

function showImage() {
    document.getElementById("myImage").src = images[position];
}