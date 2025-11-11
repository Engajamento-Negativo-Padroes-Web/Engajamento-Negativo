function enviarFeedback() {
  const user_subject = document.getElementById("feedback-subject").value;
  const subject = "Feedback Engajamento Negativo - " + user_subject;
  const body = document.getElementById("feedback-body").value;
  const emails = "engajamentonegativo@gmail.com";

  if (!user_subject || !body) {
    alert("Por favor, preencha todos os campos.");
    return;
  } else {
    const mailtoLink = `mailto:${emails}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  }
}
