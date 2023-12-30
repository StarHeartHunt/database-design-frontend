<script setup lang="ts">
import { NLayout } from "naive-ui";

import Sidebar from "./Sidebar.vue";
</script>

<template>
  <n-layout has-sider>
    <Sidebar />
    <n-layout :native-scrollbar="false">
      <div class="p-2">
        <router-view></router-view>
      </div>
    </n-layout>
  </n-layout>
</template>

<style scoped></style>
