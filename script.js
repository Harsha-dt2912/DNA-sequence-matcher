let haystack = "", needle = "", haystackIndex = 0, comparisons = 0, steps = [], shiftTable = {}, matchIndices = [];
let automaticInterval = null;

function search() {
    haystack = document.getElementById('haystack').value.toUpperCase();
    needle = document.getElementById('needle').value.toUpperCase();

    if (!isValidDNA(haystack) || !isValidDNA(needle)) {
        alert("Please enter valid DNA sequences. Only 'A', 'G', 'T', 'C' characters are allowed.");
        return;
    }

    haystackIndex = 0;
    comparisons = 0;
    steps = [];
    matchIndices = [];

    if (!haystack || !needle) {
        alert("Please enter both DNA sequence and pattern.");
        return;
    }

    buildShiftTable();
    displayShiftTable();
    updateDisplay();
    logStep();
}

function isValidDNA(sequence) {
    const validChars = /^[AGTC]*$/i;
    return validChars.test(sequence);
}

function buildShiftTable() {
    shiftTable = {};
    const needleLength = needle.length;

    for (let i = 0; i < needleLength - 1; i++) {
        shiftTable[needle[i]] = needleLength - 1 - i;
    }

    shiftTable.default = needleLength;
}

function displayShiftTable() {
    const shiftTableBody = document.getElementById('shiftTable').getElementsByTagName('tbody')[0];
    shiftTableBody.innerHTML = '';

    for (const [char, shift] of Object.entries(shiftTable)) {
        const row = shiftTableBody.insertRow();
        const charCell = row.insertCell(0);
        const shiftCell = row.insertCell(1);
        charCell.textContent = char === 'default' ? 'Others' : char;
        shiftCell.textContent = shift;
    }
}

function startAutomaticSearch() {
    if (automaticInterval) {
        clearInterval(automaticInterval);
    }

    automaticInterval = setInterval(nextStep, 1000);
}

function stopAutomaticSearch() {
    clearInterval(automaticInterval);
    automaticInterval = null;
}

function nextStep() {
    if (!haystack || !needle) return;

    if (haystackIndex <= haystack.length - needle.length) {
        comparisons++;
        let match = true;
        let mismatchIndex = -1;

        for (let i = needle.length - 1; i >= 0; i--) {
            if (haystack[haystackIndex + i] !== needle[i]) {
                match = false;
                mismatchIndex = i;
                break;
            }
        }

        if (match) {
            matchIndices.push(haystackIndex);
            alert("Match found at index " + haystackIndex);
            haystackIndex += needle.length;
        } else {
            let char = haystack[haystackIndex + mismatchIndex];
            haystackIndex += shiftTable[char] || shiftTable.default;
        }

        updateDisplay();
        displayMatchIndices();
        logStep();
    } else {
        stopAutomaticSearch();
    }
}

function previousStep() {
    if (steps.length > 1) {
        steps.pop();
        let lastStep = steps[steps.length - 1];
        haystackIndex = lastStep.haystackIndex;
        comparisons = lastStep.comparisons;

        updateDisplay();
        displayMatchIndices();
    }
}

function reset() {
    document.getElementById('haystack').value = '';
    document.getElementById('needle').value = '';
    haystackIndex = 0;
    comparisons = 0;
    steps = [];
    matchIndices = [];
    shiftTable = {};

    document.getElementById('outputArea').innerText = 'No steps to display yet.';
    document.getElementById('shiftTable').getElementsByTagName('tbody')[0].innerHTML = '';
    document.getElementById('matchIndices').innerText = '';
    updateDisplay();

    stopAutomaticSearch();
}

function updateDisplay() {
    document.getElementById('haystackIndex').innerText = `${haystackIndex}/${haystack.length}`;
    document.getElementById('comparisons').innerText = comparisons;

    let highlightedHaystack = highlightMatch(haystack, haystackIndex, needle.length);
    let highlightedNeedle = highlightNeedle(needle, haystackIndex);

    let output = `Haystack:\n${highlightedHaystack}\n`;
    output += `Needle:\n${highlightedNeedle}\n`;
    output += `Match indices: ${matchIndices.join(', ') || 'No matches yet'}`;

    document.getElementById('outputArea').innerHTML = `<pre>${output}</pre>`;
}

function highlightMatch(text, startIndex, length) {
    let spacedText = addSpaces(text);
    let highlightedText = spacedText.slice(0, startIndex * 2) +
                          '<span class="highlight">' +
                          spacedText.slice(startIndex * 2, startIndex * 2 + length * 2 - 1) +
                          '</span>' +
                          spacedText.slice(startIndex * 2 + length * 2 - 1);
    return highlightedText;
}

function highlightNeedle(needle, offset) {
    let spaces = '&nbsp;'.repeat(offset * 2);
    return `${spaces}${'<span class="highlight">' + addSpaces(needle) + '</span>'}`;
}

function addSpaces(text) {
    return text.split('').join(' ');
}

function logStep() {
    steps.push({
        haystackIndex: haystackIndex,
        comparisons: comparisons
    });
}

function displayMatchIndices() {
    const indicesText = matchIndices.length ? matchIndices.join(', ') : 'No matches yet';
    document.getElementById('matchIndices').innerText = `Match indices: ${indicesText}`;
}
