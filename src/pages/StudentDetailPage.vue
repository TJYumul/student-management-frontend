<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStudent } from '@/services/api'

const route = useRoute()
const router = useRouter()

const student = ref(null)
const loading = ref(false)
const error = ref(null)
// Removed delete functionality per request; only viewing.

function mapFromApi(s) {
  return {
    id: s.id,
    firstName: s.first_name,
    lastName: s.last_name,
    email: s.email,
    address: s.address,
    enrolledAt: s.created_at || s.enrolled_at || s.createdAt
  }
}

async function load() {
  loading.value = true
  error.value = null
  try {
    const res = await getStudent(route.params.id)
    let raw = res.data
    if (raw && typeof raw === 'object' && !raw.id) {
      if (raw.data?.id) raw = raw.data
      else if (raw.student?.id) raw = raw.student
    }
    student.value = mapFromApi(raw)
  } catch (e) {
    error.value = e?.response?.status === 404 ? 'Student not found.' : (e?.response?.data?.message || 'Failed to load student.')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="space-y-6 max-w-2xl">
    <div v-if="loading" class="p-6 text-center text-slate-500 text-sm">Loading student...</div>
    <div v-else-if="error" class="space-y-4">
      <p class="text-red-600 text-sm">{{ error }}</p>
      <div class="flex gap-3">
        <button @click="load" class="btn btn-sm">Retry</button>
        <RouterLink to="/students" class="btn-secondary btn-sm">Back</RouterLink>
      </div>
    </div>
    <template v-else-if="student">
      <header class="space-y-1">
        <h1 class="text-2xl font-bold text-slate-800">Student Detail</h1>
        <p class="text-slate-600 text-sm">Viewing student #{{ student.id }}</p>
      </header>

      <div class="rounded border border-slate-200 bg-white p-4 shadow-sm">
        <dl class="divide-y divide-slate-100">
          <div class="py-3 grid grid-cols-3 gap-4">
            <dt class="text-sm font-medium text-slate-600">ID</dt>
            <dd class="col-span-2 text-sm text-slate-800">{{ student.id }}</dd>
          </div>
          <div class="py-3 grid grid-cols-3 gap-4">
            <dt class="text-sm font-medium text-slate-600">First Name</dt>
            <dd class="col-span-2 text-sm text-slate-800">{{ student.firstName }}</dd>
          </div>
            <div class="py-3 grid grid-cols-3 gap-4">
            <dt class="text-sm font-medium text-slate-600">Last Name</dt>
            <dd class="col-span-2 text-sm text-slate-800">{{ student.lastName }}</dd>
          </div>
          <div class="py-3 grid grid-cols-3 gap-4">
            <dt class="text-sm font-medium text-slate-600">Email</dt>
            <dd class="col-span-2 text-sm text-slate-800">{{ student.email }}</dd>
          </div>
          <div class="py-3 grid grid-cols-3 gap-4" v-if="student.address">
            <dt class="text-sm font-medium text-slate-600">Address</dt>
            <dd class="col-span-2 text-sm text-slate-800 whitespace-pre-line">{{ student.address }}</dd>
          </div>
          <div class="py-3 grid grid-cols-3 gap-4">
            <dt class="text-sm font-medium text-slate-600">Enrolled</dt>
            <dd class="col-span-2 text-sm text-slate-800">{{ student.enrolledAt }}</dd>
          </div>
        </dl>
      </div>

      <div>
        <button @click="router.back()" class="text-sm text-slate-600 hover:text-slate-900">Go Back</button>
      </div>
    </template>

  </section>
</template>

<style scoped>
/* Transition styles removed with delete modal */
</style>
