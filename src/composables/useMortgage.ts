import { ref, computed } from 'vue'
import type { LoanConfig, RepayMethod } from '../utils/constants'
import { LPR_RATES } from '../utils/constants'

export interface AmortizationRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface MortgageResult {
  monthlyPayment: number
  firstMonthPayment: number
  lastMonthPayment: number
  totalPayment: number
  totalInterest: number
  schedule: AmortizationRow[]
}

export function useMortgage() {
  const config = ref<LoanConfig>({
    loanType: 'commercial',
    totalAmount: 1000000,
    commercialAmount: 1000000,
    commercialRate: LPR_RATES.current.fiveYear,
    commercialBp: 0,
    fundAmount: 0,
    fundRate: 0.026,
    months: 240,
    repayMethod: 'equalInterest',
    rateType: 'lpr',
    fixedRate: LPR_RATES.current.fiveYear,
    lprValue: LPR_RATES.current.fiveYear,
    resetMonth: 1
  })

  function getEffectiveRate(_loanAmount: number, rate: number, bp: number, rateType: string, fixedRate?: number): number {
    if (rateType === 'fixed' && fixedRate) {
      return fixedRate
    }
    return rate + bp / 10000
  }

  function calculateEqualInterest(principal: number, annualRate: number, months: number): MortgageResult {
    if (principal <= 0 || annualRate <= 0 || months <= 0) {
      return {
        monthlyPayment: 0,
        firstMonthPayment: 0,
        lastMonthPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        schedule: []
      }
    }

    const monthlyRate = annualRate / 12
    const factor = Math.pow(1 + monthlyRate, months)
    const monthlyPayment = principal * monthlyRate * factor / (factor - 1)
    const totalPayment = monthlyPayment * months
    const totalInterest = totalPayment - principal

    const schedule: AmortizationRow[] = []
    let balance = principal

    for (let i = 0; i < months; i++) {
      const interest = balance * monthlyRate
      const principalPaid = monthlyPayment - interest
      balance -= principalPaid

      schedule.push({
        month: i + 1,
        payment: monthlyPayment,
        principal: principalPaid,
        interest,
        balance: Math.max(0, balance)
      })
    }

    return {
      monthlyPayment,
      firstMonthPayment: monthlyPayment,
      lastMonthPayment: monthlyPayment,
      totalPayment,
      totalInterest,
      schedule
    }
  }

  function calculateEqualPrincipal(principal: number, annualRate: number, months: number): MortgageResult {
    if (principal <= 0 || annualRate <= 0 || months <= 0) {
      return {
        monthlyPayment: 0,
        firstMonthPayment: 0,
        lastMonthPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        schedule: []
      }
    }

    const monthlyRate = annualRate / 12
    const monthlyPrincipal = principal / months
    let totalInterest = 0

    const schedule: AmortizationRow[] = []
    let balance = principal
    let firstMonthPayment = 0
    let lastMonthPayment = 0

    for (let i = 0; i < months; i++) {
      const interest = balance * monthlyRate
      const payment = monthlyPrincipal + interest
      totalInterest += interest
      balance -= monthlyPrincipal

      if (i === 0) firstMonthPayment = payment
      if (i === months - 1) lastMonthPayment = payment

      schedule.push({
        month: i + 1,
        payment,
        principal: monthlyPrincipal,
        interest,
        balance: Math.max(0, balance)
      })
    }

    return {
      monthlyPayment: firstMonthPayment,
      firstMonthPayment,
      lastMonthPayment,
      totalPayment: principal + totalInterest,
      totalInterest,
      schedule
    }
  }

  function calculateCommercial(): MortgageResult {
    const effectiveRate = getEffectiveRate(
      config.value.commercialAmount,
      config.value.lprValue,
      config.value.commercialBp,
      config.value.rateType,
      config.value.fixedRate
    )

    if (config.value.repayMethod === 'equalInterest') {
      return calculateEqualPrincipalInterest(config.value.commercialAmount, effectiveRate, config.value.months)
    } else {
      return calculateEqualPrincipal(config.value.commercialAmount, effectiveRate, config.value.months)
    }
  }

  function calculateFund(): MortgageResult {
    if (config.value.fundAmount <= 0) {
      return {
        monthlyPayment: 0,
        firstMonthPayment: 0,
        lastMonthPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        schedule: []
      }
    }

    if (config.value.repayMethod === 'equalInterest') {
      return calculateEqualPrincipalInterest(config.value.fundAmount, config.value.fundRate, config.value.months)
    } else {
      return calculateEqualPrincipal(config.value.fundAmount, config.value.fundRate, config.value.months)
    }
  }

  function calculateEqualPrincipalInterest(principal: number, annualRate: number, months: number): MortgageResult {
    if (principal <= 0 || annualRate <= 0 || months <= 0) {
      return {
        monthlyPayment: 0,
        firstMonthPayment: 0,
        lastMonthPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        schedule: []
      }
    }

    const monthlyRate = annualRate / 12
    const factor = Math.pow(1 + monthlyRate, months)
    const monthlyPayment = principal * monthlyRate * factor / (factor - 1)
    const totalPayment = monthlyPayment * months
    const totalInterest = totalPayment - principal

    const schedule: AmortizationRow[] = []
    let balance = principal

    for (let i = 0; i < months; i++) {
      const interest = balance * monthlyRate
      const principalPaid = monthlyPayment - interest
      balance -= principalPaid

      schedule.push({
        month: i + 1,
        payment: monthlyPayment,
        principal: principalPaid,
        interest,
        balance: Math.max(0, balance)
      })
    }

    return {
      monthlyPayment,
      firstMonthPayment: monthlyPayment,
      lastMonthPayment: monthlyPayment,
      totalPayment,
      totalInterest,
      schedule
    }
  }

  const result = computed<MortgageResult>(() => {
    if (config.value.loanType === 'commercial') {
      return calculateCommercial()
    } else if (config.value.loanType === 'provinceFund') {
      return calculateFund()
    } else {
      const commercial = calculateCommercial()
      const fund = calculateFund()
      return {
        monthlyPayment: commercial.monthlyPayment + fund.monthlyPayment,
        firstMonthPayment: commercial.firstMonthPayment + fund.firstMonthPayment,
        lastMonthPayment: commercial.lastMonthPayment + fund.lastMonthPayment,
        totalPayment: commercial.totalPayment + fund.totalPayment,
        totalInterest: commercial.totalInterest + fund.totalInterest,
        schedule: combineSchedules(commercial.schedule, fund.schedule)
      }
    }
  })

  function combineSchedules(s1: AmortizationRow[], s2: AmortizationRow[]): AmortizationRow[] {
    if (s1.length === 0) return s2
    if (s2.length === 0) return s1

    return s1.map((row, index) => ({
      month: row.month,
      payment: row.payment + (s2[index]?.payment || 0),
      principal: row.principal + (s2[index]?.principal || 0),
      interest: row.interest + (s2[index]?.interest || 0),
      balance: row.balance + (s2[index]?.balance || 0)
    }))
  }

  function setLoanType(type: 'commercial' | 'provinceFund' | 'combined') {
    config.value.loanType = type
  }

  function setTotalAmount(amount: number) {
    config.value.totalAmount = amount
    if (config.value.loanType === 'commercial') {
      config.value.commercialAmount = amount
    }
  }

  function setCommercialAmount(amount: number) {
    config.value.commercialAmount = amount
  }

  function setFundAmount(amount: number) {
    config.value.fundAmount = amount
  }

  function setMonths(months: number) {
    config.value.months = months
  }

  function setRepayMethod(method: RepayMethod) {
    config.value.repayMethod = method
  }

  function setRateType(type: 'lpr' | 'fixed') {
    config.value.rateType = type
  }

  function setLprValue(value: number) {
    config.value.lprValue = value
  }

  function setCommercialBp(bp: number) {
    config.value.commercialBp = bp
  }

  function setFixedRate(rate: number) {
    config.value.fixedRate = rate
  }

  function setResetMonth(month: number) {
    config.value.resetMonth = month
  }

  return {
    config,
    result,
    setLoanType,
    setTotalAmount,
    setCommercialAmount,
    setFundAmount,
    setMonths,
    setRepayMethod,
    setRateType,
    setLprValue,
    setCommercialBp,
    setFixedRate,
    setResetMonth,
    calculateEqualInterest,
    calculateEqualPrincipal
  }
}
