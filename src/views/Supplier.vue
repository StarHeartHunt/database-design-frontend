<script setup lang="ts">
import { h, onMounted, ref } from "vue";

import type { DataTableColumns } from "naive-ui";
import { NButton, NDataTable, NInput, useMessage } from "naive-ui";

import DataTableAction from "@/components/DataTableAction.vue";
import { Supplier } from "@/types";
import { useDataFetch } from "@/utils/request";

const message = useMessage();
const supplier = ref<Supplier[]>([]);

const fetchSupplier = async () => {
  const response = await useDataFetch<{ data: Supplier[] }>("suppliers").json();
  if (response.data.value) supplier.value = response.data.value.data;

  return supplier.value;
};

const createSupplier = async (row: Supplier) => {
  pending.value = true;
  const { data: parsedData } = await useDataFetch("suppliers", {
    method: "POST",
    body: JSON.stringify(row),
  }).json();
  if (parsedData.value) {
    supplier.value = supplier.value.filter((item) => item.id !== -1);
    supplier.value.push(parsedData.value.data);
    message.success("新建成功");

    pending.value = false;
  }
};

const deleteSupplier = async (id: number) => {
  if (id === -1) {
    supplier.value = supplier.value.filter((item) => item.id !== -1);
    return;
  }

  const { data: parsedData } = await useDataFetch(`suppliers/${id}`, {
    method: "DELETE",
  }).json();
  if (parsedData.value) {
    supplier.value = supplier.value?.filter((item) => item.id !== id);
    message.success("删除成功");
  }
};

const pending = ref(false);

const editSupplier = async (supplier: Supplier) => {
  if (supplier.id === -1) return;

  pending.value = true;
  const response = await useDataFetch(`suppliers/${supplier.id}`, {
    method: "PATCH",
    body: JSON.stringify(supplier),
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

const columns: DataTableColumns<Supplier> = [
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
          supplier.value[index].name = v;
          await editSupplier(supplier.value[index]);
        },
      });
    },
  },
  {
    title: "地址",
    key: "address",
    render(row, index) {
      return h(NInput, {
        value: row.address,
        disabled: pending.value,
        async onUpdateValue(v) {
          supplier.value[index].address = v;
          await editSupplier(supplier.value[index]);
        },
      });
    },
  },
  {
    title: "联系方式",
    key: "contact",
    render(row, index) {
      return h(NInput, {
        value: row.contact,
        disabled: pending.value,
        async onUpdateValue(v) {
          supplier.value[index].contact = v;
          await editSupplier(supplier.value[index]);
        },
      });
    },
  },
  {
    title: "操作",
    key: "action",
    render: (row) =>
      h(DataTableAction, {
        onPositiveClick: () => deleteSupplier(row.id),
        handleCreate: row.id === -1 ? () => createSupplier(row) : undefined,
      }),
  },
];

onMounted(async () => {
  await fetchSupplier();
});
</script>

<template>
  <div class="flex justify-end mb-2">
    <n-button
      type="primary"
      @click="
        supplier.push({
          id: -1,
          name: '',
          address: '',
          contact: '',
        })
      "
      >新增</n-button
    >
  </div>
  <n-data-table
    :columns="columns"
    :data="supplier"
    :pagination="false"
    :bordered="false"
  />
</template>

<style scoped></style>
