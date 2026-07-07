<script setup>
import { ref, onMounted } from 'vue';
import api from './services/api';
import BarraFiltros from './components/BarraFiltros.vue';
import ListaLivros from './components/ListaLivros.vue';
import Toast from './components/Toast.vue';

const livros = ref([]);
const autores = ref([]);
const categorias = ref([]);
const carregando = ref(false);
const filtrosAtuais = ref({});

// Toast
const toastMensagem = ref('');
const toastTipo = ref('sucesso');
let toastTimer = null;

function mostrarToast(mensagem, tipo = 'sucesso') {
  toastMensagem.value = mensagem;
  toastTipo.value = tipo;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toastMensagem.value = ''), 3500);
}

// Carregamento de dados
async function carregarLivros(filtros = filtrosAtuais.value) {
  filtrosAtuais.value = filtros;
  carregando.value = true;
  try {
    const params = {};
    if (filtros.busca) params.busca = filtros.busca;
    if (filtros.autorId) params.autorId = filtros.autorId;
    if (filtros.categoriaId) params.categoriaId = filtros.categoriaId;

    const resposta = await api.get('/livros', { params });
    livros.value = resposta.data;
  } catch (erro) {
    mostrarToast(erro.response?.data?.erro || 'Não foi possível carregar os livros.', 'erro');
  } finally {
    carregando.value = false;
  }
}

async function carregarAutoresECategorias() {
  try {
    const [ra, rc] = await Promise.all([api.get('/autores'), api.get('/categorias')]);
    autores.value = ra.data;
    categorias.value = rc.data;
  } catch (erro) {
    mostrarToast('Não foi possível carregar autores e categorias.', 'erro');
  }
}

onMounted(() => {
  carregarLivros();
  carregarAutoresECategorias();
});

// Ações (Leva 2 — por enquanto placeholders)
function novoLivro() {
  mostrarToast('Cadastro em construção (Leva 2).', 'erro');
}
function editarLivro(livro) {
  mostrarToast(`Edição de "${livro.titulo}" em construção.`, 'erro');
}
function removerLivro(livro) {
  mostrarToast(`Remoção de "${livro.titulo}" em construção.`, 'erro');
}
</script>

<template>
  <div class="container">
    <header class="cabecalho">
      <h1>📚 Livraria Sabitiruc's</h1>
      <button class="btn btn-primario" @click="novoLivro">+ Novo Livro</button>
    </header>

    <BarraFiltros
      :autores="autores"
      :categorias="categorias"
      @filtrar="carregarLivros"
    />

    <ListaLivros
      :livros="livros"
      :carregando="carregando"
      @editar="editarLivro"
      @remover="removerLivro"
    />

    <Toast :mensagem="toastMensagem" :tipo="toastTipo" />
  </div>
</template>