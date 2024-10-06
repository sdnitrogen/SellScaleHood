"use client"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Footer from "./Footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { ToastAction } from "@/components/ui/toast"
import { searchStock } from "@/lib/actions/stock.action"
import { useToast } from "@/hooks/use-toast"

const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname()
  const { toast } = useToast()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (searchTerm === "") return
    setLoading(true)
    const response = await searchStock(searchTerm.toUpperCase())
    if (!response.name) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Couldn't find a stock with that symbol!.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      setLoading(false)
    } else {
      router.push(`/${searchTerm.toUpperCase()}`)
      setLoading(false)
    }
  }

  return (
    <section className="w-fulll max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          <Link
            href="/"
            className="cursor-pointer flex items-center gap-1 px-4">
            <Image
              src="/icons/logo.svg"
              width={34}
              height={34}
              alt="SellScaleHood Logo"
            />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
              SellScaleHood
            </h1>
          </Link>
          <div className="flex flex-col max-w-60 my-16">
            <Label
              htmlFor="search-input"
              className="text-xs text-black-2 font-semibold my-2">
              Search $Symbol
            </Label>
            <div className="flex mt-1">
              <Input
                id="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                placeholder="ex: AAPL"
                className="flex-1 text-foreground rounded-l-lg rounded-r-none focus-visible:ring-0 border-black-2 border-r-0"
              />
              <Button
                onClick={handleSearch}
                size="icon"
                className="rounded-none bg-bankGradient hover:bg-bank-gradient rounded-r-lg rounded-l-none">
                {!loading && <Search className="h-4 w-4" />}
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </div>
          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 text-white">
                {sidebarLinks.map((item) => {
                  const isActive =
                    pathname === item.route ||
                    pathname.startsWith(`${item.route}/`)

                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        key={item.label}
                        className={cn("mobilenav-sheet_close w-full", {
                          "bg-bank-gradient": isActive,
                        })}>
                        <Image
                          src={item.imgURL}
                          alt={item.label}
                          width={20}
                          height={20}
                          className={cn({
                            "brightness-[3] invert-0": isActive,
                          })}
                        />
                        <p
                          className={cn("text-16 font-semibold text-black-2", {
                            "text-white": isActive,
                          })}>
                          {item.label}
                        </p>
                      </Link>
                    </SheetClose>
                  )
                })}
              </nav>
            </SheetClose>
            <Footer user={user} type="mobile" />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav
