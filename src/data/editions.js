import ed001Impreso from "@/assets/webp/covers/ed001-impresa.webp";
import ed001Online from "@/assets/webp/covers/ed001-online.webp";
import ed002Impreso from "@/assets/webp/covers/ed002-impresa.webp";
import ed002Online from "@/assets/webp/covers/ed002-online.webp";
import ed003Impreso from "@/assets/webp/covers/ed003-impresa.webp";
import ed003Online from "@/assets/webp/covers/ed003-online.webp";

export const editions = [
  {
    slug: "edicion-003-impresa",
    number: "003",
    title: "Edición 003 impresa",
    format: "Impreso",
    price: 19990,
    status: "Preventa",
    cover: ed003Impreso,
    coverAlt:
      "Portada de la edición 003 impresa de Revista Micelio con un hongo de textura porosa",
    summary:
      "La tercera edición de Revista Micelio en papel. Un número dedicado al reino Fungi desde el bosque chileno, con entrevistas, reportajes y fotografía editorial.",
    themes: [
      "Entrevista a Dinelly Soto",
      "Reportaje documental sobre la funga de Chile",
      "Fotografía del reino Fungi",
    ],
    featured: true,
  },
  {
    slug: "edicion-003-online",
    number: "003",
    title: "Edición 003 online",
    format: "Digital",
    price: 5000,
    status: "Disponible",
    cover: ed003Online,
    coverAlt: "Vista digital de la edición 003 de Revista Micelio",
    summary:
      "La edición 003 en formato digital. La misma travesía editorial por el universo Fungi, para leer desde donde estés.",
    themes: [
      "Edición completa en digital",
      "Entrevistas y reportajes",
      "Fotografía editorial",
    ],
    featured: true,
  },
  {
    slug: "edicion-002-impresa",
    number: "002",
    title: "Edición 002 impresa",
    format: "Impreso",
    price: 15990,
    status: "Preventa",
    cover: ed002Impreso,
    coverAlt:
      "Portada de la edición 002 impresa de Revista Micelio con hongos en un bosque húmedo",
    summary:
      "Segunda edición impresa. Bosque templado lluvioso, funga nativa y las voces que están mirando el reino Fungi desde Chile.",
    themes: [
      "Bosque templado lluvioso",
      "Funga nativa",
      "Entrevistas y fotografía",
    ],
    featured: true,
  },
  {
    slug: "edicion-002-online",
    number: "002",
    title: "Edición 002 online",
    format: "Digital",
    price: 4000,
    status: "Disponible",
    cover: ed002Online,
    coverAlt: "Vista digital de la edición 002 de Revista Micelio",
    summary:
      "La edición 002 en digital: una lectura completa sobre hongos, bosque y cultura desde el sur de Chile.",
    themes: [
      "Edición completa en digital",
      "Bosque templado lluvioso",
      "Fotografía editorial",
    ],
  },
  {
    slug: "edicion-001-impresa",
    number: "001",
    title: "Edición 001 impresa",
    format: "Impreso",
    price: 12990,
    status: "Agotada",
    cover: ed001Impreso,
    coverAlt: "Portada de la primera edición impresa de Revista Micelio",
    summary:
      "El primer número impreso de Revista Micelio. La edición que abrió el camino a una publicación dedicada al reino Fungi.",
    themes: ["Primera edición", "Reino Fungi", "Archivo editorial"],
  },
  {
    slug: "edicion-001-online",
    number: "001",
    title: "Edición 001 online",
    format: "Digital",
    price: 3000,
    status: "Disponible",
    cover: ed001Online,
    coverAlt: "Vista digital de la primera edición de Revista Micelio",
    summary:
      "La primera edición en formato digital. El punto de partida de una revista que explora el mundo invisible.",
    themes: [
      "Edición completa en digital",
      "Primera edición",
      "Archivo editorial",
    ],
  },
];

export const getEdition = (slug) =>
  editions.find((edition) => edition.slug === slug);

export const featuredEditions = editions.filter((edition) => edition.featured);

export const formatCLP = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
