// movement:
// 0: up
// 1: right
// 2: down
// 3: left

/*
 *	variables
 */
const urlParams = new URLSearchParams(window.location.search);
const timeInterval = parseInt(urlParams.get("time"));

const fieldsize = 14;
let field = [];
let posApple = { x: 8, y: 8 };
let posSnake = [
  { x: 0, y: 2 },
  { x: 0, y: 1 },
  { x: 0, y: 0 },
];
let moveDir = 1;

let lastXSnake = 0;
let lastYSnake = 1;
let currXSnake = 0;
let currYSnake = 2;

const board = document.getElementById("board");

const imagesGame = {
  apple: "../../images/minigames/snake/apple.png",
  empty: "../../images/minigames/snake/empty.png",
};
const imagesBody = {
  up_right: "../../images/minigames/snake/up_right.png",
  up_left: "../../images/minigames/snake/up_left.png",
  up_down: "../../images/minigames/snake/up_down.png",
  left_right: "../../images/minigames/snake/left_right.png",
  left_down: "../../images/minigames/snake/left_down.png",
  right_down: "../../images/minigames/snake/right_down.png",
};
const imagesHead = {
  up: "../../images/minigames/snake/head_up.png",
  down: "../../images/minigames/snake/head_down.png",
  left: "../../images/minigames/snake/head_left.png",
  right: "../../images/minigames/snake/head_right.png",
};
const imagesButt = {
  up: "../../images/minigames/snake/butt_up.png",
  down: "../../images/minigames/snake/butt_down.png",
  left: "../../images/minigames/snake/butt_left.png",
  right: "../../images/minigames/snake/butt_right.png",
};

/*
 *	prepare game
 */
prepareGame();
createBoard();
placeApple();
render();
setTimeout(moveSnake, timeInterval);

function prepareGame() {
    for (let i = 0; i < fieldsize; i++) {
        field.push([]);
    for (let j = 0; j < fieldsize; j++) {
        field[i].push(0);
        }
    }
}

/*
 *	handle buttons
 */
function upClicked() {
    moveDir = 0;
}
function rightClicked() {
    moveDir = 1;
}
function downClicked() {
    moveDir = 2;
}
function leftClicked() {
    moveDir = 3;
}

// Handle keyboard inputs
window.addEventListener("keydown", (event) => {
    console.log("Key pressed:", event.key);
    switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
            event.preventDefault();
            if (moveDir !== 2) moveDir = 0; 
            break;
        case "ArrowRight":
        case "d":
        case "D":
            event.preventDefault();
            if (moveDir !== 3) moveDir = 1;
            break;
        case "ArrowDown":
        case "s":
        case "S":
            event.preventDefault();
            if (moveDir !== 0) moveDir = 2;
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            event.preventDefault();
            if (moveDir !== 1) moveDir = 3;
            break;
    }
});

function createBoard() {
  board.style.gridTemplateColumns = `repeat(${fieldsize}, 50px)`;

  for (let x = 0; x < fieldsize; x++) {
    field[x] = []; // Create the row
    for (let y = 0; y < fieldsize; y++) {
      const img = document.createElement("img");

        img.src = imagesGame.empty;
        img.alt = `tile-${x}-${y}`;
        img.style.width = "50px";
        img.style.height = "50px";

      field[x][y] = img;
      board.appendChild(img);
    }
  }
}

function moveSnake() {
    lastXSnake = currXSnake;
    lastYSnake = currYSnake;

    switch (moveDir) {
        case 0: // up
            currXSnake -= 1;
            break;
        case 1: // right
            currYSnake += 1;
            break;
        case 2: // down
            currXSnake += 1;
            break;
        case 3: // left
            currYSnake -= 1;
            break;
        default:
            break;
    }
    if (checkOutOfBounds(currXSnake, currYSnake)) {
        gameLost();
    }
    if (checkCollision(currXSnake, currYSnake)) {
        gameLost();
    }

    const newHead = { x: currXSnake, y: currYSnake };
    posSnake.unshift(newHead);

    // move butt
    if (!checkAteApple(currXSnake, currYSnake)) {
        posSnake.pop();
    } else {
        placeApple();
    }

    render();
    setTimeout(moveSnake, timeInterval);
}

