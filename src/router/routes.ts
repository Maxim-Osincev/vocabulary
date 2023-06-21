import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        children: [
          {
            path: '/dictionary',
            name: 'dictionary',
            component: () => import('pages/dictionary/DictionaryPage.vue')
          },
          {
            path: '/rules',
            name: 'rules',
            component: () => import('pages/RulesPage.vue')
          },
          {
            path: '/phrases',
            name: 'phrases',
            component: () => import('pages/PhrasesPage.vue')
          },
        ],
      }
    ],
  },
];

export default routes;
