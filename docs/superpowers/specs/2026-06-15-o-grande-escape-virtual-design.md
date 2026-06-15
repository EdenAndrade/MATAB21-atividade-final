# Design Document: O Grande Escape Virtual

**Projeto:** MATB21 — Atividade Final
**Tema:** O Último Servidor Orgânico
**Data:** 2026-06-15
**Deadline:** 22.06.2026
**Stack:** Vite + Vanilla JS (ES modules) + CSS nativo 2026

---

## 1. Narrativa e Premissa

O último bio-servidor do conhecimento pedagógico está degradando. Esta é a única infraestrutura computacional que contém os padrões neurais mapeados dos maiores educadores da humanidade — um repositório vivo de todo o saber educacional. Seus componentes orgânicos estão se corrompendo.

O jogador é um técnico de sistemas especializado em arquiteturas orgânico-digitais, convocado para um reparo de emergência. Cada enigma representa a reativação de um subsistema diferente do bio-servidor. O próprio batimento cardíaco do servidor funciona como timer diegético.

### Fases do Jogo

| Fase | Descrição | Estética |
|------|-----------|----------|
| **Boot** | Tela de inicialização. Texto em terminal: "SISTEMA CORROMPIDO. INICIANDO PROTOCOLO DE REPARO." Barra de progresso. | Terminal CRT, verde âmbar |
| **Enigma 1** | Subsistema de Circuitos Lógicos. Reativar portas lógicas (AND, OR, NOT) arrastando módulos neurais. | Diagramas neurais + portas bioluminescentes |
| **Enigma 2** | Subsistema de Dados. Reconstruir modelo entidade-relacionamento corrompido. | DER orgânico, células pulsantes, sinapses |
| **Enigma 3** | Módulo Cognitivo Central. Quebrar loop recursivo debugando pseudocódigo. | Fractais, colapso visual progressivo, glitch |
| **Resolução** | Bio-servidor reinicia. Resumo visual dos subsistemas reparados. "O CONHECIMENTO FOI PRESERVADO." | Cicatrização digital, pulso estabiliza |

### Transições

- Cada enigma resolvido → flash branco com scanlines → estabilização momentânea
- Batimento cardíaco do servidor desacelera visivelmente
- Se timer zerar → tela preta com ruído branco, "CONEXÃO PERDIDA. SISTEMA IRRECUPERÁVEL." + opção de reiniciar

---

## 2. Arquitetura Técnica

### Stack

- **Build:** Vite (dev server com HMR, build para estáticos)
- **Runtime:** Vanilla JavaScript (ES modules nativos, sem framework)
- **Estilo:** CSS nativo 2026 (@layer, CSS Nesting, Container Queries, @property)
- **Deploy:** GitHub Pages / qualquer CDN estático (saída: dist/)

### Estrutura de Arquivos

```
/
├── index.html                    # Ponto de entrada único
├── vite.config.js                # Configuração Vite (mínima)
├── css/
│   ├── design-system.css         # Tokens: cores, tipografia, spacing
│   ├── screens.css               # Layout de cada fase (grid assimétrico)
│   ├── components.css            # Componentes reutilizáveis (portas, circuitos, diagramas)
│   └── animations.css            # @keyframes: pulsar, glitch, cicatrização, scanlines
├── js/
│   ├── state-machine.js          # Máquina de estados + dados globais
│   ├── timer.js                  # Timer diegético (batimento cardíaco)
│   ├── screens/
│   │   ├── boot.js               # Tela de inicialização (5s animados)
│   │   ├── enigma-1.js           # Circuitos lógicos (3 rodadas)
│   │   ├── enigma-2.js           # DER corrompido (3 passos)
│   │   ├── enigma-3.js           # Loop recursivo (2 rodadas)
│   │   └── resolution.js         # Tela de conclusão
│   ├── feedback.js               # Sistema de feedback em camadas
│   └── audio.js                  # Geração de som via Web Audio API
└── assets/                       # (sons gerados por código, sem arquivos externos)
```

