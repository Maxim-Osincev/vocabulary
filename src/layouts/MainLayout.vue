<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated :class="$q.dark.isActive ? 'bg-primary' : 'bg-black'">
      <q-toolbar>
        <q-btn flat @click="leftDrawerOpen = !leftDrawerOpen" round dense icon="menu" />
        <q-toolbar-title>Header</q-toolbar-title>
        <q-space />
        <q-toggle
          v-model="darkMode"
          color="grey-9"
          icon="dark_mode"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="200"
      :breakpoint="500"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-scroll-area class="fit">
        <q-list>

          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item
              clickable
              v-ripple
              @click="this.$router.push({ name: menuItem.pathName })"
              :active="menuItem.pathName === this.$route.name"
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
          </template>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar'

const $q = useQuasar();

const menuList = [
  {
    label: 'Словарь',
    icon: 'menu_book',
    pathName: 'dictionary',
  },
  {
    label: 'Правила',
    icon: 'school',
    pathName: 'rules',
  },
  {
    label: 'Фразы',
    icon: 'people',
    pathName: 'phrases',
  },
];

const darkMode = ref<boolean>(false);
watch(darkMode, (value) => {
  $q.dark.set(value);
});

const leftDrawerOpen = ref<boolean>(false);
</script>
