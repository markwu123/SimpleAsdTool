let sentence = [];

// 更新句子框
function updateSentenceBox() {
  const box = document.getElementById('sentence-box');
  if (box) box.textContent = sentence.join(' ');
}

// 語音
function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-TW';
  speechSynthesis.speak(u);
}

// 播放音檔或語音
function playAudioOrTTS(audioPath, text) {
  if (audioPath && audioPath.trim() !== "") {
    const audio = new Audio(audioPath);
    audio.play().catch(() => speak(text));
  } else {
    speak(text);
  }
}

// 載入資料
async function loadSections() {
  const response = await fetch('data.json');
  const json = await response.json();
  const groups = json.groups;

  const container = document.getElementById('buttonContainer');
  container.innerHTML = '';

  groups.forEach((group, idx) => {
    const sec = document.createElement('div');
    sec.className = 'section collapsed';

    // ✨ 新增：checkbox
    const titleRow = document.createElement('div');
    titleRow.className = 'section-header';
    titleRow.innerHTML = `
      <label>
        <input type="checkbox" class="section-check" data-index="${idx}">
        ${group.group}
      </label>
    `;
    sec.appendChild(titleRow);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    group.data.forEach(item => {
      const btn = document.createElement('div');
      btn.className = 'speak-button';
      btn.innerHTML = `
        <img src="${item.image}" />
        <div class="label">${item.name}</div>
      `;
      btn.addEventListener('click', () => {
        const enableSentence = document.getElementById('sentenceMode').checked;
        if (enableSentence) {
          sentence.push(item.text);
          updateSentenceBox();
        } else {
          playAudioOrTTS(item.audio, item.text);
        }
      });
      buttonGroup.appendChild(btn);
    });

    sec.appendChild(buttonGroup);
    container.appendChild(sec);
  });

  enableSectionZoom();
  enableCheckboxControl();
}

// ✨ 打勾控制展開 / 收回
function enableCheckboxControl() {
  const checks = document.querySelectorAll('.section-check');
  const sections = document.querySelectorAll('.section');

  checks.forEach((chk, i) => {
    chk.addEventListener('change', () => {
      const sec = sections[i];

      if (!chk.checked) {
        // ❗ 取消勾選 → 強制縮起
        sec.classList.remove('expanded');
        sec.classList.add('collapsed');
        return;
      }

      // ✔ 打勾 → 允許展開，但不會自動展開
      // 使用者必須「點一下 section」才會展開
    });
  });
}

// ✨ 點擊展開（採用 checkbox 狀態）
function enableSectionZoom() {
  const sections = document.querySelectorAll('.section');
  const checks = document.querySelectorAll('.section-check');

  sections.forEach((sec, idx) => {
    sec.addEventListener('click', function (e) {
      if (e.target.closest('.speak-button')) return;

      // ❗ 未打勾 → 不允許展開
      if (!checks[idx].checked) return;

      const isExpanded = sec.classList.contains('expanded');

      // 收起所有 section
      sections.forEach(s => {
        s.classList.remove('expanded');
        s.classList.add('collapsed');
      });

      // 如果剛剛是收起 → 現在展開它
      if (!isExpanded) {
        sec.classList.remove('collapsed');
        sec.classList.add('expanded');
      }
    });
  });
}

// 播放句子
document.getElementById('playButton').addEventListener('click', () => {
  if (sentence.length > 0) speak(sentence.join(''));
});

// 清除句子
document.getElementById('clearButton').addEventListener('click', () => {
  sentence = [];
  updateSentenceBox();
});

window.addEventListener('DOMContentLoaded', loadSections);
