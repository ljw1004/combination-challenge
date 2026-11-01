export interface TutorialCompletion { dragDone: boolean; goalsDone: boolean }
type StorageAccess = () => Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** Independent of manuscript fingerprints and restorable chapter snapshots. */
export class TutorialProgress {
  readonly key: string;
  completion: TutorialCompletion = {dragDone: false, goalsDone: false};
  private report: (message: string) => void;
  private storage: StorageAccess;
  private warning = '';
  constructor(url: string, report: (message: string) => void, storage: StorageAccess = () => localStorage) {
    this.report = report; this.storage = storage;
    this.key = `combination-tutorial-v1:${encodeURIComponent(url)}`;
    try {
      const saved = JSON.parse(storage().getItem(this.key) ?? 'null');
      this.completion = {dragDone: saved?.dragDone === true, goalsDone: saved?.goalsDone === true};
    } catch { this.notify('Tutorial progress could not be restored. Tutorials will be remembered for this session.'); }
  }
  private notify(message: string) {
    if (this.warning === message) return;
    this.warning = message; this.report(message);
  }
  finish(step: keyof TutorialCompletion) {
    if (this.completion[step]) return;
    this.completion[step] = true;
    try { this.storage().setItem(this.key, JSON.stringify(this.completion)); this.notify(''); }
    catch { this.notify('Tutorial progress could not be saved. Completed tutorials may reappear after reloading.'); }
  }
  reset() {
    this.completion = {dragDone: false, goalsDone: false};
    try { this.storage().removeItem(this.key); this.notify(''); }
    catch { this.notify('Tutorial progress could not be reset in browser storage. It has been reset for this session.'); }
  }
}