### State Machine

```javascript
// Estrutura de estado central
const state = {
  phase: 'boot',           // boot | enigma1 | enigma2 | enigma3 | resolution | gameover
  phaseData: {},           // Dados específicos da fase atual
  attempts: { e1: 0, e2: 0, e3: 0 },
  heartRate: 60,           // bpm — acelera com o tempo
  timeElapsed: 0,          // segundos desde o início
  timeRemaining: 1200,     // 20 minutos em segundos
  checkpoints: []          // Timestamps de enigmas completos
}
```

Transições de fase acionam animações CSS (flash de cicatrização). Nenhuma rota de URL necessária — o state machine controla qual seção está visível via classes CSS.

---

## 3. Sistema de Timer (Diegético)

O timer NÃO é um número regressivo. É o **batimento cardíaco do bio-servidor**, representado como uma barra vertical pulsante na margem direita da tela (sinais vitais do servidor).

### Fases do Batimento

| Tempo Restante | Fase | Cor | Efeitos Visuais | Frequência do Pulso |
|:---:|------|------|------|:---:|
| 100-50% | Estável | #00FF41 (verde) | Interface calma, sem glitch | 60 bpm |
| 50-25% | Alerta | #FF6A00 (laranja) | Glitch sutil nas bordas | 90 bpm |
| 25-10% | Crítica | #FF0033 (vermelho) | Scanlines visíveis, flicker | 130 bpm |
| 10-0% | Terminal | pulsando vermelho/preto | Tela falhando, texto instável | 180+ bpm irregular |

### Checkpoints

Cada enigma completo → o bio-servidor "se estabiliza" → +3 minutos adicionados → frequência cardíaca reduz em 20 bpm.

Game Over: quando o tempo zera → tela de "CONEXÃO PERDIDA" com ruído branco CSS (animação de static) + tom grave de flatline → botão "REINICIAR".

---

## 4. Sistema de Feedback em Camadas

### Princípios (derivados de Flow Theory + Educational Game Design)

1. **Feedback imediato e inambíguo:** cada ação tem consequência visível em <500ms
2. **Erro informativo, não punitivo:** o erro SEMPRE dá uma pista direcional
3. **Progresso visível:** o jogador sempre sabe o quanto já avançou no enigma atual
4. **Níveis de feedback:**

| Nível | Gatilho | Resposta Visual | Resposta Textual |
|-------|---------|-----------------|------------------|
| 1 — Erro | Ação incorreta | Componente "treme" (shake animação), borda vermelha 1s | Diagnóstico: ex. "SINAL INTERMITENTE. VERIFICAR CONEXÃO [LINHA 3]." |
| 2 — Acerto parcial | Ação correta mas incompleta | Componente "acende" em verde, progresso avança | "MÓDULO PARCIALMENTE REATIVADO. 60% DE EFICIÊNCIA." |
| 3 — Acerto total | Todas as condições satisfeitas | Animação de cicatrização (verde varrendo o componente) | "SUBSISTEMA ESTÁVEL. PROSSEGUINDO." → transição automática |
| 4 — Erro recorrente | 3+ erros no mesmo estágio | Pulsação lenta no componente-alvo | Pista mais explícita (ex: "DICA: O fluxo de dados deve passar por uma porta AND.") |

### Mecânica de "Failing Forward"

- Após 4 erros consecutivos no mesmo estágio, o jogo REVELA a resposta correta mas explica o porquê, e avança. O jogador não fica preso num beco sem saída.
- Isso garante que ninguém "morre no enigma 1" e nunca vê o conteúdo dos enigmas 2 e 3.

---

## 5. Mecânica dos Enigmas (Curva Tutorial + Espiral)

### Enigma 1 — Circuitos Lógicos (Nível Médio — Tutorial)

**Subsistema:** Sala de Circuitos do bio-servidor.

