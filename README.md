# Store App

Aplicacao fullstack de loja virtual construida com **React**, **Spring Boot** e **MySQL**.
O projeto tem duas experiencias principais: uma area publica para visitantes comprarem e uma area administrativa para gerenciar produtos.

![Tela inicial da loja](.github/storefront.png)

## O Que O Projeto Faz

- Lista produtos disponiveis na loja.
- Permite cadastro/login simples de visitante.
- Permite adicionar produtos ao carrinho.
- Permite finalizar uma compra no fluxo do visitante.
- Exibe perfil do visitante com dados cadastrados e historico local de compras.
- Protege a area administrativa com login de admin.
- Permite ao admin cadastrar, editar e remover produtos.
- Mantem backend e frontend separados dentro do mesmo repositorio(monorepo).

## Stack

**Frontend**
- React 18
- React Router
- Axios
- Context API para autenticacao e carrinho

**Backend**
- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Validation
- Spring Security
- MySQL

**Infra**
- Docker
- Docker Compose
- Nginx para servir o build do React no container

## Estrutura

```text
store-app/
  back/        API Spring Boot
  front/       Aplicacao React
  compose.yml  MySQL + backend + frontend
```

No frontend, a estrutura foi separada por responsabilidade:

```text
src/
  api/       clientes HTTP
  auth/      sessao e protecao de rotas
  cart/      carrinho e historico local
  features/  modulos de dominio
  layouts/   layouts de loja e admin
  pages/     telas da aplicacao
  routes/    configuracao das rotas
  utils/     formatadores e helpers
```

No backend, a API foi organizada em camadas:

```text
controller/  endpoints HTTP
service/     regras de aplicacao
repository/  acesso ao banco
model/       entidades JPA
dto/         entrada e saida da API
exception/   tratamento de erros
security/    autenticacao e autorizacao
```

## Rotas Principais

**Frontend**

- `/` - vitrine da loja
- `/login` - login/cadastro de visitante e login admin
- `/cart` - carrinho
- `/profile` - dados da conta e compras
- `/admin` - painel administrativo
- `/admin/products` - estoque
- `/admin/products/new` - novo produto
- `/admin/products/:id/edit` - editar produto
- `/admin/sales` - area preparada para vendas

**Backend**

- `GET /store` - lista produtos
- `GET /store/{id}` - busca produto
- `POST /store` - cria produto, requer admin
- `PUT /store/{id}` - atualiza produto, requer admin
- `DELETE /store/{id}` - remove produto, requer admin
- `GET /auth/admin/me` - valida login admin
- `POST /auth/visitors` - cadastra visitante
- `POST /auth/visitors/login` - login simples de visitante

## Autenticacao

A area administrativa e protegida no backend com **HTTP Basic**.

Credenciais locais padrao:

```text
Usuario: admin
Senha: admin123
```

Esses valores podem ser alterados por variaveis de ambiente:

```text
APP_ADMIN_USERNAME
APP_ADMIN_PASSWORD
```

O visitante possui um cadastro simples com nome, e-mail e telefone. Nesta etapa, o login de visitante e feito pelo e-mail.

## Banco De Dados

O banco atual possui entidades para:

- Produtos
- Visitantes

O historico de compras ainda fica salvo no `localStorage` do navegador. A proxima evolucao natural e persistir pedidos no backend com entidades como `Order` e `OrderItem`.

## Como Rodar Com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

Acesse:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:8080/store
MySQL:    localhost:3307
```

## Como Rodar Em Modo Local

Suba apenas o MySQL:

```bash
docker compose up mysql
```

Em outro terminal, suba o backend:

```bash
cd back
./mvnw.cmd spring-boot:run
```

Em outro terminal, suba o frontend:

```bash
cd front
npm install
npm start
```

Por padrao, o frontend usa:

```text
REACT_APP_API_URL=http://localhost:8080
```

Veja `front/.env.example` para configurar outra URL.

## Status Do Projeto

Ja implementado:

- CRUD de produtos
- DTOs e validacoes no backend
- Tratamento global de erros
- Login admin protegido no backend
- Cadastro/login de visitante
- Carrinho no frontend
- Perfil de visitante
- Estrutura separada entre loja e admin

Proximas melhorias sugeridas:

- Persistir pedidos no banco
- Criar dashboard real de vendas no admin
- Criar testes de controller/service
- Melhorar visual e responsividade das telas
