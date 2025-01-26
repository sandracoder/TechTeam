document.getElementById("checkNow").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab.url;

const API_KEY = 'YOUR_API_KEY';
const SAFE_BROWSING_API = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

async function checkUrlWithGoogleSafeBrowsing(url) {
  // Check if the URL uses HTTPS
  if (!url.startsWith('https://')) {
    console.log('⚠️ The website does not use HTTPS.');
    return;
  }

  // Check if the SSL certificate is valid (basic check)
  const sslValid = await checkSSL(url);
  if (!sslValid) {
    console.log('⚠️ The SSL certificate for this website is not valid.');
    return;
  }

  // Proceed with Google Safe Browsing API check
  const response = await fetch(SAFE_BROWSING_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client: { clientId: 'nocap-extension', clientVersion: '1.0' },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }]
      }
    })
  });

  // Check if the response is successful
  if (!response.ok) {
    console.error(`Error: ${response.status} - ${response.statusText}`);
    return;
  }

  // Log the response text to see what you're receiving
  const text = await response.text();
  console.log('Response text:', text);

  try {
    // Attempt to parse the response as JSON
    const data = JSON.parse(text);
    console.log('Parsed JSON:', data);

    if (data.matches) {
      console.log('⚠️ This URL is flagged as unsafe.');
    } else {
      console.log('✅ This URL seems safe.');
    }
  } catch (error) {
    console.error('Failed to parse response as JSON:', error);
  }
}

// Function to check if the URL has a valid SSL certificate
async function checkSSL(url) {
  try {
    // Make a request to the URL with the 'https' protocol
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });

    // If the fetch is successful and returns a status code, it's a valid SSL
    return response.ok;
  } catch (error) {
    console.error('SSL check failed:', error);
    return false;
  }
}

// Example usage
const url = 'https://example.com';  // Replace with the URL you want to check
checkUrlWithGoogleSafeBrowsing(url);
