// lib/hooks/useLocation.ts
import { point } from "@turf/turf";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

export const locationToPoint = (location: LocationState) => {
  return point([location.longitude, location.latitude]);
};

/**
 * Rozhraní pro data o geolokaci.
 */
export interface LocationState {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/**
 * Rozhraní pro návratovou hodnotu useLocation hooku.
 */
interface UseLocationResult {
  location: LocationState | null;
  loading: boolean;
  error: string | null;
}

/**
 * Vlastní React Hook pro získání aktuální geolokace uživatele.
 * Používá standardní Geolocation API.
 * * @returns Objekt s location, loading a error stavy.
 */
export function useLocation(): UseLocationResult & { refresh: () => void } {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Vytvoříme samostatnou funkci pro získání polohy
  const getPosition = useCallback(() => {
    setLoading(true);
    const successHandler: PositionCallback = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setLoading(false);
      setError(null);
    };

    // Funkce pro zpracování chyb
    const errorHandler: PositionErrorCallback = (err) => {
      console.error(err)
      let errorMessage = "";
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = "Přístup k poloze byl zamítnut uživatelem.";
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = "Informace o poloze nejsou dostupné.";
          break;
        case err.TIMEOUT:
          errorMessage = "Vypršel časový limit pro získání polohy.";
          break;
        default:
          errorMessage = `Neznámá chyba: ${err.message}`;
      }
      setError(errorMessage);
      setLoading(false);
      setLocation(null);
    };

    if (!navigator.geolocation) {
      setError("Geolocation není podporována.");
      setLoading(false);
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 1000*60*5,
    };

    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      options
    );
  }, []);

  // 2. Spustíme ji automaticky při startu
  useEffect(() => {
    getPosition();
  }, [getPosition]);

  // 3. Vrátíme i funkci refresh, kterou můžeš zavolat odkudkoliv
  return { location, loading, error, refresh: getPosition };
}

function handlePermission() {
  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    // if (result.state === "granted") {
    //   report(result.state);
    //   geoBtn.style.display = "none";
    // } else if (result.state === "prompt") {
    //   report(result.state);
    //   geoBtn.style.display = "none";
    //   navigator.geolocation.getCurrentPosition(
    //     revealPosition,
    //     positionDenied,
    //     geoSettings,
    //   );
    // } else if (result.state === "denied") {
    //   report(result.state);
    //   geoBtn.style.display = "inline";
    // }
    // result.addEventListener("change", () => {
    //   report(result.state);
    // });
  });
}
// export async function useLocationStream(): Promise<LocationState> {
//   return new Promise<LocationState>((resolve, reject) => {
//     const watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         resolve({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//           accuracy: position.coords.accuracy,
//         });
//       },
//       (err) => {
//         reject(err.message);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 0,
//       }
//     );
//   });
// }

export function useLocationStream() {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [error, setError] = useState<string | null>(
    !navigator.geolocation ? "Geolokace není podporována prohlížečem." : null
  );

  useEffect(() => {
    // watchPosition vrací ID, které pak použijeme pro vyčištění (clearWatch)
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    // Cleanup funkce: zastaví sledování, když se komponenta odpojí
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error };
}