function render() {
    // 1. Clear the entire board back to empty tiles first
    for (let x = 0; x < fieldsize; x++) {
        for (let y = 0; y < fieldsize; y++) {
            field[x][y].src = imagesGame.empty;
        }
    }

    // 2. Draw the Apple
    field[posApple.x][posApple.y].src = imagesGame.apple;

    posSnake.forEach((segment, index) => {
        if (
            segment.x < 0 ||
            segment.x >= fieldsize ||
            segment.y < 0 ||
            segment.y >= fieldsize
        ) {return;}

        const imgElement = field[segment.x][segment.y];

        // --- HEAD ---
        if (index === 0) {
            switch (moveDir) {
            case 0:
                imgElement.src = imagesHead.down;
                break;
            case 1:
                imgElement.src = imagesHead.left;
                break;
            case 2:
                imgElement.src = imagesHead.up;
                break;
            case 3:
                imgElement.src = imagesHead.right;
                break;
            }
        }

        // --- TAIL / BUTT ---
        else if (index === posSnake.length - 1) {
            const prevSegment = posSnake[index - 1];

            // Determine direction from tail to the segment before it
            const dx = prevSegment.x - segment.x;
            const dy = prevSegment.y - segment.y;

            if (dy === 1)
            imgElement.src = imagesButt.right; // Body is to the right
            else if (dy === -1)
            imgElement.src = imagesButt.left; // Body is to the left
            else if (dx === 1)
            imgElement.src = imagesButt.down; // Body is below
            else if (dx === -1) imgElement.src = imagesButt.up; // Body is above
        }

        // --- BODY PARTS ---
        else {
            const prev = posSnake[index - 1]; // The piece closer to the head
            const next = posSnake[index + 1]; // The piece closer to the tail

            if (prev.x === next.x) {
                imgElement.src = imagesBody.left_right;
            } else if (prev.y === next.y) {
                imgElement.src = imagesBody.up_down;
            } else {
                if (
                    (prev.y < segment.y && next.x > segment.x) ||
                    (next.y < segment.y && prev.x > segment.x)
                ) {
                    imgElement.src = imagesBody.left_down;
                } else if (
                    (prev.y < segment.y && next.x < segment.x) ||
                    (next.y < segment.y && prev.x < segment.x)
                ) {
                    imgElement.src = imagesBody.up_left;
                } else if (
                    (prev.y > segment.y && next.x > segment.x) ||
                    (next.y > segment.y && prev.x > segment.x)
                ) {
                    imgElement.src = imagesBody.right_down;
                } else {
                    imgElement.src = imagesBody.up_right;
                }
            }
        }
    });
}

/*
 *  helpers
 */
function checkOutOfBounds(x, y) {
    if (x < 0 || y < 0 || x >= fieldsize || y >= fieldsize) {
        return true;
    }
    return false;
}

function gameLost() {
    window.location.href = "../result_pages/loss.html";
}

function checkIfDone() {
    if (posSnake.length === fieldsize*fieldsize) {
        window.location.href = "../result_pages/win.html";
    }
}

function placeApple() {
    const x = Math.floor(Math.random() * fieldsize);
    const y = Math.floor(Math.random() * fieldsize);
    const appleKey = [x,y];

    const collisionWithSnake = posSnake.some(
        (segment) => segment.x === x && segment.y === y,
    );
    if (collisionWithSnake) {
        placeApple();
        return;
    }

    posApple = { x, y };
}

function checkCollision(x,y) {
    return posSnake.some((segment) => segment.x === x && segment.y === y);
}

function checkAteApple(x,y) {
    return x === posApple.x && y === posApple.y;
}