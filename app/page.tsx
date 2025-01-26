"use client"
import Image from "next/image";
import { Hero } from "@/components/ui/animated-hero";
import { Globe } from "@/components/ui/globe"



export default function Home() {
  return (
    <div  >
    
      <Hero />
      <div className="relative mx-auto flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg overflow-hidden px-40 pb-[50rem]  md:pb-80 ">
      <Globe className="top-0" />
      <div className="pointer-events-none absolute inset-0 h-full " />
    </div>
    </div>
  );
}
