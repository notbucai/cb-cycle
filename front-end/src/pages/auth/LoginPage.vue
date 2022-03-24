<template>
  <div class="LoginPage">
    <n-h2>
      <n-text type="primary"> 自动化部署平台 </n-text>
    </n-h2>
    <n-h4>
      <n-text type="primary"> 登录或注册 </n-text>
    </n-h4>
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="email" label="邮箱">
        <n-input v-model:value="model.email" placeholder="请输入邮箱" />
      </n-form-item>
      <n-form-item path="code" label="验证码">
        <n-input-group>
          <n-input
            v-model:value="model.code"
            placeholder="请输入验证码"
            :maxlength="6"
          />
          <n-button
            type="primary"
            @click="handleGetCode"
            :disabled="codeButtonDisabled"
            >{{ codeButtonDisabled ? codeDownCount : '获取验证码' }}</n-button
          >
        </n-input-group>
      </n-form-item>
      <n-space>
        <n-button type="primary" @click="handleSubmit" :disabled="submitLoading"
          >登 录</n-button
        >
      </n-space>
    </n-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "@vue/reactivity";
import { FormRules, FormInst, useMessage } from "naive-ui";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import * as http from '../../api/common';

const formRef = ref<FormInst | null>();
const router = useRouter();
const store = useStore();
const codeButtonDisabled = ref(false);
const codeDownCount = ref(60);
const submitLoading = ref(false);

const model = reactive({
  code: '',
  email: ''
});
const rules = reactive<FormRules>({
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur',
    type: 'email',
  },
  code: {
    required: true,
    message: '请输入验证码',
    trigger: 'blur'
  },
});

const message = useMessage();

const handleGetCode = async () => {
  await formRef.value?.validate(() => { }, rule => rule.key === 'email')
  codeButtonDisabled.value = true;
  codeDownCount.value = 60;
  try {
    await http.commonCode({
      email: model.email
    });
    codeDownCount.value = 60;
    const timer = setInterval(() => {
      codeDownCount.value--;
      if (codeDownCount.value === 0) {
        codeButtonDisabled.value = false;
        clearInterval(timer);
      }
    }, 980);
  } catch (error: any) {
    codeButtonDisabled.value = false;
    console.log(error);
    message.error(error?.message);
  }
}
const handleSubmit = async () => {
  await formRef.value?.validate();
  submitLoading.value = true;
  try {
    const { token } = await http.login({
      email: model.email,
      code: model.code
    });
    store.commit('app/SET_TOKEN', token);
    router.replace('/manage')
  } catch (error: any) {
    console.log(error);
    message.error(error?.message);
  }
  submitLoading.value = false;
}

</script>
<style lang="scss" scoped>
.LoginPage {
  width: 360px;
  margin: 10% auto;
  padding: 24px;
  border-radius: 6px;
  box-shadow: 0 0 10px 10px rgba($color: #888, $alpha: 0.2);
}
</style>