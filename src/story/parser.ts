import type { Story, Source, Ref, Item, Icon, Recipe, Ingredient, Fate, Chapter, Goal, Condition, FateSite } from './types.ts';
import {sourceMap} from './source-map.ts';

interface Line { text: string; line: number }
interface Bullet { text: string; line: number; indent: number; children: Bullet[]; prose: string[] }

/** Split grammar punctuation only outside quoted names, code identifiers and brackets. */
function splitLocated(text: string, delimiter: string): {text: string; from: number; to: number}[] {
  const parts: {text: string; from: number; to: number}[] = []; let start = 0, depth = 0, quote = '', emphasis = '';
  const push = (end: number) => {
    const raw = text.slice(start, end), from = start + raw.length - raw.trimStart().length;
    parts.push({text: raw.trim(), from, to: Math.max(from, start + raw.trimEnd().length)});
  };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote) { if (c === quote && text[i - 1] !== '\\') quote = ''; continue; }
    if (emphasis) { if (text.startsWith(emphasis, i)) { i += emphasis.length - 1; emphasis = ''; } continue; }
    if (c === '`' || c === '"' || (c === "'" && (i === 0 || /[\s+@,]/.test(text[i - 1])) && text.indexOf("'", i + 1) >= 0)) { quote = c; continue; }
    if ((c === '*' || c === '_') && (i === 0 || /[\s+@,]/.test(text[i - 1]))) { emphasis = text.slice(i, i + 2) === c + c ? c + c : c; i += emphasis.length - 1; continue; }
    if ('[('.includes(c)) depth++;
    else if ('])'.includes(c)) depth--;
    else if (!depth && text.startsWith(delimiter, i)) { push(i); i += delimiter.length - 1; start = i + 1; }
  }
  push(text.length); return parts;
}
export function splitOutside(text: string, delimiter: string): string[] {
  return splitLocated(text, delimiter).map(part => part.text);
}
export function unquote(raw: string): string {
  let text = raw.trim();
  for (const mark of ['**', '__', '"', "'", '*', '_']) if (text.startsWith(mark) && text.endsWith(mark) && text.length > mark.length * 2) text = text.slice(mark.length, -mark.length).trim();
  return text;
}
function bullets(lines: Line[]): Bullet[] {
  const roots: Bullet[] = [], stack: Bullet[] = [];
  for (const { text, line } of lines) {
    const match = /^(\s*)[-*] (.*)$/.exec(text);
    if (match) {
      const node: Bullet = { text: match[2], line, indent: match[1].length, children: [], prose: [] };
      while (stack.length && stack.at(-1)!.indent >= node.indent) stack.pop();
      (stack.at(-1)?.children ?? roots).push(node); stack.push(node);
    } else if (text.trim()) {
      const indent = text.length - text.trimStart().length;
      while (stack.length && stack.at(-1)!.indent >= indent) stack.pop();
      if (stack.length) stack.at(-1)!.prose.push(text.trim());
    } else if (stack.length) stack.at(-1)!.prose.push('');
  }
  return roots;
}

/** Backgrounds use a whole image paragraph, never an image embedded in prose. */
function paragraphImage(paragraph: string): string | undefined {
  return /^!\[[^\]]*\]\(([^)]+)\)$/.exec(paragraph.trim())?.[1];
}

