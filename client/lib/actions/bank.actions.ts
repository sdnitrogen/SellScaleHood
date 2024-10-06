import httpClient from "../httpClient"
import { parseStringify } from "../utils"

export const addBankAccounts = async ({
  ...bankAccountsData
}: AddBankAccountsParams) => {
  const { userId, bankAccounts } = bankAccountsData
  try {
    const response = await httpClient.post(
      "http://localhost:5000/add-bank-accounts",
      {
        userId,
        bankAccounts,
      }
    )

    if (response.status === 200) {
      const addedAccounts = response.data
      return parseStringify(addedAccounts)
    }
  } catch (error) {
    console.error("Error", error)
  }
}

export const getBankAccounts = async () => {
  try {
    const response = await httpClient.get(
      "http://localhost:5000/get-bank-accounts"
    )

    if (response.status === 200) {
      const userBankAccounts = response.data
      const banks = userBankAccounts.bankAccounts
      const totalCurrentBalance = banks.reduce(
        (total: number, account: Account) => {
          return total + Number(account.currentBalance)
        },
        0
      )
      return parseStringify({
        userId: userBankAccounts.userId,
        data: userBankAccounts.bankAccounts,
        totalCurrentBalance,
      })
    }
  } catch (error) {
    console.error("Error", error)
  }
}
