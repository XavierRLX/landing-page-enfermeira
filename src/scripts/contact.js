const WHATSAPP_NUMBER = "5521964679031";

const GENERAL_MESSAGE =
  "Olá, Maria Thereza! Gostaria de saber mais sobre os serviços de enfermagem e agendar um atendimento.";

function whatsappUrl(message) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}

function configureContactLink(element, message) {
  element.href = whatsappUrl(message);
  element.target = "_blank";
  element.rel = "noopener noreferrer";
}

export function initializeContacts() {
  document.querySelectorAll("[data-whatsapp]").forEach((element) => {
    configureContactLink(element, GENERAL_MESSAGE);
  });

  document.querySelectorAll("[data-service]").forEach((element) => {
    configureContactLink(
      element,
      "Olá, Maria Thereza! Gostaria de conversar sobre " + element.dataset.service + ".",
    );
  });
}
