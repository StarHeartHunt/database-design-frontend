<script setup lang="ts">
import { h, onMounted, ref } from "vue";

import type { DataTableColumns } from "naive-ui";
import { NButton, NDataTable, NInput, useMessage } from "naive-ui";

import DataTableAction from "@/components/DataTableAction.vue";
import { Inventory } from "@/types";
import { useDataFetch } from "@/utils/request";

const message = useMessage();
const inventory = ref<Inventory[]>([]);

const fetchInventory = async () => {
  const response = await useDataFetch<{ data: Inventory[] }>(
    "inventory",
  ).json();
  if (response.data.value) inventory.value = response.data.value.data;

  return inventory.value;
};

const createInventory = async (row: Inventory) => {
  pending.value = true;
  const { data: parsedData } = await useDataFetch("inventory", {
    method: "POST",
    body: JSON.stringify(row),
  }).json();
  if (parsedData.value) {
    inventory.value = inventory.value.filter((item) => item.id !== -1);
    inventory.value.push(parsedData.value.data);
    message.success("新建成功");

    pending.value = false;
  }
};

const deleteInventory = async (id: number) => {
  if (id === -1) {
    inventory.value = inventory.value.filter((item) => item.id !== -1);
    return;
  }

  const { data: parsedData } = await useDataFetch(`inventory/${id}`, {
    method: "DELETE",
  }).json();
  if (parsedData.value) {
    inventory.value = inventory.value?.filter((item) => item.id !== id);
    message.success("删除成功");
  }
};

const pending = ref(false);

const editInventory = async (inventory: Inventory) => {
  if (inventory.id === -1) return;

  pending.value = true;
  const response = await useDataFetch(`inventory/${inventory.id}`, {
    method: "PATCH",
    body: JSON.stringify(inventory),
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

const columns: DataTableColumns<Inventory> = [
  {
    title: "ID",
    key: "id",
    defaultSortOrder: "ascend",
    sorter: "default",
  },
  {
    title: "名称",
    key: "name",
    render(row, index) {
      return h(NInput, {
        value: row.name,
        disabled: pending.value,
        async onUpdateValue(v) {
          inventory.value[index].name = v;
          await editInventory(inventory.value[index]);
        },
      });
    },
  },
  {
    title: "操作",
    key: "action",
    render: (row) =>
      h(DataTableAction, {
        onPositiveClick: () => deleteInventory(row.id),
        handleCreate: row.id === -1 ? () => createInventory(row) : undefined,
      }),
  },
];

onMounted(async () => {
  await fetchInventory();
});
</script>

<template>
  <div class="flex justify-end mb-2">
    <n-button
      type="primary"
      @click="
        inventory.push({
          id: -1,
          name: '',
        })
      "
      >新增</n-button
    >
  </div>
  <n-data-table
    :columns="columns"
    :data="inventory"
    :pagination="false"
    :bordered="false"
  />
</template>

<style scoped></style>
