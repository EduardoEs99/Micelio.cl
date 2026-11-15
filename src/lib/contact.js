export const contactReasons = [
  "Consulta general",
  "Colaboración editorial",
  "Envío de fotografías",
  "Auspicios",
  "Distribución",
  "Suscripciones",
  "Otros",
];

export const contactEmail = "editorial@revistamicelio.cl";

export const mailtoFor = (subject, body) =>
  `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
