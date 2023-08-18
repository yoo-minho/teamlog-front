<script setup lang="ts">
definePageMeta({
  layout: "in-team",
  redirect: (to) => `/@${to.params.teamId}/post`,
});
</script>
