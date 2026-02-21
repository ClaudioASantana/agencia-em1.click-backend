# agencia-backend

Api principal do ecossistema **Agência em 1 Click**. Provê a infraestrutura para o Admin SaaS, Painel do Lojista e Vitrine de Lojas.

## 🏗️ Arquitetura e Módulos

O backend centraliza a lógica de negócios e persistência para três fronts distintos:

- **Admin**: Gestão de cidades, segmentos e usuários globais.
- **Store Manager**:painel onde lojistas gerenciam seus estabelecimentos, ofertas e publicações.
- **Vitrine**: API pública para consulta de ofertas e lojas por consumidores finais.

## 🛠️ Stack Tecnológica

- **Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Banco de Dados**: SQLite (Dev) / PostgreSQL (Prod)
- **Linguagem**: TypeScript

## 🚀 Como Rodar

### Desenvolvimento

```bash
npm install
npm run start:dev
```

### Banco de Dados

```bash
# Sincronizar schema
npx prisma generate
npx prisma db push
```

## 🌐 Deploy (Coolify)

O backend é deployado automaticamente em: `https://api.amorimdev.cloud`.

- **Branch de Deploy**: `main`
- **Ambiente**: Nixpacks / Docker

---

Para mais detalhes sobre a arquitetura de dados, consulte [ARCHITECTURE.md](./ARCHITECTURE.md).
