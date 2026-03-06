<template>
  <div class="amortization card">
    <div class="table-header" @click="toggleExpand">
      <div class="section-title" style="margin-bottom:0">
        还款明细
        <span class="row-count">共 {{ schedule.length }} 期</span>
      </div>
      <span class="expand-icon">{{ expanded ? '▲' : '▼' }}</span>
    </div>

    <div v-if="expanded" class="table-wrap">
      <!-- 表头 -->
      <div class="table-head">
        <span>期数</span>
        <span>月供</span>
        <span>本金</span>
        <span>利息</span>
        <span>剩余本金</span>
      </div>

      <!-- 只渲染可见范围（前12期 + 展开更多） -->
      <div
        v-for="row in visibleRows"
        :key="row.month"
        class="table-row"
        :class="{ 'row-highlight': row.month % 12 === 0 }"
      >
        <span class="col-month">
          {{ row.month }}
          <small v-if="row.month % 12 === 0">第{{ row.month / 12 }}年</small>
        </span>
        <span class="col-payment">{{ fmt(row.payment) }}</span>
        <span class="col-principal">{{ fmt(row.principal) }}</span>
        <span class="col-interest interest-text">{{ fmt(row.interest) }}</span>
        <span class="col-balance">{{ fmt(row.balance) }}</span>
      </div>

      <!-- 加载更多 -->
      <div v-if="schedule.length > showCount" class="load-more" @click="showCount += 24">
        加载更多 ({{ schedule.length - showCount }} 期)
      </div>
      <div v-else-if="showCount > 12" class="load-more" @click="showCount = 12">
        收起
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AmortizationRow } from '../composables/useMortgage'

const props = defineProps<{
  schedule: AmortizationRow[]
}>()

const expanded = ref(false)
const showCount = ref(12)

const visibleRows = computed(() => props.schedule.slice(0, showCount.value))

function toggleExpand() {
  expanded.value = !expanded.value
}

function fmt(val: number): string {
  return val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style scoped lang="scss">
.amortization {
  padding: 16px;
  overflow: hidden;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.row-count {
  font-size: 12px;
  color: var(--text-light);
  font-weight: 400;
  margin-left: 8px;
}

.expand-icon {
  font-size: 12px;
  color: var(--text-light);
}

.table-wrap {
  margin-top: 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 52px 1fr 1fr 1fr 1fr;
  gap: 4px;
  padding: 8px 4px;
  font-size: 12px;
  align-items: center;
}

.table-head {
  font-weight: 600;
  color: var(--text-secondary);
  border-bottom: 1.5px solid var(--border-color);
  padding-bottom: 10px;

  span {
    text-align: right;
    &:first-child { text-align: left; }
  }
}

.table-row {
  border-bottom: 1px solid #fafafa;
  color: var(--text-primary);

  span {
    text-align: right;
    &:first-child { text-align: left; }
  }

  &.row-highlight {
    background: #fff8f5;
    border-radius: 6px;
    font-weight: 600;
  }
}

.col-month {
  display: flex;
  flex-direction: column;
  gap: 2px;

  small {
    font-size: 10px;
    color: var(--primary-color);
    font-weight: 600;
  }
}

.interest-text {
  color: var(--primary-dark) !important;
}

.load-more {
  margin-top: 12px;
  text-align: center;
  font-size: 13px;
  color: var(--primary-color);
  padding: 10px;
  border: 1px dashed var(--primary-light);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:active {
    background: var(--secondary-color);
  }
}
</style>
