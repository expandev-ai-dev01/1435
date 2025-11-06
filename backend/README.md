# TODO List - Backend API

Sistema de gerenciamento de tarefas - API REST

## Tecnologias

- Node.js
- TypeScript
- Express.js
- Zod (validação)

## Estrutura do Projeto

```
src/
├── api/              # Controladores de API
├── routes/           # Definições de rotas
├── middleware/       # Middlewares Express
├── services/         # Lógica de negócio
├── utils/            # Funções utilitárias
├── constants/        # Constantes da aplicação
├── instances/        # Instâncias de serviços
└── server.ts         # Ponto de entrada
```

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`
2. Configure as variáveis de ambiente necessárias

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Produção

```bash
npm start
```

## Testes

```bash
npm test
```

## API Endpoints

### Health Check
- `GET /health` - Verifica o status da API

### API v1
- Base URL: `/api/v1`
- External routes: `/api/v1/external/*`
- Internal routes: `/api/v1/internal/*`

## Funcionalidades

Este projeto base fornece a estrutura fundamental para implementação das seguintes funcionalidades:

1. Criação de Tarefas
2. Categorização de Tarefas
3. Definição de Prioridades
4. Estabelecimento de Prazos
5. Marcação de Conclusão
6. Busca de Tarefas
7. Notificações e Lembretes
8. Compartilhamento de Tarefas
9. Visualização em Calendário
10. Sincronização Multiplataforma

## Padrões de Código

- TypeScript strict mode habilitado
- Path aliases configurados (@/*)
- ESLint para qualidade de código
- Estrutura modular e escalável
- Separação clara de responsabilidades

## Contribuição

Este é um projeto base. Funcionalidades específicas devem ser implementadas seguindo os padrões estabelecidos na estrutura.