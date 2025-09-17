<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">Server Status</h1>
    
    <section class="glass-container">
      <h2 class="text-2xl font-semibold mb-3">Current Status</h2>
      <div class="bg-black/20 p-4 rounded-lg">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Server Status:</span>
          </div>
          <PlayerCount server-ip="play.xrcraftmc.com" />
        </div>
        <p class="mt-4">Server IP: <code class="bg-black/30 px-2 py-1 rounded">play.xrcraftmc.com</code></p>
      </div>
    </section>

    <section class="glass-container">
      <h2 class="text-2xl font-semibold mb-3">Recent Updates</h2>
      <ul class="space-y-2">
        <li>• Server optimization for VR players</li>
        <li>• New custom plugins added</li>
        <li>• Performance improvements</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import PlayerCount from '@/components/PlayerCount.vue'

const title = 'Status | XRCraftMC'
const description = 'Current status of XRCraftMC servers.'

if (typeof document !== 'undefined') {
  document.title = title
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', description)
  }
}
</script>