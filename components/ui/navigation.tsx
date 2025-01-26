import Link from "next/link";
import { UserButton, SignedIn } from "@clerk/nextjs";
import { Pen } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "./input";
import { GalleryVerticalEnd } from "lucide-react";

export default function NavHeader() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="mr-6">
          <GalleryVerticalEnd className="size-6" />
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="default" className="h-8  bg-black text-white ">
            Enter Details
            <Pen className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="default" className="h-8   bg-black text-white ">
            Draw
            <Pen className="ml-2 h-4 w-4" />
          </Button>
          {/* <button className="rounded-full overflow-hidden"> */}
          <SignedIn>
            <UserButton />
          </SignedIn>
          {/* </button> */}
        </div>
      </div>
    </header>
  );
}
