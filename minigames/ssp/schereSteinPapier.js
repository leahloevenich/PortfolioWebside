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
const images = {
    draw: "../../images/minigames/ssp/draw.png",
    win: "../../images/minigames/ssp/win.png",
    loss: "../../images/minigames/ssp/loss.png"
};
const loadedImages = {};

/*
 *  LANGUAGE HANDLING
 */
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

/*
 *  HANDLE INPUT
 */
function scissorClicked() { evalRound(0); }
function rockClicked()    { evalRound(1); }
function paperClicked()   { evalRound(2); }

/*
 *  EVALUATE ROUND
 */
function evalRound(choice) {
    const pcGuess = Math.floor(Math.random() * 3);

    setText("player", choices[choice]);
    setText("computer", choices[pcGuess]);

    const result = (choice - pcGuess + 3) % 3;

    if (result === 0) {
        document.getElementById("res").outerHTML = '<img src="../../images/minigames/ssp/draw.png" alt="Draw" id="res">';
    } else if (result === 1) {
        document.getElementById("res").outerHTML = '<img src="../../images/minigames/ssp/win.png" alt="Win" id="res">';
        playerPoints++;
    } else {
        document.getElementById("res").outerHTML = '<img src="../../images/minigames/ssp/loss.png" alt="Loss" id="res">';
        computerPoints++;
    }

    document.getElementById("playerPoints").innerText = playerPoints;
    document.getElementById("computerPoints").innerText = computerPoints;
}






/*
 *  PRELOAD IMAGES
 */

// call function
preloadImages(() => {
    console.log("Alle Bilder erfolgreich geladen! Das Spiel kann starten.");
});

// define function
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