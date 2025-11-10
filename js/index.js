let sentence = [];

function updateSentenceBox() {
  const box = document.getElementById('sentence-box');
  if (box) box.textContent = sentence.join(' ');
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW';
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

async function loadSections() {
  try {
    const response = await fetch('data.json');
    const jsonData = await response.json();
    const groups = jsonData.groups;
    const container = document.getElementById('buttonContainer');
    container.innerHTML = '';

    groups.forEach((group, idx) => {
      // 建立區塊
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'section';
      sectionDiv.dataset.group = group.group;

      // 標題與 checkbox
      const titleDiv = document.createElement('div');
      titleDiv.className = 'section-title';
      titleDiv.innerHTML = `
        <label>
          <input type="checkbox" class="group-toggle" data-index="${idx}" ${group.isshow === 'Y' ? 'checked' : ''}>
          ${group.group}
        </label>
      `;
      sectionDiv.appendChild(titleDiv);

      // 按鈕群
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'button-group';
      if (group.isshow !== 'Y') buttonGroup.style.display = 'none';

      group.data.forEach(item => {
        const button = document.createElement('div');
        button.className = 'speak-button';
        button.innerHTML = `
          <img src="${item.image}" alt="${item.name}" />
          <div class="label">${item.name}</div>
        `;
        button.addEventListener('click', () => {
          const sentenceMode = document.getElementById('sentenceMode').checked;
          if (sentenceMode) {
            sentence.push(item.text);
            updateSentenceBox();
          } else {
            speak(item.text);
          }
        });
        buttonGroup.appendChild(button);
      });

      sectionDiv.appendChild(buttonGroup);
      container.appendChild(sectionDiv);
    });

    // 綁定 group checkbox
    document.querySelectorAll('.group-toggle').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const index = e.target.dataset.index;
        const groupEl = document.querySelectorAll('.button-group')[index];
        groupEl.style.display = e.target.checked ? 'flex' : 'none';
      });
    });

    // 播放句子
    document.getElementById('playButton').addEventListener('click', () => {
      if (sentence.length > 0) speak(sentence.join(''));
    });

    // 清除句子
    document.getElementById('clearButton').addEventListener('click', () => {
      sentence = [];
      updateSentenceBox();
    });

  } catch (error) {
    console.error('載入 JSON 失敗：', error);
  }
}

// iOS / iPadOS 初始化語音授權
window.addEventListener('click', () => {
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.speak(new SpeechSynthesisUtterance(''));
  }
}, { once: true });

window.addEventListener('DOMContentLoaded', loadSections);
