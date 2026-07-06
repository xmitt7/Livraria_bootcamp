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

  console.log('Seed concluído: autores e categorias inseridos.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });