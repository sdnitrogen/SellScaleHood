import { getBankAccounts } from "@/lib/actions/bank.actions"
import { useEffect, useState } from "react"

const useBankAccounts = () => {
  const [accounts, setAccounts] = useState<AccountsData | null>(null)

  useEffect(() => {
    const getAccounts = async () => {
      const bankAccounts = await getBankAccounts()
      setAccounts(bankAccounts)
    }

    getAccounts()
  }, [])

  return { accounts }
}

export default useBankAccounts
