import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "/employee",
        name: "Employee",
        meta: { sidebarKey: "employee" },
        component: () => import("@/views/Employee.vue"),
      },
      {
        path: "/position",
        name: "Position",
        meta: { sidebarKey: "position" },
        component: () => import("@/views/Position.vue"),
      },
      {
        path: "/product",
        name: "Product",
        meta: { sidebarKey: "product" },
        component: () => import("@/views/Product.vue"),
      },
      {
        path: "/supplier",
        name: "Supplier",
        meta: { sidebarKey: "supplier" },
        component: () => import("@/views/Supplier.vue"),
      },
      {
        path: "/stock-info",
        name: "StockInfo",
        meta: { sidebarKey: "stock-info" },
        component: () => import("@/views/StockInfo.vue"),
      },
      {
        path: "/order",
        name: "Order",
        meta: { sidebarKey: "order" },
        component: () => import("@/views/Order.vue"),
      },
      {
        path: "/product-type",
        name: "ProductType",
        meta: { sidebarKey: "product-type" },
        component: () => import("@/views/ProductType.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to) => {
  const isAuthenticated = window.localStorage.getItem("jwtToken");
  if (!isAuthenticated && to.name !== "Login") {
    return { name: "Login" };
  }
});

export default router;
