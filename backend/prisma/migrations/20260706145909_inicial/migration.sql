-- CreateTable
CREATE TABLE "autores" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "autores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livros" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "estoque" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "autor_id" INTEGER NOT NULL,
    "categoria_id" INTEGER NOT NULL,

    CONSTRAINT "livros_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "livros_isbn_key" ON "livros"("isbn");

-- AddForeignKey
ALTER TABLE "livros" ADD CONSTRAINT "livros_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "autores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livros" ADD CONSTRAINT "livros_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
