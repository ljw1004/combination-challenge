import type {Diagnostic, Story} from '../story/types.ts';

export interface StoryIconMeasurement { url: string; width: number; height: number }

/** The same rule consumes browser-decoded dimensions in CLI and live authoring. */
export function storyIconDiagnostics(story: Story, measurements: readonly StoryIconMeasurement[] = []): Diagnostic[] {
  const images = story.titleImages ?? [];
  const diagnostic = (code: string, message: string, source = story.source): Diagnostic => ({
    severity: 'error', code, message, source, span: source.span ?? {from: 0, to: 0}, stage: 'fast',
  });
  if (!images.length) return [diagnostic('missing-story-icon', 'Include a square Markdown image in the story heading: # ![description](icon.png) Title.')];
  return images.flatMap(image => {
    const size = measurements.find(size => size.url === image.url);
    if (!size) return [];
    if (!size.width || !size.height) return [diagnostic('story-icon-image', `Cannot decode story icon: ${image.url}`, image.source)];
    return size.width === size.height ? [] : [diagnostic('story-icon-square', `Story icons must be square; ${image.url} is ${size.width} × ${size.height} pixels. Any square resolution is allowed.`, image.source)];
  });
}
