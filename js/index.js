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
      renderSections(data);
    });

  function renderSections(data) {
    data.forEach(section => {
      const sectionEl = document.createElement("div");
      sectionEl.className = "section";
      sectionEl.dataset.key = section.key;

      // 標題列（含「顯示」checkbox）
      const title = document.createElement("div");
      title.className = "section-title";

      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = section.isshow === "Y";
      chk.className = "toggle-section";

      const ttl = document.createElement("span");
      ttl.textContent = section.title;

      title.appendChild(chk);
      title.appendChild(ttl);
      sectionEl.appendChild(title);

      // 按鈕群組
      const group = document.createElement("div");
      group.className = "button-group";

      section.items.forEach(item => {
        const btn = document.createElement("div");
        btn.className = "speak-button";

        btn.innerHTML = `
          <img src="${item.icon}" />
          <div class="label">${item.label}</div>
        `;

        btn.addEventListener("click", () => handleSpeak(item));
        group.appendChild(btn);
      });

      sectionEl.appendChild(group);
      buttonContainer.appendChild(sectionEl);

      // 顯示/隱藏語詞按鈕
      chk.addEventListener("change", () => {
        updateSectionVisibility(sectionEl);
        if (expandMode.checked) collapseAll();
      });

      // 點擊 section → 展開/收回（僅展開模式時）
      sectionEl.addEventListener("click", e => {
        if (!expandMode.checked) return;              // 展開模式 OFF
        if (!chk.checked) return;                    // isshow 未勾 → 不可展開
        if (e.target.tagName === "INPUT") return;    // 避免點到 checkbox 觸發展開

        toggleSection(sectionEl);
      });

      // 初始依據 isshow
      updateSectionVisibility(sectionEl);
    });
  }

  // 處理朗讀 / 加入句子
  function handleSpeak(item) {
    if (sentenceMode.checked) {
      sentenceBox.textContent += item.label + " ";
    } else {
      speak(item.label);
    }
  }

  // 播放文字語音
  function speak(text) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-TW";
    speechSynthesis.speak(u);
  }

  // === 展開/收合邏輯 ===
  function toggleSection(section) {
    if (currentExpandedSection === section) {
      section.classList.remove("expanded");
      currentExpandedSection = null;
      return;
    }

    collapseAll();
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

  // 控制 isshow（語詞是否顯示）
  function updateSectionVisibility(section) {
    const checked = section.querySelector(".toggle-section").checked;

    if (checked) {
      section.classList.remove("hidden-section");
    } else {
      section.classList.add("hidden-section");
    }

    if (!expandMode.checked) {
      // 展開模式 OFF → 全部正常顯示（不縮）
      section.classList.remove("collapsed");
      section.classList.remove("expanded");
    }
  }

  // === 展開模式切換 ===
  expandMode.addEventListener("change", () => {
    if (!expandMode.checked) {
      // 關閉展開模式 → 全恢復正常大小
      document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("collapsed");
        sec.classList.remove("expanded");
      });
      currentExpandedSection = null;
    } else {
      // 開啟展開模式 → 所有 isshow=Y 的 section 都先縮起來
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
