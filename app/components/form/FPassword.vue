<script setup lang="ts">
import { useField }  from "vee-validate"
import FErrorMessage from "~/components/form/FErrorMessage.vue"

interface FPasswordProps {
  name: string
  placeholder: string
}

const props             = defineProps<FPasswordProps>()
const { value, errors } = useField<string>( () => props.name )
</script>

<template>
  <div class="flex flex-col gap-1">
    <Password fluid :invalid="Boolean(errors.length)" v-model="value" toggleMask :feedback="false"
              :placeholder/>
    <f-error-message :name/>
  </div>
</template>

<style scoped>

</style>
