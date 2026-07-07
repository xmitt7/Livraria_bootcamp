const prisma = require('../prismaClient');

// Função auxiliar de validação — reaproveitada no cadastro e na edição
function validarDadosLivro(dados) {
  const { titulo, isbn, preco, estoque, autorId, categoriaId } = dados;
  const erros = [];

  if (!titulo || titulo.trim() === '') erros.push('O título é obrigatório.');
  if (!isbn || isbn.trim() === '') erros.push('O ISBN é obrigatório.');
  if (isbn && !/^[0-9][0-9-]*$/.test(isbn.trim()))
    erros.push('O ISBN deve conter apenas números e hífens.');
  if (preco === undefined || preco === null || Number(preco) <= 0)
    erros.push('O preço deve ser maior que zero.');
  if (estoque === undefined || estoque === null || Number(estoque) < 0)
    erros.push('O estoque não pode ser negativo.');
  if (!autorId) erros.push('O autor é obrigatório.');
  if (!categoriaId) erros.push('A categoria é obrigatória.');

  return erros;
}

// GET /livros — lista livros ativos, com busca e filtros
async function listarLivros(req, res) {
  try {
    const { busca, autorId, categoriaId } = req.query;

    const where = { ativo: true };

    // busca por título OU ISBN
    if (busca) {
      where.OR = [
        { titulo: { contains: busca, mode: 'insensitive' } },
        { isbn: { contains: busca, mode: 'insensitive' } },
      ];
    }

    // filtros
    if (autorId) where.autorId = Number(autorId);
    if (categoriaId) where.categoriaId = Number(categoriaId);

    const livros = await prisma.livro.findMany({
      where,
      include: { autor: true, categoria: true },
      orderBy: { criadoEm: 'desc' },
    });

    res.json(livros);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível listar os livros.' });
  }
}

// GET /livros/:id — visualiza um livro
async function obterLivro(req, res) {
  try {
    const id = Number(req.params.id);
    const livro = await prisma.livro.findUnique({
      where: { id },
      include: { autor: true, categoria: true },
    });

    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado.' });
    }
    res.json(livro);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível obter o livro.' });
  }
}

// POST /livros — cadastra um livro
async function criarLivro(req, res) {
  try {
    const erros = validarDadosLivro(req.body);
    if (erros.length > 0) {
      return res.status(400).json({ erro: erros.join(' ') });
    }

    const { titulo, isbn, preco, estoque, autorId, categoriaId } = req.body;

    // RN01 — ISBN único
    const jaExiste = await prisma.livro.findUnique({ where: { isbn: isbn.trim() } });
    if (jaExiste) {
      return res.status(409).json({ erro: 'ISBN já cadastrado.' });
    }

    const livro = await prisma.livro.create({
      data: {
        titulo: titulo.trim(),
        isbn: isbn.trim(),
        preco: Number(preco),
        estoque: Number(estoque),
        autorId: Number(autorId),
        categoriaId: Number(categoriaId),
      },
      include: { autor: true, categoria: true },
    });

    res.status(201).json({ mensagem: 'Livro cadastrado com sucesso.', livro });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível cadastrar o livro.' });
  }
}

// PUT /livros/:id — edita um livro
async function atualizarLivro(req, res) {
  try {
    const id = Number(req.params.id);

    const erros = validarDadosLivro(req.body);
    if (erros.length > 0) {
      return res.status(400).json({ erro: erros.join(' ') });
    }

    const { titulo, isbn, preco, estoque, autorId, categoriaId } = req.body;

    // RN01 — ISBN único, mas permitindo manter o do próprio livro
    const outroComMesmoIsbn = await prisma.livro.findFirst({
      where: { isbn: isbn.trim(), NOT: { id } },
    });
    if (outroComMesmoIsbn) {
      return res.status(409).json({ erro: 'ISBN já cadastrado em outro livro.' });
    }

    const livro = await prisma.livro.update({
      where: { id },
      data: {
        titulo: titulo.trim(),
        isbn: isbn.trim(),
        preco: Number(preco),
        estoque: Number(estoque),
        autorId: Number(autorId),
        categoriaId: Number(categoriaId),
      },
      include: { autor: true, categoria: true },
    });

    res.json({ mensagem: 'Livro atualizado com sucesso.', livro });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível atualizar o livro.' });
  }
}

// DELETE /livros/:id — inativa um livro (inativação lógica, RN08)
async function inativarLivro(req, res) {
  try {
    const id = Number(req.params.id);

    await prisma.livro.update({
      where: { id },
      data: { ativo: false },
    });

    res.json({ mensagem: 'Livro removido com sucesso.' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível remover o livro.' });
  }
}

module.exports = {
  listarLivros,
  obterLivro,
  criarLivro,
  atualizarLivro,
  inativarLivro,
};