<script setup>
defineProps({
  mensagem: String,
  tipo: String, // 'sucesso' ou 'erro'
});
</script>

<template>
  <Transition name="toast">
    <div v-if="mensagem" class="toast" :class="tipo === 'erro' ? 'toast-erro' : 'toast-sucesso'">
      {{ mensagem }}
    </div>
  </Transition>
</template>