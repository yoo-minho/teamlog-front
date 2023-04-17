<script setup>
const route = useRoute();
// When accessing /posts/1, route.params.id will be 1
console.log(route.params.id);

definePageMeta({
  title: "Some Page",
  validate: async (route) => {
    // Check if the id is made up of digits
    return /^\d+$/.test(route.params.id);
  },
});

useHead({
  title: "My App",
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Site Title` : "Site Title";
  },
  meta: [{ name: "description", content: "My amazing site." }],
  meta: [{ property: "og:title", content: `App Name - ${route.meta.title}` }],
  bodyAttrs: {
    class: "test",
  },
  script: [{ innerHTML: "console.log('Hello world')" }],
});

useServerSeoMeta({
  title: "My Amazing Site" + route.params.id,
  ogTitle: "My Amazing Site",
  description: "This is my amazing site, let me tell you all about it.",
  ogDescription: "This is my amazing site, let me tell you all about it.",
  ogImage: "https://example.com/image.png",
  twitterCard: "summary_large_image",
});
</script>
<template>
  <div>
    {{ route.params.id }}
  </div>
</template>
