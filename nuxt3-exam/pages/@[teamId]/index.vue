<script setup>
const route = useRoute();
const router = useRouter();
router.replace({ path: `/@${route.params.teamId}/post` });
</script>
<template>
  <div>~</div>
</template>
