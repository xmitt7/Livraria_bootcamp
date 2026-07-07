<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
});

const emit = defineEmits(['update:modelValue']);

const texto = ref('');

// formata um número para o padrão brasileiro (1399.9 -> "1.399,90")
function formatar(valor) {
  if (valor === '' || valor === null || valor === undefined) return '';
  return Number(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// extrai só os dígitos e converte em valor (centavos -> reais)
function digitosParaNumero(str) {
  const digitos = str.replace(/\D/g, ''); // remove tudo que não é dígito
  if (!digitos) return '';
  return Number(digitos) / 100;
}

// sincroniza quando o valor vem de fora (ex: abrir modal de edição)
watch(
  () => props.modelValue,
  (novo) => {
    const atual = digitosParaNumero(texto.value);
    if (atual !== Number(novo)) {
      texto.value = formatar(novo);
    }
  },
  { immediate: true }
);

function aoDigitar() {
  const numero = digitosParaNumero(texto.value);
  texto.value = numero === '' ? '' : formatar(numero);
  emit('update:modelValue', numero);
}
</script>

<template>
  <div class="campo-preco">
    <span class="prefixo">R$</span>
    <input
      v-model="texto"
      type="text"
      inputmode="numeric"
      placeholder="0,00"
      @input="aoDigitar"
    />
  </div>
</template>