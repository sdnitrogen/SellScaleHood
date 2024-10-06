import React from "react"
import HoldingsTable from "./HoldingsTable"

const StockHoldings = ({
  holdings,
  stocks,
}: {
  holdings: Holding[]
  stocks: Stock[]
}) => {
  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Stock Holdings</h2>
      </header>
      <HoldingsTable holdings={holdings} stocks={stocks} />
    </section>
  )
}

export default StockHoldings
