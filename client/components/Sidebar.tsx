"use client"

import Link from "next/link"
import Image from "next/image"
import React, { useState } from "react"
import { sidebarLinks } from "@/constants"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Footer from "./Footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Search } from "lucide-react"
import { searchStock } from "@/lib/actions/stock.action"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Badge } from "./ui/badge"

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname()
  const { toast } = useToast()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const [searchHistory, setSearchHistory] = useState(() => {
    // Load initial state from localStorage if available
    const storedHistory = localStorage.getItem("searchHistory")
    return storedHistory ?? ""
  })

  const handleSearch = async () => {
    if (searchTerm === "") return
    setLoading(true)
    const response = await searchStock(searchTerm.toUpperCase())
    if (!response.name) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Did you mean to search ${response.correction}?`,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => setSearchTerm(response.correction)}>
            Try again
          </ToastAction>
        ),
      })
      setLoading(false)
    } else {
      let searchHistoryArray = searchHistory.split(",")
      if (
        searchHistoryArray.length > 0 &&
        searchHistoryArray.includes(searchTerm)
      ) {
        searchHistoryArray = searchHistoryArray.filter(
          (item) => item !== searchTerm
        )
      }
      const newHistory = [searchTerm, ...searchHistoryArray]
        .slice(0, 3)
        .join(",")
      localStorage.setItem("searchHistory", newHistory)
      setSearchHistory(newHistory)
      router.push(`/${searchTerm.toUpperCase()}`)
      setSearchTerm("")
      setLoading(false)
    }
  }

  // allows search on pressing enter/return
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault() // Prevent form submission if inside a form
      handleSearch()
    }
  }

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="flex mb-4 cursor-pointer items-center gap-2">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="SellScaleHood Logo"
            className="size-6 max-xl:size-12"
          />
          <h1 className="sidebar-logo">SellScaleHood</h1>
        </Link>
        <div className="flex flex-col w-full mb-4">
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
              onKeyDown={handleKeyDown}
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
          <div className="text-xs text-black-2 font-semibold my-2 flex gap-2">
            {searchHistory !== "" &&
              searchHistory
                .split(",")
                .filter((r) => r !== "")
                .map((ticker, index) => {
                  return (
                    <Badge
                      key={index}
                      className="bg-bankGradient px-3 hover:bg-bankGradient cursor-default">
                      {ticker}
                    </Badge>
                  )
                })}
          </div>
        </div>
        {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`)
          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn("sidebar-link", { "bg-bank-gradient": isActive })}>
              <div className="relative size-6">
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  className={cn({ "brightness-[3] invert-0": isActive })}
                />
              </div>
              <p className={cn("sidebar-label", { "!text-white": isActive })}>
                {item.label}
              </p>
            </Link>
          )
        })}
      </nav>
      <Footer user={user} />
    </section>
  )
}

export default Sidebar
