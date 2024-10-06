"use client"

import BankCard from "@/components/BankCard"
import HeaderContainer from "@/components/HeaderContainer"
import useBankAccounts from "@/hooks/useBankAccounts"
import useCurrentUser from "@/hooks/useCurrentUser"
import React from "react"

const MyBanks = () => {
  const { loggedIn } = useCurrentUser()
  const { accounts } = useBankAccounts()

  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderContainer
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activites."
        />

        <div className="space-y-4">
          <h2 className="header-2">Your cards</h2>
          <div className="flex flex-wrap gap-6">
            {accounts &&
              accounts.data.map((a: Account) => (
                <BankCard
                  key={a.id}
                  account={a}
                  userName={`${loggedIn?.firstName} ${loggedIn?.lastName}`}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyBanks
