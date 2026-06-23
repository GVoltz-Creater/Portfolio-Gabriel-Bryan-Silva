# 🔄 Engenharia Reversa — Machine Moral

> Projeto acadêmico | UNICID — Análise e Desenvolvimento de Sistemas

## 📋 Descrição

**Machine Moral** é uma plataforma interativa de ética aplicada, construída por **engenharia reversa**: o desafio era reconstruir um aplicativo funcional a partir da observação de sua interface externa, sem visualizar o código-fonte original ou fornecer o link para a IA. A aplicação apresenta dilemas morais clássicos (como o *Trolley Problem*) e analisa as escolhas do usuário para construir seu perfil filosófico.

## 🎯 Objetivo

- Praticar a reconstrução de um produto a partir apenas do seu comportamento observável
- Modelar dilemas éticos e tradições filosóficas (Utilitarismo, Deontologia, Contratualismo, Pluralismo) como dados
- Usar IA generativa para analisar escolhas do usuário e gerar um perfil filosófico final

## 🛠️ Tecnologias

- React + TypeScript + Vite
- Gemini API (`services/geminiService.ts`) para análise das escolhas e geração do perfil
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

- Engenharia reversa de produto (clonagem por comportamento observado)
- Modelagem de dilemas éticos e tradições filosóficas
- Integração com IA generativa (Gemini) para análise qualitativa
- Construção de interfaces interativas em React

## 👨‍💻 Autor

**Gabriel Bryan do Nascimento Silva**
Estudante de ADS — UNICID, 2º período
