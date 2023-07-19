<template>
  <q-item-label>
    <q-item>
      <q-item-section>
        <div class="label text-weight-bold ellipsis text-subtitle2">
          <q-skeleton type="rect" width="70%" />
        </div>
        <div class="label ellipsis-2-lines">
          <q-skeleton type="text" width="90%" class="dense" />
          <q-skeleton type="text" width="80%" class="dense" />
        </div>
        <div class="label text-grey-5 ellipsis">
          <q-skeleton type="text" width="40%" class="dense" />
        </div>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" size="24px" class="shadow-2" />
        </q-item-section>
      </q-item-section>
    </q-item>
  </q-item-label>
  <q-separator spaced />
</template>
<style lang="scss" scoped>
.dense {
  transform: scale(1, 0.7);
}
</style>
