# CompassEvent API

API REST para gerenciamento de eventos, construída com NestJS e integrada com serviços da AWS. Permite criar e gerenciar eventos, controlar inscrições de participantes, enviar e-mails de confirmação e armazenar imagens no S3.

---

## O que tem aqui

- Autenticação JWT com guards de rota
- Controle de acesso por papel (roles), com suporte ao perfil `ORGANIZADOR`
- CRUD completo de usuários, eventos e inscrições
- Upload de imagens direto para o AWS S3
- Banco de dados com DynamoDB — tabelas criadas automaticamente na inicialização
- Envio de e-mails via AWS SES, com convite de calendário (.ics) em anexo
- Documentação interativa via Swagger

---

## Stack

- **NestJS** (Node.js + TypeScript)
- **AWS DynamoDB** — banco principal
- **AWS S3** — armazenamento de imagens
- **AWS SES** — envio de e-mails
- **Passport + JWT** — autenticação
- **Swagger** — documentação da API

---

## Pré-requisitos

- Node.js 18+
- Conta AWS com acesso a DynamoDB, S3 e SES
- Credenciais AWS configuradas (via variáveis de ambiente ou AWS CLI)

---

## Configuração

### 1. Variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

As variáveis necessárias estão todas documentadas no `.env.example`:

```env
# AWS
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SESSION_TOKEN=
AWS_S3_BUCKET_NAME=

# JWT
JWT_SECRET=

# Usuário padrão (seed)
DEFAULT_USER_NAME=
DEFAULT_USER_EMAIL=
DEFAULT_USER_PASSWORD=
DEFAULT_USER_PHONE=
DEFAULT_USER_IMAGE=

# E-mail
MAIL_FROM=
```

### 2. Bucket S3

Crie um bucket no S3 manualmente e adicione esta policy para permitir leitura pública das imagens:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::SEU-BUCKET/*"
    }
  ]
}
```

### 3. Instalar dependências

```bash
npm install
```

---

## Rodando o projeto

```bash
# desenvolvimento (com hot reload)
npm run start:dev

# produção
npm run start:prod
```

As tabelas do DynamoDB são criadas automaticamente na primeira execução.

---

## Seed

Para criar um usuário `ORGANIZADOR` padrão no banco:

```bash
npm run seed
```

As credenciais desse usuário são definidas nas variáveis `DEFAULT_USER_*` do `.env`.

---

## Documentação (Swagger)

Com o servidor rodando, acesse:

```
http://localhost:3000/api
```

As rotas protegidas exigem autenticação — clique em **Authorize** no Swagger e informe o token Bearer obtido no login.

---

## Testes

```bash
# unitários
npm run test

# cobertura
npm run test:cov

# e2e
npm run test:e2e
```
