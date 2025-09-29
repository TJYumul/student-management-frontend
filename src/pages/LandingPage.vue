<script setup>
</script>

<template>
  <div class="relative -mx-4 -mt-8 mb-10">
    <div class="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-blue-50 pointer-events-none" />
    <section class="relative max-w-3xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-8">
      <div class="space-y-5">
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 font-sans">Student Management System</h1>
        <p class="text-slate-600 text-lg max-w-2xl mx-auto">Easily manage student records in one place.</p>
      </div>
      <RouterLink to="/students" class="btn text-base px-6 py-3">Go to Student Records</RouterLink>
    </section>
  </div>
</template>

<style scoped>
</style>
