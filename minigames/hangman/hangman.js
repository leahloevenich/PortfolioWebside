/*
 *
 *      this is my hangman game code.
 * 
 */

// these are the possible words
const words = ["sonne", "baum", "kaffee", "blume", "freude", "wunder", "licht", "wolke", "regen", "spiel",
"schnee", "strauch", "haustier", "erde", "felsen", "wasser", "tasse", "wind", "herbst", "sommer",
"winter", "fruehling", "morgen", "abend", "nacht", "mittag", "schule", "papier", "bunt", "grau",
"freund", "buch", "seite", "stuhl", "kissen", "kerze", "flamme", "nebel", "faden", "himmel",
"wiese", "see", "fluss", "sand", "strand", "muschel", "steine", "schatten", "spielzeug", "kugel",
"teller", "gabel", "messer", "loeffel", "glas", "flasche", "kanne", "blase", "luft", "huegel",
"feld", "ast", "blatt", "tropfen", "funken", "kamin", "funke", "lampe", "kleid", "jacke",
"schuh", "hose", "muetze", "schal", "baumhaus", "zaun", "bank", "turm", "bruecke", "tor",
"fenster", "tuere", "maus", "katze", "hund", "vogel", "pferd", "kuh", "schaf", "hahn", "ente",
"fisch", "netz", "segel", "boot", "anker", "hafen", "insel", "kueste", "klippe", "schiff",
"blume", "duft", "welle", "sturm", "orkan", "brise", "felsen", "kran", "bagger", "auto",
"reifen", "motor", "brett", "leiter", "schaufel", "hammer", "nagel", "schraube", "seil", "knopf",
"feder", "schrank", "bett", "sofa", "decke", "matratze", "kissen", "schluessel", "rahmen", "wand",
"zimmer", "teppich", "boden", "decke", "dach", "garten", "pflanze", "stamm", "rinde", "wurzeln"]

// variables 

    // help variables
    const indexToGuess = Math.floor(Math.random() * words.length)
    let lastKey = ""
    const images = [
      "../../images/minigames/hangman/status_0.png",
      "../../images/minigames/hangman/status_1.png",
      "../../images/minigames/hangman/status_2.png",
      "../../images/minigames/hangman/status_3.png",
      "../../images/minigames/hangman/status_4.png",
      "../../images/minigames/hangman/status_5.png",
      "../../images/minigames/hangman/status_6.png",
      "../../images/minigames/hangman/status_7.png",
    ];
    // Preload all images into the browser cache
    images.forEach((path) => {
        const img = new Image();
        img.src = path;
    });


    // important variables
    const wordToGuess = words[indexToGuess]
    let wordInGuessing = new Array(wordToGuess.length).fill("__");
    let guessedLetters = []
    let tries = 7
    let guessed = false


/*
 *
 *      FUNCTIONS
 * 
 */

// update display.
function updateDisplay() {
    document.getElementById('hangman_visual').src = images[7-tries]
    document.getElementById('worddisplay').textContent = wordInGuessing.join("  ")
    document.getElementById("guessedletters").textContent = guessedLetters.length === 0 ? "none!" : guessedLetters.join(", ");
    //function updateImage() {
    //const hangmanImage = document.getElementById('hangman-visual');
    // mistakes acts as the index for the array

}


// checks if the game should end.
function endGame() {
    if (tries === 0) {
        lost()
    } else if (!wordInGuessing.includes("__")) {
        won()
    }
}

function won() {
    window.location.href = "../result_pages/win.html"
}

function lost() {
    window.location.href = "../result_pages/loss.html"; 
}

// game logic
function checkLetter(letter) {
    if (guessedLetters.includes(letter)) {      // then the letter was already guessed.
        // do nothing.
        return
    } else {                                    // then the letter was not already guessed.
        if (wordToGuess.includes(letter)) {     // then the letter was correct.
            // update wordInGuessing
            for (let i = 0; i < wordToGuess.length; i++) {
                if (wordToGuess[i] === letter) {
                    wordInGuessing[i] = letter
                }
            }
        } else {                                // then the letter was incorrect.
            // update guessedLetters
            guessedLetters.push(letter)
            tries -= 1
        }
    }
    updateDisplay()
    endGame()
}





/*
 *
 *      GAME
 * 
 */


updateDisplay()
// wait for keyboard.
window.addEventListener('keydown', function(event) {
    // 1. Save the pressed key into the variable
    lastKey = event.key;

    // 2. Check if it's actually a letter (optional but helpful)
    if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
        //console.log("You pressed the letter: " + lastKey);
        
        // You can now trigger your game logic here
        checkLetter(lastKey);
    }
});




