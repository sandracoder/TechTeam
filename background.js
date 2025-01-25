const API_KEY = "AIzaSyCuOFb84muVbY5TUSP_gVegpt8OgHkF8Y0"; 
const SAFE_BROWSING_API = `https://safebrowsing.googleapis.com/v3/threatMatches:find?key=${API_KEY}`;

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    const url = details.url;

    // Fetching the threat data from Google Safe Browsing API
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

    if (!response.ok) {
      console.error('Error: Failed to fetch data');
      return;
    }

    const data = await response.json(); // Directly parse JSON

    // Sending data to popup or content script via messaging
    chrome.runtime.sendMessage({ status: data.matches ? "unsafe" : "safe" });
  },
  { urls: ["<all_urls>"] } // Ensure this matches the URLs you're monitoring
); // This is the end of the listener function
