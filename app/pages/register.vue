<script setup lang="ts">


import { registerRequestSchema } from "~~/modules/user/application/models/register_request"
import { z }                     from "zod"
import FInputGroup               from "~/components/form/FInputGroup.vue"
import FPassword                 from "~/components/form/FPassword.vue"

const validationSchema = toTypedSchema( registerRequestSchema.extend( {
      confirm: z.string( {
        message: "Las contraseñas no coinciden"
      } )
    } ).refine( ( data ) => data.password === data.confirm, {
      path   : ["confirm"],
      message: "Las contraseñas no coinciden"
    } )
)
const form             = useForm( {
  validationSchema
} )
const loading          = ref( false )
const router           = useRouter()
const store            = useAuthStore()
const onSubmit         = form.handleSubmit( async ( values ) => {
  loading.value = true
  const result  = store.register( values )
  console.log( "result: ", result )
  loading.value = false
  await router.replace( "/" )
} )
</script>

<template>
  <form @submit.prevent="onSubmit">
    <f-input-group name="email" placeholder="Email" type="email" icon-text="pi pi-envelope"></f-input-group>
    <f-input-group name="name" placeholder="Nombre" type="text" icon-text="pi pi-envelope"></f-input-group>
    <f-password name="password" placeholder="Contraseña"></f-password>
    <f-password name="confirm" placeholder="Confirmar Contraseña"></f-password>
    <Button label="Login" @click="onSubmit">Register</Button>
  </form>
</template>

<style scoped>

</style>