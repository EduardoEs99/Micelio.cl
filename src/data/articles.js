import braun from "@/assets/webp/editorial/braun.webp";
import cantillana from "@/assets/webp/editorial/cantillana.webp";
import dinelly from "@/assets/webp/editorial/dinelly.webp";
import kombuferia from "@/assets/webp/editorial/kombuferia.webp";
import russula from "@/assets/webp/editorial/russula.webp";
import yerko from "@/assets/webp/editorial/yerko.webp";

export const articles = [
  {
    slug: "la-energia-del-bosque-dinelly-soto",
    title: "La energía del bosque / Dinelly Soto",
    date: "2026-05-10",
    displayDate: "10 mayo 2026",
    excerpt:
      "Dinelly Soto es periodista y divulgadora científica chilena especializada en el reino Fungi. Nacida en Valdivia, lleva más de 14 años trabajando en terreno.",
    image: dinelly,
    imageAlt: "Dinelly Soto en un bosque nativo, rodeada de hongos",
    url: "https://revistamicelio.cl/2026/05/10/la-energia-del-bosque-dinelly-soto/",
    featured: true,
    imagePosition: "center 35%",
  },
  {
    slug: "hongos-que-consumen-la-memoria",
    title: "Hongos que consumen la memoria: profesor Yerko Quitral",
    date: "2026-03-04",
    displayDate: "4 marzo 2026",
    excerpt:
      "La preservación del patrimonio documental enfrenta amenazas silenciosas. Conversamos con Yerko Quitral, bioquímico especializado en biodeterioro.",
    image: yerko,
    imageAlt: "Retrato del profesor Yerko Quitral en un bosque",
    url: "https://revistamicelio.cl/2026/03/04/hongos-que-consumen-la-memoria-profesor-yerko-quitral/",
    featured: true,
    imagePosition: "center 30%",
  },
  {
    slug: "comunicando-sobre-la-tierra",
    title: "Comunicando sobre la tierra: entrevista con Felipe Braun",
    date: "2026-03-04",
    displayDate: "4 marzo 2026",
    excerpt:
      "Felipe Braun ha consolidado una segunda faceta profesional vinculada a la tierra, la naturaleza y las formas de habitarla.",
    image: braun,
    imageAlt: "Felipe Braun durante la entrevista para Revista Micelio",
    url: "https://revistamicelio.cl/2026/03/04/comunicando-sobre-la-tierra-entrevista-con-felipe-braun/",
    featured: true,
    imagePosition: "center 30%",
  },
  {
    slug: "kombuferia",
    title: "Kombuferia: fermentar es compartir",
    date: "2026-03-04",
    displayDate: "4 marzo 2026",
    excerpt:
      "La kombucha se expande por Chile como una fermentación viva que articula cocina, territorio y comunidad. En su interior, levaduras del reino Fungi.",
    image: kombuferia,
    imageAlt: "Botellas y utensilios del proceso de fermentación de kombucha",
    url: "https://revistamicelio.cl/2026/03/04/kombuferia/",
    featured: true,
  },
  {
    slug: "el-reino-de-lo-invisible",
    title: "El reino de lo invisible: Pablo Sandoval y la micología en Chile",
    date: "2025-10-19",
    displayDate: "19 octubre 2025",
    excerpt:
      "Bajo cada paso se extiende una red viva, compleja y silenciosa. El reino Fungi, tercer gran dominio de la vida, visto desde Chile.",
    image: cantillana,
    imageAlt: "Hongos en el bosque de Altos de Cantillana",
    url: "https://revistamicelio.cl/2025/10/19/el-reino-de-lo-invisible-entrevista-con-pablo-sandoval-sobre-la-micologia-en-chile/",
  },
  {
    slug: "cuando-el-bosque-se-ilumina",
    title: "Cuando el bosque se ilumina: Adriana Calle, micóloga chilena",
    date: "2025-10-13",
    displayDate: "13 octubre 2025",
    excerpt:
      "Cuando cae la noche en los bosques templados lluviosos del sur de Chile, la oscuridad se vuelve casi total. Sin embargo, en un rincón oculto algo brilla.",
    image: russula,
    imageAlt: "Hongo iluminado con luz ultravioleta",
    url: "https://revistamicelio.cl/2025/10/13/publicidad-en-revista/",
  },
];

export const featuredArticle = articles[0];
