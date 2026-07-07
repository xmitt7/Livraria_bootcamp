<script setup>
import { ref } from 'vue';
import SelectBusca from './SelectBusca.vue';

const props = defineProps({
  autores: Array,
  categorias: Array,
});

const emit = defineEmits(['filtrar']);

const busca = ref('');
const autorId = ref('');
const categoriaId = ref('');

function aplicar() {
  emit('filtrar', {
    busca: busca.value,
    autorId: autorId.value,
    categoriaId: categoriaId.value,
  });
}

function limpar() {
  busca.value = '';
  autorId.value = '';
  categoriaId.value = '';
  aplicar();
}
</script>

<template>
  <div class="filtros">
    <input
      v-model="busca"
      type="text"
      placeholder="Pesquisar por título ou ISBN..."
      class="campo-busca"
      @keyup.enter="aplicar"
    />

    <SelectBusca
      v-model="autorId"
      :opcoes="autores"
      placeholder="Filtrar por autor..."
      @update:modelValue="aplicar"
    />

    <SelectBusca
      v-model="categoriaId"
      :opcoes="categorias"
      placeholder="Filtrar por categoria..."
      @update:modelValue="aplicar"
    />

    <button class="btn btn-secundario" @click="aplicar">Pesquisar</button>
    <button class="btn btn-neutro" @click="limpar">Limpar</button>
  </div>
</template>