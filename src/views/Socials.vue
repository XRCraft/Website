<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">Connect with us</h1>

    <section class="glass-container">
      <h2 class="text-2xl font-semibold mb-3">Official Social Media</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>
          <a href="https://bsky.app/profile/xrcraftmc.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline dark:text-blue-400">Bluesky</a>
        </li>
        <li>
          <a href="https://github.com/XRCraft" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline dark:text-blue-400">Github</a>
        </li>
        <li>
          <a href="https://discord.xrcraftmc.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline dark:text-blue-400">Discord</a>
        </li>
      </ul>
    </section>

    <section class="glass-container">
      <h2 class="text-2xl font-semibold mb-3">Social Media Role Requirements</h2>
      <p class="mb-4">Requirements for obtaining a special role (e.g., on Discord) based on your social media presence. The profile must be linked to your Discord profile.</p>
      <div class="space-y-4">
        <div class="glass-light p-4">
          <h3 class="font-semibold text-lg">YouTube</h3>
          <ul class="list-disc list-inside ml-4 space-y-1">
            <li>1K - 5K Subscribers</li>
            <li>2K - 5K Average Views per relevant video</li>
            <li>A video about XRCraft in the last 4 months with at least 2K views</li>
          </ul>
        </div>
        <div class="glass-light p-4">
          <h3 class="font-semibold text-lg">TikTok</h3>
          <p>Not currently accepting applications for TikTok roles.</p>
        </div>
        <div class="glass-light p-4">
          <h3 class="font-semibold text-lg">Other Platforms</h3>
          <p>Requirements for other platforms are currently unknown. Not accepting applications at this time.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Page metadata
const title = 'Socials | XRCraftMC'
const description = 'Connect with XRCraftMC on social media platforms.'

// Set page title
if (typeof document !== 'undefined') {
  document.title = title
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', description)
  }
}
</script>