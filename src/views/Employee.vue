<script setup lang="ts">
import { h, onMounted, ref } from "vue";

import type { DataTableColumns } from "naive-ui";
import { NButton, NDataTable, NInput, NTimePicker, useMessage } from "naive-ui";

import DataTableAction from "@/components/DataTableAction.vue";
import { Employee, Gender } from "@/types";
import { useDataFetch } from "@/utils/request";

const message = useMessage();
const employee = ref<Employee[]>([]);

const fetchEmployee = async () => {
  const response = await useDataFetch<{ data: Employee[] }>("employees").json();
  if (response.data.value) employee.value = response.data.value.data;

  return employee.value;
};

const createEmployee = async (row: Employee) => {
  pending.value = true;
  const { data: parsedData } = await useDataFetch("employees", {
    method: "POST",
    body: JSON.stringify(row),
  }).json();
  if (parsedData.value) {
    employee.value = employee.value.filter((item) => item.id !== -1);
    employee.value.push(parsedData.value.data);
    message.success("新建成功");

    pending.value = false;
  }
};

const deleteEmployee = async (id: number) => {
  if (id === -1) {
    employee.value = employee.value.filter((item) => item.id !== -1);
    return;
  }

  const { data: parsedData } = await useDataFetch(`employees/${id}`, {
    method: "DELETE",
  }).json();
  if (parsedData.value) {
    employee.value = employee.value?.filter((item) => item.id !== id);
    message.success("删除成功");
  }
};

const pending = ref(false);

const editEmployee = async (employee: Employee) => {
  if (employee.id === -1) return;

  pending.value = true;
  const response = await useDataFetch(`employees/${employee.id}`, {
    method: "PATCH",
    body: JSON.stringify(employee),
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

const columns: DataTableColumns<Employee> = [
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
          employee.value[index].name = v;
          await editEmployee(employee.value[index]);
        },
      });
    },
  },
  {
    title: "性别",
    key: "gender",
    render(row, index) {
      return h(NInput, {
        value: row.gender.toString(),
        disabled: pending.value,
        async onUpdateValue(v) {
          employee.value[index].gender = Number.parseInt(v);
          await editEmployee(employee.value[index]);
        },
      });
    },
  },
  {
    title: "生日",
    key: "birthday",
    render(row, index) {
      return h(NTimePicker, {
        value: new Date(row.birthday).getTime(),
        disabled: pending.value,
        async onUpdateValue(v) {
          if (v) {
            employee.value[index].birthday = new Date(v).toISOString();
            await editEmployee(employee.value[index]);
          }
        },
      });
    },
  },
  {
    title: "雇佣时间",
    key: "hiredAt",
    render(row, index) {
      return h(NTimePicker, {
        value: new Date(row.hiredAt).getTime(),
        disabled: pending.value,
        async onUpdateValue(v) {
          if (v) {
            employee.value[index].hiredAt = new Date(v).toISOString();
            await editEmployee(employee.value[index]);
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
        onPositiveClick: () => deleteEmployee(row.id),
        handleCreate: row.id === -1 ? () => createEmployee(row) : undefined,
      }),
  },
];

onMounted(async () => {
  await fetchEmployee();
});
</script>

<template>
  <div class="flex justify-end mb-2">
    <n-button
      type="primary"
      @click="
        employee.push({
          id: -1,
          name: '',
          gender: Gender.MALE,
          birthday: null,
          hiredAt: null,
          positionId: 1,
        })
      "
      >新增</n-button
    >
  </div>
  <n-data-table
    :columns="columns"
    :data="employee"
    :pagination="false"
    :bordered="false"
  />
</template>

<style scoped></style>
