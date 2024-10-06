import { getHoldings } from "@/lib/actions/stock.action"
import { useEffect, useState } from "react"

const useGetHoldings = () => {
  const [holdings, setHoldings] = useState<Holding[]>([])

  useEffect(() => {
    const getList = async () => {
      const holdingsData = await getHoldings()
      setHoldings(holdingsData.holdings)
    }

    getList()
  }, [])

  return { holdings }
}

export default useGetHoldings
