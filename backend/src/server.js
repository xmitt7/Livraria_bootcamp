const express = require('express');
const cors = require('cors');
const autoresRouter = require('./routes/autores');
const categoriasRouter = require('./routes/categorias');
const livrosRouter = require('./routes/livros');


const app = express();

app.use(cors());
app.use(express.json());

// rota de teste — confirma que o servidor está no ar
app.get('/', (req, res) => {
  res.json({ mensagem: 'API da Livraria está funcionando!' });
});

// rotas de autores
app.use('/autores', autoresRouter);
// rotas de categorias
app.use('/categorias', categoriasRouter);
// rotas de livros
app.use('/livros', livrosRouter);

const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});