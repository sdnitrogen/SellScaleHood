/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// ========================================

declare type SignUpParams = {
  firstName: string
  lastName: string
  address1: string
  city: string
  state: string
  postalCode: string
  dateOfBirth: string
  email: string
  password: string
}

declare type AddBankAccountsParams = {
  userId: string
  bankAccounts: Account[]
}

declare type LoginUser = {
  email: string
  password: string
}

declare type User = {
  email: string
  id: string
  firstName: string
  lastName: string
  address1: string
  city: string
  state: string
  postalCode: string
  dateOfBirth: string
}

declare type NewUserParams = {
  userId: string
  email: string
  name: string
  password: string
}

declare type Holding = {
  id: number
  userId: string
  ticker: string
  volume: number
  investment: number
}

declare type ChartData = {
  name: string
  value: number
  fill: string
}

declare type Account = {
  id?: string
  userId?: string
  currentBalance: number
  mask: string
  name: string
}

declare type AccountsData = {
  userId: string
  data: Account[]
  totalCurrentBalance: number
}

declare type Transaction = {
  id: number
  ticker: string
  trade_date: string
  trade_price: number
  trade_type: string
  userId: string
  volume: number
}

declare type Bank = {
  $id: string
  accountId: string
  bankId: string
  accessToken: string
  fundingSourceUrl: string
  userId: string
  sharableId: string
}

declare interface BalanceTagProps {
  title: string
  value: number
  net?: string
}

declare interface CreditCardProps {
  account: Account
  userName: string
  showBalance?: boolean
}

declare interface HeaderContainerProps {
  type?: "title" | "greeting"
  title: string
  subtext: string
  user?: string
}

declare interface MobileNavProps {
  user: User
}

declare interface PageHeaderProps {
  topTitle: string
  bottomTitle: string
  topDescription: string
  bottomDescription: string
  connectBank?: boolean
}

// declare type User = sdk.Models.Document & {
//   accountId: string;
//   email: string;
//   name: string;
//   items: string[];
//   accessToken: string;
//   image: string;
// };

declare interface AuthFormProps {
  type: "sign-in" | "sign-up"
}

declare interface BankDropdownProps {
  accounts: Account[]
  setValue?: UseFormSetValue<unknown>
  otherStyles?: string
}

declare interface PortfolioBalanceContainerProps {
  holdings: Holding[]
  cashBalance: number
  stocks: Stock[]
}

declare interface FooterProps {
  user: User
  type?: string
}

declare type StockHistory = {
  month: string
  average_price: number
}

declare interface Stock {
  symbol: string
  currentPrice: number
  name: string
  sector: string
  previousClose: number
  history?: StockHistory[]
  website?: string
}

declare interface Watchlist {
  id: number
  userId: string
  ticker: string
}

declare interface RightSidebarProps {
  user: User
  watchlist: Watchlist[]
  banks: Account[]
  stocks: Stock[]
}

declare interface SiderbarProps {
  user: User
}

declare interface TransactionHistoryTableProps {
  transactions: Transaction[]
  page: number
}

declare interface CategoryBadgeProps {
  category: string
}

declare interface TransactionTableProps {
  transactions: Transaction[]
}

declare interface buyProps {
  ticker: string
  volume: number
  from: string
}

declare interface sellProps {
  ticker: string
  volume: number
  to: string
}

declare interface CategoryProps {
  category: CategoryCount
}

declare interface DoughnutChartProps {
  holdings: Holding[]
  cash: number
  stocks: Stock[]
}

// Actions
declare interface getAccountsProps {
  userId: string
}

declare interface getTransactionsByBankIdProps {
  bankId: string
}

declare interface signInProps {
  email: string
  password: string
}

declare interface getUserInfoProps {
  userId: string
}

declare interface getBanksProps {
  userId: string
}
