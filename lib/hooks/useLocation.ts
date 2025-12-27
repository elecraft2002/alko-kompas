// lib/hooks/useLocation.ts

import { useState, useEffect } from 'react';

/**
 * Rozhraní pro data o geolokaci.
 */
interface LocationState {
    latitude: number ;
    longitude: number ;
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
export function useLocation(): UseLocationResult {
    const [location, setLocation] = useState<LocationState | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Kontrola, zda prohlížeč podporuje Geolocation API
        if (!navigator.geolocation) {
            setError('Geolocation není v tomto prohlížeči podporována.');
            setLoading(false);
            return;
        }

        // Funkce pro úspěšné získání pozice
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
            let errorMessage = '';
            switch (err.code) {
                case err.PERMISSION_DENIED:
                    errorMessage = 'Přístup k poloze byl zamítnut uživatelem.';
                    break;
                case err.POSITION_UNAVAILABLE:
                    errorMessage = 'Informace o poloze nejsou dostupné.';
                    break;
                case err.TIMEOUT:
                    errorMessage = 'Vypršel časový limit pro získání polohy.';
                    break;
                default:
                    errorMessage = `Neznámá chyba: ${err.message}`;
            }
            setError(errorMessage);
            setLoading(false);
            setLocation(null);
        };

        // Možnosti pro geolokaci (vysoká přesnost, timeout)
        const options: PositionOptions = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0, // Neukládat do cache staré pozice
        };

        // Spuštění sledování polohy (jednorázové získání)
        navigator.geolocation.getCurrentPosition(successHandler, errorHandler, options);

        // Poznámka: Pokud byste chtěli sledovat polohu v reálném čase, 
        // použili byste navigator.geolocation.watchPosition a vyčistili byste ji v cleanup funkci.

    }, []); // Prázdné pole závislostí zajistí, že se spustí pouze při mountu komponenty

    return { location, loading, error };
}