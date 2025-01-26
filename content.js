const suspiciousPhrases = [
    "Congratulations! You won",
    "Click here to claim",
    "Get your reward today",
    "Limited time offer",
    "Exclusive prize"
  ];
  
  const commentsPattern = /^[A-Z][a-z]+ [A-Z][a-z]+$/; // Example: Perfectly capitalized names like "John Doe".
  
  window.onload = () => {
    const bodyText = document.body.innerText.toLowerCase();
    const suspiciousContent = suspiciousPhrases.some((phrase) =>
      bodyText.includes(phrase.toLowerCase())
    );
  
    const suspiciousComments = [...document.querySelectorAll("div, span, p")].filter((el) =>
      commentsPattern.test(el.innerText.trim())
    );
  
    if (suspiciousContent || suspiciousComments.length > 0) {
      alert(
        "This website may be impersonating a trusted site. Avoid interacting with it!"
      );
    }
  };
  