**Interface:** Diagrama neural com 3 portas lógicas (AND, OR, NOT). Entradas binárias (A, B) à esquerda, saída esperada (S) à direita. Uma porta faltando no meio. 4 "módulos neurais" flutuantes (opções) na parte inferior.

**Interação:** Arrastar o módulo neural correto para o encaixe vazio.

**Rodada 1 (AND):** A=1, B=0, S=0 → opções: AND, OR, NAND, XOR
**Rodada 2 (OR):** A=1, B=0, S=1 → opções: AND, OR, NOR, XOR
**Rodada 3 (NOT + combinação):** A=1, B=1, S=0 → opções: NAND, AND, NOR, XOR (exige entender que NAND = NOT(AND))

**Tutorial implícito:**
- Rodada 1: ensina a mecânica de arrastar
- Rodada 2: varia o resultado (mesmas entradas, saída diferente)
- Rodada 3: exige conhecer a tabela verdade completa de cada porta

### Enigma 2 — Mapa de Dados Corrompido (Nível Médio-Alto)

**Subsistema:** Sala de Dados do bio-servidor.

**Interface:** Diagrama entidade-relacionamento orgânico. Entidades representadas como células pulsantes com texto opaco/ilegível. Relacionamentos como sinapses desconectadas. Snippets de dados espalhados pela "sala".

**Interação:**
1. **Passo 1 (Identificar):** O jogador vê relacionamentos órfãos e precisa clicar em qual entidade está faltando (múltipla escolha contextual)
2. **Passo 2 (Posicionar):** Arrastar a entidade correta para sua posição no diagrama
3. **Passo 3 (Conectar):** Arrastar linhas de relacionamento entre entidades para reconstruir as conexões

**Contexto educacional:** O DER representa um sistema de gestão educacional (alunos, disciplinas, matrículas, professores). Cada relacionamento modela uma regra de negócio.

**Dica progressiva:** Se errar, o bio-servidor destaca quais entidades têm chaves compatíveis.

### Enigma 3 — Loop Recursivo (Nível Difícil)

**Subsistema:** Módulo Cognitivo Central do bio-servidor.

**Interface:** Pseudocódigo de um algoritmo recursivo exibido como "código fonte do servidor". Padrões fractais se repetindo ao fundo. A cada pulso rápido do batimento cardíaco, o código "treme".

**Interação:**
1. **Passo 1 (Rastrear):** O jogador clica qual seria a saída correta do algoritmo (teste de mesa mental)
2. **Passo 2 (Identificar erro):)** Clicar na linha do código que contém o erro lógico
3. **Passo 3 (Corrigir):** Escolher entre 3 versões da linha — apenas uma corrige o loop

**Rodada 1:** Função fatorial com condição de parada errada (fatorial(0) retorna 0 em vez de 1)
**Rodada 2:** Função de busca binária com chamada recursiva em parâmetros trocados

**Efeito visual de acerto:** Fractais se desenrolam em animação, pulso cardíaco desacelera dramaticamente, interface "cicatriza" com varredura verde.

---

## 6. Identidade Visual (Anti-Slop Compliance)

### Paleta de Cores

| Função | Cor | Uso |
|--------|-----|-----|
| Fundo | #0A0A0B | Preto profundo com textura de carbono orgânico |
| Código saudável | #00FF41 | Verde terminal — elementos estáveis, acertos |
| Degradação | #FF6A00 | Alerta, erros parciais |
| Bioluminescência | gradiente #8B5CF6 → #EC4899 | Elementos neurais vivos, componentes interativos |
| Dados | #00D4FF | Informação, dados íntegros |
| Crítico | #FF0033 | Erro grave, timer terminal |
| Texto primário | #E8E8E8 | Leitura principal (90% contraste) |
| Texto mutado | #6B7280 | Metadados, instruções secundárias |

### Tipografia

