<template>
  <span 
    v-if="isLoading" 
    class="inline-flex items-center"
  >
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span class="font-minecraft-alt text-blue-200">Checking...</span>
  </span>
  
  <span 
    v-else-if="error || !data" 
    class="inline-flex items-center gap-2 bg-red-900/30 px-2 py-1 rounded-md"
  >
    <svg class="h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
    <span class="text-red-300 font-minecraft-alt">Offline</span>
    <button 
      @click="handleRetry" 
      class="ml-1 text-blue-300 hover:text-blue-200 text-xs bg-blue-900/30 px-2 py-0.5 rounded transition-colors"
      aria-label="Retry loading server status"
    >
      Retry
    </button>
  </span>
  
  <span 
    v-else-if="!data.online || !data.players" 
    class="inline-flex items-center gap-2 bg-red-900/30 px-2 py-1 rounded-md"
  >
    <svg class="h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span class="text-red-300 font-minecraft-alt">Offline</span>
    <button 
      @click="handleRetry" 
      class="ml-1 text-blue-300 hover:text-blue-200 text-xs bg-blue-900/30 px-2 py-0.5 rounded transition-colors"
      aria-label="Retry loading server status"
    >
      Retry
    </button>
  </span>

  <span 
    v-else
    :class="[
      'font-semibold inline-flex items-center gap-2 transition-all duration-300',
      animate ? 'scale-110' : 'scale-100'
    ]"
  >
    <span class="relative h-5 w-20 bg-black/40 rounded-full overflow-hidden border border-white/20">
      <span 
        :class="[
          'absolute h-full rounded-full transition-all duration-700 ease-in-out',
          statusColor
        ]"
        :style="{ width: `${percentFull}%` }"
        :title="statusIndicator"
        role="progressbar"
        :aria-valuenow="data.players?.online"
        aria-valuemin="0"
        :aria-valuemax="data.players?.max"
        :aria-label="`${data.players?.online} of ${data.players?.max} players online. Status: ${statusIndicator}`"
      ></span>
      <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] [text-shadow:_0_1px_2px_rgb(0_0_0_/_80%)]">
        <span class="translate-y-px">{{ data.players?.online }} / {{ data.players?.max }}</span>
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface ServerStatus {
  online: boolean
  players?: {
    online: number
    max: number
  }
}

interface Props {
  serverIp: string
}

const props = defineProps<Props>()

const data = ref<ServerStatus | null>(null)
const error = ref<string | null>(null)
const isLoading = ref(true)
const animate = ref(false)

let intervalId: number | null = null

const fetchServerStatus = async () => {
  try {
    // Mock server data since external API is blocked
    // In production, this would be replaced with actual API call
    data.value = {
      online: true,
      players: {
        online: Math.floor(Math.random() * 20) + 1, // Random number between 1-20
        max: 20
      }
    }
    error.value = null
    animate.value = true
    setTimeout(() => animate.value = false, 1000)
  } catch (err) {
    console.error('Error fetching server status:', err)
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    isLoading.value = false
  }
}

const handleRetry = () => {
  isLoading.value = true
  error.value = null
  fetchServerStatus()
}

// Calculate percentage and status
const percentFull = computed(() => {
  if (!data.value || !data.value.online || !data.value.players) return 0
  return (data.value.players.online / data.value.players.max) * 100
})

const statusColor = computed(() => {
  const percent = percentFull.value
  if (percent > 90) return 'bg-red-500'
  if (percent > 70) return 'bg-yellow-500'
  if (percent > 40) return 'bg-blue-500'
  return 'bg-green-500'
})

const statusIndicator = computed(() => {
  const percent = percentFull.value
  if (percent > 90) return 'Almost full!'
  if (percent > 70) return 'Quite busy'
  if (percent > 40) return 'Active'
  return 'Open'
})

onMounted(() => {
  fetchServerStatus()
  // Refresh every 2 minutes
  intervalId = setInterval(fetchServerStatus, 120000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.font-minecraft-alt {
  font-family: var(--font-minecraft-alt);
}
</style>