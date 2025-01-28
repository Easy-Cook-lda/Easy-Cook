# Easy Cook

**Visão Geral**

Este projeto é um site de receitas desenvolvido como parte da cadeira de Programação e Integração de Serviços. O site permite aos utilizadores explorar, filtrar e adicionar receitas. A aplicação foi construída com Node.js e Express, utilizando uma arquitetura modular e conectando-se a uma base de dados para gestão de receitas.

**Funcionalidades Principais**

- **Visualização de Receitas**: Exibe uma lista de receitas, permitindo aos utilizadores explorar diferentes opções culinárias.
- **Filtros Personalizados**: Filtrar receitas por categorias (e.g., sobremesas, pratos principais) e dificuldade.
- **Adicionar Receitas**: Funcionalidade para utilizadores autenticados adicionarem novas receitas à base de dados.
- **Sistema de Autenticação**: Login seguro para gerir receitas pessoais.
  
**Especificações Técnicas**

**Tecnologias Utilizadas**

- **Backend**: Node.js com Express
- **Base de Dados**: MySQL
- **Documentação da API**: TheMealDB
- **Gestão de Dependências**: npm

**Estrutura do Projeto**

![image](https://github.com/user-attachments/assets/d9dee85d-56dc-4e46-91b2-eb09aaed7519)

**Endpoints Principais**

### 1. Receitas
- **GET /api/recipes**  
  **Descrição**: Lista todas as receitas.
 
- **GET /api/recipes/:id**  
  **Descrição**: Retorna uma receita específica pelo ID.
 
- **PATCH /api/recipes/update/:id**  
  **Descrição**: Atualiza uma receita com base no ID.  
  **Corpo da requisição**: `field` (nome do campo a ser atualizado), `value` (novo valor).
 
- **GET /api/recipes/difficulty/:difficultyId**  
  **Descrição**: Lista receitas por dificuldade.
 
- **GET /api/recipes/category/:categoryId**  
  **Descrição**: Lista receitas por categoria.
 
- **GET /api/recipes/:difficultyId/:categoryId**  
  **Descrição**: Lista receitas por dificuldade e categoria.
 
- **GET /api/recipesByName/:name**  
  **Descrição**: Busca receitas por nome.
 
- **DELETE /api/recipes/:id**  
  **Descrição**: Remove uma receita específica pelo ID.
 
 
### 2. Utilizador
- **GET /api/users**  
  **Descrição**: Lista todos os usuários.
 
- **GET /api/users/:id**  
  **Descrição**: Retorna um usuário específico pelo ID.
 
- **POST /api/users**  
  **Descrição**: Cria um novo usuário.  
  **Corpo da requisição**: `name`, `email`, `password`.
 
### 3. Listas de Receitas
- **GET /api/lists**  
  **Descrição**: Lista todas as listas de receitas.
 
- **POST /api/lists**  
  **Descrição**: Cria uma nova lista de receitas.  
  **Corpo da requisição**: `userId`.
 
- **GET /api/recipesList**  
  **Descrição**: Lista todas as receitas na lista.
 
- **POST /api/recipesList**  
  **Descrição**: Adiciona uma receita a uma lista de receitas.  
  **Corpo da requisição**: `recipeId`, `listId`.
 
- **DELETE /api/recipesList/:id**  
  **Descrição**: Remove uma receita de uma lista pelo ID.
 

 
### 4. Autenticação e Sessões
- **POST /api/login**  
  **Descrição**: Inicia uma nova sessão para o usuário.  
  **Corpo da requisição**: `userId`.
 
- **GET /api/logout**  
  **Descrição**: Encerra a sessão atual.
 
- **GET /api/user**  
  **Descrição**: Retorna o `userId` da sessão atual se o usuário estiver autenticado.
 
### 5. Arquivos HTML
 
As rotas para servir arquivos HTML:
 
- **GET /**  
  **Descrição**: Serve o `index.html`.
 
- **GET /recipes.html**  
  **Descrição**: Serve o `recipes.html`.
 
- **GET /recipe.html/:id**  
  **Descrição**: Serve o `recipe.html` para uma receita específica.
 
- **GET /list.html**  
  **Descrição**: Serve o `list.html`.
 
- **GET /addRecipe.html**  
  **Descrição**: Serve o `addRecipe.html`.
 
- **GET /signin.html**  
  **Descrição**: Serve o `signin.html`.
 
- **GET /login.html**  
  **Descrição**: Serve o `login.html`.
 
- **GET /user.html/:id**  
  **Descrição**: Serve o `user.html` para um usuário específico.

**Instalação**

1. Clone o repositório:
    ```bash
    git clone
    ```
 
2. Instale as dependências:
    ```bash
    npm install express
    npm install express-session
    npm install axios
    npm install mysql2/promise
    ```
 
3. Rodar o códido pelo terminal do VS Code:
    ```bash
    cd server
    nodemo

**Fluxo de Utilização**

- **Página Inicial**: Oferece uma visão geral das receitas disponíveis.  
- **Explorar Receitas**: Permite pesquisar e filtrar receitas de acordo com as preferências.  
- **Adicionar Receitas**: Disponível após login, permite aos utilizadores submeterem novas receitas.  
- **Gerir Conta**: Inclui opções de registo e autenticação do utilizador.  
