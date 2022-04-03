<template>
  <div class="table-header">
    <div class="table-header-left">
      <slot name="filter-slot" />
    </div>
    <div class="table-header-right">
      <slot name="operate-slot" />
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.table-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  &-left,
  &-right {
    display: flex;
    align-items: center;
  }
  &-left {
    flex: 1;
  }
  &-right {
    box-sizing: border-box;
  }
}
</style>