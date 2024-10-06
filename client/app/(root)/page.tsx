"use client"

import HeaderContainer from "@/components/HeaderContainer"
import PortfolioBalanceContainer from "@/components/PortfolioBalanceContainer"
import RightSidebar from "@/components/RightSidebar"
import StockHoldings from "@/components/StockHoldings"
import useBankAccounts from "@/hooks/useBankAccounts"
import useCurrentUser from "@/hooks/useCurrentUser"
import useGetHoldings from "@/hooks/useGetHoldings"
import useGetWatchlist from "@/hooks/useGetWatchlist"
import { searchAllStocks } from "@/lib/actions/stock.action"
import { useEffect, useMemo, useState } from "react"

const Home = () => {
  const { holdings: holdingsdata } = useGetHoldings()
  const [stockData, setStockData] = useState<Stock[]>([])
  const { accounts: acccountsData } = useBankAccounts()
  const [accounts, setAccounts] = useState<AccountsData | null>(null)
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [watchlist, setWatchlist] = useState<Watchlist[]>([])

  const { loggedIn } = useCurrentUser()
  const { watchlist: watchlistData } = useGetWatchlist()

  useEffect(() => {
    setAccounts(acccountsData)
    setHoldings(holdingsdata)
    setWatchlist(watchlistData)
  }, [acccountsData, holdingsdata, watchlistData])

  useEffect(() => {
    const watch_stocks = watchlist.map((w) => w.ticker)
    const holding_stocks = holdings.map((h) => h.ticker)
    const symbols = Array.from(new Set([...watch_stocks, ...holding_stocks]))
    const getStocksInfo = async () => {
      const response = await searchAllStocks(symbols.join(","))
      setStockData(response)
    }
    if (symbols.length > 0) getStocksInfo()
  }, [watchlist, holdings])

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderContainer
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Access and manage your portfolio and transactions efficiently."
          />
          <PortfolioBalanceContainer
            cashBalance={accounts?.totalCurrentBalance || 0}
            holdings={holdings}
            stocks={stockData}
          />
        </header>
        <StockHoldings holdings={holdings} stocks={stockData} />
      </div>
      {loggedIn && (
        <RightSidebar
          user={loggedIn}
          watchlist={watchlist || []}
          banks={accounts?.data || []}
          stocks={stockData}
        />
      )}
    </section>
  )
}

export default Home
