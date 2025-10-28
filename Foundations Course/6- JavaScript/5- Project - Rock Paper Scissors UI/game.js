// Returns a random choice for the computer: "rock", "paper" or "scissors".
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// Global score counters
let humanScore = 0;
let computerScore = 0;
let gameOver = false;

// DOM references
const resultDiv = document.getElementById('result');
const scoreDiv = document.getElementById('score');
const buttons = document.querySelectorAll('button.choice');
const resetBtn = document.getElementById('reset');

// Update score display
function updateScoreDisplay() {
    scoreDiv.textContent = `You: ${humanScore} — Computer: ${computerScore}`;
}

// Append a message to the result area (keeps history)
function appendResultMessage(msg) {
    // also log to console for debugging
    console.log(msg);
    resultDiv.textContent = msg + '\n\n' + resultDiv.textContent;
}

// Disable or enable game buttons
function setButtonsEnabled(enabled) {
    buttons.forEach(btn => {
        if (btn !== resetBtn) btn.disabled = !enabled;
    });
}

// Play one round given human choice (computer choice is generated here)
function playRound(humanChoice) {
    if (gameOver) return;

    const computerChoice = getComputerChoice();

    if (humanChoice === computerChoice) {
        appendResultMessage(`Tie: both chose ${humanChoice}.`);
        // no score change
    } else if (
        (humanChoice === 'rock' && computerChoice === 'scissors') ||
        (humanChoice === 'paper' && computerChoice === 'rock') ||
        (humanChoice === 'scissors' && computerChoice === 'paper')
    ) {
        humanScore++;
        appendResultMessage(`You win this round! ${humanChoice} beats ${computerChoice}.`);
    } else {
        computerScore++;
        appendResultMessage(`You lose this round. ${computerChoice} beats ${humanChoice}.`);
    }

    updateScoreDisplay();

    // Check for overall winner (first to 5)
    if (humanScore >= 5 || computerScore >= 5) {
        gameOver = true;
        if (humanScore > computerScore) {
            appendResultMessage(`Game over — You reached 5 first. You are the overall winner!`);
        } else {
            appendResultMessage(`Game over — Computer reached 5 first. Computer is the overall winner.`);
        }
        setButtonsEnabled(false);
    }
}

// Reset game state
function resetGame() {
    humanScore = 0;
    computerScore = 0;
    gameOver = false;
    updateScoreDisplay();
    resultDiv.textContent = 'Make your move by clicking a button.';
    setButtonsEnabled(true);
}

// Wire up event listeners after DOM is ready (script loaded with defer)
document.addEventListener('DOMContentLoaded', () => {
    // Choice buttons
    document.getElementById('rock').addEventListener('click', () => playRound('rock'));
    document.getElementById('paper').addEventListener('click', () => playRound('paper'));
    document.getElementById('scissors').addEventListener('click', () => playRound('scissors'));

    // Reset button
    resetBtn.addEventListener('click', resetGame);

    // Initialize UI
    updateScoreDisplay();
});