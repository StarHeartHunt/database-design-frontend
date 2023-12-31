<script setup lang="ts">
import { h, onMounted, ref } from "vue";

import type { DataTableColumns } from "naive-ui";
import { NButton, NDataTable, NInput, NTimePicker, useMessage } from "naive-ui";

import DataTableAction from "@/components/DataTableAction.vue";
import { StockInfo } from "@/types";
import { useDataFetch } from "@/utils/request";

const message = useMessage();
const stockInfo = ref<StockInfo[]>([]);

const fetchStockInfo = async () => {
  const response = await useDataFetch<{ data: StockInfo[] }>(
    "stock-infos",
  ).json();
  if (response.data.value) stockInfo.value = response.data.value.data;

  return stockInfo.value;
};

const createStockInfo = async (row: StockInfo) => {
  pending.value = true;
  const { data: parsedData } = await useDataFetch("stock-infos", {
    method: "POST",
    body: JSON.stringify(row),
  }).json();
  if (parsedData.value) {
    stockInfo.value = stockInfo.value.filter((item) => item.id !== -1);
    stockInfo.value.push(parsedData.value.data);
    message.success("新建成功");

    pending.value = false;
  }
};

const deleteStockInfo = async (id: number) => {
  if (id === -1) {
    stockInfo.value = stockInfo.value.filter((item) => item.id !== -1);
    return;
  }

  const { data: parsedData } = await useDataFetch(`stock-infos/${id}`, {
    method: "DELETE",
  }).json();
  if (parsedData.value) {
    stockInfo.value = stockInfo.value?.filter((item) => item.id !== id);
    message.success("删除成功");
  }
};

const pending = ref(false);

const editStockInfo = async (stockInfo: StockInfo) => {
  if (stockInfo.id === -1) return;

  pending.value = true;
  const response = await useDataFetch(`stock-infos/${stockInfo.id}`, {
    method: "PATCH",
    body: JSON.stringify(stockInfo),
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

const columns: DataTableColumns<StockInfo> = [
  {
    title: "ID",
    key: "id",
    defaultSortOrder: "ascend",
    sorter: "default",
  },
  {
    title: "产品 ID",
    key: "productId",
    render(row, index) {
      return h(NInput, {
        value: row.productId.toString(),
        disabled: pending.value,
        async onUpdateValue(v) {
          stockInfo.value[index].productId = Number.parseInt(v);
          await editStockInfo(stockInfo.value[index]);
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
          stockInfo.value[index].supplierId = Number.parseInt(v);
          await editStockInfo(stockInfo.value[index]);
        },
      });
    },
  },
  {
    title: "产品单价",
    key: "unitPrice",
    render(row, index) {
      return h(NInput, {
        value: row.unitPrice.toString(),
        disabled: pending.value,
        async onUpdateValue(v) {
          stockInfo.value[index].unitPrice = Number.parseFloat(v);
          await editStockInfo(stockInfo.value[index]);
        },
      });
    },
  },
  {
    title: "产品数量",
    key: "quantity",
    render(row, index) {
      return h(NInput, {
        value: row.quantity.toString(),
        disabled: pending.value,
        async onUpdateValue(v) {
          stockInfo.value[index].quantity = Number.parseInt(v);
          await editStockInfo(stockInfo.value[index]);
        },
      });
    },
  },
  {
    title: "付款时间",
    key: "purchaseDate",
    render(row, index) {
      return h(NTimePicker, {
        value: new Date(row.purchaseDate).getTime(),
        disabled: pending.value,
        async onUpdateValue(v) {
          if (v) {
            stockInfo.value[index].purchaseDate = new Date(v).toISOString();
            await editStockInfo(stockInfo.value[index]);
          }
        },
      });
    },
  },
  {
    title: "操作",
    key: "action",
    render: (row) =>
      h(DataTableAction, {
        onPositiveClick: () => deleteStockInfo(row.id),
        handleCreate: row.id === -1 ? () => createStockInfo(row) : undefined,
      }),
  },
];

onMounted(async () => {
  await fetchStockInfo();
});
</script>

<template>
  <div class="flex justify-end mb-2">
    <n-button
      type="primary"
      @click="
        stockInfo.push({
          id: -1,
          productId: -1,
          supplierId: -1,
          unitPrice: 0,
          quantity: 0,
          purchaseDate: null,
        })
      "
      >新增</n-button
    >
  </div>
  <n-data-table
    :columns="columns"
    :data="stockInfo"
    :pagination="false"
    :bordered="false"
  />
</template>

<style scoped></style>
