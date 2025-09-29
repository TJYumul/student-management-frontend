<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createStudent } from '@/services/api'

const router = useRouter()
const form = reactive({ firstName: '', lastName: '', email: '', address: '' })
const loading = ref(false)
const error = ref(null)

function toApiPayload(f) {
  return {
    first_name: f.firstName,
    last_name: f.lastName,
    email: f.email,
    address: f.address
  }
}

async function submit() {
  loading.value = true
  error.value = null
  try {
    await createStudent(toApiPayload(form))
    router.push('/students')
  } catch (e) {
    error.value = e?.response?.data?.message || 'Create failed.'
    console.error('Create student error:', e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="space-y-6 max-w-xl">
    <header>
      <h1 class="text-2xl font-bold text-slate-800">Create Student</h1>
      <p class="text-slate-600 text-sm">Enter basic student information.</p>
    </header>
    <form @submit.prevent="submit" class="space-y-4">
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
        <button type="submit" class="btn disabled:opacity-60" :disabled="loading">
          <span v-if="!loading">Save</span>
          <span v-else>Saving...</span>
        </button>
        <RouterLink to="/students" class="btn-secondary">Cancel</RouterLink>
      </div>
    </form>
  </section>
</template>

<style scoped>
</style>
