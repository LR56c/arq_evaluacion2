<script setup lang="ts">

import { authClient } from "~~/lib/auth_client"

const email = ref<string>( "" )
const name  = ref<string>( "" )
const pass  = ref<string>( "" )
const router = useRouter()
const onSubmit = async () => {
  const { data, error } = await authClient.signUp.email( {
    email   : email.value,
    password: pass.value,
    name    : name.value
  } )
  console.log( "result: ", data, error )
  await router.replace( "/" )
}
</script>

<template>
  <div>
    <InputText type="text" v-model="email"/>
    <InputText type="text" v-model="name"/>
    <InputText type="text" v-model="pass"/>
    <Button label="Login" @click="onSubmit">Register</Button>
  </div>
</template>

<style scoped>

</style>