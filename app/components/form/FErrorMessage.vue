<script setup lang="ts">
import { ErrorMessage } from "vee-validate"

interface FErrorMessageProps {
  name: string
}

const props = defineProps<FErrorMessageProps>()
</script>

<template>
  <ErrorMessage class="text-red-500 font-medium" :name/>
</template>
