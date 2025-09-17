<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">Our Servers</h1>
    
    <section class="glass-container">
      <h2 class="text-2xl font-semibold mb-3">Main Server</h2>
      <div class="bg-black/20 p-4 rounded-lg">
        <p><strong>IP:</strong> play.xrcraftmc.com</p>
        <p><strong>Version:</strong> Latest</p>
        <p><strong>Type:</strong> Survival/Creative</p>
        <p><strong>VR Optimized:</strong> Yes</p>
      </div>
    </section>

    <section class="glass-container">
      <h2 class="text-2xl font-semibold mb-3">Server Features</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>VR-optimized gameplay</li>
        <li>Cross-platform compatibility</li>
        <li>Custom plugins</li>
        <li>Active community</li>
        <li>Regular events</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
const title = 'Servers | XRCraftMC'
const description = 'Information about XRCraftMC servers.'

if (typeof document !== 'undefined') {
  document.title = title
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', description)
  }
}
</script>