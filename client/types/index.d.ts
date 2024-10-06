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

declare type AccountTypes =
  | "depository"
  | "credit"
  | "loan "
  | "investment"
  | "other"

declare type Category = "Food and Drink" | "Travel" | "Transfer"

declare type CategoryCount = {
  name: string
  count: number
  totalCount: number
}

declare type Receiver = {
  firstName: string
  lastName: string
}

declare type TransferParams = {
  sourceFundingSourceUrl: string
  destinationFundingSourceUrl: string
  amount: string
}

declare type AddFundingSourceParams = {
  dwollaCustomerId: string
  processorToken: string
  bankName: string
}

declare type NewDwollaCustomerParams = {
  firstName: string
  lastName: string
  email: string
  type: string
  address1: string
  city: string
  state: string
  postalCode: string
  dateOfBirth: string
  ssn: string
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

declare interface BankInfoProps {
  account: Account
  appwriteItemId?: string
  type: "full" | "card"
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

declare interface PaginationProps {
  page: number
  totalPages: number
}

declare interface PlaidLinkProps {
  user: User
  variant?: "primary" | "ghost"
  dwollaCustomerId?: string
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

declare interface BankTabItemProps {
  account: Account
  appwriteItemId?: string
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

declare interface RecentTransactionsProps {
  accounts: Account[]
  transactions: Transaction[]
  appwriteItemId: string
  page: number
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

declare interface PaymentTransferFormProps {
  accounts: Account[]
}

// Actions
declare interface getAccountsProps {
  userId: string
}

declare interface getAccountProps {
  appwriteItemId: string
}

declare interface getInstitutionProps {
  institutionId: string
}

declare interface getTransactionsProps {
  accessToken: string
}

declare interface CreateFundingSourceOptions {
  customerId: string // Dwolla Customer ID
  fundingSourceName: string // Dwolla Funding Source Name
  plaidToken: string // Plaid Account Processor Token
  _links: object // Dwolla On Demand Authorization Link
}

declare interface CreateTransactionProps {
  name: string
  amount: string
  senderId: string
  senderBankId: string
  receiverId: string
  receiverBankId: string
  email: string
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

declare interface exchangePublicTokenProps {
  publicToken: string
  user: User
}

declare interface createBankAccountProps {
  accessToken: string
  userId: string
  accountId: string
  bankId: string
  fundingSourceUrl: string
  sharableId: string
}

declare interface getBanksProps {
  userId: string
}

declare interface getBankProps {
  documentId: string
}

declare interface getBankByAccountIdProps {
  accountId: string
}
