<template>
  <div class="full-height">
    <q-table
      v-if="wordsList && wordsList.length"
      :columns="wordsTableColumns"
      :rows="wordsList"
      row-key="name"
      flat
      class="absolute-full"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <div class="text-weight-bold text-body1 text-italic">{{ col.label }}</div>
          </q-th>
        </q-tr>
      </template>
    </q-table>
    <div v-else class="text-center text-h6">Список пуст</div>
    <q-menu
      v-if="folderId"
      touch-position
      context-menu
    >
      <q-list dense style="min-width: 100px">
        <q-item clickable v-close-popup>
          <q-item-section @click="showModal = true">Добавить слово</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <q-dialog
      v-model="showModal"
      @keydown.enter="createNewWord"
    >
      <q-card class="full-width" style="max-width: 500px;">
        <q-card-section>
          <div class="text-h6">Создать</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="wordData.word" label="Слово"/>
          <q-input v-model="wordData.translate" label="Перевод"/>
          <q-input v-model="wordData.example" label="Пример"/>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отменить" v-close-popup />
          <q-btn flat label="Сохранить" color="primary" @click="createNewWord" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { api } from 'boot/axios';

const props = defineProps([
  'wordsList',
  'folderId',
]);

const emit = defineEmits(['update-words-list']);

const wordsTableColumns = [
  {
    name: 'word',
    label: 'Слово',
    align: 'left',
    field: row => row.word,
    format: val => `${val}`,
  },
  { name: 'translate', align: 'left', label: 'Перевод', field: 'translate' },
  { name: 'example', align: 'left', label: 'Пример', field: 'example' },
]

const showModal = ref<boolean>(false);

const wordData = ref({
  word: '',
  translate: '',
  example: '',
});
const createNewWord = async () => {
  const data = await api.post('/words', { wordData: wordData.value, folderId: props.folderId }).then(res => res.data);
  if (data) {
    emit('update-words-list');
    showModal.value = false;
    wordData.value.word = '';
    wordData.value.translate = '';
    wordData.value.example = '';
  }
};
</script>

<style scoped>

</style>
