/** Presentation-only debugging controls. Game actions stay with the browser controller. */
export interface DebugToolsState {
  canUndo: boolean;
  recipes: string[];
  saveError: string;
}

export function createDebugTools(onUndo: () => void, onExport: () => void) {
  const actions = document.createElement('div');
  actions.className = 'debug-actions';
  const undo = document.createElement('button');
  undo.type = 'button'; undo.className = 'editor-button'; undo.textContent = 'Undo';
  undo.title = 'Undo the last game action'; undo.addEventListener('click', onUndo);
  const exportSave = document.createElement('button');
  exportSave.type = 'button'; exportSave.className = 'editor-button'; exportSave.textContent = 'Export save';
  exportSave.addEventListener('click', onExport);
  actions.append(undo, exportSave);

  const inspector = document.createElement('details');
  inspector.className = 'debug-recipes';
  const summary = document.createElement('summary'); summary.textContent = 'Recipe inspector';
  const list = document.createElement('ul');
  inspector.append(summary, list);
  const error = document.createElement('p');
  error.className = 'debug-save-error'; error.setAttribute('role', 'alert'); error.hidden = true;
  let previousRecipes = '';
  return {
    actions, inspector, error,
    update(state: DebugToolsState) {
      undo.disabled = !state.canUndo;
      error.textContent = state.saveError; error.hidden = !state.saveError;
      const signature = JSON.stringify(state.recipes);
      if (signature === previousRecipes) return;
      previousRecipes = signature;
      list.replaceChildren(...state.recipes.map(recipe => {
        const item = document.createElement('li'); item.textContent = recipe; return item;
      }));
    },
  };
}
