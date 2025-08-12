<script setup lang="ts">

import { authClient } from "~~/lib/auth_client"

const email = ref<string>( "" )
const pass  = ref<string>( "" )

const onSubmit = async () => {
  const { data, error } = await authClient.signIn.email( {
    email   : email.value,
    password: pass.value
  } )
  console.log( 'result: ',data, error )
}
</script>

<template>
  <div>
    <InputText type="text" v-model="email"/>
    <InputText type="text" v-model="pass"/>
    <Button label="Login" @click="onSubmit">Enter</Button>
  </div>
</template>

<style scoped>

</style>