import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUserStore();
  const { isExistsUser } = storeToRefs(user);
  if (isExistsUser.value) return;
  return navigateTo(`/my?to=${to.path}`);
});
