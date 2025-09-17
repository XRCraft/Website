<template>
  <div class="relative">
    <Transition
      mode="out-in"
      :css="false"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div
        :key="$route.path"
        class="relative overflow-hidden"
      >
        <!-- Optional page transition overlay -->
        <div
          v-if="!reducedMotion && showOverlay"
          class="fixed inset-0 bg-mcbrown z-50 pointer-events-none"
          :style="{ 
            transform: `scaleY(${overlayScale})`,
            transformOrigin: 'top'
          }"
        />
        
        <!-- Main content -->
        <div class="relative">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHydrated = ref(false)
const reducedMotion = ref(false)
const showOverlay = ref(false)
const overlayScale = ref(1)

// Check for reduced motion preference
const checkReducedMotion = () => {
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.value = mediaQuery.matches
    
    const handleMediaChange = (e: MediaQueryListEvent) => {
      reducedMotion.value = e.matches
    }
    
    mediaQuery.addEventListener('change', handleMediaChange)
    return () => mediaQuery.removeEventListener('change', handleMediaChange)
  }
  return () => {}
}

let cleanup: () => void

onMounted(() => {
  isHydrated.value = true
  cleanup = checkReducedMotion()
})

onUnmounted(() => {
  if (cleanup) cleanup()
})

// Animation functions
const onEnter = (el: Element, done: () => void) => {
  const element = el as HTMLElement
  
  if (reducedMotion.value) {
    // Simple fade for reduced motion
    element.style.opacity = '0'
    element.style.transition = 'opacity 0.2s ease'
    
    requestAnimationFrame(() => {
      element.style.opacity = '1'
      setTimeout(done, 200)
    })
  } else {
    // Full animations for normal motion
    element.style.opacity = '0'
    element.style.transform = 'translateY(20px) scale(0.98)'
    element.style.filter = 'blur(4px)'
    element.style.transition = 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
    element.style.willChange = 'opacity, transform'
    
    // Show overlay
    showOverlay.value = true
    overlayScale.value = 1
    
    requestAnimationFrame(() => {
      element.style.opacity = '1'
      element.style.transform = 'translateY(0) scale(1)'
      element.style.filter = 'blur(0px)'
      
      // Animate overlay out
      setTimeout(() => {
        overlayScale.value = 0
        setTimeout(() => {
          showOverlay.value = false
          done()
        }, 400)
      }, 100)
    })
  }
}

const onLeave = (el: Element, done: () => void) => {
  const element = el as HTMLElement
  
  if (reducedMotion.value) {
    // Simple fade for reduced motion
    element.style.transition = 'opacity 0.2s ease'
    element.style.opacity = '0'
    setTimeout(done, 200)
  } else {
    // Full animations for normal motion
    element.style.transition = 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
    element.style.willChange = 'opacity, transform'
    element.style.opacity = '0'
    element.style.transform = 'translateY(-10px)'
    
    // Show overlay
    showOverlay.value = true
    overlayScale.value = 1
    
    setTimeout(done, 250)
  }
}
</script>

<style scoped>
.bg-mcbrown {
  background-color: #7A5C29;
}
</style>