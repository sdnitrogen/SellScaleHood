export const sidebarLinks = [
  {
    imgURL: "/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/icons/dollar-circle.svg",
    route: "/my-banks",
    label: "My Banks",
  },
  {
    imgURL: "/icons/transaction.svg",
    route: "/transaction-history",
    label: "Transaction History",
  },
]

export const MOCK_BANK_ACCOUNTS = [
  {
    $id: "chk",
    account: {
      id: "",
      currentBalance: 5000,
      mask: "1234",
      name: "Checking Account",
    },
  },
  {
    $id: "svg",
    account: {
      id: "",
      currentBalance: 5000,
      mask: "1234",
      name: "Savings Account",
    },
  },
]

export const MOCK_HOLDINGS = [
  {
    id: 1,
    userId: "",
    ticker: "AAPL",
    volume: 10,
    investment: 1431,
  },
  {
    id: 2,
    userId: "",
    ticker: "MSFT",
    volume: 23,
    investment: 4398.7,
  },
  {
    id: 3,
    userId: "",
    ticker: "NFLX",
    volume: 5,
    investment: 1006.66,
  },
  {
    id: 4,
    userId: "",
    ticker: "TSLA",
    volume: 12,
    investment: 1877.9,
  },
  {
    id: 5,
    userId: "",
    ticker: "GOOGL",
    volume: 23,
    investment: 4398.7,
  },
  {
    id: 6,
    userId: "",
    ticker: "AMZN",
    volume: 5,
    investment: 1006.66,
  },
  {
    id: 7,
    userId: "",
    ticker: "NVDA",
    volume: 12,
    investment: 1877.9,
  },
]

export const transactionCategoryStyles = {
  buy: {
    borderColor: "border-success-600",
    backgroundColor: "bg-green-600",
    textColor: "text-success-700",
    chipBackgroundColor: "bg-inherit",
  },
  sell: {
    borderColor: "border-red-700",
    backgroundColor: "bg-red-700",
    textColor: "text-red-700",
    chipBackgroundColor: "bg-inherit",
  },
  Processing: {
    borderColor: "border-[#F2F4F7]",
    backgroundColor: "bg-gray-500",
    textColor: "text-[#344054]",
    chipBackgroundColor: "bg-[#F2F4F7]",
  },
  Success: {
    borderColor: "border-[#12B76A]",
    backgroundColor: "bg-[#12B76A]",
    textColor: "text-[#027A48]",
    chipBackgroundColor: "bg-[#ECFDF3]",
  },
  default: {
    borderColor: "",
    backgroundColor: "bg-blue-500",
    textColor: "text-blue-700",
    chipBackgroundColor: "bg-inherit",
  },
}
