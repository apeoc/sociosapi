# Sistema APEOC - Gestão de Membros e Processos

Sistema completo de gestão para a Associação dos Profissionais da Educação de Oeiras (APEOC), desenvolvido com Next.js 15, TypeScript e tecnologias modernas.

## 🚀 Funcionalidades

### 🔐 Autenticação
- Sistema de login seguro com JWT
- Criptografia de senhas com bcrypt
- Proteção de rotas

### 👥 Gestão de Associados
- **996 associados** cadastrados
- Busca em tempo real
- Filtros por categoria, estado, cargo
- Ordenação por nome, matrícula, valor
- Visualização em grid ou lista
- Detalhes completos de cada associado

### ⚖️ Gestão de Processos
- Sistema completo de processos judiciais
- Anotações por processo
- Informações detalhadas (vara, situação, próximos passos)
- Classificação por tipo de ação
- Atualizações em tempo real

### 📊 Dashboard
- Estatísticas gerais
- Contadores por categoria
- Aniversariantes do mês
- Média de valores

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Lucide Icons
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM com SQLite
- **Auth**: JWT, bcrypt
- **Estado**: React Hooks

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/SEU-USUARIO/sistema-apeoc.git
cd sistema-apeoc
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
```bash
npm run db:push
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse em http://localhost:3000

## 🔑 Acesso Padrão

- **Usuário**: `rocha`
- **Senha**: `4884`

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/          # API Routes
│   ├── components/   # Componentes React
│   ├── hooks/        # Hooks personalizados
│   └── lib/          # Utilitários
├── data/             # Dados estáticos
├── components/
│   ├── ui/          # Componentes UI
│   ├── auth/        # Componentes de autenticação
│   └── layout/      # Componentes de layout
└── lib/             # Bibliotecas compartilhadas
```

## 🎯 Principais Características

- ✅ **Responsivo**: Funciona perfeitamente em desktop e mobile
- ✅ **Seguro**: Autenticação JWT e criptografia de senhas
- ✅ **Performático**: Otimizado com Next.js 15
- ✅ **Escalável**: Arquitetura modular e organizada
- ✅ **Acessível**: Interface intuitiva e fácil de usar

## 🔄 Funcionalidades Principais

### Associados
- Busca instantânea por nome, matrícula ou cargo
- Filtros por categoria (municipal/estadual)
- Ordenação por múltiplos critérios
- Visualização detalhada com informações completas

### Processos
- Acompanhamento de processos judiciais
- Sistema de anotações por processo
- Classificação por tipo (INSS, Adicional, etc.)
- Status e próximos passos

### Dashboard
- Visão geral do sistema
- Estatísticas em tempo real
- Informações importantes destacadas

## 🧪 Testes

Para testar o sistema:
1. Acesse http://localhost:3000/teste
2. Verifique se a API está funcionando
3. Faça login com as credenciais padrão

## 📝 Desenvolvimento

### Scripts Disponíveis
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código
- `npm run db:push` - Atualizar banco de dados

### Variáveis de Ambiente
Crie um arquivo `.env.local`:
```env
JWT_SECRET=seu-secret-key-aqui
DATABASE_URL="file:./dev.db"
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adicionar nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT.

## 👥 Equipe

Desenvolvido para a Associação dos Profissionais da Educação de Oeiras (APEOC).

---

**Sistema APEOC** © 2024 - Todos os direitos reservados.