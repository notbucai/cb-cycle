<template>
  <div class="PlatformList">
    <HeaderFilter @search="onSearch" @refresh="onRefresh" />
    <n-data-table
      :columns="columns"
      :data="data.list"
      :loading="loading"
      :pagination="pagination"
      :bordered="false"
      @update:page="handlePageChange"
    />
  </div>
</template>
<script lang="tsx" setup>
import HeaderFilter from './components/HeaderFilter.vue';
import { reactive, ref } from '@vue/reactivity';
import { DataTableColumns, NA, NButton, NTag, NText, useMessage } from 'naive-ui';
import { ITaskDetail, ITaskListRequest, taskList } from '../../../api/common';
import { TaskStatus, ChildTaskStatus, TaskStatusTag } from '../../../constants/status';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const message = useMessage();

const loading = ref(false);
// const filterModel = reactive({
//   pageIndex: 1,
//   pageSize: 10,
//   taskName: "",
//   createTimeRange: [],
//   status: [

//   ],
//   repository: [
//   ],
//   ids: []
// });

const createColumns = ({ }: {}): DataTableColumns<ITaskDetail> => {
  return [
    {
      title: '任务名称/ID',
      key: 'id',
      render (row) {
        return <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => {
          router.push('/manage/task/detail/' + row.id)
        }}>
          <NA>{row.taskName}</NA>
          <span style={{ fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }} onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(row?.id || '');
            message.success('复制成功');
          }}>ID</span>
        </div>
      }
    },
    {
      title: '状态',
      key: 'status',
      render (row) {
        if (row?.child?.status === ChildTaskStatus.ERROR) {
          return <NTag size="small" type={TaskStatusTag.warn.type}>{TaskStatusTag.warn.title}</NTag>
        }
        return <NTag size="small" type={TaskStatusTag[row.status || 'warn'].type}>{TaskStatusTag[row.status || 'warn'].title}</NTag>
      }
    },
    {
      title: '访问',
      key: 'externalPort',
      render (row) {
        return <div onClick={() => {
          window.open(`http://${location.host}:${row.externalPort}`)
        }}><NText type="success">{row.externalPort}</NText></div>
      }
    },
    {
      title: '托管平台',
      key: 'platformId',
      render (row) {
        return row?.platform?.platformConfig?.type
      }
    },
    {
      title: '仓库信息',
      key: 'repository',
      render (row) {
        return <div>{row?.owner} / {row?.repository} / {row?.branch}</div>
      }
    },
    {
      title: '模版',
      key: 'templateId',
      render (row) {
        return row?.template?.name
      }
    },
    {
      title: '操作',
      key: 'actions',
      render (row) {
        return row.status === TaskStatus.ING ? <NButton size="small" type="error">停止</NButton> : null
      }
    }
  ]
}
const reqData: ITaskListRequest = {
  pageIndex: 1,
  pageSize: 20,
};
const pagination = {
  pageSize: 10,
  page: 1,
  pageCount: 0
};

const columns = createColumns({ play: () => { } });

const data: { list: ITaskDetail[], total: number } = reactive({
  list: [],
  total: 0,
});

const fetchData = async () => {
  loading.value = true;
  const resData = await taskList(reqData);
  data.list = resData.results;
  data.total = resData.total;
  pagination.pageCount = resData.total;
  loading.value = false;
}
const handlePageChange = (e: any) => {
  console.log(e);
}
const onSearch = (data: any) => {
  Object.assign(reqData, data, {
    pageIndex: 1,
  });
  return fetchData();
}
const onRefresh = () => {
  console.log(2);
  fetchData();
}

// fetchData();
</script>
<style lang="scss" scoped>
</style>