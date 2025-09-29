<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

function confirmDelete() {
  console.log('Deleting student id', route.params.id)
  router.push('/students')
}
</script>

<template>
  <section class="space-y-6 max-w-lg">
    <header>
      <h1 class="text-2xl font-bold text-red-600">Delete Student</h1>
      <p class="text-slate-600 text-sm">You are about to delete student #{{ route.params.id }}. This action cannot be undone.</p>
    </header>
    <div class="card border-red-200 bg-red-50 text-sm text-red-700">
      Are you absolutely sure? This will permanently remove the record.
    </div>
    <div class="flex gap-3 pt-2">
      <button @click="confirmDelete" class="btn-danger">Yes, Delete</button>
      <RouterLink :to="`/students/${route.params.id}`" class="btn-secondary">Cancel</RouterLink>
    </div>
  </section>
</template>

<style scoped>
</style>
