const express = require('express');
const router = express.Router();
const { listarCategorias, criarCategoria } = require('../controllers/categoriasController');

router.get('/', listarCategorias);
router.post('/', criarCategoria);

module.exports = router;