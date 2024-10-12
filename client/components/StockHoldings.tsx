import React, { useState } from "react"
import HoldingsTable from "./HoldingsTable"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { fetchPortfolioReview } from "@/lib/actions/ai.action"
import { Loader2 } from "lucide-react"

const StockHoldings = ({
  holdings,
  stocks,
}: {
  holdings: Holding[]
  stocks: Stock[]
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState("")
  const handleAnalyzePortfolio = async () => {
    setIsLoading(true)
    setResponse("")
    try {
      const portfolioReview = await fetchPortfolioReview()
      setResponse(portfolioReview)
    } catch (error) {
      console.error("Error", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Stock Holdings</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="bg-bankGradient hover:bg-bank-gradient"
              onClick={handleAnalyzePortfolio}
              disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp;
                  Loading...
                </>
              ) : (
                "Analyze Portfolio"
              )}
            </Button>
          </DialogTrigger>
          {response !== "" && (
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Analysis</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4 whitespace-pre-line">
                {response}
              </div>
            </DialogContent>
          )}
        </Dialog>
      </header>
      <HoldingsTable holdings={holdings} stocks={stocks} />
    </section>
  )
}

export default StockHoldings
