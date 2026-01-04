import App from "@/components/App";
import cities from "@/lib/cities";
import { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface Params {
  city: string;
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const normalize = (str: string) => {
    return str.toUpperCase().replace(" ", "_");
  };

  const city = decodeURI((await params).city);
  const includes = cities.find((val) => {
    return normalize(val.name) === normalize(city);
  });
  if (!includes) redirect("/");
  return {
    title: `Alko-kompas | ${city}`,
    description: `Jste natolik opilý, že nenajdete další hospodu? Tento problém je minulost. Město ${city} na vás čeká!`,
  };
}
// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  return cities.map((city) => {
    return { city: encodeURI(city.name) };
  });
}

export default function Page() {
  return <App />;
}
