<script setup lang="ts">
import { NLayout } from "naive-ui";

import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";
</script>

<template>
  <n-layout>
    <header>
      <Header />
    </header>
    <main class="min-h-screen">
      <slot />
    </main>
    <footer><Footer /></footer>
  </n-layout>
</template>
