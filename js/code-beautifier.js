// Get all elements
const tabButtons = document.querySelectorAll('.tab-btn');
const codeInput = document.getElementById('codeInput');
const codeOutput = document.getElementById('codeOutput');
const beautifyBtn = document.getElementById('beautifyBtn');
const clearBtn = document.getElementById('clearBtn');
const copyOutputBtn = document.getElementById('copyOutputBtn');

// Track current language
let currentLanguage = 'html';

// Tab switching functionality
tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Update current language
        currentLanguage = this.getAttribute('data-lang');
        
        // Clear inputs when switching tabs
        codeInput.value = '';
        codeOutput.value = '';
        
        // Update placeholder based on language
        updatePlaceholder();
    });
});

// Update placeholder text based on selected language
function updatePlaceholder() {
    const placeholders = {
        html: `Paste your messy HTML code here...

Example:
<div><h1>Hello</h1><p>World</p></div>`,
        
        css: `Paste your messy CSS code here...

Example:
body{margin:0;padding:0;font-family:Arial;}`,
        
        javascript: `Paste your messy JavaScript code here...

Example:
function hello(){console.log('Hi');return true;}`
    };
    
    codeInput.placeholder = placeholders[currentLanguage] || placeholders.html;
}

// HTML Beautifier Function
function beautifyHTML(code) {
    let formatted = '';
    let indent = 0;
    const tab = '  '; // 2 spaces
    
    // Remove extra whitespace
    code = code.trim().replace(/>\s+</g, '><');
    
    // Split by tags
    const tags = code.match(/<[^>]+>|[^<]+/g) || [];
    
    tags.forEach(tag => {
        if (tag.match(/^<\/\w/)) {
            // Closing tag
            indent--;
            formatted += tab.repeat(Math.max(0, indent)) + tag + '\n';
        } else if (tag.match(/^<\w[^>]*[^\/]>$/)) {
            // Opening tag
            formatted += tab.repeat(indent) + tag + '\n';
            indent++;
        } else if (tag.match(/^<\w[^>]*\/>$/)) {
            // Self-closing tag
            formatted += tab.repeat(indent) + tag + '\n';
        } else if (tag.trim()) {
            // Text content
            formatted += tab.repeat(indent) + tag.trim() + '\n';
        }
    });
    
    return formatted.trim();
}

// CSS Beautifier Function
function beautifyCSS(code) {
    let formatted = '';
    
    // Remove extra whitespace
    code = code.replace(/\s+/g, ' ').trim();
    
    // Add line breaks after { } and ;
    formatted = code
        .replace(/\{/g, ' {\n  ')
        .replace(/\}/g, '\n}\n\n')
        .replace(/;/g, ';\n  ')
        .replace(/\n\s+\n/g, '\n');
    
    // Fix indentation
    const lines = formatted.split('\n');
    let indent = 0;
    formatted = '';
    
    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        if (line.includes('}')) {
            indent--;
        }
        
        formatted += '  '.repeat(Math.max(0, indent)) + line + '\n';
        
        if (line.includes('{')) {
            indent++;
        }
    });
    
    return formatted.trim();
}

// JavaScript Beautifier Function
function beautifyJavaScript(code) {
    let formatted = '';
    let indent = 0;
    const tab = '  ';
    
    // Remove extra whitespace
    code = code.replace(/\s+/g, ' ').trim();
    
    // Add line breaks
    code = code
        .replace(/\{/g, ' {\n')
        .replace(/\}/g, '\n}\n')
        .replace(/;/g, ';\n')
        .replace(/\n\s+\n/g, '\n');
    
    // Fix indentation
    const lines = code.split('\n');
    
    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        // Decrease indent for closing braces
        if (line.startsWith('}')) {
            indent = Math.max(0, indent - 1);
        }
        
        formatted += tab.repeat(indent) + line + '\n';
        
        // Increase indent for opening braces
        if (line.endsWith('{')) {
            indent++;
        }
    });
    
    return formatted.trim();
}

// Main Beautify Function
function beautifyCode() {
    const code = codeInput.value.trim();
    
    if (!code) {
        codeOutput.value = 'Please enter some code first!';
        return;
    }
    
    let beautified = '';
    
    try {
        switch(currentLanguage) {
            case 'html':
                beautified = beautifyHTML(code);
                break;
            case 'css':
                beautified = beautifyCSS(code);
                break;
            case 'javascript':
                beautified = beautifyJavaScript(code);
                break;
            default:
                beautified = code;
        }
        
        codeOutput.value = beautified;
    } catch (error) {
        codeOutput.value = 'Error formatting code. Please check your syntax.';
        console.error('Beautify error:', error);
    }
}

// Clear Function
function clearAll() {
    codeInput.value = '';
    codeOutput.value = '';
}

// Copy Output Function
function copyOutput() {
    const output = codeOutput.value;
    
    if (!output || output === 'Your beautified code will appear here...') {
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

// Event Listeners
beautifyBtn.addEventListener('click', beautifyCode);
clearBtn.addEventListener('click', clearAll);
copyOutputBtn.addEventListener('click', copyOutput);

// Allow Enter key to beautify (Ctrl+Enter)
codeInput.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        beautifyCode();
    }
});