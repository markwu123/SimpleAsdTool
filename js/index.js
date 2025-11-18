let sentence = [];

// 更新句子顯示區
function updateSentenceBox() {
  const box = document.getElementById('sentence-box');
  if (box) box.textContent = sentence.join(' ');
}

// 語音播放
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW';
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

// 播放音訊或語音（根據 audio 是否存在）
function playAudioOrTTS(audioPath, text) {
  if (audioPath && audioPath.trim() !== '') {
    const audio = new Audio(audioPath);
    audio.play().catch(() => {
      console.warn("🎧 播放 MP3 失敗，改用語音合成");
      speak(text);
    });
  } else {
    speak(text);
  }
}

// 放大縮小區塊
function enableSectionZoom() {
  const sections = document.querySelectorAll('.section');

  sections.forEach(sec => {
    sec.addEventListener('click', function (e) {

      // 避免點到按鈕時啟動縮放
      if (e.target.closest(".speak-button")) return;

      // 若已經是展開狀態 → 點擊時縮回
      if (sec.classList.contains('expanded')) {
        sec.classList.remove('expanded');
        return;
      }

      // 收起所有 section
      sections.forEach(s => s.classList.remove('expanded'));

      // 展開目前這個
      sec.classList.add('expanded');
    });
  });
}

// 載入 JSON 並建立畫面
async function loadSections() {
  try {
    const response = await fetch('data.json');
    const jsonData = await response.json();
    const groups = jsonData.groups;
    const container = document.getElementById('buttonContainer');
    container.innerHTML = '';

    groups.forEach((group, idx) => {
      // 建立群組容器
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'section';
      sectionDiv.dataset.group = group.group;

      // 群組標題 + checkbox
      const titleDiv = document.createElement('div');
      titleDiv.className = 'section-title';
      titleDiv.innerHTML = `
        <label>
          <input type="checkbox" class="group-toggle" data-index="${idx}" ${group.isshow === 'Y' ? 'checked' : ''}>
          ${group.group}
        </label>
      `;
      sectionDiv.appendChild(titleDiv);

      // 群組按鈕
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
            playAudioOrTTS(item.audio, item.text);
          }
        });
        buttonGroup.appendChild(button);
      });

      sectionDiv.appendChild(buttonGroup);
      container.appendChild(sectionDiv);
    });

    // 綁定群組 checkbox 開關
    document.querySelectorAll('.group-toggle').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const index = e.target.dataset.index;
        const groupEl = document.querySelectorAll('.button-group')[index];
        groupEl.style.display = e.target.checked ? 'flex' : 'none';
      });
    });

    // 播放整句
    document.getElementById('playButton').addEventListener('click', () => {
      if (sentence.length > 0) speak(sentence.join(''));
    });

    // 清除句子
    document.getElementById('clearButton').addEventListener('click', () => {
      sentence = [];
      updateSentenceBox();
    });

    // ⭐ 載入後啟用縮放功能
    enableSectionZoom();

  } catch (error) {
    console.error('❌ 載入 JSON 失敗：', error);
  }
}

// iOS 初始化語音授權
window.addEventListener('click', () => {
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.speak(new SpeechSynthesisUtterance(''));
  }
}, { once: true });

// 初始化
window.addEventListener('DOMContentLoaded', loadSections);
