<template>
  <div class="Sider">
    <n-menu
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :render-label="renderMenuLabel"
      :render-icon="renderMenuIcon"
      :expand-icon="expandIcon"
    />
  </div>
</template>
<script lang="ts" setup>

</script>
<style lang="scss" scoped>
.Sider {
}
</style>