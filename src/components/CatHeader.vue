<template>
  <div class="cat-header">
    <div class="cat-avatar">
      <span class="cat-icon">🐱</span>
    </div>
    <div class="header-content">
      <h1 class="title">房贷月供精算喵</h1>
      <p class="subtitle">您的专属房贷计算助手</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.cat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  border-radius: 0 0 24px 24px;
  margin: -20px -20px 20px -20px;
}

.cat-avatar {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 155, 133, 0.3);
}

.cat-icon {
  font-size: 32px;
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
