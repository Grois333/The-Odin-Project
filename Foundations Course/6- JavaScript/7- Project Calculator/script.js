// Calculator logic without using eval()
// Uses plain DOM + modern JS. Comments explain the flow.

const displayEl = document.getElementById('display');
const decimalBtn = document.getElementById('decimal');
const equalsBtn = document.getElementById('equals');
const clearBtn = document.getElementById('clear');
const backspaceBtn = document.getElementById('backspace');

let firstOperand = null;        // stores first number in operation
let operator = null;            // stores current operator as string: "+", "-", "×", "÷"
let waitingForSecond = false;   // true when the user has entered an operator and next digits are for the second operand
let justCalculated = false;     // true if the display is the result of a calculation
let displayValue = '0';         // string shown on the display

// Basic math functions
function add(a, b){ return a + b; }
function subtract(a, b){ return a - b; }
function multiply(a, b){ return a * b; }
function divide(a, b){
    if (b === 0) {
        // Snarky error message for divide by zero, no crash
        return 'Nice try — can\'t divide by 0!';
    }
    return a / b;
}

// operate chooses the correct function without eval
function operate(op, a, b){
    const x = Number(a);
    const y = Number(b);
    if (Number.isNaN(x) || Number.isNaN(y)) return null;
    switch(op){
        case '+': return add(x,y);
        case '-': return subtract(x,y);
        case '×': return multiply(x,y);
        case '÷': return divide(x,y);
        default: return null;
    }
}

// Update the calculator display, with rounding and overflow handling
function updateDisplay(){
    let text = String(displayValue);

    // Handle long numbers by rounding or scientific notation
    if (typeof displayValue === 'number' && !Number.isInteger(displayValue)) {
        // round to max 8 decimal places
        text = String(roundAccurately(displayValue, 8));
    }

    if (text.length > 12) {
        // Use exponential notation for very long numbers
        const n = Number(text);
        if (Number.isFinite(n)) text = n.toExponential(6);
    }

    displayEl.textContent = text;
    // disable decimal button if current display already has a decimal point
    decimalBtn.disabled = String(displayValue).includes('.');
}

// Helper to avoid floating point long tails
function roundAccurately(num, places){
    const factor = Math.pow(10, places);
    return Math.round((num + Number.EPSILON) * factor) / factor;
}

// Handle number (digit) buttons
function inputDigit(digit){
    if (justCalculated) {
        // start new calculation when a digit is pressed after result
        displayValue = digit;
        firstOperand = null;
        operator = null;
        waitingForSecond = false;
        justCalculated = false;
        updateDisplay();
        return;
    }

    if (waitingForSecond) {
        // begin entering second operand
        displayValue = digit;
        waitingForSecond = false;
    } else {
        // normal append or replace leading zero
        displayValue = (displayValue === '0') ? digit : String(displayValue) + digit;
    }
    updateDisplay();
}

// Handle decimal point input
function inputDecimal(){
    if (justCalculated) {
        // starting fresh after a result
        displayValue = '0.';
        firstOperand = null;
        operator = null;
        justCalculated = false;
        waitingForSecond = false;
        updateDisplay();
        return;
    }

    if (waitingForSecond) {
        // If user presses decimal immediately after operator, start new second operand "0."
        displayValue = '0.';
        waitingForSecond = false;
        updateDisplay();
        return;
    }

    if (!String(displayValue).includes('.')) {
        displayValue = String(displayValue) + '.';
        updateDisplay();
    }
}

// Handle operator buttons (+ - × ÷)
function handleOperator(nextOperator){
    if (operator && waitingForSecond) {
        // consecutive operator presses: replace the operator but do not evaluate
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        // store the first number and wait for second
        firstOperand = parseFloat(displayValue);
    } else if (operator) {
        // perform pending calculation
        const result = operate(operator, firstOperand, parseFloat(displayValue));
        if (typeof result === 'string') {
            // divide by zero or error string
            displayValue = result;
            firstOperand = null;
            operator = null;
            justCalculated = true;
            updateDisplay();
            return;
        }
        // update display and use result as firstOperand for chaining operations
        displayValue = result;
        firstOperand = result;
    }

    operator = nextOperator;
    waitingForSecond = true;
    justCalculated = false;
    updateDisplay();
}

// Handle equals button
function handleEquals(){
    if (operator === null || waitingForSecond) {
        // not enough information to perform operation; ignore
        return;
    }

    const result = operate(operator, firstOperand, parseFloat(displayValue));
    if (typeof result === 'string') {
        displayValue = result;
        firstOperand = null;
        operator = null;
        justCalculated = true;
        updateDisplay();
        return;
    }

    displayValue = result;
    firstOperand = result;
    operator = null;
    waitingForSecond = false;
    justCalculated = true;
    updateDisplay();
}

// Clear everything (AC)
function clearAll(){
    firstOperand = null;
    operator = null;
    waitingForSecond = false;
    justCalculated = false;
    displayValue = '0';
    updateDisplay();
}

// Backspace (undo last digit)
function backspace(){
    if (justCalculated) {
        // if last action was a calculation, clear everything
        clearAll();
        return;
    }
    const s = String(displayValue);
    if (s.length <= 1) {
        displayValue = '0';
    } else {
        displayValue = s.slice(0, -1);
    }
    updateDisplay();
}

// Hook up button clicks
document.querySelectorAll('[data-number]').forEach(btn=>{
    btn.addEventListener('click', e => inputDigit(e.target.dataset.number));
});

document.querySelectorAll('[data-action="operator"]').forEach(btn=>{
    btn.addEventListener('click', e => handleOperator(e.target.dataset.operator));
});

decimalBtn.addEventListener('click', inputDecimal);
equalsBtn.addEventListener('click', handleEquals);
clearBtn.addEventListener('click', clearAll);
backspaceBtn.addEventListener('click', backspace);

// Keyboard support
window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
        e.preventDefault();
        return;
    }
    if (e.key === '.' || e.key === ',') {
        inputDecimal();
        e.preventDefault();
        return;
    }
    if (e.key === '+' || e.key === '-') {
        handleOperator(e.key);
        e.preventDefault();
        return;
    }
    if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        handleOperator('×');
        e.preventDefault();
        return;
    }
    if (e.key === '/' ) {
        handleOperator('÷');
        e.preventDefault();
        return;
    }
    if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
        e.preventDefault();
        return;
    }
    if (e.key === 'Backspace') {
        backspace();
        e.preventDefault();
        return;
    }
    if (e.key === 'Escape') {
        clearAll();
        e.preventDefault();
    }
});

// Initialize display on load
updateDisplay();