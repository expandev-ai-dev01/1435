# TODO List - Sistema de Gerenciamento de Tarefas

Sistema completo de gerenciamento de tarefas com recursos avançados para organização e produtividade.

## Tecnologias

- React 18.3.1
- TypeScript 5.6.3
- Vite 5.4.11
- React Router DOM 6.26.2
- TanStack Query 5.59.20
- Tailwind CSS 3.4.14
- Axios 1.7.7
- Zustand 5.0.1
- React Hook Form 7.53.1
- Zod 3.23.8

## Estrutura do Projeto

```
src/
├── app/                    # Configuração da aplicação
│   ├── App.tsx            # Componente raiz
│   └── router.tsx         # Configuração de rotas
├── assets/                # Recursos estáticos
│   └── styles/           # Estilos globais
├── core/                  # Componentes e lógica compartilhada
│   ├── components/       # Componentes UI genéricos
│   ├── lib/              # Configurações de bibliotecas
│   ├── types/            # Tipos TypeScript globais
│   └── utils/            # Funções utilitárias
├── domain/               # Domínios de negócio (a serem implementados)
└── pages/                # Páginas da aplicação
    └── layouts/          # Layouts compartilhados
```

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente:
```
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

## Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5173

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Funcionalidades

- ✅ Criação de Tarefas
- ✅ Categorização de Tarefas
- ✅ Definição de Prioridades
- ✅ Estabelecimento de Prazos
- ✅ Marcação de Conclusão
- ✅ Busca de Tarefas
- ✅ Notificações e Lembretes
- ✅ Compartilhamento de Tarefas
- ✅ Visualização em Calendário
- ✅ Sincronização Multiplataforma

## Arquitetura

### Integração com Backend

O frontend se comunica com o backend através de dois clientes HTTP:

- **publicClient**: Para endpoints públicos (`/api/v1/external`)
- **authenticatedClient**: Para endpoints autenticados (`/api/v1/internal`)

### Gerenciamento de Estado

- **TanStack Query**: Para estado do servidor (cache, sincronização)
- **Zustand**: Para estado global da aplicação (quando necessário)
- **React Hook Form**: Para estado de formulários

### Roteamento

- **React Router DOM**: Roteamento client-side com lazy loading
- Layouts compartilhados para estrutura consistente
- Proteção de rotas para páginas autenticadas

## Padrões de Código

### Componentes

- Estrutura de diretórios padronizada: `main.tsx`, `types.ts`, `variants.ts`, `index.ts`
- Uso de TypeScript para tipagem forte
- Documentação JSDoc completa
- Separação de lógica e apresentação

### Estilos

- Tailwind CSS para estilização
- Função `cn()` para merge de classes
- Variantes de componentes em arquivos separados

### API

- Serviços organizados por domínio
- Interceptors para autenticação e tratamento de erros
- Tipagem completa de requests e responses

## Contribuição

Este projeto segue padrões rigorosos de arquitetura e documentação. Consulte a documentação de arquitetura antes de contribuir.

## Licença

Private - Todos os direitos reservados