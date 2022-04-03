<template>
  <n-layout :style="{
    height: '100%',
  }">
    <Header />
    <n-layout :style="{
      height: 'calc(100% - 60px)',
    }" has-sider>
      <Sider />
      <n-layout :style="{
        height: '100%',
      }">
        <n-layout-content :style="{
          height: 'calc(100% - 36px)',
        }">
          <div class="view-content">
            <transition name="router">
              <router-view />
            </transition>
          </div>
        </n-layout-content>
        <n-layout-footer
          bordered
          :style="{ height: '36px', display: 'flex', alignItems: 'center', paddingLeft: '12px' }"
        >&copy; 2022 不才</n-layout-footer>
      </n-layout>
    </n-layout>
  </n-layout>
</template>
<script lane="ts" setup>
import Sider from './components/Sider.vue';
import Header from './components/Header.vue';
</script>
<style lang="scss" scoped>
.view-content {
  overflow: hidden;
  max-height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 24px;
}
.router-enter-active,
.router-leave-active {
  transition: opacity 0.5s ease;
}

.router-enter-from,
.router-leave-to {
  opacity: 0;
}
</style>