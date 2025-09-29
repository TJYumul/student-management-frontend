import { createRouter, createWebHistory } from 'vue-router'

const LandingPage = () => import('../pages/LandingPage.vue')
const StudentsPage = () => import('../pages/StudentsPage.vue')
const StudentCreatePage = () => import('../pages/StudentCreatePage.vue')
const StudentDetailPage = () => import('../pages/StudentDetailPage.vue')
const StudentEditPage = () => import('../pages/StudentEditPage.vue')
const StudentDeletePage = () => import('../pages/StudentDeletePage.vue')

const routes = [
  { path: '/', name: 'home', component: LandingPage, meta: { title: 'Home' } },
  { path: '/students', name: 'students', component: StudentsPage, meta: { title: 'Students' } },
  { path: '/students/create', name: 'student-create', component: StudentCreatePage, meta: { title: 'Create Student' } },
  { path: '/students/:id', name: 'student-detail', component: StudentDetailPage, meta: { title: 'Student Detail' } },
  { path: '/students/:id/edit', name: 'student-edit', component: StudentEditPage, meta: { title: 'Edit Student' } },
  { path: '/students/:id/delete', name: 'student-delete', component: StudentDeletePage, meta: { title: 'Delete Student' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.afterEach((to) => {
  if (to.meta?.title) document.title = `${to.meta.title} | Student Management System`
})

export default router
