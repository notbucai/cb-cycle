<template>
  <div class="TaskDetailPage">
    <n-h2>任务详情</n-h2>
    <div class="info-card">
      <div class="header-title">
        <div class="dfc gap1">
          <n-h4 class="title4">任务信息</n-h4>
          <n-tag type="info" size="small">运行中</n-tag>
          <n-text depth="3">暂不支持修改</n-text>
        </div>
        <n-space>
          <n-button size="small" secondary>预览</n-button>
          <n-button type="error" size="small" secondary>停止</n-button>
          <n-button type="error" size="small" secondary>删除</n-button>
        </n-space>
      </div>
      <div class="info-content">
        <div class="dfc gap3">
          <n-text depth="3">任务ID： 5R7ADFH234HU3450I</n-text>
          <n-text depth="3">任务名称： xxxx</n-text>
          <n-text depth="3">托管平台： GitHub</n-text>
          <n-text depth="3">项目模版： Vue</n-text>
        </div>
        <div class="dfc gap3">
          <n-text depth="3">GIT账户： notbucai</n-text>
          <n-text depth="3">仓库： test_rexxx</n-text>
          <n-text depth="3">分支： master</n-text>
          <n-text depth="3">脚本命令： dev</n-text>
          <n-text depth="3">端口： 8080</n-text>
          <n-text depth="3">编译目录： /dist</n-text>
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
          <n-text depth="3">子任务ID： UIHADF78AD67FAD78FHU23H</n-text>
          <div class="dfc">
            <n-text depth="3">子任务进度：</n-text>
            <n-progress
              style="width: 20px;"
              :show-indicator="false"
              :stroke-width="30"
              type="circle"
              :percentage="20"
            />
            <n-text depth="3">&nbsp; 5%</n-text>
          </div>
          <n-text depth="3">花费时间： 1分23秒</n-text>
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
          <n-steps :current="currentProgress" :status="'error'">
            <n-step
              :status="'process'"
              title="触发中"
              description="增加初始化数据"
            />
            <n-step
              :status="'process'"
              title="构建中"
              description="正在构建镜像，请耐心等待"
            />
            <n-step
              :status="'process'"
              title="部署中"
              description="正在部署，请耐心等待"
            />
            <n-step
              :status="'error'"
              title="已完成"
              description="当前子任务已完成，等待重新触发"
              @click="currentProgress = 3"
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
          <n-text depth="3">更新时间: 2022-05-27 22:32:11</n-text>
        </div>
      </div>
      <div class="info-content">
        <div class="log-box">
          <div class="log-header">
            <div>编译日志</div>
            <div class="dfc gap1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
            </div>
          </div>
          <div class="log-content">
            <n-log :rows="20" :log="Array(1000).fill(0).join('\n')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue';

const currentProgress = ref(1);

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