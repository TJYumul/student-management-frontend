# student-course-frontend

A Vue 3 + Vite frontend scaffold enhanced with Tailwind CSS and vue-router for a Student/Course style application.

## Features
- Vite + Vue 3 (script setup)
- Tailwind CSS (v4) with PostCSS
- Vue Router (basic Students & Courses pages)
- Responsive navigation bar + layout shell

## Project Structure
```
student-course-frontend/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── assets/
    │   └── tailwind.css          # Tailwind entry (base/components/utilities)
    ├── components/
    │   ├── NavBar.vue            # Top navigation (responsive)
    │   └── FooterBar.vue         # Footer
    ├── pages/
    │   ├── StudentsPage.vue      # Placeholder students view
    │   └── CoursesPage.vue       # Placeholder courses view
    ├── router/
    │   └── index.js              # Route definitions & title updates
    ├── App.vue                   # App layout: Nav + <RouterView/> + Footer
    └── main.js                   # App entry: imports Tailwind & mounts Vue
```

## Getting Started
Install dependencies:
```sh
npm install
```
Run the dev server:
```sh
npm run dev
```
Visit: http://localhost:5173

## Tailwind Usage
Utility-first styling. Extend design tokens in `tailwind.config.js` under `theme.extend`.
Example:
```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: { extend: { colors: { brand: { 500: '#1d6fe8' } } } },
  plugins: [],
}
```
Use via: `<div class="text-brand-500 font-semibold">Hello</div>`

## Adding New Pages
1. Create a `.vue` file in `src/pages`.
2. Add a lazy route in `src/router/index.js`:
```js
{ path: '/teachers', name: 'teachers', component: () => import('../pages/TeachersPage.vue') }
```
3. Add a nav link in `NavBar.vue`.

## Suggested Next Steps
- Connect to real API (define services layer)
- Global state (Pinia) if needed
- Error + loading UI patterns
- Auth & protected routes
- Unit tests (Vitest + Testing Library)

## Scripts
```sh
npm run dev     # Start dev server
npm run build   # Production build
npm run preview # Preview production build locally
```

## License
MIT (add a LICENSE file if distributing publicly)
