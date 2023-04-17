<template>
  <div v-for="i in 4" :key="i">
    <q-item class="row">
      <q-item-section avatar class="col-3 align-center">
        <q-skeleton size="48px" />
      </q-item-section>
      <q-item-section class="col-9">
        <q-item-label>
          <q-skeleton type="text" width="60%" />
        </q-item-label>
        <q-item-label>
          <q-skeleton type="text" />
        </q-item-label>
        <q-item-label>
          <q-skeleton type="text" width="70%" />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator spaced />
  </div>
</template>
