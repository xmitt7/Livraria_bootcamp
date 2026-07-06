const prisma = require('../prismaClient');

async function listarCategorias(req, res) {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
    });
    res.json(categorias);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível listar as categorias.' });
  }
}

async function criarCategoria(req, res) {
  try {
    const { nome } = req.body;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ erro: 'O nome da categoria é obrigatório.' });
    }

    const categoria = await prisma.categoria.create({
      data: { nome: nome.trim() },
    });
    res.status(201).json(categoria);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível criar a categoria.' });
  }
}

module.exports = { listarCategorias, criarCategoria };