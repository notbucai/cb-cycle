<template>
  <div>
    <n-layout has-sider>
      <n-layout-sider>
        <Sider />
      </n-layout-sider>
      <n-layout>
        <n-layout-header>颐和园路</n-layout-header>
        <n-layout-content>
          <router-view />
        </n-layout-content>
        <n-layout-footer>成府路</n-layout-footer>
      </n-layout>
    </n-layout>
  </div>
</template>
<script lane="ts" setup>
import Sider from './components/Sider.vue';

</script>