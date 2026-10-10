/*
 *  javascript file for my website
 */

let position = 0;
const images = [
    "images/front2.png",
    "images/left2.png",
    "images/back2.png",
    "images/right2.png",
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