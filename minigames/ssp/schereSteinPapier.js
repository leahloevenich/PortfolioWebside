let computerPoints = 0;
let playerPoints = 0;

const texts = {
    scissor: { de: "Schere", en: "Scissor" },
    rock:    { de: "Stein", en: "Rock" },
    paper:   { de: "Papier", en: "Paper" },
    win:     { de: "GEWONNEN", en: "WIN" },
    loss:    { de: "VERLOREN", en: "LOSS" },
    draw:    { de: "UNENTSCHIEDEN", en: "DRAW" }
};

const choices = ["scissor", "rock", "paper"];

function getLang() {
    const banner = document.querySelector(".banner");
    return banner && banner.textContent.trim() === banner.dataset.de ? "de" : "en";
}

function setText(id, key) {
    const el = document.getElementById(id);
    el.dataset.de = texts[key].de;
    el.dataset.en = texts[key].en;
    el.innerText = texts[key][getLang()] ?? texts[key].en;
}

function scissorClicked() { evalRound(0); }
function rockClicked()    { evalRound(1); }
function paperClicked()   { evalRound(2); }

function evalRound(choice) {
    const pcGuess = Math.floor(Math.random() * 3);

    setText("player", choices[choice]);
    setText("computer", choices[pcGuess]);

    const result = (choice - pcGuess + 3) % 3;

    if (result === 0) {
        setText("res", "draw");
    } else if (result === 1) {
        setText("res", "win");
        playerPoints++;
    } else {
        setText("res", "loss");
        computerPoints++;
    }

    document.getElementById("playerPoints").innerText = playerPoints;
    document.getElementById("computerPoints").innerText = computerPoints;
}