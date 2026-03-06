<template>
  <div class="home">
    <CatHeader />

    <div class="content">
      <!-- Tab 导航 -->
      <div class="tab-nav">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="nav-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <span class="nav-icon">{{ tab.icon }}</span>
          <span class="nav-label">{{ tab.label }}</span>
        </button>
      </div>

      <!-- 计算器主页 -->
      <template v-if="activeTab === 'calc'">
        <LoanInput />
        <RateSelector />
        <ResultCard :result="mortgageResult" :compare="compareResult" />
        <AmortizationTable :schedule="mortgageResult.schedule" />
      </template>

      <!-- LPR 重定价模拟 -->
      <template v-else-if="activeTab === 'lpr'">
        <div class="tip-card card">
          <span class="tip-icon">🐱</span>
          <span>基于左侧贷款设置自动计算，调整LPR年降幅来模拟不同情景</span>
        </div>
        <RateResetSim />
      </template>

      <!-- 提前还款 -->
      <template v-else-if="activeTab === 'early'">
        <div class="tip-card card">
          <span class="tip-icon">🐱</span>
          <span>基于左侧贷款设置计算，输入已还期数和提前还款金额</span>
        </div>
        <EarlyRepayCalc />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLoanStore } from '../stores/loan'
import CatHeader from '../components/CatHeader.vue'
import LoanInput from '../components/LoanInput.vue'
import RateSelector from '../components/RateSelector.vue'
import ResultCard from '../components/ResultCard.vue'
import AmortizationTable from '../components/AmortizationTable.vue'
import RateResetSim from '../components/RateResetSim.vue'
import EarlyRepayCalc from '../components/EarlyRepayCalc.vue'

const store = useLoanStore()
const activeTab = ref<'calc' | 'lpr' | 'early'>('calc')

const tabs: { key: 'calc' | 'lpr' | 'early'; icon: string; label: string }[] = [
  { key: 'calc',  icon: '🏠', label: '月供计算' },
  { key: 'lpr',   icon: '📈', label: 'LPR模拟' },
  { key: 'early', icon: '💰', label: '提前还款' },
]

// 核心计算 —— 根据 store 动态计算
const mortgageResult = computed(() => {
  const {
    loanType, repayMethod, rateType,
    commercialAmount, commercialBp, lprValue, fixedRate,
    fundAmount, fundRate, months
  } = store

  const effectiveCommRate = rateType === 'lpr'
    ? lprValue + commercialBp / 100
    : (fixedRate ?? lprValue)

  function epi(principal: number, rate: number, n: number) {
    if (principal <= 0 || rate <= 0 || n <= 0) return emptyResult()
    const r = rate / 12
    const f = Math.pow(1 + r, n)
    const mp = principal * r * f / (f - 1)
    const schedule = []
    let bal = principal
    for (let i = 0; i < n; i++) {
      const interest = bal * r
      const prin = mp - interest
      bal -= prin
      schedule.push({ month: i + 1, payment: mp, principal: prin, interest, balance: Math.max(0, bal) })
    }
    return { monthlyPayment: mp, firstMonthPayment: mp, lastMonthPayment: mp, totalPayment: mp * n, totalInterest: mp * n - principal, schedule }
  }

  function epn(principal: number, rate: number, n: number) {
    if (principal <= 0 || rate <= 0 || n <= 0) return emptyResult()
    const r = rate / 12
    const mp = principal / n
    let total = 0
    const schedule = []
    let bal = principal
    for (let i = 0; i < n; i++) {
      const interest = bal * r
      const payment = mp + interest
      total += interest
      bal -= mp
      schedule.push({ month: i + 1, payment, principal: mp, interest, balance: Math.max(0, bal) })
    }
    const first = schedule[0]?.payment ?? 0
    const last  = schedule[n - 1]?.payment ?? 0
    return { monthlyPayment: first, firstMonthPayment: first, lastMonthPayment: last, totalPayment: principal + total, totalInterest: total, schedule }
  }

  function emptyResult() {
    return { monthlyPayment: 0, firstMonthPayment: 0, lastMonthPayment: 0, totalPayment: 0, totalInterest: 0, schedule: [] }
  }

  function calc(principal: number, rate: number) {
    return repayMethod === 'equalInterest' ? epi(principal, rate, months) : epn(principal, rate, months)
  }

  function combine(a: ReturnType<typeof epi>, b: ReturnType<typeof epi>) {
    return {
      monthlyPayment: a.monthlyPayment + b.monthlyPayment,
      firstMonthPayment: a.firstMonthPayment + b.firstMonthPayment,
      lastMonthPayment: a.lastMonthPayment + b.lastMonthPayment,
      totalPayment: a.totalPayment + b.totalPayment,
      totalInterest: a.totalInterest + b.totalInterest,
      schedule: a.schedule.map((row, i) => ({
        month: row.month,
        payment: row.payment + (b.schedule[i]?.payment ?? 0),
        principal: row.principal + (b.schedule[i]?.principal ?? 0),
        interest: row.interest + (b.schedule[i]?.interest ?? 0),
        balance: row.balance + (b.schedule[i]?.balance ?? 0),
      }))
    }
  }

  if (loanType === 'commercial') return calc(commercialAmount, effectiveCommRate)
  if (loanType === 'provinceFund') return calc(fundAmount, fundRate)
  return combine(calc(commercialAmount, effectiveCommRate), calc(fundAmount, fundRate))
})

// 等额本息 vs 等额本金对比（仅在等额本息时展示节省提示）
const compareResult = computed(() => {
  if (store.repayMethod !== 'equalInterest') return undefined
  const { loanType, commercialAmount, fundAmount, commercialBp, lprValue, rateType, fixedRate, fundRate, months } = store
  const rate = rateType === 'lpr' ? lprValue + commercialBp / 100 : (fixedRate ?? lprValue)
  const principal = loanType === 'commercial' ? commercialAmount : loanType === 'provinceFund' ? fundAmount : commercialAmount + fundAmount
  const effRate = loanType === 'provinceFund' ? fundRate : rate

  const r = effRate / 12
  const n = months
  const f = Math.pow(1 + r, n)
  // 等额本息总利息
  const epiInterest = principal * r * f / (f - 1) * n - principal
  // 等额本金总利息
  const epnInterest = (principal / n) * r * (n + 1) / 2

  const epiFirst = principal * r * f / (f - 1)
  const epnFirst = principal / n + principal * r

  return {
    savedInterest: Math.max(0, epiInterest - epnInterest),
    firstMonthDiff: Math.max(0, epnFirst - epiFirst)
  }
})
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background: var(--bg-color);
  padding: 20px;
}

.content {
  margin-top: 0;
}

.tab-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  background: #fff;
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.nav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 4px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;

  .nav-icon {
    font-size: 18px;
  }

  .nav-label {
    font-size: 11px;
    color: var(--text-light);
    font-weight: 500;
  }

  &.active {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    box-shadow: 0 2px 8px rgba(255, 155, 133, 0.3);

    .nav-label {
      color: #fff;
      font-weight: 600;
    }
  }
}

.tip-card {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  padding: 12px 14px;
  margin-bottom: 0;
  line-height: 1.6;

  .tip-icon {
    flex-shrink: 0;
    font-size: 16px;
  }
}
</style>
