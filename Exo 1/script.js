document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const fileName = document.getElementById('fileName');
  const fileDetails = document.getElementById('fileDetails');
  const searchWord = document.getElementById('searchWord');
  const searchBtn = document.getElementById('searchBtn');
  const occurrenceCount = document.getElementById('occurrenceCount');
  const positionSelect = document.getElementById('positionSelect');
  const lettersBefore = document.getElementById('lettersBefore');
  const lettersAfter = document.getElementById('lettersAfter');
  const showContextBtn = document.getElementById('showContextBtn');
  const textContent = document.getElementById('textContent');
  const clearBtn = document.getElementById('clearBtn');

  let currentText = '';
  let searchResults = [];

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileName.textContent = file.name;
    fileDetails.textContent = `File: ${file.name} (${formatFileSize(file.size)})`;

    const reader = new FileReader();
    reader.onload = (event) => {
      currentText = event.target.result;
      textContent.textContent = currentText;
      clearSearch();
    };
    reader.readAsText(file);
  });

  searchBtn.addEventListener('click', () => {
    const word = searchWord.value.trim();
    if (!word || !currentText) return;

    searchResults = [];
    let position = currentText.toLowerCase().indexOf(word.toLowerCase());
    
    while (position !== -1) {
      searchResults.push(position);
      position = currentText.toLowerCase().indexOf(word.toLowerCase(), position + 1);
    }

    occurrenceCount.textContent = searchResults.length;
    updatePositionSelect();
    highlightSearchWord();
  });

  showContextBtn.addEventListener('click', () => {
    const selectedPosition = parseInt(positionSelect.value);
    if (isNaN(selectedPosition)) return;

    const before = parseInt(lettersBefore.value);
    const after = parseInt(lettersAfter.value);
    showLetterContext(selectedPosition, before, after);
  });

  clearBtn.addEventListener('click', () => {
    fileInput.value = '';
    fileName.textContent = 'No file chosen';
    fileDetails.textContent = '';
    searchWord.value = '';
    currentText = '';
    textContent.textContent = '';
    clearSearch();
  });

  function clearSearch() {
    searchResults = [];
    occurrenceCount.textContent = '0';
    positionSelect.innerHTML = '<option value="">Select position</option>';
    textContent.innerHTML = currentText;
  }

  function updatePositionSelect() {
    positionSelect.innerHTML = '<option value="">Select position</option>';
    searchResults.forEach((position, index) => {
      const option = document.createElement('option');
      option.value = position;
      option.textContent = `Position ${index + 1}`;
      positionSelect.appendChild(option);
    });
  }

  function highlightSearchWord() {
    const word = searchWord.value.trim();
    const regex = new RegExp(word, 'gi');
    const highlightedText = currentText.replace(regex, match => 
      `<span class="highlighted-search">${match}</span>`
    );
    textContent.innerHTML = highlightedText;
  }

  function showLetterContext(position, before, after) {
    const start = Math.max(0, position - before);
    const end = Math.min(currentText.length, position + searchWord.value.length + after);
    
    const beforeText = currentText.slice(start, position);
    const searchText = currentText.slice(position, position + searchWord.value.length);
    const afterText = currentText.slice(position + searchWord.value.length, end);

    const highlightedText = currentText.slice(0, start) +
      `<span class="highlighted-before">${beforeText}</span>` +
      `<span class="highlighted-search">${searchText}</span>` +
      `<span class="highlighted-after">${afterText}</span>` +
      currentText.slice(end);

    textContent.innerHTML = highlightedText;
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
});
