<template>
  <div class="result-card card fade-in">
    <div class="section-title">计算结果</div>

    <!-- 主要数字 -->
    <div class="main-result">
      <div class="monthly-label">
        <span class="cat-icon">🐱</span>
        {{ store.repayMethod === 'equalInterest' ? '每月固定还款' : '首月还款额' }}
      </div>
      <div class="monthly-value">
        <span class="currency">¥</span>
        <span class="amount">{{ formatCurrency(result.monthlyPayment) }}</span>
      </div>
      <div v-if="store.repayMethod === 'equalPrincipal'" class="range-hint">
        末月还款 ¥{{ formatCurrency(result.lastMonthPayment) }}（逐月递减）
      </div>
    </div>

    <!-- 详细数据 -->
    <div class="details-grid">
      <div class="detail-item">
        <div class="detail-label">贷款总额</div>
        <div class="detail-value">¥{{ formatCurrency(totalLoanAmount) }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">还款总额</div>
        <div class="detail-value">¥{{ formatCurrency(result.totalPayment) }}</div>
      </div>
      <div class="detail-item highlight">
        <div class="detail-label">总利息</div>
        <div class="detail-value interest">¥{{ formatCurrency(result.totalInterest) }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">利息占比</div>
        <div class="detail-value">{{ interestRatio }}%</div>
      </div>
    </div>

    <!-- 还款方式对比提示 -->
    <div class="compare-tip" v-if="compare">
      <span class="tip-icon">💡</span>
      <span>与等额本息相比，等额本金可节省利息
        <strong>¥{{ formatCurrency(compare.savedInterest) }}</strong>，
        但首月多还 <strong>¥{{ formatCurrency(compare.firstMonthDiff) }}</strong>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLoanStore } from '../stores/loan'
import { formatCurrency } from '../utils/formatters'
import type { MortgageResult } from '../composables/useMortgage'

const props = defineProps<{
  result: MortgageResult
  compare?: {
    savedInterest: number
    firstMonthDiff: number
  }
}>()

const store = useLoanStore()

const totalLoanAmount = computed(() => {
  if (store.loanType === 'commercial') return store.commercialAmount
  if (store.loanType === 'provinceFund') return store.fundAmount
  return store.commercialAmount + store.fundAmount
})

const interestRatio = computed(() => {
  if (props.result.totalPayment <= 0) return '0.00'
  return ((props.result.totalInterest / props.result.totalPayment) * 100).toFixed(2)
})
</script>

<style scoped lang="scss">
.result-card {
  padding: 20px 16px;
  background: linear-gradient(135deg, #fff, #fff8f5);
  border: 1px solid #ffe4dc;
}

.main-result {
  text-align: center;
  padding: 16px 0;
}

.monthly-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.monthly-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.currency {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
}

.amount {
  font-size: 40px;
  font-weight: 800;
  color: var(--primary-color);
  letter-spacing: -1px;
  line-height: 1;
}

.range-hint {
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-light);
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 16px;
}

.detail-item {
  background: var(--secondary-color);
  border-radius: 10px;
  padding: 12px;

  &.highlight {
    background: #fff0eb;
  }
}

.detail-label {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 4px;
}

.detail-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);

  &.interest {
    color: var(--primary-dark);
  }
}

.compare-tip {
  margin-top: 14px;
  padding: 10px 12px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  font-size: 12px;
  color: #52c41a;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  line-height: 1.6;

  strong {
    color: #389e0d;
  }
}

.tip-icon {
  flex-shrink: 0;
}
</style>
