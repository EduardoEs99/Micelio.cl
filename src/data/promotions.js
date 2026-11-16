import reinofungi from '@/assets/webp/promotion/reinofungi.webp';
import guiadecampo from '@/assets/webp/promotion/guiadecampo.webp';
import reinofungiFallback from '@/assets/jpeg/promotion/reinofungi.jpg';
import guiadecampoFallback from '@/assets/jpeg/promotion/guiadecampo.jpg';

export const promotions = [
  {
    id: 'reino-fungi',
    image: reinofungi,
    fallback: reinofungiFallback,
    alt: 'Promoción de la tercera edición de Revista Micelio',
    duration: 6000,
  },
  {
    id: 'guias-de-campo',
    image: guiadecampo,
    fallback: guiadecampoFallback,
    alt: 'Promoción de guías de campo',
    duration: 6000,
  },
];
