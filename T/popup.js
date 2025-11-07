document.addEventListener("DOMContentLoaded", async () => {
  const wordEl = document.getElementById("word");
  const meaningEl = document.getElementById("meaning");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString().trim()
    });

    const text = result;
    if (!text) {
      wordEl.textContent = "(No word selected)";
      meaningEl.textContent = "Select a single English word first.";
      return;
    }

    wordEl.textContent = text;

    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`);
    if (!response.ok) throw new Error("No meaning found");

    const data = await response.json();
    const meaning = data[0]?.meanings?.[0]?.definitions?.[0]?.definition;

    meaningEl.textContent = meaning || "No definition found.";
  } catch (err) {
    console.error(err);
    meaningEl.textContent = "Error fetching meaning.";
  }
});
