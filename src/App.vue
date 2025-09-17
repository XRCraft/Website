<template>
  <div class="min-h-screen flex flex-col scroll-smooth">
    <!-- Theme provider wrapper -->
    <div 
      :class="`${fontClasses} ${isDark ? 'dark' : ''}`"
      class="min-h-screen flex flex-col"
    >
      <!-- Minecraft particles effect -->
      <div class="particles" aria-hidden="true">
        <div
          v-for="(particle, i) in particles"
          :key="i"
          class="absolute bg-white rounded-full w-1 h-1 opacity-30"
          :style="particle.style"
        />
      </div>
      
      <!-- Skip to content link -->
      <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white">
        Skip to main content
      </a>
      
      <!-- Navigation -->
      <Navbar />
      
      <!-- Main content -->
      <main id="main-content" class="flex-grow container mx-auto px-4 pt-20 pb-8 w-full">
        <AnimatedLayout>
          <router-view />
        </AnimatedLayout>
      </main>
      
      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import AnimatedLayout from './components/AnimatedLayout.vue'

// Theme management
const isDark = ref(true)

// Font classes
const fontClasses = computed(() => {
  return 'font-inter font-minecraft font-minecraft-alt font-rubik'
})

// Particles for background animation
const particles = ref<Array<{ style: any }>>([])

onMounted(() => {
  // Check for user's theme preference
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  isDark.value = savedTheme ? savedTheme === 'dark' : prefersDark
  
  // Update document class
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  // Generate particles
  particles.value = Array.from({ length: 15 }).map((_, i) => ({
    style: {
      top: `${(Math.sin(i * 0.5) * 0.5 + 0.5) * 100}%`,
      left: `${(Math.cos(i * 0.7) * 0.5 + 0.5) * 100}%`,
      animation: `float ${10 + i % 8 * 2.5}s linear infinite`,
      animationDelay: `${i * 0.7}s`,
      willChange: 'transform'
    }
  }))
})

// Make theme toggle available globally
const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Provide theme functionality to child components
import { provide } from 'vue'
provide('theme', {
  isDark: isDark,
  toggleTheme
})
</script>

<style>
/* Font face definitions */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Press+Start+2P&family=VT323&family=Rubik:wght@400;500;600;700&display=swap');

.font-inter { font-family: var(--font-inter); }
.font-minecraft { font-family: var(--font-minecraft); }
.font-minecraft-alt { font-family: var(--font-minecraft-alt); }
.font-rubik { font-family: var(--font-rubik); }
</style>