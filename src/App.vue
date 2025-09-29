<script setup>
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <NavBar />
    <div class="flex-1 w-full mx-auto max-w-6xl px-4 py-8">
      <RouterView />
    </div>
    <FooterBar />
  </div>
</template>

<style scoped></style>
