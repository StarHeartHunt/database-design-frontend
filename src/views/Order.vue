<script setup lang="ts">
import { h, onMounted, ref } from "vue";

import type { DataTableColumns } from "naive-ui";
import { NButton, NDataTable, NInput, NTimePicker, useMessage } from "naive-ui";

import DataTableAction from "@/components/DataTableAction.vue";
import { Order } from "@/types";
import { useDataFetch } from "@/utils/request";

const message = useMessage();
const order = ref<Order[]>([]);

const fetchOrder = async () => {
  const response = await useDataFetch<{ data: Order[] }>("orders").json();
  if (response.data.value) order.value = response.data.value.data;

  return order.value;
};

const createOrder = async (row: Order) => {
  pending.value = true;
  const { data: parsedData } = await useDataFetch("orders", {
    method: "POST",
    body: JSON.stringify(row),
  }).json();
  if (parsedData.value) {
    order.value = order.value.filter((item) => item.id !== -1);
    order.value.push(parsedData.value.data);
    message.success("新建成功");

    pending.value = false;
  }
};

const deleteOrder = async (id: number) => {
  if (id === -1) {
    order.value = order.value.filter((item) => item.id !== -1);
    return;
  }

  const { data: parsedData } = await useDataFetch(`orders/${id}`, {
    method: "DELETE",
  }).json();
  if (parsedData.value) {
    order.value = order.value?.filter((item) => item.id !== id);
    message.success("删除成功");
  }
};

const pending = ref(false);

const editOrder = async (order: Order) => {
  if (order.id === -1) return;

  pending.value = true;
  const response = await useDataFetch(`orders/${order.id}`, {
    method: "PATCH",
    body: JSON.stringify(order),
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

const columns: DataTableColumns<Order> = [
  {
    title: "ID",
    key: "id",
  },
  {
    title: "员工 ID",
    key: "employeeId",
    render(row, index) {
      return h(NInput, {
        value: row.employeeId.toString(),
        disabled: pending.value,
        async onUpdateValue(v) {
          order.value[index].employeeId = Number.parseInt(v);
          await editOrder(order.value[index]);
        },
      });
    },
  },
  {
    title: "创建时间",
    key: "date",
    render(row, index) {
      return h(NTimePicker, {
        value: new Date(row.date).getTime(),
        disabled: pending.value,
        async onUpdateValue(v) {
          if (v) {
            order.value[index].date = new Date(v).toISOString();
            await editOrder(order.value[index]);
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
        onPositiveClick: () => deleteOrder(row.id),
        handleCreate: row.id === -1 ? () => createOrder(row) : undefined,
      }),
  },
];

onMounted(async () => {
  await fetchOrder();
});
</script>

<template>
  <div class="flex justify-end mb-2">
    <n-button
      type="primary"
      @click="
        order.push({
          id: -1,
          employeeId: -1,
          date: null,
        })
      "
      >新增</n-button
    >
  </div>
  <n-data-table
    :columns="columns"
    :data="order"
    :pagination="false"
    :bordered="false"
  />
</template>

<style scoped></style>
