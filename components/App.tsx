"use client";
import Compas from "@/components/Compas";
import PubComponent from "@/components/PubComponent";
import Scene from "@/components/Scene";
import Test from "@/components/Test";
import { getClosestPub, Pub } from "@/lib/geo";
import { LocationState, useLocation } from "@/lib/hooks/useLocation";
import { Suspense, use, useEffect, useState } from "react";

export default function App() {
  const [pubPromise, setPubPromise] = useState<Promise<Pub[]> | null>(null);
  const [excludedPubs, setExcludedPubs] = useState(new Set<number>());
  const { location, loading, error, refresh } = useLocation();
  useEffect(() => {
    if (location) {
      setPubPromise(getClosestPub(location, excludedPubs.size + 1));
    }
  }, [location]);

  const pub =
    pubPromise &&
    use(pubPromise).filter((pub) => {
      console.log(pub);
      return !excludedPubs.has(pub.place_id);
    })[0];
  useEffect(() => {
    if (pub) setExcludedPubs((prev) => prev.add(pub.place_id));
  }, [pub]);
  return (
    <div className="bg-neutral-800">
      <div className="text-red-500">{error && JSON.stringify(error)}</div>
      <div className="navigation__container grid h-screen  ">
        <div className="h-screen relative flex justify-center ">
          <Compas targetPosition={pub} />
          <PubComponent loading={loading} refresh={refresh} targetPub={pub} />
        </div>
      </div>
    </div>
  );
}
