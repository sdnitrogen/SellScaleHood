import httpClient from "../httpClient"
import { parseStringify } from "../utils"

export const getWatchlist = async () => {
  try {
    const response = await httpClient.get("http://localhost:5000/get-watchlist")

    if (response.status === 200) {
      const userWatchlist = response.data
      return parseStringify(userWatchlist)
    }
  } catch (error) {
    console.error("Error", error)
  }
}

export const searchStock = async (ticker: string) => {
  try {
    const response = await httpClient.get(
      `http://localhost:5000/api/stock/${ticker}`
    )

    if (response.status === 200) {
      const stockInfo = response.data
      return parseStringify(stockInfo)
    }
  } catch (error) {
    console.error("Error", error)
  }
}

export const searchAllStocks = async (tickers: string) => {
  try {
    const response = await httpClient.get(
      `http://localhost:5000/api/stocks/${tickers}`
    )

    if (response.status === 200) {
      const stockInfo = response.data
      return parseStringify(stockInfo)
    }
  } catch (error) {
    console.error("Error", error)
  }
}

export const getHoldings = async () => {
  try {
    const response = await httpClient.get("http://localhost:5000/holdings")

    if (response.status === 200) {
      const userHoldings = response.data
      return parseStringify(userHoldings)
    }
  } catch (error) {
    console.error("Error", error)
  }
}

export const getTransactions = async () => {
  try {
    const response = await httpClient.get("http://localhost:5000/transactions")

    if (response.status === 200) {
      const userTrxs = response.data
      return parseStringify(userTrxs)
    }
  } catch (error) {
    console.error("Error", error)
  }
}

export const buyStock = async ({ ticker, volume, from }: buyProps) => {
  try {
    const response = await httpClient.post("http://localhost:5000/buy", {
      ticker,
      volume,
      from,
    })

    if (response.status === 200) {
      const buyUpdate = response.data
      return parseStringify(buyUpdate)
    }
  } catch (error) {
    console.error("Error", error)
  }
}

export const sellStock = async ({ ticker, volume, to }: sellProps) => {
  try {
    const response = await httpClient.post("http://localhost:5000/sell", {
      ticker,
      volume,
      to,
    })

    if (response.status === 200) {
      const sellUpdate = response.data
      return parseStringify(sellUpdate)
    }
  } catch (error) {
    console.error("Error", error)
  }
}

export const addToWatchlist = async ({ ticker }: { ticker: string }) => {
  try {
    const response = await httpClient.post(
      "http://localhost:5000/add-watchlist",
      {
        ticker,
      }
    )

    if (response.status === 200) {
      const watchAdded = response.data
      return parseStringify(watchAdded)
    }
  } catch (error) {
    console.error("Error", error)
  }
}

export const removeWatchlist = async ({ ticker }: { ticker: string }) => {
  try {
    const response = await httpClient.post(
      "http://localhost:5000/remove-watchlist",
      {
        ticker,
      }
    )

    if (response.status === 200) {
      const watchRemoved = response.data
      return parseStringify(watchRemoved)
    }
  } catch (error) {
    console.error("Error", error)
  }
}
