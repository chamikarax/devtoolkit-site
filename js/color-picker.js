// Get all elements
const colorPicker = document.getElementById('colorPicker');
const colorPreview = document.getElementById('colorPreview');
const hexValue = document.getElementById('hexValue');
const rgbValue = document.getElementById('rgbValue');
const hslValue = document.getElementById('hslValue');
const copyValueBtns = document.querySelectorAll('.copy-value-btn');
const complementaryPalette = document.getElementById('complementaryPalette');
const analogousPalette = document.getElementById('analogousPalette');
const triadicPalette = document.getElementById('triadicPalette');

// Current color in HSL format (for calculations)
let currentHSL = { h: 228, s: 75, l: 66 };

// Convert HEX to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Convert RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

// Convert HSL to HEX
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    
    if (h >= 0 && h < 60) {
        r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
        r = c; g = 0; b = x;
    }
    
    const toHex = (n) => {
        const hex = Math.round((n + m) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Update all color displays
function updateColor(hexColor) {
    // Update preview
    colorPreview.style.background = hexColor;
    
    // Convert to RGB
    const rgb = hexToRgb(hexColor);
    
    // Convert to HSL
    currentHSL = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Update displays
    hexValue.textContent = hexColor.toUpperCase();
    rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    hslValue.textContent = `hsl(${currentHSL.h}, ${currentHSL.s}%, ${currentHSL.l}%)`;
    
    // Generate palettes
    generatePalettes();
}

// Generate color palettes
function generatePalettes() {
    // Complementary colors (opposite on color wheel)
    const complementary = [
        currentHSL,
        { h: (currentHSL.h + 180) % 360, s: currentHSL.s, l: currentHSL.l }
    ];
    
    // Analogous colors (adjacent on color wheel)
    const analogous = [
        { h: (currentHSL.h - 30 + 360) % 360, s: currentHSL.s, l: currentHSL.l },
        currentHSL,
        { h: (currentHSL.h + 30) % 360, s: currentHSL.s, l: currentHSL.l }
    ];
    
    // Triadic colors (evenly spaced on color wheel)
    const triadic = [
        currentHSL,
        { h: (currentHSL.h + 120) % 360, s: currentHSL.s, l: currentHSL.l },
        { h: (currentHSL.h + 240) % 360, s: currentHSL.s, l: currentHSL.l }
    ];
    
    // Render palettes
    renderPalette(complementaryPalette, complementary);
    renderPalette(analogousPalette, analogous);
    renderPalette(triadicPalette, triadic);
}

// Render a palette
function renderPalette(container, colors) {
    container.innerHTML = '';
    
    colors.forEach(color => {
        const hex = hslToHex(color.h, color.s, color.l);
        
        const colorDiv = document.createElement('div');
        colorDiv.className = 'palette-color';
        colorDiv.style.background = hex;
        
        const label = document.createElement('span');
        label.className = 'palette-color-label';
        label.textContent = hex.toUpperCase();
        
        colorDiv.appendChild(label);
        
        // Click to copy
        colorDiv.addEventListener('click', function() {
            copyToClipboard(hex.toUpperCase());
            colorDiv.classList.add('copied');
            setTimeout(() => colorDiv.classList.remove('copied'), 500);
        });
        
        container.appendChild(colorDiv);
    });
}

// Copy to clipboard helper
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied:', text);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Color picker change event
colorPicker.addEventListener('input', function() {
    updateColor(this.value);
});

// Copy value buttons
copyValueBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const valueType = this.getAttribute('data-value');
        let textToCopy = '';
        
        switch(valueType) {
            case 'hex':
                textToCopy = hexValue.textContent;
                break;
            case 'rgb':
                textToCopy = rgbValue.textContent;
                break;
            case 'hsl':
                textToCopy = hslValue.textContent;
                break;
        }
        
        copyToClipboard(textToCopy);
        
        // Visual feedback
        const originalText = this.textContent;
        this.textContent = '✓';
        this.classList.add('copied');
        
        setTimeout(() => {
            this.textContent = originalText;
            this.classList.remove('copied');
        }, 2000);
    });
});

// Initialize with default color
updateColor(colorPicker.value);