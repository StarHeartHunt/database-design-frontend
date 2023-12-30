<script setup lang="ts">
import { ref } from "vue";

import {
  FormInst,
  FormRules,
  NButton,
  NCol,
  NForm,
  NFormItem,
  NInput,
  NRow,
  useMessage,
} from "naive-ui";

interface ModelType {
  username: string | null;
  password: string | null;
}
const formRef = ref<FormInst | null>(null);
const message = useMessage();
const modelRef = ref<ModelType>({
  username: null,
  password: null,
});
const rules: FormRules = {
  username: [
    {
      required: true,
      message: "请输入账号",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
    },
  ],
};
const handleLogin = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (errors) message.error("验证失败");

    fetch("http://127.0.0.1:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modelRef.value),
    })
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          throw new Error("登录失败");
        }
      })
      .then((res) => {
        message.success("登录成功");
        localStorage.setItem("jwtToken", res.data.token);
        window.location.href = "/";
      })
      .catch((error) => {
        message.error(error.message);
      });
  });
};
</script>

<template>
  <n-form ref="formRef" :model="modelRef" :rules="rules">
    <n-form-item path="account" label="账号">
      <n-input v-model:value="modelRef.username" @keydown.enter.prevent />
    </n-form-item>
    <n-form-item path="password" label="密码">
      <n-input
        v-model:value="modelRef.password"
        type="password"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
            :disabled="modelRef.username === null"
            round
            type="primary"
            @click="handleLogin"
          >
            登录
          </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>
</template>
