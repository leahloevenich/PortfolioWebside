/*
 *
 *      hier die spiellogik 
 * 
 */

// 0: schere
// 1: stein 
// 2: papier
computerPoints = 0;
playerPoints = 0;

function scissorClicked() {
    console.log("You pressed scissor");
    document.getElementById("player").innerText = "Scissor";
    evalRound(0);
}

function rockClicked() {
    console.log("You pressed rock");
    document.getElementById("player").innerText = "Rock";
    evalRound(1);
}

function paperClicked() {
    console.log("You pressed paper");
    document.getElementById("player").innerText = "Paper";
    evalRound(2);
}

function evalRound(choice) {
    let pcGuess = Math.floor(Math.random() * 3)
    
    switch (pcGuess) {
        case 0: //pc scissor
            document.getElementById("computer").innerText = "Scissor";
            switch (choice) {
                case 0: //player scissor
                    document.getElementById("res").innerText = "DRAW";
                    break;
                case 1: //player rock
                    document.getElementById("res").innerText = "WIN";
                    playerPoints += 1;
                    break;
                case 2:
                    document.getElementById("res").innerText = "LOSS";
                    computerPoints += 1;
                    break;
                default:
                    break;
            }
            break;
        case 1: //PC rock
            document.getElementById("computer").innerText = "Rock";
            switch (choice) {
                case 0:
                    document.getElementById("res").innerText = "LOSS";
                    computerPoints += 1;
                    break;
                case 1:
                    document.getElementById("res").innerText = "DRAW";
                    break;
                case 2:
                    document.getElementById("res").innerText = "WIN";
                    playerPoints += 1;
                    break;
                default:
                    break;
            }
            break;
        case 2: //paper 
            document.getElementById("computer").innerText = "Paper";
            switch (choice) {
                case 0: //scissor
                    document.getElementById("res").innerText = "WIN";
                    playerPoints += 1;
                    break;
                case 1: //rock
                    document.getElementById("res").innerText = "LOSS";
                    computerPoints += 1;
                    break;
                case 2: //paper
                    document.getElementById("res").innerText = "DRAW";
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    document.getElementById("playerPoints").innerText = playerPoints;
    document.getElementById("computerPoints").innerText = computerPoints;
}