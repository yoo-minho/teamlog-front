<template>
  <q-item-label class="cursor-pointer row q-mx-sm items-center">
    <div class="image_area row justify-center content-center">
      <div v-for="n in 4" :key="n" class="image_item shadow-1">
        <q-avatar rounded size="32px">
          <q-skeleton size="32px" />
        </q-avatar>
      </div>
    </div>
    <q-item class="col q-px-sm">
      <q-item-section>
        <q-skeleton type="text" width="60%" height="1.8rem" />
        <q-skeleton type="text" width="80%" height="1.5rem" />
        <q-skeleton type="text" width="50%" height="1.5rem" />
      </q-item-section>
    </q-item>
  </q-item-label>
  <q-separator spaced />
</template>
<style scope>
.image_area {
  width: 80px;
  height: 80px;
  margin: 4px 0 0 4px;
}
.image_item {
  margin: 0 4px 4px 0;
}
</style>
