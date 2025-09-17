<template>
  <div class="space-y-10">
    <!-- Hero Section -->
    <section 
      :class="[
        'relative overflow-visible p-4',
        prefersReducedMotion 
          ? 'opacity-100' 
          : `transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`
      ]"
    >
      <!-- Background decoration -->
      <div class="absolute inset-0 z-0 opacity-20">
        <div class="absolute top-0 left-0 w-full h-full bg-[url('/logo.png')] bg-no-repeat bg-center bg-contain"></div>
      </div>
      
      <div class="relative z-10 text-center py-8 md:py-12 bg-gradient-to-r from-black-600/80 to-grey-600/60 rounded-lg shadow-2xl pixel-border max-w-3xl mx-auto m-4">
        <!-- Animated particles - only show if animations are enabled -->
        <div 
          v-if="!prefersReducedMotion" 
          class="absolute inset-0 pointer-events-none opacity-30"
        >
          <div 
            v-for="(particle, i) in particles.slice(0, 10)" 
            :key="i"
            class="absolute bg-white rounded-full w-2 h-2"
            :style="{
              top: particle.top,
              left: particle.left,
              opacity: particle.opacity,
              animation: `float ${particle.animationDuration} linear infinite`,
              animationDelay: particle.animationDelay
            }"
          />
        </div>
        
        <div class="relative z-10 flex flex-col items-center">
          <!-- Main title with logo image -->
          <div class="mb-3 text-center">
            <div class="relative">
              <h2 class="text-4xl md:text-6xl text-white font-bold mb-2 relative z-10">
                Welcome to
              </h2>
            </div>
            <div class="flex justify-center">
              <img 
                src="/XRCL.png" 
                alt="XRCraft Logo" 
                class="h-auto w-auto max-w-xs"
              />
            </div>
          </div>
          
          <!-- Subtitle in dark box -->
          <div class="bg-black/20 py-1 px-8 rounded-md inline-block mb-5">
            <p class="text-lg md:text-xl text-white">
              VR Optimized Minecraft Server
            </p>
          </div>
          
          <!-- Join box styled with pixel-border and backdrop blur -->
          <div class="bg-black-900/50 backdrop-blur-sm p-6 rounded-lg pixel-border shadow-2xl max-w-md w-full mx-auto">
             <div class="flex flex-col gap-4">
              <!-- Server IP Row -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-white">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2H5z" />
                  </svg>
                  <span class="font-medium">Join us at:</span>
                </div>
                <button
                  @click="handleHeroCopy"
                  :class="[
                    'relative bg-black/30 px-2 py-1 rounded cursor-pointer border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200',
                    heroCopied ? 'ring-2 ring-green-400' : ''
                  ]"
                  title="Click to copy server IP"
                  aria-label="Copy server IP to clipboard"
                >
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2"/>
                      <path d="M5 15V5a2 2 0 0 1 2-2h10"/>
                    </svg>
                    <code class="font-mono text-blue-200">{{ serverIp }}</code>
                  </span>
                  <span 
                    v-if="heroCopied"
                    class="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap animate-pulse" 
                    role="status"
                  >
                    Copied!
                  </span>
                </button>
              </div>
              
              <!-- Player count row -->
              <div class="bg-black/10 px-4 py-3 rounded flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="text-white">Players Online:</span>
                </div>
                <div class="flex items-center gap-2">
                  <PlayerCount :server-ip="serverIp" />
                  <router-link 
                    to="/status" 
                    class="text-blue-300 hover:text-blue-200 ml-2"
                  >
                    Server Status
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Info Sections -->
    <section 
      :class="[
        'grid md:grid-cols-2 gap-8 transition-all duration-700 delay-200 transform',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      ]"
      style="will-change: opacity, transform"
    >
      <div class="bg-mcbrown p-6 rounded-lg shadow-lg pixel-border mc-card relative overflow-hidden">
        <div class="absolute inset-0 bg-black/10 z-0"></div>
        <div class="relative z-10">
          <h2 class="text-2xl font-semibold mb-4 text-white border-b-2 border-blue-400 pb-2 inline-block pixel-font">
            What is XRCraft?
          </h2>
          <p class="mb-4 text-white">
            XRCraft is a VR optimized Minecraft server that iss included in QuestCraft by default, 
            providing the best experience for VR players while remaining fully compatible with PC!
          </p>
          <p class="mb-6 text-white">
            Explore our gamemodes with a welcoming community.
          </p>
          <div class="flex items-center mt-4 bg-black/20 p-3 rounded-md pixel-border">
            <p class="text-sm font-semibold mr-2 text-white">Server IP:</p>
            <button
              @click="handleInfoCopy"
              :class="[
                'relative bg-black/30 px-2 py-1 rounded cursor-pointer border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm hover:bg-black/50 active:scale-95 mc-button',
                infoCopied ? 'ring-2 ring-green-400' : ''
              ]"
              title="Click to copy server IP"
              type="button"
              aria-label="Copy server IP to clipboard"
            >
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15V5a2 2 0 0 1 2-2h10"/>
                </svg>
                <code class="font-mono text-base text-blue-200">{{ serverIp }}</code>
              </span>
              <span 
                v-if="infoCopied"
                class="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded shadow-lg animate-pulse z-10 whitespace-nowrap" 
                role="status"
              >
                Copied!
              </span>
            </button>
          </div>
        </div>
      </div>

      <div class="bg-mcbrown p-6 rounded-lg shadow-lg pixel-border mc-card relative overflow-hidden">
        <div class="absolute inset-0 bg-black/10 z-0"></div>
        <div class="relative z-10">
          <h2 class="text-2xl font-semibold mb-4 text-white border-b-2 border-blue-400 pb-2 inline-block pixel-font">
            Quick Links
          </h2>
          <ul class="space-y-3">
            <li 
              v-for="link in quickLinks" 
              :key="link.path" 
              class="transform hover:translate-x-2 transition-transform duration-200"
            >
              <router-link 
                :to="link.path" 
                class="text-blue-300 hover:text-blue-100 transition-colors flex items-center pixel-border bg-black/20 p-2 rounded-md hover:bg-black/30"
                :aria-label="link.name"
              >
                <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="link.icon" />
                </svg>
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Community Section -->
    <section 
      :class="[
        'relative transition-all duration-700 delay-400 transform',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      ]"
      style="will-change: opacity, transform"
    >
      <div class="bg-gradient-to-r from-blue-600/80 to-purple-600/80 p-6 rounded-lg shadow-lg pixel-border overflow-hidden">
        <div class="relative z-10 flex flex-col md:flex-row items-center gap-4">
          <div class="bg-black/20 rounded-full p-3 flex-shrink-0">
            <svg class="w-10 h-10 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-white mb-2">Join Our Active Community</h3>
            <p class="text-white/90">
              Connect with other players, get help, and participate in community events!
            </p>
          </div>
          <div class="flex-shrink-0 mt-4 md:mt-0">
            <a 
              href="https://discord.gg/5uNeeUWEFH" 
              target="_blank" 
              rel="noopener noreferrer"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200 flex items-center gap-2 mc-button"
              aria-label="Join our Discord server (opens in a new tab)"
            >
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.02.06.03.09.02 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"/>
              </svg>
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PlayerCount from '@/components/PlayerCount.vue'

