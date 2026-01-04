// hooks/useDeviceOrientation.ts
import { useState, useEffect } from 'react';

export interface DeviceOrientationState {
  alpha: number | null; // Azimut (0-360) - směr na sever
  beta: number | null;  // Náklon (dopředu/dozadu) (-180 až 180)
  gamma: number | null; // Náklon (doleva/doprava) (-90 až 90)
  absolute: boolean;    // Je orientace absolutní (vzhledem k Zemi)?
  permissionGranted: boolean | null; // Byl udělen souhlas (iOS 13+)?
}

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<DeviceOrientationState>({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: true,
    permissionGranted: null,
  });

  useEffect(() => {
    // Pro iOS 13+ je potřeba explicitní souhlas uživatele
    const requestPermission = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permissionState = await (DeviceOrientationEvent as any).requestPermission();
          if (permissionState === 'granted') {
            setOrientation(prev => ({ ...prev, permissionGranted: true }));
          } else {
            setOrientation(prev => ({ ...prev, permissionGranted: false }));
            alert('Pro správnou funkci kompasu prosím povolte přístup k senzorům zařízení.');
          }
        } catch (error) {
          console.error("Chyba při žádosti o povolení senzoru:", error);
          setOrientation(prev => ({ ...prev, permissionGranted: false }));
        }
      } else {
        // Starší prohlížeče / Android to nevyžadují
        setOrientation(prev => ({ ...prev, permissionGranted: true }));
      }
    };

    requestPermission();

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        absolute: event.absolute,
        permissionGranted: true, // Pokud se event spustí, povolení je uděleno
      });
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
    };
  }, []);

  return orientation;
}