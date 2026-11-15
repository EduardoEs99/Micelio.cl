export const site = {
  name: "Revista Micelio",
  title: "Revista Micelio — El universo invisible",
  description:
    "Revista independiente chilena dedicada al reino Fungi: ciencia, bosque nativo, cultura y fotografía. Ediciones impresas y digitales, New Fungi, guías de funga y una red de colaboradores.",
  tagline: "La primera revista del reino Fungi",
  email: "editorial@revistamicelio.cl",
  url: "https://revistamicelio.cl",
  instagram: "https://www.instagram.com/revistamiceliochile/",
  youtube: "https://www.youtube.com/channel/UCXHDkIyOZLkRuWxUqhxNQDQ",
  locale: "es-CL",
};

export const mainNav = [
  { label: "Inicio", href: "/" },
  { label: "La Revista", href: "/la-revista" },
  { label: "New Fungi", href: "/new-fungi" },
  { label: "Fotografías", href: "/fotografias" },
  { label: "Auspicia", href: "/auspicia" },
];

export const revistaNav = [
  {
    label: "La Revista",
    href: "/la-revista",
    description: "Quiénes somos y qué nos mueve.",
  },
  {
    label: "Ediciones",
    href: "/ediciones",
    description: "Los números impresos y digitales.",
  },
  {
    label: "Actividades",
    href: "/actividades",
    description: "Packs y objetos de la revista.",
  },
  {
    label: "Red Micelio",
    href: "/red-micelio",
    description: "Guías de funga y red de distribución.",
  },
];

export const secondaryNav = [
  { label: "Suscripción", href: "/suscripcion" },
  { label: "Contacto", href: "/#contacto" },
  { label: "Mi cuenta", href: "/cuenta" },
  { label: "Términos y condiciones", href: "/terminos" },
];

export const socials = [
  { label: "Instagram", href: site.instagram, handle: "@revistamiceliochile" },
  { label: "YouTube", href: site.youtube, handle: "Revista Micelio" },
  { label: "Correo", href: `mailto:${site.email}`, handle: site.email },
];
