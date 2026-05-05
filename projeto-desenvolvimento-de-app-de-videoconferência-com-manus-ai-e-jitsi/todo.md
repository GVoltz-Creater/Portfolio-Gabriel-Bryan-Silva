# LiveShop — TODO

## Setup e Configuração
- [x] Configurar tema de cores (dark-first, vermelho como primary)
- [x] Configurar navegação: tabs + stack screens
- [x] Criar tipos e interfaces TypeScript compartilhados
- [x] Criar dados mock (produtos, lives, usuários, pedidos)
- [x] Adicionar mapeamento de ícones no icon-symbol.tsx

## Telas
- [x] Tela de Onboarding/Login com seleção de perfil (vendedor/comprador)
- [x] Tela Home — Feed de lives ativas com LiveCard
- [x] Tela Explorar — Catálogo de produtos com busca e filtros
- [x] Tela Criar Live (vendedor) — formulário + seleção de produtos
- [x] Tela Live Commerce — WebView Jitsi + overlay completo
- [x] Tela Minhas Compras — lista de pedidos
- [x] Tela Perfil — dados do usuário

## Componentes
- [x] LiveCard — card de live no feed
- [x] ProductCard — card de produto
- [x] JitsiWebView — wrapper WebView para Jitsi Meet
- [x] ProductOverlay — painel deslizante de produto durante live
- [x] CheckoutModal — modal de checkout one-click
- [x] StockAlert — toast de alerta de estoque
- [x] ChatBubble — mensagem no chat da live
- [x] ReactionEmoji — emoji flutuante de reação
- [x] LiveBadge — badge "AO VIVO" com pulsação

## Features de Engajamento
- [x] Alertas de estoque em tempo real (simulado com timer)
- [x] Destaque automático de produtos (rotação por timer)
- [x] Reações com emojis flutuantes
- [x] Contador de espectadores em tempo real (simulado)
- [x] Chat ao vivo (simulado com mensagens mock)

## Checkout
- [x] Fluxo de checkout one-click sem interromper live
- [x] Modal de confirmação de pedido
- [x] Animação de sucesso pós-compra

## Branding
- [x] Gerar logo do app com IA
- [x] Aplicar logo nos assets (icon, splash, favicon)
- [x] Atualizar app.config.ts com nome e logo


## Correções e Otimizações para Smartphones
- [x] Corrigir overlays erradas (z-index, posicionamento)
- [x] Otimizar layouts das telas de live
- [x] Corrigir botões que não funcionam ou funcionam errado
- [x] Revisar responsive design para múltiplos tamanhos
- [x] Corrigir safe areas e notch handling
- [x] Validar scroll e overflow em componentes
- [x] Testar em telas pequenas (< 375px)
- [x] Testar em telas grandes (> 430px)

## Rebranding para Call in Buy
- [x] Renomear app em app.config.ts
- [x] Renomear em app/index.tsx (login screen)
- [x] Renomear em app/(tabs)/index.tsx (home screen)
- [x] Renomear em app/(tabs)/profile.tsx (about section)
- [x] Atualizar comentarios em types/index.ts
- [x] Gerar novo logo com design moderno
- [x] Aplicar logo em todos os assets (icon, splash, favicon, android-icon-foreground)
- [x] Atualizar logoUrl em app.config.ts

## Integração com Jitsi Meet (WebView Otimizado)
- [x] Instalar react-native-webview
- [x] Criar componente JitsiMeetView com WebView otimizado
- [x] Integrar JitsiMeetView na tela de live
- [x] Configurar permissões (câmera, microfone, áudio) em app.config.ts
- [x] Testar em Expo Go
- [x] Validar todos os 13 testes
