# Design: Melhorias Finais — O Grande Escape Virtual

**Data:** 2026-06-15
**Projeto:** MATB21 — Ambientes Interativos de Aprendizagem
**Deadline:** 22.06.2026

## Resumo

Implementação de 6 frentes de melhoria no jogo "O Grande Escape Virtual" para elevar a nota
de ~8.0 para ~8.8-9.2, endereçando os pontos fracos identificados na avaliação por rubrica.

## 1. Analytics — Sistema de Métricas (js/analytics.js)

### Responsabilidades
- Coleta timestamped de todas as interações do jogador
- Agregação de métricas (tempoPorEnigma, errosPorTipo, hintsUsados)
- Dashboard visual na tela de resolução (canvas nativo, sem dependências)
- Exportação de dados em JSON

### API

```js
const analytics = createAnalytics()

// Coleta
analytics.record('click', { target: 'gate-AND', enigma: 'enigma1', round: 0 })
analytics.record('error', { reason: 'wrong-gate', enigma: 'enigma1' })
analytics.record('hint', { enigma: 'enigma1', round: 0 })
analytics.record('success', { enigma: 'enigma1', round: 0, attempts: 3 })
analytics.record('phase-change', { from: 'enigma1', to: 'enigma2' })

// Consulta
analytics.store.timePerEnigma     // { enigma1: 45, enigma2: 125, enigma3: 342 } (segundos)
analytics.store.errorsByType       // { wrongGate: 3, wrongEntity: 2, wrongTrace: 4, wrongFix: 1 }
analytics.store.hintsUsed          // { enigma1: 1, enigma2: 0, enigma3: 3 }
analytics.store.actions            // Array de todas as ações timestampadas

// Dashboard
renderDashboard(container, analytics.store)

// Exportação
exportAnalyticsData(analytics.store)  // → download de escape-stats-YYYY-MM-DD.json
```

### Estrutura do JSON exportado
```json
{
  "date": "2026-06-15",
  "totalTime": 512,
  "checkpoints": 3,
  "timePerEnigma": { "enigma1": 45, "enigma2": 125, "enigma3": 342 },
  "attempts": { "enigma1": 3, "enigma2": 5, "enigma3": 8 },
  "errorsByType": { "wrongGate": 2, "wrongEntity": 1, "wrongTrace": 4, "wrongFix": 1 },
  "hintsUsed": { "enigma1": 1, "enigma2": 0, "enigma3": 3 },
  "actions": [
    { "type": "click", "target": "gate-OR", "enigma": "enigma1", "round": 0, "timestamp": 5000 },
    { "type": "error", "reason": "wrong-gate", "enigma": "enigma1", "timestamp": 5050 }
  ]
}
```

### Dashboard canvas nativo
- 2 bar charts lado a lado: tempo por enigma, tentativas por enigma
- Linha de erros agregados por tipo
- Tabela recolhível das últimas ações (scroll)
- Botão de exportar dados
- Cores seguindo o design system (green, cyan, purple, orange)

### Integração
- Cada screen de enigma chama `analytics.record()` nos handlers de clique
- `resolution.js` importa `renderDashboard` e `exportAnalyticsData`
- `main.js` mantém referência ao analytics e passa para screens via closure

## 2. Acessibilidade (css/*.css + html)

### 2.1 Contraste
- `--color-muted: #6B7280` → `#9CA3AF` (ratio 7.2:1, AA/AAA)

### 2.2 ARIA
- `role="region"` + `aria-label"` em cada `.screen`
- `aria-live="polite"` no feedback
- `aria-describedby` em botões de puzzle
- `aria-label` em botões de opção
- `role="progressbar"` + `aria-valuenow`/`aria-valuemax` no timer

