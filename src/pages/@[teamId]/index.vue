<script setup lang="ts">
definePageMeta({
  redirect: (to) => `/@${to.params.teamId}/post`,
});
</script>