// Pre-generate static particle positions to avoid hydration mismatch
const particles = Array(15).fill(0).map((_, i) => ({
  top: `${(i * 13 + 7) % 97}%`,
  left: `${(i * 17 + 11) % 93}%`,
  opacity: 0.2 + ((i * 3) % 7) * 0.1,
  animationDuration: `${12 + (i * 7) % 13}s`,
  animationDelay: `${(i * 5) % 7}s`,
}))

const serverIp = "play.xrcraftmc.com"
const heroCopied = ref(false)
const infoCopied = ref(false)
const isVisible = ref(false)

// Check for reduced motion preference
const prefersReducedMotion = ref(false)

onMounted(() => {
  // Trigger animations after component mounts
  isVisible.value = true
  
  // Check for reduced motion preference
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches
  }
})

// Generic copy function
const copyServerIP = async (setter: typeof heroCopied) => {
  try {
    await navigator.clipboard.writeText(serverIp)
    setter.value = true
    setTimeout(() => setter.value = false, 1500)
  } catch (error) {
    console.error('Failed to copy text: ', error)
  }
}

const handleHeroCopy = () => copyServerIP(heroCopied)
const handleInfoCopy = () => copyServerIP(infoCopied)

const quickLinks = [
  { 
    path: '/about', 
    name: 'Learn More About Us', 
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
  },
  { 
    path: '/rules', 
    name: 'Server Rules', 
    icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' 
  },
  { 
    path: '/servers', 
    name: 'Available Servers', 
    icon: 'M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 014.5-4.5h15a4.5 4.5 0 014.5 4.5m-4.5 6.75h-15' 
  },
  { 
    path: '/status', 
    name: 'Server Status', 
    icon: 'M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z' 
  },
  { 
    path: '/socials', 
    name: 'Our Socials', 
    icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.479m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' 
  },
]
</script>

<style scoped>
.pixel-border {
  border: 2px solid #444;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.pixel-font {
  font-family: var(--font-minecraft);
}

.mc-card:hover {
  transform: translateY(-2px);
}

.mc-button:hover {
  transform: translateY(-1px);
}

.bg-mcbrown {
  background-color: #7A5C29;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>