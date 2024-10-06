import React from "react"
import DoughNutChart from "./DoughnutChart"
import BalanceTag from "./BalanceTag"

const PortfolioBalanceContainer = ({
  holdings = [],
  cashBalance,
  stocks,
}: PortfolioBalanceContainerProps) => {
  const holdingValue = holdings.reduce(
    (sum, holding) =>
      (sum +=
        stocks.find((stock) => stock.symbol === holding.ticker)?.currentPrice! *
        holding.volume),
    0
  )
  const capInvested = holdings.reduce(
    (sum, holding) => (sum += Number(holding.investment)),
    0
  )

  return (
    <section className=" flex gap-4 total-balance">
      <div className="total-balance-chart">
        <DoughNutChart holdings={holdings} cash={cashBalance} stocks={stocks} />
      </div>
      <div className="flex min-w-[200px] flex-col gap-6">
        <BalanceTag title="Cash Balance" value={cashBalance} />
        <BalanceTag title="Est. Holdings Value" value={holdingValue} />
        <BalanceTag title="Capital Invested" value={capInvested} />
        <BalanceTag
          title="Net Gain / Loss"
          net={
            holdingValue === capInvested
              ? ""
              : holdingValue > capInvested
              ? "+"
              : "-"
          }
          value={
            holdingValue > capInvested
              ? holdingValue - capInvested
              : capInvested - holdingValue
          }
        />
      </div>
    </section>
  )
}

export default PortfolioBalanceContainer
