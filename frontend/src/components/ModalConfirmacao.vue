<script setup>
defineProps({
  mensagem: String,
});
const emit = defineEmits(['confirmar', 'fechar']);
</script>

<template>
  <div class="modal-fundo" @click.self="emit('fechar')">
    <div class="modal modal-pequeno">
      <h2>Confirmar remoção</h2>
      <p>{{ mensagem }}</p>
      <div class="modal-acoes">
        <button class="btn btn-neutro" @click="emit('fechar')">Cancelar</button>
        <button class="btn btn-perigo" @click="emit('confirmar')">Remover</button>
      </div>
    </div>
  </div>
</template>