"use client"

import Image from "next/image"
import Link from "next/link"
import React from "react"
import BankCard from "./BankCard"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { formatAmount } from "@/lib/utils"
import { useRouter } from "next/navigation"

const RightSidebar = ({
  user,
  watchlist,
  banks,
  stocks,
}: RightSidebarProps) => {
  const router = useRouter()

  return (
    <aside className="right-sidebar">
      <section className="flex flex-col">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img">
            <span className="text-5xl font-bold text-emerald-700">
              {user.firstName[0]}
            </span>
          </div>

          <div className="profile-details">
            <h1 className="profile-name">
              {user.firstName} {user.lastName}
            </h1>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>
      </section>

      <section className="banks">
        <div className="flex w-full justify-between">
          <h2 className="header-2">My Banks</h2>
          <Link href="/" className="flex gap-2">
            <Image src="/icons/plus.svg" width={20} height={20} alt="plus" />
            <h2 className="text-14 font-semibold text-gray-600">Add Bank</h2>
          </Link>
        </div>

        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className="relative z-10">
              <BankCard
                key={banks[0].id}
                account={banks[0]}
                userName={`${user.firstName} ${user.lastName}`}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <BankCard
                  key={banks[1].id}
                  account={banks[1]}
                  userName={`${user.firstName} ${user.lastName}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-1 flex-col gap-6">
          <h2 className="header-2">My Daily Watchlist</h2>

          <Table className="space-y-5">
            <TableBody>
              {watchlist.map((stock, index) => {
                const foundStockValue = stocks.find(
                  (s) => s.symbol === stock.ticker
                )

                const price = foundStockValue?.currentPrice

                const pos = foundStockValue
                  ? foundStockValue?.currentPrice >
                    foundStockValue?.previousClose
                  : false
                const neg = foundStockValue
                  ? foundStockValue?.currentPrice <
                    foundStockValue?.previousClose
                  : false
                return (
                  <TableRow
                    key={index}
                    className="!border-b-DEFAULT !over:bg-none cursor-pointer flex justify-between"
                    onClick={() => router.push(`/${foundStockValue?.symbol}`)}>
                    <TableCell className="px-4 font-semibold">
                      {stock.ticker}
                    </TableCell>
                    <TableCell className="px-4 font-semibold flex">
                      {pos && (
                        <Image
                          src="/icons/green-arrow-up.svg"
                          width={12}
                          height={12}
                          alt="up good"
                          className="mx-2"></Image>
                      )}
                      {neg && (
                        <Image
                          src="/icons/red-arrow-down.svg"
                          width={12}
                          height={12}
                          alt="down bad"
                          className="mx-2"></Image>
                      )}
                      {`${price ? formatAmount(price) : "-"}`}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </section>
    </aside>
  )
}

export default RightSidebar
