<template>
  <div class="early-repay card">
    <div class="section-title">提前还款计算</div>

    <!-- 已还期数 -->
    <div class="field-group">
      <div class="label">已还期数（月）</div>
      <div class="input-row">
        <input
          class="num-input"
          type="number"
          :value="monthsPaid"
          @input="onMonthsPaidInput"
          :max="store.months - 1"
          min="0"
          placeholder="0"
        />
        <span class="unit">月</span>
      </div>
    </div>

    <!-- 提前还款金额 -->
    <div class="field-group">
      <div class="label">提前还款金额</div>
      <div class="input-row">
        <input
          class="num-input"
          type="number"
          :value="repayAmount / 10000"
          @input="onRepayAmountInput"
          placeholder="请输入金额"
        />
        <span class="unit">万元</span>
      </div>
    </div>

    <!-- 还款策略 -->
    <div class="field-group">
      <div class="label">还款策略</div>
      <div class="tab-buttons">
        <button
          class="tab-btn"
          :class="{ active: strategy === 'shortenTerm' }"
          @click="strategy = 'shortenTerm'"
        >
          <span>缩短年限</span>
          <small>月供不变</small>
        </button>
        <button
          class="tab-btn"
          :class="{ active: strategy === 'reducePayment' }"
          @click="strategy = 'reducePayment'"
        >
          <span>减少月供</span>
          <small>年限不变</small>
        </button>
      </div>
    </div>

    <!-- 计算结果 -->
    <div class="result-section" v-if="earlyResult && repayAmount > 0">
      <div class="result-grid">
        <div class="result-item">
          <div class="r-label">原月供</div>
          <div class="r-value">¥{{ fmt(earlyResult.originalMonthlyPayment) }}</div>
        </div>
        <div class="result-item">
          <div class="r-label">{{ strategy === 'reducePayment' ? '新月供' : '月供不变' }}</div>
          <div class="r-value highlight">¥{{ fmt(earlyResult.newMonthlyPayment) }}</div>
        </div>
        <div class="result-item" v-if="strategy === 'shortenTerm'">
          <div class="r-label">缩短期限</div>
          <div class="r-value">{{ (store.months - monthsPaid) - earlyResult.newMonths }} 个月</div>
        </div>
        <div class="result-item">
          <div class="r-label">节省利息</div>
          <div class="r-value save">¥{{ fmt(earlyResult.savedInterest) }}</div>
        </div>
      </div>
    </div>

    <div class="empty-tip" v-else>
      <span>🐱</span> 输入提前还款金额查看节省效果
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLoanStore } from '../stores/loan'
import { useEarlyRepay } from '../composables/useEarlyRepay'

const store = useLoanStore()
const { calculateEarlyRepay } = useEarlyRepay()

const monthsPaid = ref(0)
const repayAmount = ref(0)
const strategy = ref<'shortenTerm' | 'reducePayment'>('shortenTerm')

const principal = computed(() => {
  if (store.loanType === 'commercial') return store.commercialAmount
  if (store.loanType === 'provinceFund') return store.fundAmount
  return store.commercialAmount + store.fundAmount
})

const annualRate = computed(() => {
  if (store.rateType === 'lpr') {
    return store.lprValue + store.commercialBp / 10000
  }
  return store.fixedRate ?? store.lprValue
})

const earlyResult = computed(() => {
  if (repayAmount.value <= 0) return null
  return calculateEarlyRepay({
    principal: principal.value,
    annualRate: annualRate.value,
    totalMonths: store.months,
    monthsPaid: monthsPaid.value,
    repayAmount: repayAmount.value,
    strategy: strategy.value
  })
})

function onMonthsPaidInput(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value) || 0
  monthsPaid.value = Math.max(0, Math.min(store.months - 1, val))
}

function onRepayAmountInput(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value) || 0
  repayAmount.value = val * 10000
}

function fmt(val: number): string {
  return val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style scoped lang="scss">
.early-repay {
  padding: 16px;
}

.field-group {
  margin-bottom: 16px;

  &:last-child { margin-bottom: 0; }
}

.input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--secondary-color);
  border-radius: 8px;
  padding: 10px 12px;
}

.num-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  outline: none;
  min-width: 0;
}

.unit {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.tab-buttons {
  display: flex;
  gap: 8px;
}

.tab-btn {
  flex: 1;
  padding: 10px 0;
  border: 1.5px solid var(--border-color);
  border-radius: 8px;
  background: #fff;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  small {
    font-size: 11px;
    color: var(--text-light);
  }

  &.active {
    border-color: var(--primary-color);
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    color: #fff;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(255, 155, 133, 0.3);

    small { color: rgba(255,255,255,0.8); }
  }
}

.result-section {
  margin-top: 4px;
  padding: 14px;
  background: linear-gradient(135deg, #fff8f5, #fff0eb);
  border: 1px solid #ffe4dc;
  border-radius: 10px;
}

.result-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.result-item {
  .r-label {
    font-size: 12px;
    color: var(--text-light);
    margin-bottom: 4px;
  }

  .r-value {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);

    &.highlight { color: var(--primary-color); }
    &.save      { color: #52c41a; }
  }
}

.empty-tip {
  text-align: center;
  color: var(--text-light);
  font-size: 13px;
  padding: 16px 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
</style>
