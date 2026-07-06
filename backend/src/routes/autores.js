const express = require('express');
const router = express.Router();
const { listarAutores, criarAutor } = require('../controllers/autoresController');

router.get('/', listarAutores);
router.post('/', criarAutor);

module.exports = router;