export function parseStory(markdown: string, options: { id?: string; file?: string } = {}): Story {
  const file = options.file ?? 'story.md', source = sourceMap(markdown, file).line;
  const story: Story = { id: options.id ?? 'story', title: '', description: '', chapters: [], items: {}, hotspots: {}, recipes: [], diagnostics: [], source: source(1), fateSites: [] };
  const originalLines = markdown.split(/\r\n?|\n/), spellings = new WeakMap<Ref, string>();
  const error = (code: string, message: string, line: number, fragment?: string) => {
    const location = source(line, fragment);
    story.diagnostics.push({ severity: 'error', code, message, source: location, span: location.span!, stage: 'fast' });
  };
  const declared = new Map<string, string>(), recipes = new Map<string, Recipe>();
  const lines: Line[] = []; let note = false;
  markdown.replace(/\r\n?/g, '\n').split('\n').forEach((text, index) => {
    if (/^\s*>\s*NOTE:/.test(text)) note = true;
    if (note && /^\s*>/.test(text)) return;
    note = false; lines.push({ text, line: index + 1 });
  });
  function ref(raw: string, line: number, kind: 'item' | 'hotspot' = 'item'): Ref {
    let text = unquote(raw.trim()), exclusive: string | undefined, rename: { chapter: string; name: string } | undefined, compound = false;
    let match: RegExpExecArray | null;
    if ((match = /\s+\(exclusive with (.+)\)$/.exec(text))) { exclusive = match[1]; text = text.slice(0, match.index); }
    if ((match = /\s+\(or from chapter (.+)\)$/.exec(text))) { const parts = splitOutside(match[1], ','); rename = { chapter: unquote(parts.shift() ?? ''), name: unquote(parts.join(', ')) }; text = text.slice(0, match.index); }
    if (/\s+\(compound\)$/.test(text)) { compound = true; text = text.replace(/\s+\(compound\)$/, ''); }
    const coordinate = /\s+\(at (-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\)$/.exec(text);
    if (coordinate) text = text.slice(0, coordinate.index);
    let slots: string[] = [];
    if ((match = /\[([^\[\]]*)\]$/.exec(text))) { slots = match[1].trim() ? splitOutside(match[1], ',').map(x => ref(x, line).id) : []; text = text.slice(0, match.index); }
    text = unquote(text);
    const named = /^`([^`]+)`(?:\s+(.+))?$/.exec(text), id = named ? `id:${named[1]}` : `name:${text}`;
    const name = named ? unquote(named[2] ?? named[1]) : text;
    if (!text) error('empty-reference', 'Expected a named item or hotspot.', line);
    if (named?.[2]) {
      if (declared.has(id) && declared.get(id) !== name) error('identifier-clash', `Identifier ${named[1]} was already declared as ${declared.get(id)}; the first declaration is used.`, line, '`' + named[1] + '`');
      else declared.set(id, name);
    }
    if (kind === 'item') {
      let item = story.items[id];
      if (!item) item = story.items[id] = { id, name, compound, slots: [], wonders: [], renames: [], source: source(line, raw.trim()) };
      if (named?.[2] && declared.get(id) === name) item.name = name;
      item.compound ||= compound;
      if (exclusive) {
        const partner = ref(exclusive, line).id;
        if (item.exclusiveWith && item.exclusiveWith !== partner) error('multiple-exclusions', `${item.name} is exclusive with more than one item.`, line);
        else item.exclusiveWith = partner;
      }
      if (rename && !item.renames.some(r => r.chapter === rename.chapter && r.name === rename.name)) item.renames.push(rename);
    } else {
      if (!story.hotspots[id]) story.hotspots[id] = { id, name, source: source(line) };
      if (named?.[2]) story.hotspots[id].name = declared.get(id) ?? name;
      if (coordinate) { story.hotspots[id].x = +coordinate[1] / 100; story.hotspots[id].y = +coordinate[2] / 100; }
    }
    const result = {id, slots}; spellings.set(result, raw.trim()); return result;
  }
  function ingredient(raw: string, line: number): Ingredient {
    const match = /\s+\[(consume|transform|preserve)\]$/.exec(raw.trim());
    return { ref: ref(match ? raw.trim().slice(0, match.index) : raw, line), fate: (match?.[1] ?? 'preserve') as Fate, explicit: !!match };
  }
  function operandSpelling(value: Ref): string | undefined {
    const atom = (id: string): string | undefined => {
      if (id.startsWith('id:')) return `\`${id.slice(3)}\``;
      const name = id.slice(5);
      const marker = ['"', "'", '**', '__'].find(mark => !name.includes(mark) && (mark.length > 1 || !name.endsWith('\\')));
      return marker ? `${marker}${name}${marker}` : undefined;
    };
    if (value.id.startsWith('id:')) {
      const slots = value.slots.map(atom);
      if (slots.some(slot => slot === undefined)) return;
      return `${atom(value.id)}${slots.length ? `[${slots.join(',')}]` : ''}`;
    }
    const original = spellings.get(value);
    if (original && ['+', '@', '->'].every(delimiter => splitOutside(original, delimiter).length === 1)) return original;
    const name = atom(value.id), slots = value.slots.map(atom);
    if (!name || slots.some(slot => slot === undefined)) return;
    return `${name}${slots.length ? `[${slots.join(',')}]` : ''}`;
  }
  function rule(raw: string, line: number, parent?: Ref, at?: string): Recipe | undefined {
    const arrow = splitLocated(raw, '->'); if (arrow.length !== 2) { error('recipe-syntax', `Expected a single -> in ${raw}.`, line); return; }
    const context = splitLocated(arrow[0].text, '@');
    if (context.length > 2) error('recipe-context', 'A combination can have only one hotspot.', line);
    const plus = splitLocated(context[0].text, '+');
    const reagent = plus[0].text ? ingredient(plus[0].text, line) : parent ? { ref: parent, fate: 'preserve' as Fate, explicit: false } : undefined;
    if (!reagent) { error('missing-parent', 'A shorthand combination needs a parent item or result.', line); return; }
    if (plus.length > 2) error('binary-combination', 'A combination accepts at most two items.', line);
    const recipe: Recipe = { id: '', a: reagent, ...(plus[1]?.text ? { b: ingredient(plus[1].text, line) } : {}), ...(context[1]?.text ? { hotspot: ref(context[1].text, line, 'hotspot').id } : at ? { hotspot: at } : {}), result: ref(arrow[1].text, line), source: source(line) };
    if (!recipe.b && !recipe.hotspot) error('missing-operand', 'Combine two items, one item at a hotspot, or two items at a hotspot.', line);
    if (parent && ![recipe.a.ref.id, recipe.b?.ref.id].includes(parent.id)) error('nested-reagent', 'A nested rule must use its parent item or result.', line);
    const original = originalLines[line - 1], offset = original?.lastIndexOf(raw) ?? -1;
    const rawStart = source(line).span!.from - (source(line).column! - 1) + offset;
    for (const [position, input] of [recipe.a, recipe.b].entries()) {
      if (!input) continue;
      const part = plus[position], annotation = /\[(consume|transform|preserve)\]$/.exec(part.text);
      const site: FateSite = {item: input.ref.id, fate: input.fate};
      if (offset >= 0) {
        const start = rawStart + arrow[0].from + context[0].from + part.from;
        if (!part.text) {
          const spelling = operandSpelling(input.ref);
          if (spelling) site.edit = {span: {from: start, to: start}, prefix: `${spelling} `, suffix: ' '};
        } else if (input.explicit && annotation) {
          site.edit = {span: {from: start + annotation.index, to: start + part.text.length}, prefix: '', suffix: ''};
        } else {
          site.edit = {span: {from: start + part.text.length, to: start + part.text.length}, prefix: ' ', suffix: ''};
        }
      }
      story.fateSites!.push(site);
    }
    const key = JSON.stringify([recipe.a, recipe.b, recipe.hotspot, recipe.result]);
    if (recipes.has(key)) return recipes.get(key)!;
    recipe.id = `recipe:${story.recipes.length + 1}`; recipes.set(key, recipe); story.recipes.push(recipe); return recipe;
  }
  function wonder(item: Item, prose: string[], line: number) {
    let markdown = prose.join('\n').trim(); if (!markdown) return;
    const qualified = /^\[([^\]]+)\]\s*/.exec(markdown), requires = qualified ? splitOutside(qualified[1], ',').map(x => ref(x, line).id) : [];
    if (qualified) markdown = markdown.slice(qualified[0].length);
    if (!item.wonders.some(w => w.markdown === markdown && JSON.stringify(w.requires) === JSON.stringify(requires))) item.wonders.push({ markdown, requires, source: source(line) });
  }
  function icon(raw: string, line: number, itemPosition = false): Icon | undefined {
    const match = /^icon:\s*!\[[^\]]*\]\(([^)]+)\)(.*)$/.exec(raw);
    const invalid = () => error('icon-syntax', 'Use icon: ![icon](path), optionally followed by (circular) and (at 70%, 80%) in either order, each at most once.', line, raw);
    if (!match || !match[1].trim()) {
      invalid();
      return;
    }
    let tail = match[2].trim(), circular = false, position: Icon['position'];
    while (tail) {
      const marker = /^(\(circular\)|\(at (-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\))/.exec(tail);
      if (!marker || (marker[1] === '(circular)' ? circular : position !== undefined)) { invalid(); return; }
      if (marker[1] === '(circular)') circular = true;
      else position = {x: +marker[2] / 100, y: +marker[3] / 100};
      tail = tail.slice(marker[0].length).trim();
    }
    if (position && !itemPosition) error('icon-position', 'Starting coordinates belong only to primitive item icons; hotspot centres belong on the hotspot declaration and slot overlays align with their owner.', line, raw);
    return {url: match[1].trim(), circular, ...(position ? {position} : {}), source: source(line, raw)};
  }
  function assignIcon(target: {name: string; icon?: Icon}, node: Bullet, itemPosition = false) {
    const value = icon(node.text, node.line, itemPosition);
    if (node.children.length || node.prose.some(text => text.trim())) error('icon-syntax', 'An icon declaration contains only its image and optional markers.', node.line, node.text);
    if (!value) return;
    if (target.icon && (target.icon.url !== value.url || target.icon.circular !== value.circular || target.icon.position?.x !== value.position?.x || target.icon.position?.y !== value.position?.y)) error('conflicting-icon', `${target.name} already has a different icon; the first declaration is used.`, node.line, node.text);
    else target.icon ??= value;
  }
  function itemNode(node: Bullet, parent?: Ref, at?: string, topLevelItem = false): Ref | undefined {
    if (/^icon\s*:/.test(node.text)) {
      error('icon-placement', 'An item icon belongs directly beneath a top-level Items declaration.', node.line, node.text);
      return;
    }
    const isRule = splitOutside(node.text, '->').length > 1;
    const result = isRule ? rule(node.text, node.line, parent, at)?.result : ref(node.text, node.line);
    if (!result) return;
    const item = story.items[result.id]; wonder(item, node.prose, node.line);
    for (const child of node.children) {
      if (/^icon\s*:/.test(child.text)) {
        if (!topLevelItem || isRule) {
          error('icon-placement', 'An item icon belongs directly beneath a top-level Items declaration.', child.line, child.text);
          continue;
        }
        assignIcon(item, child, true);
        continue;
      }
      const slot = /^(?:slot:\s*(.+?),\s*|unnamed slot:\s*)accepts\s+(.+)$/.exec(child.text);
      if (slot) {
        const parts = splitLocated(slot[2], ','), iconIndex = parts.findIndex(part => /^icon\s*:/.test(part.text));
        const accepts = iconIndex < 0 ? slot[2] : slot[2].slice(0, iconIndex ? parts[iconIndex - 1].to : 0);
        const value = iconIndex < 0 ? undefined : icon(slot[2].slice(parts[iconIndex].from), child.line);
        item.slots.push({ ...(slot[1] ? { name: unquote(slot[1]) } : {}), accepts: ref(accepts, child.line).id, ...(value ? {icon: value} : {}), source: source(child.line) });
      }
      else itemNode(child, result, at);
    }
    return result;
  }
  function operator(text: string): { text: string; operator?: 'and' | 'or'; next: boolean } {
    let next = false, op: 'and' | 'or' | undefined, match;
    while ((match = /^(next|either|or|both|and):\s*/.exec(text))) { if (match[1] === 'next') next = true; else op = ['both','and'].includes(match[1]) ? 'and' : 'or'; text = text.slice(match[0].length); }
    return { text, operator: op, next };
  }
  function condition(raw: string, line: number): Condition {
    if (splitOutside(raw, '->').length > 1) { const result = rule(raw, line)?.result ?? ref('', line); return { item: result, source: source(line) }; }
    const parts = splitOutside(raw, '@'); return { item: ref(parts[0], line), ...(parts[1] ? { hotspot: ref(parts[1], line, 'hotspot').id } : {}), source: source(line) };
  }
  const chapterLines: { heading: Line; lines: Line[] }[] = []; let preamble: Line[] = [];
  for (const line of lines) {
    if (/^## /.test(line.text)) chapterLines.push({ heading: line, lines: [] });
    else if (chapterLines.length) chapterLines.at(-1)!.lines.push(line);
    else preamble.push(line);
  }
  const title = preamble.find(l => /^# /.test(l.text)); story.title = title?.text.slice(2).trim() ?? options.id ?? 'Untitled story';
  if (!title) error('missing-title', 'A story needs a # title.', 1);
  story.description = preamble.filter(l => l !== title).map(l => l.text).join('\n').trim();
  const cover = paragraphImage(story.description.split(/\n\s*\n/)[0] ?? '');
  if (cover) story.cover = cover;
  for (const block of chapterLines) {
    const chapter: Chapter = { id: `chapter:${story.chapters.length}`, name: block.heading.text.slice(3).trim(), intro: '', skipped: '', hotspots: [], items: [], goals: [], goalOperator: 'and', source: source(block.heading.line) };
    const sections = new Map<string, Line[]>(); let current = 'intro'; sections.set(current, []);
    for (const line of block.lines) {
      const section = /^\*\*(Goals|Hotspots|Items|Combinations)\*\*\s*$/.exec(line.text);
      if (section) {
        current = section[1];
        if (!sections.has(current)) sections.set(current, []);
        if (current === 'Goals' && !chapter.goalsSource) chapter.goalsSource = source(line.line);
      }
      else sections.get(current)!.push(line);
    }
    const intro = sections.get('intro')!.map(l => l.text).join('\n').trim().split(/\n\s*\n/);
    const background = paragraphImage(intro[0] ?? '');
    if (background) { chapter.image = background; intro.shift(); }
    chapter.intro = intro.filter(p => !p.startsWith('[If skipped]')).join('\n\n').trim();
    chapter.skipped = intro.filter(p => p.startsWith('[If skipped]')).map(p => p.replace(/^\[If skipped\]\s*/, '')).join('\n\n');
    const goalOps = new Set<string>();
    for (const node of bullets(sections.get('Goals') ?? [])) {
      const prefix = operator(node.text), parts = splitOutside(prefix.text, '--'); if (prefix.operator) goalOps.add(prefix.operator);
      const goal: Goal = { id: `${chapter.id}/goal:${chapter.goals.length}`, text: unquote(parts[0]), next: prefix.next, operator: 'or', conditions: [], source: source(node.line) };
      if (goal.next && !chapter.goals.length) error('first-next', 'The first goal cannot use next:.', node.line, 'next:');
      if (parts[1] && node.children.length) error('mixed-goal-form', 'An inline goal condition cannot also have condition sub-bullets.', node.line);
      const conditions = parts[1] ? [{ text: parts.slice(1).join('--'), line: node.line, children: [] as Bullet[] }] : node.children;
      const ops = new Set<string>();
      for (const child of conditions) { const p = operator(child.text); if (p.operator) ops.add(p.operator); goal.conditions.push(condition(p.text, child.line)); if (child.children.length) error('nested-condition', 'Goal conditions cannot have nested compositions.', child.line); }
      if (ops.size > 1) error('mixed-conditions', 'Do not mix conjunction and disjunction in a goal.', node.line);
      if (ops.has('and')) goal.operator = 'and';
      if (!goal.conditions.length) error('empty-goal', 'A goal needs one or more conditions.', node.line);
      chapter.goals.push(goal);
    }
    if (goalOps.size > 1) error('mixed-goals', 'Do not mix conjunction and disjunction between goal chains.', block.heading.line);
    if (goalOps.has('or')) chapter.goalOperator = 'or';
    for (const node of bullets(sections.get('Hotspots') ?? [])) {
      const h = ref(node.text, node.line, 'hotspot'); chapter.hotspots.push(h.id);
      for (const child of node.children) {
        if (/^icon\s*:/.test(child.text)) assignIcon(story.hotspots[h.id], child);
        else itemNode(child, undefined, h.id);
      }
    }
    for (const node of bullets(sections.get('Items') ?? [])) { const result = itemNode(node, undefined, undefined, true); if (result) chapter.items.push(result); }
    for (const node of bullets(sections.get('Combinations') ?? [])) itemNode(node);
    story.chapters.push(chapter);
  }
  for (const item of Object.values(story.items)) {
    if (item.id.startsWith('id:') && !declared.has(item.id)) error('undeclared-id', `Backtick identifier ${item.id.slice(3)} has no declaration with a display name.`, item.source.line);
    for (const slot of item.slots) story.recipes.push({ id: `install:${item.id}:${slot.accepts}`, a: { ref: { id: item.id, slots: [] }, fate: 'preserve', explicit: true }, b: { ref: { id: slot.accepts, slots: [] }, fate: 'consume', explicit: true }, result: { id: item.id, slots: [slot.accepts] }, installation: slot.accepts, source: slot.source });
  }
  if (!story.chapters.length) error('missing-chapters', 'A story needs at least one ## chapter.', 1);
  return story;
}
