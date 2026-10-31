import { markdown } from './markdown.ts';
import { resolveStoryAsset } from './story-document.ts';

/** Catalogue prose still belongs to its manuscript, not the catalogue directory. */
export function catalogueDescription(description: string, storyPath: string, catalogueURL: string): string {
  const storyURL = new URL(storyPath, catalogueURL).href;
  return markdown(description, reference => {
    try { return resolveStoryAsset(reference, storyURL); }
    catch { return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E'; }
  });
}
