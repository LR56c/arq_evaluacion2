<script setup lang="ts">
import { useField }  from "vee-validate"
import FErrorMessage from "~/components/form/FErrorMessage.vue"

interface FInputGroupProps {
  name: string
  placeholder: string
  type: "text" | "email"
  iconText: string
}

const props             = defineProps<FInputGroupProps>()
const { value, errors } = useField<string>( () => props.name )

</script>

<template>
  <div class="flex flex-col gap-1">
    <InputGroup>
      <InputGroupAddon>
        <i :class="[iconText]"></i>
      </InputGroupAddon>
      <InputText :invalid="Boolean(errors.length)" :type v-model="value" :placeholder/>
    </InputGroup>
    <f-error-message :name/>
  </div>
</template>
