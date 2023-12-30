<script setup lang="ts">
import { FileTrayFullOutline, TrashOutline } from "@vicons/ionicons5";
import { NButton, NIcon, useDialog } from "naive-ui";

const { onPositiveClick } = defineProps<{
  onPositiveClick: (e: MouseEvent) => unknown;
  handleCreate?: () => unknown;
}>();

const dialog = useDialog();
const handleConfirm = () => {
  dialog.warning({
    title: "警告",
    content: "确定删除此项数据吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick,
  });
};
</script>

<template>
  <div class="flex gap-2 wrap">
    <n-button v-if="handleCreate" type="primary" @click="handleCreate">
      <template #icon>
        <n-icon>
          <file-tray-full-outline />
        </n-icon>
      </template>
      保存
    </n-button>
    <n-button type="error" @click="handleConfirm">
      <template #icon>
        <n-icon>
          <trash-outline />
        </n-icon>
      </template>
      删除
    </n-button>
  </div>
</template>

<style scoped></style>
