<template>
  <q-list class="rounded-borders">
    <q-expansion-item
      v-for="rule in rulesList"
      :key="rule.id"
      class="q-mb-md"
      expand-separator
      icon="rule"
      :label="rule.ruleName"
      :author="rule.author"
    >
      <q-card>
        <q-card-section>
          {{ rule.description }}
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>

  <q-btn
    class="absolute-bottom-right"
    style="bottom: 16px;right: 16px;"
    round
    color="primary"
    icon="add"
    size="lg"
    @click="editingRules = true"
  />
  <q-dialog v-model="editingRules">
    <q-card class="column" style="min-width: 40vw; min-height: 30vh;">
      <q-card-section>
        <q-input v-model="editingRule.ruleName" label="Название" />
        <q-input v-model="editingRule.description" label="Описание" autogrow />
      </q-card-section>
      <q-space />
      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" v-close-popup />
        <q-btn @click="addNewRule" flat label="Сохранить" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';

const rulesList = reactive<object[]>([
  {
    id: 1,
    ruleName: 'Правило №1',
    description: 'Описание правила №1',
    author: 'Maksim Osintsev',
  },
  {
    id: 2,
    ruleName: 'Правило №2',
    description: 'Описание правила №2',
    author: 'Maksim Osintsev',
  },
]);

interface Rule {
  id?: number,
  ruleName: string,
  description: string,
  author?: string,
}

const editingRules = ref<boolean>(false);
const editingRule = reactive<Rule>({
  ruleName: '',
  description: '',
});

const clearFields = () => {
  editingRule.ruleName = '';
  editingRule.description = '';
};

const addNewRule = () => {
  rulesList.push({
    id: rulesList.length + 1,
    author: 'Test user admin',
    ...editingRule
  });

  clearFields();
};
</script>

<style scoped>

</style>
