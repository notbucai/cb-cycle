<template>
  <n-layout-header bordered class="layout-header">
    <div class="cb-logo">
      <img src="../../assets/logo.png" alt="logo" />
      <span>CB Cycle</span>
    </div>
    <div></div>
    <div>
      <n-dropdown
        trigger="hover"
        :options="avatarDropdownOptions"
        @select="handleSelectAvatarDropdown"
        show-arrow
      >
        <n-avatar
          round
          size="small"
          src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
        />
      </n-dropdown>
    </div>
  </n-layout-header>
</template>
<script lang="ts" setup>
import { useStore } from 'vuex';
import { DropdownOption } from 'naive-ui';
import { AvatarOperateEnum } from '../../constants/layout'
const store = useStore();

const avatarDropdownOptions: DropdownOption[] = [
  {
    key: AvatarOperateEnum.QUIT,
    label: '退 出',
  }
];
const execFuncMap: Record<AvatarOperateEnum, Function> = {
  'quit': () => {
    store.commit('app/SET_TOKEN', '');
    window.location.replace('/');
  }
};
const handleSelectAvatarDropdown = (key: AvatarOperateEnum) => {
  const exec = execFuncMap[key];
  if (typeof exec === 'function') {
    exec();
  }
}
</script>
<style lang="scss" scoped>
.layout-header {
  height: 60px;
  display: grid;
  align-items: center;
  padding: 0 32px;
  grid-template-columns: calc(220px - 32px) 1fr auto;
  .cb-logo {
    display: flex;
    align-items: center;
    img {
      width: 36px;
      height: 36px;
    }
    span {
      padding: 0 12px;
      font-size: 20px;
      font-weight: bold;
    }
  }
}
</style>