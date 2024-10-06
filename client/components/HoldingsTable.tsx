import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatAmount } from "@/lib/utils"
import { useRouter } from "next/navigation"

const HoldingsTable = ({
  holdings,
  stocks,
}: {
  holdings: Holding[]
  stocks: Stock[]
}) => {
  const router = useRouter()

  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Symbol</TableHead>
          <TableHead className="px-2">Shares</TableHead>
          <TableHead className="px-2">Price</TableHead>
          <TableHead className="px-2">Investment</TableHead>
          <TableHead className="px-2 max-md:hidden">Equity Value</TableHead>
          <TableHead className="px-2 max-md:hidden">Net Gain / Loss</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdings.map((t: Holding) => {
          const foundStockValue = stocks.find(
            (stock) => stock.symbol === t.ticker
          )
          const price = foundStockValue?.currentPrice
          const isPos = price
            ? Number((t.volume * price).toFixed(2)) > Number(t.investment)
            : false
          const isNeg = price
            ? Number((t.volume * price).toFixed(2)) < Number(t.investment)
            : false
          const isEq = price
            ? Number((t.volume * price).toFixed(2)) === Number(t.investment)
            : false

          return (
            <TableRow
              key={t.id}
              className="!over:bg-none !border-b-DEFAULT cursor-pointer"
              onClick={() => router.push(`/${foundStockValue?.symbol}`)}>
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1
                    className={`text-14 truncate font-semibold ${
                      isEq && "text-[#344054]"
                    } ${isPos && "text-[#039855]"} ${
                      isNeg && "text-[#f04438]"
                    }`}>
                    {t.ticker}
                  </h1>
                </div>
              </TableCell>

              <TableCell className="pl-2 pr-10 font-semibold">
                {t.volume}
              </TableCell>

              <TableCell className="pl-2 pr-10">
                {`${price ? formatAmount(price) : "-"}`}
              </TableCell>

              <TableCell className="min-w-32 pl-2 pr-10">
                {`${formatAmount(t.investment)}`}
              </TableCell>

              <TableCell className="pl-2 pr-10 capitalize min-w-24">
                {`${price ? formatAmount(t.volume * price) : "-"}`}
              </TableCell>

              <TableCell
                className={`pl-2 pr-10 max-md:hidden ${
                  isEq && "text-[#344054]"
                } ${isPos && "text-[#039855]"} ${isNeg && "text-[#f04438]"}`}>
                {`${
                  isPos && price
                    ? `+${formatAmount(t.volume * price - t.investment)}`
                    : ""
                }${
                  isNeg && price
                    ? `-${formatAmount(t.investment - t.volume * price)}`
                    : ""
                }${isEq ? "$0" : ""}`}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default HoldingsTable
