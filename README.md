# 📚 Livraria Sabitiruc's — Sistema de Gerenciamento de Catálogo

Sistema web para gerenciamento básico do catálogo de livros de uma livraria,
desenvolvido como Projeto de Treino da **Freeline Informática**.

Permite cadastrar, consultar, editar e inativar livros, com pesquisa por
título/ISBN, filtros por autor e categoria e controle de estoque.

## 🛠 Tecnologias

- **Front-end:** Vue 3 + Vite, Axios, CSS puro
- **Back-end:** Node.js + Express (JavaScript, CommonJS)
- **ORM:** Prisma 6
- **Banco de dados:** PostgreSQL 16
- **Infraestrutura:** Docker e Docker Compose
- **Controle de versão:** Git

## 🚀 Como executar o projeto

### Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado
  e em execução (no Windows, com WSL 2 habilitado)
- [Git](https://git-scm.com/) instalado

### 1. Clonar o repositório

```bash
git clone <https://github.com/xmitt7/Livraria_bootcamp>
cd Livraria_bootcamp
```

### 2. Variáveis de ambiente

**Para execução via Docker, nenhuma configuração é necessária** —
as variáveis já estão definidas no `docker-compose.yml`.

*(Opcional)* Para desenvolvimento local fora do Docker, crie um arquivo `.env`
dentro de `backend/` com:

```
DATABASE_URL="postgresql://livraria:livraria123@localhost:5433/livraria?schema=public"
```

### 3. Iniciar os contêineres

Na raiz do projeto:

```bash
docker compose up -d --build
```

Isso inicia três contêineres:

| Serviço  | Descrição                    | Porta                  |
|----------|------------------------------|------------------------|
| db       | PostgreSQL 16                | 5433 (host) → 5432     |
| backend  | API Node.js/Express          | 3000                   |
| frontend | Interface Vue 3 (via nginx)  | 8080                   |

### 4. Banco de dados (automático)

**Não é necessário nenhum passo manual.** Ao iniciar, o contêiner do backend:

1. Aplica as migrations do Prisma (cria/atualiza as tabelas);
2. Executa o seed, inserindo autores, categorias e 4 livros de exemplo;
3. Inicia o servidor da API.

O seed é idempotente: pode ser executado várias vezes sem duplicar dados.

### 5. Acessar a aplicação

- **Interface web:** http://localhost:8080
- **API:** http://localhost:3000

### Comandos úteis

```bash
docker compose ps                        # ver status dos contêineres
docker compose logs backend --tail 30    # ver logs da API
docker compose down                      # parar (mantém os dados)
docker compose down -v                   # parar e APAGAR os dados
```

## 🧠 Decisões técnicas

- **Inativação lógica (RN08):** optou-se por inativar livros (campo booleano
  `ativo`) em vez de excluí-los permanentemente. Preserva o histórico, evita
  problemas de integridade referencial e permite reativação futura. Livros
  inativos não aparecem na listagem.
- **Prisma 6 (não 7):** o Prisma 7 (nov/2025) introduziu mudanças incompatíveis
  (ESM obrigatório, driver adapter, nova configuração) e ainda tem pouco
  material de apoio. A versão 6 é estável e amplamente documentada.
- **Porta 5433 para o PostgreSQL (host):** evita conflito com instalações
  locais do PostgreSQL, que ocupam a porta 5432 padrão.
- **Backend em camadas:** rotas (definem endpoints) separadas dos controllers
  (lógica e acesso a dados), com cliente Prisma centralizado.
- **Unicidade no banco:** ISBN de livro, nome de autor e nome de categoria
  possuem restrição `UNIQUE`, garantindo integridade na origem dos dados.
- **Validações em duas camadas (RNF07):** o backend valida todas as regras de
  negócio (fonte da verdade); o frontend valida antes do envio para melhor
  experiência do usuário.
- **Preço em formato brasileiro:** o campo de preço aceita vírgula como
  separador decimal (ex: 39,90), convertendo internamente para o formato
  numérico da API.
- **ISBN sem validação de formato:** ISBN-10 e ISBN-13 são aceitos como texto
  livre. Validou-se apenas obrigatoriedade e unicidade (RN01/RN02), conforme o
  escopo. Validação estrutural de ISBN foi considerada fora do escopo do prazo.
- **Migrations e seed automáticos no contêiner:** o backend aplica
  `prisma migrate deploy` e o seed na inicialização, eliminando passos manuais.
- **Cadastro contextual de autor/categoria:** decidiu-se que autores e
  categorias são cadastrados apenas no contexto do cadastro/edição de um
  livro (botão "+ Novo" ao lado dos campos do formulário), e não em telas
  separadas. Justificativa: não faz sentido no domínio criar um autor ou uma
  categoria sem um livro associado — isso geraria registros "órfãos" no
  catálogo. O novo autor/categoria criado já fica selecionado
  automaticamente no formulário. O requisito RF02/RF03 ("cadastro ou
  disponibilização") é atendido pela combinação do seed (disponibilização)
  com o cadastro contextual.

## 📦 Estrutura do projeto

```
Livraria_bootcamp/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # modelagem (Livro, Autor, Categoria)
│   │   ├── migrations/         # histórico de alterações do banco
│   │   └── seed.js             # dados de exemplo
│   ├── src/
│   │   ├── server.js           # inicialização do Express
│   │   ├── prismaClient.js     # conexão única com o banco
│   │   ├── routes/             # definição dos endpoints
│   │   └── controllers/        # lógica e validações
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.vue             # página principal
│   │   ├── services/api.js     # cliente Axios
│   │   └── components/         # listagem, filtros, modais, toast
│   └── Dockerfile              # build Vite + nginx (multi-stage)
└── docker-compose.yml
```

## 🔌 Endpoints da API

| Método | Rota            | Descrição                                          |
|--------|-----------------|----------------------------------------------------|
| GET    | /livros         | Lista livros ativos (`?busca=`, `?autorId=`, `?categoriaId=`) |
| GET    | /livros/:id     | Visualiza um livro                                 |
| POST   | /livros         | Cadastra um livro (com validações)                 |
| PUT    | /livros/:id     | Edita um livro (com validações)                    |
| DELETE | /livros/:id     | Inativa um livro (inativação lógica)               |
| GET    | /autores        | Lista autores                                      |
| POST   | /autores        | Cadastra um autor                                  |
| GET    | /categorias     | Lista categorias                                   |
| POST   | /categorias     | Cadastra uma categoria                             |

## ✅ Funcionalidades concluídas

- Cadastro, listagem, edição e inativação de livros (RF01, RF04, RF05, RF08)
- Cadastro e listagem de autores e categorias (RF02, RF03), realizado de
  forma contextual durante o cadastro/edição de um livro
- Pesquisa por título ou ISBN e filtros por autor/categoria com autocomplete (RF07)
- Visualização dos dados do livro (RF09)
- Validação completa no backend e no frontend (RF06, RNF07): ISBN único,
  campos obrigatórios, preço > 0, estoque ≥ 0
- Mensagens de sucesso e erro em todas as operações (RF10, RNF08)
- Controle e destaque visual da quantidade em estoque (badges por nível)
- Interface responsiva — tabela em desktop, cards em telas pequenas (RNF06)
- Entrada de preço no formato brasileiro (vírgula decimal)
- Persistência dos dados entre reinicializações (volume Docker)
- Ambiente completo via Docker Compose (RNF04)
- Seed com dados de exemplo executado automaticamente

## ⚠️ Funcionalidades não implementadas

Do escopo adicional (opcional), não foram implementadas:

- Autenticação e controle de usuários
- Cadastro de clientes e registro de vendas
- Dashboard
- Paginação e ordenação da listagem
- Tema claro/escuro
- Testes automatizados
- Documentação da API (Swagger)
- Histórico de movimentações
- Deploy

Todo o **escopo obrigatório** foi concluído.