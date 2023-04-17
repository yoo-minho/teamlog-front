import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Link } from '../types/common';

export const useOpenGraphTagStore = defineStore('openGraphTag', () => {
  const isOpenGroupEditor = ref(false);
  const openGroupEditor = () => (isOpenGroupEditor.value = true);
  const closeGroupEditor = () => (isOpenGroupEditor.value = false);

  const isOpenLinkEditor = ref(false);
  const openLinkEditor = () => (isOpenLinkEditor.value = true);
  const closeLinkEditor = () => (isOpenLinkEditor.value = false);

  const links = ref([] as Link[]);
  const initLinks = () => (links.value.length = 0);
  const addLink = (v: Link) => links.value.push(v);
  const deleteLink = (idx: number) => links.value.splice(idx, 1);

  return {
    isOpenGroupEditor,
    openGroupEditor,
    closeGroupEditor,
    isOpenLinkEditor,
    openLinkEditor,
    closeLinkEditor,
    links,
    initLinks,
    addLink,
    deleteLink,
  };
});
