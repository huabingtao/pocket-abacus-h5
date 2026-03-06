<template>
  <div class="loan-input card">
    <div class="section-title">贷款设置</div>

    <!-- 贷款类型 -->
    <div class="field-group">
      <div class="label">贷款类型</div>
      <div class="tab-buttons">
        <button
          v-for="item in loanTypeOptions"
          :key="item.value"
          class="tab-btn"
          :class="{ active: store.loanType === item.value }"
          @click="store.setLoanType(item.value as LoanType)"
        >{{ item.label }}</button>
      </div>
    </div>

    <!-- 商业贷款金额 -->
    <div class="field-group" v-if="store.loanType !== 'provinceFund'">
      <div class="label">商业贷款金额</div>
      <div class="input-row">
        <input
          class="amount-input"
          type="number"
          :value="store.commercialAmount / 10000"
          @input="onCommercialAmountInput"
          placeholder="请输入金额"
        />
        <span class="unit">万元</span>
      </div>
      <div class="slider-wrap">
        <input
          type="range"
          class="range-slider"
          :min="5"
          :max="1000"
          :step="5"
          :value="store.commercialAmount / 10000"
          @input="onCommercialSlider"
        />
        <div class="slider-labels">
          <span>5万</span><span>1000万</span>
        </div>
      </div>
    </div>

    <!-- 公积金贷款金额 -->
    <div class="field-group" v-if="store.loanType !== 'commercial'">
      <div class="label">公积金贷款金额</div>
      <div class="input-row">
        <input
          class="amount-input"
          type="number"
          :value="store.fundAmount / 10000"
          @input="onFundAmountInput"
          placeholder="请输入金额"
        />
        <span class="unit">万元</span>
      </div>
      <div class="slider-wrap">
        <input
          type="range"
          class="range-slider"
          :min="5"
          :max="120"
          :step="5"
          :value="store.fundAmount / 10000"
          @input="onFundSlider"
        />
        <div class="slider-labels">
          <span>5万</span><span>120万</span>
        </div>
      </div>
    </div>

    <!-- 贷款期限 -->
    <div class="field-group">
      <div class="label">贷款期限</div>
      <div class="input-row">
        <input
          class="amount-input"
          type="number"
          :value="store.months / 12"
          @input="onYearsInput"
          placeholder="还款年限"
        />
        <span class="unit">年</span>
      </div>
      <div class="slider-wrap">
        <input
          type="range"
          class="range-slider"
          :min="1"
          :max="30"
          :step="1"
          :value="store.months / 12"
          @input="onYearsSlider"
        />
        <div class="slider-labels">
          <span>1年</span><span>30年</span>
        </div>
      </div>
    </div>

    <!-- 还款方式 -->
    <div class="field-group">
      <div class="label">还款方式</div>
      <div class="tab-buttons">
        <button
          class="tab-btn"
          :class="{ active: store.repayMethod === 'equalInterest' }"
          @click="store.setRepayMethod('equalInterest')"
        >等额本息</button>
        <button
          class="tab-btn"
          :class="{ active: store.repayMethod === 'equalPrincipal' }"
          @click="store.setRepayMethod('equalPrincipal')"
        >等额本金</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoanStore } from '../stores/loan'
import type { LoanType } from '../utils/constants'

const store = useLoanStore()

const loanTypeOptions = [
  { label: '商业贷款', value: 'commercial' },
  { label: '公积金', value: 'provinceFund' },
  { label: '组合贷', value: 'combined' },
]

function onCommercialAmountInput(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value) || 0
  store.setCommercialAmount(val * 10000)
}

function onCommercialSlider(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value)
  store.setCommercialAmount(val * 10000)
}

function onFundAmountInput(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value) || 0
  store.setFundAmount(val * 10000)
}

function onFundSlider(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value)
  store.setFundAmount(val * 10000)
}

function onYearsInput(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value) || 1
  store.setMonths(Math.min(30, Math.max(1, val)) * 12)
}

function onYearsSlider(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value)
  store.setMonths(val * 12)
}
</script>

<style scoped lang="scss">
.loan-input {
  padding: 16px;
}

.field-group {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.tab-buttons {
  display: flex;
  gap: 8px;
}

.tab-btn {
  flex: 1;
  padding: 8px 0;
  border: 1.5px solid var(--border-color);
  border-radius: 8px;
  background: #fff;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    border-color: var(--primary-color);
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    color: #fff;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(255, 155, 133, 0.3);
  }
}

.input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--secondary-color);
  border-radius: 8px;
  padding: 10px 12px;
}

.amount-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  outline: none;
  min-width: 0;

  &::placeholder {
    color: var(--text-light);
    font-size: 14px;
    font-weight: 400;
  }
}

.unit {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.slider-wrap {
  margin-top: 8px;
}

.range-slider {
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(to right, var(--primary-color) 0%, var(--border-color) 0%);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary-color);
    box-shadow: 0 2px 6px rgba(255, 155, 133, 0.4);
    cursor: pointer;
    transition: transform 0.2s;

    &:active {
      transform: scale(1.2);
    }
  }
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 11px;
  color: var(--text-light);
}
</style>
