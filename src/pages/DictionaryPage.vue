<template>
  <div class="row absolute-full">
    <div class="folders_list q-gutter-sm relative-position">
      <q-list v-if="folders && folders.length" class="rounded-borders" dense>
        <q-item
          v-for="folder in folders"
          :key="folder.id"
          clickable
          v-ripple
          :active="selectedFolder === folder.folder_name"
          @click="getFolderWords(folder)"
        >
          <q-menu
            touch-position
            context-menu
          >
            <q-list dense style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>Переименовать</q-item-section>
              </q-item>
              <q-separator/>
              <q-item clickable v-close-popup>
                <q-item-section>Копировать</q-item-section>
              </q-item>
              <q-separator/>
              <q-item clickable v-close-popup @click="confirmDeleting(folder)">
                <q-item-section>Удалить</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
          <q-item-section>{{ folder.folder_name }}</q-item-section>
        </q-item>
      </q-list>
      <div v-else class="q-pa-sm text-center">Список папок пуст</div>
      <q-menu
        touch-position
        context-menu
      >
        <q-list dense style="min-width: 100px">
          <q-item clickable v-close-popup>
            <q-item-section @click="showEditingFolders = !showEditingFolders">Создать</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>
    <div class="col relative-position">
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
    </div>
  </div>
  <q-dialog v-model="showEditingFolders">
    <q-card class="full-width" style="max-width: 500px;">
      <q-card-section>
        <div class="text-h6">Создать</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model="folderName" label="Название папки" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отменить" v-close-popup />
        <q-btn flat label="Сохранить" color="primary" @click="createNewFolder" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="confirmDeleteFolder" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">При удалении папки будут также удалены все слова из нее. Вы уверены, что хотите сделать это?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" v-close-popup />
        <q-btn flat label="Подтвердить" color="primary" v-close-popup @click="deleteFolderById" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

interface Folder {
  id: number,
  folder_name: string,
  child_folders: Folder[],
  created_date: Date,
  updated_date: Date,
  is_root: boolean | number,
  lazy?: boolean,
  parent_id: number | null,
  handler: (arg: any) => void,
}

interface Word {
  id: number,
  word: string,
  translate: string,
  example: string,
  folder_id: number,
  created_date: Date,
  updated_date: Date,
}

const selectedFolder = ref<string>('');

const folders = ref<Folder[]>([]);
const getAllFolders = async () => {
  folders.value = await axios.get('http://localhost:8000/folders').then(res => res.data);
}

const wordsList = ref<Word[]>([]);
const getFolderWords = async ({ id, folder_name }) => {
  selectedFolder.value = folder_name;
  wordsList.value = await axios.get('http://localhost:8000/words', { params: { folderId: id } }).then(res => res.data);
}

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

const showEditingFolders = ref<boolean>(false);
const folderName = ref<string>('');
const createNewFolder = async () => {
  const { value } = folderName;
  folderName.value = '';
  const data = await axios.post('http://localhost:8000/folders', { folderName: value }).then(res => res.data);
  if (data) {
    await getAllFolders();
  }
}

const confirmDeleteFolder = ref<boolean>(false);
const currentFolderToDelete = ref<Folder | object>();
const confirmDeleting = (folder: Folder) => {
  confirmDeleteFolder.value = !confirmDeleteFolder.value;
  currentFolderToDelete.value = folder;
}

const deleteFolderById = async () => {
  const { id } = currentFolderToDelete.value as Folder;
  currentFolderToDelete.value = {};
  const data = await axios.delete('http://localhost:8000/folders', { params: { folderId: id } }).then(res => res.data);
  if (data) {
    await getAllFolders();
    wordsList.value = [];
  }
}

onMounted(async () => {
  await getAllFolders();
});

</script>

<style scoped lang="scss">
.folders_list {
  max-width: 250px;
  width: 100%;
  border-right: 1px solid rgba(0,0,0,0.1);
}
</style>
