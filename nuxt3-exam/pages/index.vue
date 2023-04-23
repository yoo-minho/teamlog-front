<script setup lang="ts">
const logoPath = new URL(
  `../assets/white_logo.png`,
  import.meta.url
).toString();
const router = useRouter();
setTimeout(() => {
  router.push({ path: "/team" });
}, 2000);
</script>
<template>
  <div
    class="flex flex-center align-center"
    style="height: calc(100vh - 100px)"
  >
    <q-avatar rounded size="144px">
      <q-img :src="logoPath" no-spinner loading="eager" />
    </q-avatar>
  </div>
</template>
