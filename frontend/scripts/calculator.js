const resultDisplay = document.getElementById('result');
const themeSwitch = document.getElementById('theme-switch');
const btnClear = document.getElementById('btn_op_clear');
const btnCe = document.getElementById('btn_op_ce');
const btnLog = document.getElementById('btn_op_log');
const btnPower = document.getElementById('btn_op_power');
const btnFactorial = document.getElementById('btn_op_factorial');
const btnSqrt = document.getElementById('btn_op_sqrt');
const btnSign = document.getElementById('btn_op_sign');
const btnPercent = document.getElementById('btn_op_percent');
const btnDiv = document.getElementById('btn_op_div');
const btnAddZeroes = document.getElementById('btn_op_add_zeroes');
const btnMult = document.getElementById('btn_op_mult');
const btnCumSum = document.getElementById('btn_op_cumulative_sum');
const btnMinus = document.getElementById('btn_op_minus');
const btnCumMinus = document.getElementById('btn_op_cumulative_minus');
const btnPlus = document.getElementById('btn_op_plus');
const btnChangeColor = document.getElementById('btn_change_screen_color');
const btnEqual = document.getElementById('btn_op_equal');
const btnDot = document.getElementById('btn_digit_dot');

const digitButtons = [];
for (let i = 0; i <= 9; i++) {
    const btn = document.getElementById(`btn_digit_${i}`);
    if (btn) digitButtons.push(btn);
}

let currentInput = '0';
let previousInput = '';
let operation = null;
let resetNext = false;
let cumulativeMemory = 0;
let lastCumulativeOperation = null;

const screenColors = ['black', 'transparent'];
let colorIndex = 0;

function updateDisplay(value) {
    resultDisplay.textContent = value;
}

function formatInput(value) {
    if (value === '') return '0';
    if (value === '0.') return '0.';
    if (value.indexOf('.') !== -1) {
        const parts = value.split('.');
        parts[0] = parts[0].replace(/^0+/, '') || '0';
        return parts.join('.');
    } else {
        return value.replace(/^0+/, '') || '0';
    }
}

function handleDigit(digit) {
    if (resetNext) {
        currentInput = '';
        resetNext = false;
    }
    if (currentInput === '0' && digit !== '.') {
        currentInput = digit;
    } else {
        currentInput += digit;
    }
    if (currentInput.length > 12) {
        currentInput = currentInput.slice(0, 12);
    }
    updateDisplay(currentInput);
}

function handleOperator(op) {
    if (operation !== null && !resetNext) {
        calculate();
    }
    previousInput = currentInput;
    operation = op;
    resetNext = true;
}

function calculate() {
    if (operation === null || previousInput === '') {
        return;
    }

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) {
        result = 'Error';
        updateDisplay(result);
        resetState();
        return;
    }

    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                result = 'Error';
            } else {
                result = prev / current;
            }
            break;
        default:
            return;
    }

    if (typeof result === 'number') {
        if (Number.isInteger(result)) {
            currentInput = result.toString();
        } else {
            currentInput = result.toFixed(10).replace(/\.?0+$/, '');
        }
    } else {
        currentInput = result;
    }

    updateDisplay(currentInput);
    operation = null;
    previousInput = '';
    resetNext = true;
}

function resetState() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    resetNext = false;
    updateDisplay(currentInput);
}

function handleSpecialOperation(opType) {
    let input = parseFloat(currentInput);
    let result;

    if (isNaN(input)) {
        result = 'Error';
        updateDisplay(result);
        resetState();
        return;
    }

    switch (opType) {
        case 'sqrt':
            if (input < 0) {
                result = 'Error';
            } else {
                result = Math.sqrt(input);
            }
            break;
        case 'power':
            result = Math.pow(input, 2);
            break;
        case 'factorial':
            if (input < 0 || !Number.isInteger(input)) {
                result = 'Error';
            } else {
                let fact = 1;
                for (let i = 2; i <= input; i++) {
                    fact *= i;
                }
                result = fact;
            }
            break;
        case 'log':
            if (input <= 0) {
                result = 'Error';
            } else {
                result = Math.log10(input);
            }
            break;
        case 'percent':
            if (previousInput !== '' && operation) {
                const prev = parseFloat(previousInput);
                result = (prev * input) / 100;
                currentInput = result.toString();
                if (operation) {
                    calculate();
                }
                return;
            } else {
                result = input / 100;
            }
            break;
        case 'sign':
            result = -input;
            break;
        default:
            return;
    }

    if (typeof result === 'number') {
        if (Number.isInteger(result)) {
            currentInput = result.toString();
        } else {
            currentInput = result.toFixed(10).replace(/\.?0+$/, '');
        }
    } else {
        currentInput = result;
    }
    updateDisplay(currentInput);
    resetNext = true;
}

digitButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const digit = btn.textContent;
        handleDigit(digit);
    });
});

btnDot.addEventListener('click', () => {
    if (resetNext) {
        currentInput = '0';
        resetNext = false;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay(currentInput);
    }
});

btnPlus.addEventListener('click', () => handleOperator('+'));
btnMinus.addEventListener('click', () => handleOperator('-'));
btnMult.addEventListener('click', () => handleOperator('*'));
btnDiv.addEventListener('click', () => handleOperator('/'));

btnEqual.addEventListener('click', () => {
    if (operation !== null && previousInput !== '') {
        calculate();
    } else {
        resetNext = true;
    }
});

btnClear.addEventListener('click', () => {
    resetState();
    lastCumulativeOperation = null;
    cumulativeMemory = 0;
});

btnCe.addEventListener('click', () => {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay(currentInput);
});

btnSign.addEventListener('click', () => handleSpecialOperation('sign'));

btnPercent.addEventListener('click', () => handleSpecialOperation('percent'));

btnSqrt.addEventListener('click', () => handleSpecialOperation('sqrt'));

btnPower.addEventListener('click', () => handleSpecialOperation('power'));

btnFactorial.addEventListener('click', () => handleSpecialOperation('factorial'));

btnLog.addEventListener('click', () => handleSpecialOperation('log'));

btnAddZeroes.addEventListener('click', () => {
    if (resetNext) {
        currentInput = '';
        resetNext = false;
    }
    if (currentInput === '0') {
        currentInput = '0';
    } else {
        currentInput += '000';
    }
    if (currentInput.length > 12) {
        currentInput = currentInput.slice(0, 12);
    }
    updateDisplay(currentInput);
});

btnCumSum.addEventListener('click', () => {
    const val = parseFloat(currentInput);
    if (isNaN(val)) return;

    if (lastCumulativeOperation === 'sum') {
        cumulativeMemory += val;
    } else {
        cumulativeMemory = val;
    }
    lastCumulativeOperation = 'sum';
    resetNext = true;
    updateDisplay(cumulativeMemory);
});

btnCumMinus.addEventListener('click', () => {
    const val = parseFloat(currentInput);
    if (isNaN(val)) return;

    if (lastCumulativeOperation === 'minus') {
        cumulativeMemory -= val;
    } else {
        cumulativeMemory = val;
        lastCumulativeOperation = 'minus';
    }
    resetNext = true;
    updateDisplay(cumulativeMemory);
});

btnChangeColor.addEventListener('click', () => {
    colorIndex = (colorIndex + 1) % screenColors.length;
    resultDisplay.style.backgroundColor = screenColors[colorIndex];
});

themeSwitch.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
});

updateDisplay(currentInput);