import { ref, computed } from 'vue'
import { LPR_RATES, RATE_HISTORY } from '../utils/constants'

export interface RateProjection {
  year: number
  lpr: number
  rate: number
  monthlyPayment: number
  change: number
}

export function useLPR() {
  const currentLPR = ref(LPR_RATES.current.fiveYear)
  const bp = ref(0)
  const loanAmount = ref(1000000)
  const months = ref(240)
  const lprChangePerYear = ref(0.0025)

  const effectiveRate = computed(() => {
    return currentLPR.value + bp.value / 10000
  })

  function calculateEffectiveRate(lpr: number, bpValue: number): number {
    return lpr + bpValue / 10000
  }

  function getCurrentLPR(): number {
    return LPR_RATES.current.fiveYear
  }

  function getRateHistory() {
    return RATE_HISTORY
  }

  function simulateRateReset(
    principal: number,
    lprValue: number,
    bpValue: number,
    totalMonths: number,
    changePerYear: number = 0.0025,
    years: number = 5
  ): RateProjection[] {
    const projections: RateProjection[] = []
    const monthlyRate = (lprValue + bpValue / 10000) / 12
    const factor = Math.pow(1 + monthlyRate, totalMonths)
    const basePayment = principal * monthlyRate * factor / (factor - 1)

    for (let year = 1; year <= years; year++) {
      const projectedLPR = lprValue - (changePerYear * year)
      const rate = projectedLPR + bpValue / 10000
      const projMonthlyRate = rate / 12
      const projFactor = Math.pow(1 + projMonthlyRate, totalMonths)
      const projPayment = principal * projMonthlyRate * projFactor / (projFactor - 1)

      projections.push({
        year,
        lpr: projectedLPR,
        rate,
        monthlyPayment: projPayment,
        change: projPayment - basePayment
      })
    }

    return projections
  }

  function setCurrentLPR(value: number) {
    currentLPR.value = value
  }

  function setBp(value: number) {
    bp.value = value
  }

  function setLoanAmount(value: number) {
    loanAmount.value = value
  }

  function setMonths(value: number) {
    months.value = value
  }

  function setLprChangePerYear(value: number) {
    lprChangePerYear.value = value
  }

  const projections = computed(() => {
    return simulateRateReset(
      loanAmount.value,
      currentLPR.value,
      bp.value,
      months.value,
      lprChangePerYear.value,
      5
    )
  })

  return {
    currentLPR,
    bp,
    loanAmount,
    months,
    lprChangePerYear,
    effectiveRate,
    projections,
    calculateEffectiveRate,
    getCurrentLPR,
    getRateHistory,
    simulateRateReset,
    setCurrentLPR,
    setBp,
    setLoanAmount,
    setMonths,
    setLprChangePerYear
  }
}
