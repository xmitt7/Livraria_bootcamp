<script setup>
import { ref, watch } from 'vue';
import SelectBusca from './SelectBusca.vue';
import ModalRapido from './ModalRapido.vue';
import CampoPreco from './CampoPreco.vue';

const props = defineProps({
  livro: Object,        // null = cadastro; objeto = edição
  autores: Array,
  categorias: Array,
});

const emit = defineEmits(['salvar', 'fechar', 'criar-autor', 'criar-categoria']);

const form = ref({
  titulo: '',
  isbn: '',
  preco: '',
  estoque: '',
  autorId: '',
  categoriaId: '',
});

const salvando = ref(false);
const erroLocal = ref('');
const modalRapido = ref(null); // null | 'autor' | 'categoria'

// se veio um livro (edição), preenche o formulário
watch(
  () => props.livro,
  (livro) => {
    if (livro) {
      form.value = {
        titulo: livro.titulo,
        isbn: livro.isbn,
        preco: livro.preco,
        estoque: livro.estoque,
        autorId: livro.autorId,
        categoriaId: livro.categoriaId,
      };
    }
  },
  { immediate: true }
);

// validação no front (RNF07 — além da do backend)
function validar() {
  if (!form.value.titulo.trim()) return 'O título é obrigatório.';
  if (!form.value.isbn.trim()) return 'O ISBN é obrigatório.';
  if (form.value.isbn.trim().startsWith('-'))
    return 'O ISBN não pode ser negativo.';
  if (!form.value.preco || Number(form.value.preco) <= 0)
    return 'O preço deve ser maior que zero.';
  if (form.value.estoque === '' || Number(form.value.estoque) < 0)
    return 'O estoque não pode ser negativo.';
  if (!form.value.autorId) return 'Selecione um autor.';
  if (!form.value.categoriaId) return 'Selecione uma categoria.';
  return '';
}
function filtrarIsbn() {
  form.value.isbn = form.value.isbn
    .replace(/[^0-9-]/g, '')   // só dígitos e hífens
    .replace(/^-+/, '');        // remove hífens do início
}

async function confirmar() {
  erroLocal.value = validar();
  if (erroLocal.value) return;

  salvando.value = true;
  await emit('salvar', { ...form.value });
  salvando.value = false;
}

// cadastro rápido: repassa pro App e seleciona o novo item automaticamente
async function salvarRapido(nome) {
  if (modalRapido.value === 'autor') {
    const novo = await new Promise((resolve) => emit('criar-autor', nome, resolve));
    if (novo) form.value.autorId = novo.id;
  } else {
    const novo = await new Promise((resolve) => emit('criar-categoria', nome, resolve));
    if (novo) form.value.categoriaId = novo.id;
  }
  modalRapido.value = null;
}
</script>

<template>
  <div class="modal-fundo" @click.self="emit('fechar')">
    <div class="modal">
      <h2>{{ livro ? 'Editar Livro' : 'Novo Livro' }}</h2>

      <p v-if="erroLocal" class="erro-form">{{ erroLocal }}</p>

      <label>Título *</label>
      <input v-model="form.titulo" type="text" placeholder="Título do livro" />

      <label>ISBN *</label>
      <input
          v-model="form.isbn"
         type="text"
         placeholder="ISBN-10 ou ISBN-13"
         @input="filtrarIsbn"
      />

      <div class="linha-dupla">
        <div>
            <label>Preço (R$) *</label>
            <CampoPreco v-model="form.preco" />
        </div>
        <div>
          <label>Estoque *</label>
          <input v-model="form.estoque" type="number" min="0" placeholder="0" />
        </div>
      </div>

      <label>Autor *</label>
      <div class="campo-com-botao">
        <SelectBusca v-model="form.autorId" :opcoes="autores" placeholder="Buscar autor..." />
        <button type="button" class="btn btn-secundario btn-mini" @click="modalRapido = 'autor'">
          + Novo
        </button>
      </div>

      <label>Categoria *</label>
      <div class="campo-com-botao">
        <SelectBusca v-model="form.categoriaId" :opcoes="categorias" placeholder="Buscar categoria..." />
        <button type="button" class="btn btn-secundario btn-mini" @click="modalRapido = 'categoria'">
          + Novo
        </button>
      </div>

      <div class="modal-acoes">
        <button class="btn btn-neutro" @click="emit('fechar')">Cancelar</button>
        <button class="btn btn-primario" :disabled="salvando" @click="confirmar">
          {{ salvando ? 'Salvando...' : livro ? 'Salvar alterações' : 'Cadastrar' }}
        </button>
      </div>
    </div>

    <ModalRapido
      v-if="modalRapido"
      :titulo="modalRapido === 'autor' ? 'Novo Autor' : 'Nova Categoria'"
      @salvar="salvarRapido"
      @fechar="modalRapido = null"
    />
  </div>
</template>