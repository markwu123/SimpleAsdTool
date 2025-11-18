document.addEventListener("DOMContentLoaded", () => {
  const sentenceBox = document.getElementById("sentence-box");
  const buttonContainer = document.getElementById("buttonContainer");
  const playButton = document.getElementById("playButton");
  const clearButton = document.getElementById("clearButton");
  const sentenceMode = document.getElementById("sentenceMode");
  const expandMode = document.getElementById("expandMode");

  let currentExpandedSection = null;

  // 讀取 data.json 產生按鈕
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      // data = { groups: [...] }  ← 你的 JSON
      renderSections(data.groups);
    });

  function renderSections(groups) {
    groups.forEach(section => {
      const sectionEl = document.createElement("div");
      sectionEl.className = "section";

      // 標題列（含 checkbox）
      const title = document.createElement("div");
      title.className = "section-title";

      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = section.isshow === "Y";
      chk.className = "toggle-section";

      const ttl = document.createElement("span");
      ttl.textContent = section.group;

      title.appendChild(chk);
      title.appendChild(ttl);
      sectionEl.appendChild(title);

      // 按鈕群組
      const group = document.createElement("div");
      group.className = "button-group";

      // ★ 修正 item 欄位對應：name/text/image → label/icon
      section.data.forEach(item => {
        const btn = document.createElement("div");
        btn.className = "speak-button";

        btn.innerHTML = `
          <img src="${item.image}" />
          <div class="label">${item.text}</div>
        `;

        // 點擊 → 說話 或 加入句子
        btn.addEventListener("click", (e) => {
        e.stopPropagation(); // 防止點擊圖示導致 section 被收回
        handleSpeak(item);
      });
        group.appendChild(btn);
      });

      sectionEl.appendChild(group);
      buttonContainer.appendChild(sectionEl);

      // "顯示" checkbox
      chk.addEventListener("change", () => {
        updateSectionVisibility(sectionEl);
        if (expandMode.checked) collapseAll();
      });

      // Section 點擊 → 展開/收合（只有展開模式）
      sectionEl.addEventListener("click", e => {
        if (!expandMode.checked) return;
        if (!chk.checked) return;
        if (e.target.tagName === "INPUT") return;

        toggleSection(sectionEl);
      });

      // 初始顯示模式
      updateSectionVisibility(sectionEl);
    });
  }

  // 加入句子 or 說話
function handleSpeak(item) {
  if (sentenceMode.checked) {
    sentenceBox.textContent += item.text + " ";
  } else {
    speak(item.text, item.lang);
  }
}

  // 語音播放
// 🔊 語音播放
function speak(text, langCode) {
  const u = new SpeechSynthesisUtterance(text);

  // 🔤 語系對照表（可自行再擴充）
  const LANG_MAP = {
    "zh": "zh-TW",    // 中文
    "nan": "nan-TW",  // 台語
    "hak": "hak-TW",  // 客語
    "pwn": "pwn-TW",  // 排灣語（原住民語示例）
    "ami": "ami-TW",  // 阿美語
    "bnn": "bnn-TW",  // 布農語
    "tay": "tay-TW",  // 泰雅語
    "tsu": "tsu-TW",  // 鄒族語
    "en": "en-US"     // 英文
  };

  // 預設使用中文
  let targetLang = LANG_MAP[langCode] || "zh-TW";

  // 📌 某些瀏覽器首次 getVoices() 會為空 → workaround
  const loadVoices = () => {
    const voices = speechSynthesis.getVoices();
    const hasVoice = voices.some(v => v.lang === targetLang);

    // 若該語言沒有支援 → fallback 中文
    if (!hasVoice && targetLang !== "zh-TW") {
      console.warn(`⚠️語音 ${targetLang} 不支援，改用 zh-TW`);
      targetLang = "zh-TW";
    }

    u.lang = targetLang;
    speechSynthesis.speak(u);
  };

  // 若 voices 還沒載入 → 等它載入後再執行
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = loadVoices;
  } else {
    loadVoices();
  }
}




  // === 展開邏輯 ===
function toggleSection(section) {
    if (currentExpandedSection === section) {
        section.classList.remove("expanded");
        section.classList.add("collapsed");
        currentExpandedSection = null;
        return;
    }

    // 收起全部
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("expanded");
        if (isSectionVisible(sec)) sec.classList.add("collapsed");
    });

    // 展開當前
    section.classList.remove("collapsed");
    section.classList.add("expanded");

    currentExpandedSection = section;
}

  function collapseAll() {
    document.querySelectorAll(".section").forEach(sec => {
      sec.classList.remove("expanded");
      if (isSectionVisible(sec)) sec.classList.add("collapsed");
      else sec.classList.remove("collapsed");
    });
  }

  function isSectionVisible(section) {
    return section.querySelector(".toggle-section").checked;
  }

  // 顯示/隱藏 section
  function updateSectionVisibility(section) {
    const checked = section.querySelector(".toggle-section").checked;

    if (checked) {
      section.classList.remove("hidden-section");
    } else {
      section.classList.add("hidden-section");
    }

    if (!expandMode.checked) {
      section.classList.remove("collapsed");
      section.classList.remove("expanded");
    }
  }

  // 展開模式切換
  expandMode.addEventListener("change", () => {
    if (!expandMode.checked) {
      document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("collapsed");
        sec.classList.remove("expanded");
      });
      currentExpandedSection = null;
    } else {
      collapseAll();
    }
  });

  // 清除句子
  clearButton.addEventListener("click", () => {
    sentenceBox.textContent = "";
  });

  // 播放句子
  playButton.addEventListener("click", () => {
    speak(sentenceBox.textContent.trim());
  });
});
