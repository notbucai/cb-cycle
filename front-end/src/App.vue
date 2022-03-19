<template>
  <n-config-provider id="root">
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
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>