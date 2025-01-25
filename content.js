const suspiciousPhrases = [
  "Congratulations! You won",
  "Click here to claim",
  "Get your reward today",
  "Limited time offer",
  "Exclusive prize",
  "You are the winner",
  "You have been selected",
  "You are the lucky winner",
  "You have been chosen",
  "You are the 100,000th visitor",
  "Share it to five groups to claim your prize",
  "Share it to ten groups to claim your prize"
];

const commentsPattern = /^[A-Z][a-z]+ [A-Z][a-z]+$/; 
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