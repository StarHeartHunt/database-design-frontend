<script setup lang="ts">
import type { Component } from "vue";
import { computed, h, ref } from "vue";

import { BookOutline as BookIcon } from "@vicons/ionicons5";
import { NIcon, NLayoutSider, NMenu } from "naive-ui";
import { RouterLink, useRoute } from "vue-router";

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

function renderLabel(path: string, label: string) {
  return () =>
    h(
      RouterLink,
      {
        to: path,
      },
      { default: () => label },
    );
}

const menuOptions = [
  {
    label: renderLabel("/employee", "员工管理"),
    key: "employee",
    icon: renderIcon(BookIcon),
  },
  {
    label: renderLabel("/position", "职位管理"),
    key: "position",
    icon: renderIcon(BookIcon),
  },
  {
    label: renderLabel("/product", "商品管理"),
    key: "product",
    icon: renderIcon(BookIcon),
  },
  {
    label: renderLabel("/product-type", "商品类型管理"),
    key: "product-type",
    icon: renderIcon(BookIcon),
  },
  {
    label: renderLabel("/supplier", "供货商管理"),
    key: "supplier",
    icon: renderIcon(BookIcon),
  },
  {
    label: renderLabel("/stock-info", "进货信息管理"),
    key: "stock-info",
    icon: renderIcon(BookIcon),
  },
  {
    label: renderLabel("/inventory", "库存列表"),
    key: "inventory",
    icon: renderIcon(BookIcon),
  },
  {
    label: renderLabel("/order", "订单列表"),
    key: "order",
    icon: renderIcon(BookIcon),
  },
];
const route = useRoute();
const currentRouteName = computed(() => route.meta.sidebarKey);
const selectedKey = ref<string>(currentRouteName.value || "");
</script>

<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    show-trigger="arrow-circle"
    :width="240"
    :collapsed-width="64"
    :native-scrollbar="false"
  >
    <n-menu
      v-model:value="selectedKey"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
    />
  </n-layout-sider>
</template>
