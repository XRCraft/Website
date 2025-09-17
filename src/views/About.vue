<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">About XRCraftMC</h1>
    
    <section class="glass-container">
      <h2 class="text-2xl font-semibold mb-3">Our Mission</h2>
      <p class="mb-4">
        XRCraftMC is dedicated to providing the ultimate VR Minecraft experience. 
        We aim to bridge the gap between virtual reality and traditional gaming, 
        creating an immersive environment where players can truly feel like they're living in the Minecraft world.
      </p>
      <p>
        Our server is optimized for VR players using QuestCraft while maintaining 
        full compatibility with traditional PC players, ensuring everyone can enjoy the experience together.
      </p>
    </section>

    <section class="glass-container">
      <h2 class="text-2xl font-semibold mb-3">What Makes Us Special</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>VR-optimized gameplay mechanics</li>
        <li>Cross-platform compatibility (VR and PC)</li>
        <li>Active and welcoming community</li>
        <li>Regular events and updates</li>
        <li>Custom plugins designed for VR interaction</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
// Page metadata
const title = 'About | XRCraftMC'
const description = 'Learn more about XRCraftMC, the VR optimized Minecraft server.'

// Set page title
if (typeof document !== 'undefined') {
  document.title = title
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', description)
  }
}
</script>