<template>
  <div class="TaskDetailPage" v-if="taskData">
    <n-h2>任务详情</n-h2>
    <div class="info-card">
      <div class="header-title">
        <div class="dfc gap1">
          <n-h4 class="title4">任务信息</n-h4>
          <n-tag
            :type="TaskStatusTag[taskData.status || 'unknown'].type"
            size="small"
          >{{ TaskStatusTag[taskData.status || 'unknown'].title }}</n-tag>
          <n-text depth="3">暂不支持修改</n-text>
        </div>
        <n-space>
          <n-button size="small" secondary @click="handlePreview">预览</n-button>
          <n-popconfirm @positive-click="handleStopTask" v-if="taskData?.status === TaskStatus.ING">
            <template #trigger>
              <n-button type="error" size="small" secondary>停止</n-button>
            </template>
            <span>确认要停止吗?</span>
          </n-popconfirm>
        </n-space>
      </div>
      <div class="info-content">
        <div class="dfc gap3">
          <n-text depth="3">任务ID： {{ taskData.id }}</n-text>
          <n-text depth="3">任务名称： {{ taskData.taskName }}</n-text>
          <n-text depth="3">托管平台： {{ taskData.platform?.platformConfig?.type }}</n-text>
          <n-text depth="3">项目模版： {{ taskData.template?.type }}</n-text>
        </div>
        <div class="dfc gap3">
          <n-text depth="3">GIT账户： {{ taskData.owner }}</n-text>
          <n-text depth="3">
            仓库：
            <a
              :href="`https://github.com/${taskData.owner}/${taskData.repository}`"
              target="_blank"
              style="color: #03a9f4"
            >{{ taskData.repository }}</a>
          </n-text>
          <n-text depth="3">分支： {{ taskData.branch }}</n-text>
          <n-text depth="3" v-if="taskData.buildScript">编译命令： {{ taskData.buildScript }}</n-text>
          <n-text depth="3" v-if="taskData.runScript">运行命令： {{ taskData.runScript }}</n-text>
          <n-text depth="3" v-if="taskData.serverPort">项目端口： {{ taskData.serverPort }}</n-text>
          <n-text depth="3" v-if="taskData.buildPath">编译目录： {{ taskData.buildPath }}</n-text>
          <n-text depth="3" v-if="taskData.routerMode">路由模式： {{ taskData.routerMode }}</n-text>
          <n-text depth="3" v-if="taskData.domain">域名： {{ taskData.domain }}</n-text>
          <n-text depth="3" v-if="taskData.externalPort">外部端口： {{ taskData.externalPort }}</n-text>
        </div>
      </div>
    </div>
    <div class="info-card">
      <div class="header-title">
        <div class="dfc gap1">
          <n-h4 class="title4">子任务信息</n-h4>
        </div>
      </div>
      <div class="info-content">
        <div class="dfc gap3">
          <n-text depth="3">子任务ID：{{ taskData.activeId || '等待触发' }}</n-text>
          <div class="dfc">
            <n-text depth="3">子任务进度：</n-text>
            <n-tag size="small" depth="3" :type="childStatus.type">{{ childStatus.title }}</n-tag>
          </div>
          <n-text depth="3">花费时间：{{ takeTime }}</n-text>
        </div>
      </div>
    </div>
    <div class="info-card">
      <div class="header-title">
        <div class="dfc gap1">
          <n-h4 class="title4">子任务进度</n-h4>
        </div>
      </div>
      <div class="info-content">
        <div>
          <n-steps>
            <n-step
              :status="[ChildTaskStatus.INIT_ERROR, ChildTaskStatus.DOWNLOAD_ERROR].includes(taskData.child?.status) ? 'error' : taskData.child?.status >= 100 ? 'process' : 'wait'"
              title="触发中"
              description="增加初始化数据"
              @click="handleChangeLog(ChildTaskStatus.INIT)"
            />
            <n-step
              :status="[ChildTaskStatus.BUILD_ERROR].includes(taskData.child?.status) ? 'error' : taskData.child?.status > 100 ? 'process' : 'wait'"
              title="构建中"
              v-if="taskData.template?.isStructure"
              description="正在构建镜像，请耐心等待"
              @click="handleChangeLog(ChildTaskStatus.BUILDING)"
            />
            <n-step
              :status="[ChildTaskStatus.RUN_ERROR, ChildTaskStatus.STOP_ERROR].includes(taskData.child?.status) ? 'error' : taskData.child?.status >= 110 ? 'process' : 'wait'"
              title="运行中"
              v-if="taskData.template?.isRun"
              description="准备运行，请耐心等待"
              @click="handleChangeLog(ChildTaskStatus.RUNING)"
            />
            <n-step
              :status="[ChildTaskStatus.BIND_ERROR, ChildTaskStatus.COPY_ERROR].includes(taskData.child?.status) ? 'error' : taskData.child?.status > 110 ? 'process' : 'wait'"
              title="部署中"
              description="正在部署中，请耐心等待"
              @click="handleChangeLog(ChildTaskStatus.BINDING)"
            />
            <n-step
              :status="[ChildTaskStatus.ERROR].includes(taskData.child?.status) ? 'error' : taskData.child?.status === 200 ? 'process' : 'wait'"
              title="已完成"
              description="当前子任务已完成，等待重新触发"
              @click="handleChangeLog(ChildTaskStatus.DENO)"
            />
          </n-steps>
        </div>
      </div>
    </div>
    <div class="info-card">
      <div class="header-title">
        <div class="dfc gap1">
          <n-h4 class="title4">子任务日志</n-h4>
        </div>
        <div class="dfc gap1">
          <n-text depth="3">更新时间: {{ taskData.child?.updatedAt }}</n-text>
        </div>
      </div>
      <div class="info-content">
        <div class="log-box">
          <div class="log-header">
            <div>任务日志</div>
            <div class="dfc gap1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
            </div>
          </div>
          <div class="log-content">
            <n-log :rows="20" :log="logs[logType] || '暂无日志'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { computed, reactive, watch } from 'vue';
