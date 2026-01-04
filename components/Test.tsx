import { getBearing, toDegrees } from "@/lib/geo";
import * as turf from '@turf/turf';
import { toRad } from "geolib";
import React from "react";

export default function Test() {
  const location = { latitude: 50.8201581, longitude: 15.0695811 };
  const targetPosition = { latitude: 50.8201667, longitude: 15.0656867 };
//   const bearing = getBearing(location, targetPosition);
  const start = turf.point([location.longitude, location.latitude]);
const end = turf.point([targetPosition.longitude, targetPosition.latitude]);
const bearing = turf.bearing(start, end);
const distance =turf.distance(start,end,{units:"kilometers"})
//   bearingToAzimuth()
  return (
    <div>
      <h2>Test</h2>
      <p>{bearing} deg</p>
      <p>{distance} distance</p>
    </div>
  );
}
