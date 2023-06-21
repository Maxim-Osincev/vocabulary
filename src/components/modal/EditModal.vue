<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value')"
    @keydown.enter="emitAction"
  >
    <q-card class="full-width" style="max-width: 500px;">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          v-model="inputValue"
          :label="label"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отменить" v-close-popup />
        <q-btn flat label="Сохранить" color="primary" @click="emitAction" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const inputValue = ref('');
const props = defineProps([
  'label',
  'title',
  'action',
  'modelValue',
]);
const emit = defineEmits(['update:model-value']);

const emitAction = () => {
  emit(props.action, inputValue.value);
  inputValue.value = '';
};

</script>

<style scoped>

</style>
