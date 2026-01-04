import { Pub } from "@/lib/geo";
import clsx from "clsx";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div
      className="font-medium absolute bg-neutral-900 text-center text-amber-200 rounded-3xl  border-2 border-amber-200 p-4 flex flex-col bottom-4 w-full m-4"
      style={{ filter: `drop-shadow(0px 0px 6px #fec685)` }}
    >
      {targetPub ? (
        <motion.h2
          key={targetPub.place_id} // Klíč zajistí animaci při každé změně hospody
          initial={{ opacity: 0, y: 10 }} // Počáteční stav (průhledný, posunutý dolů)
          animate={{ opacity: 1, y: 0 }} // Cílový stav (viditelný, na své pozici)
          exit={{ opacity: 0, y: -10 }} // Stav při zmizení (volitelné)
          transition={{ duration: 0.5, ease: "easeOut" }} // Nastavení plynulosti
          className="text-3xl  my-4 uppercase"
        >
          {targetPub.name}
        </motion.h2>
      ) : (
        <h2 className="text-3xl  my-4 uppercase">{"Hledám..."}</h2>
      )}
      <button
        onClick={() => {
          loading || refresh();
        }}
        className={clsx(
          "bg-amber-200 text-neutral-950 py-4 px-6 rounded-full uppercase font-bold cursor-pointer hover:bg-transparent border-2 border-amber-200 hover:text-amber-200 transition-colors"
        )}
      >
        Navigovat k další pípě
      </button>
    </div>
  );
}
