"use client"

import {
  addToWatchlist,
  buyStock,
  removeWatchlist,
  searchStock,
  sellStock,
} from "@/lib/actions/stock.action"
import { useEffect, useState } from "react"
import { Area, AreaChart, XAxis, YAxis } from "recharts"
import Image from "next/image"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { formatAmount } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select"
import useBankAccounts from "@/hooks/useBankAccounts"
import { Minus, Plus } from "lucide-react"
import useGetWatchlist from "@/hooks/useGetWatchlist"
import useGetHoldings from "@/hooks/useGetHoldings"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface StockDetailProps {
  params: {
    symbol: string
  }
}

const StockDetails = ({ params }: StockDetailProps) => {
  const { holdings: holdingsdata } = useGetHoldings()
  const { accounts: acccountsData } = useBankAccounts()
  const { watchlist: watchlistData } = useGetWatchlist()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [watchlist, setWatchlist] = useState<Watchlist[]>([])

  useEffect(() => {
    acccountsData?.data && setAccounts(acccountsData.data)
    setHoldings(holdingsdata)
    setWatchlist(watchlistData)
  }, [acccountsData, holdingsdata, watchlistData])

  const [stockInfo, setStockInfo] = useState<Stock | null>(null)
  const [selected, setSeclected] = useState<Account | null>(null)
  const [inWatchlist, setInWatchlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { symbol } = params
  const foundStock = holdings.find((h) => h.ticker === symbol)

  const [quantity, setQuantity] = useState(1)

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 0)) // Prevents going below 0
  }

  const handleBuy = async () => {
    // Handle buy action
    setIsLoading(true)
    if (!selected || !stockInfo) {
      setIsLoading(false)
      return
    }

    if (selected.currentBalance < quantity * stockInfo.currentPrice) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "You do not have enough cash in that account.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      setIsLoading(false)
      return
    }

    try {
      const buyingData = {
        ticker: symbol,
        volume: quantity,
        from: selected.id!,
      }
      const response = await buyStock(buyingData)
      response.accounts && setAccounts(response.accounts)
      response.holdings && setHoldings(response.holdings)
      toast({
        variant: "success",
        title: "Success!",
        description: response.message,
        action: <ToastAction altText="Done">Done!</ToastAction>,
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSell = async () => {
    // Handle sell action
    setIsLoading(true)
    if (!selected || !stockInfo) {
      setIsLoading(false)
      return
    }

    if (foundStock && foundStock.volume < quantity) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "You can not sell more than you have!",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      setIsLoading(false)
      return
    }

    try {
      const sellingData = {
        ticker: symbol,
        volume: quantity,
        to: selected.id!,
      }
      const response = await sellStock(sellingData)
      response.accounts && setAccounts(response.accounts)
      response.holdings && setHoldings(response.holdings)
      toast({
        variant: "success",
        title: "Success!",
        description: response.message,
        action: <ToastAction altText="Done">Done!</ToastAction>,
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWatchlist = async () => {
    // Handle watchlist action
    try {
      if (inWatchlist) {
        const data = { ticker: symbol }
        const response = await removeWatchlist(data)
        response.watchlist && setWatchlist(response.watchlist)
        toast({
          variant: "success",
          title: "Success!",
          description: "Removed from Watchlist.",
          action: <ToastAction altText="Done">Done!</ToastAction>,
        })
      } else {
        const data = { ticker: symbol }
        const response = await addToWatchlist(data)
        response.watchlist && setWatchlist(response.watchlist)
        toast({
          variant: "success",
          title: "Success!",
          description: "Added to Watchlist.",
          action: <ToastAction altText="Done">Done!</ToastAction>,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const getStockInfo = async () => {
      const response = await searchStock(symbol)
      setStockInfo(response)
    }
    getStockInfo()
    !selected && setSeclected(accounts.length > 0 ? accounts[0] : null)
    setInWatchlist(watchlist.find((w) => w.ticker === symbol) ? true : false)
  }, [accounts, watchlist])

  const handleBankChange = (id: string) => {
    const account = accounts.find((account) => account.id === id)!

    setSeclected(account)
  }
  return (
    <section className="flex flex-col">
      <div className="flex max-h-screen w-full flex-col gap-8 p-8 xl:py-12;">
        <div className="header-container">
          <h1 className="header-container-title">{symbol}</h1>
          <div className="flex gap-4">
            <p className="header-container-subtext">{stockInfo?.name}</p>
            <Badge>{stockInfo?.sector}</Badge>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mx-8">
        <Card className="flex-grow max-w-2xl">
          {stockInfo && (
            <CardHeader className="space-y-0 pb-0">
              <CardDescription>Current Price</CardDescription>
              <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                {`${formatAmount(stockInfo?.currentPrice)}`}
              </CardTitle>
            </CardHeader>
          )}
          <CardContent className="p-0">
            <ChartContainer
              config={{
                time: {
                  label: "Time",
                  color: "hsl(var(--chart-2))",
                },
              }}>
              <AreaChart
                accessibilityLayer
                data={stockInfo?.history}
                margin={{
                  left: 0,
                  right: 0,
                  top: 2,
                  bottom: 0,
                }}>
                <XAxis dataKey="month" hide />
                <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
                <defs>
                  <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-time)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-time)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="average_price"
                  type="natural"
                  fill="url(#fillTime)"
                  fillOpacity={0.4}
                  stroke="var(--color-time)"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="flex-grow max-w-sm">
          <CardHeader className="space-y-2 pb-0">
            <CardTitle className="flex items-baseline gap-1 text-2xl tabular-nums">
              Trade {`${symbol}`}
            </CardTitle>
            <CardDescription>{`${
              foundStock ? `Owned : ${foundStock.volume}` : "Not owned"
            }`}</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-2 items-start px-6 py-2">
            <Select
              defaultValue={selected?.id}
              onValueChange={(value) => {
                handleBankChange(value)
              }}>
              <SelectTrigger className="flex w-full bg-white gap-3 focus:ring-0">
                <Image
                  src="icons/credit-card.svg"
                  width={20}
                  height={20}
                  alt="account"
                />
                <p className="line-clamp-1 w-full text-left">
                  {selected?.name}
                </p>
              </SelectTrigger>
              <SelectContent className="w-full bg-white" align="end">
                <SelectGroup>
                  <SelectLabel className="py-2 font-normal text-gray-500">
                    Select a bank to display
                  </SelectLabel>
                  {accounts.map((account: Account) => (
                    <SelectItem
                      key={account.id}
                      value={String(account.id)}
                      className="cursor-pointer border-t">
                      <div className="flex flex-col ">
                        <p className="text-16 font-medium">{account.name}</p>
                        <p className="text-14 font-medium text-emerald-600">
                          {formatAmount(account.currentBalance)}
                        </p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="relative w-full">
              <Button
                onClick={handleDecrement}
                className="absolute right-10 top-1 rounded bg-bankGradient p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:shadow-none active:bg-bank-gradient hover:bg-bank-gradient active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none w-8 h-8">
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-20 py-2 focus:outline-none hover:border-slate-300 shadow-sm focus:shadow focus-visible:ring-0"
                value={quantity}
                pattern="\d{3}"
                onInput={(event) =>
                  setQuantity(
                    Number(
                      (event.target as HTMLInputElement).value
                        .replace(/[^0-9]/g, "")
                        .replace(/(\..*)\./g, "$1")
                    )
                  )
                }
              />
              <Button
                onClick={handleIncrement}
                className="absolute right-1 top-1 rounded bg-bankGradient p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:shadow-none active:bg-bank-gradient hover:bg-bank-gradient active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none w-8 h-8">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <span className="text-sm">
              Buying Power: {formatAmount(selected?.currentBalance!)}
            </span>
            <span className="text-sm mb-4">
              Total Value: {formatAmount(quantity * stockInfo?.currentPrice!)}
            </span>
            <Button
              onClick={handleBuy}
              className="w-full bg-blue-500 hover:bg-bank-blue-gradient font-semibold"
              disabled={isLoading || quantity === 0}>
              BUY
            </Button>
            <Button
              onClick={handleSell}
              className="w-full bg-emerald-500 hover:bg-emerald-600 font-semibold"
              disabled={isLoading || !foundStock || quantity === 0}>
              SELL
            </Button>
          </div>
          <div className="mx-6">
            <Button
              onClick={handleWatchlist}
              className="w-full bg-orange-500 hover:bg-orange-600 font-semibold mt-6"
              disabled={isLoading}>
              {`${inWatchlist ? "Remove from Watchlist" : "Add to WatchList"}`}
            </Button>
          </div>
        </Card>
      </div>
      <div className="flex w-max items-start gap-2 text-sm m-8">
        <div className="grid gap-2">
          <div className="flex items-center gap-2 font-medium leading-none">
            Stock prices trend of past 1 year for {`${symbol}`}
          </div>
          {stockInfo?.history && (
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {`${stockInfo?.history[0].month} ${
                new Date().getFullYear() - 1
              } - ${stockInfo?.history[11].month} ${new Date().getFullYear()}`}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default StockDetails
