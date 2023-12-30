<script setup lang="ts">
import { h, onMounted, ref } from "vue";

import type { DataTableColumns } from "naive-ui";
import { NButton, NDataTable, NInput, useMessage } from "naive-ui";

import DataTableAction from "@/components/DataTableAction.vue";
import { Product } from "@/types";
import { useDataFetch } from "@/utils/request";

const message = useMessage();
const product = ref<Product[]>([]);

const fetchProduct = async () => {
  const response = await useDataFetch<{ data: Product[] }>("products").json();
  if (response.data.value) product.value = response.data.value.data;

  return product.value;
};

const createProduct = async (row: Product) => {
  pending.value = true;
  const { data: parsedData } = await useDataFetch("products", {
    method: "POST",
    body: JSON.stringify(row),
  }).json();
  if (parsedData.value) {
    product.value = product.value.filter((item) => item.id !== -1);
    product.value.push(parsedData.value.data);
    message.success("新建成功");

    pending.value = false;
  }
};

const deleteProduct = async (id: number) => {
  if (id === -1) {
    product.value = product.value.filter((item) => item.id !== -1);
    return;
  }
  pending.value = true;

  const { data: parsedData } = await useDataFetch(`products/${id}`, {
    method: "DELETE",
  }).json();
  if (parsedData.value) {
    product.value = product.value?.filter((item) => item.id !== id);
    message.success("删除成功");

    pending.value = false;
  }
};

const pending = ref(false);

const editProduct = async (product: Product) => {
  if (product.id === -1) return;

  pending.value = true;

  const response = await useDataFetch(`products/${product.id}`, {
    method: "PATCH",
    body: JSON.stringify(product),
  }).json();
  if (response.statusCode.value == 200) {
    message.success("修改成功");
    pending.value = false;
  }
};

const columns: DataTableColumns<Product> = [
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
          product.value[index].name = v;
          await editProduct(product.value[index]);
        },
      });
    },
  },
  {
    title: "价格",
    key: "price",
    render(row, index) {
      return h(NInput, {
        value: row.price.toString(),
        disabled: pending.value,
        async onUpdateValue(v) {
          product.value[index].price = Number.parseFloat(v);
          await editProduct(product.value[index]);
        },
      });
    },
  },
  {
    title: "商品类型 ID",
    key: "productTypeId",
    render(row, index) {
      return h(NInput, {
        value: row.productTypeId.toString(),
        disabled: pending.value,
        async onUpdateValue(v) {
          product.value[index].productTypeId = Number.parseInt(v);
          await editProduct(product.value[index]);
        },
      });
    },
  },
  {
    title: "供货商 ID",
    key: "supplierId",
    render(row, index) {
      return h(NInput, {
        value: row.supplierId.toString(),
        disabled: pending.value,
        async onUpdateValue(v) {
          product.value[index].supplierId = Number.parseInt(v);
          await editProduct(product.value[index]);
        },
      });
    },
  },
  {
    title: "操作",
    key: "action",
    render: (row) =>
      h(DataTableAction, {
        onPositiveClick: () => deleteProduct(row.id),
        handleCreate: row.id === -1 ? () => createProduct(row) : undefined,
      }),
  },
];

onMounted(async () => {
  await fetchProduct();
});
</script>

<template>
  <div class="flex justify-end mb-2">
    <n-button
      type="primary"
      @click="
        product.push({
          id: -1,
          name: '',
          price: 0,
          productTypeId: 0,
          supplierId: 0,
        })
      "
      >新增</n-button
    >
  </div>
  <n-data-table
    :columns="columns"
    :data="product"
    :pagination="false"
    :bordered="false"
  />
</template>

<style scoped></style>
