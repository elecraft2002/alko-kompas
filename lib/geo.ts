/**
 * Pevný výchozí bod (Václavské náměstí, Praha) pro výpočet vzdálenosti.
 * Zeměpisná šířka (latitudeitude, y) a Zeměpisná délka (Longitude, x).
 */
export const FIXED_POINT = {
  latitude: 50.0842701,
  longitude: 14.4411605,
};

const EARTH_RADIUS_KM = 6371;

/**
 * Převede stupně na radiány.
 * @param deg Hodnota ve stupních.
 * @returns Hodnota v radiánech.
 */
function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * 📏 Vypočítá vzdálenost v kilometrech od pevného bodu (FIXED_POINT)
 * k zadaným souřadnicím pomocí Haversinovy formule.
 * * @param targetPoint Cílové souřadnice (latitude a longitude).
 * @returns Vzdálenost v kilometrech.
 */
export function calculateDistanceToFixedPoint(
  targetPoint: Coordinates
): number {
  const { latitude: latitude2, longitude: longitude2 } = targetPoint;
  const { latitude: latitude1, longitude: longitude1 } = FIXED_POINT;

  // Diference šířky a délky v radiánech
  const dlatitude = degToRad(latitude2 - latitude1);
  const dLon = degToRad(longitude2 - longitude1);

  // Převod šířek pevného bodu a cílového bodu na radiány pro kosinus
  const radlatitude1 = degToRad(latitude1);
  const radlatitude2 = degToRad(latitude2);

  // Vlastní Haversinova formule
  const a =
    Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
    Math.cos(radlatitude1) *
      Math.cos(radlatitude2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = EARTH_RADIUS_KM * c;
  console.log("Distance:",distance)
  return parseFloat(distance.toFixed(3));
}
