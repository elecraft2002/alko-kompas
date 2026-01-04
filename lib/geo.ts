import { toast } from "react-toastify";
import { LocationState } from "./hooks/useLocation";

export const toRadians = (degrees: number) => degrees * (Math.PI / 180);
export const toDegrees = (radians: number) => radians * (180 / Math.PI);

export function calculateDistanceToTarget(
  position: LocationState,
  targetPoint: LocationState
): number {
  const R = 6371000; // Earth radius in meters

  const lat1 = toRadians(position.latitude);
  const lat2 = toRadians(targetPoint.latitude);
  const dLat = toRadians(targetPoint.latitude - position.latitude);
  const dLon = toRadians(targetPoint.longitude - position.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Funkce pro výpočet azimutu (směru) mezi dvěma body
export function getBearing(
  position: LocationState,
  targetPoint: LocationState
) {
  const dLon = toRadians(targetPoint.longitude - position.longitude);
  const lat1Rad = toRadians(position.latitude);
  const lat2Rad = toRadians(targetPoint.latitude);

  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

  let bearing = toRadians(Math.atan2(y, x));
  bearing = (bearing + 2 * Math.PI) % (2 * Math.PI); // Normalizace na 0-2PI
  return bearing; // Vrátí azimut v radiánech od severu
}

export interface Pub {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  latitude: number;
  longitude: number;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries: number = 3,
  backoff: number = 1000
): Promise<Response> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return response;
  } catch (error) {
    // Pokud nám zbývají pokusy, zkusíme to znovu
    if (retries > 0) {
      toast(`Fetch selhal, zbývá pokusů: ${retries}. Čekám ${backoff}ms...`);

      // Čekání (Exponential backoff - pokaždé čekáme déle)
      await new Promise((resolve) => setTimeout(resolve, backoff));

      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    } else {
      // Pokud už pokusy nejsou, vyhodíme chybu ven
      throw error;
    }
  }
}

export async function getClosestPub(
  targetPoint: LocationState,
  limit = 1
): Promise<Pub[]> {

  const res = await fetchWithRetry(
    `https://nominatim.openstreetmap.org/search?q=pub+near+[${targetPoint.latitude},${targetPoint.longitude}]&format=json&limit=${limit}`,
    {
      headers: { "User-Agent": "AlkoKompas/1.0" },
    }
  );
  if (!res.ok) toast("Nepodařilo se načíst data, zkuste to prosím později.");
  const rawPubs = (await res.json()) as Pub[];
  return rawPubs.map((pub) => {
    return { ...pub, latitude: Number(pub.lat), longitude: Number(pub.lon) };
  });
}
