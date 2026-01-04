import { Pub } from "@/lib/geo";
import clsx from "clsx";
import React from "react";

export default function PubComponent({
  targetPub,
  refresh,
  loading,
}: {
  targetPub: Pub | null;
  refresh: () => void;
  loading: boolean;
}) {
  
  return (
    <div className="font-medium absolute bg-slate-800 text-center text-amber-200 rounded-3xl  border-2 border-amber-200 p-4 flex flex-col bottom-4 max-w-full">
      <h2 className="text-3xl  my-4 uppercase">
        {targetPub?.name }
      </h2>
      <button
        onClick={() => {
          loading || refresh();
        }}
        className={clsx("bg-amber-200 text-slate-950 py-4 px-6 rounded-full uppercase font-bold cursor-pointer",loading&&"bg-red-500")}
      >
        Navigovat k další pípě
      </button>
    </div>
  );
}
