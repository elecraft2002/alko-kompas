"use client";
import { toRadians } from "@/lib/geo";
import { distance, bearing, bearingToAzimuth } from "@turf/turf";
import {
  LocationState,
  locationToPoint,
  useLocationStream,
} from "@/lib/hooks/useLocation";
import { useDeviceOrientation } from "@/lib/orientation";
import Scene from "./Scene";
import { motion } from "framer-motion";

const Distance = ({ distance }: { distance: number }) => {
  const formatDistance = (distance: number): string => {
    if (distance >= 1) return Number((distance * 10).toFixed(0)) / 10 + " Km";
    return Number((distance * 100).toFixed(0)) * 10 + " m";
  };
  return (
    <div className="w-screen text-center mt-8">
      {
        /* distance > 0 */ true && (
          <motion.p
            key={"distance"}
            initial={{ opacity: 0, y: 10 }} // Počáteční stav (průhledný, posunutý dolů)
            animate={{ opacity: 1, y: 0 }} // Cílový stav (viditelný, na své pozici)
            exit={{ opacity: 0, y: -10 }} // Stav při zmizení (volitelné)
            transition={{ duration: 0.5, ease: "easeOut" }} // Nastavení plynulosti
            className="text-3xl text-amber-200"
          >
            {formatDistance(distance)}
          </motion.p>
        )
      }
    </div>
  );
};

export default function Compas({
  targetPosition,
}: {
  targetPosition: LocationState | null;
}) {
  const { location, error } = useLocationStream();
  const { absolute, alpha, beta, gamma, permissionGranted } =
    useDeviceOrientation();
  let totalDistance = 0;
  let targetBearingDeg = 0;
  //Model must look away, when alpha = 0
  const rotationOffset = Math.PI / 2;
  let finalAlpha = rotationOffset;

  if (location && targetPosition && alpha) {
    // const targetPosition = { latitude: 50.8200803, longitude:15.0637072 };

    const locationPoint = locationToPoint(location);
    const targetPoint = locationToPoint(targetPosition);
    totalDistance = distance(locationPoint, targetPoint, {
      units: "kilometers",
    });
    console.log("totalDistance", totalDistance);
    targetBearingDeg = bearingToAzimuth(bearing(locationPoint, targetPoint));

    const bearingRad = toRadians(targetBearingDeg);
    const deviceRad = toRadians(alpha);

    const relativeRotation = -bearingRad - deviceRad;

    finalAlpha = rotationOffset + relativeRotation;
  }

  return (
    <div className="w-full ">
      <div className="absolute">
        <Distance distance={totalDistance} />
      </div>
      <Scene
        absolute={absolute}
        alpha={finalAlpha || 0}
        beta={toRadians(beta || 0)}
        gamma={toRadians(gamma || 0)}
        permissionGranted={permissionGranted || false}
      />
    </div>
  );
}
