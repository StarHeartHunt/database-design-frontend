<script setup lang="ts">
import { h, onMounted, ref } from "vue";

import type { DataTableColumns } from "naive-ui";
import { NButton, NDataTable, NInput, useMessage } from "naive-ui";

import DataTableAction from "@/components/DataTableAction.vue";
import { ProductType } from "@/types";
import { useDataFetch } from "@/utils/request";

const message = useMessage();
const productType = ref<ProductType[]>([]);

const fetchProductType = async () => {
  const response = await useDataFetch<{ data: ProductType[] }>(
    "product-types",
  ).json();
  if (response.data.value) productType.value = response.data.value.data;

  return productType.value;
};

const createProductType = async (row: ProductType) => {
  pending.value = true;
  const { data: parsedData } = await useDataFetch("product-types", {
    method: "POST",
    body: JSON.stringify(row),
  }).json();
  if (parsedData.value) {
    productType.value = productType.value.filter((item) => item.id !== -1);
    productType.value.push(parsedData.value.data);
    message.success("新建成功");

    pending.value = false;
  }
};

const deleteProductType = async (id: number) => {
  if (id === -1) {
    productType.value = productType.value.filter((item) => item.id !== -1);
    return;
  }

  const { data: parsedData } = await useDataFetch(`product-types/${id}`, {
    method: "DELETE",
  }).json();
  if (parsedData.value) {
    productType.value = productType.value?.filter((item) => item.id !== id);
    message.success("删除成功");
  }
};

const pending = ref(false);

const editProductType = async (productType: ProductType) => {
  if (productType.id === -1) return;

  pending.value = true;
  const response = await useDataFetch(`product-types/${productType.id}`, {
    method: "PATCH",
    body: JSON.stringify(productType),
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

const columns: DataTableColumns<ProductType> = [
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
          productType.value[index].name = v;
          await editProductType(productType.value[index]);
        },
      });
    },
  },
  {
    title: "操作",
    key: "action",
    render: (row) =>
      h(DataTableAction, {
        onPositiveClick: () => deleteProductType(row.id),
        handleCreate: row.id === -1 ? () => createProductType(row) : undefined,
      }),
  },
];

onMounted(async () => {
  await fetchProductType();
});
</script>

<template>
  <div class="flex justify-end mb-2">
    <n-button
      type="primary"
      @click="
        productType.push({
          id: -1,
          name: '',
        })
      "
      >新增</n-button
    >
  </div>
  <n-data-table
    :columns="columns"
    :data="productType"
    :pagination="false"
    :bordered="false"
  />
</template>

<style scoped></style>
