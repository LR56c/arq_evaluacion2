<script setup lang="ts">

import { authClient } from "~~/lib/auth_client"
import { registerRequestSchema } from "~~/modules/user/application/models/register_request"
import { loginRequestSchema } from "~~/modules/user/application/models/login_request"
import FInputGroup from "~/components/form/FInputGroup.vue"
import FPassword from "~/components/form/FPassword.vue"

const validationSchema = toTypedSchema( loginRequestSchema)
const form             = useForm( {
  validationSchema
} )
const loading          = ref( false )
const router           = useRouter()
const store            = useAuthStore()

const onSubmit         = form.handleSubmit( async ( values ) => {
  loading.value = true
  const result  = store.login( values )
  console.log( "result: ", result )
  loading.value = false
  await router.replace( "/" )
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <f-input-group name="email" placeholder="Email" type="email" icon-text="pi pi-envelope"></f-input-group>
    <f-password name="password" placeholder="Contraseña"></f-password>
    <Button label="Login" @click="onSubmit">Enter</Button>
  </form>
</template>

<style scoped>

</style>