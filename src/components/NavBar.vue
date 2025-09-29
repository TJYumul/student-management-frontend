<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const mobileOpen = ref(false)
const route = useRoute()

const links = [
  { to: '/', label: 'Home', exact: true },
  { to: '/students', label: 'Student' },
]

function isActive(link) {
  if (link.exact) return route.path === link.to
  return route.path === link.to || route.path.startsWith(link.to + '/')
}
</script>

<template>
  <nav class="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-40">
    <div class="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <span class="font-extrabold text-slate-800 tracking-tight">Student Management System</span>
        <ul class="hidden md:flex items-center gap-1 text-sm font-medium">
          <li v-for="l in links" :key="l.to">
            <RouterLink :to="l.to" :class="[
              'px-3 py-1.5 rounded-md transition-colors',
              isActive(l) ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            ]" :aria-current="isActive(l) ? 'page' : undefined">{{ l.label }}</RouterLink>
          </li>
        </ul>
      </div>

      <button @click="mobileOpen = !mobileOpen" class="md:hidden inline-flex items-center justify-center w-9 h-9 rounded hover:bg-slate-100" aria-label="Toggle navigation">
        <span v-if="!mobileOpen">☰</span>
        <span v-else>✕</span>
      </button>
    </div>

    <div v-if="mobileOpen" class="md:hidden border-t border-slate-200 bg-white">
      <ul class="flex flex-col p-2 text-sm">
        <li v-for="l in links" :key="l.to">
          <RouterLink @click="mobileOpen=false" :to="l.to" :class="[
            'block px-3 py-2 rounded-md',
            isActive(l) ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50'
          ]" :aria-current="isActive(l) ? 'page' : undefined">{{ l.label }}</RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
</style>
