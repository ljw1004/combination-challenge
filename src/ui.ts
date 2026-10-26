/** Public UI DTOs: the adapter supplies observations; this file contains no game rules. */
export interface ChoiceOption { id: string; name: string; description?: string }
export interface CapabilityView {
  id: string;
  name: string;
  description: string;
  actionId?: string;
  requiresTarget?: boolean;
  symbol?: string;
  preservesStructure?: boolean;
}
export interface RecipeView {
  actionId: string;
  inputs: string[];
  result: CapabilityView;
  requiresTarget: boolean;
}
export interface CellView {
  lane: number;
  slot: number;
  label: string;
  pressure: number;
  terrain?: string;
  structure?: { name: string; description?: string; kind?: string };
  asset?: { name: string; health: number; maxHealth: number };
  effects?: string[];
  outlet?: boolean;
  blocked?: boolean;
}
export interface Preview {
  title?: string;
  lines: string[];
  cells?: { lane: number; slot: number; pressure?: number; description?: string }[];
  status?: "playing" | "won" | "lost";
}
export interface GameView {
  scenarioId: string;
  scenarioTitle: string;
  scenarioDescription: string;
  scenarioIndex: number;
  scenarios: ChoiceOption[];
  seed: number;
  variant: string;
  variants: ChoiceOption[];
  turn: number;
  maxTurns: number;
  status: "playing" | "won" | "lost";
  goal: string;
  known: CapabilityView[];
  recipes: RecipeView[];
  cells: CellView[];
  forecast: { turn: number; amount: number; pulse?: [number, number, number]; label?: string }[];
  eventLog: string[];
  history: { cursor: number; length: number };
  waitActionId?: string;
  outcome?: string;
  laneNames?: string[];
  buildLabel?: string;
  finishForecast?: { pulses: number };
}
export interface GameAPI {
  getView(): GameView;
  act(actionId: string, target?: { lane: number; slot: number }): void;
  preview(actionId: string, target?: { lane: number; slot: number }): Preview | null;
  reset(options: { scenario: string; seed: number; variant: string }): void;
  undo(): void;
  seek(index: number): void;
  exportRun(): string;
  importRun(text: string): void;
  finishForecast?(): void;
  subscribe?(render: () => void): (() => void) | void;
}

type Selected = { actionId: string; name: string; description: string; requiresTarget: boolean; preservesStructure?: boolean; kind: "discover" | "deploy" };

const esc = (value: unknown): string => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));
const glyph = (id: string): string => ({ soil: "▰", heat: "☀", brick: "▦", grove: "♠", seed: "✧", water: "≈", earth: "▱", air: "↝", fire: "✳", stone: "◆", mud: "▧", rain: "⋮", channel: "∪", levee: "⌂", wood: "⌁", reed: "╱", reeds: "╱", glass: "◇", clay: "▰", sand: "⋰", steam: "♨", forest: "♧", wetland: "≋", roots: "⤓", pump: "↥", bridge: "⌒", reservoir: "▤", spillway: "↳" }[id.toLowerCase()] ?? "✧");
const house = '<svg class="house-icon" viewBox="0 0 40 32" fill="none" aria-hidden="true"><path d="M3 16 20 3l17 13M8 13v16h24V13M17 29V18h7v11M28 8V3h5v9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const drop = '<svg viewBox="0 0 14 18" fill="currentColor" aria-hidden="true"><path d="M7 0C5 4 0 9 0 12a7 7 0 0 0 14 0C14 9 9 4 7 0Z"/></svg>';

