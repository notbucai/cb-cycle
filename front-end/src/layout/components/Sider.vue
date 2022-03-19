<template>
  <n-layout-sider
    show-trigger
    collapse-mode="width"
    bordered
    :collapsed-width="64"
    :width="220"
    :collapsed="collapsed"
    @collapse="collapsed = true"
    @expand="collapsed = false"
    :content-style="{
      height: '100%',
    }"
  >
    <n-menu
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :value="currentMenu"
      :options="menuOptions"
      :render-label="renderMenuLabel"
      :render-icon="renderMenuIcon"
    />
  </n-layout-sider>
</template>
<script lang="tsx" setup>
import { MenuOption, NIcon } from 'naive-ui';
import { computed, h, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { GitBranchOutline, HomeOutline, PodiumOutline } from '@vicons/ionicons5';

const route = useRoute();

const collapsed = ref(false);
const currentMenu = computed(() => {
  return route.path;
})

const menuOptions: MenuOption[] = [
  {
    key: '/manage/dashboard',
    label: <RouterLink to={{
      path: '/manage/dashboard',
    }} >数据看板</RouterLink>,
    icon: () => <NIcon><HomeOutline /></NIcon>,
  },
  {
    key: 'task',
    label: "任务管理",
    icon: () => <NIcon><PodiumOutline /></NIcon>,
    children: [
      {
        key: '/manage/task/list',
        label: <RouterLink to={{
          path: '/manage/task/list',
        }} >任务列表</RouterLink>,
      },
      {
        key: '/manage/task/create',
        label: <RouterLink to={{
          path: '/manage/task/create',
        }} >新建任务</RouterLink>,
      }
    ]
  },
  {
    key: '/manage/platform/list',
    label: <RouterLink to={{
      path: '/manage/platform/list',
    }} >托管平台</RouterLink>,
    icon: () => <NIcon><GitBranchOutline /></NIcon>,
  },
];

const renderMenuLabel = (option: MenuOption) => {
  if ('href' in option) {
    return h(
      'a',
      { href: option.href, target: '_blank' },
      option.label as string
    )
  }
  return option.label;
};

const renderMenuIcon = (option: MenuOption) => {
  if (typeof option.icon === 'function') return option.icon?.();
  return null; //h(NIcon, null, { default: () => h(BookmarkOutline) })
};

</script>
<style lang="scss" scoped>
</style>