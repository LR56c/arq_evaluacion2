<script setup lang="ts">
import { authClient } from "~~/lib/auth_client"

const session = authClient.useSession()
</script>

<template>
  <div>
    <Button label="Verify"/>
    <pre><{{ session.data }}</pre>
    <div class="bg-red-300">hola</div>
  </div>
</template>
