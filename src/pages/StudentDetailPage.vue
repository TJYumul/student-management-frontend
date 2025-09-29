<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStudent, deleteStudent } from '@/services/api'

const route = useRoute()
const router = useRouter()

const student = ref(null)
const loading = ref(false)
const error = ref(null)
const deleting = ref(false)
const deleteError = ref(null)
const confirmDelete = ref(false)
const successMessage = ref('')
let successTimer = null

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
      // Try common wrappers: { data: {...} }, { student: {...} }
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

async function confirmAndDelete() {
  if (!student.value) return
  deleting.value = true
  deleteError.value = null
  try {
    await deleteStudent(student.value.id)
    successMessage.value = 'Deleted successfully'
    if (successTimer) clearTimeout(successTimer)
    successTimer = setTimeout(() => { successMessage.value = '' }, 2500)
    // Navigate back after short delay so user sees message
    setTimeout(() => router.push('/students'), 600)
  } catch (e) {
    deleteError.value = e?.response?.data?.message || 'Delete failed.'
  } finally {
    deleting.value = false
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
      <div v-if="successMessage" class="rounded border border-green-300 bg-green-50 text-green-700 px-4 py-2 text-sm">
        {{ successMessage }}
      </div>
      <header class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Student Detail</h1>
          <p class="text-slate-600 text-sm">Viewing student #{{ student.id }}</p>
        </div>
        <div class="flex gap-2">
          <RouterLink :to="`/students/${student.id}/edit`" class="px-3 py-1.5 rounded bg-blue-600 text-white text-xs font-medium hover:bg-blue-700">Edit</RouterLink>
          <button @click="confirmDelete = true" class="px-3 py-1.5 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700">Delete</button>
        </div>
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

    <!-- Delete confirmation modal -->
    <transition name="fade">
      <div v-if="confirmDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="confirmDelete = false" />
        <div class="relative w-full max-w-sm card space-y-4">
          <h2 class="text-lg font-semibold text-slate-800">Delete Student</h2>
          <p class="text-sm text-slate-600">Are you sure you want to delete <span class="font-medium">{{ student?.firstName }} {{ student?.lastName }}</span>? This action cannot be undone.</p>
          <p v-if="deleteError" class="text-xs text-red-600">{{ deleteError }}</p>
          <div class="flex justify-end gap-3 pt-2">
            <button @click="confirmDelete = false" class="btn-secondary" :disabled="deleting">Cancel</button>
            <button @click="confirmAndDelete" class="btn-danger disabled:opacity-60" :disabled="deleting">
              <span v-if="!deleting">Delete</span>
              <span v-else>Deleting...</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
