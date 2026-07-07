const prisma = require('../src/prismaClient');

async function main() {
  // Autores de exemplo
  await prisma.autor.createMany({
    data: [
      { nome: 'Machado de Assis' },
      { nome: 'Clarice Lispector' },
      { nome: 'Jorge Amado' },
      { nome: 'J.R.R. Tolkien' },
    ],
    skipDuplicates: true,
  });

  // Categorias de exemplo
  await prisma.categoria.createMany({
    data: [
      { nome: 'Romance' },
      { nome: 'Fantasia' },
      { nome: 'Ficção Científica' },
      { nome: 'Biografia' },
    ],
    skipDuplicates: true,
  });

  // Busca os autores e categorias pelos nomes para pegar os IDs corretos
  const machado = await prisma.autor.findFirst({ where: { nome: 'Machado de Assis' } });
  const clarice = await prisma.autor.findFirst({ where: { nome: 'Clarice Lispector' } });
  const jorge = await prisma.autor.findFirst({ where: { nome: 'Jorge Amado' } });
  const tolkien = await prisma.autor.findFirst({ where: { nome: 'J.R.R. Tolkien' } });

  const romance = await prisma.categoria.findFirst({ where: { nome: 'Romance' } });
  const fantasia = await prisma.categoria.findFirst({ where: { nome: 'Fantasia' } });

  // Livros de exemplo (só cria se o ISBN ainda não existir)
  const livros = [
    {
      titulo: 'Dom Casmurro',
      isbn: '978-8535910663',
      preco: 39.90,
      estoque: 12,
      autorId: machado.id,
      categoriaId: romance.id,
    },
    {
      titulo: 'A Hora da Estrela',
      isbn: '978-8520925829',
      preco: 34.50,
      estoque: 4,
      autorId: clarice.id,
      categoriaId: romance.id,
    },
    {
      titulo: 'Capitães da Areia',
      isbn: '978-8535914085',
      preco: 42.00,
      estoque: 0,
      autorId: jorge.id,
      categoriaId: romance.id,
    },
    {
      titulo: 'O Hobbit',
      isbn: '978-8595084742',
      preco: 49.90,
      estoque: 10,
      autorId: tolkien.id,
      categoriaId: fantasia.id,
    },
  ];

  for (const livro of livros) {
    const jaExiste = await prisma.livro.findUnique({ where: { isbn: livro.isbn } });
    if (!jaExiste) {
      await prisma.livro.create({ data: livro });
    }
  }

  console.log('Seed concluído: autores, categorias e livros de exemplo inseridos.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });