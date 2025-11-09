let sentence = [];

function updateSentenceBox() {
  const box = document.getElementById("sentence-box");
  if (box) box.textContent = sentence.join(" ");
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-TW";
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

async function loadSections() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    const container = document.getElementById("buttonContainer");
    container.innerHTML = "";

    Object.keys(data).forEach((category) => {
      const sectionDiv = document.createElement("div");
      sectionDiv.className = "section";

      const title = document.createElement("h2");
      title.textContent = category;
      sectionDiv.appendChild(title);

      const buttonContainer = document.createElement("div");
      buttonContainer.className = "button-container";

      data[category].forEach((item) => {
        const button = document.createElement("div");
        button.className = "speak-button";
        button.innerHTML = `
          <img src="${item.image}" alt="${item.name}" />
          <div class="label">${item.name}</div>
        `;

        button.addEventListener("click", () => {
          const sentenceMode = document.getElementById("sentenceMode").checked;

          if (sentenceMode) {
            sentence.push(item.text);
            updateSentenceBox();
          } else {
            speak(item.text);
          }
        });

        buttonContainer.appendChild(button);
      });

      sectionDiv.appendChild(buttonContainer);
      container.appendChild(sectionDiv);
    });

    // 播放全部句子
    document.getElementById("playButton").addEventListener("click", () => {
      if (sentence.length > 0) speak(sentence.join(""));
    });

    // 清除句子
    document.getElementById("clearButton").addEventListener("click", () => {
      sentence = [];
      updateSentenceBox();
    });
  } catch (error) {
    console.error("載入 JSON 失敗：", error);
  }
}

document.addEventListener("DOMContentLoaded", loadSections);
