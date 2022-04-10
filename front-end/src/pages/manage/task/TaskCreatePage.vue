<template>
  <div class="PlatformCreate">
    <n-h2>新建任务</n-h2>
    <div>
      <n-steps :current="(stepCurrent)" :status="stepCurrentStatus">
        <n-step title="选择托管页面" description="没有关联的点击会跳转到关联页面" />
        <n-step title="任务信息" description="填写相关信息" />
        <!-- <n-step title="确认任务" description="确认任务的相关信息" /> -->
      </n-steps>
      <!-- step 1 -->
      <div class="create-content">
        <div v-if="stepCurrent === 1">
          <!-- platformList -->
          <div
            v-for="item in platformList"
            :key="item.id"
            class="platform-card"
            @click="handleSelectPlatform(item)"
          >
            <img :src="item.icon" v-if="item.icon" />
            <span>{{ item.type }}</span>
          </div>
        </div>
        <!-- 信息 -->
        <div v-if="stepCurrent === 2" class="task-create-form">
          <n-form ref="formRef" :model="createModel" :rules="createRules">
            <n-form-item path="taskName" label="任务名称">
              <n-input v-model:value="createModel.taskName" />
            </n-form-item>
            <n-form-item path="repository" label="代码仓库">
              <n-select
                v-model:value="createModel.repository"
                placeholder="输入关键词进行搜索"
                remote
                filterable
                @search="handleSearch"
                :loading="reposLoading"
                :options="repos"
              />
            </n-form-item>
            <n-form-item path="branch" label="代码分支" v-if="createModel.repository">
              <n-select v-model:value="createModel.branch" filterable :options="branches" />
            </n-form-item>
            <n-form-item path="templateId" label="模版">
              <n-select v-model:value="createModel.templateId" :options="templateList" />
            </n-form-item>
            <n-form-item path="routerMode" label="路由模式" v-if="scriptField.type === 'web'">
              <n-select
                v-model:value="createModel.routerMode"
                :options="[{ label: 'History', value: 'history' }, { label: 'Hash', value: 'hash' }]"
              />
            </n-form-item>
            <n-form-item path="buildScript" label="编译脚本" v-if="scriptField.build">
              <n-select v-model:value="createModel.buildScript" :options="scriptList" />
            </n-form-item>

            <n-form-item path="runScript" label="运行脚本" v-if="scriptField.run">
              <n-select v-model:value="createModel.runScript" :options="scriptList" />
            </n-form-item>
            <n-form-item path="buildPath" label="编译后路径" v-if="scriptField.build && !scriptField.run">
              <n-input v-model:value="createModel.buildPath" />
            </n-form-item>
            <n-form-item path="serverPort" label="项目端口" v-if="scriptField.run">
              <n-input type="number" v-model:value="createModel.serverPort" />
            </n-form-item>
            <n-form-item path="domain" label="域名">
              <n-input v-model:value="createModel.domain" />
            </n-form-item>

            <n-space>
              <n-button type="primary" @click="handlePreSubmit" :disabled="submitLoading">提交</n-button>
              <n-button :disabled="submitLoading">重置</n-button>
              <n-button @click="stepCurrent--" :disabled="submitLoading">上一步</n-button>
            </n-space>
          </n-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="tsx" setup>
import { debounce } from 'lodash';
import { FormInst, SelectOption, StepsProps } from 'naive-ui';
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import * as api from '../../../api/common';

const router = useRouter()

const stepCurrent = ref(1);
const stepCurrentStatus = ref<StepsProps['status']>('process');
const platformList = ref<api.IPlatformConfigDetail[]>([]);
const templateList = ref<SelectOption[]>([]);
const repos = ref<SelectOption[]>([])
const branches = ref<SelectOption[]>([]);
const reposLoading = ref<boolean>(false);
const formRef = ref<FormInst | null>(null);
const scriptList = ref<SelectOption[]>([]);

const submitLoading = ref(false);
const packageInfo = ref<api.IRepositoryProjectInfo>();
const scriptField = ref({
  run: false,
  build: false,
  type: 'null'
});

const createModel = reactive<api.ITaskDetail>({});

const createRules = {
  taskName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入'
  },
  repository: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择'
  },
  branch: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择'
  },
  templateId: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择'
  },
  routerMode: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择'
  },
  buildScript: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择'
  },
  runScript: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择'
  },
  buildPath: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入',
    validator: (rule: any, value: string) => /^\/(?:[^/]+\/?)*$/.test(value),
  },
  serverPort: {
    required: true,
    type: 'number',
    trigger: ['blur', 'input'],
    message: '请输入',
    validator: (rule: any, value: number) => Number(value) < 65535 || Number(value) > 80,
  },
  domain: {
    required: false,
    trigger: ['blur', 'input'],
    message: '请输入',
    validator: (rule: any, value: string) => {
      if (!value?.trim().length) return true;
      return /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/i.test(value);
    },
  }
};

