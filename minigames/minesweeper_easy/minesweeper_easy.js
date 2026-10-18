/*
 *
 *      hier die spiellogik
 *
 */

// 0: save
// 1-8: number of bombs
// 9: bomb

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

let mode = null; // "flower", "stool" or null
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
      if (field[i][j] === 0) {
        gamefield[i].push(0);
      } else if (field[i][j] === 9) {
        gamefield[i].push(0);
      } else {
        gamefield[i].push(field[i][j]);
      }
    }
  }
}

function createButtons() {
  for (let x = 1; x <= fieldsize; x++) {
    for (let y = 1; y <= fieldsize; y++) {
      const button = document.createElement("button");
      board.style.gridTemplateColumns = `repeat(${fieldsize}, 50px)`;
      const value = gamefield[x - 1][y - 1];

      if (value === 0) {
        const img = document.createElement("img");
        img.src = images.questionmark;
        img.alt = "empty";
        img.style.width = "30px";
        img.style.height = "30px";
        button.appendChild(img);
      } else if (value === 9) {
        const img = document.createElement("img");
        img.src = images.bomb;
        img.alt = "bomb";
        img.style.width = "30px";
        img.style.height = "30px";
        button.appendChild(img);
      } else if (value === 10) {
        const img = document.createElement("img");
        img.src = images.free;
        img.alt = "safe";
        img.style.width = "30px";
        img.style.height = "30px";
        button.appendChild(img);
      } else {
        button.textContent = value;
      }

      button.addEventListener("click", () => handleClick(x, y, button));
      board.appendChild(button);
    }
  }
}

function incrCounter(x, y) {
  if (x < 0) {
    return;
  }
  if (y < 0) {
    return;
  }
  if (x >= fieldsize) {
    return;
  }
  if (y >= fieldsize) {
    return;
  }
  if (field[x][y] != 9) {
    field[x][y] += 1;
  }
}

/*
 *	handle buttons
 */
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const nowOn = btn.getAttribute("aria-pressed") !== "true";

    // switch every button off first
    buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));

    // then switch the clicked one on, if it was off
    btn.setAttribute("aria-pressed", String(nowOn));
    mode = nowOn ? btn.id : null;
  });
});

function handleClick(x, y, button) {
  const value = gamefield[x - 1][y - 1];
  const reveal = field[x - 1][y - 1];
  if (mode === "flower") {
    // place flower, if there is no bomb. otherwise, end the game
    if (reveal === 9 && value === 0) {
      gamefield[x - 1][y - 1] = 10;
      const img = button.querySelector("img");
      img.src = images.bomb;
      img.alt = "bomb";
      window.location.href = "../result_pages/loss.html";
    } else if (value === 0) {
      gamefield[x - 1][y - 1] = 10;
      const img = button.querySelector("img");
      img.src = images.free;
      img.alt = "safe";
    } else if (value === 10) {
      gamefield[x - 1][y - 1] = 0;
      const img = button.querySelector("img");
      img.src = images.questionmark;
      img.alt = "empty";
    } else {
    }
  } else if (mode === "stool") {
    // place or delete bomb regardless
    if (value === 0 || value === 10) {
      gamefield[x - 1][y - 1] = 9;
      const img = button.querySelector("img");
      img.src = images.bomb;
      img.alt = "bomb";
    } else if (value === 9) {
      gamefield[x - 1][y - 1] = 0;
      const img = button.querySelector("img");
      img.src = images.questionmark;
      img.alt = "empty";
    } else {
    }
  } else {
    // reveal field regardless
    if (reveal === 0) {
      gamefield[x - 1][y - 1] = 10;
      const img = button.querySelector("img");
      img.src = images.free;
      img.alt = "save";
    } else if (reveal === 9) {
      gamefield[x - 1][y - 1] = 9;
      const img = button.querySelector("img");
      img.src = images.bomb;
      img.alt = "bomb";
    } else {
    }
  }
  checkIfDone();
}

function checkIfDone() {
  const unfinished = gamefield.some((row) => row.includes(0));

  if (!unfinished) {
    window.location.href = "../result_pages/win.html";
  }
}