### 2.3 Navegação por teclado
- `tabindex` em todos os elementos interativos
- `:focus-visible` com glow ciano (#00D4FF)

### 2.4 prefers-reduced-motion
```css
@media (prefers-reduced-motion: reduce) {
  .boot-line { animation: none; width: 100%; }
  .boot-progress-fill { animation: none; width: 100%; }
  .scanlines-overlay { display: none; }
  .timer-bar { transition: none; }
}
```

### 2.5 prefers-contrast: more
```css
@media (prefers-contrast: more) {
  :root {
    --color-text: #FFFFFF;
    --color-muted: #D1D5DB;
    --color-green: #00FF41;
    --glow-green: 0 0 0 transparent;
  }
}
```

## 3. E2 Expandido (src/puzzles/enigma-2-logic.js, js/screens/enigma-2.js)

### Nova rodada
```js
ROUNDS[1] = {
  entities: ['aluno', 'disciplina', 'professor', 'departamento'],
  relationships: ['matricula', 'ministra', 'aloca'],
  missingEntity: 'historico',
  correctRelationship: 'matricula',
}
```

### Mecânica
- Mesmo fluxo da rodada 1 (2 passos: identificar entidade → reconectar relacionamento)
- `enigma-2.js` refatorado para suportar múltiplas rodadas (loop igual E1/E3)
- Conceito pedagógico: entidade associativa em relacionamento N:N

### Testes
- `validates correct entity associativa (round 2)`
- `rejects wrong entity associativa`
- `validates relationship matricula (round 2)`
- `rejects relationship ministra (round 2)`
- `round 2 has historico as missing entity`

## 4. Mobile Responsivo (css/screens.css, js/particles.js)

### Breakpoints
- `@media (max-width: 768px)`: tablets, landscape mobile
- `@media (max-width: 480px)`: portrait mobile
- `@media (orientation: landscape) and (max-height: 500px)`: landscape phones

### Mudanças
- Botões: largura total, padding 14px 20px (mín 44px toque)
- Timer bar: 8px → 4px; em <480px reposiciona para bottom (horizontal)
- Fonte: `pre` 13px → 11px
- Partículas: 50 → 15 em mobile
- Scanlines: opacidade reduzida em mobile (performance)

## 5. Estabilidade (js/dom-utils.js)

### createTimer()
```js
export function createTimer() {
  const timers = new Set()
  return {
    setTimeout: (fn, ms) => {
      const id = setTimeout(() => { timers.delete(id); fn() }, ms)
      timers.add(id)
      return id
    },
    clearAll: () => timers.forEach(clearTimeout),
  }
}
```

Cada screen usa `screenTimer.clearAll()` no início de cada `render` para limpar timeholders
de renders anteriores. Importado nas 4 screens (boot, enigma1, enigma2, enigma3, resolution).

### Proteção clique duplo
No handler de clique de cada opção de puzzle, definir `pointer-events: none` nos botões
antes da animação de feedback. Reativado ao renderizar nova rodada (novos botões).

## 6. Boot Expandido + Hint (js/screens/boot.js, todas screens)

### Boot (js/screens/boot.js)
Adicionar 3 linhas após as existentes:
```
AVISO: BIO-SERVIDOR DEGRADANDO EM 20 MINUTOS.
CADA SUBSISTEMA REPARADO CONCEDE +3 MIN DE ESTABILIDADE.
USE O INDICADOR DE BATIMENTO CARDÍACO NA LATERAL PARA MONITORAR.
```

### Hint contextual
- Botão `?` em cada tela de puzzle (canto superior direito, estilo "?" roxo)
- Ao clicar, revela dica específica da rodada atual (reusa mensagens do sistema de feedback)
- Dicas: reaproveitar os textos de "DICA:" já existentes em `feedback.js`
- Acessível: `aria-label="Obter dica"`, ativável por Enter/Space

## Ordem de Implementação

1. **dom-utils.js + estabilidade** — base para todo o resto (protege contra race conditions)
2. **E2 expandido** — muda dados e lógica (impacta testes)
3. **Boot + Hint** — mudanças localizadas
4. **Analytics** — módulo novo + integração nas screens + resolution
5. **Acessibilidade** — CSS + atributos (pode ser feito em paralelo com analytics)
6. **Mobile** — CSS final (ajustes depois de tudo funcionando)

## Testes

- Estado atual: 44 testes, 6 suites
- Novos testes: ~10 (E2: +5, analytics: +3, timer: +1, feedback: +1)
- Total esperado: ~54 testes
- Nenhuma função de validação existente será modificada (só adições)
