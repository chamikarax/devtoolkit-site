// Get all elements
const typeRadios = document.querySelectorAll('input[name="type"]');
const amountSlider = document.getElementById('amountSlider');
const amountValue = document.getElementById('amountValue');
const amountUnit = document.getElementById('amountUnit');
const startWithLorem = document.getElementById('startWithLorem');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const textOutput = document.getElementById('textOutput');

// Lorem Ipsum word bank
const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

// Classic Lorem Ipsum start
const classicStart = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

// Current type
let currentType = 'paragraphs';

// Update amount unit when type changes
typeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        currentType = this.value;
        updateAmountUnit();
    });
});

// Update amount value when slider moves
amountSlider.addEventListener('input', function() {
    amountValue.textContent = this.value;
});

// Update amount unit text
function updateAmountUnit() {
    amountUnit.textContent = currentType;
}

// Generate random word
function getRandomWord() {
    return loremWords[Math.floor(Math.random() * loremWords.length)];
}

// Generate sentence
function generateSentence(minWords = 8, maxWords = 15) {
    const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    let sentence = [];
    
    for (let i = 0; i < wordCount; i++) {
        sentence.push(getRandomWord());
    }
    
    // Capitalize first word
    sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
    
    return sentence.join(' ') + '.';
}

// Generate paragraph
function generateParagraph(minSentences = 4, maxSentences = 7) {
    const sentenceCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
    let paragraph = [];
    
    for (let i = 0; i < sentenceCount; i++) {
        paragraph.push(generateSentence());
    }
    
    return paragraph.join(' ');
}

// Generate words
function generateWords(count) {
    let words = [];
    
    for (let i = 0; i < count; i++) {
        words.push(getRandomWord());
    }
    
    // Capitalize first word
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    
    return words.join(' ') + '.';
}

// Main generate function
function generateText() {
    const amount = parseInt(amountSlider.value);
    const useClassicStart = startWithLorem.checked;
    let output = '';
    
    if (currentType === 'paragraphs') {
        let paragraphs = [];
        
        for (let i = 0; i < amount; i++) {
            if (i === 0 && useClassicStart) {
                paragraphs.push(classicStart);
            } else {
                paragraphs.push(generateParagraph());
            }
        }
        
        output = paragraphs.map(p => `<p>${p}</p>`).join('');
        
    } else if (currentType === 'sentences') {
        let sentences = [];
        
        for (let i = 0; i < amount; i++) {
            if (i === 0 && useClassicStart) {
                sentences.push(classicStart);
            } else {
                sentences.push(generateSentence());
            }
        }
        
        output = `<p>${sentences.join(' ')}</p>`;
        
    } else if (currentType === 'words') {
        if (useClassicStart && amount > 1) {
            // Start with classic, then add remaining words
            const remainingWords = amount - 1;
            const additionalWords = remainingWords > 0 ? ' ' + generateWords(remainingWords).replace(/\.$/, '') : '';
            output = `<p>${classicStart}${additionalWords}.</p>`;
        } else if (useClassicStart) {
            output = `<p>${classicStart}</p>`;
        } else {
            output = `<p>${generateWords(amount)}</p>`;
        }
    }
    
    textOutput.innerHTML = output;
}

// Copy to clipboard
function copyText() {
    const text = textOutput.innerText;
    
    if (!text || text === 'Click "Generate Text" to create Lorem Ipsum placeholder text...') {
        return;
    }
    
    navigator.clipboard.writeText(text).then(function() {
        const originalHTML = copyBtn.innerHTML;
        copyBtn.classList.add('copied');
        
        copyBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Copied!
        `;
        
        setTimeout(function() {
            copyBtn.innerHTML = originalHTML;
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(function(err) {
        console.error('Failed to copy:', err);
    });
}

// Event listeners
generateBtn.addEventListener('click', generateText);
copyBtn.addEventListener('click', copyText);

// Generate default text on load
window.addEventListener('load', generateText);