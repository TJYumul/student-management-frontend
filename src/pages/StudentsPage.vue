<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStudents, deleteStudent } from '@/services/api'

const router = useRouter()

// State
const students = ref([])
const loading = ref(false)
const error = ref(null)
const search = ref('')

// Helpers to map API (snake_case) -> UI (camelCase)
function mapFromApi(s) {
  return {
    id: s.id,
    firstName: s.first_name,
    lastName: s.last_name,
    email: s.email,
    address: s.address
  }
}

async function loadStudents() {
  loading.value = true
  error.value = null
  try {
    const res = await getStudents()
    let raw = res.data
    // Support common wrapper formats: { data: [...] }, { results: [...] }, { students: [...] }
    if (Array.isArray(raw)) {
      // direct array
    } else if (Array.isArray(raw?.data)) {
      raw = raw.data
    } else if (Array.isArray(raw?.results)) {
      raw = raw.results
    } else if (Array.isArray(raw?.students)) {
      raw = raw.students
    } else if (Array.isArray(raw?.message)) {
      // Laravel controller returns { message: Student::all() }
      raw = raw.message
    } else {
      raw = []
    }
    students.value = raw.map(mapFromApi)
  } catch (e) {
    error.value = e?.response?.data?.message || 'Failed to load students.'
    console.error('Load students error:', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadStudents)

const filtered = computed(() => {
  if (!search.value) return students.value
  const q = search.value.toLowerCase()
  return students.value.filter(s =>
    [s.firstName, s.lastName, s.email].some(v => v && v.toLowerCase().includes(q))
  )
})

// Deletion handling
const confirmOpen = ref(false)
const targetStudent = ref(null)
const deleting = ref(false)
const deleteError = ref(null)

function requestDelete(student) {
  targetStudent.value = student
  deleteError.value = null
  confirmOpen.value = true
}

function cancelDelete() {
  if (deleting.value) return
  confirmOpen.value = false
  targetStudent.value = null
}

async function performDelete() {
  if (!targetStudent.value) return
  deleting.value = true
  deleteError.value = null
  try {
    await deleteStudent(targetStudent.value.id)
    students.value = students.value.filter(s => s.id !== targetStudent.value.id)
    if (router.currentRoute.value.name === 'student-detail' && router.currentRoute.value.params.id == targetStudent.value.id) {
      router.push('/students')
    }
    cancelDelete()
  } catch (e) {
    deleteError.value = e?.response?.data?.message || 'Delete failed.'
    console.error('Delete student error:', e)
  } finally {
    deleting.value = false
    confirmOpen.value = false
  }
}
</script>

<template>
  <section class="space-y-6">
    <header class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Student Records</h1>
        <p class="text-slate-600 text-sm">Manage and view enrolled students.</p>
      </div>
      <div class="flex gap-3 items-center">
        <input v-model="search" type="text" placeholder="Search..." class="input w-56" />
        <RouterLink to="/students/create" class="btn">New</RouterLink>
      </div>
    </header>

    <div class="card overflow-x-auto p-0 min-h-[120px]">
      <div v-if="loading" class="p-6 text-center text-slate-500 text-sm">Loading students...</div>
      <div v-else-if="error" class="p-6 text-center text-red-600 text-sm space-y-3">
        <p>{{ error }}</p>
        <button @click="loadStudents" class="btn btn-sm">Retry</button>
      </div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th class="w-44">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in filtered" :key="s.id">
            <td>{{ s.id }}</td>
            <td>{{ s.firstName }} {{ s.lastName }}</td>
            <td>{{ s.email }}</td>
            <td class="flex gap-3 items-center px-4 py-2">
              <RouterLink :to="`/students/${s.id}`" class="text-blue-600 hover:underline text-sm">View</RouterLink>
              <RouterLink :to="`/students/${s.id}/edit`" class="text-slate-600 hover:underline text-sm">Edit</RouterLink>
              <button @click="requestDelete(s)" class="text-red-600 hover:underline text-sm">Delete</button>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="4" class="px-4 py-6 text-center text-slate-500">No students found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirmation Modal -->
    <transition name="fade">
      <div v-if="confirmOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="cancelDelete" />
        <div class="relative w-full max-w-sm card space-y-4">
          <h2 class="text-lg font-semibold text-slate-800">Delete Student</h2>
          <p class="text-sm text-slate-600">Are you sure you want to delete
            <span class="font-medium text-slate-800">{{ targetStudent?.firstName }} {{ targetStudent?.lastName }}</span>? This action cannot be undone.</p>
          <p v-if="deleteError" class="text-xs text-red-600">{{ deleteError }}</p>
          <div class="flex justify-end gap-3 pt-2">
            <button @click="cancelDelete" class="btn-secondary" :disabled="deleting">Cancel</button>
            <button @click="performDelete" class="btn-danger disabled:opacity-60" :disabled="deleting">
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
