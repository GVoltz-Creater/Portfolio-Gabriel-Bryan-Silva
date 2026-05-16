# 📈 Análise de Ativos Financeiros com Python e yfinance

> Projeto acadêmico | UNICID — Análise e Desenvolvimento de Sistemas

## 📋 Descrição

Sistema de **análise e simulação de investimentos em ações bancárias** desenvolvido em Python. O programa baixa dados históricos reais da bolsa de valores via **Yahoo Finance** e simula a evolução de um investimento de R$ 10.000 ao longo do tempo, exibindo os resultados em gráficos interativos.

## 🎯 O que o Programa Faz

1. Lista os bancos disponíveis para análise
2. Solicita ao usuário a escolha de 2 bancos para comparar
3. Baixa os preços reais da bolsa via internet (Yahoo Finance)
4. Calcula o retorno diário de cada ativo
5. Simula como R$ 10.000 teriam evoluído ao longo do período
6. Exibe gráfico interativo comparativo com zoom e hover

## 💹 Ativos Disponíveis

| Banco | Ticker |
|---|---|
| Itaú | ITUB4.SA |
| Bradesco | BBDC4.SA |
| Banco do Brasil | BBAS3.SA |
| Santander | SANB11.SA |

## 🛠️ Tecnologias

| Biblioteca | Uso |
|---|---|
| `yfinance` | Download de dados históricos da bolsa |
| `pandas` | Manipulação de tabelas de dados |
| `numpy` | Cálculos matemáticos e arrays |
| `plotly` | Gráficos interativos |

## ▶️ Como Executar

```bash
# 1. Instalar dependências
pip install yfinance pandas numpy plotly

# 2. Executar o programa
python AtivosFinanceiros.py

# 3. Seguir as instruções no terminal para escolher os bancos
```

## 📂 Arquivos

| Arquivo | Descrição |
|---|---|
| `AtivosFinanceiros.ipynb` | Notebook Jupyter com o código completo comentado |
| `Projeto_ Análise de Ativos Financeiros...` | Versão em script Python com documentação detalhada |

## 📚 Conceitos Abordados

- Análise de dados financeiros com Python
- Coleta de dados reais via API (Yahoo Finance)
- Manipulação de séries temporais com Pandas
- Cálculo de retornos e simulação de portfólio
- Visualização de dados financeiros com Plotly
- Estruturas de dados: dicionários, listas, arrays NumPy

## ⚠️ Aviso

Este projeto tem finalidade **exclusivamente educacional**. Nenhuma análise gerada deve ser interpretada como recomendação de investimento.

## 👨‍💻 Autor

**Gabriel Bryan do Nascimento Silva**
Estudante de ADS — UNICID, 2º período
