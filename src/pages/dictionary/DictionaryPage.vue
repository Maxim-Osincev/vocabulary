<template>
  <div class="row absolute-full">
    <div class="folders_list q-gutter-sm relative-position">
      <div v-if="loadingFoldersList" class="text-center q-pa-md">
        <q-spinner-gears
          color="primary"
          size="2em"
        />
      </div>
      <div class="full-height" v-else>
        <q-list v-if="folders && folders.length" class="rounded-borders" dense>
          <q-item
            v-for="folder in folders"
            :key="folder.id"
            clickable
            v-ripple
            :active="selectedFolder?.id === folder.id"
            @click="getFolderWords(folder)"
          >
            <q-menu
              touch-position
              context-menu
            >
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section @click="editingNameFolder(folder)">Переименовать</q-item-section>
                </q-item>
                <q-separator/>
                <q-item clickable v-close-popup>
                  <q-item-section @click="copyFolder(folder)">Копировать</q-item-section>
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
    </div>
    <div class="col relative-position">
      <WordsTable
        :words-list="wordsList"
        :folder-id="selectedFolder?.id"
        @update-words-list="getFolderWords(selectedFolder)"
      />
    </div>
  </div>
  <EditModal
    v-model="showEditingFolders"
    :label="'Название папки'"
    :title="'Создать'"
    :action="'create-new-folder'"
    @create-new-folder="createNewFolder"
  />
<!--  <EditModal-->
<!--    v-model="showEditingNameFolders"-->
<!--    :label="'Название папки'"-->
<!--    :title="'Переименовать'"-->
<!--    :action="'rename-folder'"-->
<!--    v-model:text="folderName"-->
<!--    @rename-folder="renameFolder"-->
<!--  />-->
  <q-dialog v-model="showEditingNameFolders">
    <q-card class="full-width" style="max-width: 500px;">
      <q-card-section>
        <div class="text-h6">Переименовать</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model="folderName" label="Название папки" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отменить" v-close-popup />
        <q-btn flat label="Сохранить" color="primary" @click="renameFolder" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <ConfirmModal
    v-model="confirmDeleteFolder"
    :text="'При удалении папки будут также удалены все слова из нее. Вы уверены, что хотите сделать это?'"
    :action="'delete-folder'"
    @delete-folder="deleteFolderById"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import EditModal from '/src/components/modal/EditModal.vue';
import ConfirmModal from 'components/modal/ConfirmModal.vue';
import WordsTable from 'pages/dictionary/words/WordsTable.vue';

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

const selectedFolder = ref<Folder>();

const loadingFoldersList = ref<boolean>(false);

const folders = ref<Folder[]>([]);
const getAllFolders = async () => {
  loadingFoldersList.value = true;
  folders.value = await api.get('/folders').then(res => res.data);
  loadingFoldersList.value = false;
}

const wordsList = ref<Word[]>([]);
const getFolderWords = async (folder: Folder) => {
  const { id } = folder;
  selectedFolder.value = folder;
  wordsList.value = await api.get('/words', { params: { folderId: id } }).then(res => res.data);
}

const showEditingFolders = ref<boolean>(false);
const folderName = ref<string>('');
const createNewFolder = async (value: string) => {
  const data = await api.post('/folders', { folderName: value }).then(res => res.data);
  if (data) {
    await getAllFolders();
    showEditingFolders.value = false;
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
  const data = await api.delete('/folders', { params: { folderId: id } }).then(res => res.data);
  if (data) {
    await getAllFolders();
    wordsList.value = [];
    currentFolderToDelete.value = {};
  }
}

const showEditingNameFolders = ref<boolean>(false);
const currentFolderToRename = ref<Folder | object>();
const editingNameFolder = (folder: Folder) => {
  const { folder_name } = folder;
  currentFolderToRename.value = folder;
  showEditingNameFolders.value = !showEditingNameFolders.value;
  folderName.value = folder_name;
}

const renameFolder = async (value: string) => {
  const { id } = currentFolderToRename.value as Folder;
  const data = await api.put('/folders', { folderId: id, folderName: value }).then(res => res.data);
  if (data) {
    await getAllFolders();
    currentFolderToRename.value = {};
  }
}

const copyFolder = async ({ id, folder_name }) => {
  const data = await api.post('/folders-copy', { folderId: id, folderName: folder_name }).then(res => res.data);
  if (data) {
    await getAllFolders();
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
