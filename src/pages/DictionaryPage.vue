<template>
  <div class="row absolute-full">
    <div class="q-gutter-sm" style="width: 250px;">
      <q-tree
        :nodes="folders"
        node-key="folder_name"
        label-key="folder_name"
        children-key="child_folders"
        @lazy-load="getFoldersById"
        @update="getFolderWords"
        :selected="selectedFolder"
      />
    </div>
    <div class="col">
      <q-list>
        <q-item v-for="word in wordsList" :key="word.id" clickable v-ripple>
          <q-item-section>{{ word }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
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
onMounted(async () => {
  folders.value = await axios.get('http://localhost:8000/root-folders').then(res => res.data);
  folders.value.forEach((folder: Folder) => {
    folder.lazy = true;
    folder.handler = (node) => {
      getFolderWords(node);
      selectedFolder.value = node.folder_name;
    };
  });
});

const getFoldersById = async ({ node, done }) => {
  const { id: parentId } = node;
  const childFolders = await axios.get('http://localhost:8000/folders', { params: { parentId } }).then(res => res.data);
  if (childFolders?.length > 0) {
    childFolders.forEach((folder: Folder) => {
      folder.lazy = true;
      folder.handler = (node) => {
        getFolderWords(node);
        selectedFolder.value = node.folder_name;
      };
    });
    done(childFolders);
  } else {
    done([]);
  }
}

const wordsList = ref<Word[]>([]);
const getFolderWords = async ({ id }) => {
  wordsList.value = await axios.get('http://localhost:8000/words', { params: { folderId: id } }).then(res => res.data);
}

</script>

<style scoped>


</style>
