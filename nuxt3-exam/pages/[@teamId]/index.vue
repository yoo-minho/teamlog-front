<script setup>
const route = useRoute();
// When accessing /posts/1, route.params.id will be 1
console.log(route.params.teamId);
</script>
<template>
  <div>메인이요</div>
</template>
