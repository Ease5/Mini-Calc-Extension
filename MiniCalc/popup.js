document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById('screen');
    const buttons = document.querySelectorAll('.btn');
    let calculation = '';
    
// --- KEYBOARD SUPPORT ---
document.addEventListener('keydown', (e) => {
    let key = e.key;

    // Map physical keys to our button labels
    if (key === 'Enter') key = '=';
    if (key === 'Escape' || key === 'Delete') key = 'AC';
    if (key === '*') key = '×';
    if (key === '/') key = '÷';
    if (key === '-') key = '−'; // Match the dash symbol in your HTML

    // Find the button that has the matching text
    const targetButton = Array.from(buttons).find(btn => 
        btn.innerText.trim() === key
    );

    if (targetButton) {
        e.preventDefault(); // Stop page from scrolling or other defaults
        targetButton.click(); // Trigger the existing click logic + ripple effect
    }
});
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Read 'label' attribute from the Material Component
            const val = e.target.innerText.trim();

            if (val === 'AC') {
                calculation = '';
                screen.innerText = '0';
            } 
            else if (val === '=') {
                if (!calculation) return;
                try {
                    // Clean symbols for the math engine
                    let mathString = calculation
                        .replace(/×/g, '*')
                        .replace(/÷/g, '/')
                        .replace(/−/g, '-');

                    const result = secureCalculate(mathString);
                    screen.innerText = result;
                    calculation = result.toString();
                } catch (err) {
                    screen.innerText = 'Error';
                    calculation = '';
                }
            } 
            else {
                if (calculation === '0' || calculation === '') calculation = val;
                else calculation += val;
                screen.innerText = calculation;
            }
        });
    });

    function secureCalculate(str) {
        const tokens = str.match(/(\d+\.?\d*)|([\+\-\*\/])/g);
        if (!tokens) return "0";
        let total = parseFloat(tokens[0]);
        for (let i = 1; i < tokens.length; i += 2) {
            const op = tokens[i];
            const next = parseFloat(tokens[i + 1]);
            if (isNaN(next)) continue;
            if (op === '+') total += next;
            if (op === '-') total -= next;
            if (op === '*') total *= next;
            if (op === '/') total = next !== 0 ? total / next : "Error";
        }
        return Number.isInteger(total) ? total : parseFloat(total.toFixed(4));
    }
});