<template>
  <div class="rate-reset card">
    <div class="section-title">LPR 重定价模拟</div>
    <div class="desc">
      模拟未来5年 LPR 每年下调
      <div class="delta-control">
        <button class="delta-btn" @click="adjustDelta(-5)">−</button>
        <strong>{{ lprChangeBp }} BP</strong>
        <button class="delta-btn" @click="adjustDelta(5)">+</button>
      </div>
      后的月供变化
    </div>

    <!-- 图表：横向条形 -->
    <div class="chart">
      <div
        v-for="item in projections"
        :key="item.year"
        class="chart-row"
      >
        <div class="chart-year">第{{ item.year }}年</div>
        <div class="chart-bar-wrap">
          <div
            class="chart-bar"
            :style="{ width: barWidth(item.monthlyPayment) }"
            :class="item.change < 0 ? 'bar-decrease' : 'bar-increase'"
          ></div>
          <span class="chart-value">¥{{ fmt(item.monthlyPayment) }}</span>
        </div>
        <div class="chart-change" :class="item.change < 0 ? 'down' : 'up'">
          {{ item.change < 0 ? '▼' : '▲' }}{{ fmt(Math.abs(item.change)) }}
        </div>
      </div>
    </div>

    <!-- 当前基准 -->
    <div class="baseline">
      当前月供基准：<strong>¥{{ fmt(basePayment) }}</strong>
      （LPR {{ (store.lprValue * 100).toFixed(2) }}%
      {{ store.commercialBp >= 0 ? '+' : '' }}{{ store.commercialBp }}BP）
    </div>

    <div class="footnote">
      * LPR每年1月重定价，实际利率以央行公告为准
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLoanStore } from '../stores/loan'
import { useLPR } from '../composables/useLPR'

const store = useLoanStore()
const { simulateRateReset } = useLPR()

// lprChangeBp: 每年下调的 BP 数（整数，如 25 表示每年降 0.25%）
const lprChangeBp = ref(25)

// 转换为小数供计算使用
const lprChangePerYear = computed(() => lprChangeBp.value / 10000)

const principal = computed(() => {
  if (store.loanType === 'commercial') return store.commercialAmount
  if (store.loanType === 'provinceFund') return store.fundAmount
  return store.commercialAmount + store.fundAmount
})

const basePayment = computed(() => {
  const rate = (store.lprValue + store.commercialBp / 100) / 12
  const n = store.months
  const factor = Math.pow(1 + rate, n)
  return principal.value * rate * factor / (factor - 1)
})

const projections = computed(() => {
  return simulateRateReset(
    principal.value,
    store.lprValue,
    store.commercialBp,
    store.months,
    lprChangePerYear.value,
    5
  )
})

const maxPayment = computed(() => Math.max(basePayment.value, ...projections.value.map(p => p.monthlyPayment)))

function barWidth(payment: number): string {
  const pct = (payment / maxPayment.value) * 100
  return `${Math.max(10, pct)}%`
}

function adjustDelta(bpDelta: number) {
  lprChangeBp.value = Math.max(0, Math.min(100, lprChangeBp.value + bpDelta))
}

function fmt(val: number): string {
  return val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style scoped lang="scss">
.rate-reset {
  padding: 16px;
}

.desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 2;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;

  strong {
    color: var(--primary-color);
    font-size: 15px;
  }
}

.delta-control {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--secondary-color);
  border-radius: 8px;
  padding: 2px 6px;
}

.delta-btn {
  width: 28px;
  height: 28px;
  border: 1.5px solid var(--primary-color);
  border-radius: 6px;
  background: #fff;
  color: var(--primary-color);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
  padding: 0;
  user-select: none;

  &:active {
    background: var(--primary-color);
    color: #fff;
  }
}

.chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;
}

.chart-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-year {
  width: 44px;
  font-size: 12px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.chart-bar-wrap {
  flex: 1;
  position: relative;
  height: 28px;
  background: #f5f5f5;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.chart-bar {
  height: 100%;
  border-radius: 6px;
  transition: width 0.4s ease;

  &.bar-decrease {
    background: linear-gradient(90deg, var(--accent-color), #a8e6d8);
  }

  &.bar-increase {
    background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  }
}

.chart-value {
  position: absolute;
  left: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-change {
  width: 72px;
  font-size: 12px;
  font-weight: 600;
  text-align: right;
  flex-shrink: 0;

  &.down { color: #52c41a; }
  &.up   { color: var(--primary-color); }
}

.baseline {
  font-size: 12px;
  color: var(--text-secondary);
  padding: 10px;
  background: var(--secondary-color);
  border-radius: 8px;
  margin-bottom: 8px;

  strong {
    color: var(--text-primary);
  }
}

.footnote {
  font-size: 11px;
  color: var(--text-light);
}
</style>
