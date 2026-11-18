// field entries:
// 0: save
// 1-8: number of bombs
// 9: bomb
// 10: not revealed yet

// fieldsizes:
// Easy (Beginner): 9 × 9 grid with 10 bombs
// Medium (Intermediate): 16 × 16 grid with 40 bombs
// Hard / Expert: 30 × 16 grid with 99 bombs

/*
 *	variables
 */

const urlParams = new URLSearchParams(window.location.search);
const fieldsize = parseInt(urlParams.get("size")) || 9;

let numberBombs = 0;
const field = [];
const gamefield = [];
let firstTry = true;

const buttons = document.querySelectorAll(".toggle-btn");

const board = document.getElementById("board");

const images = {
	free: "../../images/minigames/minesweeper/pressed.png",
	questionmark: "../../images/minigames/minesweeper/notpressed.png",
	bomb: "../../images/minigames/minesweeper/bomb.png",
};
const loadedImages = {};






// Funktion zum Vorabladen aller Bilder
function preloadImages(callback) {
	let totalImages = Object.keys(images).length;
	let loadedCount = 0;

    for (const key in images) {
		const path = images[key];
		const img = new Image();
		
		img.src = path;
		
		// Wenn das Bild erfolgreich geladen wurde
		img.onload = () => {
			loadedCount++;
			if (loadedCount === totalImages && typeof callback === "function") {
			callback();
			}
		};
		
		img.onerror = () => {
			console.error(`Fehler beim Laden des Bildes: ${path}`);
			loadedCount++;
			if (loadedCount === totalImages && typeof callback === "function") {
			callback();
			}
		};

		loadedImages[key] = img;
    }
}




/*
 *  game
 */
preloadImages(() => {
    console.log("Alle Bilder erfolgreich geladen! Das Spiel kann starten.");

	if (fieldsize === 16) {
		numberBombs = 40;
	} else if (fieldsize === 9) {
		numberBombs = 10;
	}

	document.getElementById("numberBombs").innerText = numberBombs;
	document.getElementById("fieldsize").innerText = fieldsize;

	prepareField();
	prepareGame();
	createButtons();
});


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
			img.src = loadedImages.questionmark.src;
			img.alt = "empty";
			img.classList.add("board-image");
			button.appendChild(img);

			let pressTimer = null;
			let lastPressTime = 0;
			let longPressed = false; 
			const longPressDuration = 500;
			const cooldownDuration = 300;
			const contextMenuGuard = 800;

			button.addEventListener("click", (e) => {
				if (longPressed) {
					longPressed = false;
					return;
				}
				handleClick(x, y, button);
			});

			button.addEventListener("contextmenu", (e) => {
				e.preventDefault();

				if (Date.now() - lastPressTime < contextMenuGuard) {
					return;
				}

				if (pressTimer) {
					clearTimeout(pressTimer);
					pressTimer = null;
					longPressed = true;
					lastPressTime = Date.now();
				}

				handleRightClick(x, y, button);
			});

			// --- Long-Press Handler with Cooldown Pause ---
			const startPress = (e) => {
				if (e.button === 2) return; 

				// Check if we are still within the cooldown pause period
				const now = Date.now();
				if (now - lastPressTime < cooldownDuration) {
					return;
				}
				longPressed = false;

				pressTimer = setTimeout(() => {
					handleRightClick(x, y, button);
					lastPressTime = Date.now();
					longPressed = true;
					pressTimer = null;
				}, longPressDuration);
			};

			const cancelPress = () => {
				if (pressTimer) {
					clearTimeout(pressTimer);
					pressTimer = null;
				}
			};

			button.addEventListener("mousedown", startPress);
			button.addEventListener("touchstart", startPress, { passive: true });

			button.addEventListener("mouseup", cancelPress);
			button.addEventListener("mouseleave", cancelPress);
			button.addEventListener("touchend", cancelPress);
			button.addEventListener("touchmove", cancelPress);

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
function handleClick(x, y) {
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
	const img = button.querySelector("img");
	if (!img) return;

	if (gamefield[x][y] === 10) {
		gamefield[x][y] = 9;
		img.src = loadedImages.bomb.src;
		img.alt = "bomb";
	} else if (gamefield[x][y] === 9) {
		gamefield[x][y] = 10;
		img.src = loadedImages.questionmark.src;
		img.alt = "empty";
	}
	checkIfDone();
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

	// recursively reveal neighboring cells
	if (field[x][y] === 0) {
		revealField(x+1,y);
		revealField(x-1,y);
		revealField(x,y+1);
		revealField(x,y-1);
		revealField(x-1,y-1);
		revealField(x+1,y-1);
		revealField(x-1,y+1);
		revealField(x+1,y+1);
	}

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
				img.src = loadedImages.bomb.src;
				img.alt = "bomb";
			} else if (value === 0) {
				img.src = loadedImages.free.src;
				img.alt = "safe";
			} else if (value === 10) {
				img.src = loadedImages.questionmark.src;
				img.alt = "empty";
			} else if (value >= 1 && value <= 8) {
                button.innerText = value;
            }
		}
	}
	checkIfDone();
}

function checkIfDone() {
	for (let x = 0; x < fieldsize; x++) {
		for (let y = 0; y < fieldsize; y++) {
			const isBomb = field[x][y] === 9;
			const state = gamefield[x][y];
			if (!isBomb && (state === 10 || state === 9)) {
				return;
			}
		}
	}

	window.location.href = "../result_pages/win.html";
}