const fetchPlatformList = async () => {
  const res = await api.platformList();
  platformList.value = res.results;
}
const fetchTemplateList = async () => {
  const res = await api.templateList();
  templateList.value = res.results?.map(item => {
    return {
      label: item.name,
      value: item.id,
      other: item
    }
  });
}

fetchPlatformList();
fetchTemplateList();

const handleSelectPlatform = (item: api.IPlatformConfigDetail) => {
  if (!item.platform?.id) {
    // todo 跳转到oauth
    window.location.replace('https://github.com/login/oauth/authorize?client_id=d056225fbd3ec500c97d&redirect_uri=https://cycle.bucai.cc/oauth2/bind/github&scope=read:packages%20admin:repo_hook%20admin:org_hook%20repo%20workflow&state=23123123')
    return;
  }
  createModel.platformId = item.platform?.id;
  console.log('createModel', createModel);
  stepCurrent.value = 2;
}
const handlePreSubmit = async () => {
  await formRef.value?.validate();
  submitLoading.value = true;
  const resTask = await api.taskCreate(createModel).finally(() => {
    submitLoading.value = false;
  });
  stepCurrent.value = 3;
  router.push('/manage/task/list?taskId=' + resTask?.model?.id);
}
const handleSearch = debounce((query: string) => {
  if (!query.length) {
    return
  }
  repos.value = [];
  getRepos(query);
}, 300);

const getRepos = async (k: string) => {
  reposLoading.value = true;
  const currentP = platformList.value.find(item => item.platform?.id === createModel.platformId);

  const resData = await api.repositoryList({
    keywords: k,
    platform: currentP?.type || '',
  });
  reposLoading.value = false;
  repos.value = (resData.results || []).map(item => ({ label: item.full_name || '', value: item.name || '', other: item }));
}

const getBranches = debounce(async (owner: string) => {
  // Object.assign(createModel, { branch: undefined });
  createModel.branch = '';
  const currentP = platformList.value.find(item => item.platform?.id === createModel.platformId);
  const resData = await api.repositoryBranches({
    owner,
    platform: currentP?.type || '',
    repository: createModel.repository || ''
  });
  branches.value = resData.results.map(item => ({ label: item.name || '', value: item.name || '', other: item }));
}, 100);

const getPackageInfo = debounce(async (owner: string, branch: string) => {
  const currentP = platformList.value.find(item => item.platform?.id === createModel.platformId);
  const resData = await api.repositoryProjectInfo({
    owner,
    branch,
    platform: currentP?.type || '',
    repository: createModel.repository || ''
  });
  packageInfo.value = resData;
  scriptList.value = Object.keys(resData.scripts).map(item => ({
    label: item,
    value: item,
  }));
}, 100);


watch(() => createModel.repository, (n, o) => {
  if (n && o !== n) {
    const r = repos.value?.find(item => item.value === n);
    const owner = (r?.other as api.IRepositoryItem).owner?.login;
    createModel.owner = owner;
    getBranches(owner || '');
  }
})
watch(() => createModel.branch, (n, o) => {
  if (n && o !== n) {
    const r = repos.value?.find(item => item.value === createModel.repository);
    const owner = (r?.other as api.IRepositoryItem).owner?.login;
    getPackageInfo(owner || '', n);
  }
})

watch(() => createModel.templateId, (n, o) => {
  if (n && o !== n) {
    const item = templateList.value?.find(item => (item?.other as any)?.id === n);
    console.log('item?.other', item?.other);

    scriptField.value = {
      run: (item?.other as api.ITemplate).isRun === 1,
      build: (item?.other as api.ITemplate).isBuild === 1,
      type: (item?.other as api.ITemplate).type
    }
  }
})


</script>
<style lang="scss" scoped>
.PlatformCreate {
  width: 980px;
  margin: 0 auto;
  .create-content {
    padding: 36px;
  }
  .task-create-form {
    width: 680px;
    margin: 0 auto;
  }
  .platform-card {
    width: 120px;
    height: 120px;
    background-color: #f4f5f6;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    img {
      width: 60%;
    }
    span {
      text-transform: Uppercase;
      margin-top: 6px;
    }
  }
}
</style>