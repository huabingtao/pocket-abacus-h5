export const LPR_RATES = {
  current: {
    oneYear: 0.03,
    fiveYear: 0.035
  },
  updateDate: '2026-02-24'
}

export const HOUSING_FUND_RATES = {
  firstSet: 0.0325,
  secondSet: 0.03575,
  updateDate: '2026-01-01'
}

export const RATE_HISTORY = [
  { date: '2026-02', oneYear: 0.03, fiveYear: 0.035 },
  { date: '2026-01', oneYear: 0.03, fiveYear: 0.035 },
  { date: '2025-12', oneYear: 0.03, fiveYear: 0.035 },
  { date: '2025-11', oneYear: 0.03, fiveYear: 0.035 },
  { date: '2025-10', oneYear: 0.031, fiveYear: 0.036 },
  { date: '2025-09', oneYear: 0.031, fiveYear: 0.036 },
  { date: '2025-08', oneYear: 0.032, fiveYear: 0.037 },
  { date: '2025-07', oneYear: 0.032, fiveYear: 0.037 },
  { date: '2025-06', oneYear: 0.032, fiveYear: 0.037 },
]

export const LOAN_TERMS = [
  { label: '6个月', value: 6 },
  { label: '1年', value: 12 },
  { label: '2年', value: 24 },
  { label: '3年', value: 36 },
  { label: '4年', value: 48 },
  { label: '5年', value: 60 },
  { label: '6年', value: 72 },
  { label: '7年', value: 84 },
  { label: '8年', value: 96 },
  { label: '9年', value: 108 },
  { label: '10年', value: 120 },
  { label: '11年', value: 132 },
  { label: '12年', value: 144 },
  { label: '13年', value: 156 },
  { label: '14年', value: 168 },
  { label: '15年', value: 180 },
  { label: '16年', value: 192 },
  { label: '17年', value: 204 },
  { label: '18年', value: 216 },
  { label: '19年', value: 228 },
  { label: '20年', value: 240 },
  { label: '21年', value: 252 },
  { label: '22年', value: 264 },
  { label: '23年', value: 276 },
  { label: '24年', value: 288 },
  { label: '25年', value: 300 },
  { label: '26年', value: 312 },
  { label: '27年', value: 324 },
  { label: '28年', value: 336 },
  { label: '29年', value: 348 },
  { label: '30年', value: 360 },
]

export const RATE_DISCOUNTS = [
  { label: '不打折', value: 1.0 },
  { label: '9.5折', value: 0.95 },
  { label: '9折', value: 0.9 },
  { label: '8.5折', value: 0.85 },
  { label: '8折', value: 0.8 },
  { label: '7.5折', value: 0.75 },
  { label: '7折', value: 0.7 },
  { label: '1.05倍', value: 1.05 },
  { label: '1.1倍', value: 1.1 },
  { label: '1.15倍', value: 1.15 },
  { label: '1.2倍', value: 1.2 },
]

export type LoanType = 'commercial' | 'provinceFund' | 'combined'
export type RepayMethod = 'equalInterest' | 'equalPrincipal'
export type RateType = 'lpr' | 'fixed'

export interface LoanConfig {
  loanType: LoanType
  totalAmount: number
  commercialAmount: number
  commercialRate: number
  commercialBp: number
  fundAmount: number
  fundRate: number
  months: number
  repayMethod: RepayMethod
  rateType: RateType
  fixedRate?: number
  lprValue: number
  resetMonth: number
}
