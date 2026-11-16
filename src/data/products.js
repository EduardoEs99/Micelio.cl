import guiaAustral from "@/assets/webp/products/guia-austral.webp";
import guiaCentral from "@/assets/webp/products/guia-central.webp";
import guiaDesertica from "@/assets/webp/products/guia-desertica.webp";
import guiaSur from "@/assets/webp/products/guia-sur.webp";
import guiaToxica from "@/assets/webp/products/guia-toxica.webp";
import packGuia from "@/assets/webp/products/pack-guia.webp";
import pack2 from "@/assets/webp/covers/pack-2.webp";
import pack3 from "@/assets/webp/covers/pack-3.webp";

export const products = [
  {
    slug: "pack-3-ediciones",
    title: "Pack 3 ediciones",
    category: "Actividades",
    price: 45000,
    compareAt: 55970,
    image: pack3,
    imageAlt: "Pack promocional con las tres ediciones de Revista Micelio",
    summary:
      "Las tres ediciones de Revista Micelio reunidas en un solo pack, con precio especial.",
    featured: true,
  },
  {
    slug: "pack-edicion-002-y-003",
    title: "Pack edición 002 + edición 003",
    category: "Actividades",
    price: 26990,
    compareAt: 35980,
    image: pack2,
    imageAlt: "Pack de las ediciones 002 y 003 de Revista Micelio",
    summary:
      "Dos números de la revista para recorrer el bosque y su funga de una sola vez.",
    featured: true,
  },
  {
    slug: "pack-edicion-002-guia-funga-del-sur",
    title: "Pack edición 002 + Guía Funga del Sur",
    category: "Red Micelio",
    price: 18990,
    compareAt: 20990,
    image: packGuia,
    imageAlt:
      "Pack de la edición 002 de Revista Micelio junto a la Guía Plegable Funga del Sur",
    summary:
      "La edición 002 junto a una guía plegable de bolsillo para reconocer la funga del sur.",
    featured: true,
  },
  {
    slug: "guia-funga-desertica",
    title: "Guía Plegable Funga Desértica",
    category: "Red Micelio",
    price: 4990,
    compareAt: 5500,
    image: guiaDesertica,
    imageAlt: "Guía plegable Funga Desértica",
    summary:
      "Guía de bolsillo dedicada a la funga de los territorios desérticos de Chile.",
  },
  {
    slug: "guia-funga-toxica-y-psicoactiva",
    title: "Guía Plegable Funga Tóxica y Psicoactiva",
    category: "Red Micelio",
    price: 5990,
    compareAt: 6500,
    image: guiaToxica,
    imageAlt: "Guía plegable Funga Tóxica y Psicoactiva",
    summary:
      "Guía de bolsillo sobre hongos tóxicos y psicoactivos, para leer con criterio y precaución.",
  },
  {
    slug: "guia-funga-austral",
    title: "Guía Plegable Funga Austral",
    category: "Red Micelio",
    price: 4990,
    compareAt: 5500,
    image: guiaAustral,
    imageAlt: "Guía plegable Funga Austral",
    summary:
      "Guía de bolsillo para la funga de los bosques australes de Chile.",
  },
  {
    slug: "guia-funga-del-sur",
    title: "Guía Plegable Funga del Sur",
    category: "Red Micelio",
    price: 4990,
    compareAt: 5500,
    image: guiaSur,
    imageAlt: "Guía plegable Funga del Sur",
    summary:
      "Guía de bolsillo para reconocer la funga del sur de Chile en terreno.",
    featured: true,
  },
  {
    slug: "guia-funga-central",
    title: "Guía Plegable Funga Central",
    category: "Red Micelio",
    price: 4990,
    compareAt: 5500,
    image: guiaCentral,
    imageAlt: "Guía plegable Funga Central",
    summary: "Guía de bolsillo para la funga de la zona central de Chile.",
  },
];

export const getProducts = (category) =>
  products.filter((product) => product.category === category);
