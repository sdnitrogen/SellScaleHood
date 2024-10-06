"use client"

import HeaderContainer from "@/components/HeaderContainer"
import TransactionsTable from "@/components/TransactionsTable"
import useGetTransactions from "@/hooks/useGetTransactions"
import React from "react"

const TransactionHistory = () => {
  const { transactions } = useGetTransactions()

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderContainer
          title="Transaction History"
          subtext="See your Stock trading history."
        />
      </div>

      <div className="space-y-6">
        <section className="flex w-full flex-col gap-6">
          <TransactionsTable transactions={transactions} />
        </section>
      </div>
    </div>
  )
}

export default TransactionHistory
