<script setup>
import { ref, onMounted } from 'vue';
import api from './services/api';
import BarraFiltros from './components/BarraFiltros.vue';
import ListaLivros from './components/ListaLivros.vue';
import ModalLivro from './components/ModalLivro.vue';
import ModalConfirmacao from './components/ModalConfirmacao.vue';
import Toast from './components/Toast.vue';

const livros = ref([]);
const autores = ref([]);
const categorias = ref([]);
const carregando = ref(false);
const filtrosAtuais = ref({});

// modais
const modalLivroAberto = ref(false);
const livroEmEdicao = ref(null);
const livroParaRemover = ref(null);

// toast
const toastMensagem = ref('');
const toastTipo = ref('sucesso');
let toastTimer = null;

function mostrarToast(mensagem, tipo = 'sucesso') {
  toastMensagem.value = mensagem;
  toastTipo.value = tipo;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toastMensagem.value = ''), 3500);
}

// ---- carregamento ----
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

// ---- livro: novo / editar / salvar ----
function novoLivro() {
  livroEmEdicao.value = null;
  modalLivroAberto.value = true;
}

function editarLivro(livro) {
  livroEmEdicao.value = livro;
  modalLivroAberto.value = true;
}

async function salvarLivro(dados) {
  try {
    if (livroEmEdicao.value) {
      const r = await api.put(`/livros/${livroEmEdicao.value.id}`, dados);
      mostrarToast(r.data.mensagem || 'Livro atualizado com sucesso.');
    } else {
      const r = await api.post('/livros', dados);
      mostrarToast(r.data.mensagem || 'Livro cadastrado com sucesso.');
    }
    modalLivroAberto.value = false;
    carregarLivros();
  } catch (erro) {
    mostrarToast(erro.response?.data?.erro || 'Não foi possível concluir a operação.', 'erro');
  }
}

// ---- remoção ----
function pedirRemocao(livro) {
  livroParaRemover.value = livro;
}

async function confirmarRemocao() {
  try {
    const r = await api.delete(`/livros/${livroParaRemover.value.id}`);
    mostrarToast(r.data.mensagem || 'Livro removido com sucesso.');
    livroParaRemover.value = null;
    carregarLivros();
  } catch (erro) {
    mostrarToast(erro.response?.data?.erro || 'Não foi possível remover o livro.', 'erro');
  }
}

// ---- cadastro rápido de autor/categoria ----
async function criarAutor(nome, resolve) {
  try {
    const r = await api.post('/autores', { nome });
    autores.value.push(r.data);
    autores.value.sort((a, b) => a.nome.localeCompare(b.nome));
    mostrarToast('Autor cadastrado com sucesso.');
    resolve(r.data);
  } catch (erro) {
    mostrarToast(erro.response?.data?.erro || 'Não foi possível criar o autor.', 'erro');
    resolve(null);
  }
}

async function criarCategoria(nome, resolve) {
  try {
    const r = await api.post('/categorias', { nome });
    categorias.value.push(r.data);
    categorias.value.sort((a, b) => a.nome.localeCompare(b.nome));
    mostrarToast('Categoria cadastrada com sucesso.');
    resolve(r.data);
  } catch (erro) {
    mostrarToast(erro.response?.data?.erro || 'Não foi possível criar a categoria.', 'erro');
    resolve(null);
  }
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
      @remover="pedirRemocao"
    />

    <ModalLivro
      v-if="modalLivroAberto"
      :livro="livroEmEdicao"
      :autores="autores"
      :categorias="categorias"
      @salvar="salvarLivro"
      @fechar="modalLivroAberto = false"
      @criar-autor="criarAutor"
      @criar-categoria="criarCategoria"
    />

    <ModalConfirmacao
      v-if="livroParaRemover"
      :mensagem="`Deseja remover o livro '${livroParaRemover.titulo}'?`"
      @confirmar="confirmarRemocao"
      @fechar="livroParaRemover = null"
    />

    <Toast :mensagem="toastMensagem" :tipo="toastTipo" />
  </div>
</template>