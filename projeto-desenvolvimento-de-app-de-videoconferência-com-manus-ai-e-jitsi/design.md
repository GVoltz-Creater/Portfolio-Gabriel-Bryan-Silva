# LiveShop — Design de Interface Mobile

## Visão Geral

Aplicativo de Live Commerce que combina videoconferência via Jitsi Meet com um catálogo de produtos interativo sobreposto. Vendedores transmitem ao vivo enquanto compradores assistem, interagem e compram sem sair da transmissão.

---

## Paleta de Cores

| Token | Cor (Light) | Cor (Dark) | Uso |
|-------|------------|-----------|-----|
| `primary` | `#E63946` | `#FF6B6B` | CTAs, botões de compra, live badge |
| `background` | `#0D0D0D` | `#0D0D0D` | Fundo principal (dark-first) |
| `surface` | `#1A1A1A` | `#1A1A1A` | Cards, overlays |
| `foreground` | `#FFFFFF` | `#FFFFFF` | Texto principal |
| `muted` | `#9BA1A6` | `#9BA1A6` | Texto secundário |
| `border` | `#2A2A2A` | `#2A2A2A` | Divisores |
| `success` | `#22C55E` | `#4ADE80` | Confirmação de compra |
| `warning` | `#F59E0B` | `#FBBF24` | Alertas de estoque |
| `accent` | `#FF6B35` | `#FF8C5A` | Destaques de produto |

---

## Lista de Telas

### 1. Splash / Onboarding
- Logo animado com gradiente
- Tagline: "Compre ao vivo, sem pausar"

### 2. Login / Cadastro
- Seleção de perfil: **Vendedor** ou **Comprador**
- Campo de nome/apelido
- Botão de entrar (sem auth complexa — local)

### 3. Home — Feed de Lives
- Header com logo + ícone de notificações
- Lista de lives ativas (cards horizontais com thumbnail, título, vendedor, contagem de espectadores)
- Seção "Em breve" com lives agendadas
- FAB (Floating Action Button) para vendedores iniciarem live
- Tab bar: Home | Explorar | Minhas Compras | Perfil

### 4. Explorar — Catálogo de Produtos
- Busca por produto ou vendedor
- Grid de produtos com preço e disponibilidade
- Filtros por categoria

### 5. Criar Live (Vendedor)
- Formulário: título da live, descrição, categoria
- Seleção de produtos do catálogo para destacar
- Configuração de sala Jitsi (nome da sala gerado automaticamente)
- Botão "Iniciar Live"

### 6. Tela de Live Commerce (TELA PRINCIPAL)
- **Camada 1 (base):** WebView com Jitsi Meet em tela cheia
- **Camada 2 (overlay):** Interface de compra sobreposta
  - Badge "AO VIVO" com contador de espectadores (topo esquerdo)
  - Botão de fechar/minimizar (topo direito)
  - **Painel de produto em destaque** (bottom sheet deslizável):
    - Foto, nome, preço, estoque restante
    - Barra de progresso de estoque
    - Botão "COMPRAR AGORA" (one-click)
  - **Carrossel de produtos** (barra horizontal acima do bottom sheet)
  - **Feed de chat** (lateral esquerda, semi-transparente)
  - **Alertas de estoque** (toast no topo, cor warning)
  - **Reações em tempo real** (emojis flutuantes)

### 7. Checkout One-Click
- Modal deslizante (não interrompe o vídeo)
- Resumo do produto + preço
- Endereço salvo (pré-preenchido)
- Método de pagamento salvo
- Botão "CONFIRMAR COMPRA"
- Animação de sucesso sem fechar a live

### 8. Minhas Compras
- Lista de pedidos com status
- Detalhe do pedido

### 9. Perfil
- Avatar, nome, tipo de conta
- Histórico de lives (vendedor) ou compras (comprador)
- Configurações

---

## Fluxos de Usuário Principais

### Fluxo do Comprador
1. Abre app → vê feed de lives ativas
2. Toca em uma live → entra na tela de Live Commerce
3. Assiste ao vídeo + vê produtos em destaque no overlay
4. Toca no produto → bottom sheet expande com detalhes
5. Toca "COMPRAR AGORA" → modal de checkout one-click desliza
6. Confirma → animação de sucesso → volta à live sem interrupção

### Fluxo do Vendedor
1. Abre app → toca FAB "Iniciar Live"
2. Preenche título + seleciona produtos
3. Toca "Iniciar" → entra na tela de Live Commerce como host
4. Controla quais produtos aparecem no overlay
5. Recebe alertas quando produto é comprado
6. Encerra a live

---

## Componentes Reutilizáveis

- `LiveCard` — card de live no feed
- `ProductCard` — card de produto no catálogo
- `ProductOverlay` — painel deslizante de produto durante live
- `CheckoutModal` — modal de checkout one-click
- `StockAlert` — toast de alerta de estoque
- `ChatBubble` — mensagem no chat da live
- `ReactionEmoji` — emoji flutuante de reação
- `LiveBadge` — badge "AO VIVO" com pulsação
- `JitsiWebView` — wrapper do WebView para Jitsi Meet

---

## Decisões de Arquitetura

- **Jitsi Meet:** Integrado via WebView apontando para `meet.jit.si/{roomName}` com parâmetros de configuração via URL
- **Sincronização de catálogo:** Simulada com estado local + intervalos de atualização (simula WebSocket)
- **Checkout one-click:** Modal bottom sheet que não desmonta o WebView
- **Alertas de estoque:** Gerados por timer simulando eventos em tempo real
- **Destaque de produto:** Rotação automática por timer + seleção manual pelo vendedor
