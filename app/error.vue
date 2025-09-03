<script setup lang="ts">
import type { NuxtError } from "#app"

const props = defineProps( {
  error: Object as () => NuxtError
} )

</script>

<template>
  <div>
    <h2>{{ error.statusCode }}</h2>
    <h2>{{ error.statusMessage }}</h2>
    <NuxtLink to="/">Home</NuxtLink>
  </div>
</template>
