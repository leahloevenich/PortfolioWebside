/*
 *
 *      hier die spiellogik
 *
 */

// 0: save
// 1-8: number of bombs
// 9: bomb
// 10: not revealed yet

// Easy (Beginner): 9 × 9 grid with 10 bombs
// Medium (Intermediate): 16 × 16 grid with 40 bombs
// Hard / Expert: 30 × 16 grid with 99 bombs

/*
 *	variables
 */

const urlParams = new URLSearchParams(window.location.search);
const fieldsize = parseInt(urlParams.get("size")) || 9; // Defaults to 9 if none is provided

let numberBombs = 0;
const field = [];
const gamefield = [];
let firstTry = true;

const buttons = document.querySelectorAll(".toggle-btn");

const board = document.getElementById("board");

const images = {
	free: "../../images/minigames/minesweeper/safe.png",
	questionmark: "../../images/minigames/minesweeper/empty.png",
	bomb: "../../images/minigames/minesweeper/bomb.png",
};

if (fieldsize === 16) {
	numberBombs = 40;
} else if (fieldsize === 9) {
	numberBombs = 10;
}

document.getElementById("numberBombs").innerText = numberBombs;
document.getElementById("fieldsize").innerText = fieldsize;

/*
 *	prepare game
 */
prepareField();
prepareGame();
createButtons();

/*
 *
 */
function prepareField() {
	// fill 0s
	for (let i = 0; i < fieldsize; i++) {
		field.push(new Array(fieldsize).fill(0));
	}

	// place bombs
	for (let i = 0; i < numberBombs; i++) {
		let x = Math.floor(Math.random() * fieldsize);
		let y = Math.floor(Math.random() * fieldsize);
		
		if (field[x][y] != 9) {
			field[x][y] = 9;

			// increment nearby counters
			incrCounter(x - 1, y - 1);
			incrCounter(x - 1, y);
			incrCounter(x - 1, y + 1);
			incrCounter(x, y - 1);
			incrCounter(x, y + 1);
			incrCounter(x + 1, y - 1);
			incrCounter(x + 1, y);
			incrCounter(x + 1, y + 1);
		} else {
			i += 1;
		}
	}
}

function prepareGame() {
	for (let i = 0; i < fieldsize; i++) {
		gamefield.push([]);
		for (let j = 0; j < fieldsize; j++) {
			gamefield[i].push(10);
		}
	}
}

function createButtons() {
  board.style.gridTemplateColumns = `repeat(${fieldsize}, 50px)`;

	for (let x = 0; x < fieldsize; x++) {
			for (let y = 0; y < fieldsize; y++) {
			const button = document.createElement("button");

			const img = document.createElement("img");
			img.src = images.questionmark;
			img.alt = "empty";
			img.style.width = "30px";
			img.style.height = "30px";
			button.appendChild(img);

			// Left-click handler
			button.addEventListener("click", (e) => {
				handleClick(x, y, button);
			});

			// Right-click handler
			button.addEventListener("contextmenu", (e) => {
				e.preventDefault(); // Prevents the browser's default right-click menu from showing
				handleRightClick(x, y, button);
			});

			board.appendChild(button);
		}
	}
}

function incrCounter(x, y) {
	if (checkOutOfBounds(x,y)) {
		return;
	}
	if (field[x][y] != 9) {
		field[x][y] += 1;
	}
}

function checkOutOfBounds(x,y) {
	if (x < 0 || y < 0 || x >= fieldsize || y >= fieldsize) {
		return true;
	}
	return false;
}

/*
 *	handle buttons
 */
function handleClick(x, y, button) {
	const value = gamefield[x][y];
	const reveal = field[x][y];
	if (firstTry) {
		firstTry = false;
		if (reveal === 9) {
			// bomb at first try. try new field
			window.location.reload();
		} else if (value === 10) {
			revealField(x, y);
		}
	} else {
		if (reveal === 9 && value === 10) {
			// bomb
			window.location.href = "../result_pages/loss.html";
		} else if (value === 10) {
			revealField(x, y);
		}
	}
}

function handleRightClick(x, y, button) {
  // 1. Get the image element from the button
  const img = button.querySelector("img");
  if (!img) return;

  // 2. If the cell is unrevealed (10), flag it as a bomb/questionmark
  if (gamefield[x][y] === 10) {
    gamefield[x][y] = 11; // 11 can represent a flagged cell
    img.src = images.bomb; // (Or a flag image if you have one)
    img.alt = "bomb";
  }
  // 3. If it's already flagged (11), unflag it back to hidden (10)
  else if (gamefield[x][y] === 11) {
    gamefield[x][y] = 10;
    img.src = images.questionmark;
    img.alt = "empty";
  }
}

function revealField(x, y) {
	if (checkOutOfBounds(x, y)) {
		return;
	}

	// already revealed
	if (gamefield[x][y] != 10) {
		return;
	}

	gamefield[x][y] = field[x][y];

	// If it's a 0, recursively reveal neighboring cells
	if (field[x][y] === 0) {
		revealField(x + 1, y);
		revealField(x - 1, y);
		revealField(x, y + 1);
		revealField(x, y - 1);
		revealField(x-1,y-1);
		revealField(x+1,y-1);
		revealField(x-1,y+1);
		revealField(x+1,y+1);
	}

	// Always reload the field at the end so the UI updates!
	reloadField();
}

function reloadField() {
	for (let x = 0; x < fieldsize; x++) {
		for (let y = 0; y < fieldsize; y++) {
			let value = gamefield[x][y];

			const buttonIndex = x * fieldsize + y;
			const button = board.children[buttonIndex];

			if (!button) continue;

			const img = button.querySelector("img");

			if (value === 9) {
				img.src = images.bomb;
				img.alt = "bomb";
			} else if (value === 0) {
				img.src = images.free;
				img.alt = "safe";
			} else if (value === 10) {
				img.src = images.questionmark;
				img.alt = "empty";
			} else if (value >= 1 && value <= 8) {
                button.innerText = value;
            }
		}
	}
	checkIfDone();
}

function checkIfDone() {
	const unfinished = gamefield.some((row) => row.includes(10));

	if (!unfinished) {
		window.location.href = "../result_pages/win.html";
	}
}