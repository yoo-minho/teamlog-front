<script setup>
const route = useRoute();
const router = useRouter();
router.push({ path: `/@${route.params.teamId}/post` });
</script>
<template>
  <div>메인이요</div>
</template>
