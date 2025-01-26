"use client";
import { Hero } from "@/components/ui/animated-hero";
import { Globe } from "@/components/ui/globe";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Hero />
      <div className="relative w-full max-w-lg mx-auto">
        <Globe className="w-full" />
      </div>
    </div>
  );
}
