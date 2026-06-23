# 🚀 Do Clone ao MVP — Ethos AI: Moral Compass

> Projeto acadêmico | UNICID — Análise e Desenvolvimento de Sistemas

## 📋 Descrição

**Ethos AI: Moral Compass** evolui o clone construído em [Engenharia Reversa](../projeto-engenharia-reversa) para a fase de inovação e diferenciação competitiva: uma plataforma avançada de ética aplicada, com análise por IA, **histórico persistente** e **consultoria moral personalizada**, usando a IA como copiloto de desenvolvimento.

## 🎯 Objetivo

- Evoluir o clone (Machine Moral) para um produto mínimo viável diferenciado
- Adicionar funcionalidades de maior valor: histórico de decisões, dilemas personalizados e insights de filósofos
- Usar IA generativa como copiloto durante todo o ciclo de desenvolvimento, sem perder rigor de engenharia

## ✨ Novidades em relação ao clone original

- 📜 Histórico persistente de decisões e perfis (`HistoryItem`)
- 🧩 Dilemas personalizados gerados por IA (`CustomDilemma`, `getCustomDilemma`)
- 🧠 Insights de filósofos sobre cada decisão (`getPhilosopherInsight`)

## 🛠️ Tecnologias

- React + TypeScript + Vite
- Gemini API (`services/geminiService.ts`) para análise, perfis, dilemas personalizados e insights filosóficos
- `motion` (Framer Motion) para animações e `lucide-react` para ícones

## ▶️ Como Executar

**Pré-requisitos:** Node.js

```bash
# 1. Instalar dependências
npm install

# 2. Definir a GEMINI_API_KEY em .env.local
# GEMINI_API_KEY=sua_chave_aqui

# 3. Executar
npm run dev
```

## 📚 Conceitos Abordados

- Evolução de um clone (engenharia reversa) para um MVP diferenciado
- IA generativa como copiloto de desenvolvimento
- Persistência de histórico e personalização de conteúdo via IA
- Construção de interfaces interativas em React

## 👨‍💻 Autor

**Gabriel Bryan do Nascimento Silva**
Estudante de ADS — UNICID, 2º período
