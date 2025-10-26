// Returns a random choice for the computer: "rock", "paper" or "scissors".
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    // Math.random() produces a value in [0, 1). Multiplying by choices.length
    // and flooring gives a random index of 0, 1, or 2.
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// Prompts the human player for their choice and normalizes it to lowercase.
// Keeps prompting until a valid choice is entered.
function getHumanChoice() {
    let choice;
    do {
        // prompt() opens a dialog in the browser; ensure the page is open to use it.
        choice = prompt("Enter your choice (rock, paper, or scissors):").toLowerCase();
    } while (!['rock', 'paper', 'scissors'].includes(choice));
    return choice;
}

// Global score counters for the human and computer players.
// These are incremented inside playRound.
let humanScore = 0;
let computerScore = 0;

// Plays a single round given the human and computer choices.
// Logs the round outcome and updates the appropriate score.
// Returns 'human', 'computer', or 'tie' to indicate the round result.
function playRound(humanChoice, computerChoice) {
    // If both choices are the same, it's a tie.
    if (humanChoice === computerChoice) {
        console.log(`It's a tie! Both chose ${humanChoice}.`);
        return 'tie';
    // Check all winning combinations for the human player.
    } else if (
        (humanChoice === 'rock' && computerChoice === 'scissors') ||
        (humanChoice === 'paper' && computerChoice === 'rock') ||
        (humanChoice === 'scissors' && computerChoice === 'paper')
    ) {
        humanScore++; // increment human score on win
        console.log(`You win! ${humanChoice} beats ${computerChoice}.`);
        return 'human';
    } else {
        // Otherwise the computer wins the round.
        computerScore++; // increment computer score on win
        console.log(`You lose! ${computerChoice} beats ${humanChoice}.`);
        return 'computer';
    }
}

// Plays a full game of 5 rounds.
// Calls getHumanChoice and getComputerChoice each round so choices are fresh.
// After 5 rounds, logs the final scores and the overall winner.
function playGame() {
    for (let i = 0; i < 5; i++) {
        const humanChoice = getHumanChoice();       // ask user each round
        const computerChoice = getComputerChoice(); // random computer choice
        playRound(humanChoice, computerChoice);     // play and log result
    }

    console.log(`Final Score: You - ${humanScore}, Computer - ${computerScore}`);
    if (humanScore > computerScore) {
        console.log("You are the overall winner!");
    } else if (computerScore > humanScore) {
        console.log("Computer is the overall winner!");
    } else {
        console.log("The game is a tie!");
    }
}

// Start the game on console
// Uncomment to run: playGame();
//playGame();