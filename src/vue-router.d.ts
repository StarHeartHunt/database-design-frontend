import "vue-router";

export {};

declare module "vue-router" {
  interface RouteMeta {
    sidebarKey?: string;
  }
}