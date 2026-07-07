<script setup>
import { ref } from 'vue';

const props = defineProps({
  titulo: String, // "Novo Autor" ou "Nova Categoria"
});

const emit = defineEmits(['salvar', 'fechar']);

const nome = ref('');
const salvando = ref(false);

async function confirmar() {
  if (!nome.value.trim()) return;
  salvando.value = true;
  await emit('salvar', nome.value.trim());
  salvando.value = false;
}
</script>

<template>
  <div class="modal-fundo" @click.self="emit('fechar')">
    <div class="modal modal-pequeno">
      <h2>{{ titulo }}</h2>
      <input
        v-model="nome"
        type="text"
        placeholder="Nome..."
        @keyup.enter="confirmar"
        autofocus
      />
      <div class="modal-acoes">
        <button class="btn btn-neutro" @click="emit('fechar')">Cancelar</button>
        <button class="btn btn-primario" :disabled="salvando" @click="confirmar">
          {{ salvando ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>
  </div>
</template>