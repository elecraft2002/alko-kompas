"use client";
import { calculateDistanceToTarget, getBearing, toRadians } from "@/lib/geo";
import { distance, bearing, bearingToAzimuth } from "@turf/turf";
import {
  LocationState,
  locationToPoint,
  useLocationStream,
} from "@/lib/hooks/useLocation";
import { useDeviceOrientation } from "@/lib/orientation";
import React, { useEffect, useMemo, useState } from "react";
import Scene from "./Scene";

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
      <Scene
        absolute={absolute}
        alpha={finalAlpha || 0}
        beta={beta || 0}
        gamma={gamma || 0}
        permissionGranted={permissionGranted || false}
      />
  );
}
