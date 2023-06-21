<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value')"
    @keydown.enter="emitAction"
    persistent
  >
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">{{ text }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" v-close-popup />
        <q-btn flat label="Подтвердить" color="primary" v-close-popup @click="emitAction" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
const props = defineProps([
  'text',
  'action',
  'modelValue',
]);
const emit = defineEmits(['update:model-value']);

const emitAction = () => {
  emit(props.action);
};
</script>

<style scoped>

</style>
