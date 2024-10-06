import { getTransactions } from "@/lib/actions/stock.action"
import { useEffect, useState } from "react"

const useGetTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const getList = async () => {
      const trxsData = await getTransactions()
      setTransactions(trxsData.transactions)
    }

    getList()
  }, [])

  return { transactions }
}

export default useGetTransactions
