# 🏋️ FitTracker

**App de treinos com IA** — acompanhe seus treinos com um cronômetro ao vivo, receba orientações e dicas de exercícios com IA, e registre todas as sessões para acompanhar sua jornada fitness com estatísticas detalhadas.

🇺🇸 [Read in English](./README.md)

---

## ✨ Sobre

O FitTracker te ajuda a planejar, executar e revisar seus treinos. Inicie uma sessão, acompanhe séries e repetições em tempo real com cronômetro ao vivo, receba orientações de exercícios com IA, e veja seu progresso ao longo do tempo através de estatísticas detalhadas.

## 🚀 Funcionalidades

- 🔐 **Login** — fluxo de autenticação
- 🏠 **Home** — visão geral do painel
- 🏋️ **Exercícios** — navegue pela biblioteca de exercícios
- 📋 **Treinos** — crie e gerencie planos de treino
- ⏱️ **Treino Ativo** — sessão ao vivo com cronômetro, séries e repetições
- 📊 **Histórico** — registro de treinos anteriores
- 👤 **Perfil** — configurações e estatísticas do usuário

## 🧱 Stack Tecnológica

- **App mobile:** React Native + Expo (Expo Router)
- **Backend de conteúdo:** Sanity.io + GROQ
- **Gerenciamento de estado:** Zustand
- **Estilização:** NativeWind (Tailwind para React Native)
- **Linguagem:** TypeScript

## 📦 Estrutura do Monorepo

```
fittracker/
├── apps/
│   ├── api/       # Sanity Studio + schemas/queries GROQ
│   └── mobile/     # App React Native + Expo (login, treinos, exercícios)
```

## 🏁 Como Começar

### Pré-requisitos

- Node.js (LTS)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Uma conta e projeto no Sanity.io

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/fittracker.git
cd fittracker

# Instale as dependências
npm install
```

### Rodando a API (Sanity Studio)

```bash
cd apps/api
npm install
npm run dev
```

### Rodando o App Mobile

```bash
cd apps/mobile
npm install
npx expo start
```

### Variáveis de Ambiente

Crie um arquivo `.env` (ou `.env.local`) em `apps/mobile` com:

```
EXPO_PUBLIC_SANITY_PROJECT_ID=seu_project_id
EXPO_PUBLIC_SANITY_DATASET=production
```

## 🗺️ Roadmap

- [ ] Recomendações de exercícios com IA
- [ ] Gráficos de progresso e painel de analytics
- [ ] Funcionalidades sociais/compartilhamento
- [ ] Modo offline

## 🤝 Contribuindo

Contribuições, issues e sugestões de funcionalidades são bem-vindas! Confira a [página de issues](../../issues).

## 📄 Licença

Este projeto está licenciado sob a Licença MIT — veja o arquivo [LICENSE](./LICENSE) para detalhes.
