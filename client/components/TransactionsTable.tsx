import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { transactionCategoryStyles } from "@/constants"
import { cn, formatAmount, formatDateTime } from "@/lib/utils"

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const { borderColor, backgroundColor, textColor, chipBackgroundColor } =
    transactionCategoryStyles[
      category as keyof typeof transactionCategoryStyles
    ] || transactionCategoryStyles.default

  return (
    <div className={cn("category-badge", borderColor, chipBackgroundColor)}>
      <div className={cn("size-2 rounded-full", backgroundColor)} />
      <p className={cn("text-[12px] font-medium", textColor)}>{category}</p>
    </div>
  )
}

const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-4">Stock</TableHead>
          <TableHead className="px-2">Volume</TableHead>
          <TableHead className="px-2">Type</TableHead>
          <TableHead className="px-2">Trading Price</TableHead>
          <TableHead className="px-2 max-md:hidden">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t: Transaction) => {
          return (
            <TableRow
              key={t.id}
              className={`${
                t.trade_type === "sell"
                  ? "bg-[#FFFBFA] hover:bg-[#FFFBFA]"
                  : "bg-[#F6FEF9] hover:bg-[#F6FEF9]"
              } !border-b-DEFAULT cursor-default`}>
              <TableCell className="max-w-[250px]">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {t.ticker}
                  </h1>
                </div>
              </TableCell>

              <TableCell className="pl-2 pr-10">{t.volume}</TableCell>

              <TableCell className="pl-2 pr-10">
                <CategoryBadge category={t.trade_type} />
              </TableCell>

              <TableCell className="pl-2 pr-10">
                {formatAmount(t.trade_price)}
              </TableCell>

              <TableCell className="min-w-32 pl-2 pr-10">
                {formatDateTime(new Date(t.trade_date)).dateTime}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default TransactionsTable
