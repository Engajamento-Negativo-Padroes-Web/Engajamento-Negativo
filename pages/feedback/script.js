function enviarFeedback() {
  const type = document.getElementById("feedback-type").value;
  const user_subject = document.getElementById("feedback-subject").value;
  const bodyInput = document.getElementById("feedback-body").value;
  const emails = "engajamentonegativo@gmail.com";

 
  if (!type || !user_subject || !bodyInput) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const subject = "Feedback Engajamento Negativo - " + user_subject;
  
  const finalBody = `Tipo de Mensagem: ${type}\n\nConteúdo:\n${bodyInput}`;

  const mailtoLink = `mailto:${emails}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(finalBody)}`;
  
  window.open(mailtoLink);
}