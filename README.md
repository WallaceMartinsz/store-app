# Store App

Aplicacao fullstack de loja virtual construida com **React**, **Spring Boot** e **MySQL**.
O projeto tem duas experiencias principais: uma area publica para visitantes comprarem e uma area administrativa para gerenciar produtos e vendas.

![Tela inicial da loja](.github/storefront.png)

## O Que O Projeto Faz

**Loja**

- Vitrine com banners, categorias, busca, filtros e ordenacao de produtos.
- Cadastro e login de visitante com e-mail e senha.
- Carrinho limitado ao estoque disponivel, com frete fixo no total.
- Tela de pagamento simulado com Pix, cartao de credito (ate 10x sem juros) e boleto.
- Perfil do visitante com dados cadastrados e historico de pedidos.

**Admin**

- Login de admin protegido no backend.
- Cadastro, edicao e remocao de produtos.
- Painel de vendas com busca por cliente, e-mail ou numero do pedido, filtro por status e resumo de faturamento.
- Alteracao do status dos pedidos (pago, enviado, cancelado), com devolucao do estoque no cancelamento.

Backend e frontend ficam separados dentro do mesmo repositorio (monorepo).

## Stack

**Frontend**
- React 18
- React Router
- Axios
- Tailwind CSS
- Componentes de UI proprios com `class-variance-authority` e `clsx`
- Icones com `lucide-react`
- Context API para autenticacao e carrinho

**Backend**
- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Validation
- Spring Security com OAuth2 Resource Server (JWT)
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
  api/         clientes HTTP
  auth/        sessao (JWT) e protecao de rotas
  cart/        carrinho
  components/  componentes de UI reutilizaveis (botao, campo, tabela...)
  features/    modulos de dominio (produtos, pedidos, pagamento)
  layouts/     layouts de loja e admin
  lib/         utilitarios gerais
  pages/       telas da aplicacao
  routes/      configuracao das rotas
  utils/       formatadores e helpers
```

No backend, a API foi organizada em camadas:

```text
config/      CORS e carga inicial de produtos
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
- `/checkout` - pagamento do pedido
- `/profile` - dados da conta e pedidos
- `/admin` - painel administrativo
- `/admin/products` - estoque
- `/admin/products/new` - novo produto
- `/admin/products/:id/edit` - editar produto
- `/admin/sales` - vendas

**Backend**

Produtos:

- `GET /store` - lista produtos
- `GET /store/{id}` - busca produto
- `POST /store` - cria produto, requer admin
- `PUT /store/{id}` - atualiza produto, requer admin
- `DELETE /store/{id}` - remove produto, requer admin

Autenticacao:

- `POST /auth/admin/login` - login do admin, devolve o JWT
- `POST /auth/visitors` - cadastra visitante e ja devolve o JWT
- `POST /auth/visitors/login` - login do visitante (e-mail e senha), devolve o JWT

Pedidos:

- `POST /orders` - cria pedido do visitante logado, com forma de pagamento e parcelas
- `GET /orders/me` - pedidos do visitante logado
- `GET /orders/{id}` - busca pedido (o visitante so ve os proprios)
- `POST /orders/{id}/payment` - confirma o pagamento simulado do visitante
- `GET /orders` - lista todos os pedidos, requer admin (filtro opcional `?visitorId=`)
- `PATCH /orders/{id}/status` - altera o status do pedido, requer admin

## Autenticacao

A API e stateless e usa **JWT** com o resource server do Spring Security.

- O login (admin ou visitante) devolve `token` e `expiresAt`.
- As rotas protegidas recebem o token no header `Authorization: Bearer <token>`.
- O token e assinado com HS256. O `sub` e o id do visitante ou o usuario do admin, e o papel (`ADMIN` ou `VISITOR`) vai no claim `role`.
- O front guarda a sessao no `localStorage` e desloga sozinho quando o token vence ou a API responde 401.

Credenciais locais padrao do admin:

```text
Usuario: admin
Senha: admin123
```

Esses valores podem ser alterados por variaveis de ambiente:

```text
APP_ADMIN_USERNAME
APP_ADMIN_PASSWORD
APP_JWT_SECRET          # chave de assinatura, minimo de 32 caracteres
APP_JWT_EXPIRATION      # validade do token, padrao 2h
APP_ORDER_SHIPPING_FEE  # frete fixo dos pedidos, padrao 10.00
```

O visitante se cadastra com nome, e-mail, senha (guardada com BCrypt) e telefone opcional.

## Pedidos E Pagamento

- O backend busca os precos no banco, valida o estoque, soma o frete e da baixa no estoque ao criar o pedido.
- O status segue o fluxo `PENDENTE -> PAGO -> ENVIADO`, com cancelamento possivel antes do envio.
- O pagamento e **simulado**: nenhuma cobranca real e feita e os dados do cartao nao saem do navegador.
  - **Cartao:** valida numero, validade e CVV no front, aceita de 1 a 10 parcelas e aprova na hora.
  - **Pix:** gera um QR code e um codigo copia e cola ilustrativos; o pagamento e confirmado por um botao de simulacao.
  - **Boleto:** gera uma linha digitavel ilustrativa; o pedido fica pendente ate a compensacao simulada.

Para testar o cartao, use o numero `4111 1111 1111 1111` com qualquer validade futura.

## Banco De Dados

O banco possui entidades para:

- Produtos (com categoria)
- Visitantes
- Pedidos e itens do pedido

Na primeira inicializacao, com o banco vazio, a API cadastra produtos de exemplo.

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

- CRUD de produtos com categorias
- DTOs e validacoes no backend
- Tratamento global de erros
- Autenticacao JWT para admin e visitante
- Cadastro/login de visitante com senha
- Carrinho com limite de estoque e frete
- Pedidos persistidos no banco, com controle de estoque e status
- Pagamento simulado com Pix, cartao e boleto
- Painel de vendas no admin com busca e filtros
- Interface com Tailwind CSS e componentes reutilizaveis

Proximas melhorias sugeridas:

- Criar testes de controller/service
- Levar o usuario admin para o banco
- Paginacao e busca no servidor para muitos pedidos
- Dashboard de vendas com graficos
