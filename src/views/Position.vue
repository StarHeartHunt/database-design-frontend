<script setup lang="ts">
import { h, onMounted, ref } from "vue";

import type { DataTableColumns } from "naive-ui";
import { NButton, NDataTable, NInput, useMessage } from "naive-ui";

import DataTableAction from "@/components/DataTableAction.vue";
import { Position } from "@/types";
import { useDataFetch } from "@/utils/request";

const message = useMessage();
const position = ref<Position[]>([]);

const fetchPosition = async () => {
  const response = await useDataFetch<{ data: Position[] }>("positions").json();
  if (response.data.value) position.value = response.data.value.data;

  return position.value;
};

const createPosition = async (row: Position) => {
  pending.value = true;
  const { data: parsedData } = await useDataFetch("positions", {
    method: "POST",
    body: JSON.stringify(row),
  }).json();
  if (parsedData.value) {
    position.value = position.value.filter((item) => item.id !== -1);
    position.value.push(parsedData.value.data);
    message.success("新建成功");

    pending.value = false;
  }
};

const deletePosition = async (id: number) => {
  if (id === -1) {
    position.value = position.value.filter((item) => item.id !== -1);
    return;
  }

  const { data: parsedData } = await useDataFetch(`positions/${id}`, {
    method: "DELETE",
  }).json();
  if (parsedData.value) {
    position.value = position.value?.filter((item) => item.id !== id);
    message.success("删除成功");
  }
};

const pending = ref(false);

const editPosition = async (position: Position) => {
  if (position.id === -1) return;

  pending.value = true;
  const response = await useDataFetch(`positions/${position.id}`, {
    method: "PATCH",
    body: JSON.stringify(position),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).json();
  if (response.statusCode.value == 200) {
    message.success("修改成功");
    pending.value = false;
  }
};

const columns: DataTableColumns<Position> = [
  {
    title: "ID",
    key: "id",
  },
  {
    title: "名称",
    key: "name",
    render(row, index) {
      return h(NInput, {
        value: row.name,
        disabled: pending.value,
        async onUpdateValue(v) {
          position.value[index].name = v;
          await editPosition(position.value[index]);
        },
      });
    },
  },
  {
    title: "操作",
    key: "action",
    render: (row) =>
      h(DataTableAction, {
        onPositiveClick: () => deletePosition(row.id),
        handleCreate: row.id === -1 ? () => createPosition(row) : undefined,
      }),
  },
];

onMounted(async () => {
  await fetchPosition();
});
</script>

<template>
  <div class="flex justify-end mb-2">
    <n-button
      type="primary"
      @click="
        position.push({
          id: -1,
          name: '',
        })
      "
      >新增</n-button
    >
  </div>
  <n-data-table
    :columns="columns"
    :data="position"
    :pagination="false"
    :bordered="false"
  />
</template>

<style scoped></style>
