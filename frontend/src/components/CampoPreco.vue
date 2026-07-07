<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
});

const emit = defineEmits(['update:modelValue']);

const texto = ref('');

// formata um número para o padrão brasileiro (1234.5 -> "1.234,50")
function formatar(valor) {
  if (valor === '' || valor === null || valor === undefined) return '';
  return Number(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// converte o texto digitado para número (aceita "30,30", "1.234,50", "30.30")
function paraNumero(str) {
  if (!str) return '';
  const limpo = str
    .replace(/[^\d.,]/g, '')   // remove tudo que não é dígito, ponto ou vírgula
    .replace(/\./g, '')        // remove pontos de milhar
    .replace(',', '.');        // vírgula decimal vira ponto
  const n = Number(limpo);
  return isNaN(n) ? '' : n;
}

// sincroniza quando o valor vem de fora (ex: abrir modal de edição)
watch(
  () => props.modelValue,
  (novo) => {
    // evita reformatar enquanto o usuário digita o mesmo valor
    if (paraNumero(texto.value) !== Number(novo)) {
      texto.value = formatar(novo);
    }
  },
  { immediate: true }
);

function aoDigitar() {
  emit('update:modelValue', paraNumero(texto.value));
}

// ao sair do campo, arruma a formatação (ex: "30,3" vira "30,30")
function aoSair() {
  const n = paraNumero(texto.value);
  texto.value = n === '' ? '' : formatar(n);
}
</script>

<template>
  <div class="campo-preco">
    <span class="prefixo">R$</span>
    <input
      v-model="texto"
      type="text"
      inputmode="decimal"
      placeholder="0,00"
      @input="aoDigitar"
      @blur="aoSair"
    />
  </div>
</template>