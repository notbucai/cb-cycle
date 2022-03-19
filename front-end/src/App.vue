<template>
  <n-config-provider id="root" :theme-overrides="themeOverrides">
    <router-view />
  </n-config-provider>
</template>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
#root {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>

<script setup lang="ts">
import { GlobalThemeOverrides } from 'naive-ui'
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#398eff',
    primaryColorHover: '#398eff'
  },
}
</script>