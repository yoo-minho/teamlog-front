<script setup>
definePageMeta({
  middleware: "auth",
});
</script>
<template>
  <q-btn color="primary" label="Primary" />
  <QBtn color="secondary" label="Secondary" />
  <LazyQBtn color="amber" glossy label="Amber" />
  <h1>Welcome to your dashboard</h1>
</template>
