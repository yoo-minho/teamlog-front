<template>
  <q-item-label>
    <q-item>
      <q-item-section side>
        <q-item-section avatar>
          <q-skeleton size="64px" class="shadow-1" />
        </q-item-section>
      </q-item-section>
      <q-item-section class="q-ml-sm">
        <q-item-label
          class="text-weight-bold text-subtitle2 row items-center q-gutter-xs"
          style="height: 28px"
        >
          <q-icon name="launch" />
          <q-skeleton type="rect" width="50%" height="24px" />
        </q-item-label>
        <q-skeleton type="rect" width="90%" height="16px" class="q-mt-sm" />
        <q-skeleton type="rect" width="70%" height="16px" class="q-mt-sm" />
        <q-skeleton type="rect" width="50%" height="16px" class="q-mt-sm" />
      </q-item-section>
    </q-item>
  </q-item-label>
  <q-separator spaced />
</template>