| Uso | Fonte | Fallback |
|-----|-------|----------|
| **Títulos** | Syne (700, 900) | sans-serif |
| **Dados e código** | JetBrains Mono (400, 700) | monospace |
| **Narrativa e corpo** | Space Grotesk (400, 500) | sans-serif |

**PROIBIDO:** Inter, Roboto, Arial, system-ui, Fira Code, Courier New.

### Layout

- **Assimétrico intencional:** Nada de "imagem à esquerda, texto à direita"
- Elementos flutuam e se sobrepõem como se fossem parte de um sistema orgânico
- Borda de scanlines sutis (opacidade 0.15) nos cantos da tela
- Background: camadas de radial-gradient simulando textura de tecido orgânico
- Partículas flutuantes (CSS animation) representando "dados neurais" no ambiente

### Animações

- **Pulsar:** componentes interativos pulsam com slow-in-out (3s cycle)
- **Glitch:** controlado, usado apenas em momentos de erro ou tensão
- **Cicatrização:** varredura verde da esquerda para direita (acerto)
- **Flicker:** tela pisca em momentos críticos (timer < 10%)
- **Scanlines:** overlay fixo com opacidade muito baixa (0.05) para textura

---

## 7. Requisitos Técnicos

### Pré-requisitos
- Node.js 18+ e npm (para Vite)
- Navegador moderno (Chrome/Firefox/Edge 2024+) — sem suporte a IE ou legacy

### Comandos

```bash
npm create vite@latest . -- --template vanilla  # Setup inicial
npm install                                       # Instalar Vite
npm run dev                                       # Dev server com HMR
npm run build                                     # Build para produção
```

### Testes
- Cada enigma testável isoladamente via ES modules
- Timer testável independente da UI
- Teste de fluxo completo (boot → resolução) manual

---

## 8. Canvas de Jogador (Player Experience Canvas)

**O que o jogador sente em cada fase:**

| Fase | Emoção Alvo | Estado (Flow Theory) |
|------|-------------|---------------------|
| Boot | Curiosidade, antecipação | Atenção focada, instrução implícita |
| Enigma 1 | Confiança, competência | Flow — baixo desafio, habilidade suficiente |
| Enigma 2 | Tensão controlada, análise | Flow — médio-alto desafio, habilidade crescente |
| Enigma 3 | Tensão alta, determinação | Flow alto — alto desafio, alta habilidade |
| Resolução | Satisfação, alívio | Recompensa intrínseca |

**Momentos de "Aha!":**
- Enigma 1: "AND com essas entradas dá... 0! Entendi!"
- Enigma 2: "Essa entidade tem chave estrangeira compatível com..."
- Enigma 3: "A condição de parada está ANTES da chamada recursiva — é aqui!"

---

## 9. Limites e Tratamento de Erro

### Casos de Borda Previstos

| Situação | Comportamento |
|----------|--------------|
| Timer zera durante um enigma | Transição imediata para tela de Game Over (não perde progresso dos checkpoints salvos em memória) |
| Jogador tenta pular fase | Desabilitado — state machine não permite |
| Jogador dá refresh na página | Jogo recomeça do boot (não há persistência) — experiência de 20 min não justifica localStorage |
| Jogador com deficiência visual | Contraste mínimo 4.5:1 em todos os textos, feedback textual além do visual |
| Tela pequena (< 768px) | Container queries ajustam layout; versão mobile-first |
| Múltiplos cliques rápidos | Debounce de 500ms em todas as interações |

---

## 10. Entregáveis Finais

1. **Link do Jogo:** GitHub Pages (deploy automático da branch main)
2. **Vídeo 1 — Teaser e Instruções** (máx. 2 min): Narrativa + como jogar
3. **Vídeo 2 — Consolidação Pedagógica** (máx. 5 min): Resolução dos enigmas, conceitos abordados

---

*Documento de design validado em 15 de junho de 2026.*
*Próximo passo: Plano de implementação detalhado.*
