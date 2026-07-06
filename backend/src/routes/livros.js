const express = require('express');
const router = express.Router();
const {
  listarLivros,
  obterLivro,
  criarLivro,
  atualizarLivro,
  inativarLivro,
} = require('../controllers/livrosController');

router.get('/', listarLivros);
router.get('/:id', obterLivro);
router.post('/', criarLivro);
router.put('/:id', atualizarLivro);
router.delete('/:id', inativarLivro);

module.exports = router;