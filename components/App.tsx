"use client";
import Compas from "@/components/Compas";
import PubComponent from "@/components/PubComponent";
import { getClosestPub, Pub } from "@/lib/geo";
import {  useLocation } from "@/lib/hooks/useLocation";
import {  use, useEffect, useState } from "react";
import { BrowserView } from "react-device-detect";
import { toast, ToastContainer } from "react-toastify";

export default function App() {
  const [pubPromise, setPubPromise] = useState<Promise<Pub[]> | null>(null);
  const [excludedPubs, setExcludedPubs] = useState(new Set<number>());
  const { location, loading, error, refresh } = useLocation();
  useEffect(() => {
    if (location) {
      setPubPromise(getClosestPub(location, excludedPubs.size + 1));
    }
    if (error) toast(error);
  }, [location, error]);

  const pub =
    pubPromise &&
    use(pubPromise).filter((pub) => {
      return !excludedPubs.has(pub.place_id);
    })[0];
  useEffect(() => {
    if (pub) setExcludedPubs((prev) => prev.add(pub.place_id));
  }, [pub]);
  return (
    <div
      style={{
        background: `linear-gradient(
          rgba(0, 0, 0, 0.8),
    rgb(0, 0, 0)
  ),
  url("images/background.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <BrowserView>
        <p className="absolute text-red-500">Pro funkční senzory využijte mobilní zařízení</p>
      </BrowserView>
      <div className="navigation__container grid h-screen ">
        <div className="h-full relative flex justify-center overflow-hidden">
          <Compas targetPosition={pub} />
          <PubComponent loading={loading} refresh={refresh} targetPub={pub} />
        </div>
      </div>
      <ToastContainer theme="dark" />
    </div>
  );
}
