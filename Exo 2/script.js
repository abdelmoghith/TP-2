document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const fileName = document.getElementById('fileName');
  const fileDetails = document.getElementById('fileDetails');
  const analysisType = document.getElementById('analysisType');
  const itemCount = document.getElementById('itemCount');
  const itemsList = document.getElementById('itemsList');
  const textContent = document.getElementById('textContent');
  const patternsInfo = document.getElementById('patternsInfo');
  const clearBtn = document.getElementById('clearBtn');

  let currentText = '';

  // Patterns for detection
  const patterns = {
    compound: {
      patterns: [
        { regex: /\b\w+[-]\w+\b/g, description: 'Words with hyphens' },
        { regex: /\b\w+\s+à\s+\w+\b/g, description: 'Words connected with "à"' },
        { regex: /\b\w+\s+de\s+\w+\b/g, description: 'Words connected with "de"' },
        { regex: /\b\w+\s+\w+ique\b/g, description: 'Words ending with "ique"' }
      ],
      description: `Compound words are detected using the following patterns:
        • Words connected with hyphens (e.g., avant-dernier)
        • Words connected with "à" (e.g., machine à laver)
        • Words connected with "de" (e.g., pomme de terre)
        • Words with specific suffixes (e.g., informatique biomédicale)`
    },
    named: {
      patterns: [
        { regex: /\b[A-Z][a-zéèêëîïôöûüç]+\b/g, description: 'Capitalized words' },
        { regex: /\b[A-Z][a-zéèêëîïôöûüç]+(?:\s+[A-Z][a-zéèêëîïôöûüç]+)*\b/g, description: 'Multiple capitalized words' }
      ],
      description: `Named entities are detected using the following patterns:
        • Capitalized words (e.g., Abderrahim)
        • Multiple capitalized words (e.g., New York)
        • Words starting with capital letters
        Note: This is a simplified detection and may require manual verification.`
    }
  };

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileName.textContent = file.name;
    fileDetails.textContent = `File: ${file.name} (${formatFileSize(file.size)})`;

    const reader = new FileReader();
    reader.onload = (event) => {
      currentText = event.target.result;
      textContent.textContent = currentText;
      analyzeText();
    };
    reader.readAsText(file);
  });

  analysisType.addEventListener('change', () => {
    updatePatternsInfo();
    analyzeText();
  });

  clearBtn.addEventListener('click', () => {
    fileInput.value = '';
    fileName.textContent = 'No file chosen';
    fileDetails.textContent = '';
    currentText = '';
    textContent.textContent = '';
    itemCount.textContent = '0';
    itemsList.innerHTML = '';
    updatePatternsInfo();
  });

  function analyzeText() {
    if (!currentText) return;

    const type = analysisType.value;
    const foundItems = new Set();
    let highlightedText = currentText;

    patterns[type].patterns.forEach(pattern => {
      const matches = currentText.match(pattern.regex) || [];
      matches.forEach(match => foundItems.add(match));
    });

    // Update the count and list
    itemCount.textContent = foundItems.size;
    itemsList.innerHTML = '';
    foundItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      itemsList.appendChild(li);
    });

    // Highlight matches in text
    foundItems.forEach(item => {
      const escapedItem = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedItem, 'g');
      highlightedText = highlightedText.replace(
        regex,
        `<span class="highlighted-${type}">${item}</span>`
      );
    });

    textContent.innerHTML = highlightedText;
  }

  function updatePatternsInfo() {
    const type = analysisType.value;
    patternsInfo.innerHTML = patterns[type].description.replace(/\n/g, '<br>');
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Initialize patterns info
  updatePatternsInfo();
});