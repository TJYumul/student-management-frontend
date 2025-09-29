<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStudent, updateStudent } from '@/services/api'

const route = useRoute()
const router = useRouter()

const form = reactive({
  id: route.params.id,
  firstName: '',
  lastName: '',
  email: '',
  address: ''
})

const loading = ref(false)
const saving = ref(false)
const error = ref(null)
const loadError = ref(null)

function mapFromApi(s) {
  form.firstName = s.first_name
  form.lastName = s.last_name
  form.email = s.email
  form.address = s.address
}

function toApiPayload() {
  return {
    first_name: form.firstName,
    last_name: form.lastName,
    email: form.email,
    address: form.address
  }
}

async function load() {
  loading.value = true
  loadError.value = null
  try {
    const res = await getStudent(form.id)
    mapFromApi(res.data)
  } catch (e) {
    loadError.value = e?.response?.status === 404 ? 'Student not found.' : (e?.response?.data?.message || 'Failed to load student.')
  } finally {
    loading.value = false
  }
}

async function submit() {
  saving.value = true
  error.value = null
  try {
    await updateStudent(form.id, toApiPayload())
    router.push(`/students/${form.id}`)
  } catch (e) {
    error.value = e?.response?.data?.message || 'Update failed.'
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="space-y-6 max-w-xl">
    <header>
      <h1 class="text-2xl font-bold text-slate-800">Edit Student</h1>
      <p class="text-slate-600 text-sm">Update details for #{{ form.id }}</p>
    </header>
    <div v-if="loading" class="p-4 text-sm text-slate-500">Loading...</div>
    <div v-else-if="loadError" class="space-y-4">
      <p class="text-sm text-red-600">{{ loadError }}</p>
      <div class="flex gap-2">
        <button @click="load" class="btn btn-sm">Retry</button>
        <RouterLink to="/students" class="btn-secondary btn-sm">Back</RouterLink>
      </div>
    </div>
    <form v-else @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">First Name</label>
        <input v-model="form.firstName" type="text" class="input" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Last Name</label>
        <input v-model="form.lastName" type="text" class="input" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input v-model="form.email" type="email" class="input" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Address</label>
        <input v-model="form.address" type="text" class="input" />
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <div class="flex gap-3 pt-2">
        <button type="submit" class="btn disabled:opacity-60" :disabled="saving">
          <span v-if="!saving">Save Changes</span>
          <span v-else>Saving...</span>
        </button>
        <RouterLink :to="`/students/${form.id}`" class="btn-secondary">Cancel</RouterLink>
      </div>
    </form>
  </section>
</template>

<style scoped>
</style>
