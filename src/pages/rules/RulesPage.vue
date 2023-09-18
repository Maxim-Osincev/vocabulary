<template>
  <div v-if="loading">
    1
  </div>
  <div v-else>
    <q-list v-if="rulesList.length" class="rounded-borders">
      <q-expansion-item
        v-for="rule in rulesList"
        :key="rule.id"
        class="q-mb-md"
        expand-separator
        icon="rule"
        :label="rule.title"
        group="rules"
        switch-toggle-side
      >
        <template #header>
          <q-item-section>{{ rule.title }}</q-item-section>
          <q-item-section side>
            <q-icon name="more_vert" v-ripple>
              <q-menu>
                <q-list style="min-width: 150px">
                  <q-item clickable v-close-popup>
                    <q-item-section>Изменить</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section @click="deleteRuleById(rule.id)">Удалить</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            {{ rule.description }}
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
    <div v-else class="text-center text-h6">Список пуст</div>
  </div>

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
    <q-card class="column" style="min-width: 40vw;">
      <q-card-section>
        <div class="text-h6">Создать</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input v-model="editingRule.ruleTitle" label="Название" />
        <q-input v-model="editingRule.ruleDescription" label="Описание" autogrow />
      </q-card-section>
      <q-space />
      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" v-close-popup />
        <q-btn @click="addNewRule" flat label="Сохранить" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {api} from "../../boot/axios";

export default{
  data () {
    return {
      rulesList: [],
      editingRules: false,
      editingRule: {
        ruleTitle: '',
        ruleDescription: '',
      },
      loading: false,
    }
  },
  mounted () {
    this.loading = true;
    this.load();
  },
  methods: {
    async load () {
      await this.getAllRules();
      this.loading = false;
    },
    async getAllRules () {
      await this.$api.get('/rules').then(res => {
        this.rulesList = res.data;
      });
    },
    clearFields () {
      this.editingRule.ruleTitle = '';
      this.editingRule.ruleDescription = '';
    },
    async addNewRule () {
      await this.$api.post('/rules', this.editingRule);
      this.clearFields();
      await this.getAllRules();
    },
    async deleteRuleById (id) {
      this.$q.dialog({
        title: 'Подтверждение',
        message: 'Вы уверены, что хотите удалить правило?',
        persistent: true,
        ok: {
          label: 'Подтвердить',
        },
        cancel: {
          label: 'Отмена',

        },
      }).onOk(async () => {
        const data = await api.delete('/rules', { params: { ruleId: id } }).then(res => res.data);
        if (data) {
          await this.getAllRules();
        }
      });
    },
  },
};
</script>

<style scoped>

</style>
