<script setup lang="ts">
import { NCard, NH2, NLayout } from "naive-ui";

import LoginForm from "@/components/LoginForm.vue";
</script>

<template>
  <n-layout
    class="flex min-h-screen justify-center flex-col"
    embedded
    content-style="padding: 24px;"
  >
    <n-card class="sm:max-w-[480px] sm:w-full sm:mx-auto">
      <NH2>账号登录</NH2>
      <LoginForm />
    </n-card>
  </n-layout>
</template>

<style scoped></style>