import { ref } from 'vue';
import dayjs from 'dayjs';
import { ITaskDetail, taskChange, taskDetail, taskLog } from '../../../api/common';
import { ChildTaskStatus, TaskStatus, TaskStatusTag, TaskChildStatusTag } from '../../../constants/status';
import { useRoute } from 'vue-router';
import { useMessage } from 'naive-ui';

const route = useRoute()
const message = useMessage()

const taskData = ref<ITaskDetail>();
const currentStatus = ref<ChildTaskStatus>(taskData.value?.child?.status || ChildTaskStatus.INIT);
const logs = reactive<Record<string, string>>({});

const logType = computed(() => {
  return {
    [ChildTaskStatus.DENO]: 'deploy',
    [ChildTaskStatus.BUILDING]: 'build',
    [ChildTaskStatus.COPYING]: 'deploy',
    [ChildTaskStatus.BINDING]: 'deploy',
    [ChildTaskStatus.DOWNLOADING]: 'init',
    [ChildTaskStatus.STOPING]: 'run',
    [ChildTaskStatus.RUNING]: 'run',
    [ChildTaskStatus.STOP]: 'init',
    [ChildTaskStatus.INIT]: 'init',
    [ChildTaskStatus.BUILD_ERROR]: 'build',
    [ChildTaskStatus.INIT_ERROR]: 'init',
    [ChildTaskStatus.DOWNLOAD_ERROR]: 'init',
    [ChildTaskStatus.RUN_ERROR]: 'run',
    [ChildTaskStatus.COPY_ERROR]: 'deploy',
    [ChildTaskStatus.STOP_ERROR]: 'run',
    [ChildTaskStatus.BIND_ERROR]: 'deploy',
  }[currentStatus.value as number] || 'init';
});

const handleChangeLog = (t: ChildTaskStatus) => {
  currentStatus.value = t;
  handleFetchLog();
}
const handleFetchLog = async () => {
  if (taskData.value?.activeId && taskData.value?.child) {
    const log = await taskLog({
      type: logType.value,
      id: taskData.value?.id as string
    });
    console.log('___.', logs, , logType.value);
    logs[logType.value] = log?.log || ''
  }
};

const childStatus = computed(() => {
  if (!taskData.value?.child?.status) {
    return {
      type: 'default',
      title: '等待触发',
    }
  }
  return TaskChildStatusTag[taskData.value?.child?.status] || {
    type: 'default',
    title: '未知状态'
  };
})


const takeTime = computed(() => {
  if (taskData.value) {
    if (!taskData.value?.child?.updatedAt) {
      return '-';
    }
    return dayjs(new Date(1640966400000 + dayjs(new Date(taskData.value?.child?.updatedAt || '')).diff(taskData.value?.child?.createdAt, 'millisecond'))).format('HH:mm:ss');
  }
  return '-'
});
const handlePreview = () => {
  window.open(`http://${location.host}:${taskData.value?.externalPort}`)
}
const handleStopTask = async () => {
  await taskChange({
    status: TaskStatus.STOP,
    id: route.params.id as string
  });
  message.success('停止成功');
  _fetch();
}
const _fetch = async () => {
  const data = await taskDetail({
    id: route.params.id as string
  });
  taskData.value = data;
  currentStatus.value = data.child?.status as ChildTaskStatus;
  handleFetchLog();
}
_fetch();


</script>

<style lang="scss">
.TaskDetailPage {
  min-width: 1224px;
  max-width: 1224px;
  margin: 0 auto;
  .info-card {
    margin-bottom: 24px;
  }
  .header-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
    .title4 {
      margin-bottom: 0;
    }
  }
  .info-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .log-box {
    background-color: #fff;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #f4f5f6;
    .log-header {
      background-color: #eee;
      // border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
    }
    .log-content {
      padding: 12px 24px;
    }
  }
  .dfc {
    display: flex;
    align-items: center;
  }
  .gap1 {
    gap: 12px;
  }
  .gap2 {
    gap: 24px;
  }
  .gap3 {
    gap: 36px;
  }
}
</style>