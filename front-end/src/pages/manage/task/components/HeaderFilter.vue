<template>
  <TableHeader>
    <template #filter-slot>
      <div>
        <n-form
          ref="filterFormRef"
          :label-width="0"
          :rules="rules"
          size="small"
          :model="filterModel"
          inline
          label-placement="left"
        >
          <n-form-item path="ids" :show-label="false">
            <n-select
              v-model:value="filterModel.ids"
              filterable
              multiple
              tag
              placeholder="输入id"
              :options="[]"
              :show-arrow="false"
              style="width: 200px"
              max-tag-count="responsive"
              clearable
            ></n-select>
          </n-form-item>
          <n-form-item path="taskName" :show-label="false">
            <n-input v-model:value="filterModel.taskName" placeholder="输入名称" clearable></n-input>
          </n-form-item>
          <n-form-item path="repository" :show-label="false">
            <n-select
              v-model:value="filterModel.repository"
              multiple
              placeholder="选择仓库"
              style="width: 200px"
              clearable
            ></n-select>
          </n-form-item>
          <n-form-item path="status" :show-label="false">
            <n-select
              v-model:value="filterModel.status"
              multiple
              placeholder="选择状态"
              style="width: 200px"
              clearable
            ></n-select>
          </n-form-item>
          <n-form-item path="createTimeRange" :show-label="false">
            <n-date-picker
              type="datetimerange"
              clearable
              v-model:value="filterModel.createTimeRange"
              placeholder="选择时间"
            ></n-date-picker>
          </n-form-item>
        </n-form>
      </div>
    </template>
    <template #operate-slot>
      <div>
        <n-button size="small" @click="onRefresh">刷新</n-button>
      </div>
    </template>
  </TableHeader>
</template>

<script lang="ts" setup>
import { FormInst } from 'naive-ui';
import { debounce } from 'lodash'
import { onMounted, reactive, ref, watch } from 'vue';
import { ITaskListRequest } from '../../../../api/common';
import TableHeader from '../../../../components/TableHeader.vue';
import { useRoute } from 'vue-router';

const emit = defineEmits(['search', 'refresh'])

const filterFormRef = ref<FormInst | null>();
const route = useRoute();

const rules = {

}

const filterModel = reactive({
  taskName: "",
  createTimeRange: null,
  status: ([] as string[]),
  repository: ([] as string[]),
  ids: [] as string[]
});
// filterFormRef.value?.validate?.()
watch([filterModel], debounce(async () => {
  await filterFormRef.value?.validate?.();
  const filterData = {
    ...filterModel,
    createTimeRange: Array.isArray(filterModel.createTimeRange) && (filterModel.createTimeRange as []).length ? {
      start: filterModel.createTimeRange[0] as string,
      end: filterModel.createTimeRange[1] as string
    } : undefined
  }
  emit('search', filterData);
}, 100), {
  deep: true,
});

onMounted(()=>{
  filterModel.ids = ([route.query.taskId] as string[]).filter(item => item)
})

const onRefresh = () => {
  emit('refresh')
}
</script>

<style>
</style>