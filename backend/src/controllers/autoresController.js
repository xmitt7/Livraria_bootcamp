const prisma = require('../prismaClient');

// GET /autores — lista todos os autores
async function listarAutores(req, res) {
  try {
    const autores = await prisma.autor.findMany({
      orderBy: { nome: 'asc' },
    });
    res.json(autores);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível listar os autores.' });
  }
}

// POST /autores — cria um autor
async function criarAutor(req, res) {
  try {
    const { nome } = req.body;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ erro: 'O nome do autor é obrigatório.' });
    }

    const autor = await prisma.autor.create({
      data: { nome: nome.trim() },
    });
    res.status(201).json(autor);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível criar o autor.' });
  }
}

module.exports = { listarAutores, criarAutor };