<template>
  <div class="app-header">
    <div class="logo-wrapper">
      <img src="/logo.svg" alt="logo" class="logo-icon" />
    </div>
    <div class="header-content">
      <h1 class="title">小算盘计算器</h1>
      <p class="subtitle">您的专属房贷计算助手</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.app-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  border-radius: 0 0 24px 24px;
  margin: -20px -20px 20px -20px;
}

.logo-wrapper {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 155, 133, 0.3);
  overflow: hidden;
}

.logo-icon {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.header-content {
  flex: 1;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  margin: 4px 0 0 0;
}
</style>
