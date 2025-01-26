"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { UserButton , SignedIn } from "@clerk/nextjs"

export default function Header() {
  return (
    // <header className="w-full border-b">
    //   <div className="container flex flex-col gap-2 p-4 md:flex-row md:items-center md:gap-4">
    //     <div className="relative flex-1">
    //       <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    //       <Input type="search" placeholder="City, neighborhood, ZIP code..." className="pl-9" />
    //     </div>

    //     <div className="flex flex-wrap items-center gap-2">
          
        //   <Button variant="outline">All filters</Button>
        //   <Button variant="default">Save search</Button>
      
        // </div>
        <div>
            ff
        <SignedIn>
            <UserButton />
          </SignedIn>
    //   </div>
    // </header>
  )
}

