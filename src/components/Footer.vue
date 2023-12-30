<script setup lang="ts">
import { NLayoutFooter, NText } from "naive-ui";
</script>

<template>
  <n-layout-footer bordered class="p-4 flex justify-center">
    <n-text>
      Copyright &copy; {{ new Date().getFullYear() }} StarHeartHunt. All rights
      reserved.
    </n-text>
  </n-layout-footer>
</template>

<style scoped></style>
