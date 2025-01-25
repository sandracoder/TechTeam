document.getElementById("checkNow").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  const API_KEY = "AIzaSyCuOFb84muVbY5TUSP_gVegpt8OgHkF8Y0";
  const SAFE_BROWSING_API = `https://safebrowsing.googleapis.com/v3/threatMatches:find?key=${API_KEY}`;

  const response = await fetch(SAFE_BROWSING_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client: { clientId: "nocap-extension", clientVersion: "1.0" },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url }]
      }
    })
  });

  const data = await response.json();
  const statusElement = document.getElementById("status");

  if (data.matches) {
    statusElement.textContent = "⚠️ Warning: This website is flagged as unsafe!";
    statusElement.style.color = "red";
  } else {
    statusElement.textContent = "✅ This website seems safe.";
    statusElement.style.color = "green";
  }
});