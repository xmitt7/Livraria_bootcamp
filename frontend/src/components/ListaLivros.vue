<script setup>
defineProps({
  livros: Array,
  carregando: Boolean,
});

const emit = defineEmits(['editar', 'remover']);

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function classeEstoque(qtd) {
  if (qtd === 0) return 'estoque-zero';
  if (qtd <= 5) return 'estoque-baixo';
  return 'estoque-ok';
}
</script>

<template>
  <div>
    <p v-if="carregando" class="aviso">Carregando livros...</p>

    <p v-else-if="livros.length === 0" class="aviso">
      Nenhum livro encontrado.
    </p>

    <template v-else>
      <!-- Tabela (telas grandes) -->
      <table class="tabela">
        <thead>
          <tr>
            <th>Título</th>
            <th>ISBN</th>
            <th>Autor</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="livro in livros" :key="livro.id">
            <td>{{ livro.titulo }}</td>
            <td>{{ livro.isbn }}</td>
            <td>{{ livro.autor.nome }}</td>
            <td>{{ livro.categoria.nome }}</td>
            <td>{{ formatarPreco(livro.preco) }}</td>
            <td>
              <span class="badge" :class="classeEstoque(livro.estoque)">
                {{ livro.estoque }} un.
              </span>
            </td>
            <td class="acoes">
              <button class="btn btn-mini" @click="emit('editar', livro)">Editar</button>
              <button class="btn btn-mini btn-perigo" @click="emit('remover', livro)">Remover</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Cards (telas pequenas) -->
      <div class="cards">
        <div v-for="livro in livros" :key="livro.id" class="card">
          <h3>{{ livro.titulo }}</h3>
          <p><strong>ISBN:</strong> {{ livro.isbn }}</p>
          <p><strong>Autor:</strong> {{ livro.autor.nome }}</p>
          <p><strong>Categoria:</strong> {{ livro.categoria.nome }}</p>
          <p><strong>Preço:</strong> {{ formatarPreco(livro.preco) }}</p>
          <p>
            <strong>Estoque:</strong>
            <span class="badge" :class="classeEstoque(livro.estoque)">
              {{ livro.estoque }} un.
            </span>
          </p>
          <div class="acoes">
            <button class="btn btn-mini" @click="emit('editar', livro)">Editar</button>
            <button class="btn btn-mini btn-perigo" @click="emit('remover', livro)">Remover</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>