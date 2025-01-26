const API_KEY = "AIzaSyBTnKDUi1jddiRqzC7qY9uAPcNmMHPwN-8";
const SAFE_BROWSING_API = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    const url = details.url;

    // Check the URL against Safe Browsing API
    const response = await fetch(SAFE_BROWSING_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: {
          clientId: "nocap-extension",
          clientVersion: "1.0"
        },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }]
        }
      })
    });

    const data = await response.json();
    if (data.matches) {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: () => alert("Warning! This website is flagged as unsafe. Avoid entering personal information.")
      });
    }
  },
  { urls: ["<all_urls>"] }
);
