// Get all elements
const jsonInput = document.getElementById('jsonInput');
const jsonOutput = document.getElementById('jsonOutput');
const formatBtn = document.getElementById('formatBtn');
const minifyBtn = document.getElementById('minifyBtn');
const clearBtn = document.getElementById('clearBtn');
const copyOutputBtn = document.getElementById('copyOutputBtn');
const validationStatus = document.getElementById('validationStatus');

// Validation Status Helper Functions
function showValidationStatus(isValid, message) {
    const statusIcon = validationStatus.querySelector('.status-icon');
    const statusText = validationStatus.querySelector('.status-text');
    
    // Remove all status classes
    validationStatus.classList.remove('valid', 'invalid');
    
    if (isValid === null) {
        // Neutral state
        statusIcon.textContent = 'ℹ️';
        statusText.textContent = message;
    } else if (isValid) {
        // Valid JSON
        validationStatus.classList.add('valid');
        statusIcon.textContent = '✅';
        statusText.textContent = message;
    } else {
        // Invalid JSON
        validationStatus.classList.add('invalid');
        statusIcon.textContent = '❌';
        statusText.textContent = message;
    }
}

// Format JSON Function
function formatJSON() {
    const input = jsonInput.value.trim();
    
    if (!input) {
        showValidationStatus(null, 'Please paste some JSON first!');
        jsonOutput.value = '';
        return;
    }
    
    try {
        // Parse the JSON (this validates it)
        const parsed = JSON.parse(input);
        
        // Stringify with indentation (2 spaces)
        const formatted = JSON.stringify(parsed, null, 2);
        
        // Display the formatted JSON
        jsonOutput.value = formatted;
        
        // Show success message
        showValidationStatus(true, 'Valid JSON! Formatted successfully ✨');
        
    } catch (error) {
        // JSON is invalid
        jsonOutput.value = '';
        
        // Extract error message
        let errorMessage = error.message;
        
        // Make error message more user-friendly
        if (errorMessage.includes('position')) {
            const position = errorMessage.match(/position (\d+)/);
            if (position) {
                errorMessage = `Syntax error at position ${position[1]}. Check for missing quotes, commas, or brackets.`;
            }
        }
        
        showValidationStatus(false, `Invalid JSON: ${errorMessage}`);
    }
}

// Minify JSON Function
function minifyJSON() {
    const input = jsonInput.value.trim();
    
    if (!input) {
        showValidationStatus(null, 'Please paste some JSON first!');
        jsonOutput.value = '';
        return;
    }
    
    try {
        // Parse the JSON (this validates it)
        const parsed = JSON.parse(input);
        
        // Stringify without indentation (minified)
        const minified = JSON.stringify(parsed);
        
        // Display the minified JSON
        jsonOutput.value = minified;
        
        // Show success message
        showValidationStatus(true, 'Valid JSON! Minified successfully 🗜️');
        
    } catch (error) {
        // JSON is invalid
        jsonOutput.value = '';
        
        // Extract error message
        let errorMessage = error.message;
        
        // Make error message more user-friendly
        if (errorMessage.includes('position')) {
            const position = errorMessage.match(/position (\d+)/);
            if (position) {
                errorMessage = `Syntax error at position ${position[1]}. Check for missing quotes, commas, or brackets.`;
            }
        }
        
        showValidationStatus(false, `Invalid JSON: ${errorMessage}`);
    }
}

// Clear Function
function clearAll() {
    jsonInput.value = '';
    jsonOutput.value = '';
    showValidationStatus(null, 'Paste JSON to validate');
}

// Copy Output Function
function copyOutput() {
    const output = jsonOutput.value;
    
    if (!output || output === 'Your formatted JSON will appear here...') {
        return;
    }
    
    navigator.clipboard.writeText(output).then(function() {
        const originalText = copyOutputBtn.textContent;
        copyOutputBtn.textContent = '✓ Copied!';
        copyOutputBtn.classList.add('copied');
        
        setTimeout(function() {
            copyOutputBtn.textContent = originalText;
            copyOutputBtn.classList.remove('copied');
        }, 2000);
    }).catch(function(err) {
        console.error('Failed to copy:', err);
    });
}

// Auto-validate as user types (with debounce)
let typingTimer;
const typingDelay = 1000; // 1 second

jsonInput.addEventListener('input', function() {
    clearTimeout(typingTimer);
    
    const input = jsonInput.value.trim();
    
    if (!input) {
        showValidationStatus(null, 'Paste JSON to validate');
        return;
    }
    
    typingTimer = setTimeout(function() {
        try {
            JSON.parse(input);
            showValidationStatus(true, 'Valid JSON! Click Format or Minify.');
        } catch (error) {
            let errorMessage = error.message;
            if (errorMessage.includes('position')) {
                const position = errorMessage.match(/position (\d+)/);
                if (position) {
                    errorMessage = `Syntax error at position ${position[1]}`;
                }
            }
            showValidationStatus(false, `Invalid JSON: ${errorMessage}`);
        }
    }, typingDelay);
});

// Event Listeners
formatBtn.addEventListener('click', formatJSON);
minifyBtn.addEventListener('click', minifyJSON);
clearBtn.addEventListener('click', clearAll);
copyOutputBtn.addEventListener('click', copyOutput);

// Keyboard shortcuts
jsonInput.addEventListener('keydown', function(e) {
    // Ctrl+Enter to format
    if (e.ctrlKey && e.key === 'Enter') {
        formatJSON();
    }
});