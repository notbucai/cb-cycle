<template>
  <div class="InitPage">
    <span>正在进入系统。。。</span>
  </div>
</template>
<script lang="ts" setup>

import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore();
const router = useRouter();

if (store.state.app.token) {
  router.replace('/manage')
} else {
  router.replace('/login')
}


</script>
<style lang="scss" scoped>
.InitPage {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
}
</style>