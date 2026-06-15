# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MATB21 - Ambientes Interativos de Aprendizagem** (UFBA - Instituto de Computação)

Atividade Final: **O Grande Escape Virtual** — um ecossistema digital gamificado no formato de Escape Room Online, integrando competências técnicas, de gestão, pedagógicas e científicas.

- **Disciplina:** MATB21 - Ambientes Interativos de Aprendizagem
- **Tema:** EdTech e Gamificação na Educação
- **Prazo final:** 22.06.2026 ⚠️
- **Stack:** Vite + Vanilla JS (ES modules) + CSS 2026 (@layer, custom properties) + Vitest
- **Público-alvo:** Estudantes de Ensino Superior em Cursos de Computação
- **Formato:** Grupos interdisciplinares (CC, SI, LC, BI-C&T)

## Status Atual

- **Fase:** Implementação completa — jogo funcional com 5 fases (Boot, 3 Enigmas, Resolução)
- **Tema do jogo:** O Último Servidor Orgânico — bio-servidor degradando, reparo por subsistema
- **Deadline:** 22.06.2026

## Entregáveis Obrigatórios

1. **Link do Jogo** — Solução web própria (Vite + Vanilla JS), deploy via GitHub Pages. Jogo funcional em `/dist/`.
2. **Vídeo 1 — Teaser e Instruções** (máx. 2 min) — Introdução narrativa + como jogar
3. **Vídeo 2 — Consolidação Pedagógica** (máx. 5 min) — Resolução técnica dos enigmas

## Enigmas Implementados

| Enigma | Nível | Mecânica | Conteúdo | Papel |
|--------|-------|----------|----------|-------|
| 1 — Circuitos Lógicos | Médio | Arrastar porta correta para completar circuito (AND/OR/NAND) | Tabelas verdade, portas lógicas | CC |
| 2 — Mapa de Dados Corrompido | Médio-Alto | Identificar entidade ausente + reconectar relacionamentos | DER, chaves estrangeiras, cardinalidade | SI |
| 3 — Loop Recursivo | Difícil | Rastrear execução → identificar linha com erro → escolher correção | Recursão, caso base, stack trace | CC |

## Critérios de Avaliação (Pesos Iguais)

1. **Arquitetura Lógica** — Correção técnica dos enigmas; profundidade dos desafios de código/algoritmos
2. **Engenharia de Usabilidade** — UX, fluidez, estabilidade das validações, timeboxing (20 min)
3. **Transposição Didática** — Eficácia como ferramenta de fixação; clareza do vídeo de consolidação
4. **Análise Científica** — Contextualização social/científica; qualidade da reflexão no formulário

## Papéis da Equipe

- **Analista de Lógica e Algoritmos (CC)** — Arquitetura dos desafios técnicos, enigmas de código/criptografia
- **Engenheiro de UX e Processos (SI)** — Fluxo do usuário, usabilidade, design da interface
- **Designer Pedagógico e Roteirista (LC)** — Transposição didática, narrativa, validação pedagógica
- **Cientista de Dados (BI-C&T)** — Fundamentação epistemológica, métricas, análise estatística

## Arquivos de Referência

- `Atividade Final O Grande Escape Virtual.pdf` — Enunciado completo da atividade com formulário de avaliação

## Comandos de Desenvolvimento

```bash
npm run dev      # Iniciar servidor de desenvolvimento (Vite HMR)
npm run build    # Build de produção (saída em dist/)
npm run preview  # Servir build de produção localmente
npm test         # Rodar todos os testes (Vitest)
npm run test:watch  # Rodar testes em modo watch
npx vitest run src/puzzles/enigma-1-logic.test.js  # Testar um arquivo específico
```

## Deploy

- Push para `main` → GitHub Actions executa `.github/workflows/deploy.yml` → deploy automático no GitHub Pages
- Build local: `npm run build` (saída em `dist/`)
- Preview local do build: `npm run preview`

## Arquitetura do Código

```
├── index.html                 # Ponto de entrada único (Google Fonts, CSS, JS)
├── vite.config.js             # Config Vite + Vitest
├── css/
│   ├── design-system.css      # @layer reset + @layer design-system (tokens, cores, tipografia)
│   ├── screens.css            # @layer screens (layout de cada fase, feedback, scanlines)
│   └── animations.css         # @layer animations (9 @keyframes: pulsar, glitch, flicker, etc.)
├── js/
│   ├── main.js                # Integração: state machine listener + timer loop + render dispatch
│   ├── state-machine.js       # createStateMachine(), PHASES, transições validadas, listeners
│   ├── timer.js               # Timer diegético: fases (stable/alert/critical/terminal), BPM, barra
│   ├── audio.js               # Web Audio API: boot, acerto, erro, flatline, batimento, cicatrização
│   ├── feedback.js            # Feedback em 4 níveis com mensagens diagnósticas em PT-BR
│   ├── particles.js           # Canvas API: 50 partículas neurais flutuantes
│   └── screens/
│       ├── boot.js            # Tela de inicialização (terminal animado, progresso, auto-transição)
│       ├── enigma-1.js        # 3 rodadas de portas lógicas (AND/OR/NAND) com feedback visual
│       ├── enigma-2.js        # 2 passos: identificar entidade + reconectar relacionamento no DER
│       ├── enigma-3.js        # 3 passos: trace → linha erro → correção (2 rodadas)
│       └── resolution.js      # Tela de conclusão + Game Over com flatline
└── src/puzzles/
    ├── enigma-1-logic.js      # Lógica pura: validação de portas (AND/OR/NAND/NOR/XOR)
    ├── enigma-2-logic.js      # Lógica pura: validação de entidade/relacionamento DER
    └── enigma-3-logic.js      # Lógica pura: validação de trace/erro/correção em recursão
```

## Fluxo do Jogo

```
Boot (5s animação) → Enigma 1 (3 rodadas portas lógicas)
  → Enigma 2 (2 passos DER)
    → Enigma 3 (2 rodadas, 3 passos cada)
      → Resolução (estatísticas)
         ou Game Over (se timer zerar)
```

- Timer diegético de 20 min (barra de batimento cardíaco na lateral direita)
- Checkpoints: cada enigma completo adiciona +3 min
- Fases do timer: stable (verde) → alert (laranja) → critical (vermelho) → terminal (flicker)

## Non-obvious Patterns & Gotchas

- **`#app` precisa de `height: 100vh`** — sem altura explícita, o `.screen` com `position: absolute; inset: 0` colapsa para 0px. Manter `#app { height: 100vh; overflow: hidden; }` no `@layer design-system`.
- **Prevenir re-render em timer tick** — `main.js` usa `currentPhase` guard para evitar que `updateTime()` dispare re-render das telas de puzzle a cada 1s (o que resetaria o estado interno dos enigmas).
- **Import paths das screens** — arquivos em `js/screens/` importam de `src/puzzles/` com `../../src/puzzles/enigma-X-logic.js`.
- **CSS @layers** — usar `@layer reset, design-system, screens, animations;` para controle explícito de cascata. Animações (`@keyframes`) são globais, não layer-scoped.
- **AudioContext** — `audio.js` usa lazy initialization via `getContext()`. Requer gesto do usuário na primeira chamada (funciona porque boot chama `playBootSequence()`).
- **setTimeout cleanup** — cada tela usa `setTimeout` para transições. O `main.js` não limpa timers de telas anteriores no unmount (baixo risco porque transições são sempre forward).
