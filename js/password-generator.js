// Get all the elements we need from the HTML
const passwordDisplay = document.getElementById('passwordDisplay');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const includeUppercase = document.getElementById('includeUppercase');
const includeLowercase = document.getElementById('includeLowercase');
const includeNumbers = document.getElementById('includeNumbers');
const includeSymbols = document.getElementById('includeSymbols');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const strengthText = document.getElementById('strengthText');
const strengthFill = document.getElementById('strengthFill');

// Character sets for password generation
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Update the length value display when slider moves
lengthSlider.addEventListener('input', function() {
    lengthValue.textContent = lengthSlider.value;
});

// Generate Password Function
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let charset = '';
    let password = '';
    
    // Build the character set based on selected options
    if (includeUppercase.checked) charset += uppercaseChars;
    if (includeLowercase.checked) charset += lowercaseChars;
    if (includeNumbers.checked) charset += numberChars;
    if (includeSymbols.checked) charset += symbolChars;
    
    // If no options selected, show error
    if (charset === '') {
        passwordDisplay.textContent = 'Please select at least one option!';
        passwordDisplay.classList.remove('generated');
        return;
    }
    
    // Generate random password
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    // Display the password
    passwordDisplay.textContent = password;
    passwordDisplay.classList.add('generated');
    
    // Calculate and display strength
    calculateStrength(password);
}

// Calculate Password Strength
function calculateStrength(password) {
    let strength = 0;
    
    // Check length
    if (password.length >= 12) strength += 2;
    else if (password.length >= 8) strength += 1;
    
    // Check for different character types
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    // Display strength
    strengthFill.classList.remove('weak', 'medium', 'strong');
    
    if (strength <= 3) {
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#f44336';
        strengthFill.classList.add('weak');
    } else if (strength <= 5) {
        strengthText.textContent = 'Medium';
        strengthText.style.color = '#ff9800';
        strengthFill.classList.add('medium');
    } else {
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#4caf50';
        strengthFill.classList.add('strong');
    }
}

// Copy to Clipboard Function
function copyToClipboard() {
    const password = passwordDisplay.textContent;
    
    // Don't copy if no password generated
    if (password === 'Click Generate to create a password' || password === 'Please select at least one option!') {
        return;
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(password).then(function() {
        // Change button text temporarily
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        copyBtn.classList.add('copied');
        
        // Reset after 2 seconds
        setTimeout(function() {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(function(err) {
        console.error('Failed to copy:', err);
    });
}

// Event Listeners
generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyToClipboard);

// Generate a password automatically on page load
window.addEventListener('load', generatePassword);