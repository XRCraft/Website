<template>
  <div class="text-center space-y-8">
    <h1 class="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
    
    <div class="glass-container max-w-md mx-auto">
      <p class="mb-4">The page you're looking for doesn't exist.</p>
      <router-link 
        to="/" 
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Go Home
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const title = '404 - Page Not Found | XRCraftMC'

if (typeof document !== 'undefined') {
  document.title = title
}
</script>