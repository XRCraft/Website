<template>
  <nav
    role="navigation"
    :class="[
      'backdrop-blur-md sticky top-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/10 shadow-lg border-b border-white/20'
        : 'bg-white/5 border-b border-white/10'
    ]"
  >
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <!-- Logo -->
      <router-link to="/" class="flex items-center group mc-hover">
        <div class="relative overflow-hidden rounded-lg pixel-border bg-black p-1">
          <img
            src="/logo.png"
            alt="XRCraftMC Logo"
            class="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <span class="text-xl font-bold text-white drop-shadow-md ml-3 hidden sm:inline group-hover:text-mcgold transition-colors pixel-font">
          XRCraftMC
        </span>
      </router-link>

      <!-- Desktop Menu -->
      <ul class="hidden md:flex items-center space-x-4">
        <li v-for="link in NAV_LINKS" :key="link.href">
          <router-link
            :to="link.href"
            :class="[
              'glass-nav-link',
              $route.path === link.href && 'active'
            ]"
          >
            {{ link.label }}
          </router-link>
        </li>
      </ul>

      <!-- Mobile Menu Button -->
      <div class="md:hidden flex items-center">
        <button
          id="mobile-menu-button"
          @click="toggleMobileMenu"
          :class="[
            'glass-btn p-2',
            isMobileMenuOpen && 'active'
          ]"
          aria-controls="mobile-menu"
          :aria-expanded="isMobileMenuOpen"
          :aria-label="isMobileMenuOpen ? 'Close main menu' : 'Open main menu'"
        >
          <span class="sr-only">{{ isMobileMenuOpen ? 'Close main menu' : 'Open main menu' }}</span>
          <XMarkIcon v-if="isMobileMenuOpen" class="block h-6 w-6" aria-hidden="true" />
          <Bars3Icon v-else class="block h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu with Animation -->
    <div
      id="mobile-menu"
      :aria-hidden="!isMobileMenuOpen"
      aria-labelledby="mobile-menu-button"
      :class="[
        'md:hidden bg-white/10 backdrop-blur-md shadow-lg border-t border-white/10 transform transition-all duration-300 overflow-hidden',
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      ]"
    >
      <ul class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <li v-for="link in NAV_LINKS" :key="link.href" class="text-center">
          <router-link
            :to="link.href"
            @click="closeMobileMenu"
            :class="[
              'glass-nav-link block w-full text-center',
              $route.path === link.href && 'active'
            ]"
            :aria-current="$route.path === link.href ? 'page' : undefined"
          >
            {{ link.label }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

// Navigation links
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/rules', label: 'Rules' },
  { href: '/servers', label: 'Servers' },
  { href: '/status', label: 'Server Status' },
  { href: '/socials', label: 'Socials' },
]

const route = useRoute()
const isMobileMenuOpen = ref(false)
const scrolled = ref(false)

// Mobile menu controls
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Scroll effect
const handleScroll = () => {
  const isScrolled = window.scrollY > 20
  if (isScrolled !== scrolled.value) {
    scrolled.value = isScrolled
  }
}

// Close mobile menu when route changes
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})

onMounted(() => {
  // Use passive event listener for better performance
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.pixel-border {
  border: 2px solid #444;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.pixel-font {
  font-family: var(--font-minecraft);
}

.mc-hover:hover {
  transform: translateY(-2px);
}

.glass-nav-link {
  @apply px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200;
}

.glass-nav-link.active {
  @apply text-blue-400 bg-white/20;
}

.glass-btn {
  @apply bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200;
}

.glass-btn.active {
  @apply bg-white/20;
}
</style>