export function mountGame(root: HTMLElement, api: GameAPI): () => void {
  let selected: Selected | null = null;
  let activeTab: "discover" | "deploy" = "discover";
  let labOpen = false;
  let helpOpen = false;
  let notice = "";
  let currentPreview: Preview | null = null;

  const safely = (work: () => void): void => {
    try { notice = ""; work(); currentPreview = null; render(); }
    catch (error) { notice = error instanceof Error ? error.message : String(error); render(); }
  };

  function showPreview(action: Selected | null, target?: { lane: number; slot: number }): void {
    try { currentPreview = action ? api.preview(action.actionId, target) : null; }
    catch (error) { currentPreview = { title: "Choose another place", lines: [error instanceof Error ? error.message : String(error)] }; }
    if (action && target) {
      const cell = api.getView().cells.find(item => item.lane === target.lane && item.slot === target.slot);
      if (cell?.structure && !action.preservesStructure && !cell.blocked && currentPreview) currentPreview = { ...currentPreview, lines: [`Replaces ${cell.structure.name} with ${action.name}.`, ...currentPreview.lines] };
    }
    const area = root.querySelector<HTMLElement>("[data-preview]");
    if (area) area.innerHTML = previewMarkup(currentPreview);
    for (const button of root.querySelectorAll<HTMLElement>("[data-cell]")) {
      const cell = currentPreview?.cells?.find(item => item.lane === Number(button.dataset.lane) && item.slot === Number(button.dataset.slot));
      button.classList.toggle("has-preview", !!cell);
      const badge = button.querySelector<HTMLElement>(".cell-prediction");
      if (badge) badge.textContent = cell?.pressure !== undefined ? `Next: ${cell.pressure} water` : (cell?.description ?? "");
    }
  }

  function previewMarkup(preview: Preview | null): string {
    if (preview) return `<span class="eyebrow">${esc(preview.title ?? "After this action")}</span><ul class="preview-lines">${preview.lines.map(line => `<li>${esc(line)}</li>`).join("")}</ul>${preview.status && preview.status !== "playing" ? `<div class="preview-outcome ${preview.status}">${preview.status === "won" ? "This completes the encounter." : "This would end the encounter in a loss."}</div>` : ""}`;
    return `<span class="eyebrow">Read the watershed</span><p>${selected?.requiresTarget ? `Choose a place for <strong>${esc(selected.name)}</strong>. Hover or focus a tile to see the exact next response.` : selected ? "Review the next response, then commit when you're ready." : "Select a recipe or an established capability. You can inspect a move before spending a turn."}</p>`;
  }

  function select(action: Selected): void {
    selected = selected?.actionId === action.actionId ? null : action;
    notice = "";
    render();
    if (selected && !selected.requiresTarget) showPreview(selected);
  }

  function tileMarkup(cell: CellView, canTarget: boolean): string {
    const waterClass = cell.pressure >= 3 ? "water-high" : cell.pressure > 0 ? "water-low" : "water-none";
    const detail = [cell.label, cell.asset ? `${cell.asset.name}, ${cell.asset.health} of ${cell.asset.maxHealth} health` : "", cell.structure?.name, `${cell.pressure} incoming water next pulse if you wait`, ...(cell.effects ?? [])].filter(Boolean).join(". ");
    return `<button class="board-cell ${waterClass}${cell.structure ? " built" : ""}${cell.asset ? " has-asset" : ""}${canTarget && !cell.blocked ? " targetable" : ""}${cell.outlet ? " is-outlet" : ""}${cell.blocked ? " is-blocked" : ""}" data-cell data-lane="${cell.lane}" data-slot="${cell.slot}" aria-label="${esc(detail)}${cell.blocked ? ". Bedrock, cannot build here" : canTarget ? `. Place ${esc(selected!.name)} here` : ""}">
      <span class="cell-top"><span class="cell-coordinate">${["N", "M", "S"][cell.lane]}${cell.slot + 1}</span><span class="water-count" title="Incoming next pulse if you wait">${drop}<span>${cell.pressure}</span></span></span>
      ${cell.asset ? `<span class="asset-mark">${house}<span>${esc(cell.asset.name)}</span></span><span class="health-dots" aria-label="${cell.asset.health} health">${Array.from({ length: cell.asset.maxHealth }, (_, index) => `<i class="${index < cell.asset!.health ? "healthy" : "damaged"}"></i>`).join("")}</span>` : `<span class="terrain-mark" aria-hidden="true">${cell.blocked ? "◆" : cell.structure ? glyph(cell.structure.kind ?? cell.structure.name) : cell.outlet ? "≈" : cell.slot === 0 ? "⌁" : cell.slot === 1 ? "⋰" : "≋"}</span>`}
      <span class="cell-name">${esc(cell.blocked ? "Bedrock" : cell.structure?.name ?? cell.terrain ?? cell.label)}</span>
      <span class="cell-detail">${esc(cell.blocked ? "Water passes. Cannot build." : cell.structure?.description ?? (cell.effects?.join(" · ") || (cell.outlet ? "Flows out to sea" : "Open ground")))}</span>
      <span class="cell-prediction"></span>
      <span class="target-mark" aria-hidden="true">+</span>
    </button>`;
  }

  function render(): void {
    const currentLab = root.querySelector<HTMLDetailsElement>(".lab-panel");
    if (currentLab) labOpen = currentLab.open;
    const focused = document.activeElement instanceof HTMLElement && root.contains(document.activeElement) ? document.activeElement : null;
    const focusSelector = focused?.hasAttribute("data-cell") ? `[data-cell][data-lane="${focused.dataset.lane}"][data-slot="${focused.dataset.slot}"]`
      : focused?.hasAttribute("data-recipe") ? `[data-recipe="${CSS.escape(focused.dataset.recipe!)}"]`
      : focused?.hasAttribute("data-capability") ? `[data-capability="${CSS.escape(focused.dataset.capability!)}"]`
      : focused?.hasAttribute("data-undo") ? "[data-undo]"
      : focused?.hasAttribute("data-seek") ? "[data-seek]"
      : focused?.hasAttribute("data-tab") ? `[data-tab="${focused.dataset.tab}"]`
      : focused?.hasAttribute("data-help") ? "[data-help]" : null;
    const cardScroll = root.querySelector(".card-list")?.scrollTop ?? 0;
    const view = api.getView();
    const live = view.status === "playing";
    const isReplay = view.history.cursor < view.history.length;
    if (selected && !view.recipes.some(recipe => recipe.actionId === selected!.actionId) && !view.known.some(item => item.actionId === selected!.actionId)) selected = null;
    const scenarioNext = view.scenarios[(view.scenarioIndex + 1) % view.scenarios.length];
    const assetHealth = view.cells.filter(cell => cell.asset).reduce((total, cell) => total + cell.asset!.health, 0);
    const assetMax = view.cells.filter(cell => cell.asset).reduce((total, cell) => total + cell.asset!.maxHealth, 0);
    root.innerHTML = `<div class="game-shell">
      <header class="masthead"><a class="brand" href="#" aria-label="After the Rain, restart current encounter"><span class="brand-mark" aria-hidden="true">↟</span><span>AFTER<br>THE RAIN<span class="brand-note">A game of elemental invention</span></span></a><div class="masthead-right"><span class="prototype-label">FIELD NOTES / 001</span><button class="text-button" data-help aria-expanded="${helpOpen}">${helpOpen ? "Close guide" : "How to play"}<span aria-hidden="true"> ↗</span></button></div></header>
      <nav class="encounter-nav" aria-label="Encounters">${view.scenarios.map((scenario, index) => `<button class="encounter-button ${scenario.id === view.scenarioId ? "active" : ""}" data-scenario="${esc(scenario.id)}" aria-current="${scenario.id === view.scenarioId ? "step" : "false"}"><span class="encounter-number">0${index + 1}</span><span>${esc(scenario.name)}</span>${scenario.id === view.scenarioId ? '<span class="active-dot" aria-hidden="true"></span>' : ""}</button>`).join("")}</nav>
      ${helpOpen ? `<section class="help-panel"><div><span class="eyebrow">The premise</span><h2>Make something useful.<br>Then make a better plan.</h2></div><ol><li><strong>Read the storm.</strong> The forecast shows incoming water on each bank. Water travels east; channels bend it south.</li><li><strong>Choose an invention.</strong> Recipes show their ingredients and result. Known concepts stay available.</li><li><strong>Choose where it belongs.</strong> Select a card, inspect a tile, and click to commit. Each action advances the world.</li><li><strong>Protect the settlements.</strong> Use a temporary intervention to make room for a lasting solution. You can undo and try another branch.</li></ol><p class="help-note">Selecting cards, reading previews, and changing tabs are free. The forecast and tile previews describe the active rules exactly.</p></section>` : ""}
      <section class="mission"><div class="mission-copy"><span class="eyebrow">Encounter 0${view.scenarioIndex + 1} <span class="eyebrow-rule"></span> ${esc(view.scenarioTitle)}</span><h1>Give the water<br> <em>somewhere to go.</em></h1><p>${esc(view.scenarioDescription)}</p></div><div class="mission-objective"><span class="eyebrow">Your objective</span><p>${esc(view.goal)}</p><div class="settlement-status"><span class="status-dot ${assetHealth < assetMax ? "hurt" : ""}"></span><span>${assetHealth} / ${assetMax} settlement health</span></div></div></section>
      <section class="storm-strip" aria-label="Storm forecast"><div class="storm-label"><span class="eyebrow">The storm</span><strong>Turn ${view.turn}<span> / ${view.maxTurns}</span></strong></div><div class="forecast-track">${view.forecast.map(pulse => `<div class="forecast-pulse ${pulse.turn <= view.turn ? "past" : ""} ${pulse.turn === view.turn + 1 ? "next" : ""}" title="Turn ${pulse.turn}: ${pulse.amount} incoming water${pulse.pulse ? ` · North ${pulse.pulse[0]}, middle ${pulse.pulse[1]}, south ${pulse.pulse[2]}` : ""}${pulse.label ? ` · ${esc(pulse.label)}` : ""}"><span class="pulse-bars" aria-hidden="true">${Array.from({ length: Math.max(1, Math.min(6, pulse.amount)) }, () => "<i></i>").join("")}</span>${pulse.pulse ? `<span class="pulse-lanes" aria-label="North ${pulse.pulse[0]}, middle ${pulse.pulse[1]}, south ${pulse.pulse[2]}">${pulse.pulse.map((amount, lane) => `<span><i>${["N", "M", "S"][lane]}</i>${amount}</span>`).join("")}</span>` : `<span class="pulse-value">${pulse.amount}</span>`}<span class="pulse-turn">${pulse.turn === view.turn + 1 ? "NEXT" : String(pulse.turn).padStart(2, "0")}</span></div>`).join("")}</div><span class="forecast-note">North / Middle / South<br><span>One action → one response</span></span></section>
      <main class="play-layout"><section class="watershed" aria-label="Watershed board"><div class="section-heading"><div><span class="eyebrow">The watershed</span><h2>Shape the flow.</h2></div><div class="board-controls"><button class="icon-button" data-undo ${view.history.cursor === 0 ? "disabled" : ""} title="Undo last action">↶ <span>Undo</span></button><button class="icon-button" data-reset title="Restart encounter">↻ <span>Restart</span></button></div></div>
      ${isReplay ? `<div class="replay-notice"><strong>Replaying turn ${view.history.cursor}.</strong> Making a move here starts a new branch.</div>` : ""}
      <div class="board-wrap"><div class="board-inflow"><span>→</span><span>WATER FLOWS EAST → CHANNELS BEND IT SOUTH ↓</span><span>→</span></div><div class="lane-headings">${[0, 1, 2].map(lane => `<span>${esc(["Upstream", "Midstream", "Downstream"][lane])}</span>`).join("")}</div><div class="board-grid">${[0, 1, 2].flatMap(lane => [0, 1, 2].map(slot => {
        const cell = view.cells.find(item => item.lane === lane && item.slot === slot);
        return cell ? tileMarkup(cell, !!selected?.requiresTarget && live) : `<div class="board-cell empty-cell" aria-hidden="true"></div>`;
      })).join("")}</div><div class="board-outflow"><span>≈ ≈ ≈</span><span>SOUTH BANK → OPEN SEA</span><span>≈ ≈ ≈</span></div></div>
      <div class="board-legend"><span>${drop} Next pulse: incoming water if you wait</span><span><i class="legend-health"></i> Settlement health</span><span>N / M / S = North / Middle / South</span></div>
      
      ${notice ? `<div class="notice" role="alert">${esc(notice)}</div>` : ""}
      ${view.status !== "playing" ? `<div class="outcome-card ${view.status}" role="status"><span class="eyebrow">${view.status === "won" ? "The storm has passed" : "A lesson from the water"}</span><h2>${view.status === "won" ? "A little ingenuity.<br>A place still standing." : "The water found a way."}</h2><p>${esc(view.outcome ?? (view.status === "won" ? "Your constructions carried the settlements through the storm." : "A settlement was lost. Revisit a decision or try a different construction."))}</p><div class="outcome-actions"><button class="primary-button" data-${view.status === "won" && scenarioNext ? `next="${esc(scenarioNext.id)}"` : "reset"}>${view.status === "won" && scenarioNext ? "Next encounter →" : "Try again ↻"}</button><button class="text-button" data-undo ${view.history.cursor === 0 ? "disabled" : ""}>Revisit last decision</button></div></div>` : ""}
      </section><aside class="workbench" aria-label="Invention workbench"><div class="section-heading"><div><span class="eyebrow">Your workbench</span><h2>What will you make?</h2></div><span class="turn-cost">1 action / turn</span></div><p class="workbench-intro">Ingredients are ideas. Once established, a capability is yours for this encounter.</p>${view.finishForecast && api.finishForecast ? `<div class="settled-forecast"><span class="eyebrow">Your plan holds</span><p>The full remaining forecast is safe with these constructions. You can let it resolve, or keep experimenting.</p><button class="primary-button" data-finish-forecast>Let the storm pass · ${view.finishForecast.pulses} pulses →</button><span>Every response is recorded in your replay.</span></div>` : ""}<div class="response-panel" data-preview aria-live="polite">${previewMarkup(currentPreview)}</div><div class="workbench-tabs" role="tablist" aria-label="Invention type"><button id="discover-tab" role="tab" aria-selected="${activeTab === "discover"}" aria-controls="card-list" data-tab="discover">Discover <span>${view.recipes.length}</span></button><button id="deploy-tab" role="tab" aria-selected="${activeTab === "deploy"}" aria-controls="card-list" data-tab="deploy">Deploy <span>${view.known.filter(item => item.actionId).length}</span></button></div><div class="card-list" id="card-list" role="tabpanel" aria-labelledby="${activeTab}-tab">
      ${activeTab === "discover" ? (view.recipes.length ? view.recipes.map(recipe => `<button class="invention-card recipe-card ${selected?.actionId === recipe.actionId ? "selected" : ""}" data-recipe="${esc(recipe.actionId)}" ${!live ? "disabled" : ""} aria-pressed="${selected?.actionId === recipe.actionId}"><span class="recipe-equation">${recipe.inputs.map(input => `<span>${esc(input)}</span>`).join('<b>+</b>')}<b>→</b></span><span class="card-title"><span class="concept-glyph" aria-hidden="true">${glyph(recipe.result.id)}</span><strong>${esc(recipe.result.name)}</strong><span class="card-arrow" aria-hidden="true">↗</span></span><span class="card-description">${esc(recipe.result.description)}</span><span class="card-foot">${recipe.requiresTarget ? "Discover & place" : "Establish capability"}<span>${selected?.actionId === recipe.actionId ? "Selected" : "1 turn"}</span></span></button>`).join("") : '<div class="empty-workbench"><span>✧</span><h3>Every path is open.</h3><p>Use your established capabilities to shape what happens next.</p></div>') : view.known.map(item => `<button class="invention-card capability-card ${selected?.actionId === item.actionId ? "selected" : ""}" data-capability="${esc(item.id)}" ${!live || !item.actionId ? "disabled" : ""} aria-pressed="${selected?.actionId === item.actionId}"><span class="card-title"><span class="concept-glyph" aria-hidden="true">${esc(item.symbol ?? glyph(item.id))}</span><strong>${esc(item.name)}</strong><span class="card-arrow" aria-hidden="true">↗</span></span><span class="card-description">${esc(item.description)}</span><span class="card-foot">${item.actionId ? "Available to place" : "Ingredient · combine it"}<span>${item.actionId ? "1 turn" : "Idea"}</span></span></button>`).join("") || '<p class="empty-workbench">Establish a capability to deploy it here.</p>'}
      </div>
      ${selected ? `<div class="selection-panel"><span class="eyebrow">${selected.kind === "discover" ? "Ready to invent" : "Ready to place"}</span><strong>${esc(selected.name)}</strong><p>${selected.requiresTarget ? "Inspect a tile, then click it to commit." : "Establish this concept to make its capability available."}</p>${!selected.requiresTarget ? '<button class="primary-button" data-commit>Establish · 1 turn →</button>' : ""}<button class="text-button" data-cancel>Cancel selection</button></div>` : '<p class="selection-hint">Select a card. Nothing happens until you commit.</p>'}
      <div class="known-concepts"><span class="eyebrow">Ideas you have · ${view.known.length}</span><div>${view.known.map(item => `<span title="${esc(item.description)}">${esc(item.name)}</span>`).join("")}</div></div>
      
      ${view.waitActionId ? `<button class="wait-button" data-wait ${!live ? "disabled" : ""}>Let the world advance <span>Wait 1 turn →</span></button>` : ""}
      </aside></main>
      <section class="journal"><div class="section-heading"><div><span class="eyebrow">Field journal</span><h2>Every action leaves a trace.</h2></div><span class="journal-turn">${view.eventLog.length} observations</span></div><ol class="event-log">${view.eventLog.slice(-8).reverse().map((event, index) => `<li><span class="event-number">${String(view.eventLog.length - index).padStart(2, "0")}</span><p>${esc(event)}</p></li>`).join("") || '<li><span class="event-number">00</span><p>The storm is approaching. Your first invention is still yours to choose.</p></li>'}</ol></section>
      <details class="lab-panel" ${labOpen ? "open" : ""}><summary>Replay & experiment <span>Seeds, saved runs, and alternate rules</span></summary><div class="lab-content"><div class="replay-control"><label for="replay-position">Decision history <span>${view.history.cursor} / ${view.history.length}</span></label><input id="replay-position" data-seek type="range" min="0" max="${view.history.length}" value="${view.history.cursor}" ${view.history.length === 0 ? "disabled" : ""}><p>Move back to inspect a decision. Playing from there creates a new branch.</p></div><form class="rules-form"><label for="seed-input">Scenario seed<input id="seed-input" name="seed" type="number" value="${view.seed}" min="0" step="1" required></label><label for="variant-input">Rules variant<select id="variant-input" name="variant">${view.variants.map(variant => `<option value="${esc(variant.id)}" ${variant.id === view.variant ? "selected" : ""}>${esc(variant.name)}</option>`).join("")}</select></label><button class="secondary-button" type="submit">Start with these rules ↗</button></form><p class="variant-description">${esc(view.variants.find(variant => variant.id === view.variant)?.description ?? "")}</p><div class="save-controls"><button class="secondary-button" data-export>Export replay ↓</button><label class="secondary-button import-button">Import replay ↑<input type="file" accept="application/json,.json" data-import></label><span>${esc(view.buildLabel ?? "Local prototype · deterministic replay")}</span></div></div></details>
      <footer class="footer"><span>AFTER THE RAIN</span><p>Combine ideas. Change the world. See what follows.</p><span>PROTOTYPE / COMBINATION CHALLENGE</span></footer>
    </div>`;
    bind(view);
    const cardList = root.querySelector(".card-list");
    if (cardList) cardList.scrollTop = cardScroll;
    if (focusSelector) root.querySelector<HTMLElement>(focusSelector)?.focus({ preventScroll: true });
  }

  function bind(view: GameView): void {
    const one = <T extends Element = HTMLElement>(selector: string): T | null => root.querySelector<T>(selector);
    const reset = (scenario = view.scenarioId): void => safely(() => { selected = null; api.reset({ scenario, seed: view.seed, variant: view.variant }); });
    one(".brand")?.addEventListener("click", event => { event.preventDefault(); reset(); });
    one("[data-help]")?.addEventListener("click", () => { helpOpen = !helpOpen; render(); });
    root.querySelectorAll<HTMLElement>("[data-scenario]").forEach(button => button.addEventListener("click", () => reset(button.dataset.scenario)));
    root.querySelectorAll<HTMLElement>("[data-reset]").forEach(button => button.addEventListener("click", () => reset()));
    root.querySelectorAll<HTMLElement>("[data-undo]").forEach(button => button.addEventListener("click", () => safely(() => { selected = null; api.undo(); })));
    root.querySelectorAll<HTMLElement>("[data-next]").forEach(button => button.addEventListener("click", () => reset(button.dataset.next)));
    root.querySelectorAll<HTMLElement>("[data-tab]").forEach(button => button.addEventListener("click", () => { activeTab = button.dataset.tab as typeof activeTab; render(); }));
    root.querySelectorAll<HTMLElement>("[data-recipe]").forEach(button => {
      const recipe = view.recipes.find(item => item.actionId === button.dataset.recipe)!;
      const action: Selected = { actionId: recipe.actionId, name: recipe.result.name, description: recipe.result.description, requiresTarget: recipe.requiresTarget, preservesStructure: recipe.result.preservesStructure, kind: "discover" };
      button.addEventListener("click", () => select(action));
      button.addEventListener("mouseenter", () => { if (!action.requiresTarget) showPreview(action); });
      button.addEventListener("focus", () => { if (!action.requiresTarget) showPreview(action); });
    });
    root.querySelectorAll<HTMLElement>("[data-capability]").forEach(button => {
      const item = view.known.find(capability => capability.id === button.dataset.capability)!;
      if (!item.actionId) return;
      button.addEventListener("click", () => select({ actionId: item.actionId!, name: item.name, description: item.description, requiresTarget: item.requiresTarget ?? true, preservesStructure: item.preservesStructure, kind: "deploy" }));
    });
    root.querySelectorAll<HTMLElement>("[data-cell]").forEach(button => {
      const target = { lane: Number(button.dataset.lane), slot: Number(button.dataset.slot) };
      button.addEventListener("mouseenter", () => { if (selected?.requiresTarget) showPreview(selected, target); });
      button.addEventListener("focus", () => { if (selected?.requiresTarget) showPreview(selected, target); });
      button.addEventListener("click", () => {
        if (selected?.requiresTarget && view.status === "playing" && !view.cells.find(cell => cell.lane === target.lane && cell.slot === target.slot)?.blocked) safely(() => { api.act(selected!.actionId, target); selected = null; });
      });
    });
    one("[data-commit]")?.addEventListener("click", () => safely(() => { if (selected) api.act(selected.actionId); selected = null; }));
    one("[data-cancel]")?.addEventListener("click", () => { selected = null; currentPreview = null; render(); });
    const wait = one("[data-wait]");
    wait?.addEventListener("click", () => safely(() => { selected = null; api.act(view.waitActionId!); }));
    const waitPreview: Selected = { actionId: view.waitActionId ?? "", name: "Wait", description: "", requiresTarget: false, kind: "deploy" };
    wait?.addEventListener("mouseenter", () => showPreview(waitPreview));
    wait?.addEventListener("focus", () => showPreview(waitPreview));
    one("[data-finish-forecast]")?.addEventListener("click", () => safely(() => { selected = null; api.finishForecast?.(); }));
    one<HTMLInputElement>("[data-seek]")?.addEventListener("change", event => safely(() => { selected = null; api.seek(Number((event.target as HTMLInputElement).value)); }));
    one<HTMLDetailsElement>(".lab-panel")?.addEventListener("toggle", event => { const details = event.target as HTMLDetailsElement; if (details.isConnected) labOpen = details.open; });
    one<HTMLFormElement>(".rules-form")?.addEventListener("submit", event => {
      event.preventDefault();
      const form = new FormData(event.target as HTMLFormElement);
      safely(() => { selected = null; api.reset({ scenario: view.scenarioId, seed: Number(form.get("seed")), variant: String(form.get("variant")) }); });
    });
    one("[data-export]")?.addEventListener("click", () => safely(() => {
      const blob = new Blob([api.exportRun()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = `after-the-rain-${view.scenarioId}-${view.seed}.json`; anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      notice = "Replay exported.";
    }));
    one<HTMLInputElement>("[data-import]")?.addEventListener("change", async event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) { const text = await file.text(); safely(() => { selected = null; api.importRun(text); notice = "Replay imported."; }); }
    });
  }

  render();
  const unsubscribe = api.subscribe?.(render);
  return () => { unsubscribe?.(); root.innerHTML = ""; };
}
