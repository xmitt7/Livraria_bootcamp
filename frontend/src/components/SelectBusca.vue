<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  opcoes: Array,        // lista de { id, nome }
  modelValue: [String, Number],
  placeholder: String,
});

const emit = defineEmits(['update:modelValue']);

const texto = ref('');
const aberto = ref(false);

// filtra as opções conforme o que foi digitado
const opcoesFiltradas = computed(() => {
  if (!texto.value) return props.opcoes;
  return props.opcoes.filter((o) =>
    o.nome.toLowerCase().includes(texto.value.toLowerCase())
  );
});

// quando o valor externo muda (ex: limpar filtros), sincroniza o texto
watch(
  () => props.modelValue,
  (novo) => {
    if (!novo) {
      texto.value = '';
      return;
    }
    const opcao = props.opcoes.find((o) => o.id === Number(novo));
    if (opcao) texto.value = opcao.nome;
  }
);

function selecionar(opcao) {
  texto.value = opcao.nome;
  aberto.value = false;
  emit('update:modelValue', opcao.id);
}

function limparSelecao() {
  texto.value = '';
  aberto.value = false;
  emit('update:modelValue', '');
}

function aoDigitar() {
  aberto.value = true;
  // se apagou tudo, limpa a seleção
  if (texto.value === '') emit('update:modelValue', '');
}

function aoSairDoCampo() {
  // pequeno atraso pra dar tempo do clique na opção registrar
  setTimeout(() => (aberto.value = false), 150);
}
</script>

<template>
  <div class="select-busca">
    <input
      v-model="texto"
      type="text"
      :placeholder="placeholder"
      @input="aoDigitar"
      @focus="aberto = true"
      @blur="aoSairDoCampo"
    />
    <button
      v-if="texto"
      type="button"
      class="limpar-x"
      @mousedown.prevent="limparSelecao"
    >×</button>

    <ul v-if="aberto && opcoesFiltradas.length > 0" class="opcoes">
      <li
        v-for="opcao in opcoesFiltradas"
        :key="opcao.id"
        @mousedown.prevent="selecionar(opcao)"
      >
        {{ opcao.nome }}
      </li>
    </ul>

    <ul v-else-if="aberto && texto" class="opcoes">
      <li class="sem-resultado">Nenhum resultado</li>
    </ul>
  </div>
</template>