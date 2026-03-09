import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoanType, RepayMethod, RateType } from '../utils/constants'
import { LPR_RATES } from '../utils/constants'

export const useLoanStore = defineStore('loan', () => {
  const loanType = ref<LoanType>('commercial')
  const totalAmount = ref(1000000)
  const commercialAmount = ref(1000000)
  const commercialRate = ref(LPR_RATES.current.fiveYear)
  const commercialBp = ref(0)
  const fundAmount = ref(0)
  const fundRate = ref(0.026)
  const months = ref(240)
  const repayMethod = ref<RepayMethod>('equalInterest')
  const rateType = ref<RateType>('lpr')
  const fixedRate = ref(LPR_RATES.current.fiveYear)
  const lprValue = ref(LPR_RATES.current.fiveYear)
  const resetMonth = ref(1)

  const showEarlyRepay = ref(false)
  const earlyRepayAmount = ref(0)
  const earlyRepayMonthsPaid = ref(0)
  const earlyRepayStrategy = ref<'shortenTerm' | 'reducePayment'>('shortenTerm')

  function setLoanType(type: LoanType) {
    loanType.value = type
  }

  function setTotalAmount(amount: number) {
    totalAmount.value = amount
  }

  function setCommercialAmount(amount: number) {
    commercialAmount.value = amount
  }

  function setFundAmount(amount: number) {
    fundAmount.value = amount
  }

  function setFundRate(rate: number) {
    fundRate.value = rate
  }

  function setMonths(m: number) {
    months.value = m
  }

  function setRepayMethod(method: RepayMethod) {
    repayMethod.value = method
  }

  function setRateType(type: RateType) {
    rateType.value = type
  }

  function setCommercialBp(bp: number) {
    commercialBp.value = bp
  }

  function setFixedRate(rate: number) {
    fixedRate.value = rate
  }

  function setLprValue(value: number) {
    lprValue.value = value
  }

  function setResetMonth(month: number) {
    resetMonth.value = month
  }

  function setShowEarlyRepay(show: boolean) {
    showEarlyRepay.value = show
  }

  function setEarlyRepayAmount(amount: number) {
    earlyRepayAmount.value = amount
  }

  function setEarlyRepayMonthsPaid(months: number) {
    earlyRepayMonthsPaid.value = months
  }

  function setEarlyRepayStrategy(strategy: 'shortenTerm' | 'reducePayment') {
    earlyRepayStrategy.value = strategy
  }

  return {
    loanType,
    totalAmount,
    commercialAmount,
    commercialRate,
    commercialBp,
    fundAmount,
    fundRate,
    months,
    repayMethod,
    rateType,
    fixedRate,
    lprValue,
    resetMonth,
    showEarlyRepay,
    earlyRepayAmount,
    earlyRepayMonthsPaid,
    earlyRepayStrategy,
    setLoanType,
    setTotalAmount,
    setCommercialAmount,
    setFundAmount,
    setFundRate,
    setMonths,
    setRepayMethod,
    setRateType,
    setCommercialBp,
    setFixedRate,
    setLprValue,
    setResetMonth,
    setShowEarlyRepay,
    setEarlyRepayAmount,
    setEarlyRepayMonthsPaid,
    setEarlyRepayStrategy
  }
})
