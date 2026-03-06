export interface EarlyRepayResult {
  originalMonthlyPayment: number
  newMonthlyPayment: number
  savedInterest: number
  newMonths: number
  originalTotalInterest: number
  newTotalInterest: number
}

export interface EarlyRepayConfig {
  principal: number
  annualRate: number
  totalMonths: number
  monthsPaid: number
  repayAmount: number
  strategy: 'shortenTerm' | 'reducePayment'
}

export function useEarlyRepay() {
  function calculateEarlyRepay(config: EarlyRepayConfig): EarlyRepayResult {
    const { principal, annualRate, totalMonths, monthsPaid, repayAmount, strategy } = config

    if (principal <= 0 || annualRate <= 0 || totalMonths <= 0 || monthsPaid < 0 || repayAmount <= 0) {
      return {
        originalMonthlyPayment: 0,
        newMonthlyPayment: 0,
        savedInterest: 0,
        newMonths: 0,
        originalTotalInterest: 0,
        newTotalInterest: 0
      }
    }

    const monthlyRate = annualRate / 12
    const remainingMonths = totalMonths - monthsPaid
    const remainingPrincipal = calculateRemainingPrincipal(principal, annualRate, totalMonths, monthsPaid)
    const newPrincipal = remainingPrincipal - repayAmount

    if (newPrincipal <= 0) {
      return {
        originalMonthlyPayment: 0,
        newMonthlyPayment: 0,
        savedInterest: 0,
        newMonths: 0,
        originalTotalInterest: 0,
        newTotalInterest: 0
      }
    }

    const originalMonthlyPayment = calculateOriginalMonthlyPayment(principal, annualRate, totalMonths)
    const originalTotalInterest = calculateOriginalTotalInterest(principal, annualRate, totalMonths)
    const originalInterestPaid = calculateOriginalInterestPaid(principal, annualRate, totalMonths, monthsPaid)

    let newMonthlyPayment = 0
    let newTotalInterest = 0
    let newMonths = 0

    if (strategy === 'reducePayment') {
      newMonthlyPayment = calculateEqualInterestPayment(newPrincipal, monthlyRate, remainingMonths)
      newTotalInterest = calculateEqualInterestTotal(newPrincipal, monthlyRate, remainingMonths)
      newMonths = remainingMonths
    } else {
      const originalPayment = originalMonthlyPayment
      newMonths = calculateNewMonths(newPrincipal, monthlyRate, originalPayment)
      newTotalInterest = calculateTotalInterestShortenTerm(newPrincipal, monthlyRate, newMonths)
      newMonthlyPayment = originalPayment
    }

    const savedInterest = (originalTotalInterest - originalInterestPaid) - newTotalInterest

    return {
      originalMonthlyPayment,
      newMonthlyPayment,
      savedInterest: Math.max(0, savedInterest),
      newMonths,
      originalTotalInterest,
      newTotalInterest
    }
  }

  function calculateRemainingPrincipal(principal: number, annualRate: number, totalMonths: number, monthsPaid: number): number {
    const monthlyRate = annualRate / 12
    const monthlyPayment = calculateEqualInterestPayment(principal, monthlyRate, totalMonths)
    let balance = principal

    for (let i = 0; i < monthsPaid; i++) {
      const interest = balance * monthlyRate
      const principalPaid = monthlyPayment - interest
      balance -= principalPaid
    }

    return Math.max(0, balance)
  }

  function calculateOriginalMonthlyPayment(principal: number, annualRate: number, totalMonths: number): number {
    const monthlyRate = annualRate / 12
    return calculateEqualInterestPayment(principal, monthlyRate, totalMonths)
  }

  function calculateOriginalTotalInterest(principal: number, annualRate: number, totalMonths: number): number {
    const monthlyRate = annualRate / 12
    return calculateEqualInterestTotal(principal, monthlyRate, totalMonths)
  }

  function calculateOriginalInterestPaid(principal: number, annualRate: number, totalMonths: number, monthsPaid: number): number {
    const monthlyRate = annualRate / 12
    const monthlyPayment = calculateEqualInterestPayment(principal, monthlyRate, totalMonths)
    let balance = principal
    let totalInterest = 0

    for (let i = 0; i < monthsPaid; i++) {
      const interest = balance * monthlyRate
      totalInterest += interest
      balance -= (monthlyPayment - interest)
    }

    return totalInterest
  }

  function calculateEqualInterestPayment(principal: number, monthlyRate: number, months: number): number {
    const factor = Math.pow(1 + monthlyRate, months)
    return principal * monthlyRate * factor / (factor - 1)
  }

  function calculateEqualInterestTotal(principal: number, monthlyRate: number, months: number): number {
    const monthlyPayment = calculateEqualInterestPayment(principal, monthlyRate, months)
    return monthlyPayment * months - principal
  }

  function calculateNewMonths(principal: number, monthlyRate: number, targetPayment: number): number {
    if (monthlyRate === 0) {
      return Math.ceil(principal / targetPayment)
    }

    const months = Math.log(targetPayment / (targetPayment - principal * monthlyRate)) / Math.log(1 + monthlyRate)
    return Math.ceil(months)
  }

  function calculateTotalInterestShortenTerm(principal: number, monthlyRate: number, months: number): number {
    const payment = calculateEqualInterestPayment(principal, monthlyRate, months)
    return payment * months - principal
  }

  return {
    calculateEarlyRepay
  }
}
