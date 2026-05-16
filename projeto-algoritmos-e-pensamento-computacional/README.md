# ⚙️ Algoritmos e Pensamento Computacional em C

> Projeto acadêmico | UNICID — Análise e Desenvolvimento de Sistemas

## 📋 Descrição

Coleção de atividades práticas em **linguagem C** desenvolvidas na disciplina de Algoritmos e Pensamento Computacional. Os projetos exploram conceitos fundamentais da programação como manipulação de arquivos, estruturas de dados, ponteiros e algoritmos de ordenação.

## 📂 Projetos Incluídos

### 1. Código da Atividade de Arquivo em C
Leitura e manipulação de arquivos `.txt` com ordenação dos dados via **Bubble Sort**.

**Funcionalidades:**
- Abertura e leitura de arquivo externo (`test.txt`)
- Armazenamento dinâmico dos valores em array
- Ordenação com algoritmo Bubble Sort
- Exibição dos dados antes e após a ordenação

### 2. Sistema de Cadastro de Produtos — Lista de Produtos em C
Sistema completo de gerenciamento de produtos para uma loja, com persistência em arquivo.

**Funcionalidades:**
- Cadastro de produtos com ID, nome, categoria e preço
- Verificação de duplicidade (case-insensitive)
- Persistência em arquivo `.txt` com separador `|`
- Exportação para formato `.csv`
- Geração automática de ID incremental
- Menu interativo de operações (CRUD)

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| C (ANSI C) | Linguagem principal |
| `stdio.h` | Entrada/saída e manipulação de arquivos |
| `stdlib.h` | Alocação de memória |
| `string.h` | Manipulação de strings |
| `ctype.h` | Conversão de caracteres |

## ▶️ Como Compilar e Executar

```bash
# Compilar
gcc codigo_arquivo.c -o arquivo

# Executar
./arquivo
```

> **Pré-requisito:** Ter o arquivo `test.txt` na mesma pasta para o projeto de ordenação.

## 📚 Conceitos Abordados

- Manipulação de arquivos (`fopen`, `fscanf`, `fclose`, `rewind`)
- Structs e typedef
- Ponteiros e arrays dinâmicos
- Algoritmo de ordenação Bubble Sort
- Strings e funções `tolower`, `strcmp`
- Menus interativos com `switch`

## 👨‍💻 Autor

**Gabriel Bryan do Nascimento Silva**
Estudante de ADS — UNICID, 2º período
