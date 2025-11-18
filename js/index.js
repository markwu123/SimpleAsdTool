let sentence = [];

// 更新句子顯示
function updateSentenceBox() {
  const box = document.getElementById('sentence-box');
  if (box) box.textContent = sentence.join(' ');
}

// 語音播放
function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-TW';
  speechSynthesis.speak(u);
}

// 播放音檔或語音
function playAudioOrTTS(audioPath, text) {
  if (audioPath && typeof audioPath === 'string' && audioPath.trim() !== "") {
    const audio = new Audio(audioPath);
    audio.play().catch(() => {
      console.warn("播放 MP3 失敗，改用語音合成");
      speak(text);
    });
  } else {
    speak(text);
  }
}

// 載入資料並建立 UI
async function loadSections() {
  try {
    const response = await fetch('data.json');
    const json = await response.json();
    const groups = json.groups || [];
    const container = document.getElementById('buttonContainer');
    container.innerHTML = '';

    groups.forEach((group, idx) => {
      // section 外層
      const sec = document.createElement('div');
      sec.className = 'section collapsed';
      sec.dataset.index = idx;

      // header: Expand checkbox + 標題 + Show checkbox
      const header = document.createElement('div');
      header.className = 'section-header';
      header.innerHTML = `
        <label style="margin-right:12px;">
          <input type="checkbox" class="section-expand" data-index="${idx}">
          展開
        </label>
        <strong style="flex:1; text-align:left;">${group.group}</strong>
        <label style="margin-left:12px;">
          <input type="checkbox" class="section-show" data-index="${idx}" ${group.isshow === 'Y' ? 'checked' : ''}>
          顯示
        </label>
      `;
      // 使 header 內元素水平排列（若需要可用 CSS）
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.gap = '8px';
      sec.appendChild(header);

      // 按鈕群
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'button-group';
      // 根據 isshow 決定初始顯示
      if (group.isshow !== 'Y') buttonGroup.style.display = 'none';

      // 建立每個按鈕
      group.data.forEach(item => {
        const btn = document.createElement('div');
        btn.className = 'speak-button';
        btn.innerHTML = `
          <img src="${item.image || ''}" alt="${item.name || ''}" />
          <div class="label">${item.name || ''}</div>
        `;
        // 點擊按鈕：句子模式 or 立即播放
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation(); // 阻止 header 或 section 的 click 事件
          const sentenceMode = document.getElementById('sentenceMode').checked;
          if (sentenceMode) {
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

    // 綁定所有控制行為
    bindSectionControls();

    // 綁定播放與清除按鈕
    const playBtn = document.getElementById('playButton');
    const clearBtn = document.getElementById('clearButton');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (sentence.length > 0) speak(sentence.join(''));
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        sentence = [];
        updateSentenceBox();
      });
    }

  } catch (err) {
    console.error('載入 data.json 發生錯誤：', err);
  }
}

// 綁定 section 的 Expand / Show 控制邏輯
function bindSectionControls() {
  const sections = Array.from(document.querySelectorAll('.section'));
  const expandChecks = Array.from(document.querySelectorAll('.section-expand'));
  const showChecks = Array.from(document.querySelectorAll('.section-show'));

  // Expand checkbox 行為：勾選該 checkbox => 展開該 section（並收回其他）
  expandChecks.forEach((chk, idx) => {
    chk.addEventListener('change', (e) => {
      const checked = e.target.checked;
      const targetSec = sections[idx];

      if (checked) {
        // 取消其他所有 expand 勾選並收回（確保一次只展開一個）
        expandChecks.forEach((otherChk, oi) => {
          if (oi !== idx) {
            otherChk.checked = false;
            sections[oi].classList.remove('expanded');
            sections[oi].classList.add('collapsed');
          }
        });

        // 若該 section 的 show 是 false（按鈕隱藏），就先顯示按鈕
        const showChk = showChecks[idx];
        if (showChk && !showChk.checked) {
          showChk.checked = true;
          sections[idx].querySelector('.button-group').style.display = 'flex';
        }

        // 展開 target
        targetSec.classList.remove('collapsed');
        targetSec.classList.add('expanded');

      } else {
        // 取消勾選 -> 收回（縮成工具列）
        targetSec.classList.remove('expanded');
        targetSec.classList.add('collapsed');
      }
    });
  });

  // Show checkbox 行為：控制 button-group 顯示與否
  showChecks.forEach((chk, idx) => {
    chk.addEventListener('change', (e) => {
      const checked = e.target.checked;
      const targetSec = sections[idx];
      const btnGroup = targetSec.querySelector('.button-group');

      if (checked) {
        btnGroup.style.display = 'flex';
      } else {
        // 隱藏按鈕群時，同時若該 section 正在展開則收回（避免空白展開）
        btnGroup.style.display = 'none';
        const expandChk = expandChecks[idx];
        if (expandChk && expandChk.checked) {
          expandChk.checked = false;
          targetSec.classList.remove('expanded');
          targetSec.classList.add('collapsed');
        }
      }
    });
  });

  // 若需要：讓點擊 section header 也可觸發 expand（但仍以 expand checkbox 為準）
  sections.forEach((sec, idx) => {
    sec.addEventListener('click', (e) => {
      // 若點擊的是按鈕，已被 btn 的 handler stopPropagation；此處只對 header/空白區有效
      const expandChk = expandChecks[idx];
      if (!expandChk) return;

      // 如果 expand checkbox 沒被勾選，不做任何事（強制以 checkbox 為開關）
      // 如果你要允許點擊 header 切換 expand，可以改為： expandChk.checked = !expandChk.checked; expandChk.dispatchEvent(new Event('change'));
      // 目前遵循你的要求：展開由 checkbox 控制，所以這裡不自動切換。
    });
  });
}

// iOS 語音初始化互動授權
window.addEventListener('click', () => {
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.speak(new SpeechSynthesisUtterance(''));
  }
}, { once: true });

// 初始化
window.addEventListener('DOMContentLoaded', loadSections);
