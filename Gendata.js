document.getElementById('generate-btn').addEventListener('click', () => {
  const personInput = document.getElementById('person').value;
  const verbInput = document.getElementById('verb').value;
  const nounInput = document.getElementById('noun').value;

  // 支援半形與全形逗號
  const splitInput = (str) =>
    str
      .replace(/，/g, ',')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

  const persons = splitInput(personInput);
  const verbs = splitInput(verbInput);
  const nouns = splitInput(nounInput);

  const toObjects = (arr) =>
    arr.map((item) => ({
      name: item,
      text: item,
      image: ""
    }));

  const jsonData = {
    "人稱": toObjects(persons),
    "動詞": toObjects(verbs),
    "名詞": toObjects(nouns)
  };

  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "data.json";
  link.click();

  URL.revokeObjectURL(url);
});
