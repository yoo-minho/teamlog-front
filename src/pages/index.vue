<script setup lang="ts">
useHead({
  title: "팀로그 title",
  meta: [
    { property: "description", content: `팀로그짱 description` },
    { property: "og:title", content: "The Intuitive Web Framework" },
    {
      property: "og:description",
      content:
        "Build your next Vue.js application with confidence using Nuxt...",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://nuxt.com" },
    { property: "og:locale", content: "en_US" },
    { property: "og:image", content: "https://nuxt.com/social.jpg" },
  ],
});
definePageMeta({
  redirect: "/team",
});
</script>
