import type { Diagnostic } from '../story/types.ts';
import { createStoryEditor, type StoryEditor } from './editor.ts';
import { DraftStore, loadStoryDocument, type StoryDocument } from './story-document.ts';

interface Callbacks {
  onText(text: string): void;
  onLayout(): void;
  onDraft(edited: boolean): void;
  onCheckpoint(line: number): void;
}

/** Draft durability is independent of parser, linter, preview and game progress. */
export class AuthoringSession {
  readonly store: DraftStore;
  readonly url: string;
  text: string;
  assetBaseURL: string;
  edited: boolean;
  isOpen = false;
  private editor?: StoryEditor;
  private diagnostics: Diagnostic[] = [];
  private saveMessage: string;
  private saveKind: 'saved' | 'error' | 'info';
  private previewMessage = '';
  private changeRevision = 0;

  constructor(document: StoryDocument, store: DraftStore, private parent: HTMLElement, private callbacks: Callbacks) {
    this.url = document.url;
    this.store = store;
    this.text = document.text;
    this.assetBaseURL = document.assetBaseURL;
    this.edited = document.edited;
    this.saveMessage = document.warning ?? (this.edited ? 'Saved on this device' : 'Original story — edits save on this device');
    this.saveKind = document.warning ? 'error' : this.edited ? 'saved' : 'info';
    window.addEventListener('beforeunload', event => {
      if (this.store.unsaved) { event.preventDefault(); event.returnValue = ''; }
    });
    window.addEventListener('storage', event => {
      if (!this.store.affectsStorageKey(event.key)) return;
      this.refreshRecoveries();
      const latest = this.store.read().draft;
      if (latest && latest.text !== this.text) {
        this.editor?.setPreviewStatus('Another tab saved a different draft. Your open buffer is unchanged; use Saved copies to compare.');
      }
    });
  }

  open() {
    if (!this.editor) {
      this.editor = createStoryEditor({
        parent: this.parent, text: this.text, storyUrl: this.url,
        onChange: text => this.change(text),
        onClose: () => this.close(),
        onCheckpoint: line => this.callbacks.onCheckpoint(line),
        onDelete: () => { void this.deleteDraft(); },
      });
      this.editor.setDiagnostics(this.diagnostics);
      this.editor.setStatus(this.saveMessage, this.saveKind);
      this.editor.setPreviewStatus(this.previewMessage);
      this.refreshRecoveries();
    }
    this.isOpen = true;
    this.parent.classList.add('editor-open');
    this.editor.setOpen(true);
    this.callbacks.onLayout();
    // Best effort: browsers may refuse persistence; saves still report their actual result.
    void navigator.storage?.persist?.().catch(() => false);
  }

  close() {
    this.isOpen = false;
    this.editor?.setOpen(false);
    this.parent.classList.remove('editor-open');
    this.callbacks.onLayout();
  }

  toggle() { if (this.isOpen) this.close(); else this.open(); }

  private change(text: string) {
    // The durable write happens synchronously in CodeMirror's input transaction.
    this.text = text;
    this.changeRevision++;
    const saved = this.store.save(text);
    this.edited = true;
    this.saveMessage = saved.error ?? saved.warning ?? 'Saved on this device';
    this.saveKind = saved.persisted ? 'saved' : 'error';
    this.editor?.setStatus(this.saveMessage, this.saveKind);
    this.callbacks.onDraft(true);
    this.callbacks.onText(text);
  }

  setDiagnostics(diagnostics: Diagnostic[], phase: 'fast' | 'complete' = 'complete') {
    this.diagnostics = phase === 'fast'
      ? [...diagnostics, ...this.diagnostics.filter(diagnostic => diagnostic.stage === 'deep')]
      : diagnostics;
    this.editor?.setDiagnostics(diagnostics, phase);
  }

  setPreviewStatus(message: string) {
    this.previewMessage = message;
    this.editor?.setPreviewStatus(message);
  }

  private refreshRecoveries() {
    const saved = this.store.read();
    const copies = [saved.draft, ...saved.recoveries].filter(record => record && record.text !== this.text);
    this.editor?.setRecoveries([
      ...copies.map(record => ({ id: record!.revision, text: record!.text, label: `Saved ${new Date(record!.updatedAt).toLocaleString()}` })),
      ...saved.damaged.map(record => ({ id: record.key, text: record.raw, label: 'Unreadable saved record — raw recovery data' })),
    ], text => {
      const replacement = this.store.replace(text);
      if (!replacement.replaced) {
        this.editor?.setStatus(replacement.error ?? 'Keep a copy of the current buffer before replacing it.', 'error');
        return;
      }
      this.text = text;
      this.changeRevision++;
      this.edited = true;
      this.editor?.setText(text);
      this.saveMessage = replacement.error ?? 'Saved on this device';
      this.saveKind = replacement.persisted ? 'saved' : 'error';
      this.editor?.setStatus(this.saveMessage, this.saveKind);
      this.refreshRecoveries();
      this.callbacks.onDraft(true);
      this.callbacks.onText(text);
    });
  }

  private async deleteDraft() {
    try {
      const revision = this.changeRevision;
      const savedRevision = this.store.read().draft?.revision;
      // Retrieve the original first; a failed request must not destroy the draft.
      const original = await loadStoryDocument(this.url, new DraftStore(this.url, { storage: null }));
      if (revision !== this.changeRevision || savedRevision !== this.store.read().draft?.revision) {
        this.editor?.setStatus('Deletion cancelled: the draft changed while the original story was loading. Your edits are kept.', 'info');
        return;
      }
      const deleted = this.store.delete();
      if (!deleted.deleted) throw new Error(deleted.error);
      this.text = original.text;
      this.changeRevision++;
      this.assetBaseURL = original.assetBaseURL;
      this.store.setAssetBaseURL(original.assetBaseURL);
      this.edited = false;
      this.editor?.setText(this.text);
      this.saveMessage = 'Original story — saved draft deleted';
      this.saveKind = 'info';
      this.editor?.setStatus(this.saveMessage, this.saveKind);
      this.refreshRecoveries();
      this.callbacks.onDraft(false);
      this.callbacks.onText(this.text);
    } catch (error) {
      this.editor?.setStatus(`${(error as Error).message} Your current text is still open.`, 'error');
    }
  }
}
