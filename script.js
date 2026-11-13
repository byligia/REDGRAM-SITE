const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

$("#year").textContent = new Date().getFullYear();

const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
$$("nav a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const dialog = $("#enrollDialog");
function openEnroll(service) {
  if (service) $("#studentService").value = service;
  if (!dialog.open) dialog.showModal();
}
$$("[data-open-enroll]").forEach(btn => btn.addEventListener("click", () => openEnroll()));
$$("[data-enroll-service]").forEach(btn => btn.addEventListener("click", () => openEnroll(btn.dataset.enrollService)));

$("#enrollForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = [
    "Olá! Seja bem-vindo(a) ao atendimento do REDGRAM+.",
    "Gostaria de iniciar minha inscrição/atendimento.",
    `Nome: ${data.get("name")}`,
    `E-mail: ${data.get("email")}`,
    `Interesse: ${data.get("service")}`,
    data.get("message") ? `Mensagem: ${data.get("message")}` : ""
  ].filter(Boolean).join("\n");
  window.open(`https://wa.me/5598984560444?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  dialog.close();
});

const chatWindow = $("#chatWindow");
const chatMessages = $("#chatMessages");
function addMessage(text, who="bot") {
  const item = document.createElement("div");
  item.className = `message ${who}`;
  item.textContent = text;
  chatMessages.appendChild(item);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function answerChat(text) {
  const lower = text.toLowerCase();
  if (lower.includes("valor") || lower.includes("modalidade") || lower.includes("preço")) {
    return "Temos duas opções sugeridas:\n• Monitoria individual: aula online de 50 minutos, 1 dia por semana — R$ 150,00 mensal.\n• Correção avulsa: correção comentada de uma redação — R$ 30,00.\n\nPara iniciar, clique em “Fazer inscrição”.";
  }
  if (lower.includes("inscri") || lower.includes("matr")) {
    openEnroll();
    return "Que bom que deseja fazer parte do REDGRAM+! ✨ Abrimos o formulário de inscrição para você. Depois de preencher, sua mensagem será preparada no WhatsApp.";
  }
  if (lower.includes("equipe") || lower.includes("pessoa") || lower.includes("contato")) {
    return "Você pode falar com nossa equipe pelo WhatsApp: (98) 98456-0444 ou pelo e-mail redgramais@gmail.com. Será um prazer atender você!";
  }
  if (lower.includes("enem") || lower.includes("uema") || lower.includes("curso")) {
    return "O REDGRAM+ prepara estudantes para a redação do ENEM, da UEMA e de outros processos seletivos. Trabalhamos argumentação, repertório sociocultural, as cinco competências do ENEM, critérios UEMA e correções detalhadas.";
  }
  return "Obrigado pela mensagem! 😊 Posso ajudar com informações sobre o curso, modalidades, valores ou inscrição. Se preferir, fale diretamente com a equipe pelo WhatsApp (98) 98456-0444.";
}
function sendChat(text) {
  const clean = text.trim();
  if (!clean) return;
  addMessage(clean, "user");
  setTimeout(() => addMessage(answerChat(clean)), 250);
}
$("#chatLauncher").addEventListener("click", () => {
  chatWindow.hidden = false;
  $("#chatInput").focus();
});
$("#chatClose").addEventListener("click", () => chatWindow.hidden = true);
$("#chatForm").addEventListener("submit", event => {
  event.preventDefault();
  sendChat($("#chatInput").value);
  $("#chatInput").value = "";
});
$$("[data-chat]").forEach(button => button.addEventListener("click", () => sendChat(button.dataset.chat)));
