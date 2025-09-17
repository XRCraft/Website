<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">Server Rules</h1>
    
    <section class="glass-container">
      <h2 class="text-2xl font-semibold mb-3">General Rules</h2>
      <ol class="list-decimal list-inside space-y-2">
        <li>Be respectful to all players</li>
        <li>No griefing or destroying other players' builds</li>
        <li>No cheating, hacking, or exploiting</li>
        <li>Keep chat family-friendly</li>
        <li>No advertising other servers</li>
      </ol>
    </section>

    <section class="glass-container">
      <h2 class="text-2xl font-semibold mb-3">VR Specific Guidelines</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>Be mindful of VR player movement and interactions</li>
        <li>Help new VR players learn the controls</li>
        <li>Report any VR-specific bugs or issues</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
const title = 'Rules | XRCraftMC'
const description = 'Server rules and guidelines for XRCraftMC.'

if (typeof document !== 'undefined') {
  document.title = title
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', description)
  }
}
</script>