<template>
  <div class="rate-selector card">
    <div class="section-title">利率设置</div>

    <!-- 商业贷款利率 -->
    <div v-if="store.loanType !== 'provinceFund'">
      <div class="field-group">
        <div class="label">商业贷款利率模式</div>
        <div class="tab-buttons">
          <button
            class="tab-btn"
            :class="{ active: store.rateType === 'lpr' }"
            @click="store.setRateType('lpr')"
          >LPR 浮动</button>
          <button
            class="tab-btn"
            :class="{ active: store.rateType === 'fixed' }"
            @click="store.setRateType('fixed')"
          >固定利率</button>
        </div>
      </div>

      <!-- LPR 模式 -->
      <template v-if="store.rateType === 'lpr'">
        <div class="lpr-display">
          <div class="lpr-row">
            <span class="lpr-label">当前5年期LPR</span>
            <span class="lpr-value">{{ (store.lprValue * 100).toFixed(2) }}%</span>
            <span class="lpr-date">（2026-02-24）</span>
          </div>
        </div>

        <div class="field-group">
          <div class="label">
            加点(BP)
            <span class="bp-hint">1BP = 0.01%，负数表示减点</span>
          </div>
          <div class="bp-row">
            <button class="bp-btn" @click="adjustBp(-5)">-5</button>
            <div class="bp-input-wrap">
              <input
                class="bp-input"
                type="number"
                :value="store.commercialBp"
                @input="onBpInput"
              />
              <span class="bp-unit">BP</span>
            </div>
            <button class="bp-btn" @click="adjustBp(5)">+5</button>
          </div>
          <input
            type="range"
            class="bp-slider"
            :min="-100"
            :max="100"
            :step="5"
            :value="store.commercialBp"
            :style="{ background: sliderBackground }"
            @input="onBpSlider"
          />
          <div class="bp-slider-labels">
            <span>-100BP</span><span>0</span><span>+100BP</span>
          </div>
          <div class="effective-rate">
            实际执行利率：<strong>{{ effectiveRateText }}</strong>
          </div>
        </div>

        <div class="field-group">
          <div class="label">重定价日</div>
          <div class="tab-buttons">
            <button
              class="tab-btn"
              :class="{ active: store.resetMonth === 1 }"
              @click="store.setResetMonth(1)"
            >每年1月1日</button>
            <button
              class="tab-btn"
              :class="{ active: store.resetMonth === 0 }"
              @click="store.setResetMonth(0)"
            >贷款发放日</button>
          </div>
        </div>
      </template>

      <!-- 固定利率模式 -->
      <template v-else>
        <div class="field-group">
          <div class="label">固定年利率</div>
          <div class="input-row">
            <input
              class="rate-input"
              type="number"
              step="0.01"
              :value="(store.fixedRate * 100).toFixed(2)"
              @input="onFixedRateInput"
            />
            <span class="unit">%</span>
          </div>
        </div>
      </template>
    </div>

    <!-- 公积金利率 -->
    <div v-if="store.loanType !== 'commercial'" class="fund-rate-section">
      <div class="divider" v-if="store.loanType === 'combined'"></div>
      <div class="field-group">
        <div class="label">公积金贷款利率</div>
        <div class="input-row">
          <input
            class="rate-input"
            type="number"
            step="0.01"
            :value="(store.fundRate * 100).toFixed(2)"
            @input="onFundRateInput"
          />
          <span class="unit">%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLoanStore } from '../stores/loan'

const store = useLoanStore()

const effectiveRateText = computed(() => {
  const rate = store.lprValue + store.commercialBp / 10000
  return `${(rate * 100).toFixed(2)}%`
})

const sliderBackground = computed(() => {
  const bp = store.commercialBp
  const percent = ((bp + 100) / 200) * 100
  return `linear-gradient(to right, var(--primary-color) ${percent}%, var(--border-color) ${percent}%)`
})

function adjustBp(delta: number) {
  store.setCommercialBp(store.commercialBp + delta)
}

function onBpInput(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value) || 0
  store.setCommercialBp(val)
}

function onBpSlider(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value) || 0
  store.setCommercialBp(val)
}

function onFixedRateInput(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value) || 0
  store.setFixedRate(val / 100)
}

function onFundRateInput(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value) || 0
  store.setFundRate(val / 100)
}
</script>

<style scoped lang="scss">
.rate-selector {
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

.lpr-display {
  background: linear-gradient(135deg, #fff8f5, #fff0eb);
  border: 1px solid #ffd4c8;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 14px;
}

.lpr-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lpr-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.lpr-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
}

.lpr-date {
  font-size: 11px;
  color: var(--text-light);
}

.bp-hint {
  font-size: 11px;
  color: var(--text-light);
  margin-left: 6px;
}

.bp-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.bp-btn {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border: 1.5px solid var(--primary-color);
  border-radius: 8px;
  background: #fff;
  color: var(--primary-color);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    background: var(--primary-color);
    color: #fff;
  }
}

.bp-input-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--secondary-color);
  border-radius: 8px;
  padding: 8px 10px;
  overflow: hidden;
}

.bp-input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  outline: none;
  text-align: center;
  width: 0; /* 强制 flex 控制宽度 */
}

.bp-unit {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
}

.bp-slider {
  width: 100%;
  margin-top: 10px;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: var(--border-color);
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
  }
}

.bp-slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 11px;
  color: var(--text-light);
}

.effective-rate {
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-secondary);

  strong {
    color: var(--primary-color);
    font-size: 15px;
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

.rate-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  outline: none;
}

.unit {
  font-size: 13px;
  color: var(--text-secondary);
}

.divider {
  height: 1px;
  background: var(--border-color);
  margin: 4px 0 16px;
}

.fund-rate-section {
  margin-top: 4px;
}
</style>
