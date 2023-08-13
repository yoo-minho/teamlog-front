<script setup lang="ts">
const feature1 = ref(true);
const feature2 = ref();
</script>

<template>
  <div class="q-gutter-sm">
    <q-list>
      <q-item>
        <q-item-section avatar>
          <q-checkbox v-model="feature1" color="green-5" disable />
        </q-item-section>
        <q-item-section>
          <q-item-label>팀로그 생성 / 수정/ 삭제</q-item-label>
          <q-item-label caption>
            티스토리, RSS, 벨로그, 브런치, 미디엄, 네이버블로그, 유튜브 등 여러
            플랫폼의 블로그들을 엮어 팀 블로그로 만들 수 있습니다.
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-checkbox v-model="feature2" color="green-3" disable />
        </q-item-section>
        <q-item-section>
          <q-item-label>[업데이트예정] 북마크</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-checkbox v-model="feature2" color="green-3" disable />
        </q-item-section>
        <q-item-section>
          <q-item-label>[업데이트예정] 새 글 알림</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-checkbox v-model="feature2" color="green-3" disable />
        </q-item-section>
        <q-item-section>
          <q-item-label>[업데이트예정] 도네이션</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
