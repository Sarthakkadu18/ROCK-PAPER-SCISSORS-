// Get all the necessary DOM elements
const playerScoreSpan = document.getElementById('player-score');
const computerScoreSpan = document.getElementById('computer-score');
const playerChoiceText = document.getElementById('player-choice-text');
const computerChoiceText = document.getElementById('computer-choice-text');
const resultText = document.getElementById('result-text');
const gameButtons = document.querySelectorAll('.game-btn');
const resetButton = document.getElementById('reset-btn');

// Initialize scores and choices
let playerScore = 0;
let computerScore = 0;
const choices = ['rock', 'paper', 'scissors'];

// Add event listeners to the game buttons
gameButtons.forEach(button => {
    button.addEventListener('click', () => {
        const playerChoice = button.id;
        const computerChoice = getComputerChoice();
        playRound(playerChoice, computerChoice);
    });
});

// Add event listener to the reset button
resetButton.addEventListener('click', resetGame);

// Function to generate the computer's choice randomly
function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// Function to play a single round
function playRound(playerChoice, computerChoice) {
    playerChoiceText.textContent = getEmoji(playerChoice);
    computerChoiceText.textContent = getEmoji(computerChoice);

    let result = '';

    if (playerChoice === computerChoice) {
        result = 'It\'s a Draw!';
        resultText.className = 'draw';
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        result = 'You Win!';
        playerScore++;
        resultText.className = 'win';
    } else {
        result = 'You Lose!';
        computerScore++;
        resultText.className = 'lose';
    }

    resultText.textContent = result;
    updateScores();
}

// Function to update the score display
function updateScores() {
    playerScoreSpan.textContent = playerScore;
    computerScoreSpan.textContent = computerScore;
}

// Function to reset the game
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    updateScores();
    playerChoiceText.textContent = '?';
    computerChoiceText.textContent = '?';
    resultText.textContent = 'Choose your weapon!';
    resultText.className = '';
}

// Helper function to get emoji for a choice
function getEmoji(choice) {
    switch (choice) {
        case 'rock':
            return '✊';
        case 'paper':
            return '✋';
        case 'scissors':
            return '✌️';
        default:
            return '?';
    }
}