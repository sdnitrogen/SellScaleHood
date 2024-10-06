import { getWatchlist } from "@/lib/actions/stock.action"
import { useEffect, useState } from "react"

const useGetWatchlist = () => {
  const [watchlist, setWatchlist] = useState<Watchlist[]>([])

  useEffect(() => {
    const getList = async () => {
      const watchlistData = await getWatchlist()
      setWatchlist(watchlistData.watchlist)
    }

    getList()
  }, [])

  return { watchlist }
}

export default useGetWatchlist
